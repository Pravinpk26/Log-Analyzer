import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Clock3,
  ArrowRight,
} from "lucide-react";

function getStyle(severity) {
  switch (severity) {
    case "High":
      return {
        badge: "bg-red-500/10 text-red-400 border-red-500/30",
        border: "border-red-500/30",
        icon: <ShieldAlert size={20} className="text-red-400" />,
        action: "Investigate Immediately",
      };

    case "Medium":
      return {
        badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        border: "border-amber-500/30",
        icon: <AlertTriangle size={20} className="text-amber-400" />,
        action: "Review Authentication",
      };

    default:
      return {
        badge: "bg-green-500/10 text-green-400 border-green-500/30",
        border: "border-green-500/30",
        icon: <ShieldCheck size={20} className="text-green-400" />,
        action: "Monitor",
      };
  }
}

function AnomalyPanel({ anomalies, event }) {
  if (!anomalies || anomalies.length === 0) {
    return (
      <section className="bg-[#0D1B2A] border border-[#1A2F4A] rounded-xl p-6">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-xl font-semibold text-white">
              Anomaly Panel
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Active security findings generated during authentication analysis.
            </p>

          </div>

        </div>

        <div className="border border-green-500/30 bg-green-500/10 rounded-xl p-10 flex flex-col items-center">

          <ShieldCheck
            className="text-green-400"
            size={34}
          />

          <h3 className="text-white font-semibold mt-4">
            No Active Security Findings
          </h3>

          <p className="text-slate-400 text-sm mt-2">
            Authentication completed successfully without suspicious behaviour.
          </p>

        </div>

      </section>
    );
  }

  return (
    <section className="bg-[#0D1B2A] border border-[#1A2F4A] rounded-xl p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-xl font-semibold text-white">
            Anomaly Panel
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Security findings detected during authentication monitoring.
          </p>

        </div>

        <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30">

          <span className="text-red-400 text-sm font-semibold">

            {anomalies.length} Findings

          </span>

        </div>

      </div>

      {/* Findings */}

      <div className="space-y-5">

        {anomalies.map((item, index) => {

          const style = getStyle(item.severity);

          return (

            <div
              key={index}
              className={`rounded-xl border ${style.border} bg-slate-900/40 p-5 hover:bg-slate-900 transition`}
            >

              <div className="flex justify-between">

                <div className="flex gap-4">

                  <div className="mt-1">

                    {style.icon}

                  </div>

                  <div>

                    <h3 className="text-white text-lg font-semibold">

                      {item.type}

                    </h3>

                    <p className="text-slate-400 mt-2">

                      {item.message}

                    </p>

                  </div>

                </div>

                <span
                  className={`h-fit px-3 py-1 rounded-full border text-xs font-semibold ${style.badge}`}
                >

                  {item.severity.toUpperCase()}

                </span>

              </div>

              {/* Incident Details */}

              <div className="grid grid-cols-4 gap-6 mt-6 pt-5 border-t border-[#1A2F4A]">

                <div>

                  <p className="text-xs uppercase tracking-wider text-slate-500">

                    Source IP

                  </p>

                  <p className="text-white font-mono mt-1">

                    {event?.ip_address || "--"}

                  </p>

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wider text-slate-500">

                    Status

                  </p>

                  <p className="text-cyan-400 mt-1">

                    Open

                  </p>

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wider text-slate-500">

                    Detected

                  </p>

                  <div className="flex items-center gap-2 mt-1">

                    <Clock3
                      size={15}
                      className="text-slate-400"
                    />

                    <span className="text-white">

                      {event?.timestamp || "--"}

                    </span>

                  </div>

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wider text-slate-500">

                    Recommended Action

                  </p>

                  <div className="flex items-center gap-2 mt-1 text-cyan-400">

                    <ArrowRight size={15} />

                    {style.action}

                  </div>

                </div>

              </div>

            </div>

          );

        })}

      </div>

    </section>
  );
}

export default AnomalyPanel;