import http from "./http";

export async function getDashboard() {
  const { data } = await http.get("/dashboard");
  return data;
}

export async function getExamBlueprint() {
  const { data } = await http.get("/exams/blueprint");
  return data;
}

export async function submitExamAttempt(responses) {
  const { data } = await http.post("/exams/attempts", { responses });
  return data;
}
