'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ChevronRight, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { markPatientReviewed } from '@/app/actions/doctor';

interface PatientListProps {
    initialPatients: any[];
}

export default function ClientPatientList({ initialPatients }: PatientListProps) {
    const router = useRouter();
    const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MODERATE' | 'LOW'>('ALL');
    const [patients, setPatients] = useState(initialPatients);

    // Filter Logic
    const filteredPatients = patients.filter(p => {
        if (filter === 'ALL') return true;
        if (filter === 'HIGH') return p.riskLevel >= 2;
        if (filter === 'MODERATE') return p.riskLevel === 1;
        return p.riskLevel === 0;
    });

    // Toggle Reviewed
    const toggleReviewed = async (id: string) => {
        const res = await markPatientReviewed(id);
        if (res.success) {
            setPatients(prev => prev.map(p => p.id === id ? { ...p, isReviewed: true } : p));
        } else {
            alert(res.error || 'Failed to update patient.');
        }
    };

    // Safe vital getter
    const getLatestVital = (p: any, type: 'bp' | 'rr' | 'mental') => {
        if (!p.vitals || p.vitals.length === 0) return '--';
        const v = p.vitals[0]; // Latest is first
        if (type === 'bp') return v.systolicBP;
        if (type === 'rr') return v.respiratoryRate;
        if (type === 'mental') return v.mentalStatus;
        return '--';
    };

    const getQsofa = (p: any) => {
        if (!p.vitals || p.vitals.length === 0) return 0;
        return p.vitals[0].qSofaScore;
    }

    // Counts for tabs
    const counts = {
        ALL: patients.length,
        HIGH: patients.filter(p => p.riskLevel >= 2).length,
        MODERATE: patients.filter(p => p.riskLevel === 1).length,
        LOW: patients.filter(p => p.riskLevel === 0).length
    };

    return (
        <div className="space-y-6">

            {/* Disclaimer Box from Design */}
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg flex items-start gap-3">
                <Info className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 font-medium leading-relaxed">
                    <strong>Clinical Disclaimer:</strong> qSOFA is a screening tool for sepsis and does not replace full clinical judgment. Scores ≥2 suggest high risk for poor outcomes.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b overflow-x-auto pb-1">
                {[
                    { key: 'ALL', label: 'All Patients', color: 'text-slate-600' },
                    { key: 'HIGH', label: 'High Risk', color: 'text-red-600' },
                    { key: 'MODERATE', label: 'Moderate', color: 'text-amber-600' },
                    { key: 'LOW', label: 'Low Risk', color: 'text-teal-600' }
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key as any)}
                        className={cn(
                            "px-5 py-3 text-sm font-bold transition-all relative whitespace-nowrap",
                            filter === tab.key
                                ? "text-slate-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-teal-500 after:rounded-t-full"
                                : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        {tab.label}
                        <span className={cn("ml-2 px-2 py-0.5 rounded-full text-xs bg-slate-100", filter === tab.key && "bg-slate-900 text-white")}>
                            {counts[tab.key as keyof typeof counts]}
                        </span>
                    </button>
                ))}
            </div>

            {/* List */}
            <Card className="overflow-hidden border-0 shadow-md">
                <div className="min-w-full inline-block align-middle">
                    <div className="border-b bg-slate-50/50 p-4 grid grid-cols-12 text-xs font-bold text-slate-400 uppercase tracking-wider gap-4">
                        <div className="col-span-1 text-center">Score</div>
                        <div className="col-span-4">Patient Details</div>
                        <div className="col-span-4">Vital Signs</div>
                        <div className="col-span-3 text-right">Actions</div>
                    </div>

                    <div className="divide-y">
                        {filteredPatients.map((patient) => {
                            const score = getQsofa(patient);
                            const isCritical = score >= 2;

                            return (
                                <div key={patient.id} className={cn("p-4 grid grid-cols-12 gap-4 items-center hover:bg-slate-50 transition-colors group", patient.isReviewed && "opacity-60 bg-slate-50")}>

                                    {/* Score Circle (Figma Style) */}
                                    <div className="col-span-1 flex justify-center">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-sm border-2",
                                            score >= 2 ? "bg-red-500 text-white border-red-600"
                                                : score === 1 ? "bg-amber-400 text-white border-amber-500"
                                                    : "bg-teal-500 text-white border-teal-600"
                                        )}>
                                            {score}
                                        </div>
                                    </div>

                                    {/* Patient Info */}
                                    <div className="col-span-4">
                                        <div className="font-bold text-slate-900 text-base">{patient.name}</div>
                                        <div className="text-xs text-slate-500">ID: {patient.id.slice(0, 8)}</div>
                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                            <span className="text-xs text-slate-400">{new Date(patient.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            {patient.riskLevel >= 2 && (
                                                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold uppercase">Critical</span>
                                            )}
                                            {patient.alerts && patient.alerts.length > 0 && (
                                                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                                                    <AlertTriangle size={10} /> Alert
                                                </span>
                                            )}
                                        </div>
                                        {patient.alerts && patient.alerts[0] && (
                                            <div className="text-[10px] text-amber-600 font-medium italic mt-1 line-clamp-1 max-w-[200px]">
                                                "{patient.alerts[0].message}"
                                            </div>
                                        )}
                                    </div>

                                    {/* Vitals */}
                                    <div className="col-span-4 flex items-center gap-6">
                                        <div>
                                            <div className="text-[10px] text-slate-400 uppercase font-bold">BP (sys)</div>
                                            <div className={cn("font-mono font-bold text-lg", getLatestVital(patient, 'bp') <= 100 && "text-red-600")}>
                                                {getLatestVital(patient, 'bp')}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-slate-400 uppercase font-bold">Resp Rate</div>
                                            <div className={cn("font-mono font-bold text-lg", getLatestVital(patient, 'rr') >= 22 && "text-red-600")}>
                                                {getLatestVital(patient, 'rr')}
                                            </div>
                                        </div>
                                        <div className="hidden lg:block">
                                            <div className="text-[10px] text-slate-400 uppercase font-bold">Mental</div>
                                            <div className="font-medium text-sm text-slate-600 truncate max-w-[100px]">
                                                {getLatestVital(patient, 'mental')}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-3 flex items-center justify-end gap-3">
                                        <button
                                            onClick={() => toggleReviewed(patient.id)}
                                            className={cn(
                                                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border",
                                                patient.isReviewed
                                                    ? "bg-slate-200 text-slate-500 border-slate-300"
                                                    : "bg-white text-slate-600 border-slate-200 hover:border-teal-500 hover:text-teal-600"
                                            )}
                                        >
                                            <CheckCircle2 size={14} />
                                            {patient.isReviewed ? 'Reviewed' : 'Mark Seen'}
                                        </button>

                                        <Link href={`/dashboard/doctor/patient/${patient.id}`}>
                                            <Button size="sm" className="rounded-full px-4 bg-teal-600 hover:bg-teal-700 shadow-md">
                                                Details <ChevronRight size={14} className="ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}

                        {filteredPatients.length === 0 && (
                            <div className="p-12 text-center text-slate-400 italic">
                                No patients found in this category.
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}
