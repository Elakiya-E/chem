import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Result, Student } from '@/lib/models';
import { adminAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const auth = await adminAuth(req);
        if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const results = await Result.find().populate('studentId').sort({ submittedAt: -1 });

        return NextResponse.json(results);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
