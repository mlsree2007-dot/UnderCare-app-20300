export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import VitalsEntryButtons from './components/VitalsEntryButtons';
import { VitalsChart } from '@/components/charts/VitalsChart';
import { ShieldCheck, AlertTriangle, Phone, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function PatientDashboard() {
    // 1. Get Session
    const session = await getSession();
    if (!session || !session.user) {
        redirect('/login');
    }

    // 2. Find Patient Profile linked to this User ID
    const patient = await prisma.patientProfile.findUnique({
        where: { userId: session.user.id },
        include: {
            vitals: { orderBy: { recordedAt: 'desc' } },
            doctor: { include: { user: true } }
        }
    });

    if (!patient) {
        return (
            <div className="p-12 text-center text-slate-500">
                <h2 className="text-xl font-bold text-slate-900 mb-2">No Patient Record Found</h2>
                <p>It seems this account is not linked to a patient profile.</p>
            </div>
        )
    }

    if (!patient) return <div className="p-8">No patient records found. Please seed the database.</div>;

    const currentRisk = patient.riskLevel;
    const isHigh = currentRisk >= 2;
    const riskColor = isHigh ? 'text-red-600' : currentRisk === 1 ? 'text-yellow-600' : 'text-green-600';
    const riskBg = isHigh ? 'bg-red-50 border-red-200' : currentRisk === 1 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200';

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in">

            {/* Welcome & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Hello, {patient.name}</h1>
                    <p className="text-slate-500">Here is your current health overview.</p>

                    <div className="mt-6 flex items-center gap-4">
                        <Card className="p-4 flex items-center gap-3 bg-white border shadow-sm">
                            <Calendar className="text-[var(--primary)]" />
                            <div>
                                <div className="text-xs text-slate-500">Last Check-up</div>
                                <div className="font-semibold">{patient.vitals[0] ? new Date(patient.vitals[0].recordedAt).toLocaleDateString() : 'N/A'}</div>
                            </div>
                        </Card>
                        {patient.doctor && (
                            <Card className="p-4 flex items-center gap-3 bg-white border shadow-sm">
                                <Phone className="text-[var(--primary)]" />
                                <div>
                                    <div className="text-xs text-slate-500">Doctor Contact</div>
                                    <div className="font-semibold">{patient.doctor.user.name}</div>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>

                <Card className={cn("p-6 flex flex-col justify-center items-center text-center border-2", riskBg)}>
                    {isHigh ? (
                        <AlertTriangle size={48} className="text-red-500 mb-2" />
                    ) : (
                        <ShieldCheck size={48} className="text-green-500 mb-2" />
                    )}
                    <div className="text-sm font-bold uppercase tracking-widest text-slate-500">Current Status</div>
                    <div className={cn("text-3xl font-black my-1", riskColor)}>
                        {isHigh ? "REQUIRES ATTENTION" : currentRisk === 1 ? "MONITORING" : "STABLE"}
                    </div>
                    <p className="text-sm text-slate-600 max-w-xs">
                        {isHigh
                            ? "Your last assessment indicated high risk. Please follow your doctor's instructions."
                            : "Your vitals are within an acceptable range."}
                    </p>
                </Card>
            </div>

            {/* Manual Vitals Entry Buttons */}
            <div>
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <VitalsEntryButtons />
            </div>

            {/* Charts */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold">Your Vital Trends</h2>
                <VitalsChart data={patient.vitals} />
            </div>

            {/* Recent History List - Simplified for Patient */}
            <Card>
                <div className="p-4 border-b font-semibold">Recent Assessments</div>
                <div className="divide-y">
                    {patient.vitals.slice(0, 5).map((v) => (
                        <div key={v.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                            <div className="text-sm">
                                <span className="font-medium text-slate-900">{new Date(v.recordedAt).toLocaleString()}</span>
                                <span className="text-slate-500 mx-2">•</span>
                                <span>Recorded by {v.recordedBy}</span>
                            </div>
                            <div className="flex gap-4 text-sm font-mono">
                                <span className={v.systolicBP <= 100 ? "text-red-600 font-bold" : ""}>BP: {v.systolicBP}</span>
                                <span className={v.respiratoryRate >= 22 ? "text-red-600 font-bold" : ""}>RR: {v.respiratoryRate}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}
