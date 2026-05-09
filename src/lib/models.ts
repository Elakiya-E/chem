import mongoose, { Schema, Document } from 'mongoose';

// --- Student Model ---
export interface IStudent extends Document {
    name: string;
    section: string;
    rollNumber?: string;
    teacherName?: string;
    testId: string;
    difficultyLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
    createdAt: Date;
}

const StudentSchema: Schema = new Schema({
    name: { type: String, required: true },
    section: { type: String, required: true },
    rollNumber: { type: String },
    teacherName: { type: String },
    testId: { type: String, required: true, unique: true },
    difficultyLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    createdAt: { type: Date, default: Date.now },
});

// --- Question Model ---
export interface IQuestion extends Document {
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    question: string;
    options: string[];
    correctAnswer: string;
    type: 'MCQ' | 'True/False' | 'One-word';
}

const QuestionSchema: Schema = new Schema({
    level: { type: String, required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    question: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String, required: true },
    type: { type: String, default: 'MCQ', enum: ['MCQ', 'True/False', 'One-word'] },
});

// --- Result Model ---
export interface IResult extends Document {
    studentId: mongoose.Types.ObjectId;
    totalMarks: number;
    totalQuestions: number;
    percentage: number;
    timeTaken: string; // duration string
    submittedAt: Date;
    answers: {
        questionId: mongoose.Types.ObjectId;
        selectedAnswer: string;
        isCorrect: boolean;
    }[];
}

const ResultSchema: Schema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    totalMarks: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    percentage: { type: Number, required: true },
    timeTaken: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
    answers: [{
        questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
        selectedAnswer: { type: String, required: true },
        isCorrect: { type: Boolean, required: true }
    }]
});

// --- Admin Model ---
const AdminSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

export const Student = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
export const Question = mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);
export const Result = mongoose.models.Result || mongoose.model<IResult>('Result', ResultSchema);
export const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
