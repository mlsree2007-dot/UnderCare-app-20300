'use client';

import { assignDoctor } from '@/app/actions/admin';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';
import { UserPlus } from 'lucide-react';

interface Props {
    patients: any[];
    doctors: any[];
}

export default function PatientAssignment({ patients, doctors }: Props) {
    // Determine unassigned patients
    const unassigned = patients.filter(p => !p.doctorId);

    return (
        <Card className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
                <UserPlus size={20} className="text-[var(--primary)]" />
                Pending Assignments
            </h3>

            <div className="space-y-4">
                {unassigned.map(p => (
                    <AssignmentRow key={p.id} patient={p} doctors={doctors} />
                ))}
                {unassigned.length === 0 && (
                    <p className="text-sm text-slate-500 italic">All patients have been assigned.</p>
                )}
            </div>
        </Card>
    );
}

function AssignmentRow({ patient, doctors }: { patient: any, doctors: any[] }) {
    const [selectedDoc, setSelectedDoc] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleAssign() {
        if (!selectedDoc) return;
        setLoading(true);
        await assignDoctor(patient.id, selectedDoc); // Server Action
        setLoading(false);
    }

    return (
        <div className="flex items-center justify-between p-3 border rounded bg-slate-50">
            <div>
                <div className="font-medium">{patient.name}</div>
                <div className="text-xs text-slate-500">Risk Level: {patient.riskLevel}</div>
            </div>
            <div className="flex gap-2">
                <select
                    className="p-2 border rounded text-sm w-48"
                    value={selectedDoc}
                    onChange={e => setSelectedDoc(e.target.value)}
                >
                    <option value="">Select Doctor...</option>
                    {doctors.map(d => (
                        // Use d.doctorProfile.id for relation
                        <option key={d.id} value={d.doctorProfile.id}>
                            {d.name} ({d.doctorProfile.specialization})
                        </option>
                    ))}
                </select>
                <Button size="sm" disabled={!selectedDoc || loading} onClick={handleAssign}>
                    Assign
                </Button>
            </div>
        </div>
    )
}
