import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAdmin() {
    const admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
    });

    if (admin) {
        console.log(`Admin found: ${admin.email}`);
    } else {
        console.log("No admin user found in database.");
    }
}

checkAdmin()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
