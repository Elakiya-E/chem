import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Student, Result, Question } from '@/lib/models';
import { adminAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const auth = await adminAuth(req);
        if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect();

        const totalStudents = await Student.countDocuments();
        const results = await Result.find();

        const averageMarks = results.length > 0
            ? results.reduce((acc, curr) => acc + curr.totalMarks, 0) / results.length
            : 0;

        const difficultyStats = await Student.aggregate([
            { $group: { _id: '$difficultyLevel', count: { $sum: 1 } } }
        ]);

        const performanceLevels = {
            Beginner: { avg: 0, count: 0 },
            Intermediate: { avg: 0, count: 0 },
            Advanced: { avg: 0, count: 0 }
        };

        // Need to join results with students to get level-wise performance
        const detailedResults = await Result.find().populate('studentId');
        detailedResults.forEach((res: any) => {
            const level = res.studentId?.difficultyLevel;
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
