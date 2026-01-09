import { prisma } from '@/lib/prisma';
import PatientRegistrationForm from '../components/PatientRegistrationForm';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronRight, Filter } from 'lucide-react';

export default async function AdminPatientsPage() {
    const patients = await prisma.patientProfile.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            doctor: true
        }
    });

    const doctors = await prisma.user.findMany({
        where: { role: 'DOCTOR' },
        include: { doctorProfile: true }
    });

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Patient Registry</h1>
                    <p className="text-slate-500">Manage all registered patients and admissions.</p>
                </div>
                {/* Link back to dashboard for quick access */}
                <Link href="/dashboard/admin?tab=register">
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg">
                        Register New Patient
                    </Button>
                </Link>
            </div>

            <Card className="overflow-hidden shadow-md border-0">
                <div className="p-4 bg-slate-50 border-b flex items-center justify-between">
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                        <Filter size={14} /> Total Records: {patients.length}
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-white border-b text-slate-500 text-sm">
                        <tr>
                            <th className="p-4 font-medium">Name / ID</th>
                            <th className="p-4 font-medium">Risk Status</th>
                            <th className="p-4 font-medium">Assigned Doctor</th>
                            <th className="p-4 font-medium">Guardian</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                        {patients.map((p: any) => (
                            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-slate-900">{p.name}</div>
                                    <div className="text-xs text-slate-400 font-mono">{p.id.slice(0, 8)}</div>
                                </td>
                                <td className="p-4">
                                    {p.riskLevel >= 2 ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            High Risk
                                        </span>
                                    ) : p.riskLevel === 1 ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Moderate
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Stable
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-slate-600">
                                    {p.doctor ? p.doctor.specialization : <span className="text-slate-400 italic">Unassigned</span>}
                                </td>
                                <td className="p-4 text-slate-600">
                                    {p.guardianName || '-'}
                                </td>
                                <td className="p-4 text-right">
                                    {/* Only doctors see medical details usually, but admins might need view */}
                                    <Button size="sm" variant="ghost" className="text-teal-600 hover:text-teal-700">
                                        Edit <ChevronRight size={14} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {patients.length === 0 && (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-400">No patients found.</td></tr>
                        )}
                    </tbody>
                </table>
            </Card>

            {/* Registration Form Embed (Optional convenience) */}
            <div className="pt-8 border-t">
                <h2 className="text-xl font-bold mb-4 text-slate-900">Quick Registration</h2>
                <PatientRegistrationForm doctors={doctors} />
            </div>
        </div>
    );
}
