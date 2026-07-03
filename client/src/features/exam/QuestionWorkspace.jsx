import { useForm } from "react-hook-form";

export default function QuestionWorkspace({ section, question, questionIndex, response, onSaveResponse }) {
  const { register, watch } = useForm({ values: { essay: response || "" } });
  const essay = watch("essay") || "";

  return (
    <section className="glass-card p-6">
      <p className="text-xs font-black uppercase tracking-wider text-blue-600">
        {section.subjectTitle} - Item {questionIndex + 1} of {section.questions.length}
      </p>
      <div className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
        {question.type === "essay" ? "Written Essay" : "Multiple Choice"}
      </div>
      <h2 className="mt-6 text-2xl font-black leading-snug text-slate-950">{question.stem}</h2>

      {question.type === "mcq" ? (
        <div className="mt-8 space-y-3">
          {question.choiceOpts.map((option, index) => (
            <button
              key={option}
              onClick={() => onSaveResponse(index)}
              className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left font-medium transition hover:bg-slate-50 ${
                response === index ? "border-primary bg-blue-50 text-primary ring-2 ring-blue-900/10" : "border-slate-200 text-slate-700"
              }`}
            >
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs font-bold ${response === index ? "border-primary bg-primary text-white" : "border-slate-200 bg-slate-50 text-slate-400"}`}>
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <textarea
            {...register("essay", { onChange: (event) => onSaveResponse(event.target.value) })}
            className="h-72 w-full resize-none rounded-xl border-2 border-slate-200 p-5 font-medium leading-relaxed text-slate-700 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            placeholder="Begin typing your essay response here..."
          />
          <p className="mt-2 text-right text-xs font-bold text-slate-400">
            {essay.trim().split(/\s+/).filter(Boolean).length} Words
          </p>
        </div>
      )}
    </section>
  );
}
