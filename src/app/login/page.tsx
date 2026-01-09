'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { login } from '@/app/actions/auth';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('DOCTOR'); // Default for demo

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        formData.append('role', role); // Pass selected role for check

        const res = await login(formData);

        if (res?.error) {
            alert(res.error);
            setLoading(false);
        } else {
            // Success
            alert(`Logged in! (Total time: ${res.totalTime}ms)\nDB: ${res.timings.dbQuery}ms, Bcrypt: ${res.timings.bcryptCompare}ms, Session: ${res.timings.sessionSet}ms`);
            router.push(`/dashboard/${role.toLowerCase()}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-[var(--primary-light)] opacity-20 pointer-events-none" />

            <Card className="w-full max-w-md p-8 shadow-xl relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--primary)] text-white rounded-full mb-4">
                        <Shield size={32} />
                    </div>
                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                    <p className="text-[var(--muted)]">Sign in to UnderCare</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold">Email Domain (Role Simulator)</label>
                        <select
                            className="w-full p-2 border rounded mt-1"
                            value={role}
                            onChange={e => setRole(e.target.value)}
                        >
                            <option value="DOCTOR">Doctor (Redirect to Doctor Dash)</option>
                            <option value="ADMIN">Admin (Redirect to Admin Dash)</option>
                            <option value="PATIENT">Patient (Redirect to Patient Dash)</option>
                            <option value="GUARDIAN">Guardian (Redirect to Guardian Dash)</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-semibold">Email</label>
                        <input
                            name="email"
                            type="email"
                            className="w-full p-2 border rounded mt-1"
                            placeholder="user@undercare.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold">Password</label>
                        <input
                            name="password"
                            type="password"
                            className="w-full p-2 border rounded mt-1"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <Button className="w-full mt-4" size="lg" disabled={loading}>
                        {loading ? 'Signing In...' : 'Login'}
                    </Button>
                </form>

                <div className="text-center mt-6 text-sm">
                    <Link href="/" className="text-[var(--primary)] hover:underline">
                        Back to Home
                    </Link>
                </div>
            </Card>
        </div>
    );
}
