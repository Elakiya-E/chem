import { NextRequest, NextResponse } from 'next/server';
import { fetchFromGoogleSheets } from '@/lib/googleSheets';
import { adminAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const auth = await adminAuth(req);
        if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const students = await fetchFromGoogleSheets('Students');
        const results = await fetchFromGoogleSheets('Results');

        const totalStudents = students.length;
        const averageMarks = results.length > 0
            ? results.reduce((acc: number, curr: any) => acc + curr.totalMarks, 0) / results.length
            : 0;

        // Group students by level manually
        const levels = ['Beginner', 'Intermediate', 'Advanced'];
        const difficultyStats = levels.map(level => ({
            _id: level,
            count: students.filter((s: any) => s.difficultyLevel === level).length
        }));

        const performanceLevels = {
            Beginner: { avg: 0, count: 0 },
            Intermediate: { avg: 0, count: 0 },
            Advanced: { avg: 0, count: 0 }
        };

        results.forEach((res: any) => {
            const student = students.find((s: any) => s.id === res.studentId);
            const level = student?.difficultyLevel;
            if (level && performanceLevels[level as keyof typeof performanceLevels]) {
                performanceLevels[level as keyof typeof performanceLevels].avg += res.percentage;
                performanceLevels[level as keyof typeof performanceLevels].count += 1;
            }
        });

        Object.keys(performanceLevels).forEach(key => {
            const k = key as keyof typeof performanceLevels;
            if (performanceLevels[k].count > 0) {
                performanceLevels[k].avg /= performanceLevels[k].count;
            }
        });

        return NextResponse.json({
            totalStudents,
            averageMarks: averageMarks.toFixed(2),
            difficultyStats,
            performanceLevels
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
