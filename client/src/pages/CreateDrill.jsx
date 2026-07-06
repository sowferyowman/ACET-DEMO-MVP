import { useMemo, useState } from "react";
import { FaBolt, FaSave } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";
import PremiumRichTextEditor from "../components/PremiumRichTextEditor";
import { getDrillBankQuestions, publishDrillQuestion } from "../services/storage";

const subjectOptions = ["Mathematics", "Logical Reasoning", "Science", "English", "Reading Comprehension", "General Knowledge"];

const emptyForm = {
  questionType: "multiple_choice",
  type: "multiple_choice",
  stem: "",
  choiceOpts: ["", "", "", ""],
  answerIdx: 0,
  correctAnswers: [],
  correctText: "",
  gradingPlaceholder: "",
  subjectTitle: "Mathematics",
  diagnosticSubcategory: "",
  diagnosticSkillTag: "",
  explanation: ""
};

export default function CreateDrill() {
  const [form, setForm] = useState(emptyForm);
  const [drillBank, setDrillBank] = useState(() => getDrillBankQuestions());
  const [message, setMessage] = useState("");

  const subjectCounts = useMemo(() => {
    return drillBank.reduce((counts, question) => {
      counts[question.subjectTitle] = (counts[question.subjectTitle] || 0) + 1;
      return counts;
    }, {});
  }, [drillBank]);

  function updateOption(index, value) {
    setForm((current) => ({
      ...current,
      choiceOpts: current.choiceOpts.map((option, optionIndex) => (optionIndex === index ? value : option))
    }));
  }

  function updateQuestionType(questionType) {
    setForm((current) => ({
      ...current,
      questionType,
      type: questionType,
      choiceOpts: usesOptions(questionType) ? current.choiceOpts : ["", "", "", ""],
      answerIdx: 0,
      correctAnswers: [],
      correctText: "",
      gradingPlaceholder: questionType === "paragraph" ? current.gradingPlaceholder : ""
    }));
  }

  function validateForm() {
    if (!stripHtml(form.stem)) return "Question text is required.";
    if (usesOptions(form.questionType) && form.choiceOpts.some((option) => !option.trim())) return "Options A, B, C, and D are required.";
    if (form.questionType === "checkboxes" && !form.correctAnswers.length) return "Checkbox questions need at least one correct answer.";
    if (form.questionType === "short_answer" && !form.correctText.trim()) return "Short Answer needs a correct keyphrase answer.";
    if (form.questionType === "paragraph" && !form.gradingPlaceholder.trim()) return "Long Paragraph needs a descriptive grading placeholder.";
    if (!form.subjectTitle.trim()) return "Subject category is required.";
    if (!form.diagnosticSubcategory.trim()) return "Sub-category is required.";
    if (!form.diagnosticSkillTag.trim()) return "Specific weakness tag is required.";
    return "";
  }

  function publishDrill() {
    const validationError = validateForm();
    if (validationError) {
      setMessage(validationError);
      return;
    }

    const published = publishDrillQuestion({
      ...form,
      type: form.questionType,
      questionType: form.questionType,
      questionHtml: form.stem,
      choiceOpts: usesOptions(form.questionType) ? form.choiceOpts.map((option) => option.trim()) : [],
      answerIdx: form.questionType === "multiple_choice" ? form.answerIdx : 0,
      correctAnswers: form.questionType === "checkboxes" ? form.correctAnswers : [],
      correctText: form.questionType === "short_answer" ? form.correctText.trim() : form.gradingPlaceholder.trim(),
      diagnosticSubcategory: form.diagnosticSubcategory.trim(),
      diagnosticSkillTag: form.diagnosticSkillTag.trim(),
      category: form.subjectTitle,
      subCategory: form.diagnosticSubcategory.trim(),
      weaknessTag: form.diagnosticSkillTag.trim(),
      structuralTags: {
        category: form.subjectTitle,
        subCategory: form.diagnosticSubcategory.trim(),
        weaknessTag: form.diagnosticSkillTag.trim(),
        path: [form.subjectTitle, form.diagnosticSubcategory.trim(), form.diagnosticSkillTag.trim()]
      }
    });

    setDrillBank(getDrillBankQuestions());
    setForm({ ...emptyForm, subjectTitle: form.subjectTitle });
    setMessage(`Published drill question to drillBankData under ${published.subjectTitle} -> ${published.diagnosticSubcategory} -> ${published.diagnosticSkillTag}.`);
  }

  function renderAnswerWorkspace() {
    if (usesOptions(form.questionType)) {
      return (
        <>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {form.choiceOpts.map((option, index) => (
              <label key={index} className="block">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Option {String.fromCharCode(65 + index)}</span>
                <input
                  value={option}
                  onChange={(event) => updateOption(index, event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder={`Choice ${String.fromCharCode(65 + index)}`}
                />
              </label>
            ))}
          </div>

          {form.questionType === "checkboxes" ? (
            <div className="mt-5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">Correct Answers</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {form.choiceOpts.map((_, optionIndex) => (
                  <label key={optionIndex} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 shadow-sm">
                    <input
                      type="checkbox"
                      checked={form.correctAnswers.includes(optionIndex)}
                      onChange={() => setForm((current) => ({ ...current, correctAnswers: toggleCorrectAnswer(current.correctAnswers, optionIndex) }))}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    Option {String.fromCharCode(65 + optionIndex)}
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <label className="mt-5 block">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">Correct Answer Index</span>
              <select
                value={form.answerIdx}
                onChange={(event) => setForm((current) => ({ ...current, answerIdx: Number(event.target.value) }))}
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                {form.choiceOpts.map((_, index) => (
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

    if (form.questionType === "short_answer") {
      return (
        <label className="mt-5 block">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">Correct Keyphrase Answer</span>
          <input
            value={form.correctText}
            onChange={(event) => setForm((current) => ({ ...current, correctText: event.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="Exact keyphrase students must enter"
          />
        </label>
      );
    }

    return (
      <label className="mt-5 block">
        <span className="text-xs font-black uppercase tracking-wider text-slate-500">Open-Ended Grading Placeholder</span>
        <textarea
          value={form.gradingPlaceholder}
          onChange={(event) => setForm((current) => ({ ...current, gradingPlaceholder: event.target.value }))}
          className="mt-2 min-h-28 w-full resize-y rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="Describe the expected reasoning, rubric, or evaluator notes for this long paragraph response."
        />
      </label>
    );
  }

  return (
    <main className="flex h-screen overflow-hidden bg-slate-100">
      <AdminSidebar active="drill" />

      <div className="flex-1 overflow-y-auto">
        <header className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-wider text-blue-600">Admin Workspace</p>
            <h1 className="text-2xl font-black text-slate-950">Create Drill</h1>
            <p className="mt-1 text-sm font-semibold text-slate-500">Publish remediation-only questions into drillBankData for student weakness practice.</p>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-6 p-6 lg:grid-cols-[1fr_20rem]">
          <section className="space-y-5">
            <div className="glass-card p-6">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Question Text</span>
                <PremiumRichTextEditor
                  value={form.stem}
                  onChange={(value) => setForm((current) => ({ ...current, stem: value }))}
                  placeholder="Write the drill question here with equations, media, links, highlights, and formatted passages..."
                />
              </label>
            </div>

            <div className="glass-card p-6">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Question Type</span>
                <select
                  value={form.questionType}
                  onChange={(event) => updateQuestionType(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="checkboxes">Checkbox</option>
                  <option value="short_answer">Short Answer</option>
                  <option value="paragraph">Long Paragraph</option>
                </select>
              </label>

              {renderAnswerWorkspace()}
            </div>

            <div className="glass-card p-6">
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">Mandatory AI Classification Metadata</p>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Subject Category</span>
                  <select
                    value={form.subjectTitle}
                    onChange={(event) => setForm((current) => ({ ...current, subjectTitle: event.target.value }))}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    {subjectOptions.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Sub-Category</span>
                  <input
                    value={form.diagnosticSubcategory}
                    onChange={(event) => setForm((current) => ({ ...current, diagnosticSubcategory: event.target.value }))}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    placeholder="Syllogisms, Geometry"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Specific Weakness Tag</span>
                  <input
                    value={form.diagnosticSkillTag}
                    onChange={(event) => setForm((current) => ({ ...current, diagnosticSkillTag: event.target.value }))}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    placeholder="Double Negatives"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={publishDrill} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-black text-white hover:bg-blue-800">
                <FaSave /> Publish to Drill Bank
              </button>
            </div>
            {message && <p className="rounded-lg bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">{message}</p>}
          </section>

          <aside className="space-y-5">
            <div className="glass-card p-5">
              <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-3 text-blue-700">
                <FaBolt />
              </div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">Drill Bank</p>
              <p className="mt-3 text-3xl font-black text-slate-950">{drillBank.length}</p>
              <p className="text-sm font-semibold text-slate-500">Questions in drillBankData</p>
            </div>

            <div className="glass-card p-5">
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">Subject Coverage</p>
              <div className="mt-4 space-y-3">
                {Object.keys(subjectCounts).length ? Object.entries(subjectCounts).map(([subject, count]) => (
                  <div key={subject} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                    <p className="text-sm font-black text-slate-900">{subject}</p>
                    <p className="text-xs font-black text-blue-600">{count}</p>
                  </div>
                )) : <p className="text-sm text-slate-500">No drill questions published yet.</p>}
              </div>
            </div>

            <div className="glass-card p-5">
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">Latest Drill Items</p>
              <div className="mt-4 space-y-3">
                {drillBank.slice(0, 4).map((question) => (
                  <div key={question.id} className="rounded-lg border border-slate-200 p-3">
                    <p className="line-clamp-2 text-sm font-black text-slate-900">{stripHtml(question.stem)}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{question.subjectTitle} / {question.diagnosticSubcategory} / {formatQuestionType(question.questionType || question.type)}</p>
                  </div>
                ))}
                {!drillBank.length && <p className="text-sm text-slate-500">Published drill questions will appear here.</p>}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function usesOptions(type) {
  return type === "multiple_choice" || type === "mcq" || type === "checkboxes";
}

function toggleCorrectAnswer(currentAnswers, optionIndex) {
  if (currentAnswers.includes(optionIndex)) {
    return currentAnswers.filter((item) => item !== optionIndex);
  }

  return [...currentAnswers, optionIndex];
}

function formatQuestionType(type) {
  if (type === "checkboxes") return "Checkbox";
  if (type === "short_answer") return "Short Answer";
  if (type === "paragraph") return "Long Paragraph";
  return "Multiple Choice";
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
