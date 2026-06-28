import {
  ShieldAlert,
  Activity,
  XCircle,
  Globe,
  TrendingUp,
} from "lucide-react";

import AnimatedCounter from "./AnimatedCounter";
import SparklineChart from "./SparklineChart";

function TopCards({ data }) {
  if (!data) return null;

  const metrics = data.dashboard_metrics || {};

  const cards = [
    {
      title: "Authentication Risk",
      value: metrics.risk_score ?? 0,
      unit: "/100",
      primary: metrics.risk_level ?? "Unknown",
      secondary: `Last Scan ${
        metrics.last_scan
          ? metrics.last_scan.split(" ")[1]
          : "--"
      }`,
      icon: ShieldAlert,
      color: "amber",
    },
    {
      title: "Authentication Sessions",
      value: metrics.total_sessions ?? 0,
      unit: "",
      primary: `${metrics.successful_sessions ?? 0} Successful`,
      secondary: `${metrics.failed_sessions ?? 0} Failed`,
      icon: Activity,
      color: "cyan",
    },
    {
      title: "Threat Indicators",
      value:
        (metrics.threat_high ?? 0) +
        (metrics.threat_medium ?? 0) +
        (metrics.threat_low ?? 0),
      unit: "",
      primary: `High ${metrics.threat_high ?? 0}`,
      secondary: `Medium ${metrics.threat_medium ?? 0} • Low ${
        metrics.threat_low ?? 0
      }`,
      icon: XCircle,
      color: "red",
    },
    {
      title: "Authentication Origins",
      value: metrics.countries ?? 0,
      unit: "",
      primary: `${metrics.cities ?? 0} Cities`,
      secondary: `${metrics.unique_ips ?? 0} Unique IPs`,
      icon: Globe,
      color: "purple",
    },
  ];

  const colors = {
    amber: {
      text: "text-amber-400",
      border: "border-amber-400",
      bg: "bg-amber-500/10",
    },
    cyan: {
      text: "text-cyan-400",
      border: "border-cyan-400",
      bg: "bg-cyan-500/10",
    },
    red: {
      text: "text-red-400",
      border: "border-red-400",
      bg: "bg-red-500/10",
    },
    purple: {
      text: "text-purple-400",
      border: "border-purple-400",
      bg: "bg-purple-500/10",
    },
  };

  return (
    <section>

      {/* Section Heading */}

      <div className="mb-6">

        <h2 className="text-xl font-semibold text-white">

          Security Overview

        </h2>

        <p className="text-sm text-slate-400 mt-1">

          High-level overview of authentication activity, threat indicators
          and security posture.

        </p>

      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {cards.map((card) => {

          const Icon = card.icon;
          const c = colors[card.color];

          return (

            <div
              key={card.title}
              className={`bg-[#0D1B2A] border ${c.border} rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
            >

              <div className="flex justify-between items-start">

                <div>

                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">

                    {card.title}

                  </p>

                  <div className="flex items-end gap-1 mt-4">

                    <h2 className={`text-5xl font-bold font-mono ${c.text}`}>

                      <AnimatedCounter
                      value={card.value}
                      />

                    </h2>

                    {card.unit && (

                      <span className="text-slate-500 text-sm mb-1">

                        {card.unit}

                      </span>

                    )}

                  </div>

                </div>

               <div className="flex flex-col items-end gap-3">
                <div
                className={`w-12 h-12 rounded-xl ${c.bg}
                flex items-center justify-center`}
                >
                    <Icon
                    className={c.text}
                    size={22}
                    />
                </div>
                <SparklineChart
                color={
                    card.color === "amber"
                    ? "#fbbf24"
                    : card.color === "cyan"
                    ? "#22d3ee"
                    : card.color === "red"
                    ? "#fb7185"
                    : "#c084fc"
                }
                />
            </div>

              </div>

              <div className="mt-6 pt-4 border-t border-[#1A2F4A]">

                <div className="flex items-center justify-between">

                  <p className="text-sm text-slate-200 font-medium">

                    {card.primary}

                  </p>

                  <TrendingUp
                    size={16}
                    className={c.text}
                  />

                </div>

                <p className="text-xs text-slate-500 mt-2">

                  {card.secondary}

                </p>

              </div>

            </div>

          );

        })}

      </div>

    </section>
  );
}

export default TopCards;