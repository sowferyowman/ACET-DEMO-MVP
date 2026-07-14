import { FaExternalLinkAlt, FaPlayCircle } from "react-icons/fa";

export default function ResourceCard({ url, title }) {
  const resource = parseResourceUrl(url);

  if (!resource) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-2 text-sm font-black text-slate-700"><FaPlayCircle className="text-slate-400" /> Study Resource</div>
        <p className="mt-3 text-sm text-slate-500">No resource provided.</p>
      </div>
    );
  }

  if (resource.youtubeId) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
        <div className="aspect-video">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${resource.youtubeId}`}
            title={`${title || "Study module"} video resource`}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <a href={resource.url} target="_blank" rel="noreferrer noopener" className="group block rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">External Resource</p>
          <p className="mt-1 truncate text-sm font-bold text-slate-800">{resource.domain}</p>
        </div>
        <FaExternalLinkAlt className="mt-1 shrink-0 text-blue-700" />
      </div>
      <span className="mt-4 inline-flex text-sm font-black text-blue-700 group-hover:text-primary">Open resource</span>
    </a>
  );
}

function parseResourceUrl(value) {
  if (!value || !String(value).trim()) return null;
  try {
    const parsed = new URL(String(value).trim());
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    const hostname = parsed.hostname.replace(/^www\./, "").toLowerCase();
    let youtubeId = null;
    if (hostname === "youtu.be") youtubeId = parsed.pathname.split("/").filter(Boolean)[0];
    if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(hostname)) {
      youtubeId = parsed.searchParams.get("v") || parsed.pathname.match(/^\/(?:embed|shorts)\/([^/?#]+)/)?.[1] || null;
    }
    const safeYoutubeId = /^[a-zA-Z0-9_-]{6,15}$/.test(youtubeId || "") ? youtubeId : null;
    return { url: parsed.href, domain: hostname, youtubeId: safeYoutubeId };
  } catch {
    return null;
  }
}
