'use client';

import { useEffect } from 'react';

export default function NotificationManager() {
    useEffect(() => {
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }
    }, []);

    // Function to trigger a browser notification
    const showNotification = (title: string, body: string) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body,
                icon: '/favicon.ico', // Update with actual icon if available
            });
        }
    };

    // This component is purely for managing permissions and exposing a trigger
    // It could be expanded with a global state or event listener
    return null;
}

export function triggerBrowserNotification(title: string, body: string) {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body,
            icon: '/favicon.ico',
        });
    }
}
