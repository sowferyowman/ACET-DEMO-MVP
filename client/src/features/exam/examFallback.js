export const examFallback = [
  {
    subjectTitle: "Abstract Reasoning",
    allottedTimeSec: 420,
    questions: [
      { type: "mcq", stem: "Find the next item: square, triangle, circle, square, triangle, ...", choiceOpts: ["Square", "Triangle", "Circle", "Pentagon"], answerIdx: 2 },
      { type: "mcq", stem: "Which item completes the sequence: 3, 6, 12, 24, ...", choiceOpts: ["30", "36", "42", "48"], answerIdx: 3 }
    ]
  },
  {
    subjectTitle: "Ateneo Essay",
    allottedTimeSec: 900,
    questions: [{ type: "essay", stem: "Describe a specific instance where you went beyond expectations to assist your community." }]
  }
];
