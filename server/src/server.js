const express = require("express");
const cors = require("cors");
const aiRoutes = require("./routes/aiRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const examRoutes = require("./routes/examRoutes");
const { resolveStudent } = require("./middleware/auth");

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "acet-exam-api" });
});

app.use("/api/dashboard", resolveStudent, dashboardRoutes);
app.use("/api/exams", resolveStudent, examRoutes);
app.use("/api/ai", resolveStudent, aiRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
});

module.exports = app;
