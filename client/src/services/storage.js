const USERS_KEY = "exams_ph_users";
const SESSION_KEY = "exams_ph_current_user";
const BLUEPRINTS_KEY = "global_exam_blueprints";
const DASHBOARD_KEY = "acet_dashboard_data";

const defaultUsers = [
  {
    id: "admin-default",
    email: "admin@exams.ph",
    password: "adminpassword",
    role: "admin",
    name: "Admin"
  },
  {
    id: "student-default",
    email: "student@exams.ph",
    password: "studentpassword",
    role: "student",
    name: "Student"
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
  }

  if (!localStorage.getItem(BLUEPRINTS_KEY)) {
    writeJson(BLUEPRINTS_KEY, []);
  }

  if (!localStorage.getItem(DASHBOARD_KEY)) {
    writeJson(DASHBOARD_KEY, {});
  }
}

export function getUsers() {
  initializeLocalStorage();
  return readJson(USERS_KEY, defaultUsers);
}

export function loginUser(email, password) {
  const user = getUsers().find(
    (account) => account.email.toLowerCase() === email.toLowerCase() && account.password === password
  );

  if (!user) {
    return null;
  }

  const sessionUser = {
    id: user.id,
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
  return readJson(BLUEPRINTS_KEY, []);
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

  writeJson(BLUEPRINTS_KEY, [...blueprints, nextBlueprint]);
  return nextBlueprint;
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
  writeJson(DASHBOARD_KEY, {
    ...store,
    [email]: dashboard
  });
}

export function createEmptyDashboard(email) {
  return {
    student: {
      email,
      displayName: email?.split("@")[0] || "Student"
    },
    hasDashboardData: false,
    stats: [
      { label: "Latest Mock Score", value: "0%", detail: "No completed exam attempts yet", accent: "blue" },
      { label: "Total Tests Taken", value: "0", detail: "0 completed mock exams", accent: "purple" }
    ],
    progression: [],
    subjects: [],
    exams: [],
    studyPlan: [],
    rewards: [],
    aiInsight: null
  };
}

export function saveExamAttemptForStudent(user, blueprint, responses, results) {
  const currentDashboard = getStudentDashboard(user.email);
  const attemptNumber = currentDashboard.exams.length + 1;
  const takenAt = new Date().toISOString().split("T")[0];

  const exams = [
    {
      name: blueprint.title,
      takenAt,
      score: results.finalPct,
      status: "Analyzed"
    },
    ...currentDashboard.exams
  ];

  const progression = [
    ...currentDashboard.progression,
    {
      label: `Mock ${attemptNumber}`,
      score: results.finalPct
    }
  ];

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

  const rewards = [
    {
      title: `${attemptNumber} Mock${attemptNumber === 1 ? "" : "s"} Completed`,
      description: "Earned from completed localStorage-tracked exams.",
      points: attemptNumber * 100
    }
  ];

  const nextDashboard = {
    ...currentDashboard,
    hasDashboardData: true,
    stats: [
      {
        label: "Latest Mock Score",
        value: `${results.finalPct}%`,
        detail: `Scored from ${blueprint.title}`,
        accent: "blue"
      },
      {
        label: "Total Tests Taken",
        value: String(exams.length),
        detail: `${exams.length} completed mock exam${exams.length === 1 ? "" : "s"}`,
        accent: "purple"
      }
    ],
    progression,
    subjects,
    exams,
    studyPlan,
    rewards,
    aiInsight: results.weaknesses.length
      ? {
          title: `AI Deep Dive: ${results.weaknesses[0].title}`,
          priority: "Priority Intervention Required",
          detail: `Your latest attempt showed lower mastery in ${results.weaknesses[0].topicFocus}.`
        }
      : {
          title: "AI Deep Dive: Strong Performance",
          priority: "Maintenance Mode",
          detail: "You scored above the intervention threshold across all MCQ subjects."
        }
  };

  saveStudentDashboard(user.email, nextDashboard);
  return nextDashboard;
}

export function scoreBlueprintAttempt(blueprint, responses) {
  let correct = 0;
  let total = 0;

  const subjectScores = blueprint.sections.map((section, sectionIndex) => {
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
      pct: sectionTotal ? Math.round((sectionCorrect / sectionTotal) * 100) : 0
    };
  });

  const finalPct = total ? Math.round((correct / total) * 100) : 0;
  const weaknesses = subjectScores
    .filter((subject) => subject.total > 0 && subject.pct < 80)
    .map((subject) => ({
      ...subject,
      topicFocus: subject.title
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
