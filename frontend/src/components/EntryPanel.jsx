import { useState } from "react";
import { Globe, Upload, Play, FileJson } from "lucide-react";

function EntryPanel({ onScan, onUpload, loading }) {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);

  return (
    <div className="bg-[#0D1B2A] border border-[#1A2F4A] rounded-xl overflow-hidden">

      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* Live Monitoring */}

        <div className="p-6 lg:border-r border-[#1A2F4A]">

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Globe className="text-cyan-400" size={20} />
            </div>

            <div>
              <h2 className="text-white font-semibold">
                Live Authentication Monitoring
              </h2>

              <p className="text-xs text-slate-400">
                Monitor a live login session
              </p>
            </div>
          </div>

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/login"
            className="
              w-full
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              text-white
              font-mono
              placeholder:text-slate-500
              focus:outline-none
              focus:border-cyan-400
            "
          />

          <button
            onClick={() => onScan(url)}
            className="
              mt-5
              w-full
              flex
              items-center
              justify-center
              gap-2
              bg-cyan-500
              hover:bg-cyan-400
              text-slate-900
              font-semibold
              py-3
              rounded-xl
              transition
            "
          >
            <Play size={18} />
            {loading ? "Scanning..." : "Start Monitoring"}
          </button>

        </div>

        {/* Upload */}

        <div className="p-6">

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <FileJson className="text-cyan-400" size={20} />
            </div>

            <div>
              <h2 className="text-white font-semibold">
                Authentication Log Analysis
              </h2>

              <p className="text-xs text-slate-400">
                Upload authentication logs
              </p>
            </div>
          </div>

          <input
            type="file"
            accept=".json,.csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="
              w-full
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              p-3
              text-slate-300
              file:bg-cyan-500
              file:text-slate-900
              file:border-0
              file:px-4
              file:py-2
              file:rounded-lg
              file:font-semibold
              hover:file:bg-cyan-400
            "
          />

          <button
            onClick={() => onUpload(file)}
            className="
              mt-5
              w-full
              flex
              items-center
              justify-center
              gap-2
              bg-cyan-500
              hover:bg-cyan-400
              text-slate-900
              font-semibold
              py-3
              rounded-xl
              transition
            "
          >
            <Upload size={18} />
            Upload Log
          </button>

        </div>

      </div>

    </div>
  );
}

export default EntryPanel;