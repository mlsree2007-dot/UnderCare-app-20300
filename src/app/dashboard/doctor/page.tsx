export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Activity, Users, AlertTriangle, CheckSquare } from 'lucide-react';
import ClientPatientList from './components/ClientPatientList';

export default async function DoctorDashboard() {
    const session = await getSession();
    if (!session || session.user.role !== 'DOCTOR') {
        redirect('/login');
    }

    // Find the DoctorProfile for this user
    const doctorProfile = await prisma.doctorProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!doctorProfile) {
        return <div className="p-8">Doctor profile not found. Please contact admin.</div>;
    }

    // Fetch patients assigned to THIS doctor
    const patients = await prisma.patientProfile.findMany({
        where: { doctorId: doctorProfile.id },
        include: {
            vitals: { orderBy: { recordedAt: 'desc' }, take: 1 },
            alerts: { where: { isResolved: false }, orderBy: { createdAt: 'desc' } }
        },
        orderBy: { riskLevel: 'desc' }
    });

    const highRisk = patients.filter(p => p.riskLevel >= 2).length;
    const modRisk = patients.filter(p => p.riskLevel === 1).length;
    const lowRisk = patients.filter(p => p.riskLevel === 0).length;

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Patients" value={patients.length} icon={<Users />} color="text-slate-600" />
                <StatCard title="High Risk" value={highRisk} icon={<AlertTriangle />} color="text-[var(--risk-high)]" bg="bg-red-50" />
                <StatCard title="Moderate Risk" value={modRisk} icon={<Activity />} color="text-[var(--risk-mod)]" bg="bg-yellow-50" />
                <StatCard title="Low Risk" value={lowRisk} icon={<CheckSquare />} color="text-[var(--risk-low)]" bg="bg-green-50" />
            </div>

            {/* Main Content Areas */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold">Patient Monitoring</h2>
                {/* Client Component to handle Tabs & Interaction */}
                <ClientPatientList initialPatients={patients} />
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, bg }: any) {
    return (
        <Card className={`flex items-center gap-4 p-4 ${bg || 'bg-white'}`}>
            <div className={`p-3 rounded-full bg-white ${color} shadow-sm`}>{icon}</div>
            <div>
                <p className="text-sm font-medium text-[var(--muted)]">{title}</p>
                <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
            </div>
        </Card>
    )
}
