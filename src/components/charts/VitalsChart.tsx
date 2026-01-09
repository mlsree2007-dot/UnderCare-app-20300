'use client';

import {
    LineChart,
    BarChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { Card } from '@/components/ui/Card';

interface VitalsChartProps {
    data: any[];
}

export function VitalsChart({ data }: VitalsChartProps) {
    // Format data for chart
    const chartData = data.map(d => ({
        time: new Date(d.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sbp: d.systolicBP,
        resp: d.respiratoryRate,
        score: d.qSofaScore
    })).reverse(); // Oldest first for chart

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. qSOFA Score (Bar Chart) */}
            <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 text-[var(--foreground)]">qSOFA Score History</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={[0, 3]}
                                tickCount={4}
                                allowDecimals={false}
                            />
                            <Tooltip
                                cursor={{ fill: '#f1f5f9' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend />
                            <Bar
                                dataKey="score"
                                name="qSOFA Score"
                                fill="#ef4444"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* 2. Vitals Trends (Line Chart) */}
            <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 text-[var(--foreground)]">Vitals Over Time (BP & RR)</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />

                            {/* Left Axis: BP */}
                            <YAxis
                                yAxisId="left"
                                stroke="#0d9488"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={['dataMin - 20', 'dataMax + 20']}
                            />

                            {/* Right Axis: RR */}
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#f59e0b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />

                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend />

                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="sbp"
                                name="Systolic BP"
                                stroke="#0d9488"
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#0d9488" }}
                                activeDot={{ r: 6 }}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="resp"
                                name="Resp. Rate"
                                stroke="#f59e0b"
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#f59e0b" }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}
