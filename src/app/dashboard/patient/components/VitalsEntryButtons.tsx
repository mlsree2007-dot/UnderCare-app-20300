'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Activity, Wind, Brain, Plus, X, Save } from 'lucide-react';
import { recordVitals } from '@/app/actions/patient';

export default function VitalsEntryButtons() {
    const [isOpen, setIsOpen] = useState(false);
    const [focusField, setFocusField] = useState<string | null>(null);
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const openForm = (field: string) => {
        setFocusField(field);
        setIsOpen(true);
        setMsg('');
    };

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        setMsg('');
        const res = await recordVitals(formData);
        if (res?.error) {
            setMsg(res.error);
        } else {
            setMsg('Vitals recorded successfully!');
            setTimeout(() => setIsOpen(false), 1500);
        }
        setLoading(false);
    };

    if (isOpen) {
        return (
            <Card className="p-6 border-2 border-teal-500 shadow-xl bg-white animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-teal-800 flex items-center gap-2">
                        <Activity className="text-teal-600" /> Record New Vitals
                    </h3>
                    <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X />
                    </button>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className={`space-y-2 p-4 rounded-xl transition-colors ${focusField === 'bp' ? 'bg-red-50 border border-red-100' : 'bg-slate-50'}`}>
                            <label className="font-bold text-sm text-slate-700 flex items-center gap-2">
                                <Activity size={16} className="text-red-500" /> Blood Pressure
                            </label>
                            <div className="flex items-center gap-2">
                                <input autoFocus={focusField === 'bp'} name="systolicBP" type="number" placeholder="120" required className="w-full text-2xl font-black p-2 bg-transparent border-b-2 border-slate-300 focus:border-red-500 outline-none" />
                                <span className="text-xs font-bold text-slate-400">mmHg</span>
                            </div>
                        </div>

                        <div className={`space-y-2 p-4 rounded-xl transition-colors ${focusField === 'rr' ? 'bg-blue-50 border border-blue-100' : 'bg-slate-50'}`}>
                            <label className="font-bold text-sm text-slate-700 flex items-center gap-2">
                                <Wind size={16} className="text-blue-500" /> Respiratory Rate
                            </label>
                            <div className="flex items-center gap-2">
                                <input autoFocus={focusField === 'rr'} name="respiratoryRate" type="number" placeholder="16" required className="w-full text-2xl font-black p-2 bg-transparent border-b-2 border-slate-300 focus:border-blue-500 outline-none" />
                                <span className="text-xs font-bold text-slate-400">/min</span>
                            </div>
                        </div>

                        <div className={`space-y-2 p-4 rounded-xl transition-colors ${focusField === 'ms' ? 'bg-purple-50 border border-purple-100' : 'bg-slate-50'}`}>
                            <label className="font-bold text-sm text-slate-700 flex items-center gap-2">
                                <Brain size={16} className="text-purple-500" /> Mental Status
                            </label>
                            <select autoFocus={focusField === 'ms'} name="mentalStatus" className="w-full text-lg font-medium p-2 bg-transparent border-b-2 border-slate-300 focus:border-purple-500 outline-none">
                                <option value="ALERT">Alert (Normal)</option>
                                <option value="VERBAL">Verbal (Confused)</option>
                                <option value="PAIN">Pain Response</option>
                                <option value="UNRESPONSIVE">Unresponsive</option>
                            </select>
                        </div>
                    </div>

                    {msg && (
                        <div className={`p-3 rounded-lg text-center font-bold text-sm ${msg.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {msg}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white min-w-[150px] shadow-lg">
                            {loading ? 'Saving...' : 'Save Record'} <Save size={18} className="ml-2" />
                        </Button>
                    </div>
                </form>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
                onClick={() => openForm('bp')}
                className="group flex flex-col items-center justify-center p-6 bg-white border-2 border-slate-100 hover:border-red-200 hover:bg-red-50 rounded-2xl transition-all shadow-sm hover:shadow-md"
            >
                <div className="p-3 bg-red-100 text-red-600 rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <Activity size={24} />
                </div>
                <div className="font-bold text-slate-700 group-hover:text-red-700">Add Blood Pressure</div>
                <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Manual Entry</div>
            </button>

            <button
                onClick={() => openForm('rr')}
                className="group flex flex-col items-center justify-center p-6 bg-white border-2 border-slate-100 hover:border-blue-200 hover:bg-blue-50 rounded-2xl transition-all shadow-sm hover:shadow-md"
            >
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <Wind size={24} />
                </div>
                <div className="font-bold text-slate-700 group-hover:text-blue-700">Add Resp. Rate</div>
                <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Manual Entry</div>
            </button>

            <button
                onClick={() => openForm('ms')}
                className="group flex flex-col items-center justify-center p-6 bg-white border-2 border-slate-100 hover:border-purple-200 hover:bg-purple-50 rounded-2xl transition-all shadow-sm hover:shadow-md"
            >
                <div className="p-3 bg-purple-100 text-purple-600 rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <Brain size={24} />
                </div>
                <div className="font-bold text-slate-700 group-hover:text-purple-700">Add Mental Status</div>
                <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Manual Entry</div>
            </button>
        </div>
    );
}
