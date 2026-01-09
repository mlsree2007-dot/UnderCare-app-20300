'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { setSession, clearSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const expectedRole = formData.get('role') as string; // Optional: enforce role check if needed

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return { error: 'Invalid email or password.' };
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return { error: 'Invalid email or password.' };
        }

        // Create Session
        await setSession({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        });

    } catch (e: any) {
        console.error("Login Error:", e);
        return { error: 'Authentication failed. Please check your credentials.' };
    }

    return { success: true };
}

export async function logout() {
    await clearSession();
    redirect('/');
}
