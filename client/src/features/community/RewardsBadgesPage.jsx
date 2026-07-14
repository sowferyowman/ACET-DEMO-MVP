import { useMemo } from "react";
import { FaAward, FaBolt, FaCheckCircle, FaLock, FaMedal, FaTrophy } from "react-icons/fa";
import { getCommunityRewardSummary, getCurrentUser } from "../../services/storage";

const badgeCatalog = [
  { title: "Exam Completionist", description: "Finished every available mock exam.", points: 500, icon: FaTrophy },
  { title: "Reviewer Master", description: "Completed every published reviewer module.", points: 400, icon: FaAward },
  { title: "Speed Demon", description: "Finished a mock exam far faster than the current average.", points: 350, icon: FaBolt },
  { title: "Consistency Streak", description: "Keep returning to build study momentum.", points: 250, icon: FaMedal },
  { title: "Weakness Warrior", description: "Complete focused remediation drills.", points: 300, icon: FaCheckCircle },
  { title: "Forum Contributor", description: "Help classmates through the discussion forum.", points: 150, icon: FaAward }
];

const milestones = [
  { label: "Getting Started", target: 500 },
  { label: "Rising Scholar", target: 1000 },
  { label: "Blue Eagle", target: 2500 },
  { label: "Magis Elite", target: 5000 }
];

export default function RewardsBadgesPage() {
  const user = getCurrentUser();
  const summary = useMemo(() => getCommunityRewardSummary(user?.email), [user?.email]);
  const unlockedTitles = new Set(summary.badges.map((badge) => badge.title));
  const unlockedBadges = badgeCatalog.filter((badge) => unlockedTitles.has(badge.title));
  const lockedBadges = badgeCatalog.filter((badge) => !unlockedTitles.has(badge.title));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header>
        <p className="text-xs font-black uppercase tracking-wider text-blue-600">Rewards & Badges</p>
        <h1 className="text-4xl font-black text-slate-950">Achievement Showcase</h1>
        <p className="mt-1 text-sm font-semibold text-slate-500">Track points, unlocked badges, locked goals, and the next milestone worth chasing.</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50 p-6">
            <p className="text-sm font-black uppercase tracking-wider text-slate-500">Total Study Points</p>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <p className="text-7xl font-black text-yellow-500">{summary.totalPoints.toLocaleString()}</p>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-600 shadow-sm">{summary.tier.label}</span>
            </div>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-200">
              <div className={`h-full ${summary.tier.color}`} style={{ width: `${summary.tier.percent}%` }} />
            </div>
          </div>

          <div className="grid gap-3 p-6 md:grid-cols-3">
            <MetricCard label="Mock Exams" value={`${summary.mockPoints} pts`} />
            <MetricCard label="Reviewers" value={`${summary.reviewerPoints} pts`} />
            <MetricCard label="Badges" value={`${summary.badgePoints} pts`} />
          </div>
        </div>

        <div className="glass-card p-6">
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">Milestone Ladder</p>
          <div className="mt-5 space-y-3">
            {milestones.map((milestone) => {
              const complete = summary.totalPoints >= milestone.target;
              const percent = Math.min(100, Math.round((summary.totalPoints / milestone.target) * 100));
              return (
                <div key={milestone.label} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-slate-900">{milestone.label}</p>
                    <p className={`text-xs font-black ${complete ? "text-emerald-600" : "text-slate-400"}`}>{complete ? "Unlocked" : `${milestone.target.toLocaleString()} pts`}</p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className={complete ? "h-full bg-emerald-500" : "h-full bg-blue-500"} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <BadgeSection title="Unlocked Badges" emptyText="No badges unlocked yet. Finish exams and reviewer modules to start the collection." badges={unlockedBadges} locked={false} />
        <BadgeSection title="Locked Badges" emptyText="All catalog badges are unlocked." badges={lockedBadges} locked />
      </section>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function BadgeSection({ title, emptyText, badges, locked }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-black text-slate-950">{title}</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">{badges.length}</span>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {badges.map((badge) => {
          const Icon = locked ? FaLock : badge.icon;
          return (
            <article key={badge.title} className={`rounded-xl border p-5 ${locked ? "border-slate-200 bg-slate-50 text-slate-500" : "border-yellow-200 bg-yellow-50 text-slate-900"}`}>
              <div className={`grid h-11 w-11 place-items-center rounded-xl ${locked ? "bg-white text-slate-400" : "bg-yellow-100 text-yellow-700"}`}>
                <Icon />
              </div>
              <h3 className="mt-4 text-base font-black">{badge.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-6">{badge.description}</p>
              <p className={`mt-4 text-xs font-black ${locked ? "text-slate-400" : "text-yellow-700"}`}>+{badge.points} points</p>
            </article>
          );
        })}
      </div>
      {!badges.length && <p className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm font-semibold text-slate-500">{emptyText}</p>}
    </div>
  );
}
