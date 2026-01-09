import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'undercare-secret-key-12345');

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Only protect /dashboard routes
    if (!pathname.startsWith('/dashboard')) {
        return NextResponse.next();
    }

    const token = request.cookies.get('session')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const role = payload.role as string;

        // 2. Role-based Route Protection
        if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        if (pathname.startsWith('/dashboard/doctor') && role !== 'DOCTOR' && role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        if (pathname.startsWith('/dashboard/patient') && role !== 'PATIENT' && role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        if (pathname.startsWith('/dashboard/guardian') && role !== 'GUARDIAN' && role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        return NextResponse.next();
    } catch (e) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
