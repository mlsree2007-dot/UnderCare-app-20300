import Link from 'next/link';
import { ShieldAlert, User, Shield, Lock, Stethoscope, FileText, ArrowRight, HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Navbar */}
      <nav className="h-20 border-b flex items-center bg-white sticky top-0 z-50">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold text-[var(--primary)] text-teal-600">
            <HeartPulse className="w-8 h-8" strokeWidth={2.5} />
            <span>Undercare</span>
          </div>
          <div className="flex gap-4">
            <Link href="/guidelines" className="text-slate-500 hover:text-teal-600 font-medium px-4 py-2 transition-colors">Guidelines</Link>
            <Link href="/login">
              <Button variant="outline" className="border-2 font-bold">Login Portal</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 container py-12 lg:py-20 flex flex-col gap-16">

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Branding & Context */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 font-semibold text-sm">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              System Operational
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight">
              Faster Triage.<br />
              <span className="text-teal-500">Better Care.</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-lg">
              Advanced qSOFA assessment tool and real-time patient monitoring system for modern healthcare facilities.
            </p>
          </div>

          {/* Right: Emergency CTA (Figma Style: Large Red Card) */}
          <div className="relative group">
            <div className="absolute inset-0 bg-red-200 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <Link href="/emergency" className="block relative">
              <div className="bg-red-500 hover:bg-red-600 text-white rounded-3xl p-10 lg:p-12 text-center transition-all transform group-hover:-translate-y-1 shadow-2xl cursor-pointer">
                <ShieldAlert className="w-24 h-24 mx-auto mb-6 opacity-90" />
                <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-wide mb-4">
                  Emergency
                </h2>
                <p className="text-red-100 font-medium text-lg mb-8">
                  No Login Required • Immediate Assessment
                </p>
                <div className="bg-white text-red-600 px-8 py-4 rounded-full font-bold text-xl inline-flex items-center gap-2 hover:gap-4 transition-all shadow-lg">
                  START ASSESSMENT <ArrowRight size={20} />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Role Selection (Figma Style: Outline Cards) */}
        <div className="space-y-8 mt-8">
          <div className="flex items-center gap-4">
            <div className="h-1 flex-1 bg-slate-100"></div>
            <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Secure Access Portals</span>
            <div className="h-1 flex-1 bg-slate-100"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <RoleCard
              title="Doctor"
              icon={<Stethoscope size={32} />}
              desc="Monitor patients & view alerts"
              href="/dashboard/doctor"
            />
            <RoleCard
              title="Admin"
              icon={<User size={32} />}
              desc="Manage staff & resources"
              href="/dashboard/admin"
            />
            <RoleCard
              title="Patient"
              icon={<HeartPulse size={32} />}
              desc="View my health records"
              href="/dashboard/patient"
            />
            <RoleCard
              title="Guardian"
              icon={<Lock size={32} />}
              desc="Monitor family status"
              href="/dashboard/guardian"
            />
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-400 text-sm border-t mt-12 bg-slate-50">
        <p>&copy; {new Date().getFullYear()} Undercare System. All rights reserved.</p>
      </footer>
    </div>
  );
}

function RoleCard({ title, icon, desc, href }: any) {
  return (
    <Link href={href} className="group">
      <div className="h-full border-2 border-slate-200 rounded-2xl p-8 hover:border-teal-500 transition-all hover:shadow-lg hover:bg-teal-50/30 flex flex-col items-center text-center cursor-pointer">
        <div className="text-teal-500 mb-4 bg-teal-50 p-4 rounded-full group-hover:bg-teal-500 group-hover:text-white transition-colors">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 leading-snug">{desc}</p>
      </div>
    </Link>
  )
}
