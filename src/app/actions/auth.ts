'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { setSession, clearSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const expectedRole = formData.get('role') as string; // Optional: enforce role check if needed

    const start = Date.now();
    const timings: any = {};

    try {
        const dbStart = Date.now();
        const user = await prisma.user.findUnique({
            where: { email }
        });
        timings.dbQuery = Date.now() - dbStart;

        if (!user) {
            return { error: 'Invalid email or password.' };
        }

        const bcryptStart = Date.now();
        const isMatch = await bcrypt.compare(password, user.password);
        timings.bcryptCompare = Date.now() - bcryptStart;

        if (!isMatch) {
            return { error: 'Invalid email or password.' };
        }

        const sessionStart = Date.now();
        // Create Session
        await setSession({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        });
        timings.sessionSet = Date.now() - sessionStart;

    } catch (e: any) {
        console.error("Login Error:", e);
        return { error: `Auth Error: ${e.message || 'Unknown'}` };
    }

    const totalTime = Date.now() - start;
    console.log(`Login Performance: Total ${totalTime}ms`, timings);

    return { success: true, timings, totalTime };
}

export async function logout() {
    await clearSession();
    redirect('/');
}
