import {
  ShieldCheck,
  Monitor,
  Database,
  Globe,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-[#1A2F4A] bg-[#0D1B2A] rounded-xl">

      <div className="px-8 py-6 flex flex-col lg:flex-row justify-between gap-8">

        {/* Left */}

        <div>

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">

              <ShieldCheck
                size={20}
                className="text-cyan-400"
              />

            </div>

            <div>

              <h2 className="text-white font-semibold">

                Authentication Security Operations Center

              </h2>

              <p className="text-sm text-slate-400">

                Log Analyzer Dashboard • Internship Project

              </p>

            </div>

          </div>

          <p className="mt-5 max-w-xl text-slate-400 text-sm leading-7">

            Enterprise authentication monitoring dashboard built using
            FastAPI, React and Playwright for collecting authentication,
            network, session and security intelligence with anomaly
            detection and geographical visualization.

          </p>

        </div>

        {/* Right */}

        <div className="grid grid-cols-2 gap-6">

          <div>

            <h3 className="text-white font-semibold mb-3">

              Technologies

            </h3>

            <div className="space-y-2 text-sm text-slate-400">

              <div className="flex items-center gap-2">

                <Database size={15} />

                FastAPI Backend

              </div>

              <div className="flex items-center gap-2">

                <Globe size={15} />

                Playwright Engine

              </div>

              <div className="flex items-center gap-2">

                <Monitor size={15} />

                React Dashboard

              </div>

            </div>

          </div>

          <div>

            <h3 className="text-white font-semibold mb-3">

              Modules

            </h3>

            <div className="space-y-2 text-sm text-slate-400">

              <div>Authentication Engine</div>

              <div>Geo Intelligence</div>

              <div>Anomaly Detection</div>

              <div>Security Analytics</div>

            </div>

          </div>

        </div>

      </div>

      <div className="border-t border-[#1A2F4A] px-8 py-4 flex flex-col lg:flex-row justify-between text-xs text-slate-500">

        <span>

          © 2026 Log Analyzer Dashboard

        </span>

        <span>

          Authentication Monitoring • Security Analytics • Geo Intelligence

        </span>

      </div>

    </footer>
  );
}