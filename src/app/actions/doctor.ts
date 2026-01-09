'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function markPatientReviewed(patientId: string) {
    const session = await getSession();
    if (!session || session.user.role !== 'DOCTOR') {
        return { error: 'Unauthorized' };
    }

    try {
        await prisma.patientProfile.update({
            where: { id: patientId },
            data: { isReviewed: true }
        });
        revalidatePath('/dashboard/doctor');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to update patient.' };
    }
}

export async function resolveAlert(alertId: string) {
    const session = await getSession();
    if (!session || session.user.role !== 'DOCTOR') {
        return { error: 'Unauthorized' };
    }

    try {
        await prisma.alert.update({
            where: { id: alertId },
            data: { isResolved: true }
        });
        revalidatePath('/dashboard/doctor');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to resolve alert.' };
    }
}
