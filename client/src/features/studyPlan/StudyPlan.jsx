import { motion } from "framer-motion";
import { FaSyncAlt } from "react-icons/fa";

export default function StudyPlan({ items }) {
  if (!items.length) {
    return null;
  }

  return (
    <section id="plan" className="space-y-6">
      <header>
        <h2 className="text-3xl font-black text-slate-950">Adaptive AI Study Plan</h2>
        <p className="mt-1 text-sm text-slate-500">A living curriculum that recalculates from exam data.</p>
      </header>

      <div className="glass-card flex items-center gap-4 border-indigo-200 bg-indigo-50 p-5">
        <div className="rounded-full bg-indigo-100 p-3 text-indigo-700">
          <FaSyncAlt />
        </div>
        <div>
          <h4 className="font-bold text-indigo-950">Curriculum Recalculated</h4>
          <p className="mt-1 text-sm text-indigo-700">Abstract Reasoning time was reduced, and Logical Syllogisms was inserted for Thursday.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item, index) => (
          <motion.article
            key={`${item.day}-${item.title}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className={`glass-card p-6 ${item.status === "today" ? "border-2 border-blue-500" : ""}`}
          >
            <span className="text-xs font-black uppercase tracking-wider text-blue-600">{item.day}</span>
            <h3 className="mt-2 text-xl font-black text-slate-950">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.detail}</p>
            {item.detailHtml && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700" dangerouslySetInnerHTML={{ __html: item.detailHtml }} />
            )}
            {!!item.focusAreas?.length && (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.focusAreas.map((focus) => (
                  <span key={focus} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                    {focus}
                  </span>
                ))}
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </section>
  );
}
