'use client';

import { deleteUser, updateDoctor } from '@/app/actions/admin';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Trash2, Stethoscope, Pencil, X, Check } from 'lucide-react';
import { useState } from 'react';

export default function DoctorList({ doctors }: { doctors: any[] }) {

    async function handleDelete(id: string) {
        if (confirm('Are you sure you want to remove this doctor? This cannot be undone.')) {
            await deleteUser(id);
        }
    }

    return (
        <Card className="overflow-hidden">
            <table className="w-full text-left bg-white">
                <thead className="bg-slate-50 border-b">
                    <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Specialization</th>
                        <th className="p-4">Hospital</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {doctors.map((doc) => (
                        <DoctorRow key={doc.id} doc={doc} onDelete={handleDelete} />
                    ))}
                    {doctors.length === 0 && (
                        <tr><td colSpan={4} className="p-8 text-center text-slate-400">No doctors found.</td></tr>
                    )}
                </tbody>
            </table>
        </Card>
    );
}

function DoctorRow({ doc, onDelete }: { doc: any, onDelete: (id: string) => void }) {
    const [isEditing, setIsEditing] = useState(false);
    // Local state for editing form
    const [name, setName] = useState(doc.name);
    const [spec, setSpec] = useState(doc.doctorProfile?.specialization || '');
    const [hosp, setHosp] = useState(doc.doctorProfile?.hospital || '');
    const [loading, setLoading] = useState(false);

    async function handleSave() {
        setLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('specialization', spec);
        formData.append('hospital', hosp);

        await updateDoctor(doc.id, formData);
        setLoading(false);
        setIsEditing(false);
    }

    if (isEditing) {
        return (
            <tr className="bg-blue-50">
                <td className="p-4">
                    <input className="w-full p-2 border rounded text-sm" value={name} onChange={e => setName(e.target.value)} />
                </td>
                <td className="p-4">
                    <input className="w-full p-2 border rounded text-sm" value={spec} onChange={e => setSpec(e.target.value)} />
                </td>
                <td className="p-4">
                    <input className="w-full p-2 border rounded text-sm" value={hosp} onChange={e => setHosp(e.target.value)} />
                </td>
                <td className="p-4 text-right flex items-center justify-end gap-2">
                    <Button size="sm" onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white rounded-full w-8 h-8 p-0">
                        <Check size={16} />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="rounded-full w-8 h-8 p-0 text-slate-500">
                        <X size={16} />
                    </Button>
                </td>
            </tr>
        )
    }

    return (
        <tr className="group hover:bg-slate-50 transition-colors">
            <td className="p-4 flex items-center gap-3 font-medium">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
                    <Stethoscope size={16} />
                </div>
                {doc.name}
            </td>
            <td className="p-4 text-slate-600">{doc.doctorProfile?.specialization}</td>
            <td className="p-4 text-slate-600">{doc.doctorProfile?.hospital}</td>
            <td className="p-4 text-right flex items-center justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:bg-blue-50"
                    onClick={() => setIsEditing(true)}
                >
                    <Pencil size={16} />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => onDelete(doc.id)}
                >
                    <Trash2 size={16} />
                </Button>
            </td>
        </tr>
    )
}
