'use client';

import { useEffect, useState } from 'react';
import { triggerBrowserNotification } from '@/components/NotificationManager';
import { Bell, Activity, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function GuardianClientNotifications({ wardName, riskLevel }: { wardName: string, riskLevel: number }) {
    const [notified, setNotified] = useState(false);

    useEffect(() => {
        if (!notified) {
            triggerBrowserNotification(`Welcome, Guardian`, `You are now monitoring ${wardName}.`);

            if (riskLevel >= 2) {
                setTimeout(() => {
                    triggerBrowserNotification(`CRITICAL ALERT: ${wardName}`, `High risk vitals detected! Please contact the hospital.`);
                }, 2000);
            }
            setNotified(true);
        }
    }, [wardName, riskLevel, notified]);

    return (
        <div className="fixed top-4 right-4 z-50 animate-bounce">
            {riskLevel >= 2 && (
                <div className="bg-red-600 text-white p-3 rounded-full shadow-2xl flex items-center gap-2">
                    <Bell size={20} className="animate-ring" />
                    <span className="text-xs font-bold uppercase">Emergency Alert Active</span>
                </div>
            )}
        </div>
    );
}
