import { prisma } from '@/lib/prisma';
import AddDoctorForm from '../components/AddDoctorForm';
import DoctorList from '../components/DoctorList';
import { Stethoscope } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default async function AdminDoctorsPage() {
    const doctors = await prisma.user.findMany({
        where: { role: 'DOCTOR' },
        include: { doctorProfile: true }
    });

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-teal-100 text-teal-600 rounded-lg">
                    <Stethoscope />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Doctor Management</h1>
                    <p className="text-slate-500">Register new medical staff and manage existing profiles.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Medical Staff Directory</h2>
                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            Total: {doctors.length}
                        </span>
                    </div>
                    <DoctorList doctors={doctors} />
                </div>
                <div className="space-y-6">
                    <div className="sticky top-24">
                        <AddDoctorForm />
                        <div className="mt-6 p-4 bg-sky-50 rounded-lg text-sm text-sky-800 border border-sky-100">
                            <p className="font-bold mb-1">Tip:</p>
                            Use the Edit (Pencil) icon in the table to quickly update a doctor's specialization or hospital assignment.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
