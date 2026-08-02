import React, { useRef, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { useSensorStore } from '../../store/useSensorStore';
import { Layers, Flame, Wind, Power, User, Fan, Sliders, Shield } from 'lucide-react';

export const Kitchen3DView = () => {
  const canvasRef = useRef(null);
  const { metrics } = useSensorStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let animTime = 0;
    const particles = Array.from({ length: 50 }, () => ({
      x: 0,
      y: 0,
      radius: Math.random() * 6 + 3,
      speed: Math.random() * 1.8 + 0.6,
      targetWindow: Math.random() > 0.5 ? 1 : 2,
    }));

    const render = () => {
      const width = (canvas.width = canvas.parentElement.clientWidth || 700);
      const height = (canvas.height = 370);

      ctx.clearRect(0, 0, width, height);

      // 1. Light Blueprint Floor Plan
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, width, height);

      // Outer Kitchen Perimeter Walls
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 30, width - 80, height - 60);

      // Inner Countertops (Cooking Range & Prep Island)
      ctx.fillStyle = '#E2E8F0';
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1.5;

      // Cooking Range Stove Counter (Top Left)
      ctx.fillRect(60, 50, 170, 110);
      ctx.strokeRect(60, 50, 170, 110);

      // Kitchen Island (Center Bottom)
      ctx.fillRect(width / 2 - 90, height - 140, 180, 80);
      ctx.strokeRect(width / 2 - 90, height - 140, 180, 80);

      // Blueprint Text Labels
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#1E293B';
      ctx.fillText('STOVE RANGE & LPG REGULATOR', 70, 70);
      ctx.fillText('CENTRAL PREP ISLAND', width / 2 - 70, height - 95);

      // 2. SERVO 3: LPG Gas Regulator Valve (On Stove / Cylinder)
      const gasRegulatorX = 145;
      const gasRegulatorY = 105;
      const servo3Angle = metrics.servo3 || 0; // 0-180 degrees
      const isRegulatorOpen = servo3Angle > 20;

      // Stove Burner Rings
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(gasRegulatorX, gasRegulatorY, 20, 0, Math.PI * 2);
      ctx.stroke();

      // Servo 3 Actuator Arm
      ctx.fillStyle = isRegulatorOpen ? '#10B981' : '#F43F5E';
      ctx.beginPath();
      ctx.arc(gasRegulatorX, gasRegulatorY, 8, 0, Math.PI * 2);
      ctx.fill();

      // Servo 3 Valve Handle Pointer Angle
      const rad3 = (servo3Angle * Math.PI) / 180;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(gasRegulatorX, gasRegulatorY);
      ctx.lineTo(gasRegulatorX + Math.cos(rad3) * 16, gasRegulatorY + Math.sin(rad3) * 16);
      ctx.stroke();

      ctx.fillStyle = '#E2E8F0';
      ctx.fillText(`SERVO 3 (Regulator): ${servo3Angle}°`, gasRegulatorX - 45, gasRegulatorY + 36);

      // 3. RELAY: Exhaust Fan (Top Wall Center)
      const exhaustX = width / 2;
      const exhaustY = 30;
      const isExhaustFanOn = metrics.relayStatus === 1 || metrics.manualRelay === 1;

      // Exhaust Fan Wall Housing
      ctx.fillStyle = isExhaustFanOn ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.15)';
      ctx.strokeStyle = isExhaustFanOn ? '#10B981' : '#F43F5E';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(exhaustX, exhaustY, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Rotating Blades if Exhaust Fan Relay is ON
      animTime += 0.06;
      const spinSpeed = isExhaustFanOn ? animTime * 6 : 0;
      ctx.strokeStyle = isExhaustFanOn ? '#10B981' : '#64748B';
      ctx.lineWidth = 2.5;
      for (let b = 0; b < 4; b++) {
        const bAngle = spinSpeed + (b * Math.PI) / 2;
        ctx.beginPath();
        ctx.moveTo(exhaustX, exhaustY);
        ctx.lineTo(exhaustX + Math.cos(bAngle) * 14, exhaustY + Math.sin(bAngle) * 14);
        ctx.stroke();
      }

      ctx.fillStyle = isExhaustFanOn ? '#10B981' : '#F43F5E';
      ctx.fillText(
        `RELAY (Exhaust Fan): ${isExhaustFanOn ? 'ACTIVE (ON)' : 'OFF'}`,
        exhaustX - 60,
        exhaustY + 34
      );

      // 4. SERVO 1: Window 1 (North Wall - Top Left Window)
      const window1X = 260;
      const window1Y = 30;
      const servo1Angle = metrics.servo1 || 0;
      const isOpenW1 = servo1Angle > 30;

      ctx.fillStyle = isOpenW1 ? 'rgba(6, 182, 212, 0.3)' : 'rgba(30, 41, 59, 0.8)';
      ctx.fillRect(window1X - 25, window1Y - 6, 50, 12);
      ctx.strokeStyle = isOpenW1 ? '#06B6D4' : '#64748B';
      ctx.lineWidth = 2;
      ctx.strokeRect(window1X - 25, window1Y - 6, 50, 12);

      // Window 1 Louvre Slats (Servo 1 angle)
      const w1SlatOffset = (servo1Angle / 180) * 12;
      ctx.strokeStyle = isOpenW1 ? '#06B6D4' : '#475569';
      for (let s = -20; s <= 20; s += 10) {
        ctx.beginPath();
        ctx.moveTo(window1X + s, window1Y - 4);
        ctx.lineTo(window1X + s + w1SlatOffset, window1Y + 4);
        ctx.stroke();
      }
      ctx.fillStyle = '#CBD5E1';
      ctx.fillText(`SERVO 1 (Window 1): ${servo1Angle}°`, window1X - 50, window1Y + 22);

      // 5. SERVO 2: Window 2 (East Wall - Right Side Window)
      const window2X = width - 40;
      const window2Y = 160;
      const servo2Angle = metrics.servo2 || 0;
      const isOpenW2 = servo2Angle > 30;

      ctx.fillStyle = isOpenW2 ? 'rgba(6, 182, 212, 0.3)' : 'rgba(30, 41, 59, 0.8)';
      ctx.fillRect(window2X - 6, window2Y - 25, 12, 50);
      ctx.strokeStyle = isOpenW2 ? '#06B6D4' : '#64748B';
      ctx.lineWidth = 2;
      ctx.strokeRect(window2X - 6, window2Y - 25, 12, 50);

      // Window 2 Louvre Slats (Servo 2 angle)
      const w2SlatOffset = (servo2Angle / 180) * 12;
      ctx.strokeStyle = isOpenW2 ? '#06B6D4' : '#475569';
      for (let s = -20; s <= 20; s += 10) {
        ctx.beginPath();
        ctx.moveTo(window2X - 4, window2Y + s);
        ctx.lineTo(window2X + 4, window2Y + s + w2SlatOffset);
        ctx.stroke();
      }
      ctx.fillStyle = '#CBD5E1';
      ctx.fillText(`SERVO 2 (Window 2): ${servo2Angle}°`, window2X - 110, window2Y + 40);

      // 6. PIR Motion Sensor Sector (Bottom Right Zone)
      const pirX = width - 80;
      const pirY = height - 80;
      ctx.fillStyle = metrics.pirMotion === 1 ? 'rgba(168, 85, 247, 0.15)' : 'rgba(51, 65, 85, 0.08)';
      ctx.beginPath();
      ctx.moveTo(pirX, pirY);
      ctx.arc(pirX, pirY, 80, Math.PI, Math.PI * 1.5);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = metrics.pirMotion === 1 ? '#A855F7' : '#475569';
      ctx.stroke();

      if (metrics.pirMotion === 1) {
        ctx.fillStyle = '#A855F7';
        ctx.beginPath();
        ctx.arc(pirX - 40, pirY - 40, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText('PIR MOTION ACTIVE', pirX - 85, pirY - 50);
      }

      // 7. Dynamic Gas Dispersion & Vector Airflow
      const maxGas = Math.max(metrics.mq2, metrics.mq3, metrics.mq4, metrics.mq5);
      const isHazard = maxGas > 300;

      particles.forEach((p) => {
        if (!p.x || Math.random() < 0.015) {
          p.x = gasRegulatorX + (Math.random() * 16 - 8);
          p.y = gasRegulatorY + (Math.random() * 16 - 8);
        }

        // Determine destination: Exhaust Fan if ON, or Open Windows
        let destX = exhaustX;
        let destY = exhaustY;

        if (!isExhaustFanOn) {
          if (p.targetWindow === 1 && isOpenW1) {
            destX = window1X;
            destY = window1Y;
          } else if (isOpenW2) {
            destX = window2X;
            destY = window2Y;
          }
        }

        const dx = destX - p.x;
        const dy = destY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 5) {
          p.x += (dx / dist) * p.speed + (Math.random() * 1.4 - 0.7);
          p.y += (dy / dist) * p.speed + (Math.random() * 1.4 - 0.7);
        }

        // Render Gas Cloud Particle Blob
        const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        if (isHazard) {
          pGrad.addColorStop(0, 'rgba(244, 63, 94, 0.6)');
          pGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
        } else {
          pGrad.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
          pGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
        }

        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Airflow Vector Streamlines
      if (isExhaustFanOn || isOpenW1 || isOpenW2) {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);

        if (isExhaustFanOn) {
          ctx.beginPath();
          ctx.moveTo(gasRegulatorX, gasRegulatorY);
          ctx.quadraticCurveTo(width * 0.3, height * 0.3, exhaustX, exhaustY);
          ctx.stroke();
        }
        if (isOpenW1) {
          ctx.beginPath();
          ctx.moveTo(gasRegulatorX, gasRegulatorY);
          ctx.lineTo(window1X, window1Y);
          ctx.stroke();
        }
        if (isOpenW2) {
          ctx.beginPath();
          ctx.moveTo(gasRegulatorX, gasRegulatorY);
          ctx.lineTo(window2X, window2Y);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [metrics]);

  return (
    <GlassCard className="flex flex-col justify-between overflow-hidden bg-white border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
              3D DIGITAL TWIN KITCHEN BLUEPRINT
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Servo 1 (Win 1) • Servo 2 (Win 2) • Servo 3 (Gas Valve) • Relay (Exhaust Fan)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono font-bold">
          <span className="flex items-center gap-1 text-cyan-700">
            <Wind className="w-3 h-3" /> Win 1 & Win 2
          </span>
          <span className="flex items-center gap-1 text-amber-700">
            <Flame className="w-3 h-3" /> Gas Valve
          </span>
          <span className="flex items-center gap-1 text-emerald-700">
            <Fan className="w-3 h-3" /> Exhaust Fan
          </span>
        </div>
      </div>

      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <canvas ref={canvasRef} className="w-full h-[370px] block" />
      </div>
    </GlassCard>
  );
};
