import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSave, FaSignOutAlt, FaTrash } from "react-icons/fa";
import { getExamBlueprints, logoutUser, publishExamBlueprint } from "../services/storage";

const emptyQuestion = {
  type: "mcq",
  stem: "",
  choiceOpts: ["", "", "", ""],
  answerIdx: 0
};

const initialForm = {
  title: "ACET Core Mock 2026",
  sections: [
    {
      subjectTitle: "Mathematics",
      allottedTimeSec: 600,
      questions: [{ ...emptyQuestion }]
    }
  ]
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [blueprints, setBlueprints] = useState(() => getExamBlueprints());
  const [message, setMessage] = useState("");

  const totalQuestions = useMemo(
    () => form.sections.reduce((sum, section) => sum + section.questions.length, 0),
    [form.sections]
  );

  function updateSection(sectionIndex, updates) {
    setForm((current) => ({
      ...current,
      sections: current.sections.map((section, index) => (index === sectionIndex ? { ...section, ...updates } : section))
    }));
  }

  function updateQuestion(sectionIndex, questionIndex, updates) {
    setForm((current) => ({
      ...current,
      sections: current.sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              questions: section.questions.map((question, qIndex) => (qIndex === questionIndex ? { ...question, ...updates } : question))
            }
          : section
      )
    }));
  }

  function updateOption(sectionIndex, questionIndex, optionIndex, value) {
    const question = form.sections[sectionIndex].questions[questionIndex];
    const nextOptions = question.choiceOpts.map((option, index) => (index === optionIndex ? value : option));
    updateQuestion(sectionIndex, questionIndex, { choiceOpts: nextOptions });
  }

  function addSubject() {
    setForm((current) => ({
      ...current,
      sections: [
        ...current.sections,
        {
          subjectTitle: "New Subject",
          allottedTimeSec: 600,
          questions: [{ ...emptyQuestion }]
        }
      ]
    }));
  }

  function removeSubject(sectionIndex) {
    setForm((current) => ({
      ...current,
      sections: current.sections.filter((_, index) => index !== sectionIndex)
    }));
  }

  function addQuestion(sectionIndex) {
    setForm((current) => ({
      ...current,
      sections: current.sections.map((section, index) =>
        index === sectionIndex
          ? { ...section, questions: [...section.questions, { ...emptyQuestion, choiceOpts: [...emptyQuestion.choiceOpts] }] }
          : section
      )
    }));
  }

  function removeQuestion(sectionIndex, questionIndex) {
    setForm((current) => ({
      ...current,
      sections: current.sections.map((section, index) =>
        index === sectionIndex
          ? { ...section, questions: section.questions.filter((_, qIndex) => qIndex !== questionIndex) }
          : section
      )
    }));
  }

  function validateBlueprint() {
    if (!form.title.trim()) return "Exam title is required.";
    if (!form.sections.length) return "At least one subject category is required.";

    for (const section of form.sections) {
      if (!section.subjectTitle.trim()) return "Every subject needs a title.";
      if (!section.questions.length) return `${section.subjectTitle} needs at least one question.`;

      for (const question of section.questions) {
        if (!question.stem.trim()) return "Every question needs question text.";
        if (question.choiceOpts.some((option) => !option.trim())) return "Every MCQ option must be filled.";
      }
    }

    return "";
  }

  function publishExam() {
    const validationError = validateBlueprint();
    if (validationError) {
      setMessage(validationError);
      return;
    }

    const published = publishExamBlueprint(form);
    setBlueprints(getExamBlueprints());
    setMessage(`${published.title} was published to global_exam_blueprints.`);
  }

  function logout() {
    logoutUser();
    navigate("/login", { replace: true });
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-blue-600">Admin Workspace</p>
            <h1 className="text-2xl font-black text-slate-950">Exam Creator and Configurator</h1>
          </div>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 p-6 lg:grid-cols-[1fr_20rem]">
        <section className="space-y-5">
          <div className="glass-card p-6">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">Exam Title</span>
              <input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-lg font-black text-slate-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </div>

          {form.sections.map((section, sectionIndex) => (
            <article key={`${section.subjectTitle}-${sectionIndex}`} className="glass-card p-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="grid flex-1 gap-3 md:grid-cols-[1fr_10rem]">
                  <label>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500">Subject Category</span>
                    <input
                      value={section.subjectTitle}
                      onChange={(event) => updateSection(sectionIndex, { subjectTitle: event.target.value })}
                      className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>
                  <label>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500">Minutes</span>
                    <input
                      type="number"
                      min="1"
                      value={Math.round(section.allottedTimeSec / 60)}
                      onChange={(event) => updateSection(sectionIndex, { allottedTimeSec: Number(event.target.value) * 60 })}
                      className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>
                </div>
                <button onClick={() => removeSubject(sectionIndex)} className="icon-button" aria-label="Remove subject">
                  <FaTrash />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {section.questions.map((question, questionIndex) => (
                  <div key={`${sectionIndex}-${questionIndex}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <label className="block flex-1">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-500">Question Text</span>
                        <textarea
                          value={question.stem}
                          onChange={(event) => updateQuestion(sectionIndex, questionIndex, { stem: event.target.value })}
                          className="mt-2 h-24 w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                          placeholder="Enter the MCQ question..."
                        />
                      </label>
                      <button onClick={() => removeQuestion(sectionIndex, questionIndex)} className="icon-button" aria-label="Remove question">
                        <FaTrash />
                      </button>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {question.choiceOpts.map((option, optionIndex) => (
                        <label key={optionIndex} className="block">
                          <span className="text-xs font-black uppercase tracking-wider text-slate-500">Option {String.fromCharCode(65 + optionIndex)}</span>
                          <input
                            value={option}
                            onChange={(event) => updateOption(sectionIndex, questionIndex, optionIndex, event.target.value)}
                            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                          />
                        </label>
                      ))}
                    </div>

                    <label className="mt-4 block">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-500">Correct Answer Index</span>
                      <select
                        value={question.answerIdx}
                        onChange={(event) => updateQuestion(sectionIndex, questionIndex, { answerIdx: Number(event.target.value) })}
                        className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      >
                        {question.choiceOpts.map((_, index) => (
                          <option key={index} value={index}>
                            {index} - Option {String.fromCharCode(65 + index)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                ))}
              </div>

              <button onClick={() => addQuestion(sectionIndex)} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50">
                <FaPlus /> Add Question
              </button>
            </article>
          ))}

          <div className="flex flex-wrap gap-3">
            <button onClick={addSubject} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-50">
              <FaPlus /> Add Subject
            </button>
            <button onClick={publishExam} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-black text-white hover:bg-blue-800">
              <FaSave /> Publish Exam
            </button>
          </div>
          {message && <p className="rounded-lg bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">{message}</p>}
        </section>

        <aside className="space-y-5">
          <div className="glass-card p-5">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Current Draft</p>
            <p className="mt-3 text-3xl font-black text-slate-950">{totalQuestions}</p>
            <p className="text-sm font-semibold text-slate-500">MCQs across {form.sections.length} subject{form.sections.length === 1 ? "" : "s"}</p>
          </div>

          <div className="glass-card p-5">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Published Blueprints</p>
            <div className="mt-4 space-y-3">
              {blueprints.length ? blueprints.map((blueprint) => (
                <div key={blueprint.id} className="rounded-lg border border-slate-200 p-3">
                  <p className="font-black text-slate-900">{blueprint.title}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{blueprint.sections.length} subjects</p>
                </div>
              )) : <p className="text-sm text-slate-500">No published exams yet.</p>}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
