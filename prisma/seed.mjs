import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('123456', 10);

    // 1. Create Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@undercare.com' },
        update: {},
        create: {
            email: 'admin@undercare.com',
            name: 'Super Admin',
            role: 'ADMIN',
            password,
        },
    });
    console.log({ admin });

    // 2. Create Doctor
    const doctorUser = await prisma.user.upsert({
        where: { email: 'doc@undercare.com' },
        update: {},
        create: {
            email: 'doc@undercare.com',
            name: 'Dr. Gregory House',
            role: 'DOCTOR',
            password,
            doctorProfile: {
                create: {
                    specialization: 'Diagnostic Medicine',
                    hospital: 'Princeton Plainsboro',
                },
            },
        },
        include: { doctorProfile: true }
    });
    console.log({ doctorUser });

    // 3. Create Patient (High Risk)
    const patient1 = await prisma.patientProfile.create({
        data: {
            name: 'John Doe',
            dob: new Date('1985-05-15'),
            address: '123 Main St, NY',
            riskLevel: 2, // High
            isReviewed: false,
            doctorId: doctorUser.doctorProfile.id,
            vitals: {
                create: [
                    {
                        systolicBP: 90,
                        respiratoryRate: 25,
                        mentalStatus: 'VERBAL', // <15 GCS roughly
                        qSofaScore: 2,
                        isEmergency: true,
                        recordedBy: 'Emergency System',
                    }
                ]
            }
        }
    });

    // 4. Create Patient (Low Risk)
    const patient2 = await prisma.patientProfile.create({
        data: {
            name: 'Alice Smith',
            dob: new Date('1992-10-20'),
            address: '456 Elm St, NJ',
            riskLevel: 0, // Low
            isReviewed: true,
            doctorId: doctorUser.doctorProfile.id,
            vitals: {
                create: [
                    {
                        systolicBP: 120,
                        respiratoryRate: 16,
                        mentalStatus: 'ALERT',
                        qSofaScore: 0,
                        isEmergency: false,
                        recordedBy: 'Nurse Joy',
                    }
                ]
            }
        }
    });

    console.log("Seeding finished.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
