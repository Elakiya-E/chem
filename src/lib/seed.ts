import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dbConnect from './db';
import { Question, Admin } from './models';

const sampleQuestions = [
    // Beginner
    {
        level: 'Beginner',
        question: 'What is 5 + 7?',
        options: ['10', '11', '12', '13'],
        correctAnswer: '12',
        type: 'MCQ'
    },
    {
        level: 'Beginner',
        question: 'Which of these is a primary color?',
        options: ['Purple', 'Green', 'Red', 'Orange'],
        correctAnswer: 'Red',
        type: 'MCQ'
    },
    {
        level: 'Beginner',
        question: 'Is the earth flat?',
        options: ['True', 'False'],
        correctAnswer: 'False',
        type: 'True/False'
    },
    // Intermediate
    {
        level: 'Intermediate',
        question: 'What is the capital of France?',
        options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
        correctAnswer: 'Paris',
        type: 'MCQ'
    },
    {
        level: 'Intermediate',
        question: 'Which planet is known as the Red Planet?',
        options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
        correctAnswer: 'Mars',
        type: 'MCQ'
    },
    {
        level: 'Intermediate',
        question: 'HTML stands for HyperText Markup Language.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        type: 'True/False'
    },
    // Advanced
    {
        level: 'Advanced',
        question: 'Who developed the theory of relativity?',
        options: ['Isaac Newton', 'Albert Einstein', 'Galileo Galilei', 'Nikola Tesla'],
        correctAnswer: 'Albert Einstein',
        type: 'MCQ'
    },
    {
        level: 'Advanced',
        question: 'Which of the following is not a programming language?',
        options: ['Python', 'Java', 'HTML', 'C++'],
        correctAnswer: 'HTML',
        type: 'MCQ'
    },
    {
        level: 'Advanced',
        question: 'Identify the chemical symbol for Gold.',
        options: ['Au', 'Ag', 'Fe', 'Hg'],
        correctAnswer: 'Au',
        type: 'MCQ'
    }
];

async function seed() {
    await dbConnect();

    // Clear existing
    await Question.deleteMany({});
    await Admin.deleteMany({});

    // Add questions
    await Question.insertMany(sampleQuestions);
    console.log('Sample questions added.');

    // Create admin
    const hashedName = 'admin';
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await Admin.create({ username: hashedName, password: hashedPassword });
    console.log('Admin user created (admin/admin123).');

    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
