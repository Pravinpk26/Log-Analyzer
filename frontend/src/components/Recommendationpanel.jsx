import { useState, useEffect } from "react";

// ─── Severity config ──────────────────────────────────────────────────────────
const SEVERITY = {
  High: {
    dot:    "bg-red-500",
    badge:  "bg-red-500/15 text-red-400 border border-red-500/30",
    bar:    "bg-red-500",
    icon:   "⚠",
    glow:   "shadow-red-500/20",
  },
  Medium: {
    dot:    "bg-amber-400",
    badge:  "bg-amber-400/15 text-amber-300 border border-amber-400/30",
    bar:    "bg-amber-400",
    icon:   "⚡",
    glow:   "shadow-amber-400/20",
  },
  Low: {
    dot:    "bg-blue-400",
    badge:  "bg-blue-400/15 text-blue-300 border border-blue-400/30",
    bar:    "bg-blue-400",
    icon:   "ℹ",
    glow:   "shadow-blue-400/20",
  },
  Info: {
    dot:    "bg-emerald-400",
    badge:  "bg-emerald-400/15 text-emerald-300 border border-emerald-400/30",
    bar:    "bg-emerald-400",
    icon:   "✓",
    glow:   "shadow-emerald-400/20",
  },
};

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function InsightSkeleton() {
  return (
    <div className="animate-pulse space-y-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-slate-700" />
        <div className="h-3 w-16 rounded bg-slate-700" />
      </div>
      <div className="space-y-2">
        <div className="h-3 rounded bg-slate-700 w-full" />
        <div className="h-3 rounded bg-slate-700 w-5/6" />
      </div>
      <div className="h-px bg-slate-700/50" />
      <div className="space-y-2">
        <div className="h-3 rounded bg-slate-700 w-full" />
        <div className="h-3 rounded bg-slate-700 w-3/4" />
      </div>
    </div>
  );
}

