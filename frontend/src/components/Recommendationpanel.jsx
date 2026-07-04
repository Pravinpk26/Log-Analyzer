import { useEffect, useState } from "react";

function getSeverityColor(severity) {
  switch ((severity || "").toLowerCase()) {
    case "high":
      return "border-red-500 bg-red-500/10 text-red-400";
    case "medium":
      return "border-yellow-500 bg-yellow-500/10 text-yellow-400";
    case "low":
      return "border-blue-500 bg-blue-500/10 text-blue-400";
    default:
      return "border-emerald-500 bg-emerald-500/10 text-emerald-400";
  }
}

function SeveritySummary({ insights }) {
  const counts = {
    High: 0,
    Medium: 0,
    Low: 0,
    Info: 0,
  };

  insights.forEach((i) => {
    if (counts[i.severity] !== undefined) {
      counts[i.severity]++;
    }
  });

  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-center">
        <div className="text-red-400 text-xl font-bold">{counts.High}</div>
        <div className="text-xs text-slate-300">High</div>
      </div>

      <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 p-3 text-center">
        <div className="text-yellow-400 text-xl font-bold">{counts.Medium}</div>
        <div className="text-xs text-slate-300">Medium</div>
      </div>

      <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-3 text-center">
        <div className="text-blue-400 text-xl font-bold">{counts.Low}</div>
        <div className="text-xs text-slate-300">Low</div>
      </div>

      <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-center">
        <div className="text-emerald-400 text-xl font-bold">{counts.Info}</div>
        <div className="text-xs text-slate-300">Info</div>
      </div>
    </div>
  );
}

function InsightCard({ item, index }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-white">
          Insight #{index + 1}
        </span>

        <span
          className={`px-3 py-1 rounded-full border text-xs font-semibold ${getSeverityColor(
            item.severity
          )}`}
        >
          {item.severity}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-sm text-slate-400 mb-1">
            Insight
          </div>

          <p className="text-slate-200">
            {item.insight}
          </p>
        </div>

        <div>
          <div className="text-sm text-slate-400 mb-1">
            Recommendation
          </div>

          <p className="text-green-300">
            {item.recommendation}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center">
      <div className="text-5xl mb-4">🧠</div>

      <h3 className="text-lg font-semibold text-white">
        No AI Insights
      </h3>

      <p className="text-slate-400 mt-2">
        Scan a website to generate AI-powered security recommendations.
      </p>
    </div>
  );
}

export default function RecommendationPanel({ aiInsights }) {
  const [insights, setInsights] = useState([]);
  const [source, setSource] = useState(null);

  useEffect(() => {
    if (!aiInsights) {
      setInsights([]);
      setSource(null);
      return;
    }

    setInsights(aiInsights.insights || []);
    setSource(aiInsights.source || null);
  }, [aiInsights]);

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 overflow-hidden">

      {/* Header */}

      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700 bg-slate-800">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-lg bg-violet-600/20 flex items-center justify-center">
            🧠
          </div>

          <div>

            <h2 className="text-lg font-semibold text-white">
              AI Insights & Recommendations
            </h2>

            <p className="text-sm text-slate-400">
              {source
                ? `Source: ${source}`
                : "Waiting for scan"}
            </p>

          </div>

        </div>

        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            insights.length
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-slate-700 text-slate-400"
          }`}
        >
          {insights.length ? "Ready" : "Idle"}
        </div>

      </div>

      <div className="p-5 space-y-5">

        {insights.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <SeveritySummary insights={insights} />

            {insights.map((item, index) => (
              <InsightCard
                key={index}
                item={item}
                index={index}
              />
            ))}
          </>
        )}

      </div>

    </div>
  );
}