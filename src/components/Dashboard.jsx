import React, { useMemo } from 'react';
import { Users, Activity, Clock } from 'lucide-react';

export default function Dashboard({ zones = [], counts = {}, history = [] }) {
  const total = useMemo(() => Object.values(counts).reduce((a, b) => a + b, 0), [counts]);

  return (
    <section className="w-full rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-white/80">
          <Activity className="h-4 w-4" />
          <h2 className="text-sm font-medium">Live Analytics</h2>
        </div>
        <p className="text-xs text-white/50">Auto-updating demo values</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={<Users className="h-5 w-5" />} label="Total People" value={total} color="from-indigo-500 to-emerald-500" />
        <StatCard icon={<Activity className="h-5 w-5" />} label="Active Zones" value={zones.length} color="from-emerald-500 to-cyan-500" />
        <StatCard icon={<Clock className="h-5 w-5" />} label="Avg. Dwell (s)" value={Math.max(5, Math.round(total * 1.7))} color="from-fuchsia-500 to-pink-500" />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 rounded-xl border border-white/10 bg-white/5 p-4">
          <h3 className="text-sm font-medium text-white/80 mb-3">Zone Breakdown</h3>
          <div className="space-y-2">
            {zones.length === 0 && <p className="text-xs text-white/50">Add zones to see breakdown.</p>}
            {zones.map((z) => {
              const c = counts[z.id] || 0;
              const max = Math.max(1, Math.max(...Object.values(counts), 1));
              const pct = Math.round((c / max) * 100);
              return (
                <div key={z.id} className="">
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span>{z.name}</span>
                    <span>{c}</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded bg-white/10 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="lg:col-span-5 rounded-xl border border-white/10 bg-white/5 p-4">
          <h3 className="text-sm font-medium text-white/80 mb-3">Last 12 intervals</h3>
          <div className="flex items-end gap-2 h-28">
            {history.slice(-12).map((v, i) => (
              <div key={i} className="flex-1 bg-white/10 rounded relative overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-500 to-emerald-400" style={{ height: `${Math.min(100, v)}%` }} />
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-white/50">Simple bar visualization (0–100 scale)</p>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${color} text-white flex items-center justify-center shadow-lg shadow-black/20`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-white/60">{label}</p>
          <p className="text-xl font-semibold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}
