import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Student } from '@/lib/models';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { studentId, level } = await req.json();

        if (!studentId || !level) {
            return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        await Student.findByIdAndUpdate(studentId, { difficultyLevel: level });

        return NextResponse.json({ message: 'Level updated' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
