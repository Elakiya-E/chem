import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { sendToGoogleSheets } from '@/lib/googleSheets';

export async function POST(req: Request) {
    console.log("POST /api/students/register received");
    try {
        const data = await req.json();
        const { name, section, rollNumber, teacherName } = data;

        const testId = `TEST-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        const studentId = uuidv4();

        // Store in Google Sheets
        await sendToGoogleSheets('Students', {
            id: studentId,
            name,
            section,
            rollNumber,
            teacherName,
            testId,
            difficultyLevel: 'Beginner' // Default level
        });

        return NextResponse.json({
            message: 'Student registered successfully',
            studentId: studentId,
            testId: testId
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
