import {
  Clock3,
  PlayCircle,
  Globe,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

function RecentActivity({ events, result }) {

  if (!events || events.length === 0) {

    return (

      <section className="bg-[#0D1B2A] border border-[#1A2F4A] rounded-xl p-6">

        <h2 className="text-xl font-semibold text-white">

          🕒 Authentication Timeline

        </h2>

        <p className="text-slate-400 mt-2">

          No authentication timeline available.

        </p>

      </section>

    );

  }

  const latest = events[events.length - 1];

  const timeline = [

    {
      icon: PlayCircle,
      color: "text-cyan-400",
      title: "Monitoring Started",
      description:
        latest.current_url || "Authentication monitoring initiated.",
      time: latest.timestamp,
    },

    {
      icon: Globe,
      color: "text-purple-400",
      title: "Geo Intelligence Collected",
      description:
        latest.geo
          ? `${latest.geo.city}, ${latest.geo.region}, ${latest.geo.country}`
          : "Location identified.",
      time: latest.timestamp,
    },

    {
      icon: ShieldCheck,
      color: "text-green-400",
      title: "Security Assessment Completed",
      description:
        result
          ? `Security Score : ${result.security_score}/100`
          : "Security analysis completed.",
      time: latest.timestamp,
    },

    {
      icon: ShieldAlert,
      color: "text-amber-400",
      title: "Threat Analysis Completed",
      description:
        result
          ? `${result.anomalies.length} Findings Generated`
          : "Threat analysis completed.",
      time: latest.timestamp,
    },

    {
      icon: CheckCircle2,
      color:
        latest.status === "Success"
          ? "text-green-400"
          : "text-red-400",
      title: `Authentication ${latest.status}`,
      description: `${latest.browser} • ${latest.ip_address}`,
      time: latest.timestamp,
    },

  ];

  return (

    <section className="bg-[#0D1B2A] border border-[#1A2F4A] rounded-xl overflow-hidden">

      {/* Header */}

      <div className="px-6 py-5 border-b border-[#1A2F4A]">

        <h2 className="text-xl font-semibold text-white">

          🕒 Authentication Timeline

        </h2>

        <p className="text-sm text-slate-400 mt-1">

          Complete lifecycle of the latest authentication monitoring session.

        </p>

      </div>

      {/* Timeline */}

      <div className="relative p-8">

        <div className="absolute left-[31px] top-8 bottom-8 w-px bg-[#29405F]" />

        {

          timeline.map((item, index) => {

            const Icon = item.icon;

            return (

              <div
                key={index}
                className="relative flex gap-5 pb-8 last:pb-0"
              >

                <div
                  className="relative z-10 w-12 h-12 rounded-full bg-slate-900 border border-[#29405F] flex items-center justify-center"
                >

                  <Icon
                    className={item.color}
                    size={20}
                  />

                </div>

                <div className="flex-1">

                  <div className="flex justify-between items-center">

                    <h3 className="text-white font-semibold">

                      {item.title}

                    </h3>

                    <div className="flex items-center gap-2 text-slate-500 text-sm">

                      <Clock3 size={14} />

                      {item.time}

                    </div>

                  </div>

                  <p className="text-slate-400 mt-2">

                    {item.description}

                  </p>

                </div>

              </div>

            );

          })

        }

      </div>

    </section>

  );

}

export default RecentActivity;