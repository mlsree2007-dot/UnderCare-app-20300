export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Phone, MapPin, AlertTriangle, ShieldCheck, Activity, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { VitalsChart } from '@/components/charts/VitalsChart';
import { cn } from '@/lib/utils';
import { markPatientReviewed } from '@/app/actions/doctor';
import { getSession } from '@/lib/auth';

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session || (session.user.role !== 'DOCTOR' && session.user.role !== 'ADMIN')) {
        redirect('/login');
    }

    const patient = await prisma.patientProfile.findUnique({
        where: { id: params.id },
        include: { vitals: { orderBy: { recordedAt: 'desc' } } }
    });

    if (!patient) return notFound();

    async function reviewAction() {
        'use server';
        await markPatientReviewed(params.id);
    }

    if (!patient) return notFound();

    const currentRisk = patient.riskLevel;
    const isHigh = currentRisk >= 2;
    const riskColor = isHigh ? 'text-red-600' : currentRisk === 1 ? 'text-yellow-600' : 'text-green-600';
    const riskBg = isHigh ? 'bg-red-50 border-red-200' : currentRisk === 1 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200';

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <Link href="/dashboard/doctor" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--primary)] flex items-center gap-1 mb-2">
                        <ArrowLeft size={16} /> Back to List
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900">{patient.name}</h1>
                    <div className="flex items-center gap-4 text-slate-500 mt-1">
                        <span className="flex items-center gap-1 text-sm"><User size={14} /> ID: {patient.id.slice(0, 8)}</span>
                        <span className="flex items-center gap-1 text-sm"><MapPin size={14} /> {patient.address || 'No address'}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {!patient.isReviewed && (
                        <form action={reviewAction}>
                            <Button className="bg-white text-teal-600 border-teal-600 hover:bg-teal-50">
                                <CheckSquare size={18} className="mr-2" /> Mark as Reviewed
                            </Button>
                        </form>
                    )}
                    <div className={cn("px-6 py-3 rounded-lg border flex items-center gap-3", riskBg)}>
                        {isHigh ? <AlertTriangle className="text-red-600" /> : <ShieldCheck className="text-green-600" />}
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Status</div>
                            <div className={cn("text-xl font-black", riskColor)}>
                                {isHigh ? 'HIGH RISK' : currentRisk === 1 ? 'MODERATE RISK' : 'LOW RISK'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vitals Charts */}
            <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Activity className="text-[var(--primary)]" /> Real-time Vitals History
                </h2>
                <VitalsChart data={patient.vitals} />
            </div>

            {/* Vitals Table History */}
            <Card className="overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b font-semibold text-slate-700">Detailed Log</div>
                <table className="w-full text-left text-sm">
                    <thead className="text-slate-500 border-b">
                        <tr>
                            <th className="p-4">Time</th>
                            <th className="p-4">Systolic BP</th>
                            <th className="p-4">Resp Rate</th>
                            <th className="p-4">Mental Status</th>
                            <th className="p-4">qSOFA Score</th>
                            <th className="p-4">Recorder</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {patient.vitals.map(v => (
                            <tr key={v.id} className="hover:bg-slate-50">
                                <td className="p-4 font-mono">{new Date(v.recordedAt).toLocaleString()}</td>
                                <td className={cn("p-4 font-medium", v.systolicBP <= 100 && "text-red-600")}>{v.systolicBP}</td>
                                <td className={cn("p-4 font-medium", v.respiratoryRate >= 22 && "text-red-600")}>{v.respiratoryRate}</td>
                                <td className="p-4">{v.mentalStatus}</td>
                                <td className="p-4">
                                    <span className={cn("px-2 py-1 rounded font-bold text-xs",
                                        v.qSofaScore >= 2 ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"
                                    )}>
                                        {v.qSofaScore}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-500 italic">{v.recordedBy}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

        </div>
    )
}
