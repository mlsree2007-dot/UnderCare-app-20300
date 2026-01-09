import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/Card';
import { User, Activity, AlertCircle, Clock, Heart, Wind, Brain } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import GuardianClientNotifications from './components/GuardianClientNotifications';
import NotificationManager from '@/components/NotificationManager';

export default async function GuardianDashboard() {
    const session = await getSession();
    if (!session || session.user.role !== 'GUARDIAN') {
        redirect('/login');
    }

    // 1. Find Guardian Profile
    const guardianProfile = await prisma.guardianProfile.findUnique({
        where: { userId: session.user.id },
        include: {
            patients: {
                include: {
                    doctor: { include: { user: true } },
                    vitals: { orderBy: { recordedAt: 'desc' } },
                    alerts: { where: { isResolved: false }, orderBy: { createdAt: 'desc' } }
                }
            }
        }
    });

    if (!guardianProfile || guardianProfile.patients.length === 0) {
        return (
            <div className="p-8 text-center space-y-4">
                <div className="text-slate-400 text-5xl">🏥</div>
                <h2 className="text-xl font-bold">No Patients Assigned</h2>
                <p className="text-slate-500">You are not currently monitoring any patients. Please contact the hospital administrator.</p>
            </div>
        );
    }

    const ward = guardianProfile.patients[0];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in pb-20">
            <NotificationManager />
            <GuardianClientNotifications wardName={ward.name} riskLevel={ward.riskLevel} />

            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Guardian Portal</h1>
                    <p className="text-slate-500 font-medium">Monitoring ward status in real-time</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <div className="text-xs font-bold text-slate-400 uppercase">Guardian ID</div>
                        <div className="text-sm font-mono font-bold text-teal-600">{guardianProfile.id.slice(0, 8)}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Ward Card */}
                <Card className="col-span-2 p-6 border-t-4 border-t-teal-500 shadow-md">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center border-2 border-teal-100 shadow-inner">
                                <User size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">{ward.name}</h2>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">Patient ID: {ward.id.slice(0, 6)}</p>
                                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 border">
                                    {ward.address}
                                </div>
                            </div>
                        </div>
                        {ward.riskLevel >= 2 && (
                            <div className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-black animate-pulse shadow-lg flex items-center gap-2">
                                <AlertCircle size={14} /> CRITICAL ALERT
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t pt-6 bg-slate-50 -mx-6 px-6 rounded-b-2xl">
                        <div className="p-3">
                            <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Assigned Physician</div>
                            <div className="font-bold text-slate-700">
                                {ward.doctor ? `Dr. ${ward.doctor.user.name}` : "Not Assigned"}
                            </div>
                            <div className="text-[10px] text-teal-600 font-bold">{ward.doctor?.specialization}</div>
                        </div>
                        <div className="p-3 border-l">
                            <div className="text-[10px] font-black text-slate-400 uppercase mb-1">System Last Check</div>
                            <div className="font-bold text-slate-700">
                                {ward.vitals[0] ? new Date(ward.vitals[0].recordedAt).toLocaleTimeString() : 'No Data'}
                            </div>
                            <div className="text-[10px] text-slate-400 font-bold">{ward.vitals[0] ? new Date(ward.vitals[0].recordedAt).toLocaleDateString() : ''}</div>
                        </div>
                    </div>
                </Card>

                {/* Quick Actions / Alerts */}
                <div className="space-y-4">
                    <Card className={`p-5 ${ward.riskLevel >= 2 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border-2 shadow-sm`}>
                        <h3 className={`font-black flex items-center gap-2 ${ward.riskLevel >= 2 ? 'text-red-700' : 'text-green-700'} mb-3 uppercase text-xs tracking-widest`}>
                            <AlertCircle size={14} /> Clinical Status
                        </h3>
                        <p className={`text-sm font-bold leading-relaxed ${ward.riskLevel >= 2 ? 'text-red-600' : 'text-green-600'}`}>
                            {ward.riskLevel >= 2
                                ? "Critical vitals detected. Medical team has been alerted. Please stand by for contact."
                                : "Currently stable. Vitals are within normal observation ranges."}
                        </p>
                    </Card>

                    <Card className="p-5 bg-white border shadow-sm">
                        <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-3">Facility Info</h3>
                        {ward.doctor ? (
                            <div className="space-y-3">
                                <div className="p-2 bg-slate-50 rounded-lg">
                                    <div className="text-[10px] font-black text-slate-400 uppercase">Hospital</div>
                                    <div className="text-sm font-bold text-slate-700">{ward.doctor.hospital}</div>
                                </div>
                                <div className="p-2 bg-slate-50 rounded-lg">
                                    <div className="text-[10px] font-black text-slate-400 uppercase">Emergency Desk</div>
                                    <div className="text-sm font-bold text-red-600">555-0123-HELP</div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-slate-400 italic">No facility linked yet.</div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Latest Vitals Snapshot */}
            <div className="space-y-4">
                <h3 className="font-black text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Activity size={16} className="text-teal-500" /> Vitals Monitoring Snapshot
                </h3>
                {ward.vitals[0] ? (
                    <div className="grid grid-cols-3 gap-6">
                        <Card className="p-6 text-center border-0 shadow-md bg-white hover:scale-105 transition-transform">
                            <div className="mx-auto w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-3">
                                <Heart size={20} />
                            </div>
                            <div className="text-[10px] font-black text-slate-400 uppercase">Blood Pressure</div>
                            <div className="text-2xl font-black text-slate-900 mt-1">{ward.vitals[0].systolicBP} <span className="text-xs font-medium text-slate-400">mmHg</span></div>
                        </Card>
                        <Card className="p-6 text-center border-0 shadow-md bg-white hover:scale-105 transition-transform">
                            <div className="mx-auto w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                                <Wind size={20} />
                            </div>
                            <div className="text-[10px] font-black text-slate-400 uppercase">Resp Rate</div>
                            <div className="text-2xl font-black text-slate-900 mt-1">{ward.vitals[0].respiratoryRate} <span className="text-xs font-medium text-slate-400">/min</span></div>
                        </Card>
                        <Card className="p-6 text-center border-0 shadow-md bg-white hover:scale-105 transition-transform">
                            <div className="mx-auto w-10 h-10 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-3">
                                <Brain size={20} />
                            </div>
                            <div className="text-[10px] font-black text-slate-400 uppercase">Mental Status</div>
                            <div className="text-xl font-black text-slate-900 mt-1 uppercase leading-none">{ward.vitals[0].mentalStatus}</div>
                        </Card>
                    </div>
                ) : (
                    <Card className="p-12 text-center text-slate-400 font-bold border-dashed border-2">
                        No vitals data available yet.
                    </Card>
                )}
            </div>

            {/* FULL DETAILS: Vitals History */}
            <div className="space-y-4">
                <h3 className="font-black text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Clock size={16} className="text-teal-500" /> Patient Vitals History (Full Log)
                </h3>
                <Card className="overflow-hidden border-0 shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="p-4">Time Recorded</th>
                                    <th className="p-4 text-center">BP</th>
                                    <th className="p-4 text-center">RR</th>
                                    <th className="p-4 text-center">Mental Status</th>
                                    <th className="p-4 text-center">qSOFA</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-sm">
                                {ward.vitals.map((v, idx) => (
                                    <tr key={v.id} className={idx === 0 ? "bg-teal-50/50" : ""}>
                                        <td className="p-4 font-bold text-slate-600">
                                            {new Date(v.recordedAt).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-center font-black text-slate-800">{v.systolicBP}</td>
                                        <td className="p-4 text-center font-black text-slate-800">{v.respiratoryRate}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${v.mentalStatus === 'ALERT' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {v.mentalStatus}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`text-base font-black ${v.qSofaScore >= 2 ? 'text-red-600' : 'text-slate-400'}`}>
                                                {v.qSofaScore}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {ward.vitals.length === 0 && (
                                    <tr><td colSpan={5} className="p-8 text-center text-slate-400 italic font-medium">No history recorded yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}
