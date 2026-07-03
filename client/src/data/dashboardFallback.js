export const dashboardFallback = {
  stats: [
    { label: "Latest Mock Score", value: "82%", detail: "+27% since Mock 1", accent: "blue" },
    { label: "Peer Percentile", value: "88th", detail: "Top 12% nationwide", accent: "indigo" },
    { label: "Total Tests Taken", value: "10", detail: "30 hours of simulated testing", accent: "purple" },
    { label: "Essay Average", value: "4.2 / 5.0", detail: "Graded by AI", accent: "teal" }
  ],
  progression: [
    { label: "Mock 1", score: 55 },
    { label: "Mock 2", score: 58 },
    { label: "Mock 3", score: 61 },
    { label: "Mock 4", score: 64 },
    { label: "Mock 5", score: 66 },
    { label: "Mock 6", score: 65 },
    { label: "Mock 7", score: 72 },
    { label: "Mock 8", score: 75 },
    { label: "Mock 9", score: 78 },
    { label: "Mock 10", score: 82 }
  ],
  subjects: [
    { name: "Abstract Reasoning", mastery: 94, color: "emerald" },
    { name: "Mathematics", mastery: 85, color: "blue" },
    { name: "English and General Knowledge", mastery: 78, color: "amber" },
    { name: "Logical Reasoning", mastery: 65, color: "rose" }
  ],
  exams: [
    { name: "ACET Full Mock #10", takenAt: "2025-10-12", score: 82, status: "Analyzed" },
    { name: "ACET Full Mock #9", takenAt: "2025-10-05", score: 78, status: "Analyzed" },
    { name: "Logic Diagnostic Drill", takenAt: "2025-10-02", score: 65, status: "AI Flagged" }
  ],
  studyPlan: [],
  rewards: [],
  aiInsight: {
    title: "AI Deep Dive: Logical Reasoning",
    priority: "Priority Intervention Required",
    detail: "The current bottleneck is syllogisms with double negatives."
  }
};
