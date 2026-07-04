/**
 * App.jsx — Main React Application
 * Root component managing all state, login flow, and dashboard layout.
 */

import { useState, useEffect } from "react";
import "./App.css";

import { scanWebsite, uploadLog, getEvents, verifyToken } from "./services/api";

import LoginPage            from "./components/LoginPage";
import RecommendationPanel  from "./components/RecommendationPanel";
import Sidebar              from "./components/Sidebar";
import Header               from "./components/Header";
import ScanProgressModal    from "./components/ScanProgressModel";
import EntryPanel           from "./components/EntryPanel";
import TopCards             from "./components/TopCards";
import AuthenticationTable  from "./components/AuthenticationTable";
import GeoMap               from "./components/GeoMap";
import AnomalyPanel         from "./components/AnomalyPanel";
import RecentActivity       from "./components/RecentActivity";
import Footer               from "./components/Footer";

function App() {
  // ── Auth state ─────────────────────────────────────────────────────────────
  const [user,         setUser]         = useState(null);   // { name, role, username }
  const [authChecked,  setAuthChecked]  = useState(false);  // prevents flash of login page

  // ── Dashboard state ────────────────────────────────────────────────────────
  const [result,       setResult]       = useState(null);
  const [events,       setEvents]       = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  // ── On mount: check if token already stored (page refresh) ─────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthChecked(true);
      return;
    }
    // Verify the stored token is still valid
    verifyToken()
      .then((data) => {
        setUser({
          name:     localStorage.getItem("name")     || data.name,
          role:     localStorage.getItem("role")     || data.role,
          username: localStorage.getItem("username") || data.username,
        });
      })
      .catch(() => {
        // Token expired — clear and show login
        localStorage.clear();
      })
      .finally(() => setAuthChecked(true));
  }, []);

  // ── Login handler ──────────────────────────────────────────────────────────
  const handleLogin = (data) => {
    setUser({ name: data.name, role: data.role, username: data.username });
  };

  // ── Logout handler ─────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setResult(null);
    setEvents([]);
  };

  // ── Scan handler ───────────────────────────────────────────────────────────
  const handleScan = async (url) => {
    if (!url) return;
    setShowProgress(true);
    setLoading(true);
    try {
      const data = await scanWebsite(url);
      setResult(data);
      const activity = await getEvents();
      setEvents(activity.events);
    } catch (err) {
      console.error(err);
      alert("Scanning failed. Check the backend terminal.");
    } finally {
      setLoading(false);
      setShowProgress(false);
    }
  };

  // ── Upload handler ─────────────────────────────────────────────────────────
  const handleUpload = async (file) => {
    if (!file) return;
    setLoading(true);
    try {
      await uploadLog(file);
      const activity = await getEvents();
      setEvents(activity.events);
      alert("Log uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  // ── Wait until auth check completes (avoids flicker) ──────────────────────
  if (!authChecked) return null;

  // ── Show login page if not authenticated ───────────────────────────────────
  if (!user) return <LoginPage onLogin={handleLogin} />;

  // ── Main dashboard ─────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex bg-slate-950">

      <ScanProgressModal
        open={showProgress}
        onComplete={() => setShowProgress(false)}
      />

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Pass real user info and logout handler to Header */}
        <Header user={user} onLogout={handleLogout} />

        <main className="flex-1 overflow-y-auto p-8 space-y-8">

          <section id="authentication">
            <EntryPanel
              onScan={handleScan}
              onUpload={handleUpload}
              loading={loading}
            />
          </section>

          {result && (
            <>
              <TopCards data={result} />
              <AuthenticationTable data={result} />
              <GeoMap events={events} />
              <AnomalyPanel
                anomalies={result?.anomalies}
                event={result?.authentication_event}
              />
              {/* AI Insights — receives data directly from scan result, no second fetch */}
              <RecommendationPanel aiInsights={result?.ai_insights} />
              <RecentActivity events={events} result={result} />
              <Footer />
            </>
          )}

        </main>
      </div>
    </div>
  );
}

export default App;