// ─── Single insight card ──────────────────────────────────────────────────────
function InsightCard({ item, index }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = SEVERITY[item.severity] ?? SEVERITY.Info;

  return (
    <div
      className={`
        group relative rounded-xl border border-slate-700/50 bg-slate-800/40
        hover:bg-slate-800/70 hover:border-slate-600/60 transition-all duration-200
        cursor-pointer shadow-lg ${cfg.glow}
      `}
      onClick={() => setExpanded((v) => !v)}
    >
      {/* Severity accent bar */}
      <div className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-full ${cfg.bar} opacity-80`} />

      <div className="p-4 pl-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold flex-shrink-0 ${cfg.badge}`}
            >
              {index + 1}
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.badge}`}
            >
              {cfg.icon} {item.severity}
            </span>
          </div>
          <span className="text-slate-500 text-xs flex-shrink-0 mt-0.5 group-hover:text-slate-400 transition-colors">
            {expanded ? "▲" : "▼"}
          </span>
        </div>

        {/* Insight */}
        <div className="mb-1">
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1 flex items-center gap-1.5">
            <span className="text-violet-400">◈</span> Insight
          </p>
          <p className="text-sm text-slate-200 leading-relaxed">{item.insight}</p>
        </div>

        {/* Recommendation — collapsible */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            expanded ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"
          }`}
        >
          <div className="h-px bg-slate-700/60 mb-3" />
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1 flex items-center gap-1.5">
            <span className="text-emerald-400">→</span> Recommendation
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">{item.recommendation}</p>
        </div>

        {/* "Tap to see recommendation" hint */}
        {!expanded && (
          <p className="text-xs text-slate-600 mt-2 group-hover:text-slate-500 transition-colors">
            Click to see recommendation →
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Empty / error state ──────────────────────────────────────────────────────
function EmptyState({ error }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center px-4">
      <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-3 text-2xl">
        {error ? "⚠" : "🧠"}
      </div>
      <p className="text-sm font-medium text-slate-300 mb-1">
        {error ? "Could not load insights" : "No insights yet"}
      </p>
      <p className="text-xs text-slate-500">
        {error
          ? "Check the API connection and try again."
          : "Scan a website to generate AI security insights."}
      </p>
    </div>
  );
}

// ─── Severity summary pills ───────────────────────────────────────────────────
function SeveritySummary({ insights }) {
  const counts = { High: 0, Medium: 0, Low: 0, Info: 0 };
  insights.forEach((i) => {
    if (counts[i.severity] !== undefined) counts[i.severity]++;
  });

  return (
    <div className="flex flex-wrap gap-1.5 mb-4">
      {Object.entries(counts).map(([sev, count]) =>
        count > 0 ? (
          <span
            key={sev}
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${SEVERITY[sev].badge}`}
          >
            {count} {sev}
          </span>
        ) : null
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
/**
 * RecommendationPanel
 *
 * Props:
 *   url       {string}   - The URL that was just scanned (triggers auto-fetch)
 *   data      {object}   - Optional: pre-fetched scan result from App.jsx
 *                          If provided, the panel calls /ai-insights with that data.
 *                          If omitted, it calls /ai-insights?url={url} directly.
 *   apiBase   {string}   - API base URL, defaults to http://127.0.0.1:8000
 */
export default function RecommendationPanel({ url, data, apiBase = "http://127.0.0.1:8000" }) {
  const [insights, setInsights]   = useState([]);
  const [source,   setSource]     = useState(null);   // "claude-ai" | "rule-based"
  const [loading,  setLoading]    = useState(false);
  const [error,    setError]      = useState(null);
  const [lastUrl,  setLastUrl]    = useState(null);

  // ── Fetch insights whenever URL changes ──────────────────────────────────
  useEffect(() => {
    if (!url || url === lastUrl) return;

    const fetchInsights = async () => {
      setLoading(true);
      setError(null);
      setInsights([]);

      try {
        const endpoint = `${apiBase}/ai-insights?url=${encodeURIComponent(url)}`;
        const res = await fetch(endpoint);

        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        const json = await res.json();
        const aiResult = json.ai_insights ?? {};

        setInsights(aiResult.insights ?? []);
        setSource(aiResult.source ?? null);
        setLastUrl(url);
      } catch (err) {
        console.error("[RecommendationPanel]", err);
        setError(err.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [url, lastUrl, apiBase]);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-700/60 shadow-2xl overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/60 bg-slate-800/50">
        <div className="flex items-center gap-2.5">
          {/* Brain icon */}
          <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
            <span className="text-violet-400 text-sm">🧠</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white leading-tight">
              AI Insights &amp; Recommendations
            </h3>
            {source && (
              <p className="text-xs text-slate-500 leading-tight">
                {source === "claude-ai" ? "Powered by Claude AI" : "Rule-based analysis"}
              </p>
            )}
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              loading ? "bg-amber-400 animate-pulse" : insights.length ? "bg-emerald-400" : "bg-slate-600"
            }`}
          />
          <span className="text-xs text-slate-400">
            {loading ? "Analysing…" : insights.length ? "Ready" : "Idle"}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {/* Loading skeletons */}
        {loading && (
          <>
            <InsightSkeleton />
            <InsightSkeleton />
            <InsightSkeleton />
          </>
        )}

        {/* Error state */}
        {!loading && error && <EmptyState error={error} />}

        {/* Empty state */}
        {!loading && !error && insights.length === 0 && <EmptyState />}

        {/* Insights */}
        {!loading && !error && insights.length > 0 && (
          <>
            <SeveritySummary insights={insights} />
            {insights.map((item, idx) => (
              <InsightCard key={idx} item={item} index={idx} />
            ))}
          </>
        )}
      </div>

      {/* ── Footer ── */}
      {!loading && insights.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-700/60 bg-slate-800/30 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {insights.length} insight{insights.length !== 1 ? "s" : ""} generated
          </p>
          <button
            className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium"
            onClick={() => setLastUrl(null)}   // force re-fetch
          >
            ↺ Refresh
          </button>
        </div>
      )}
    </div>
  );
}
