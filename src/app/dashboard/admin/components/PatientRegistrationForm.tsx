'use client';

import { registerPatient } from '@/app/actions/admin';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';
import { UserPlus, ArrowRight, Lock, User, Mail, Shield, Activity } from 'lucide-react';

export default function PatientRegistrationForm({ doctors }: { doctors: any[] }) {
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    async function clientAction(formData: FormData) {
        setLoading(true);
        setMsg('');
        const res = await registerPatient(formData);
        if (res?.error) {
            setMsg(res.error);
        } else {
            setMsg('Success! Patient and Guardian accounts created.');
            // Ideally reset form here
        }
        setLoading(false);
    }

    return (
        <Card className="p-8 border-0 shadow-lg">
            <h3 className="font-bold mb-8 flex items-center gap-3 text-2xl text-slate-900">
                <div className="p-2 bg-teal-100 text-teal-600 rounded-lg"><UserPlus /></div>
                New Patient Admission
            </h3>

            <form action={clientAction} className="space-y-8">

                {/* Section 1: Patient Login & Basic Info */}
                <div className="space-y-4">
                    <h4 className="flex items-center gap-2 font-bold text-teal-600 uppercase tracking-widest text-xs border-b pb-2">
                        <User size={14} /> Patient Information & Login
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                            <input name="name" required className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-teal-500 outline-none transition-all" placeholder="John Doe" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Date of Birth</label>
                            <input name="dob" type="date" required className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-teal-500 outline-none transition-all" />
                        </div>
                        <div className="col-span-2 space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Address</label>
                            <input name="address" className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-teal-500 outline-none transition-all" placeholder="123 Main St" />
                        </div>

                        <div className="space-y-1 relative">
                            <label className="text-xs font-bold text-slate-900 uppercase flex items-center gap-1"><Mail size={12} /> Login Email</label>
                            <input name="patientEmail" type="email" required className="w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="patient@undercare.com" />
                        </div>
                        <div className="space-y-1 relative">
                            <label className="text-xs font-bold text-slate-900 uppercase flex items-center gap-1"><Lock size={12} /> Login Password</label>
                            <input name="patientPassword" type="password" required className="w-full p-3 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="******" />
                        </div>
                    </div>
                </div>

                {/* Section 2: Guardian Login & Info */}
                <div className="space-y-4 pt-4">
                    <h4 className="flex items-center gap-2 font-bold text-teal-600 uppercase tracking-widest text-xs border-b pb-2">
                        <Shield size={14} /> Guardian Information & Login
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Guardian Name</label>
                            <input name="guardianName" required className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-teal-500 outline-none transition-all" placeholder="Jane Doe" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Contact Phone</label>
                            <input name="guardianContact" required className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-teal-500 outline-none transition-all" placeholder="+1 555-0123" />
                        </div>
                        <div className="space-y-1 relative">
                            <label className="text-xs font-bold text-slate-900 uppercase flex items-center gap-1"><Mail size={12} /> Login Email</label>
                            <input name="guardianEmail" type="email" required className="w-full p-3 border rounded-lg bg-amber-50 focus:ring-2 focus:ring-amber-500 outline-none transition-all" placeholder="guardian@undercare.com" />
                        </div>
                        <div className="space-y-1 relative">
                            <label className="text-xs font-bold text-slate-900 uppercase flex items-center gap-1"><Lock size={12} /> Login Password</label>
                            <input name="guardianPassword" type="password" required className="w-full p-3 border rounded-lg bg-amber-50 focus:ring-2 focus:ring-amber-500 outline-none transition-all" placeholder="******" />
                        </div>
                    </div>
                </div>

                {/* Section 3: Clinical Assignment */}
                <div className="space-y-4 pt-4">
                    <h4 className="flex items-center gap-2 font-bold text-teal-600 uppercase tracking-widest text-xs border-b pb-2">
                        <Activity size={14} /> Clinical Assignment
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Assigned Doctor</label>
                            <select
                                name="doctorId"
                                required
                                className="w-full p-3 border rounded-lg bg-teal-50 focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium text-slate-700"
                            >
                                <option value="">Select a practitioner</option>
                                {doctors.map(doc => (
                                    <option key={doc.id} value={doc.doctorProfile?.id}>
                                        Dr. {doc.name} ({doc.doctorProfile?.specialization || 'General'})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {msg && (
                    <div className={`p-4 rounded-lg font-bold text-center ${msg.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {msg}
                    </div>
                )}

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white shadow-xl px-10 py-4 h-auto text-lg w-full md:w-auto">
                        {loading ? 'Processing...' : 'Create Accounts & Admit'} <ArrowRight size={20} className="ml-2" />
                    </Button>
                </div>
            </form>
        </Card>
    );
}
