'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function recordVitals(formData: FormData) {
    const session = await getSession();
    if (!session || !session.user) {
        return { error: 'Unauthorized' };
    }

    const sysBP = parseInt(formData.get('systolicBP') as string);
    const respRate = parseInt(formData.get('respiratoryRate') as string);
    const mentalStatus = formData.get('mentalStatus') as string;

    if (isNaN(sysBP) || isNaN(respRate) || !mentalStatus) {
        return { error: 'Invalid Input: Please ensure all fields are filled correctly.' };
    }

    try {
        // 1. Get Patient Profile
        const patient = await prisma.patientProfile.findUnique({
            where: { userId: session.user.id }
        });

        if (!patient) {
            return { error: 'Patient profile not found.' };
        }

        // 2. Calculate qSOFA
        let score = 0;
        if (sysBP <= 100) score++;
        if (respRate >= 22) score++;
        if (mentalStatus !== 'ALERT') score++;

        // 3. Create Record
        await prisma.vitalRecord.create({
            data: {
                patientId: patient.id,
                systolicBP: sysBP,
                respiratoryRate: respRate,
                mentalStatus: mentalStatus,
                qSofaScore: score,
                recordedBy: 'Patient (Manual)',
            }
        });

        // 4. Update Patient Risk Level & Create Alert if needed
        await prisma.patientProfile.update({
            where: { id: patient.id },
            data: {
                riskLevel: score,
                isReviewed: false // Reset for doctor to see new data
            }
        });

        if (score >= 2) {
            await prisma.alert.create({
                data: {
                    patientId: patient.id,
                    severity: score === 3 ? 'HIGH' : 'MODERATE',
                    message: `High risk detected! qSOFA Score: ${score}. BP: ${sysBP}, RR: ${respRate}.`,
                    isResolved: false
                }
            });
        }

        revalidatePath('/dashboard/patient');
        return { success: true };

    } catch (e) {
        console.error(e);
        return { error: 'Failed to record vitals.' };
    }
}
