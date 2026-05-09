import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Question, Admin } from '@/lib/models';
import bcrypt from 'bcryptjs';

const sampleQuestions = [
    { level: 'Beginner', question: 'What is 5 + 7?', options: ['10', '11', '12', '13'], correctAnswer: '12', type: 'MCQ' },
    { level: 'Beginner', question: 'Which color is at the top of a rainbow?', options: ['Red', 'Violet', 'Green', 'Yellow'], correctAnswer: 'Red', type: 'MCQ' },
    { level: 'Beginner', question: 'The sun rises in the West.', options: ['True', 'False'], correctAnswer: 'False', type: 'True/False' },
    { level: 'Intermediate', question: 'Which element has the chemical symbol O?', options: ['Gold', 'Oxygen', 'Osmium', 'Oganesson'], correctAnswer: 'Oxygen', type: 'MCQ' },
    { level: 'Intermediate', question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], correctAnswer: 'Pacific', type: 'MCQ' },
    { level: 'Intermediate', question: 'Light travels faster than sound.', options: ['True', 'False'], correctAnswer: 'True', type: 'True/False' },
    { level: 'Advanced', question: 'In what year did the Titanic sink?', options: ['1908', '1912', '1915', '1920'], correctAnswer: '1912', type: 'MCQ' },
    { level: 'Advanced', question: 'Who is known as the "Father of Computers"?', options: ['Alan Turing', 'Charles Babbage', 'John von Neumann', 'Steve Jobs'], correctAnswer: 'Charles Babbage', type: 'MCQ' },
    { level: 'Advanced', question: 'The square root of 144 is 12.', options: ['True', 'False'], correctAnswer: 'True', type: 'True/False' }
];

export async function GET() {
    try {
        await dbConnect();

        // Check if data already exists to avoid double seeding
        const qCount = await Question.countDocuments();
        if (qCount > 0) return NextResponse.json({ message: 'Database already seeded' });

        await Question.insertMany(sampleQuestions);

        const hashedPassword = await bcrypt.hash('admin123', 10);
        await Admin.create({ username: 'admin', password: hashedPassword });

        return NextResponse.json({ message: 'Database seeded successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
