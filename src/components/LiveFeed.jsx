import React, { useEffect, useRef } from 'react';
import { Play, Pause, Webcam, AlertTriangle } from 'lucide-react';

export default function LiveFeed({ cameraUrl, zones = [], counts = {}, playing, onTogglePlay, threshold }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Attempt to use webcam if no URL provided
  useEffect(() => {
    let active = true;
    async function init() {
      try {
        if (!cameraUrl && playing) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          if (!active) return;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
            await videoRef.current.play();
          }
        }
      } catch (err) {
        console.error('Camera error:', err);
      }
    }
    init();
    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [cameraUrl, playing]);

  return (
    <section className="w-full rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2 text-white/80">
          <Webcam className="h-4 w-4" />
          <h2 className="text-sm font-medium">Live Camera Feed</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onTogglePlay} className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-white ${playing ? 'bg-rose-600 hover:bg-rose-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}>
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {playing ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>

      <div className="relative aspect-video bg-black">
        {/* Video element */}
        {cameraUrl ? (
          <video src={cameraUrl} controls autoPlay muted className="h-full w-full object-cover" />
        ) : (
          <video ref={videoRef} autoPlay muted className="h-full w-full object-cover" />
        )}

        {/* Zone overlays */}
        {zones.map((z) => {
          const zoneCount = counts[z.id] || 0;
          const crowded = threshold > 0 && zoneCount >= threshold;
          return (
            <div key={z.id}
                 className={`absolute border-2 ${crowded ? 'border-rose-500/90 bg-rose-500/10' : 'border-emerald-400/80 bg-emerald-400/10'}`}
                 style={{ left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%` }}>
              <div className="absolute -top-6 left-0 flex items-center gap-2 text-xs text-white">
                <span className={`px-2 py-0.5 rounded ${crowded ? 'bg-rose-600/90' : 'bg-emerald-600/80'}`}>
                  {z.name}: {zoneCount}
                </span>
                {crowded && (
                  <span className="inline-flex items-center gap-1 rounded bg-rose-600/80 px-1.5 py-0.5">
                    <AlertTriangle className="h-3 w-3" /> Alert
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Heatmap visual hint */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-indigo-500/10 to-emerald-400/10 mix-blend-overlay" />
      </div>
    </section>
  );
}
