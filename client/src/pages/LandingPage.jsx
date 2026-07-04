import { Link } from "react-router-dom";
import { FaArrowRight, FaChartLine, FaShieldAlt, FaUserGraduate } from "react-icons/fa";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-blue-300">Exam platform</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-tight md:text-7xl">EXAMS.PH</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
            >
              Get Started / Login <FaArrowRight />
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {[
            { icon: FaShieldAlt, title: "Exam Control", text: "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim" },
            { icon: FaUserGraduate, title: "Student Workspace", text: "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim" },
            { icon: FaChartLine, title: "Dashboard Sync", text: "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim" }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-lg border border-white/10 bg-white/5 p-6">
                <Icon className="text-2xl text-blue-300" />
                <h2 className="mt-4 text-xl font-black">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
