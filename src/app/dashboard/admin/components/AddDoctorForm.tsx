'use client';

import { createDoctor } from '@/app/actions/admin';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';
import { Plus, Stethoscope } from 'lucide-react';

export default function AddDoctorForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [msg, setMsg] = useState('');

    async function clientAction(formData: FormData) {
        setMsg('');
        const res = await createDoctor(formData);
        if (res?.error) {
            setMsg(res.error);
        } else {
            setMsg('Doctor created successfully!');
            setIsOpen(false);
        }
    }

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white shadow-md py-6 text-lg font-bold flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1"
            >
                <Plus size={24} /> Register New Doctor
            </Button>
        );
    }

    return (
        <Card className="p-6 bg-white border-2 border-teal-500 shadow-xl animate-in zoom-in-95 duration-200">
            <h3 className="font-bold mb-4 text-xl flex items-center gap-2 text-teal-700">
                <Plus className="bg-teal-100 rounded-full p-1" size={28} /> Register New Doctor
            </h3>
            <form action={clientAction} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500">Full Name</label>
                        <input name="name" placeholder="Dr. Smith" required className="w-full p-3 border rounded bg-slate-50 text-slate-900 font-medium" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500">Login Email</label>
                        <input name="email" type="email" placeholder="doctor@hospital.com" required className="w-full p-3 border rounded bg-slate-50" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500">Login Password</label>
                        <input name="password" type="password" placeholder="******" required className="w-full p-3 border rounded bg-slate-50" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500">Specialization</label>
                            <input name="specialization" placeholder="e.g. Cardiology" className="w-full p-3 border rounded bg-slate-50" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500">Hospital/Wing</label>
                            <input name="hospital" placeholder="Main Wing" className="w-full p-3 border rounded bg-slate-50" />
                        </div>
                    </div>
                </div>

                {msg && <p className={`text-sm font-bold ${msg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}

                <div className="flex gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="flex-1">Cancel</Button>
                    <Button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold">Create Account</Button>
                </div>
            </form>
        </Card>
    );
}
