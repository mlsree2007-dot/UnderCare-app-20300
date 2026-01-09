import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';

export async function GET() {
    const diagnostics: any = {
        time: new Date().toISOString(),
        env: process.env.NODE_ENV,
        cwd: process.cwd(),
        dbUrl: process.env.DATABASE_URL,
    };

    try {
        // 1. Check if file exists
        const dbPath = path.resolve(process.cwd(), 'prisma/dev.db');
        diagnostics.dbFileExists = fs.existsSync(dbPath);
        diagnostics.dbPathResolved = dbPath;

        // 2. Test Prisma Query
        const start = Date.now();
        const userCount = await prisma.user.count();
        diagnostics.queryTimeMs = Date.now() - start;
        diagnostics.userCount = userCount;
        diagnostics.status = 'Prisma Connected';
    } catch (e: any) {
        diagnostics.status = 'Error';
        diagnostics.errorMessage = e.message;
        diagnostics.errorStack = e.stack;
    }

    return NextResponse.json(diagnostics);
}
