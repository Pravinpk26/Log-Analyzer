import {
  LayoutDashboard,
  Radar,
  Upload,
  Globe,
  ShieldAlert,
  Clock3,
  Settings,
  ShieldCheck,
  Server,
  Database,
} from "lucide-react";

const menuItems = [
  {
    title: "OVERVIEW",
    items: [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        active: true,
      },
    ],
  },

  {
    title: "MONITORING",
    items: [
      {
        icon: Radar,
        label: "Live Monitor",
      },
      {
        icon: Upload,
        label: "Log Upload",
      },
    ],
  },

  {
    title: "ANALYTICS",
    items: [
      {
        icon: Globe,
        label: "Geo Analytics",
      },
      {
        icon: ShieldAlert,
        label: "Anomaly Panel",
      },
      {
        icon: Clock3,
        label: "Activity Timeline",
      },
    ],
  },

  {
    title: "SYSTEM",
    items: [
      {
        icon: Settings,
        label: "Settings",
      },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-[#0D1B2A] border-r border-[#1A2F4A] flex flex-col">

      {/* Brand */}

      <div className="px-7 pt-8 pb-6">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">

            <ShieldCheck
              className="text-cyan-400"
              size={22}
            />

          </div>

          <div>

            <h1 className="text-white font-bold text-lg">

              Log Analyzer

            </h1>

            <p className="text-xs text-slate-400">

              Mini SOC Dashboard

            </p>

          </div>

        </div>

      </div>

      <div className="mx-6 border-b border-[#1A2F4A]" />

      {/* Navigation */}

      <nav className="flex-1 px-5 py-6 overflow-y-auto">

        {menuItems.map((section) => (

          <div
            key={section.title}
            className="mb-7"
          >

            <p className="text-[11px] tracking-[0.18em] text-slate-500 font-semibold mb-3">

              {section.title}

            </p>

            <div className="space-y-1">

              {section.items.map((item) => {

                const Icon = item.icon;

                return (

                  <button
                    key={item.label}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200

                    ${
                      item.active
                        ? "bg-cyan-500/10 border border-cyan-500/30 text-white"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >

                    <Icon
                      size={18}
                      className={
                        item.active
                          ? "text-cyan-400"
                          : "text-slate-500"
                      }
                    />

                    <span className="text-sm">

                      {item.label}

                    </span>

                  </button>

                );
              })}

            </div>

          </div>

        ))}

      </nav>

      {/* Bottom Status */}

      <div className="p-5">

        <div className="rounded-xl border border-[#1A2F4A] bg-slate-900 p-5">

          <div className="flex items-center gap-2 mb-4">

            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>

            <p className="text-white font-semibold">

              System Health

            </p>

          </div>

          <div className="space-y-3 text-sm">

            <div className="flex justify-between">

              <span className="text-slate-400">

                Backend

              </span>

              <span className="text-green-400">

                Online

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-400">

                Event Store

              </span>

              <span className="text-cyan-400">

                Active

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-400">

                Engine

              </span>

              <span className="text-purple-400">

                Running

              </span>

            </div>

            <div className="mt-4 border-t border-slate-800 pt-3 flex items-center gap-2">

              <Server
                size={16}
                className="text-cyan-400"
              />

              <span className="text-xs text-slate-400">

                Authentication Monitoring Service

              </span>

            </div>

          </div>

        </div>

      </div>

    </aside>
  );
}