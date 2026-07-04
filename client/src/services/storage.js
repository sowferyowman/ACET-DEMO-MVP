const USERS_KEY = "exams_ph_users";
const SESSION_KEY = "exams_ph_current_user";
const EXAMS_KEY = "global_exam_blueprints";
const REVIEWERS_KEY = "reviewersData";
const DRILL_BANK_KEY = "drillBankData";
const DASHBOARD_KEY = "acet_dashboard_data";
const FORUM_KEY = "acet_forum_threads";
const REVIEWER_PROGRESS_KEY = "reviewer_progress";

const defaultUsers = [
  {
    id: "admin-default",
    username: "admin1",
    email: "admin@exams.ph",
    password: "pass1234",
    role: "admin",
    name: "Admin Workspace"
  },
  {
    id: "student-default",
    username: "student1",
    email: "student1@exams.ph",
    password: "123",
    role: "student",
    name: "Stanley Mejia"
  }
];

const defaultForumThreads = [
  {
    id: "thread-gk-default",
    title: "Tips for General Knowledge questions?",
    body: "I keep missing the questions about Philippine presidents...",
    tag: "English / GK",
    author: "User#8821",
    authorEmail: "demo-peer@exams.ph",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    replies: [
      {
        id: "reply-gk-default",
        author: "User#4410",
        body: "Make a timeline and group presidents by major laws and historical periods.",
        createdAt: new Date(Date.now() - 70 * 60 * 1000).toISOString()
      }
    ]
  }
];

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error(`Failed to read ${key} from localStorage:`, error);
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function initializeLocalStorage() {
  if (!localStorage.getItem(USERS_KEY)) {
    writeJson(USERS_KEY, defaultUsers);
  } else {
    const users = readJson(USERS_KEY, []);
    const mergedUsers = defaultUsers.reduce((accounts, defaultUser) => {
      const existingIndex = accounts.findIndex((account) => account.username === defaultUser.username || account.id === defaultUser.id);
      if (existingIndex >= 0) {
        accounts[existingIndex] = { ...accounts[existingIndex], ...defaultUser };
        return accounts;
      }
      return [...accounts, defaultUser];
    }, users);
    writeJson(USERS_KEY, mergedUsers);
  }

  if (!localStorage.getItem(EXAMS_KEY)) writeJson(EXAMS_KEY, []);
  if (!localStorage.getItem(REVIEWERS_KEY)) writeJson(REVIEWERS_KEY, []);
  if (!localStorage.getItem(DRILL_BANK_KEY)) writeJson(DRILL_BANK_KEY, []);
  if (!localStorage.getItem(DASHBOARD_KEY)) writeJson(DASHBOARD_KEY, {});
  if (!localStorage.getItem(REVIEWER_PROGRESS_KEY)) writeJson(REVIEWER_PROGRESS_KEY, {});
  if (!localStorage.getItem(FORUM_KEY)) writeJson(FORUM_KEY, defaultForumThreads);

  const users = readJson(USERS_KEY, defaultUsers);
  const session = readJson(SESSION_KEY, null);
  if (session && !users.some((user) => user.username === session.username && user.role === session.role)) {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function getUsers() {
  initializeLocalStorage();
  return readJson(USERS_KEY, defaultUsers);
}

export function loginUser(identifier, password) {
  const user = getUsers().find(
    (account) =>
      (account.username?.toLowerCase() === identifier.toLowerCase() ||
        account.email?.toLowerCase() === identifier.toLowerCase()) &&
      account.password === password
  );

  if (!user) return null;

  const sessionUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    name: user.name
  };

  writeJson(SESSION_KEY, sessionUser);
  return sessionUser;
}

export function getCurrentUser() {
  initializeLocalStorage();
  return readJson(SESSION_KEY, null);
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

export function getExamBlueprints() {
  initializeLocalStorage();
  return readJson(EXAMS_KEY, []);
}

export function getActiveExamBlueprint() {
  const blueprints = getExamBlueprints();
  return blueprints[blueprints.length - 1] || null;
}

export function publishExamBlueprint(blueprint) {
  const blueprints = getExamBlueprints();
  const nextBlueprint = {
    ...blueprint,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "published"
  };

  writeJson(EXAMS_KEY, [...blueprints, nextBlueprint]);
  return nextBlueprint;
}

export function getReviewerBlueprints() {
  initializeLocalStorage();
  return readJson(REVIEWERS_KEY, []);
}

export function publishReviewerBlueprint(reviewer) {
  const reviewers = getReviewerBlueprints();
  const nextReviewer = {
    ...reviewer,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "published"
  };

  writeJson(REVIEWERS_KEY, [...reviewers, nextReviewer]);
  return nextReviewer;
}

export function getDrillBankQuestions() {
  initializeLocalStorage();
  return readJson(DRILL_BANK_KEY, []);
}

export function publishDrillQuestion(question) {
  const drillBank = getDrillBankQuestions();
  const nextQuestion = {
    ...question,
    id: crypto.randomUUID(),
    type: "multiple_choice",
    status: "published",
    createdAt: new Date().toISOString()
  };

  writeJson(DRILL_BANK_KEY, [nextQuestion, ...drillBank]);
  return nextQuestion;
}

export function getDashboardStore() {
  initializeLocalStorage();
  return readJson(DASHBOARD_KEY, {});
}

export function getStudentDashboard(email) {
  const store = getDashboardStore();
  return store[email] || createEmptyDashboard(email);
}

export function saveStudentDashboard(email, dashboard) {
  const store = getDashboardStore();
  writeJson(DASHBOARD_KEY, { ...store, [email]: dashboard });
}

export function createEmptyDashboard(email) {
  return {
    student: { email, displayName: "Stanley Mejia" },
    hasDashboardData: false,
    stats: [
      { label: "Latest Mock Score", value: "0%", detail: "No completed exam attempts yet", accent: "blue" },
      { label: "Total Tests Taken", value: "0", detail: "0 completed mock exams", accent: "purple" }
    ],
    progression: [],
    subjects: [],
    exams: [],
    attempts: [],
    studyPlan: [],
    rewards: [],
    aiInsight: null
  };
}

export function saveExamAttemptForStudent(user, blueprint, responses, results, meta = {}) {
  const currentDashboard = getStudentDashboard(user.email);
  const attemptNumber = currentDashboard.exams.length + 1;
  const takenAt = new Date().toISOString().split("T")[0];
  const durationSeconds = Number(meta.durationSeconds || 0);
  const earnedMockPoints = calculateAttemptPoints(results.finalPct, durationSeconds);

  const exams = [
    { name: blueprint.title, takenAt, score: results.finalPct, status: "Analyzed" },
    ...currentDashboard.exams
  ];

  const attempts = [
    {
      id: crypto.randomUUID(),
      examId: blueprint.id,
      examTitle: blueprint.title,
      takenAt,
      finalPct: results.finalPct,
      earnedMockPoints,
      durationSeconds,
      subjectScores: results.subjectScores,
      itemDiagnostics: results.itemDiagnostics || []
    },
    ...(currentDashboard.attempts || [])
  ];

  const progression = [...currentDashboard.progression, { label: `Mock ${attemptNumber}`, score: results.finalPct }];
  const subjects = results.subjectScores.map((subject) => ({
    name: subject.title,
    mastery: subject.pct,
    color: subject.pct >= 90 ? "emerald" : subject.pct >= 80 ? "blue" : subject.pct >= 70 ? "amber" : "rose"
  }));

  const studyPlan = results.weaknesses.map((weakness, index) => ({
    day: ["Monday", "Wednesday", "Friday"][index % 3],
    title: `${weakness.title}: Targeted Review`,
    detail: `Focus on ${weakness.topicFocus}. This was generated from your latest exam attempt.`,
    status: index === 0 ? "priority" : "upcoming"
  }));

  const nextDashboard = {
    ...currentDashboard,
    hasDashboardData: true,
    stats: [
      { label: "Latest Mock Score", value: `${results.finalPct}%`, detail: `Scored from ${blueprint.title}`, accent: "blue" },
      { label: "Total Tests Taken", value: String(exams.length), detail: `${exams.length} completed mock exam${exams.length === 1 ? "" : "s"}`, accent: "purple" }
    ],
    progression,
    subjects,
    exams,
    attempts,
    studyPlan,
    rewards: [{ title: `${attemptNumber} Mock${attemptNumber === 1 ? "" : "s"} Completed`, description: "Earned from completed localStorage-tracked exams.", points: earnedMockPoints }],
    aiInsight: results.weaknesses.length
      ? { title: `AI Deep Dive: ${results.weaknesses[0].title}`, priority: "Priority Intervention Required", detail: `Your latest attempt showed lower mastery in ${results.weaknesses[0].topicFocus}.` }
      : { title: "AI Deep Dive: Strong Performance", priority: "Maintenance Mode", detail: "You scored above the intervention threshold across all MCQ subjects." }
  };

  saveStudentDashboard(user.email, nextDashboard);
  return nextDashboard;
}

export function scoreBlueprintAttempt(blueprint, responses, meta = {}) {
  let earnedPoints = 0;
  let totalPoints = 0;
  let correct = 0;
  let total = 0;
  const itemDiagnostics = [];

  const subjectScores = blueprint.sections.map((section, sectionIndex) => {
    const sectionResponses = responses[sectionIndex] || [];
    let sectionCorrect = 0;
    let sectionTotal = 0;
    let sectionEarnedPoints = 0;
    let sectionTotalPoints = 0;

    section.questions.forEach((question, questionIndex) => {
      const points = Number(question.points || 1);
      const response = sectionResponses[questionIndex];
      const correctItem = isCorrectAnswer(question, response);
      sectionTotal += 1;
      total += 1;
      sectionTotalPoints += points;
      totalPoints += points;

      if (correctItem) {
        sectionCorrect += 1;
        correct += 1;
        sectionEarnedPoints += points;
        earnedPoints += points;
      }

      itemDiagnostics.push(
        buildItemDiagnostic({
          section,
          question,
          response,
          isCorrect: correctItem,
          metrics: meta.questionMetrics?.[sectionIndex]?.[questionIndex]
        })
      );
    });

    return {
      title: section.subjectTitle,
      correct: sectionCorrect,
      total: sectionTotal,
      earnedPoints: sectionEarnedPoints,
      totalPoints: sectionTotalPoints,
      pct: sectionTotalPoints ? Math.round((sectionEarnedPoints / sectionTotalPoints) * 100) : 0
    };
  });

  const finalPct = totalPoints ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const weaknesses = subjectScores.filter((subject) => subject.total > 0 && subject.pct < 80).map((subject) => ({ ...subject, topicFocus: subject.title }));
  return { finalPct, correct, total, earnedPoints, totalPoints, targetScore: Math.min(100, finalPct + 12), subjectScores, weaknesses, itemDiagnostics };
}

export function getWeaknessAnalysis(email, threshold = 75) {
  const dashboard = getStudentDashboard(email);
  const attempts = dashboard.attempts || [];
  if (!attempts.length && !dashboard.subjects.length) return { hasAttempts: false, weakSubjects: [], diagnosticInsights: [] };

  const subjectMap = new Map();
  attempts.forEach((attempt) => {
    attempt.subjectScores?.forEach((subject) => {
      const current = subjectMap.get(subject.title) || { subject: subject.title, totalPct: 0, count: 0, lowestPct: 100 };
      current.totalPct += subject.pct;
      current.count += 1;
      current.lowestPct = Math.min(current.lowestPct, subject.pct);
      subjectMap.set(subject.title, current);
    });
  });

  if (!subjectMap.size) {
    dashboard.subjects.forEach((subject) => subjectMap.set(subject.name, { subject: subject.name, totalPct: subject.mastery, count: 1, lowestPct: subject.mastery }));
  }

  const ranked = [...subjectMap.values()].map((item) => ({ subject: item.subject, averagePct: Math.round(item.totalPct / item.count), lowestPct: item.lowestPct })).sort((a, b) => a.averagePct - b.averagePct);
  const weakSubjects = ranked.filter((item) => item.averagePct < threshold);
  const diagnosticInsights = buildDiagnosticInsights(attempts);
  return { hasAttempts: true, weakSubjects: weakSubjects.length ? weakSubjects : ranked.slice(0, 1), diagnosticInsights, primaryDiagnostic: diagnosticInsights[0] || null };
}

export function getQuestionsForSubject(subjectName, limit = 10, diagnosticFocus = null) {
  const normalizedSubject = subjectName.toLowerCase();
  const questions = getDrillBankQuestions()
    .filter((question) => question.subjectTitle?.toLowerCase() === normalizedSubject)
    .map((question) => {
      const section = { subjectTitle: question.subjectTitle };
      const diagnosticTags = getDiagnosticTags(section, question);
      return { ...question, ...diagnosticTags, explanation: question.explanation || buildExplanation(question) };
    });

  return questions
    .sort((a, b) => getDiagnosticMatchScore(b, diagnosticFocus) - getDiagnosticMatchScore(a, diagnosticFocus))
    .slice(0, limit);
}

export function scoreDrillAttempt(questions, responses) {
  let correct = 0;
  const items = questions.map((question, index) => {
    const isCorrect = isCorrectAnswer(question, responses[index]);
    if (isCorrect) correct += 1;
    return { question, response: responses[index], isCorrect, explanation: question.explanation || buildExplanation(question) };
  });
  return { correct, total: questions.length, pct: questions.length ? Math.round((correct / questions.length) * 100) : 0, items };
}

export function getReviewerProgress(email) {
  initializeLocalStorage();
  const progress = readJson(REVIEWER_PROGRESS_KEY, {});
  return progress[email] || {};
}

export function markReviewerModuleComplete(email, reviewerId, moduleId) {
  const progress = readJson(REVIEWER_PROGRESS_KEY, {});
  const userProgress = progress[email] || {};
  const moduleSet = new Set(userProgress[reviewerId] || []);
  moduleSet.add(moduleId);
  writeJson(REVIEWER_PROGRESS_KEY, { ...progress, [email]: { ...userProgress, [reviewerId]: [...moduleSet] } });
}

export function getCommunityRewardSummary(email) {
  const dashboard = getStudentDashboard(email);
  const exams = getExamBlueprints();
  const reviewers = getReviewerBlueprints();
  const progress = getReviewerProgress(email);
  const attempts = dashboard.attempts || [];
  const uniqueCompletedExams = new Set(attempts.map((attempt) => attempt.examId).filter(Boolean));
  const mockPoints = attempts.reduce((sum, attempt) => sum + Number(attempt.earnedMockPoints || calculateAttemptPoints(attempt.finalPct, attempt.durationSeconds)), 0);
  const reviewerModules = reviewers.flatMap((reviewer) => reviewer.modules.map((module) => ({ reviewerId: reviewer.id, moduleId: module.id })));
  const completedReviewerModules = reviewerModules.filter((module) => progress[module.reviewerId]?.includes(module.moduleId));
  const reviewerPoints = completedReviewerModules.length * 75;
  const examCompletionist = exams.length > 0 && uniqueCompletedExams.size >= exams.length;
  const reviewerMaster = reviewerModules.length > 0 && completedReviewerModules.length >= reviewerModules.length;
  const speedDemon = hasSpeedDemonAttempt(attempts);

  const badges = [
    examCompletionist && { title: "Exam Completionist", description: "Finished all available mock exams.", points: 500 },
    reviewerMaster && { title: "Reviewer Master", description: "Completed every published reviewer module.", points: 400 },
    speedDemon && { title: "Speed Demon", description: "Finished an exam far faster than the current average.", points: 350 }
  ].filter(Boolean);

  const badgePoints = badges.reduce((sum, badge) => sum + badge.points, 0);
  const totalPoints = mockPoints + reviewerPoints + badgePoints;

  return {
    totalPoints,
    mockPoints,
    reviewerPoints,
    badgePoints,
    badges,
    tier: getRewardTier(totalPoints),
    completedReviewerModules: completedReviewerModules.length,
    totalReviewerModules: reviewerModules.length,
    completedExams: uniqueCompletedExams.size,
    totalExams: exams.length,
    latestScore: attempts[0]?.finalPct || 0
  };
}

export function getLeaderboard(currentEmail) {
  const students = getUsers().filter((user) => user.role === "student");
  const rows = students.map((student) => {
    const summary = getCommunityRewardSummary(student.email);
    return { id: student.id, email: student.email, name: student.name, totalPoints: summary.totalPoints, latestScore: summary.latestScore, isCurrent: student.email === currentEmail };
  }).sort((a, b) => b.totalPoints - a.totalPoints);
  return rows.map((row, index) => ({ ...row, rank: index + 1 }));
}

export function getForumThreads() {
  initializeLocalStorage();
  return readJson(FORUM_KEY, defaultForumThreads).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function createForumThread(user, payload) {
  const threads = getForumThreads();
  const nextThread = { id: crypto.randomUUID(), title: payload.title, body: payload.body, tag: payload.tag, author: user.name || user.username, authorEmail: user.email, createdAt: new Date().toISOString(), replies: [] };
  writeJson(FORUM_KEY, [nextThread, ...threads]);
  return nextThread;
}

export function addForumReply(user, threadId, body) {
  const threads = getForumThreads();
  const updated = threads.map((thread) => thread.id === threadId ? { ...thread, replies: [...(thread.replies || []), { id: crypto.randomUUID(), author: user.name || user.username, authorEmail: user.email, body, createdAt: new Date().toISOString() }] } : thread);
  writeJson(FORUM_KEY, updated);
}

function calculateAttemptPoints(finalPct, durationSeconds = 0) {
  const base = Math.round(Number(finalPct || 0) * 10);
  const speedBonus = durationSeconds > 0 && durationSeconds < 600 ? 100 : 0;
  return base + speedBonus;
}

function hasSpeedDemonAttempt(attempts) {
  const timedAttempts = attempts.filter((attempt) => Number(attempt.durationSeconds) > 0);
  if (!timedAttempts.length) return false;
  const average = timedAttempts.reduce((sum, attempt) => sum + Number(attempt.durationSeconds), 0) / timedAttempts.length;
  return timedAttempts.some((attempt) => Number(attempt.durationSeconds) <= average * 0.65 || Number(attempt.durationSeconds) < 600);
}

function getRewardTier(points) {
  if (points >= 5000) return { label: "Magis Elite", percent: 100, color: "bg-yellow-500" };
  if (points >= 2500) return { label: "Blue Eagle", percent: 75, color: "bg-blue-600" };
  if (points >= 1000) return { label: "Rising Scholar", percent: 45, color: "bg-emerald-500" };
  return { label: "Getting Started", percent: 18, color: "bg-slate-400" };
}

function buildExplanation(question) {
  const type = question.type || "multiple_choice";
  if (type === "checkboxes") {
    const answers = (question.correctAnswers || []).map((index) => question.choiceOpts?.[index]).filter(Boolean).join(", ");
    return `Correct answer(s): ${answers || "No answer key provided"}. Review the source material for this category.`;
  }
  if (type === "short_answer") return `Expected answer: ${question.correctText || "No answer key provided"}.`;
  const answer = question.choiceOpts?.[Number(question.answerIdx ?? 0)];
  return `Correct answer: ${answer || "No answer key provided"}. Revisit this concept before your next mock.`;
}

function buildItemDiagnostic({ section, question, response, isCorrect, metrics = {} }) {
  const tags = getDiagnosticTags(section, question);
  const answerEvents = metrics.answerEvents || [];
  const timeSpentMs = Number(metrics.timeSpentMs || 0);
  const lastAnswerAtMs = Number(answerEvents.at(-1)?.elapsedMs || 0);
  const responseDurationSeconds = Math.round(Math.max(timeSpentMs, lastAnswerAtMs) / 1000);
  const changedCorrectToIncorrect = answerEvents.some((event) => {
    if (event.from === null || event.from === undefined || event.to === null || event.to === undefined) return false;
    const wasCorrect = isCorrectAnswer(question, event.from);
    const becameIncorrect = !isCorrectAnswer(question, event.to);
    const lastSecondWindow = !responseDurationSeconds || Number(event.elapsedMs || 0) >= responseDurationSeconds * 1000 - 15000;
    return wasCorrect && becameIncorrect && lastSecondWindow;
  });

  return {
    ...tags,
    responseDurationSeconds,
    isCorrect,
    errorFlag: !isCorrect,
    changedCorrectToIncorrect,
    changedAnswerCount: Math.max(0, answerEvents.length - 1),
    questionType: question.type || "multiple_choice"
  };
}

function getDiagnosticTags(section, question) {
  const category = cleanLabel(question.category || question.subjectTitle || section.subjectTitle, "General Practice");
  const subcategory = cleanLabel(question.diagnosticSubcategory || question.subCategory || question.subcategory || question.topic, inferSubcategory(question));
  const skillTag = cleanLabel(question.diagnosticSkillTag || question.skillTag || question.tag || normalizeTags(question.tags), inferSkillTag(question));
  const path = [category, subcategory, skillTag].filter(Boolean);
  return {
    category,
    subcategory,
    skillTag,
    path,
    pathLabel: path.join(" -> ")
  };
}

function getDiagnosticMatchScore(question, diagnosticFocus) {
  if (!diagnosticFocus) return 0;
  let score = 0;
  if (question.category === diagnosticFocus.category) score += 1;
  if (question.subcategory === diagnosticFocus.subcategory) score += 3;
  if (question.skillTag === diagnosticFocus.skillTag) score += 5;
  return score;
}

function buildDiagnosticInsights(attempts) {
  const items = attempts.flatMap((attempt) => attempt.itemDiagnostics || []);
  if (!items.length) return [];

  const timedItems = items.filter((item) => Number(item.responseDurationSeconds) > 0);
  const globalAverageSeconds = timedItems.length
    ? timedItems.reduce((sum, item) => sum + Number(item.responseDurationSeconds || 0), 0) / timedItems.length
    : 0;
  const slowThreshold = Math.max(75, globalAverageSeconds * 1.25);
  const groups = new Map();

  items.forEach((item) => {
    const key = item.pathLabel || item.category;
    const group = groups.get(key) || {
      ...item,
      attempts: 0,
      errors: 0,
      durationTotal: 0,
      timedCount: 0,
      changedCorrectToIncorrect: 0
    };
    group.attempts += 1;
    if (item.errorFlag) group.errors += 1;
    if (Number(item.responseDurationSeconds) > 0) {
      group.durationTotal += Number(item.responseDurationSeconds);
      group.timedCount += 1;
    }
    if (item.changedCorrectToIncorrect) group.changedCorrectToIncorrect += 1;
    groups.set(key, group);
  });

  return [...groups.values()]
    .map((group) => {
      const averageSeconds = group.timedCount ? Math.round(group.durationTotal / group.timedCount) : 0;
      const errorRate = group.attempts ? group.errors / group.attempts : 0;
      const hasRepeatedErrors = group.errors >= 2 || errorRate >= 0.5;
      const hasTimeBottleneck = hasRepeatedErrors && averageSeconds >= slowThreshold;
      const hasSelfDoubt = group.changedCorrectToIncorrect >= 2 || (group.changedCorrectToIncorrect >= 1 && group.errors <= 2);

      let insightType = "accuracy";
      if (hasSelfDoubt) insightType = "self-doubt";
      else if (hasTimeBottleneck) insightType = "time-bottleneck";

      return {
        ...group,
        averageSeconds,
        averageMinutes: Number((averageSeconds / 60).toFixed(1)),
        errorRate,
        insightType,
        priorityScore: group.errors * 3 + group.changedCorrectToIncorrect * 4 + (hasTimeBottleneck ? 3 : 0)
      };
    })
    .filter((group) => group.errors > 0)
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 3);
}

function cleanLabel(value, fallback = "") {
  const label = String(value || "").trim();
  return label || fallback;
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) return tags.filter(Boolean).join(", ");
  return tags;
}

function inferSubcategory(question) {
  if (question.type === "checkboxes") return "Multi-select Reasoning";
  if (question.type === "short_answer") return "Constructed Response";
  if (question.type === "paragraph") return "Written Explanation";
  return "Core Concept";
}

function inferSkillTag(question) {
  const stem = String(question.stem || "").toLowerCase();
  if (stem.includes("not") || stem.includes("except") || stem.includes("false")) return "Negative Wording";
  if (stem.includes("therefore") || stem.includes("conclude") || stem.includes("follows")) return "Logical Inference";
  return "Untyped Skill";
}

function isCorrectAnswer(question, response) {
  const type = question.type || "multiple_choice";
  if (type === "mcq" || type === "multiple_choice") return response === Number(question.answerIdx ?? 0);
  if (type === "checkboxes") {
    const expected = [...(question.correctAnswers || [])].map(Number).sort().join(",");
    const actual = [...(response || [])].map(Number).sort().join(",");
    return expected === actual;
  }
  if (type === "short_answer" || type === "paragraph") {
    const expected = String(question.correctText || "").trim().toLowerCase();
    const actual = String(response || "").trim().toLowerCase();
    return expected.length > 0 && actual === expected;
  }
  return false;
}
