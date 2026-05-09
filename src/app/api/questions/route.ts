import { NextResponse } from 'next/server';
import { getQuestionsByLevel } from '@/lib/questions';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const level = searchParams.get('level') || 'Beginner';

        const questions = getQuestionsByLevel(level);
        // Remove correct answers before sending to client
        const safeQuestions = questions.map(({ correctAnswer, ...q }) => q);

        return NextResponse.json(safeQuestions);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
