'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowRight, AlertTriangle, CheckCircle, Hospital, ArrowLeft, Activity, User, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EmergencyPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        sbp: '',
        resp: '',
        mental: 'ALERT', // ALERT, VERBAL, PAIN, UNRESPONSIVE
        patientName: '',
        guardianContact: '',
        hospitalId: ''
    });

    const update = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));

    const calculateScore = () => {
        let score = 0;
        const sbp = parseInt(formData.sbp) || 0;
        const resp = parseInt(formData.resp) || 0;

        // qSOFA Rules:
        // SBP <= 100 mmHg
        if (sbp > 0 && sbp <= 100) score++;
        // RR >= 22 breaths/min
        if (resp >= 22) score++;
        // Altered mental status
        if (formData.mental !== 'ALERT') score++;

        return score;
    };

    const score = calculateScore();
    const isHighRisk = score >= 2;
    const isModRisk = score === 1;
    const riskLevel = isHighRisk ? 'HIGH' : isModRisk ? 'MODERATE' : 'LOW';
    const riskColor = isHighRisk ? 'text-[var(--risk-high)]' : isModRisk ? 'text-[var(--risk-mod)]' : 'text-[var(--risk-low)]';

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setLoading(true);
        // Simulate API Call
        await new Promise(r => setTimeout(r, 1500));
        setStep(4);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Simple Header */}
            <header className="bg-white border-b h-16 flex items-center px-6 justify-between">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[var(--primary)]">
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>
                <div className="flex items-center gap-2 font-mono text-sm px-3 py-1 bg-slate-100 rounded">
                    STEP {step} OF 4
                </div>
            </header>

            <main className="flex-1 container max-w-2xl py-8">
                <Card className="p-8 shadow-lg border-t-4 border-t-[var(--primary)]">

                    {/* STEP 1: ASSESSMENT */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-3 text-[var(--primary)] mb-4">
                                <Activity size={32} />
                                <h2 className="text-2xl font-bold">qSOFA Assessment</h2>
                            </div>
                            <p className="text-[var(--muted)]">Please enter the patient's current vital signs.</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Systolic Blood Pressure (mmHg)</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 border rounded text-lg focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                                        placeholder="e.g. 120"
                                        value={formData.sbp}
                                        onChange={(e) => update('sbp', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Respiratory Rate (breaths/min)</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 border rounded text-lg focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                                        placeholder="e.g. 16"
                                        value={formData.resp}
                                        onChange={(e) => update('resp', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Mental Status</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['ALERT', 'VERBAL', 'PAIN', 'UNRESPONSIVE'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => update('mental', status)}
                                                className={cn(
                                                    "p-3 rounded border text-sm font-medium transition-all",
                                                    formData.mental === status
                                                        ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                                                        : "hover:bg-slate-50 border-slate-200"
                                                )}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Button
                                disabled={!formData.sbp || !formData.resp}
                                onClick={handleNext}
                                className="w-full mt-6"
                                size="lg"
                            >
                                Calculate Risk <ArrowRight className="ml-2" size={20} />
                            </Button>
                        </div>
                    )}

                    {/* STEP 2: SCORE DISPLAY */}
                    {step === 2 && (
                        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
                            <h2 className="text-2xl font-bold">Assessment Result</h2>

                            <div className={cn("p-6 rounded-lg border-2",
                                isHighRisk ? "bg-red-50 border-red-200" : isModRisk ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"
                            )}>
                                <div className="text-sm font-semibold text-[var(--muted)] uppercase tracking-widest">qSOFA Score</div>
                                <div className={cn("text-6xl font-black my-2", riskColor)}>
                                    {score} <span className="text-2xl text-[var(--muted)] font-normal">/ 3</span>
                                </div>
                                <div className={cn("text-xl font-bold flex items-center justify-center gap-2", riskColor)}>
                                    {isHighRisk && <ShieldAlert size={24} />}
                                    {riskLevel} RISK DETECTED
                                </div>
                            </div>

                            <p className="text-[var(--muted)] text-left bg-slate-50 p-4 rounded text-sm">
                                {isHighRisk
                                    ? "CRITICAL: Score ≥ 2 indicates high risk of sepsis or organ dysfunction. Immediate medical attention is recommended."
                                    : "Moderate/Low score does not rule out sepsis. Monitor closely and repeat if condition changes."}
                            </p>

                            <div className="flex gap-4 pt-4">
                                <Button variant="outline" onClick={handleBack}>Back</Button>
                                <Button variant={isHighRisk ? "danger" : "primary"} className="flex-1" onClick={handleNext}>
                                    Find Nearest Hospital <ArrowRight className="ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: CONTEXT & HOSPITAL */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Hospital className="text-[var(--primary)]" /> Select Hospital
                            </h2>
                            <p className="text-[var(--muted)]">Send this alert to a nearby facility for rapid admission.</p>

                            <div className="space-y-3">
                                {/* Mock Hospitals */}
                                {['Central City Hospital (0.8 mi)', 'St. Mary’s Trauma Center (2.1 mi)', 'General Medical Plaza (4.5 mi)'].map((h, i) => (
                                    <div
                                        key={i}
                                        onClick={() => update('hospitalId', h)}
                                        className={cn("p-4 border rounded cursor-pointer hover:border-[var(--primary)] flex justify-between items-center",
                                            formData.hospitalId === h ? "border-[var(--primary)] bg-[var(--primary-light)]" : ""
                                        )}
                                    >
                                        <div className="font-semibold">{h}</div>
                                        {formData.hospitalId === h && <CheckCircle size={20} className="text-[var(--primary)]" />}
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-4">
                                <h3 className="font-semibold flex items-center gap-2"><User size={20} /> Patient Details (Optional)</h3>
                                <input
                                    className="w-full p-2 border rounded"
                                    placeholder="Patient Name"
                                    value={formData.patientName}
                                    onChange={e => update('patientName', e.target.value)}
                                />
                                <input
                                    className="w-full p-2 border rounded"
                                    placeholder="Guardian Contact #"
                                    value={formData.guardianContact}
                                    onChange={e => update('guardianContact', e.target.value)}
                                />
                            </div>

                            <Button
                                className="w-full"
                                variant={isHighRisk ? "danger" : "primary"}
                                size="lg"
                                disabled={!formData.hospitalId || loading}
                                onClick={handleSubmit}
                            >
                                {loading ? "Sending Alert..." : "CONFIRM & SEND ALERT"}
                            </Button>
                        </div>
                    )}

                    {/* STEP 4: SUCCESS */}
                    {step === 4 && (
                        <div className="text-center py-8 space-y-6">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 text-green-600 rounded-full mb-4">
                                <CheckCircle size={48} />
                            </div>
                            <h2 className="text-3xl font-bold">Alert Sent Successfully!</h2>
                            <p className="text-lg text-[var(--muted)]">
                                The emergency team at <span className="font-bold text-black">{formData.hospitalId}</span> has been notified.
                            </p>

                            {isHighRisk && (
                                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded text-left">
                                    <strong>Next Steps:</strong>
                                    <ul className="list-disc pl-5 mt-2 space-y-1">
                                        <li>Keep the patient comfortable and lying down.</li>
                                        <li>Do not give food or drink.</li>
                                        <li>Monitor breathing and consciousness.</li>
                                        <li>Proceed to the hospital immediately.</li>
                                    </ul>
                                </div>
                            )}

                            <div className="pt-8">
                                <Link href="/">
                                    <Button variant="outline">Return Home</Button>
                                </Link>
                            </div>
                        </div>
                    )}

                </Card>
                <p className="text-center text-xs text-[var(--muted)] mt-8">
                    Disclaimer: This is an automated assessment tool. It does not replace professional medical advice.
                </p>
            </main>
        </div>
    );
}
