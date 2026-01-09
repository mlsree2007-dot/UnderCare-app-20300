import { PrismaClient } from '@prisma/client'
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// In production (Netlify), we need to ensure the path to the SQLite file is absolute
// so the serverless function can find it correctly.
let dbUrl = process.env.DATABASE_URL;

if (process.env.NODE_ENV === 'production' && (!dbUrl || dbUrl.startsWith('file:./'))) {
  // Force absolute path for SQLite
  const absolutePath = path.resolve(process.cwd(), 'prisma/dev.db');
  dbUrl = `file:${absolutePath}`;
  console.log('Production DB Path Resolved:', dbUrl);
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
