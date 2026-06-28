import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Bell,
  Settings,
  UserCircle,
  Activity,
} from "lucide-react";

export default function Header() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#0D1B2A] border-b border-[#1A2F4A] px-8 py-5">

      <div className="flex items-center justify-between">

        {/* Left */}

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">

            <ShieldCheck
              className="text-cyan-400"
              size={24}
            />

          </div>

          <div>

            <h1 className="text-white text-2xl font-bold">

              Authentication Security Operations Center

            </h1>

            <p className="text-slate-400 text-sm mt-1">

              Monitor • Analyze • Detect • Visualize Authentication Events

            </p>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-4">

          {/* Backend */}

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2">

            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>

            <span className="text-green-400 text-sm font-medium">

              Monitoring Active

            </span>

          </div>

          {/* Time */}

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2">

            <Activity
              size={16}
              className="text-cyan-400"
            />

            <span className="text-slate-300 text-sm">

              {time}

            </span>

          </div>

          {/* Notification */}

          <button className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 transition flex items-center justify-center">

            <Bell
              size={18}
              className="text-slate-300"
            />

          </button>

          {/* Settings */}

          <button className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 transition flex items-center justify-center">

            <Settings
              size={18}
              className="text-slate-300"
            />

          </button>

          {/* User */}

          <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">

            <div className="w-9 h-9 rounded-full bg-cyan-600 flex items-center justify-center text-white font-semibold">

              DB

            </div>

            <div>

              <p className="text-white text-sm font-medium">

                D

              </p>

              <p className="text-slate-400 text-xs">

                Analyst

              </p>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}