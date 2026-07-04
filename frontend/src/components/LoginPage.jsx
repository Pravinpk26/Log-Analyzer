/**
 * LoginPage.jsx
 * Admin login page matching the dark SOC dashboard theme.
 * Default credentials: admin / admin123
 */

import { useState } from "react";
import { ShieldCheck, Eye, EyeOff, Lock, User } from "lucide-react";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const handleSubmit = async () => {
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Invalid credentials.");
      }
      const data = await res.json();
      localStorage.setItem("token",    data.access_token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("name",     data.name);
      localStorage.setItem("role",     data.role);
      onLogin(data);
    } catch (err) {
      setError(err.message || "Login failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">

      {/* Background grid */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: "linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      <div className="relative w-full max-w-md">

        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 mb-4">
            <ShieldCheck className="text-cyan-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Log Analyzer</h1>
          <p className="text-slate-400 text-sm mt-1">Mini SOC Dashboard — Secure Access</p>
        </div>

        {/* Card */}
        <div className="bg-[#0D1B2A] border border-[#1A2F4A] rounded-2xl p-8 shadow-2xl">

          <h2 className="text-lg font-semibold text-white mb-1">Sign in to continue</h2>
          <p className="text-slate-500 text-sm mb-6">Enter your admin credentials to access the dashboard.</p>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              ⚠ {error}
            </div>
          )}

          {/* Username */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Username</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="admin"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-12 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button type="button" onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
            {loading ? (
              <><span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />Signing in...</>
            ) : "Sign In"}
          </button>

          {/* Hint */}
          <div className="mt-6 pt-5 border-t border-[#1A2F4A]">
            <p className="text-xs text-slate-600 text-center">
              Default: <span className="text-slate-500 font-mono">admin</span> / <span className="text-slate-500 font-mono">admin123</span>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-700 mt-6">Log Analyzer Dashboard • Mini SOC</p>
      </div>
    </div>
  );
}
