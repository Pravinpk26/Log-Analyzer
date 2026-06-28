import { useState } from "react";
import "./App.css";

import { scanWebsite, uploadLog, getEvents } from "./services/api";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ScanProgressModal from "./components/ScanProgressModel";

import EntryPanel from "./components/EntryPanel";
import TopCards from "./components/TopCards";
import AuthenticationTable from "./components/AuthenticationTable";
import GeoMap from "./components/GeoMap";
import AnomalyPanel from "./components/AnomalyPanel";
import RecentActivity from "./components/RecentActivity";
import Footer from "./components/Footer";
function App() {
  const [result, setResult] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  // -----------------------------
  // Live Authentication Monitoring
  // -----------------------------

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
      alert("Scanning failed.");
    } finally {
      setLoading(false);
      setShowProgress(false);
    }
  };

  // -----------------------------
  // Upload Authentication Logs
  // -----------------------------

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

  return (
    <div className="h-screen flex bg-slate-950">

      {/* Sidebar */}

      <ScanProgressModal
      open={showProgress}
      onComplete={() => {}}
      />

      <Sidebar />

      {/* Main Content */}

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}

        <Header />

        {/* Dashboard */}

        <main className="flex-1 overflow-y-auto p-8 space-y-8">

  

          {/* Entry Panel */}

          <section id="authentication">

            <EntryPanel
              onScan={handleScan}
              onUpload={handleUpload}
              loading={loading}
            />

          </section>

          {/* Dashboard Components */}

          {result && (
            <>

              <TopCards data={result} />

              <AuthenticationTable data={result} />

              <GeoMap events={events} />

              <AnomalyPanel
              anomalies={result?.anomalies}
              event={result?.authentication_event}
              />

              <RecentActivity
              events={events}
              result={result}
              />

              <Footer />

            </>
          )}

        </main>

      </div>

    </div>
  );
}

export default App;