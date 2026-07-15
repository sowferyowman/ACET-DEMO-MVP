import { useEffect, useMemo, useState } from "react";
import { FaCommentDots, FaFilter, FaPlus, FaReply, FaSearch, FaAward, FaUserCircle, FaFire, FaRegLightbulb, FaThumbsUp } from "react-icons/fa";
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
  { type: "like", label: "Like", emoji: "👍", activeClass: "border-slate-700/50 bg-blue-600/20 text-blue-200" },
  { type: "insightful", label: "Insightful", emoji: "💡", activeClass: "border-slate-700/50 bg-amber-600/20 text-amber-200" },
  { type: "fire", label: "Fire", emoji: "🔥", activeClass: "border-slate-700/50 bg-rose-600/20 text-rose-200" }
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
    // Beautiful Ateneo Deep Blue Background Gradient
    <div className="relative min-h-screen bg-gradient-to-b from-[#00152b] via-[#002142] to-[#001124] px-6 py-10 text-white overflow-hidden">
      
      {/* Dynamic ambient blue glow to match landing page aesthetics */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute top-[400px] right-0 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl space-y-8">
        
        {/* Header - Subtle Gray Divider */}
        <header className="border-b border-slate-800/60 pb-6">
          <h1 className="mt-1 text-4xl font-black tracking-tight text-white md:text-5xl">
            Student Discussion Hub
          </h1>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
          <main className="space-y-6">
            
            {/* Interactive Directory Section - Neutral Gray Border */}
            <section className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-[#001c38]/50 p-6 backdrop-blur-xl shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wider text-blue-300">Interactive Directory</h2>
                  <p className="text-xs text-blue-200/60">Filter topics by keywords or subject domains</p>
                </div>
                <button 
                  onClick={() => setShowTopicForm((value) => !value)} 
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]"
                >
                  <FaPlus className="text-[10px]" /> New Topic
                </button>
              </div>

              {/* Inputs styled with subtle gray borders */}
              <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_16rem]">
                <label className="relative block">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full rounded-xl border border-slate-800/50 bg-[#001329]/95 py-3.5 pl-11 pr-4 text-sm font-semibold text-white placeholder-slate-500 outline-none transition focus:border-slate-700"
                    placeholder="Search titles and discussion content..."
                  />
                </label>
                <label className="relative block">
                  <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <select
                    value={tagFilter}
                    onChange={(event) => setTagFilter(event.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-800/50 bg-[#001329]/95 py-3.5 pl-11 pr-4 text-sm font-black text-blue-100 outline-none transition focus:border-slate-700"
                  >
                    <option value="all">All subject tags</option>
                    {subjectTags.map((tag) => (
                      <option key={tag} value={tag} className="bg-[#001329]">
                        {tag}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Tag Badges - Subtle Gray Divider */}
              <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-800/40 pt-4">
                <button 
                  type="button" 
                  onClick={() => setTagFilter("all")} 
                  className={`rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-wider transition ${tagFilter === "all" ? "border-slate-700 bg-blue-900/30 text-blue-200" : "border-slate-800/40 bg-[#001124]/50 text-blue-300/60 hover:bg-[#001329] hover:text-white"}`}
                >
                  All
                </button>
                {subjectTags.map((tag) => (
                  <button 
                    key={tag} 
                    type="button" 
                    onClick={() => setTagFilter(tag)} 
                    className={`rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-wider transition ${tagFilter === tag ? "border-slate-700 bg-blue-900/30 text-blue-200" : "border-slate-800/40 bg-[#001124]/50 text-blue-300/60 hover:bg-[#001329] hover:text-white"}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Topic Form - Subtle Gray Borders */}
              {showTopicForm && (
                <form onSubmit={submitTopic} className="mt-6 rounded-xl border border-slate-800/60 bg-[#001329]/90 p-5 shadow-inner">
                  <div className="grid gap-4 md:grid-cols-[1fr_12rem]">
                    <input
                      value={topicForm.title}
                      onChange={(event) => setTopicForm((current) => ({ ...current, title: event.target.value }))}
                      className="rounded-xl border border-slate-800/50 bg-[#000e20] px-4 py-3 text-sm font-bold text-white placeholder-slate-600 outline-none focus:border-slate-700"
                      placeholder="Topic title"
                    />
                    <input
                      value={topicForm.tag}
                      onChange={(event) => setTopicForm((current) => ({ ...current, tag: event.target.value }))}
                      className="rounded-xl border border-slate-800/50 bg-[#000e20] px-4 py-3 text-sm font-bold text-white placeholder-slate-600 outline-none focus:border-slate-700"
                      placeholder="Tag (e.g., Mathematics)"
                    />
                  </div>
                  <textarea
                    value={topicForm.body}
                    onChange={(event) => setTopicForm((current) => ({ ...current, body: event.target.value }))}
                    className="mt-3 h-28 w-full resize-none rounded-xl border border-slate-800/50 bg-[#000e20] px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-slate-700"
                    placeholder="What do you want to discuss with your fellow Ateneans?"
                  />
                  <div className="mt-3 flex justify-end">
                    <button className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-blue-500 active:scale-[0.98]">
                      Post Topic
                    </button>
                  </div>
                </form>
              )}
            </section>

            {/* Thread Posts - Outlined with faint slate-800 gray borders */}
            <section className="space-y-4">
              {paginatedThreads.map((thread) => (
                <article 
                  key={thread.id} 
                  className="group relative overflow-hidden rounded-2xl border border-slate-800/60 bg-[#001c38]/30 p-6 shadow-md transition duration-300 hover:border-slate-700 hover:bg-[#001c38]/40"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#001329] text-blue-300 border border-slate-800/40">
                        <FaUserCircle className="text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-white group-hover:text-blue-300 transition-colors">
                          {thread.title}
                        </h3>
                        <p className="mt-0.5 text-xs font-semibold text-blue-300/50">
                          {thread.author} <span className="mx-1 text-slate-700">•</span> {formatElapsed(thread.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-blue-950/60 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-blue-300/70 border border-slate-800/30">
                      {thread.tag}
                    </span>
                  </div>
                  
                  <p className="mt-4 text-sm leading-relaxed text-blue-100/90">
                    {thread.body}
                  </p>
                  
                  {/* Reaction bar - Divider is subtle gray border-t */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/40 pt-4">
                    <ReactionBar thread={thread} userId={user?.id} onToggle={(reactionType) => toggleReaction(thread.id, reactionType)} />
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <FaCommentDots className="text-slate-600" /> {thread.replies?.length || 0} Replies
                    </div>
                  </div>

                  {/* Replies Block with gray side border */}
                  {!!thread.replies?.length && (
                    <div className="mt-4 max-h-56 space-y-2.5 overflow-y-auto border-l-2 border-slate-800/40 pl-4">
                      {thread.replies.map((reply) => (
                        <div key={reply.id} className="rounded-xl bg-[#001329]/60 p-4 border border-slate-800/40 text-sm">
                          <p className="font-bold text-blue-200">
                            {reply.author} <span className="font-semibold text-slate-500 text-xs ml-1.5">{formatElapsed(reply.createdAt)}</span>
                          </p>
                          <p className="mt-1 text-blue-100/70 leading-relaxed text-xs">{reply.body}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Form with subtle gray border */}
                  <div className="mt-5 flex gap-2.5">
                    <input
                      value={replyDrafts[thread.id] || ""}
                      onChange={(event) => setReplyDrafts((current) => ({ ...current, [thread.id]: event.target.value }))}
                      className="flex-1 rounded-xl border border-slate-800/50 bg-[#001329]/70 px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-slate-700"
                      placeholder="Write a supportive reply..."
                    />
                    <button 
                      onClick={() => submitReply(thread.id)} 
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-500 active:scale-[0.98]"
                    >
                      <FaReply className="text-[10px]" /> Reply
                    </button>
                  </div>
                </article>
              ))}

              {!paginatedThreads.length && (
                <div className="rounded-2xl border border-dashed border-slate-800/50 bg-[#001c38]/10 p-12 text-center">
                  <p className="text-lg font-black text-white">No discussions match your filters.</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">Try broadening your parameters or start a new conversation.</p>
                </div>
              )}
            </section>

            {/* Pagination Controls - Subtle Gray Border */}
            <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
          </main>

          {/* Sidebar Area with unified gray-bordered container cards */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            
            {/* Global Leaderboard Panel */}
            <section className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-[#001c38]/50 p-6 shadow-xl backdrop-blur-xl">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Global Standings</p>
              <h2 className="mt-1 text-xl font-black text-white">Top 5 Scholar Scorers</h2>
              <div className="mt-5 space-y-2.5">
                {topRows.map((row) => <LeaderboardRow key={row.email} row={row} />)}
              </div>
            </section>

            {/* Current Standing Card */}
            <section className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-[#001c38]/50 p-6 shadow-xl backdrop-blur-xl">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Your Current Placement</p>
              <p className="mt-3 text-5xl font-black text-white tracking-tight">{percentile}%</p>
              <p className="mt-1.5 text-xs font-semibold text-blue-200/60">Estimated index standing relative to local diagnostics.</p>
              
              {currentRow && (
                <div className="mt-5 rounded-xl border border-slate-800/40 bg-[#001329]/80 p-4">
                  <p className="text-xs font-black uppercase tracking-wider text-blue-300">Rank #{currentRow.rank}</p>
                  <p className="mt-1 text-xs font-bold text-white">
                    {currentRow.totalPoints.toLocaleString()} reward points
                  </p>
                  <p className="text-[10px] text-slate-500">Latest recorded diagnostic: {currentRow.latestScore}%</p>
                </div>
              )}
            </section>
          </aside>
        </div>
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
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all ${
              active ? reaction.activeClass : "border-slate-800 bg-[#001329]/65 text-blue-300/70 hover:border-slate-600 hover:bg-[#001c38] hover:text-white"
            }`}
            aria-label={`${reaction.label} reaction`}
          >
            <span>{reaction.emoji}</span>
            <span className="text-[11px] font-black">{state.count || 0}</span>
          </button>
        );
      })}
    </div>
  );
}

function PaginationControls({ page, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800/60 bg-[#001c38]/20 p-4 backdrop-blur-md">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-xl border border-slate-800/50 bg-[#001329]/60 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-500 transition hover:bg-[#001c38] disabled:cursor-not-allowed disabled:opacity-30"
      >
        Previous
      </button>
      <div className="flex flex-wrap items-center gap-2">
        {pages.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            className={`grid h-9 w-9 place-items-center rounded-xl text-xs font-black transition ${
              page === item ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "border border-slate-800/50 bg-[#001329]/60 text-slate-400 hover:bg-[#001c38]"
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
        className="rounded-xl border border-slate-800/50 bg-[#001329]/60 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-500 transition hover:bg-[#001c38] disabled:cursor-not-allowed disabled:opacity-30"
      >
        Next
      </button>
    </div>
  );
}

function LeaderboardRow({ row }) {
  return (
    <div className={`grid grid-cols-[3rem_1fr_4rem] items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition-colors ${row.isCurrent ? "border border-slate-700/50 bg-blue-600/20 text-blue-200" : "bg-[#001329]/80 text-slate-400"}`}>
      <span className={row.rank === 1 ? "text-amber-400 flex items-center gap-1" : "text-slate-500"}>
        {row.rank === 1 ? "🏆" : `#${row.rank}`}
      </span>
      <span className="truncate font-bold">{row.isCurrent ? `You (${row.name})` : row.name}</span>
      <span className="text-right font-black text-slate-400">{row.latestScore}%</span>
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