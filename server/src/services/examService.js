const { getDb } = require("../config/database");

function getExamBlueprint() {
  const row = getDb().prepare("SELECT payload FROM exam_blueprint WHERE id = 1").get();
  return JSON.parse(row.payload);
}

function scoreExamAttempt(responses, studentId = 1) {
  const db = getDb();
  const blueprint = getExamBlueprint();
  let correct = 0;
  let total = 0;

  const subjectScores = blueprint
    .filter((section) => section.questions.some((question) => question.type === "mcq"))
    .map((section, sectionIndex) => {
      const sectionResponses = responses[sectionIndex] || [];
      let sectionCorrect = 0;
      let sectionTotal = 0;

      section.questions.forEach((question, questionIndex) => {
        if (question.type !== "mcq") return;
        sectionTotal += 1;
        total += 1;
        if (sectionResponses[questionIndex] === question.answerIdx) {
          sectionCorrect += 1;
          correct += 1;
        }
      });

      return {
        title: section.subjectTitle,
        correct: sectionCorrect,
        total: sectionTotal,
        pct: Math.round((sectionCorrect / sectionTotal) * 100)
      };
    });

  const finalPct = total ? Math.round((correct / total) * 100) : 0;
  
  try {
    const insertLog = db.prepare(`
      INSERT INTO exam_logs (student_id, name, taken_at, score, status) 
      VALUES (?, ?, ?, ?, ?)
    `);
    const attemptCount = db
      .prepare("SELECT COUNT(*) AS total FROM exam_logs WHERE student_id = ?")
      .get(studentId).total;
    
    const currentDate = new Date().toISOString().split("T")[0];
    const examName = `ACET Mock Practice #${attemptCount + 1}`;
    
    insertLog.run(studentId, examName, currentDate, finalPct, "Analyzed");

    db.prepare("INSERT INTO progression (student_id, label, score) VALUES (?, ?, ?)")
      .run(studentId, `Mock ${attemptCount + 1}`, finalPct);

    const upsertSubject = db.prepare(`
      INSERT INTO subjects (student_id, name, mastery, color)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(student_id, name) DO UPDATE SET mastery = excluded.mastery
    `);

    subjectScores.forEach((subject) => {
      upsertSubject.run(studentId, subject.title, subject.pct, getSubjectColor(subject.pct));
    });
  } catch (error) {
    console.error("Failed to write exam log record to database:", error);
  }

  const weaknesses = subjectScores
    .filter((subject) => subject.pct < 80)
    .map((subject) => ({
      ...subject,
      topicFocus: subject.title.includes("Math")
        ? "Algebra and geometry"
        : subject.title.includes("Logic")
          ? "Syllogisms and deductions"
          : subject.title.includes("English")
            ? "Vocabulary and grammar"
            : "Spatial recognition"
    }));

  return {
    finalPct,
    correct,
    total,
    targetScore: Math.min(100, finalPct + 12),
    subjectScores,
    weaknesses
  };
}

function getSubjectColor(score) {
  if (score >= 90) return "emerald";
  if (score >= 80) return "blue";
  if (score >= 70) return "amber";
  return "rose";
}

module.exports = { getExamBlueprint, scoreExamAttempt };
