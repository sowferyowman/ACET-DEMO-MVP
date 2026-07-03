const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");
const {
  aiInsight,
  dashboardMetrics,
  exams,
  progression,
  rewards,
  subjects,
  studyPlan,
  examStructure
} = require("../data/seed");

const dataDir = path.join(__dirname, "..", "..", "data");
const dbPath = process.env.SQLITE_PATH || path.join(dataDir, "acet.sqlite");

let db;

function getDb() {
  if (!db) {
    fs.mkdirSync(dataDir, { recursive: true });
    db = new DatabaseSync(dbPath);
    db.exec("PRAGMA journal_mode = WAL");
  }
  return db;
}

function ensureDatabase() {
  const database = getDb();

  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT,
      role TEXT NOT NULL DEFAULT 'student',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS student_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      target_school TEXT NOT NULL DEFAULT 'Ateneo de Manila University',
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS exam_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL DEFAULT 1,
      name TEXT NOT NULL,
      taken_at TEXT NOT NULL,
      score INTEGER NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS progression (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL DEFAULT 1,
      label TEXT NOT NULL,
      score INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL DEFAULT 1,
      name TEXT NOT NULL,
      mastery INTEGER NOT NULL,
      color TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS study_plan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL DEFAULT 1,
      day TEXT NOT NULL,
      title TEXT NOT NULL,
      detail TEXT NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS dashboard_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL DEFAULT 1,
      metric_key TEXT NOT NULL,
      label TEXT NOT NULL,
      value TEXT NOT NULL,
      detail TEXT NOT NULL,
      accent TEXT NOT NULL,
      UNIQUE(student_id, metric_key)
    );

    CREATE TABLE IF NOT EXISTS rewards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL DEFAULT 1,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      points INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ai_insights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL DEFAULT 1,
      title TEXT NOT NULL,
      priority TEXT NOT NULL,
      detail TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS exam_blueprint (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      payload TEXT NOT NULL
    );

  `);
  migrateLegacySchema(database);
  database.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_subject_student_name ON subjects(student_id, name)");

  const hasUsers = database.prepare("SELECT COUNT(*) AS total FROM users").get().total;
  if (!hasUsers) {
    database
      .prepare("INSERT INTO users (id, email, password_hash, role) VALUES (1, ?, ?, ?)")
      .run("student.demo@acet.local", null, "student");
    database
      .prepare("INSERT INTO student_profiles (user_id, display_name, target_school) VALUES (1, ?, ?)")
      .run("Demo Student", "Ateneo de Manila University");
  }

  ensureUser(database, {
    id: 1,
    email: "student.demo@acet.local",
    displayName: "Demo Student",
    targetSchool: "Ateneo de Manila University"
  });

  ensureUser(database, {
    id: 2,
    email: "student.current@acet.local",
    displayName: "Current Student",
    targetSchool: "Ateneo de Manila University"
  });

  const hasExamLogs = database.prepare("SELECT COUNT(*) AS total FROM exam_logs WHERE student_id = 1").get().total;
  if (!hasExamLogs) {
    const insertExam = database.prepare("INSERT INTO exam_logs (student_id, name, taken_at, score, status) VALUES (1, ?, ?, ?, ?)");
    exams.forEach((exam) => insertExam.run(exam.name, exam.takenAt, exam.score, exam.status));
  }

  const hasProgression = database.prepare("SELECT COUNT(*) AS total FROM progression WHERE student_id = 1").get().total;
  if (!hasProgression) {
    const insertPoint = database.prepare("INSERT INTO progression (student_id, label, score) VALUES (1, ?, ?)");
    progression.forEach((point) => insertPoint.run(point.label, point.score));
  }

  const hasSubjects = database.prepare("SELECT COUNT(*) AS total FROM subjects WHERE student_id = 1").get().total;
  if (!hasSubjects) {
    const insertSubject = database.prepare("INSERT INTO subjects (student_id, name, mastery, color) VALUES (1, ?, ?, ?)");
    subjects.forEach((subject) => insertSubject.run(subject.name, subject.mastery, subject.color));
  }

  const hasStudyPlan = database.prepare("SELECT COUNT(*) AS total FROM study_plan WHERE student_id = 1").get().total;
  if (!hasStudyPlan) {
    const insertPlan = database.prepare("INSERT INTO study_plan (student_id, day, title, detail, status) VALUES (1, ?, ?, ?, ?)");
    studyPlan.forEach((item) => insertPlan.run(item.day, item.title, item.detail, item.status));
  }

  const hasMetrics = database.prepare("SELECT COUNT(*) AS total FROM dashboard_metrics WHERE student_id = 1").get().total;
  if (!hasMetrics) {
    const insertMetric = database.prepare(`
      INSERT INTO dashboard_metrics (student_id, metric_key, label, value, detail, accent)
      VALUES (1, ?, ?, ?, ?, ?)
    `);
    dashboardMetrics.forEach((metric) => {
      insertMetric.run(metric.key, metric.label, metric.value, metric.detail, metric.accent);
    });
  }

  const hasRewards = database.prepare("SELECT COUNT(*) AS total FROM rewards WHERE student_id = 1").get().total;
  if (!hasRewards) {
    const insertReward = database.prepare("INSERT INTO rewards (student_id, title, description, points) VALUES (1, ?, ?, ?)");
    rewards.forEach((reward) => insertReward.run(reward.title, reward.description, reward.points));
  }

  const hasInsights = database.prepare("SELECT COUNT(*) AS total FROM ai_insights WHERE student_id = 1").get().total;
  if (!hasInsights) {
    database
      .prepare("INSERT INTO ai_insights (student_id, title, priority, detail) VALUES (1, ?, ?, ?)")
      .run(aiInsight.title, aiInsight.priority, aiInsight.detail);
  }

  database.prepare("INSERT OR REPLACE INTO exam_blueprint (id, payload) VALUES (1, ?)").run(JSON.stringify(examStructure));
}

function ensureUser(database, user) {
  database
    .prepare("INSERT OR IGNORE INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)")
    .run(user.id, user.email, null, "student");

  database
    .prepare("INSERT OR IGNORE INTO student_profiles (user_id, display_name, target_school) VALUES (?, ?, ?)")
    .run(user.id, user.displayName, user.targetSchool);
}

function migrateLegacySchema(database) {
  [
    "exam_logs",
    "progression",
    "subjects",
    "study_plan",
    "rewards",
    "dashboard_metrics",
    "ai_insights"
  ].forEach((tableName) => {
    addColumnIfMissing(database, tableName, "student_id", "INTEGER NOT NULL DEFAULT 1");
  });
}

function addColumnIfMissing(database, tableName, columnName, definition) {
  const columns = database.prepare(`PRAGMA table_info(${tableName})`).all();
  const exists = columns.some((column) => column.name === columnName);

  if (!exists) {
    database.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

module.exports = { ensureDatabase, getDb };
