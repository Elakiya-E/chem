import { NextResponse } from 'next/server';
import { sendToGoogleSheets } from '@/lib/googleSheets';
import { getQuestionsByLevel } from '@/lib/questions';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
    try {
        const { studentId, answers, timeTaken, level } = await req.json();

        if (!studentId || !answers || !Array.isArray(answers)) {
            return NextResponse.json({ error: 'Invalid submission data' }, { status: 400 });
        }

        const difficultyLevel = level || 'Beginner';
        const questions = getQuestionsByLevel(difficultyLevel);

        let totalMarks = 0;
        const processedAnswers = answers.map((ans: any) => {
            const question = questions.find(q => q._id === ans.questionId);
            const isCorrect = question ? question.correctAnswer === ans.selectedAnswer : false;
            if (isCorrect) totalMarks++;
            return {
                questionId: ans.questionId,
                selectedAnswer: ans.selectedAnswer,
                isCorrect
            };
        });

        const totalQuestions = questions.length;
        const percentage = totalQuestions > 0 ? (totalMarks / totalQuestions) * 100 : 0;
        const resultId = uuidv4();

        // Store in Google Sheets
        await sendToGoogleSheets('Results', {
            id: resultId,
            studentId,
            totalMarks,
            totalQuestions,
            percentage,
            timeTaken,
            answers: processedAnswers,
            submittedAt: new Date().toISOString()
        });

        return NextResponse.json({ message: 'Test submitted successfully', resultId });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
