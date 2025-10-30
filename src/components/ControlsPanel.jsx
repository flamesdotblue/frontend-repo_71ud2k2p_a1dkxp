import React, { useState } from 'react';
import { Link as LinkIcon, AlertTriangle, Download } from 'lucide-react';

export default function ControlsPanel({ cameraUrl, onCameraUrlChange, onExportCSV, threshold, onThresholdChange }) {
  const [localUrl, setLocalUrl] = useState(cameraUrl || '');

  const applyUrl = () => {
    onCameraUrlChange(localUrl.trim());
  };

  return (
    <section className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-white/80">Camera & Alerts</h2>
          <button onClick={onExportCSV} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <LinkIcon className="h-4 w-4 text-white/60" />
            <input
              value={localUrl}
              onChange={(e) => setLocalUrl(e.target.value)}
              placeholder="RTSP/HTTP stream URL or leave empty for webcam"
              className="w-full bg-transparent text-white placeholder-white/40 outline-none"
            />
            <button onClick={applyUrl} className="rounded-md bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-500">Apply</button>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs text-white/60">Threshold</span>
              <input
                type="number"
                value={threshold}
                onChange={(e) => onThresholdChange(Number(e.target.value) || 0)}
                className="w-full bg-transparent text-white outline-none"
                min={0}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
