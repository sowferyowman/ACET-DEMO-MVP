const router = require("express").Router();
const { getExamBlueprint, scoreExamAttempt } = require("../services/examService");

router.get("/blueprint", (_req, res) => {
  res.json(getExamBlueprint());
});

router.post("/attempts", (req, res) => {
  res.status(201).json(scoreExamAttempt(req.body.responses || [], req.user.id));
});

module.exports = router;
