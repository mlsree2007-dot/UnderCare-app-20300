'use client';
import { useState } from 'react';
import { ChevronDown, ShieldAlert, User, Stethoscope, Lock, HeartPulse, Info } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function GuidelinesPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="container h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-[var(--primary)] text-teal-600">
                        <HeartPulse className="w-8 h-8" />
                        <span>Undercare</span>
                    </Link>
                    <Link href="/">
                        <Button variant="ghost">Back to Home</Button>
                    </Link>
                </div>
            </header>

            <main className="container py-12 max-w-4xl space-y-12 animate-in fade-in">

                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 text-teal-800 font-bold text-sm tracking-wide uppercase">
                        <Info size={16} /> Official Protocol
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900">System Guidelines</h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Comprehensive instructions for using the Undercare Triage System and qSOFA assessment protocols.
                    </p>
                </div>

                {/* qSOFA Explainer */}
                <Card className="p-8 border-l-4 border-l-teal-500 shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                        <ShieldAlert className="text-teal-600" />
                        Understanding qSOFA
                    </h2>
                    <div className="prose prose-slate max-w-none text-slate-600">
                        <p className="lead text-lg mb-4">
                            The <strong>quick Sepsis Related Organ Failure Assessment (qSOFA)</strong> is a bedside prompt that may identify patients with suspected infection who are at greater risk for a poor outcome outside the intensive care unit (ICU).
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                            <div className="bg-slate-50 p-4 rounded-xl border">
                                <div className="font-bold text-slate-900 mb-1"> hypotension</div>
                                <div className="text-sm">Systolic BP ≤ 100 mmHg</div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border">
                                <div className="font-bold text-slate-900 mb-1">Altered Mental Status</div>
                                <div className="text-sm">GCS &lt; 15 (Confusion, etc)</div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border">
                                <div className="font-bold text-slate-900 mb-1">Tachypnea</div>
                                <div className="text-sm">Resp Rate ≥ 22 /min</div>
                            </div>
                        </div>
                        <div className="bg-red-50 text-red-800 p-4 rounded-lg text-sm font-semibold flex gap-3">
                            <Info className="shrink-0" />
                            Note: A qSOFA score ≥ 2 is associated with poor outcomes due to sepsis. This system effectively flags these patients for immediate attention.
                        </div>
                    </div>
                </Card>

                {/* Role-wise Instructions (Accordion) */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-900 px-2">Role-Specific Instructions</h3>

                    <AccordionItem title="For Doctors & Medical Staff" icon={<Stethoscope />} defaultOpen>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600">
                            <li>Log in to the <strong>Doctor Dashboard</strong> to view your patient list.</li>
                            <li>Patients are automatically sorted by risk: <span className="text-red-600 font-bold">Red (Critical)</span>, <span className="text-amber-600 font-bold">Yellow (Monitoring)</span>, and <span className="text-teal-600 font-bold">Green (Stable)</span>.</li>
                            <li>Click <strong>Details</strong> to view real-time charts analysis of BP and Respiratory Rate.</li>
                            <li>Use the <strong>"Mark Seen"</strong> toggle to confirm you have physically attended to the patient.</li>
                        </ul>
                    </AccordionItem>

                    <AccordionItem title="For Hospital Administrators" icon={<User />}>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600">
                            <li>Use the <strong>Overview</strong> tab to monitor hospital capacity and critical case volume.</li>
                            <li>Go to <strong>Doctor Management</strong> to onboard new staff or update existing profiles.</li>
                            <li>Use <strong>Patient Admission</strong> to register walk-in patients manually.</li>
                            <li>Assign doctors to unassigned patients via the <strong>Triage Queue</strong>.</li>
                        </ul>
                    </AccordionItem>

                    <AccordionItem title="For Patients" icon={<HeartPulse />}>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600">
                            <li>You can access the <strong>Emergency Assessment</strong> without logging in.</li>
                            <li>Once registered, log in to your portal to view your health trends.</li>
                            <li>Your dashboard will show your current risk status ("Stable" or "Requires Attention").</li>
                            <li><strong>Note:</strong> You cannot edit your own medial records. Data is read-only for accuracy.</li>
                        </ul>
                    </AccordionItem>

                    <AccordionItem title="For Guardians" icon={<Lock />}>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600">
                            <li>Monitor your assigned ward's status remotely.</li>
                            <li>Receive real-time alerts if the patient's condition escalates to High Risk.</li>
                            <li>View hospital contact information directly on your dashboard.</li>
                        </ul>
                    </AccordionItem>
                </div>

                {/* Safety Disclaimer Footer */}
                <div className="border-t pt-8 text-slate-400 text-sm space-y-4">
                    <h4 className="font-bold uppercase tracking-wider text-slate-500">Legal & Safety Disclaimer</h4>
                    <p>
                        The Undercare System is a clinical decision support tool. It is not intended to replace professional medical judgment, diagnosis, or treatment.
                    </p>
                    <p>
                        <strong>In case of a medical emergency, verify all automated readings with manual checks and follow standard hospital protocols.</strong>
                    </p>
                </div>
            </main>
        </div>
    );
}

function AccordionItem({ title, icon, children, defaultOpen = false }: any) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <Card className="overflow-hidden border-0 shadow-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 bg-white hover:bg-slate-50 transition-colors text-left"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                        {icon}
                    </div>
                    <span className="text-lg font-bold text-slate-900">{title}</span>
                </div>
                <ChevronDown className={cn("text-slate-400 transition-transform duration-300", isOpen && "rotate-180")} />
            </button>
            <div className={cn("grid transition-all duration-300 ease-in-out bg-slate-50/50", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                <div className="overflow-hidden">
                    <div className="p-6 pt-0 border-t border-slate-100">
                        <div className="pt-4">{children}</div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
