import { prisma } from '@/lib/prisma';
import ClientPatientList from '../components/ClientPatientList'; // Correct relative import
import { HeartPulse } from 'lucide-react';

export default async function DoctorPatientsPage() {
    // In a real app we'd filter by logged-in doctor ID
    // Demo mode: Fetch all for now or fetch specifics
    const patients = await prisma.patientProfile.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            vitals: {
                orderBy: { recordedAt: 'desc' },
                take: 1
            }
        }
    });

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-teal-100 text-teal-600 rounded-lg">
                    <HeartPulse />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900">My Patients</h1>
                    <p className="text-slate-500">Monitor real-time status and reviews.</p>
                </div>
            </div>

            <ClientPatientList initialPatients={patients} />
        </div>
    )
}
