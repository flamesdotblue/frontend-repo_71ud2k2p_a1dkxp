import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export default function ZoneEditor({ zones, onZonesChange }) {
  const containerRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [currentRect, setCurrentRect] = useState(null);

  const getRelativePoint = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) };
  };

  const handleMouseDown = (e) => {
    setDrawing(true);
    const p = getRelativePoint(e);
    setStart(p);
    setCurrentRect({ x: p.x, y: p.y, w: 0, h: 0 });
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    const p = getRelativePoint(e);
    const w = p.x - start.x;
    const h = p.y - start.y;
    setCurrentRect({ x: Math.min(start.x, p.x), y: Math.min(start.y, p.y), w: Math.abs(w), h: Math.abs(h) });
  };

  const handleMouseUp = () => {
    if (drawing && currentRect && currentRect.w > 1 && currentRect.h > 1) {
      const id = crypto.randomUUID();
      const name = `Zone ${zones.length + 1}`;
      onZonesChange([...zones, { id, name, ...currentRect }]);
    }
    setDrawing(false);
    setCurrentRect(null);
  };

  const removeZone = (id) => {
    onZonesChange(zones.filter((z) => z.id !== id));
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const preventDrag = (e) => e.preventDefault();
    el.addEventListener('dragstart', preventDrag);
    return () => el.removeEventListener('dragstart', preventDrag);
  }, []);

  return (
    <section className="w-full rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2 text-white/80">
          <Pencil className="h-4 w-4" />
          <h2 className="text-sm font-medium">Zone Editor</h2>
        </div>
        <p className="text-xs text-white/50">Click and drag to draw rectangular zones</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="relative lg:col-span-8 aspect-video bg-gradient-to-br from-slate-800 to-slate-900" ref={containerRef}
             onMouseDown={handleMouseDown}
             onMouseMove={handleMouseMove}
             onMouseUp={handleMouseUp}
             onMouseLeave={handleMouseUp}
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-50" />

          {zones.map((z) => (
            <div key={z.id} className="absolute border-2 border-emerald-400/80 bg-emerald-400/10"
                 style={{ left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%` }}>
              <div className="absolute -top-6 left-0 flex items-center gap-2 text-xs text-white/80">
                <span className="px-2 py-0.5 rounded bg-emerald-600/80">{z.name}</span>
                <button onClick={() => removeZone(z.id)} className="inline-flex items-center gap-1 rounded bg-white/10 px-1.5 py-0.5 hover:bg-white/20">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}

          {currentRect && (
            <div className="absolute border-2 border-indigo-400/80 bg-indigo-400/10"
                 style={{ left: `${currentRect.x}%`, top: `${currentRect.y}%`, width: `${currentRect.w}%`, height: `${currentRect.h}%` }}
            />
          )}
        </div>

        <div className="lg:col-span-4 border-t lg:border-l border-white/10 p-4 space-y-3">
          <h3 className="text-sm font-medium text-white/80">Configured Zones</h3>
          {zones.length === 0 && (
            <p className="text-xs text-white/50">No zones yet. Draw on the left to add one.</p>
          )}
          <ul className="space-y-2">
            {zones.map((z) => (
              <li key={z.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <div>
                  <p className="text-sm text-white/90">{z.name}</p>
                  <p className="text-[11px] text-white/50">x:{z.x.toFixed(1)}% y:{z.y.toFixed(1)}% w:{z.w.toFixed(1)}% h:{z.h.toFixed(1)}%</p>
                </div>
                <button onClick={() => removeZone(z.id)} className="text-white/60 hover:text-white">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
