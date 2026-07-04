import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaPlus, FaSave, FaTrash } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";
import {
  getExamBlueprints,
  getReviewerBlueprints,
  publishExamBlueprint,
  publishReviewerBlueprint
} from "../services/storage";

const emptyQuestion = {
  type: "multiple_choice",
  stem: "",
  choiceOpts: ["", "", "", ""],
  answerIdx: 0,
  correctAnswers: [],
  correctText: "",
  diagnosticSubcategory: "",
  diagnosticSkillTag: "",
  points: 1
};

const initialExamForm = {
  title: "ACET Core Mock 2026",
  sections: [
    {
      subjectTitle: "Mathematics",
      allottedTimeSec: 600,
      questions: [{ ...emptyQuestion }]
    }
  ]
};

const initialReviewerForm = {
  title: "ACET Mathematics Reviewer",
  subjectCategory: "Mathematics",
  modules: [
    {
      id: crypto.randomUUID(),
      title: "Chapter 1: Core Concepts",
      content: "",
      videoUrl: ""
    }
  ]
};

export default function AdminDashboardPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "reviewer" ? "reviewer" : "exam";
  const [mode, setMode] = useState(initialMode);
  const [examForm, setExamForm] = useState(initialExamForm);
  const [reviewerForm, setReviewerForm] = useState(initialReviewerForm);
  const [blueprints, setBlueprints] = useState(() => getExamBlueprints());
  const [reviewers, setReviewers] = useState(() => getReviewerBlueprints());
  const [message, setMessage] = useState("");

  const totalQuestions = useMemo(
    () => examForm.sections.reduce((sum, section) => sum + section.questions.length, 0),
    [examForm.sections]
  );

  useEffect(() => {
    const routeMode = searchParams.get("mode") === "reviewer" ? "reviewer" : "exam";
    setMode(routeMode);
  }, [searchParams]);

  function updateSection(sectionIndex, updates) {
    setExamForm((current) => ({
      ...current,
      sections: current.sections.map((section, index) => (index === sectionIndex ? { ...section, ...updates } : section))
    }));
  }

  function updateQuestion(sectionIndex, questionIndex, updates) {
    setExamForm((current) => ({
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
    const question = examForm.sections[sectionIndex].questions[questionIndex];
    const nextOptions = question.choiceOpts.map((option, index) => (index === optionIndex ? value : option));
    updateQuestion(sectionIndex, questionIndex, { choiceOpts: nextOptions });
  }

  function addSubject() {
    setExamForm((current) => ({
      ...current,
      sections: [
        ...current.sections,
        {
          subjectTitle: "New Subject",
          allottedTimeSec: 600,
          questions: [{ ...emptyQuestion, choiceOpts: [...emptyQuestion.choiceOpts] }]
        }
      ]
    }));
  }

  function removeSubject(sectionIndex) {
    setExamForm((current) => ({
      ...current,
      sections: current.sections.filter((_, index) => index !== sectionIndex)
    }));
  }

  function addQuestion(sectionIndex) {
    setExamForm((current) => ({
      ...current,
      sections: current.sections.map((section, index) =>
        index === sectionIndex
          ? { ...section, questions: [...section.questions, { ...emptyQuestion, choiceOpts: [...emptyQuestion.choiceOpts] }] }
          : section
      )
    }));
  }

  function removeQuestion(sectionIndex, questionIndex) {
    setExamForm((current) => ({
      ...current,
      sections: current.sections.map((section, index) =>
        index === sectionIndex
          ? { ...section, questions: section.questions.filter((_, qIndex) => qIndex !== questionIndex) }
          : section
      )
    }));
  }

  function updateReviewerModule(moduleId, updates) {
    setReviewerForm((current) => ({
      ...current,
      modules: current.modules.map((module) => (module.id === moduleId ? { ...module, ...updates } : module))
    }));
  }

  function addReviewerModule() {
    setReviewerForm((current) => ({
      ...current,
      modules: [
        ...current.modules,
        {
          id: crypto.randomUUID(),
          title: `Chapter ${current.modules.length + 1}: New Topic`,
          content: "",
          videoUrl: ""
        }
      ]
    }));
  }

  function removeReviewerModule(moduleId) {
    setReviewerForm((current) => ({
      ...current,
      modules: current.modules.filter((module) => module.id !== moduleId)
    }));
  }

  function validateExamBlueprint() {
    if (!examForm.title.trim()) return "Exam title is required.";
    if (!examForm.sections.length) return "At least one subject category is required.";

    for (const section of examForm.sections) {
      if (!section.subjectTitle.trim()) return "Every subject needs a title.";
      if (!section.questions.length) return `${section.subjectTitle} needs at least one question.`;

      for (const question of section.questions) {
        if (!question.stem.trim()) return "Every question needs question text.";
        if (usesOptions(question.type) && question.choiceOpts.some((option) => !option.trim())) {
          return "Every option must be filled.";
        }
        if ((question.type === "short_answer" || question.type === "paragraph") && !question.correctText.trim()) {
          return "Short answer and paragraph items need an answer key.";
        }
        if (question.type === "checkboxes" && !question.correctAnswers.length) {
          return "Checkbox items need at least one correct option.";
        }
      }
    }

    return "";
  }

  function validateReviewer() {
    if (!reviewerForm.title.trim()) return "Reviewer title is required.";
    if (!reviewerForm.subjectCategory.trim()) return "Subject category is required.";
    if (!reviewerForm.modules.length) return "Add at least one module or chapter.";

    for (const module of reviewerForm.modules) {
      if (!module.title.trim()) return "Every module needs a title.";
      if (!module.content.trim()) return `${module.title} needs reading material.`;
    }

    return "";
  }

  function publishItem() {
    if (mode === "exam") {
      const validationError = validateExamBlueprint();
      if (validationError) {
        setMessage(validationError);
        return;
      }

      const published = publishExamBlueprint(examForm);
      setBlueprints(getExamBlueprints());
      setMessage(`${published.title} was published to global_exam_blueprints.`);
      return;
    }

    const validationError = validateReviewer();
    if (validationError) {
      setMessage(validationError);
      return;
    }

    const published = publishReviewerBlueprint(reviewerForm);
    setReviewers(getReviewerBlueprints());
    setMessage(`${published.title} was published to reviewersData.`);
  }

  return (
    <main className="flex h-screen overflow-hidden bg-slate-100">
      <AdminSidebar active={mode} onModeChange={setMode} />

      <div className="flex-1 overflow-y-auto">
        <header className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-wider text-blue-600">Admin Workspace</p>
            <h1 className="text-2xl font-black text-slate-950">Create {mode === "exam" ? "Exam" : "Reviewer"}</h1>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {mode === "exam"
                ? "Build scored questionnaire blocks for students."
                : "Build course-style study modules with readings and video resources."}
            </p>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-6 p-6 lg:grid-cols-[1fr_20rem]">
          <section className="space-y-5">
            {mode === "exam" ? renderExamBuilder() : renderReviewerBuilder()}

            <div className="flex flex-wrap gap-3">
              {mode === "exam" ? (
                <button onClick={addSubject} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-50">
                  <FaPlus /> Add Subject
                </button>
              ) : (
                <button onClick={addReviewerModule} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-50">
                  <FaPlus /> Add Module
                </button>
              )}
              <button onClick={publishItem} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-black text-white hover:bg-blue-800">
                <FaSave /> Publish {mode === "exam" ? "Exam" : "Reviewer"}
              </button>
            </div>
            {message && <p className="rounded-lg bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">{message}</p>}
          </section>

          <aside className="space-y-5">
            <div className="glass-card p-5">
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">Current Draft</p>
              <p className="mt-3 text-3xl font-black text-slate-950">{mode === "exam" ? totalQuestions : reviewerForm.modules.length}</p>
              <p className="text-sm font-semibold text-slate-500">
                {mode === "exam" ? `Questions across ${examForm.sections.length} subjects` : `Modules in ${reviewerForm.subjectCategory}`}
              </p>
            </div>

            <div className="glass-card p-5">
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">Published Exams</p>
              <div className="mt-4 space-y-3">
                {blueprints.length ? blueprints.map((blueprint) => (
                  <div key={blueprint.id} className="rounded-lg border border-slate-200 p-3">
                    <p className="font-black text-slate-900">{blueprint.title}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{blueprint.sections.length} subjects</p>
                  </div>
                )) : <p className="text-sm text-slate-500">No published exams yet.</p>}
              </div>
            </div>

            <div className="glass-card p-5">
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">Published Reviewers</p>
              <div className="mt-4 space-y-3">
                {reviewers.length ? reviewers.map((reviewer) => (
                  <div key={reviewer.id} className="rounded-lg border border-slate-200 p-3">
                    <p className="font-black text-slate-900">{reviewer.title}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{reviewer.modules.length} modules</p>
                  </div>
                )) : <p className="text-sm text-slate-500">No published reviewers yet.</p>}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );

  function renderExamBuilder() {
    return (
      <>
        <div className="glass-card p-6">
          <label className="block">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Exam Title</span>
            <input
              value={examForm.title}
              onChange={(event) => setExamForm((current) => ({ ...current, title: event.target.value }))}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-lg font-black text-slate-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
        </div>

        {examForm.sections.map((section, sectionIndex) => (
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
              {section.questions.map((question, questionIndex) => renderQuestionCard(sectionIndex, questionIndex, question))}
            </div>

            <button onClick={() => addQuestion(sectionIndex)} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50">
              <FaPlus /> Add Question
            </button>
          </article>
        ))}
      </>
    );
  }

  function renderQuestionCard(sectionIndex, questionIndex, question) {
    return (
      <div key={`${sectionIndex}-${questionIndex}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start justify-between gap-3">
          <label className="block flex-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Question Text</span>
            <textarea
              value={question.stem}
              onChange={(event) => updateQuestion(sectionIndex, questionIndex, { stem: event.target.value })}
              className="mt-2 h-24 w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Enter the question..."
            />
          </label>
          <button onClick={() => removeQuestion(sectionIndex, questionIndex)} className="icon-button" aria-label="Remove question">
            <FaTrash />
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_10rem]">
          <label>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Question Type</span>
            <select
              value={question.type}
              onChange={(event) => updateQuestion(sectionIndex, questionIndex, normalizeQuestionType(event.target.value, question))}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="multiple_choice">Multiple Choice</option>
              <option value="checkboxes">Checkboxes</option>
              <option value="short_answer">Short Answer</option>
              <option value="paragraph">Paragraph</option>
            </select>
          </label>
          <label>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Points</span>
            <input
              type="number"
              min="1"
              value={question.points}
              onChange={(event) => updateQuestion(sectionIndex, questionIndex, { points: Number(event.target.value) })}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Diagnostic Subcategory</span>
            <input
              value={question.diagnosticSubcategory || ""}
              onChange={(event) => updateQuestion(sectionIndex, questionIndex, { diagnosticSubcategory: event.target.value })}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Syllogisms, Algebra, Reading Inference"
            />
          </label>
          <label>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Specific Skill Tag</span>
            <input
              value={question.diagnosticSkillTag || ""}
              onChange={(event) => updateQuestion(sectionIndex, questionIndex, { diagnosticSkillTag: event.target.value })}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Double negatives, Rate problems, Main idea"
            />
          </label>
        </div>

        {usesOptions(question.type) ? renderOptionsEditor(sectionIndex, questionIndex, question) : renderTextAnswerKey(sectionIndex, questionIndex, question)}
      </div>
    );
  }

  function renderOptionsEditor(sectionIndex, questionIndex, question) {
    return (
      <>
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

        {question.type === "checkboxes" ? (
          <div className="mt-4">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Correct Answers</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {question.choiceOpts.map((_, optionIndex) => (
                <label key={optionIndex} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600">
                  <input
                    type="checkbox"
                    checked={question.correctAnswers.includes(optionIndex)}
                    onChange={() => updateQuestion(sectionIndex, questionIndex, { correctAnswers: toggleCorrectAnswer(question.correctAnswers, optionIndex) })}
                  />
                  {String.fromCharCode(65 + optionIndex)}
                </label>
              ))}
            </div>
          </div>
        ) : (
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
        )}
      </>
    );
  }

  function renderTextAnswerKey(sectionIndex, questionIndex, question) {
    return (
      <label className="mt-4 block">
        <span className="text-xs font-black uppercase tracking-wider text-slate-500">Answer Key</span>
        <input
          value={question.correctText}
          onChange={(event) => updateQuestion(sectionIndex, questionIndex, { correctText: event.target.value })}
          className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="Exact answer for auto-checking"
        />
      </label>
    );
  }

  function renderReviewerBuilder() {
    return (
      <>
        <div className="glass-card p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_18rem]">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">Reviewer Title</span>
              <input
                value={reviewerForm.title}
                onChange={(event) => setReviewerForm((current) => ({ ...current, title: event.target.value }))}
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-lg font-black text-slate-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">Subject Category</span>
              <input
                value={reviewerForm.subjectCategory}
                onChange={(event) => setReviewerForm((current) => ({ ...current, subjectCategory: event.target.value }))}
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </div>
        </div>

        {reviewerForm.modules.map((module, index) => (
          <article key={module.id} className="glass-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-blue-600">Module {index + 1}</p>
                <h2 className="mt-1 text-xl font-black text-slate-950">Course Chapter</h2>
              </div>
              <button onClick={() => removeReviewerModule(module.id)} className="icon-button" aria-label="Remove module">
                <FaTrash />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Module Title</span>
                <input
                  value={module.title}
                  onChange={(event) => updateReviewerModule(module.id, { title: event.target.value })}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Chapter 1: Cryptanalysis Basics"
                />
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Lecture Content / Reading Material</span>
                <textarea
                  value={module.content}
                  onChange={(event) => updateReviewerModule(module.id, { content: event.target.value })}
                  className="mt-2 min-h-64 w-full resize-y rounded-lg border border-slate-200 px-4 py-3 text-sm leading-relaxed text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Write the lesson, explanations, worked examples, definitions, and review notes here..."
                />
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Video Resource URL or Embed Link</span>
                <input
                  value={module.videoUrl}
                  onChange={(event) => updateReviewerModule(module.id, { videoUrl: event.target.value })}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="https://youtube.com/..."
                />
              </label>
            </div>
          </article>
        ))}
      </>
    );
  }
}

function usesOptions(type) {
  return type === "multiple_choice" || type === "mcq" || type === "checkboxes";
}

function normalizeQuestionType(type, question) {
  return {
    ...question,
    type,
    choiceOpts: usesOptions(type) ? question.choiceOpts : ["", "", "", ""],
    answerIdx: 0,
    correctAnswers: [],
    correctText: ""
  };
}

function toggleCorrectAnswer(currentAnswers, optionIndex) {
  if (currentAnswers.includes(optionIndex)) {
    return currentAnswers.filter((item) => item !== optionIndex);
  }

  return [...currentAnswers, optionIndex];
}
