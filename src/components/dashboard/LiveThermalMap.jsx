import React, { useRef, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { useSensorStore } from '../../store/useSensorStore';
import { Flame } from 'lucide-react';

export const LiveThermalMap = () => {
  const canvasRef = useRef(null);
  const { metrics } = useSensorStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let particleOffset = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement.clientWidth || 500);
      const height = (canvas.height = 290);

      // Clean Light Background
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, width, height);

      // Light Grid Lines
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Heat Sources based on MQ2-MQ5
      const mq2Intensity = Math.min(metrics.mq2 / 800, 1.0);
      const mq3Intensity = Math.min(metrics.mq3 / 800, 1.0);
      const mq4Intensity = Math.min(metrics.mq4 / 800, 1.0);
      const mq5Intensity = Math.min(metrics.mq5 / 800, 1.0);

      const sources = [
        { x: width * 0.25, y: height * 0.35, intensity: mq2Intensity, label: `MQ2: ${metrics.mq2} PPM` },
        { x: width * 0.75, y: height * 0.35, intensity: mq3Intensity, label: `MQ3: ${metrics.mq3} PPM` },
        { x: width * 0.35, y: height * 0.75, intensity: mq4Intensity, label: `MQ4: ${metrics.mq4} PPM` },
        { x: width * 0.65, y: height * 0.75, intensity: mq5Intensity, label: `MQ5: ${metrics.mq5} PPM` },
      ];

      particleOffset += 0.03;

      // Render Gradient Thermal Diffusion Blobs
      sources.forEach((s) => {
        const radius = Math.max(45 + s.intensity * 120 + Math.sin(particleOffset) * 6, 32);
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, radius);

        if (s.intensity > 0.6) {
          grad.addColorStop(0, 'rgba(239, 68, 68, 0.85)');
          grad.addColorStop(0.4, 'rgba(245, 158, 11, 0.6)');
          grad.addColorStop(0.7, 'rgba(16, 185, 129, 0.3)');
          grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
        } else if (s.intensity > 0.3) {
          grad.addColorStop(0, 'rgba(245, 158, 11, 0.8)');
          grad.addColorStop(0.5, 'rgba(16, 185, 129, 0.4)');
          grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
        } else {
          grad.addColorStop(0, 'rgba(16, 185, 129, 0.7)');
          grad.addColorStop(0.6, 'rgba(16, 185, 129, 0.25)');
          grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Node Ring Indicator
        ctx.strokeStyle = s.intensity > 0.5 ? '#EF4444' : s.intensity > 0.25 ? '#F59E0B' : '#10B981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 8, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Sensor Tag Box & Text
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#FFFFFF';
        const txtWidth = ctx.measureText(s.label).width;
        ctx.fillRect(s.x - txtWidth / 2 - 6, s.y - 28, txtWidth + 12, 18);
        ctx.strokeStyle = s.intensity > 0.5 ? '#EF4444' : '#10B981';
        ctx.lineWidth = 1;
        ctx.strokeRect(s.x - txtWidth / 2 - 6, s.y - 28, txtWidth + 12, 18);

        ctx.fillStyle = '#0F172A';
        ctx.fillText(s.label, s.x - txtWidth / 2, s.y - 15);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [metrics]);

  return (
    <GlassCard className="flex flex-col justify-between overflow-hidden bg-white border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-100 text-rose-600 border border-rose-200">
            <Flame className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
              LIVE GAS THERMAL DIFFUSION HEATMAP
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Real-time Concentration Diffusion Matrix (Green → Yellow → Orange → Red)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1 text-emerald-700 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Safe
          </span>
          <span className="flex items-center gap-1 text-amber-700 font-bold">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Warning
          </span>
          <span className="flex items-center gap-1 text-rose-600 font-bold">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" /> Hazard
          </span>
        </div>
      </div>

      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <canvas ref={canvasRef} className="w-full h-[290px] block" />
      </div>
    </GlassCard>
  );
};
