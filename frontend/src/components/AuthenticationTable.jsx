import { useState } from "react";
import {
  Globe,
  Shield,
  Monitor,
  KeyRound,
  Search,
} from "lucide-react";

function AuthenticationTable({ data }) {
  if (!data) return null;

  const results = data.results || {};

  const tabs = [
    {
      id: "network",
      label: "Network",
      icon: Globe,
      logs: results.network_logs,
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
      logs: results.security_logs,
    },
    {
      id: "session",
      label: "Session",
      icon: Monitor,
      logs: results.session_logs,
    },
    {
      id: "authentication",
      label: "Authentication",
      icon: KeyRound,
      logs: results.authentication_logs,
    },
  ];

  const [activeTab, setActiveTab] = useState("network");

  const currentTab =
    tabs.find((tab) => tab.id === activeTab) || tabs[0];

  const renderValue = (value) => {
    if (value === true)
      return (
        <span className="px-2 py-1 rounded-lg bg-green-900/30 border border-green-700 text-green-400 text-xs">
          YES
        </span>
      );

    if (value === false)
      return (
        <span className="px-2 py-1 rounded-lg bg-red-900/30 border border-red-700 text-red-400 text-xs">
          NO
        </span>
      );

    if (
      value === null ||
      value === undefined ||
      value === ""
    )
      return (
        <span className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-xs">
          UNKNOWN
        </span>
      );

    if (Array.isArray(value))
      return (
        <span className="font-mono text-white">
          {value.join(", ")}
        </span>
      );

    return (
      <span className="font-mono text-white">
        {String(value)}
      </span>
    );
  };

  return (
    <div className="bg-[#0D1B2A] border border-[#1A2F4A] rounded-xl overflow-hidden">

      {/* Header */}

      <div className="px-6 py-5 border-b border-[#1A2F4A]">

        <h2 className="text-xl font-semibold text-white">

          Authentication Analytics

        </h2>

        <p className="text-sm text-slate-400 mt-1">

          Analyze network, session, security and authentication signals collected during monitoring.

        </p>

      </div>

      {/* Tabs */}

      <div className="flex gap-2 p-4 border-b border-[#1A2F4A]">

        {tabs.map((tab) => {

          const Icon = tab.icon;

          return (

            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition

              ${
                activeTab === tab.id
                  ? "bg-cyan-500 text-slate-900 font-semibold"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >

              <Icon size={16} />

              {tab.label}

            </button>

          );
        })}

      </div>

      {/* Search */}

      <div className="p-4 border-b border-[#1A2F4A]">

        <div className="relative">

          <Search
            size={16}
            className="absolute left-4 top-3.5 text-slate-500"
          />

          <input
            placeholder="Search Signal..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-500 outline-none"
          />

        </div>

      </div>

      {/* Table */}

      <div>

        {currentTab.logs ? (

          Object.entries(currentTab.logs).map(

            ([key, value], index) => (

              <div
                key={key}
                className={`flex justify-between items-center px-6 py-4

                ${
                  index % 2 === 0
                    ? "bg-transparent"
                    : "bg-slate-900/20"
                }

                border-b border-[#1A2F4A]`}
              >

                <span className="text-slate-400 font-mono text-xs uppercase">

                  {key.replaceAll("_", " ")}

                </span>

                {renderValue(value)}

              </div>

            )

          )

        ) : (

          <div className="p-10 text-center text-slate-500">

            No Signals Found

          </div>

        )}

      </div>

    </div>
  );
}

export default AuthenticationTable;