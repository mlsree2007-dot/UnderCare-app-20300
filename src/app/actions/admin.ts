'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function createDoctor(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const hospital = formData.get('hospital') as string;
    const specialization = formData.get('specialization') as string;

    if (!name || !email || !password) {
        return { error: "Missing required fields" };
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'DOCTOR',
                doctorProfile: {
                    create: {
                        hospital: hospital || 'General Hospital',
                        specialization: specialization || 'General'
                    }
                }
            }
        });

        revalidatePath('/dashboard/admin');
        return { success: true };
    } catch (e: any) {
        console.error(e);
        return { error: "Failed to create doctor. Email might be taken." };
    }
}

export async function deleteUser(userId: string) {
    try {
        await prisma.user.delete({ where: { id: userId } });
        revalidatePath('/dashboard/admin');
        return { success: true };
    } catch (e) {
        return { error: "Failed to delete user." };
    }
}

export async function assignDoctor(patientId: string, doctorId: string) {
    try {
        await prisma.patientProfile.update({
            where: { id: patientId },
            data: { doctorId }
        });
        revalidatePath('/dashboard/admin');
        return { success: true };
    } catch (e) {
        return { error: "Assignment failed." };
    }
}

export async function registerPatient(formData: FormData) {
    // Patient Info
    const name = formData.get('name') as string;
    const dob = formData.get('dob') as string;
    const address = formData.get('address') as string;
    const patientEmail = formData.get('patientEmail') as string;
    const patientPassword = formData.get('patientPassword') as string;

    // Guardian Info
    const guardianName = formData.get('guardianName') as string;
    const guardianContact = formData.get('guardianContact') as string;
    const guardianEmail = formData.get('guardianEmail') as string;
    const guardianPassword = formData.get('guardianPassword') as string;

    // Assignments
    const doctorId = formData.get('doctorId') as string;

    try {
        // ... (preceding logic for user creation) ...
        const hashedPatientPw = await bcrypt.hash(patientPassword, 10);
        const patientUser = await prisma.user.create({
            data: {
                name: name,
                email: patientEmail,
                password: hashedPatientPw,
                role: 'PATIENT'
            }
        });

        // 2. Create Guardian User Account
        const hashedGuardianPw = await bcrypt.hash(guardianPassword, 10);
        const guardianUser = await prisma.user.create({
            data: {
                name: guardianName,
                email: guardianEmail,
                password: hashedGuardianPw,
                role: 'GUARDIAN'
            }
        });

        // 3. Create Profiles & Link
        const guardianProfile = await prisma.guardianProfile.create({
            data: {
                userId: guardianUser.id,
                phone: guardianContact,
            }
        });

        await prisma.patientProfile.create({
            data: {
                userId: patientUser.id,
                name,
                dob: dob ? new Date(dob) : new Date(),
                address,
                guardianName,
                guardianContact,
                guardianId: guardianProfile.id,
                doctorId: doctorId || null, // ASSIGN DOCTOR
                riskLevel: 0
            }
        });

        revalidatePath('/dashboard/admin');
        return { success: true };
    } catch (e: any) {
        console.error("Registration Error:", e);
        if (e.code === 'P2002') {
            return { error: "Email already exists (Patient or Guardian)." };
        }
        return { error: "Failed to register patient. Check inputs." };
    }
}

export async function updateDoctor(id: string, formData: FormData) {
    const name = formData.get('name') as string;
    const specialization = formData.get('specialization') as string;
    const hospital = formData.get('hospital') as string;

    try {
        await prisma.user.update({
            where: { id },
            data: {
                name,
                doctorProfile: {
                    update: {
                        specialization,
                        hospital
                    }
                }
            }
        });
        revalidatePath('/dashboard/admin');
        return { success: true };
    } catch (e) {
        return { error: "Failed to update doctor." };
    }
}
