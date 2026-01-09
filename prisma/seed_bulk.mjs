import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting bulk seeding...");
    const password = await bcrypt.hash('123456', 10);

    // 1. Create 100 Doctors
    console.log("Generating 100 Doctors...");
    const doctors = [];
    const specializations = ['Cardiology', 'Neurology', 'Diagnostics', 'Emergency', 'General Practice', 'Pediatrics'];
    const hospitals = ['City General', 'Westside Medical', 'St. Jude Hospital', 'Hope Care Center'];

    for (let i = 1; i <= 100; i++) {
        const email = `doctor${i}@undercare.com`;
        const name = `Dr. Specialist ${i}`;

        const doc = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                name,
                role: 'DOCTOR',
                password,
                doctorProfile: {
                    create: {
                        specialization: specializations[i % specializations.length],
                        hospital: hospitals[i % hospitals.length],
                    },
                },
            },
            include: { doctorProfile: true }
        });
        doctors.push(doc.doctorProfile.id);
    }

    // 2. Create 100 Patients (each with a Guardian)
    console.log("Generating 100 Patients & Guardians...");
    for (let i = 1; i <= 100; i++) {
        const patientEmail = `patient${i}@undercare.com`;
        const guardianEmail = `guardian${i}@undercare.com`;

        // Create Guardian Account
        const guardianUser = await prisma.user.upsert({
            where: { email: guardianEmail },
            update: {},
            create: {
                email: guardianEmail,
                name: `Guardian of ${i}`,
                role: 'GUARDIAN',
                password,
                guardianProfile: {
                    create: {
                        phone: `555-010${i % 10}`,
                    }
                }
            },
            include: { guardianProfile: true }
        });

        // Create Patient
        const patientUser = await prisma.user.upsert({
            where: { email: patientEmail },
            update: {},
            create: {
                email: patientEmail,
                name: `Patient ${i}`,
                role: 'PATIENT',
                password,
            }
        });

        // Link Patient Profile
        const risk = i % 10 === 0 ? 2 : (i % 5 === 0 ? 1 : 0); // Mix of risks

        await prisma.patientProfile.upsert({
            where: { userId: patientUser.id },
            update: {},
            create: {
                userId: patientUser.id,
                name: `Patient ${i}`,
                dob: new Date(1970 + (i % 40), i % 12, (i % 28) + 1),
                address: `${i} Medical Way, Healthcare City`,
                riskLevel: risk,
                isReviewed: risk === 0,
                doctorId: doctors[i % doctors.length],
                guardianId: guardianUser.guardianProfile.id,
                vitals: {
                    create: [
                        {
                            systolicBP: 100 + (Math.random() * 40),
                            respiratoryRate: 15 + (Math.random() * 10),
                            mentalStatus: 'ALERT',
                            qSofaScore: risk,
                            recordedBy: 'Initial Triage',
                        }
                    ]
                }
            }
        });

        if (i % 10 === 0) console.log(`Seeded ${i} records...`);
    }

    console.log("Bulk seeding finished successfully.");
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
