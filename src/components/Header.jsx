import React from 'react';
import { Camera, Settings, Users, Activity } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full border-b border-white/10 bg-slate-900/70 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Camera className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white leading-tight">VisionGuard</h1>
            <p className="text-xs text-white/60">Real-time People Counting & Zone Analytics</p>
          </div>
        </div>
        <nav className="flex items-center gap-3 text-white/80">
          <div className="hidden md:flex items-center gap-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
            <Users className="h-4 w-4" />
            <span className="ml-2 text-sm">Live</span>
          </div>
          <div className="hidden md:flex items-center gap-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
            <Activity className="h-4 w-4" />
            <span className="ml-2 text-sm">Analytics</span>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <Settings className="h-4 w-4" />
            Admin
          </button>
        </nav>
      </div>
    </header>
  );
}
