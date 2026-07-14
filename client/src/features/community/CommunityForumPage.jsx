import { useEffect, useMemo, useState } from "react";
import { FaCommentDots, FaFilter, FaPlus, FaReply, FaSearch } from "react-icons/fa";
import {
  addForumReply,
  createForumThread,
  getCommunityRewardSummary,
  getCurrentUser,
  getForumThreads,
  getLeaderboard,
  toggleForumReaction
} from "../../services/storage";

const POSTS_PER_PAGE = 10;
const reactionOptions = [
  { type: "like", label: "Like", emoji: "👍", activeClass: "border-blue-200 bg-blue-50 text-blue-700" },
  { type: "insightful", label: "Insightful", emoji: "💡", activeClass: "border-amber-200 bg-amber-50 text-amber-700" },
  { type: "fire", label: "Fire", emoji: "🔥", activeClass: "border-rose-200 bg-rose-50 text-rose-700" }
];

export default function CommunityForumPage() {
  const user = getCurrentUser();
  const [threads, setThreads] = useState(() => getForumThreads());
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [topicForm, setTopicForm] = useState({ title: "", body: "", tag: "English / GK" });
  const [replyDrafts, setReplyDrafts] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [page, setPage] = useState(1);

  const summary = useMemo(() => getCommunityRewardSummary(user?.email), [user?.email]);
  const leaderboard = useMemo(() => getLeaderboard(user?.email), [user?.email, summary.totalPoints]);
  const currentRow = leaderboard.find((row) => row.isCurrent);
  const topRows = leaderboard.slice(0, 5);
  const percentile = currentRow && leaderboard.length ? Math.round(((leaderboard.length - currentRow.rank + 1) / leaderboard.length) * 100) : 0;

  const subjectTags = useMemo(() => {
    return [...new Set(threads.map((thread) => thread.tag).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }, [threads]);

  const filteredThreads = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return threads.filter((thread) => {
      const matchesQuery = !query || `${thread.title} ${thread.body}`.toLowerCase().includes(query);
      const matchesTag = tagFilter === "all" || thread.tag === tagFilter;
      return matchesQuery && matchesTag;
    });
  }, [threads, searchTerm, tagFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredThreads.length / POSTS_PER_PAGE));
  const paginatedThreads = filteredThreads.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, tagFilter]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    function refreshThreads() {
      setThreads(getForumThreads());
    }

    window.addEventListener("forumPostsUpdated", refreshThreads);
    window.addEventListener("storage", refreshThreads);
    return () => {
      window.removeEventListener("forumPostsUpdated", refreshThreads);
      window.removeEventListener("storage", refreshThreads);
    };
  }, []);

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

  function toggleReaction(threadId, reactionType) {
    if (!user?.id) return;
    toggleForumReaction(threadId, reactionType, user.id);
    setThreads(getForumThreads());
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header>
        <p className="text-xs font-black uppercase tracking-wider text-blue-600">Community Forum</p>
        <h1 className="text-4xl font-black text-slate-950">Student Discussion Hub</h1>
        <p className="mt-1 text-sm font-semibold text-slate-500">Search, filter, react, and reply without the feed taking over the whole page.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
        <main className="space-y-5">
          <section className="glass-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-950">Paginated Discussion Feed</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">{filteredThreads.length} matching posts, limited to {POSTS_PER_PAGE} per page.</p>
              </div>
              <button onClick={() => setShowTopicForm((value) => !value)} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-black text-white hover:bg-slate-800">
                <FaPlus /> New Topic
              </button>
            </div>

            <div className="mt-5 grid gap-3 xl:grid-cols-[1fr_16rem]">
              <label className="relative block">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Search titles and discussion content..."
                />
              </label>
              <label className="relative block">
                <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={tagFilter}
                  onChange={(event) => setTagFilter(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-black text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="all">All subject tags</option>
                  {subjectTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => setTagFilter("all")} className={`rounded-full border px-3 py-1.5 text-xs font-black ${tagFilter === "all" ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"}`}>
                All
              </button>
              {subjectTags.map((tag) => (
                <button key={tag} type="button" onClick={() => setTagFilter(tag)} className={`rounded-full border px-3 py-1.5 text-xs font-black ${tagFilter === tag ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"}`}>
                  {tag}
                </button>
              ))}
            </div>

            {showTopicForm && (
              <form onSubmit={submitTopic} className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
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
          </section>

          <section className="space-y-4">
            {paginatedThreads.map((thread) => (
              <article key={thread.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-950">{thread.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-slate-400">{thread.author} - {formatElapsed(thread.createdAt)}</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-4 py-1 text-xs font-black text-blue-700">{thread.tag}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{thread.body}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <div className="mr-2 flex items-center gap-2 text-sm font-black text-slate-500"><FaCommentDots /> {thread.replies?.length || 0} Replies</div>
                  <ReactionBar thread={thread} userId={user?.id} onToggle={(reactionType) => toggleReaction(thread.id, reactionType)} />
                </div>

                {!!thread.replies?.length && (
                  <div className="mt-4 max-h-52 space-y-2 overflow-y-auto border-l-2 border-slate-100 pl-4">
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
            {!paginatedThreads.length && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <p className="text-lg font-black text-slate-900">No discussions match your filters.</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">Try another keyword or subject tag.</p>
              </div>
            )}
          </section>

          <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
        </main>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <section className="glass-card p-5">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Global Leaderboard</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">Top 5 Student Scorers</h2>
            <div className="mt-5 space-y-2">
              {topRows.map((row) => <LeaderboardRow key={row.email} row={row} />)}
            </div>
          </section>

          <section className="glass-card border-t-4 border-blue-500 p-5">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Your Standing</p>
            <p className="mt-3 text-4xl font-black text-primary">{percentile}%</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">Estimated percentile in the current local leaderboard.</p>
            {currentRow && (
              <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm font-black text-blue-800">Rank #{currentRow.rank}</p>
                <p className="mt-1 text-xs font-semibold text-blue-700">{currentRow.totalPoints.toLocaleString()} reward points · latest score {currentRow.latestScore}%</p>
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

function ReactionBar({ thread, userId, onToggle }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {reactionOptions.map((reaction) => {
        const state = thread.reactions?.[reaction.type] || { count: 0, userIds: [] };
        const active = Boolean(userId && state.userIds?.includes(userId));
        return (
          <button
            key={reaction.type}
            type="button"
            onClick={() => onToggle(reaction.type)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black transition ${
              active ? reaction.activeClass : "border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            }`}
            aria-label={`${reaction.label} reaction`}
          >
            <span>{reaction.emoji}</span>
            <span>{state.count || 0}</span>
          </button>
        );
      })}
    </div>
  );
}

function PaginationControls({ page, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  return (
    <div className="glass-card flex flex-wrap items-center justify-between gap-3 p-4">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>
      <div className="flex flex-wrap items-center gap-2">
        {pages.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            className={`grid h-9 w-9 place-items-center rounded-lg text-sm font-black transition ${
              page === item ? "bg-primary text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

function LeaderboardRow({ row }) {
  return (
    <div className={`grid grid-cols-[3rem_1fr_4rem] items-center gap-3 rounded-lg px-3 py-3 text-sm font-black ${row.isCurrent ? "border border-blue-200 bg-blue-50 text-blue-700" : "bg-slate-50 text-slate-700"}`}>
      <span className={row.rank === 1 ? "text-yellow-500" : "text-slate-500"}>#{row.rank}</span>
      <span className="truncate">{row.isCurrent ? `You (${row.name})` : row.name}</span>
      <span className="text-right">{row.latestScore}%</span>
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
