const router = require("express").Router();
const { buildAdaptiveGate, diagnoseExam } = require("../services/aiService");

router.post("/diagnose-exam", async (req, res) => {
  try {
    const diagnosis = await diagnoseExam({
      studentId: req.user?.id,
      ...req.body
    });
    res.json(diagnosis);
  } catch (error) {
    console.error("AI diagnose endpoint failure:", error);
    res.status(500).json({ error: "Failed to generate exam diagnosis." });
  }
});

router.post("/adaptive-gate", async (req, res) => {
  try {
    const gate = await buildAdaptiveGate({
      studentId: req.user?.id,
      ...req.body
    });
    res.json(gate);
  } catch (error) {
    console.error("AI adaptive gate endpoint failure:", error);
    res.status(500).json({ error: "Failed to generate adaptive learning gate." });
  }
});

module.exports = router;
