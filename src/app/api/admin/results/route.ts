import { NextRequest, NextResponse } from 'next/server';
import { fetchFromGoogleSheets } from '@/lib/googleSheets';
import { adminAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const auth = await adminAuth(req);
        if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const results = await fetchFromGoogleSheets('Results');
        const students = await fetchFromGoogleSheets('Students');

        // Join results with students
        const populatedResults = results.map((res: any) => ({
            ...res,
            studentId: students.find((s: any) => s.id === res.studentId) || { name: 'Unknown' }
        }));

        // Sort by submittedAt descending
        populatedResults.sort((a: any, b: any) =>
            new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );

        return NextResponse.json(populatedResults);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
