const { getDb } = require("../config/database");

function resolveStudent(req, res, next) {
  const requestedStudentId = Number.parseInt(req.get("x-student-id") || process.env.DEV_STUDENT_ID || "2", 10);
  const studentId = Number.isInteger(requestedStudentId) && requestedStudentId > 0 ? requestedStudentId : 1;

  const student = getDb()
    .prepare(
      `
      SELECT
        users.id,
        users.email,
        users.role,
        student_profiles.display_name AS displayName,
        student_profiles.target_school AS targetSchool
      FROM users
      LEFT JOIN student_profiles ON student_profiles.user_id = users.id
      WHERE users.id = ?
    `
    )
    .get(studentId);

  if (!student) {
    return res.status(401).json({ error: "Student account context could not be resolved." });
  }

  req.user = student;
  next();
}

module.exports = { resolveStudent };
