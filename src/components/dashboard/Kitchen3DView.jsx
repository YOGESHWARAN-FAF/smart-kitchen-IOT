import React, { useRef, useEffect, useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { useSensorStore } from '../../store/useSensorStore';
import {
  Layers,
  Flame,
  Wind,
  Fan,
  Activity,
  Zap,
  Eye,
  Sliders,
  ShieldAlert,
  User,
} from 'lucide-react';

export const Kitchen3DView = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { metrics } = useSensorStore();
  const [viewMode, setViewMode] = useState('ALL'); // 'ALL' | 'AIRFLOW' | 'HAZARD' | 'ACTUATORS'

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let animTime = 0;
    // Particle pool for airflow & gas dispersion simulation
    const particles = Array.from({ length: 55 }, () => ({
      x: 0,
      y: 0,
      radius: Math.random() * 4 + 2,
      speed: Math.random() * 1.8 + 0.7,
      targetWindow: Math.random() > 0.5 ? 1 : 2,
    }));

    // Dynamic Pill Badge Helper with mobile auto-scaling
    const drawBadge = (text, x, y, bgStyle, textStyle, align = 'center', fontSize = 9) => {
      ctx.save();
      ctx.font = `bold ${fontSize}px "JetBrains Mono", monospace`;
      ctx.textAlign = align;
      const textWidth = ctx.measureText(text).width;
      const paddingX = 5;
      const boxW = textWidth + paddingX * 2;
      const boxH = fontSize + 6;

      let drawX = x - boxW / 2;
      if (align === 'left') drawX = x;
      if (align === 'right') drawX = x - boxW;

      const drawY = y - boxH / 2;

      ctx.fillStyle = bgStyle;
      ctx.beginPath();
      ctx.roundRect(drawX, drawY, boxW, boxH, 4);
      ctx.fill();

      ctx.fillStyle = textStyle;
      ctx.fillText(text, align === 'center' ? x : align === 'left' ? x + paddingX : x - paddingX, y + fontSize / 3 + 1);
      ctx.restore();
    };

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const cssWidth = container.clientWidth || 360;
      const isMobile = cssWidth < 480;
      // Expand height on mobile to prevent vertical compression
      const cssHeight = isMobile ? Math.max(380, Math.round(cssWidth * 0.95)) : Math.min(420, Math.max(340, Math.round(cssWidth * 0.58)));

      canvas.width = cssWidth * dpr;
      canvas.height = cssHeight * dpr;
      ctx.save();
      ctx.scale(dpr, dpr);

      const width = cssWidth;
      const height = cssHeight;
      const fontSize = isMobile ? 8 : 9;

      ctx.clearRect(0, 0, width, height);

      // 1. Digital Twin Dark Blueprint Canvas Background
      ctx.fillStyle = '#0B1329';
      ctx.fillRect(0, 0, width, height);

      // Blueprint Grid Lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      const gridSize = isMobile ? 20 : 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Outer Kitchen Wall Boundary
      const wallMargin = isMobile ? 22 : Math.max(28, Math.min(40, width * 0.06));
      const wallW = width - wallMargin * 2;
      const wallH = height - wallMargin * 2;
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(wallMargin, wallMargin, wallW, wallH);

      // Wall Corner Accents
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      const cLen = 8;
      ctx.beginPath(); ctx.moveTo(wallMargin, wallMargin + cLen); ctx.lineTo(wallMargin, wallMargin); ctx.lineTo(wallMargin + cLen, wallMargin); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(wallMargin + wallW - cLen, wallMargin); ctx.lineTo(wallMargin + wallW, wallMargin); ctx.lineTo(wallMargin + wallW, wallMargin + cLen); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(wallMargin, wallMargin + wallH - cLen); ctx.lineTo(wallMargin, wallMargin + wallH); ctx.lineTo(wallMargin + cLen, wallMargin + wallH); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(wallMargin + wallW - cLen, wallMargin + wallH); ctx.lineTo(wallMargin + wallW, wallMargin + wallH); ctx.lineTo(wallMargin + wallW, wallMargin + wallH - cLen); ctx.stroke();

      // Blueprint Title Header Tag
      const titleText = isMobile ? 'DIGITAL TWIN 2D' : 'AURA-GUARD DIGITAL TWIN 2D BLUEPRINT';
      drawBadge(titleText, wallMargin + 6, wallMargin - 11, 'rgba(2, 132, 199, 0.3)', '#38BDF8', 'left', fontSize);

      // 2. Kitchen Station Layout (Stove Station & Central Island)
      const stoveX = wallMargin + (isMobile ? 10 : 16);
      const stoveY = wallMargin + (isMobile ? 32 : 28);
      const stoveW = Math.min(195, width * (isMobile ? 0.48 : 0.36));
      const stoveH = Math.min(125, height * (isMobile ? 0.34 : 0.36));

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = '#0EA5E9';
      ctx.lineWidth = 1.5;
      ctx.fillRect(stoveX, stoveY, stoveW, stoveH);
      ctx.strokeRect(stoveX, stoveY, stoveW, stoveH);

      // Stove Station Badge
      drawBadge(isMobile ? 'STOVE RANGE' : 'STOVE & LPG STATION', stoveX + 6, stoveY + 10, 'rgba(14, 165, 233, 0.25)', '#7DD3FC', 'left', fontSize);

      // Central Kitchen Prep Island
      const islandW = Math.min(170, width * (isMobile ? 0.42 : 0.32));
      const islandH = Math.min(65, height * (isMobile ? 0.18 : 0.2));
      const islandX = width / 2 - islandW / 2;
      const islandY = height - wallMargin - islandH - (isMobile ? 22 : 18);

      ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.fillRect(islandX, islandY, islandW, islandH);
      ctx.strokeRect(islandX, islandY, islandW, islandH);
      drawBadge(isMobile ? 'PREP ISLAND' : 'CENTRAL PREP ISLAND', islandX + islandW / 2, islandY + islandH / 2, 'rgba(15, 23, 42, 0.95)', '#E2E8F0', 'center', fontSize);

      // 3. LPG CYLINDER & SERVO 3 VALVE
      const lpgX = stoveX + (isMobile ? 22 : 28);
      const lpgY = stoveY + stoveH / 2 + (isMobile ? 12 : 10);
      const servo3Angle = metrics.servo3 || 0;
      const isRegulatorOpen = servo3Angle > 20;

      // LPG Cylinder Icon Body
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.arc(lpgX, lpgY, isMobile ? 11 : 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 7px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('LPG', lpgX, lpgY + 2.5);

      // Servo 3 Regulator Valve Body
      const servo3X = lpgX + (isMobile ? 26 : 32);
      const servo3Y = lpgY;

      ctx.fillStyle = isRegulatorOpen ? '#10B981' : '#F43F5E';
      ctx.shadowColor = isRegulatorOpen ? '#10B981' : '#F43F5E';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(servo3X, servo3Y, isMobile ? 7.5 : 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Servo 3 Handle Pointer Line
      const rad3 = (servo3Angle * Math.PI) / 180;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(servo3X, servo3Y);
      ctx.lineTo(servo3X + Math.cos(rad3) * (isMobile ? 12 : 14), servo3Y + Math.sin(rad3) * (isMobile ? 12 : 14));
      ctx.stroke();

      // Servo 3 Valve Badge Callout below
      const valveText = isMobile
        ? `VALVE: ${servo3Angle}° (${isRegulatorOpen ? 'OPEN' : 'OFF'})`
        : `VALVE: ${servo3Angle}° (${isRegulatorOpen ? 'OPEN' : 'CUT OFF'})`;
      drawBadge(
        valveText,
        servo3X - 2,
        servo3Y + (isMobile ? 18 : 22),
        isRegulatorOpen ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)',
        isRegulatorOpen ? '#34D399' : '#FCA5A5',
        'center',
        fontSize
      );

      // Stove Burner Flame Origin
      const burnerX = stoveX + stoveW - (isMobile ? 24 : 30);
      const burnerY = stoveY + stoveH / 2 + (isMobile ? 12 : 10);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(burnerX, burnerY, isMobile ? 11 : 14, 0, Math.PI * 2);
      ctx.stroke();

      // 4. RELAY EXHAUST FAN (North Wall Center)
      const exhaustX = width / 2;
      const exhaustY = wallMargin;
      const isExhaustFanOn = metrics.relayStatus === 1 || metrics.manualRelay === 1;

      ctx.fillStyle = isExhaustFanOn ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.2)';
      ctx.strokeStyle = isExhaustFanOn ? '#10B981' : '#F43F5E';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(exhaustX, exhaustY, isMobile ? 13 : 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Rotating Blades
      animTime += 0.05;
      const spinSpeed = isExhaustFanOn ? animTime * 8 : 0;
      ctx.strokeStyle = isExhaustFanOn ? '#6EE7B7' : '#94A3B8';
      ctx.lineWidth = 1.5;
      for (let b = 0; b < 4; b++) {
        const bAngle = spinSpeed + (b * Math.PI) / 2;
        ctx.beginPath();
        ctx.moveTo(exhaustX, exhaustY);
        ctx.lineTo(exhaustX + Math.cos(bAngle) * (isMobile ? 10 : 12), exhaustY + Math.sin(bAngle) * (isMobile ? 10 : 12));
        ctx.stroke();
      }

      // Exhaust Fan Badge Callout below (Compact string on mobile to prevent collision with WIN 1)
      const fanText = isMobile
        ? `FAN: ${isExhaustFanOn ? 'ON' : 'OFF'}`
        : `EXHAUST FAN: ${isExhaustFanOn ? 'ACTIVE (ON)' : 'STANDBY (OFF)'}`;
      drawBadge(
        fanText,
        exhaustX,
        exhaustY + (isMobile ? 20 : 24),
        isExhaustFanOn ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
        isExhaustFanOn ? '#34D399' : '#FCA5A5',
        'center',
        fontSize
      );

      // 5. SERVO 1: NORTH WINDOW (Top Right Corner Wall)
      const window1X = wallMargin + wallW - (isMobile ? 45 : 70);
      const window1Y = wallMargin;
      const servo1Angle = metrics.servo1 || 0;
      const isOpenW1 = servo1Angle > 30;

      ctx.fillStyle = isOpenW1 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(71, 85, 105, 0.8)';
      ctx.fillRect(window1X - (isMobile ? 18 : 22), window1Y - 5, isMobile ? 36 : 44, 10);
      ctx.strokeStyle = isOpenW1 ? '#38BDF8' : '#64748B';
      ctx.lineWidth = 2;
      ctx.strokeRect(window1X - (isMobile ? 18 : 22), window1Y - 5, isMobile ? 36 : 44, 10);

      // Louver Slats
      const w1SlatOffset = (servo1Angle / 180) * 8;
      ctx.strokeStyle = isOpenW1 ? '#7DD3FC' : '#94A3B8';
      for (let s = -12; s <= 12; s += 6) {
        ctx.beginPath();
        ctx.moveTo(window1X + s, window1Y - 3);
        ctx.lineTo(window1X + s + w1SlatOffset, window1Y + 3);
        ctx.stroke();
      }
      drawBadge(`WIN 1: ${servo1Angle}°`, window1X, window1Y + (isMobile ? 20 : 22), 'rgba(56, 189, 248, 0.25)', '#7DD3FC', 'center', fontSize);

      // 6. SERVO 2: EAST WINDOW (Right Wall)
      const window2X = wallMargin + wallW;
      const window2Y = Math.min(220, height * (isMobile ? 0.52 : 0.45));
      const servo2Angle = metrics.servo2 || 0;
      const isOpenW2 = servo2Angle > 30;

      ctx.fillStyle = isOpenW2 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(71, 85, 105, 0.8)';
      ctx.fillRect(window2X - 5, window2Y - (isMobile ? 18 : 22), 10, isMobile ? 36 : 44);
      ctx.strokeStyle = isOpenW2 ? '#38BDF8' : '#64748B';
      ctx.lineWidth = 2;
      ctx.strokeRect(window2X - 5, window2Y - (isMobile ? 18 : 22), 10, isMobile ? 36 : 44);

      // Louver Slats
      const w2SlatOffset = (servo2Angle / 180) * 8;
      ctx.strokeStyle = isOpenW2 ? '#7DD3FC' : '#94A3B8';
      for (let s = -12; s <= 12; s += 6) {
        ctx.beginPath();
        ctx.moveTo(window2X - 3, window2Y + s);
        ctx.lineTo(window2X + 3, window2Y + s + w2SlatOffset);
        ctx.stroke();
      }
      drawBadge(`WIN 2: ${servo2Angle}°`, window2X - (isMobile ? 28 : 35), window2Y, 'rgba(56, 189, 248, 0.25)', '#7DD3FC', 'center', fontSize);

      // 7. PIR MOTION RADAR CORNER SECTOR
      const pirX = wallMargin + wallW - 10;
      const pirY = wallMargin + wallH - 10;
      const isOccupantPresent = metrics.pirMotion === 1;

      ctx.fillStyle = isOccupantPresent ? 'rgba(168, 85, 247, 0.25)' : 'rgba(51, 65, 85, 0.15)';
      ctx.beginPath();
      ctx.moveTo(pirX, pirY);
      ctx.arc(pirX, pirY, isMobile ? 55 : 65, Math.PI, Math.PI * 1.5);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = isOccupantPresent ? '#A855F7' : '#475569';
      ctx.stroke();

      if (isOccupantPresent) {
        const radarAngle = Math.PI + ((animTime * 2) % (Math.PI / 2));
        ctx.strokeStyle = 'rgba(216, 180, 254, 0.7)';
        ctx.beginPath();
        ctx.moveTo(pirX, pirY);
        ctx.lineTo(pirX + Math.cos(radarAngle) * (isMobile ? 55 : 65), pirY + Math.sin(radarAngle) * (isMobile ? 55 : 65));
        ctx.stroke();

        drawBadge(isMobile ? 'PIR: PERSON' : 'PIR: PERSON IN ROOM', pirX - (isMobile ? 32 : 45), pirY - (isMobile ? 18 : 24), 'rgba(168, 85, 247, 0.3)', '#E9D5FF', 'center', fontSize);
      } else {
        drawBadge('PIR: CLEAR', pirX - (isMobile ? 28 : 35), pirY - (isMobile ? 16 : 20), 'rgba(51, 65, 85, 0.4)', '#94A3B8', 'center', fontSize);
      }

      // 8. DYNAMIC GAS DISPERSION PARTICLES & STREAMLINES
      const maxGas = Math.max(metrics.mq2, metrics.mq3, metrics.mq4, metrics.mq5);
      const isHazard = maxGas > 300;

      if (viewMode === 'ALL' || viewMode === 'AIRFLOW' || viewMode === 'HAZARD') {
        particles.forEach((p) => {
          if (!p.x || Math.random() < 0.02) {
            p.x = burnerX + (Math.random() * 14 - 7);
            p.y = burnerY + (Math.random() * 14 - 7);
          }

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

          if (dist > 6) {
            p.x += (dx / dist) * p.speed + (Math.random() * 1.4 - 0.7);
            p.y += (dy / dist) * p.speed + (Math.random() * 1.4 - 0.7);
          }

          const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          if (isHazard) {
            pGrad.addColorStop(0, 'rgba(244, 63, 94, 0.7)');
            pGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
          } else {
            pGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
            pGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
          }

          ctx.fillStyle = pGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * (isHazard ? 1.3 : 1), 0, Math.PI * 2);
          ctx.fill();
        });

        if (isExhaustFanOn || isOpenW1 || isOpenW2) {
          ctx.strokeStyle = isHazard ? 'rgba(244, 63, 94, 0.5)' : 'rgba(56, 189, 248, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);

          if (isExhaustFanOn) {
            ctx.beginPath();
            ctx.moveTo(burnerX, burnerY);
            ctx.quadraticCurveTo(width * 0.35, height * 0.25, exhaustX, exhaustY);
            ctx.stroke();
          }
          if (isOpenW1) {
            ctx.beginPath();
            ctx.moveTo(burnerX, burnerY);
            ctx.lineTo(window1X, window1Y);
            ctx.stroke();
          }
          if (isOpenW2) {
            ctx.beginPath();
            ctx.moveTo(burnerX, burnerY);
            ctx.lineTo(window2X, window2Y);
            ctx.stroke();
          }
          ctx.setLineDash([]);
        }
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [metrics, viewMode]);

  return (
    <GlassCard className="flex flex-col justify-between overflow-hidden bg-slate-900 border-slate-800 text-white p-3.5 sm:p-5">
      {/* Card Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Layers className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-black tracking-tight text-white uppercase">
                3D DIGITAL TWIN BLUEPRINT
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                REALTIME
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Servos 1, 2, 3 • Solenoid Valve • Exhaust Relay • PIR Radar
            </p>
          </div>
        </div>

        {/* View Mode Mode Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-[10px] font-mono font-bold overflow-x-auto max-w-full">
          {['ALL', 'AIRFLOW', 'HAZARD', 'ACTUATORS'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-2.5 py-1 rounded-lg transition-all shrink-0 ${
                viewMode === mode
                  ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* HiDPI Digital Twin Canvas Canvas Frame */}
      <div
        ref={containerRef}
        className="relative w-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950"
      >
        <canvas ref={canvasRef} className="w-full block cursor-crosshair" />

        {/* Live Overlay Status Strip */}
        <div className="absolute bottom-2 left-2 right-2 bg-slate-900/95 backdrop-blur-md px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono shadow-lg">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="flex items-center gap-1 text-cyan-400">
              <Wind className="w-3 h-3" /> Win 1: <strong className="text-white">{metrics.servo1}°</strong> | Win 2: <strong className="text-white">{metrics.servo2}°</strong>
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <Flame className="w-3 h-3" /> Gas Valve: <strong className="text-white">{metrics.servo3}°</strong>
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="flex items-center gap-1 text-emerald-400">
              <Fan className="w-3 h-3 animate-spin" /> Fan Relay: <strong className="text-white">{metrics.relayStatus === 1 ? 'ON' : 'OFF'}</strong>
            </span>
            <span className="flex items-center gap-1 text-purple-400">
              <User className="w-3 h-3" /> Occupant: <strong className="text-white">{metrics.pirMotion === 1 ? 'DETECTED' : 'CLEAR'}</strong>
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};



