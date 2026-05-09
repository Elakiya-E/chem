export const sampleQuestions = [
    { _id: '1', level: 'Beginner', question: 'What is 5 + 7?', options: ['10', '11', '12', '13'], correctAnswer: '12' },
    { _id: '2', level: 'Beginner', question: 'Which color is at the top of a rainbow?', options: ['Red', 'Violet', 'Green', 'Yellow'], correctAnswer: 'Red' },
    { _id: '3', level: 'Beginner', question: 'The sun rises in the West.', options: ['True', 'False'], correctAnswer: 'False' },
    { _id: '4', level: 'Intermediate', question: 'Which element has the chemical symbol O?', options: ['Gold', 'Oxygen', 'Osmium', 'Oganesson'], correctAnswer: 'Oxygen' },
    { _id: '5', level: 'Intermediate', question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], correctAnswer: 'Pacific' },
    { _id: '6', level: 'Intermediate', question: 'Light travels faster than sound.', options: ['True', 'False'], correctAnswer: 'True' },
    { _id: '7', level: 'Advanced', question: 'In what year did the Titanic sink?', options: ['1908', '1912', '1915', '1920'], correctAnswer: '1912' },
    { _id: '8', level: 'Advanced', question: 'Who is known as the "Father of Computers"?', options: ['Alan Turing', 'Charles Babbage', 'John von Neumann', 'Steve Jobs'], correctAnswer: 'Charles Babbage' },
    { _id: '9', level: 'Advanced', question: 'The square root of 144 is 12.', options: ['True', 'False'], correctAnswer: 'True' }
];

export function getQuestionsByLevel(level: string) {
    return sampleQuestions.filter(q => q.level === level);
}
