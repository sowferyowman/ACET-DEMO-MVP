import { Link } from "react-router-dom";
import { FaAward, FaBolt, FaCheckCircle, FaLock, FaMedal, FaPlay, FaTrophy } from "react-icons/fa";
import { getCommunityRewardSummary, getCurrentUser } from "../../services/storage";

const badgeCatalog = [
  { title: "Exam Completionist", description: "Finish every available mock exam.", points: 500, icon: FaTrophy },
  { title: "Reviewer Master", description: "Complete every published reviewer module.", points: 400, icon: FaAward },
  { title: "Speed Demon", description: "Finish an exam far faster than your average pace.", points: 350, icon: FaBolt },
  { title: "Consistency Streak", description: "Keep returning to build steady study momentum.", points: 250, icon: FaMedal },
  { title: "Weakness Warrior", description: "Complete focused remediation drills.", points: 300, icon: FaCheckCircle }
];

const milestones = [
  { title: "Getting Started", target: 250 },
  { title: "Rising Scholar", target: 1000 },
  { title: "Blue Eagle", target: 2500 },
  { title: "Magis Elite", target: 5000 }
];

export default function RewardsBadgesPage() {
  const user = getCurrentUser();
  const summary = getCommunityRewardSummary(user?.email);
  const unlockedTitles = new Set(summary.badges.map((badge) => badge.title));
  const unlockedBadges = badgeCatalog.filter((badge) => unlockedTitles.has(badge.title));
  const lockedBadges = badgeCatalog.filter((badge) => !unlockedTitles.has(badge.title));

  return (
    <div className="min-h-screen bg-amber-50/50 px-5 py-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <p className="text-xs font-black uppercase tracking-wider text-amber-700">Rewards & Badges</p>
          <h1 className="mt-1 text-4xl font-black text-slate-950">Achievement Showcase</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">Track study points, unlocked badges, locked goals, and next milestones.</p>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Total Study Points</p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <p className="text-7xl font-black text-amber-500">{summary.totalPoints.toLocaleString()}</p>
              <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-black text-amber-700">{summary.tier.label}</span>
            </div>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-200">
              <div className={summary.tier.color} style={{ width: `${summary.tier.percent}%`, height: "100%" }} />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <PointCard label="Mock Exams" value={summary.mockPoints} />
              <PointCard label="Reviewers" value={summary.reviewerPoints} />
              <PointCard label="Badges" value={summary.badgePoints} />
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Milestone Ladder</p>
            <div className="mt-5 space-y-4">
              {milestones.map((milestone) => {
                const complete = summary.totalPoints >= milestone.target;
                const percent = Math.min(100, Math.round((summary.totalPoints / milestone.target) * 100));
                return (
                  <div key={milestone.title} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-black text-slate-900">{milestone.title}</p>
                      <span className={`text-xs font-black ${complete ? "text-emerald-600" : "text-slate-400"}`}>
                        {complete ? "Unlocked" : `${milestone.target.toLocaleString()} pts`}
                      </span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className={complete ? "h-full bg-emerald-500" : "h-full bg-amber-400"} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <BadgeSection title="Unlocked Badges" badges={unlockedBadges} emptyText="No badges unlocked yet. Finish exams and reviewer modules to start the collection." locked={false} />
          <BadgeSection title="Locked Badges" badges={lockedBadges} emptyText="All badges unlocked." locked />
        </section>

        {!summary.totalPoints && (
          <div className="rounded-2xl border border-dashed border-amber-300 bg-white p-8 text-center">
            <h2 className="text-2xl font-black text-slate-950">No reward points yet</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">Complete your first mock exam to start earning points.</p>
            <Link to="/exam" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800">
              <FaPlay /> Start Exam
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function PointCard({ label, value }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value.toLocaleString()} pts</p>
    </div>
  );
}

function BadgeSection({ title, badges, emptyText, locked }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-950">{title}</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">{badges.length}</span>
      </div>
      {badges.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <article key={badge.title} className={`rounded-xl border p-4 ${locked ? "border-slate-200 bg-slate-50 opacity-75" : "border-amber-200 bg-amber-50"}`}>
                <div className="flex items-start gap-3">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${locked ? "bg-slate-200 text-slate-500" : "bg-amber-500 text-white"}`}>
                    {locked ? <FaLock /> : <Icon />}
                  </span>
                  <div>
                    <h3 className="font-black text-slate-900">{badge.title}</h3>
                    <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{badge.description}</p>
                    <p className={`mt-3 text-xs font-black ${locked ? "text-slate-400" : "text-amber-700"}`}>+{badge.points} points</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm font-semibold text-slate-500">
          {emptyText}
        </div>
      )}
    </div>
  );
}
