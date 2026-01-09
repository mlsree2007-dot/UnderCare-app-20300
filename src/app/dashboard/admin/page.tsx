export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import AddDoctorForm from './components/AddDoctorForm';
import DoctorList from './components/DoctorList';
import PatientAssignment from './components/PatientAssignment';
import PatientRegistrationForm from './components/PatientRegistrationForm';
import { Users, UserPlus, Activity, BedDouble } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default async function AdminDashboard(props: { searchParams: Promise<{ tab?: string }> }) {
    const searchParams = await props.searchParams;
    const tab = searchParams.tab || 'overview';

    // 1. Fetch Doctors
    const doctors = await prisma.user.findMany({
        where: { role: 'DOCTOR' },
        include: { doctorProfile: true }
    });

    // 2. Fetch Patients
    const patients = await prisma.patientProfile.findMany({
        orderBy: { createdAt: 'desc' }
    });

    const unassignedCount = patients.filter((p: any) => !p.doctorId).length;
    const highRiskCount = patients.filter((p: any) => p.riskLevel >= 2).length;

    return (
        <div className="space-y-8 animate-in fade-in">

            {/* Admin Navigation Tabs */}
            <div className="flex border-b gap-8 text-sm font-medium text-slate-500 overflow-x-auto">
                <Link href="?tab=overview" scroll={false} className={`pb-3 border-b-2 px-1 hover:text-teal-600 transition-colors ${tab === 'overview' ? 'border-teal-500 text-teal-700' : 'border-transparent'}`}>
                    Hospital Overview
                </Link>
                <Link href="?tab=doctors" scroll={false} className={`pb-3 border-b-2 px-1 hover:text-teal-600 transition-colors ${tab === 'doctors' ? 'border-teal-500 text-teal-700' : 'border-transparent text-slate-500'}`}>
                    Doctor Management
                </Link>
                <Link href="?tab=register" scroll={false} className={`pb-3 border-b-2 px-1 hover:text-teal-600 transition-colors ${tab === 'register' ? 'border-teal-500 text-teal-700' : 'border-transparent text-slate-500'}`}>
                    Patient Admission
                </Link>
            </div>

            {tab === 'overview' && (
                <div className="space-y-8">
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Users /></div>
                            <div>
                                <div className="text-2xl font-black text-slate-900">{doctors.length}</div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Doctors</div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><Activity /></div>
                            <div>
                                <div className="text-2xl font-black text-slate-900">{patients.length}</div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Patients</div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><UserPlus /></div>
                            <div>
                                <div className="text-2xl font-black text-slate-900">{unassignedCount}</div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Unassigned</div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-red-100 text-red-600 rounded-xl"><BedDouble /></div>
                            <div>
                                <div className="text-2xl font-black text-slate-900">{highRiskCount}</div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Critical Cases</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Activity className="text-teal-500" /> Recent Admissions
                            </h2>
                            {/* Simple List for Overview */}
                            <Card className="divide-y overflow-hidden">
                                {patients.slice(0, 5).map(p => (
                                    <div key={p.id} className="p-4 flex justify-between items-center text-sm">
                                        <span className="font-medium">{p.name}</span>
                                        <span className={p.riskLevel >= 2 ? "text-red-500 font-bold" : "text-green-500"}>
                                            Score: {p.riskLevel === 0 ? '-' : 'Recorded'}
                                        </span>
                                    </div>
                                ))}
                                {patients.length === 0 && <div className="p-4 text-slate-400">No patients yet.</div>}
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <UserPlus className="text-teal-500" /> Triage Queue
                            </h2>
                            <PatientAssignment patients={patients} doctors={doctors} />
                        </div>
                    </div>
                </div>
            )}

            {tab === 'doctors' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Medical Staff Directory</h2>
                        </div>
                        <DoctorList doctors={doctors} />
                    </div>
                    <div className="space-y-6">
                        <div className="sticky top-24">
                            <AddDoctorForm />
                            <div className="mt-6 p-4 bg-sky-50 rounded-lg text-sm text-sky-800 border border-sky-100">
                                <p className="font-bold mb-1">Tip:</p>
                                Use the Edit (Pencil) icon in the list to update a doctor's specialization or hospital assignment.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {tab === 'register' && (
                <div className="max-w-3xl mx-auto">
                    <PatientRegistrationForm doctors={doctors} />
                </div>
            )}
        </div>
    );
}
