'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, AlertCircle, Settings, LogOut, Shield, HeartPulse, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const role = pathname.includes('/admin') ? 'ADMIN'
        : pathname.includes('/doctor') ? 'DOCTOR'
            : pathname.includes('/patient') ? 'PATIENT'
                : 'GUARDIAN';

    const navItems = [
        { label: 'Overview', href: `/dashboard/${role.toLowerCase()}`, icon: LayoutDashboard },
        // { label: 'Settings', href: '#', icon: Settings }, // Disabled for now
    ];

    if (role === 'DOCTOR' || role === 'ADMIN') {
        navItems.splice(1, 0, { label: 'Patients', href: `/dashboard/${role.toLowerCase()}/patients`, icon: Users });
    }

    if (role === 'ADMIN') {
        // Insert 'Doctors' after 'Patients' (index 2)
        navItems.splice(2, 0, { label: 'Doctors', href: '/dashboard/admin/doctors', icon: Stethoscope });
    }

    return (
        <div className="flex min-h-screen bg-slate-50">

            {/* Sidebar - Light styling */}
            <aside className="w-72 bg-white border-r hidden md:flex flex-col fixed inset-y-0 z-20 shadow-sm">
                <div className="h-20 flex items-center px-8 border-b text-[var(--primary)] font-bold text-2xl gap-3">
                    <HeartPulse size={32} /> Undercare
                </div>

                <div className="px-8 py-6">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Access Portal
                    </div>
                    <div className="text-lg font-bold text-slate-900 capitalize">{role.toLowerCase()}</div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <div className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer",
                                pathname === item.href || (item.label === 'Overview' && pathname.endsWith(role.toLowerCase()))
                                    ? "bg-teal-50 text-teal-700 border-l-4 border-teal-500"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}>
                                <item.icon size={20} />
                                {item.label}
                            </div>
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t bg-slate-50/50">
                    <Link href="/login">
                        <Button variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold">
                            <LogOut size={20} /> Sign Out
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:pl-72 flex flex-col">
                {/* FIGMA STYLE: Solid Teal Header */}
                <header className="h-20 bg-teal-600 text-white flex items-center px-8 justify-between shadow-md sticky top-0 z-10">
                    <h1 className="text-xl font-bold tracking-tight capitalize">
                        {/* Breadcrumb-ish title */}
                        Dashboard / {pathname.split('/').pop()?.replace('-', ' ')}
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="text-teal-100 text-sm font-medium mr-2">
                            {new Date().toLocaleDateString()}
                        </div>
                        <div className="w-10 h-10 bg-teal-700 rounded-full text-white flex items-center justify-center font-bold border-2 border-teal-400">
                            {role[0]}
                        </div>
                    </div>
                </header>

                <div className="p-8 flex-1 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
