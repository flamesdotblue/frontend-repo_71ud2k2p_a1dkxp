import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import ControlsPanel from './components/ControlsPanel';
import ZoneEditor from './components/ZoneEditor';
import LiveFeed from './components/LiveFeed';
import Dashboard from './components/Dashboard';

export default function App() {
  const [cameraUrl, setCameraUrl] = useState('');
  const [zones, setZones] = useState([]);
  const [counts, setCounts] = useState({});
  const [history, setHistory] = useState([]); // simple total history 0–100
  const [playing, setPlaying] = useState(false);
  const [threshold, setThreshold] = useState(8);

  // Demo: generate pseudo live counts per zone every second when playing
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setCounts((prev) => {
        const next = { ...prev };
        zones.forEach((z) => {
          const base = next[z.id] ?? 0;
          const jitter = Math.max(0, Math.min(15, Math.round(base + (Math.random() * 6 - 3))));
          next[z.id] = jitter;
        });
        return next;
      });
      setHistory((h) => {
        const totalNow = Object.values(counts).reduce((a, b) => a + b, 0);
        const value = Math.min(100, Math.round((totalNow / Math.max(1, zones.length * Math.max(10, threshold))) * 100));
        return [...h, value].slice(-60);
      });
    }, 1000);
    return () => clearInterval(id);
  }, [playing, zones, threshold, counts]);

  const total = useMemo(() => Object.values(counts).reduce((a, b) => a + b, 0), [counts]);

  const handleExportCSV = () => {
    const rows = [
      ['Timestamp', 'Total', ...zones.map((z) => z.name)],
      [new Date().toISOString(), total, ...zones.map((z) => counts[z.id] ?? 0)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'people_counts.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <ControlsPanel
          cameraUrl={cameraUrl}
          onCameraUrlChange={setCameraUrl}
          onExportCSV={handleExportCSV}
          threshold={threshold}
          onThresholdChange={setThreshold}
        />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7 space-y-6">
            <LiveFeed
              cameraUrl={cameraUrl}
              zones={zones}
              counts={counts}
              playing={playing}
              onTogglePlay={() => setPlaying((p) => !p)}
              threshold={threshold}
            />
            <ZoneEditor zones={zones} onZonesChange={setZones} />
          </div>
          <div className="xl:col-span-5">
            <Dashboard zones={zones} counts={counts} history={history} />
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-7xl px-4 pb-8 pt-2 text-center text-xs text-white/40">
        Built for real-time people counting, zone analytics, and alerting. This is a frontend demo — backend model inference and persistence can be connected later.
      </footer>
    </div>
  );
}
