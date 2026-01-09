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

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return { error: 'Invalid email or password.' };
        }

        // Optional: Check if user matches the portal they are trying to access?
        // For simplicity, we just log them in and let the dashboard redirect handle access control if needed, 
        // OR strict checking here:
        if (expectedRole && user.role !== expectedRole) {
            // Allow flexible login, but maybe warn? Or strict:
            // return { error: `This account is registered as ${user.role}, not ${expectedRole}.` };
        }

        // Create Session
        await setSession({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        });

    } catch (e: any) {
        console.error("Login Error Debug:", e);
        // Specifically check for environment variable errors
        if (e.message?.includes('DATABASE_URL')) {
            return { error: 'Database connection failed. Is DATABASE_URL set in Netlify?' };
        }
        return { error: `Debug Error: ${e.message || 'Unknown error'}` };
    }

    // Redirect must happen outside try/catch in Server Actions usually, 
    // but here we might want to return success and let client redirect, 
    // OR redirect here.
    return { success: true };
}

export async function logout() {
    await clearSession();
    redirect('/');
}
