'use client';
import React, { useRef, useEffect } from 'react';

interface DataPoint { date: string; consumed: number; burned: number; }

export default function ProgressChart({ data, height = 300 }: { data: DataPoint[]; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    canvas.width = w * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, height);

    const pad = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = w - pad.left - pad.right;
    const chartH = height - pad.top - pad.bottom;
    const allVals = data.flatMap(d => [d.consumed, d.burned]);
    const maxVal = Math.max(...allVals) * 1.1;
    const minVal = Math.min(...allVals) * 0.9;

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (chartH / 4) * i;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
      ctx.fillStyle = '#6b7280'; ctx.font = '10px Inter'; ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxVal - (maxVal - minVal) * (i / 4)).toString(), pad.left - 8, y + 4);
    }

    const drawLine = (values: number[], color: string, fillColor: string) => {
      const points = values.map((v, i) => ({
        x: pad.left + (i / (values.length - 1)) * chartW,
        y: pad.top + ((maxVal - v) / (maxVal - minVal)) * chartH,
      }));

      // Fill
      ctx.beginPath();
      ctx.moveTo(points[0].x, pad.top + chartH);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(points[points.length - 1].x, pad.top + chartH);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
      grad.addColorStop(0, fillColor); grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad; ctx.fill();

      // Line
      ctx.beginPath();
      points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.stroke();

      // Dots
      points.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.fill();
      });
    };

    drawLine(data.map(d => d.consumed), '#10b981', 'rgba(16,185,129,0.15)');
    drawLine(data.map(d => d.burned), '#3b82f6', 'rgba(59,130,246,0.1)');

    // X labels
    ctx.fillStyle = '#6b7280'; ctx.font = '10px Inter'; ctx.textAlign = 'center';
    const step = Math.max(1, Math.floor(data.length / 7));
    data.forEach((d, i) => {
      if (i % step === 0) {
        const x = pad.left + (i / (data.length - 1)) * chartW;
        ctx.fillText(d.date.slice(5), x, height - 10);
      }
    });
  }, [data, height]);

  return (
    <div className="glass-card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ fontSize: '1rem' }}>Calorie Tracking</h3>
        <div style={{ display: 'flex', gap: 16, fontSize: '0.7rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 3, background: '#10b981', borderRadius: 2, display: 'inline-block' }} /> Consumed
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 3, background: '#3b82f6', borderRadius: 2, display: 'inline-block' }} /> Burned
          </span>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ width: '100%', height }} />
    </div>
  );
}
