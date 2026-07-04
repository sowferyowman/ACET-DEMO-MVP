import { useMemo, useState } from "react";
import { FaAward, FaCommentDots, FaMedal, FaPlus, FaReply, FaTrophy } from "react-icons/fa";
import {
  addForumReply,
  createForumThread,
  getCommunityRewardSummary,
  getCurrentUser,
  getForumThreads,
  getLeaderboard
} from "../../services/storage";

export default function CommunityRewards() {
  const user = getCurrentUser();
  const [threads, setThreads] = useState(() => getForumThreads());
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [topicForm, setTopicForm] = useState({ title: "", body: "", tag: "English / GK" });
  const [replyDrafts, setReplyDrafts] = useState({});

  const summary = useMemo(() => getCommunityRewardSummary(user?.email), [user?.email]);
  const leaderboard = useMemo(() => getLeaderboard(user?.email), [user?.email, summary.totalPoints]);
  const currentRow = leaderboard.find((row) => row.isCurrent);
  const topRows = leaderboard.slice(0, 5);

  function submitTopic(event) {
    event.preventDefault();
    if (!topicForm.title.trim() || !topicForm.body.trim()) return;
    createForumThread(user, topicForm);
    setThreads(getForumThreads());
    setTopicForm({ title: "", body: "", tag: "English / GK" });
    setShowTopicForm(false);
  }

  function submitReply(threadId) {
    const body = replyDrafts[threadId];
    if (!body?.trim()) return;
    addForumReply(user, threadId, body);
    setThreads(getForumThreads());
    setReplyDrafts((current) => ({ ...current, [threadId]: "" }));
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header>
        <h1 className="text-4xl font-black text-slate-950">Community & Rewards</h1>
        <p className="mt-1 text-sm text-slate-500">Reward points, achievement badges, global ranking, and ACET peer discussion.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[30rem_1fr]">
        <aside className="space-y-6">
          <section className="glass-card border-t-8 border-yellow-400 p-8 text-center">
            <p className="text-sm font-black uppercase tracking-wider text-slate-500">Total Reward Points</p>
            <p className="mt-4 text-7xl font-black text-yellow-500">{summary.totalPoints.toLocaleString()}</p>
            <p className="mx-auto mt-3 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-500">{summary.tier.label}</p>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-200">
              <div className={`h-full ${summary.tier.color}`} style={{ width: `${summary.tier.percent}%` }} />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs font-bold text-slate-500">
              <div className="rounded-lg bg-slate-50 p-3">Mock<br />{summary.mockPoints} pts</div>
              <div className="rounded-lg bg-slate-50 p-3">Reviewer<br />{summary.reviewerPoints} pts</div>
              <div className="rounded-lg bg-slate-50 p-3">Badges<br />{summary.badgePoints} pts</div>
            </div>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-lg font-black text-slate-950">Recent Badges</h2>
            <div className="mt-4 space-y-3">
              {summary.badges.length ? summary.badges.map((badge) => (
                <div key={badge.title} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="rounded-lg bg-yellow-100 p-3 text-yellow-700"><FaAward /></div>
                  <div>
                    <p className="font-black text-slate-950">{badge.title}</p>
                    <p className="text-sm font-semibold text-slate-500">+{badge.points} pts - {badge.description}</p>
                  </div>
                </div>
              )) : (
                <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">No badges unlocked yet. Finish exams and reviewer modules to unlock rewards.</p>
              )}
            </div>
          </section>
        </aside>

        <main className="glass-card p-6">
          <section className="border-b border-slate-200 pb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-slate-950">ACET Discussion Forum</h2>
              <button onClick={() => setShowTopicForm((value) => !value)} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-black text-white hover:bg-slate-800">
                <FaPlus /> New Topic
              </button>
            </div>

            {showTopicForm && (
              <form onSubmit={submitTopic} className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="grid gap-3 md:grid-cols-[1fr_12rem]">
                  <input
                    value={topicForm.title}
                    onChange={(event) => setTopicForm((current) => ({ ...current, title: event.target.value }))}
                    className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    placeholder="Topic title"
                  />
                  <input
                    value={topicForm.tag}
                    onChange={(event) => setTopicForm((current) => ({ ...current, tag: event.target.value }))}
                    className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    placeholder="Tag"
                  />
                </div>
                <textarea
                  value={topicForm.body}
                  onChange={(event) => setTopicForm((current) => ({ ...current, body: event.target.value }))}
                  className="mt-3 h-24 w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="What do you want to discuss?"
                />
                <button className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-black text-white hover:bg-blue-800">Post Topic</button>
              </form>
            )}

            <div className="mt-5 space-y-4">
              {threads.map((thread) => (
                <article key={thread.id} className="rounded-lg border border-slate-200 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black text-slate-950">{thread.title}</h3>
                      <p className="mt-1 text-sm font-semibold text-slate-400">{thread.author} - {formatElapsed(thread.createdAt)}</p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-4 py-1 text-xs font-black text-blue-700">{thread.tag}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{thread.body}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-black text-slate-500"><FaCommentDots /> {thread.replies?.length || 0} Replies</div>

                  {!!thread.replies?.length && (
                    <div className="mt-4 space-y-2 border-l-2 border-slate-100 pl-4">
                      {thread.replies.map((reply) => (
                        <div key={reply.id} className="rounded bg-slate-50 p-3 text-sm">
                          <p className="font-black text-slate-800">{reply.author} <span className="font-semibold text-slate-400">- {formatElapsed(reply.createdAt)}</span></p>
                          <p className="mt-1 text-slate-600">{reply.body}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <input
                      value={replyDrafts[thread.id] || ""}
                      onChange={(event) => setReplyDrafts((current) => ({ ...current, [thread.id]: event.target.value }))}
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      placeholder="Write a reply..."
                    />
                    <button onClick={() => submitReply(thread.id)} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white hover:bg-slate-800">
                      <FaReply /> Reply
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="pt-8">
            <h2 className="text-2xl font-black text-slate-950">Global Leaderboard (Top 5)</h2>
            <div className="mt-5 space-y-2">
              {topRows.map((row) => <LeaderboardRow key={row.email} row={row} />)}
            </div>
            {currentRow && !topRows.some((row) => row.email === currentRow.email) && (
              <div className="mt-5 border-t border-slate-200 pt-4">
                <LeaderboardRow row={currentRow} forceCurrent />
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function LeaderboardRow({ row, forceCurrent = false }) {
  const current = row.isCurrent || forceCurrent;
  return (
    <div className={`grid grid-cols-[4rem_1fr_5rem_7rem] items-center gap-3 rounded-lg px-4 py-3 text-sm font-black ${current ? "border border-blue-200 bg-blue-50 text-blue-700" : "text-slate-700"}`}>
      <span className={row.rank === 1 ? "text-yellow-500" : "text-slate-500"}>#{row.rank}</span>
      <span>{current ? `You (${row.name})` : row.name}</span>
      <span>{row.latestScore}%</span>
      <span className="text-right">{row.totalPoints.toLocaleString()} pts</span>
    </div>
  );
}

function formatElapsed(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.max(1, Math.round(diffMs / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
