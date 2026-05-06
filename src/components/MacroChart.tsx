'use client';
import React, { useRef, useEffect } from 'react';
import { getMacroPercentages } from '@/lib/utils';

interface Props {
  protein: number; carbs: number; fat: number;
  size?: number; strokeWidth?: number; showLabels?: boolean;
}

export default function MacroChart({ protein, carbs, fat, size = 160, strokeWidth = 20, showLabels = true }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pct = getMacroPercentages(protein, carbs, fat);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2, cy = size / 2, r = (size - strokeWidth) / 2;
    ctx.clearRect(0, 0, size, size);

    const segments = [
      { pct: pct.protein, color: '#3b82f6' },
      { pct: pct.carbs, color: '#f59e0b' },
      { pct: pct.fat, color: '#ef4444' },
    ];

    let start = -Math.PI / 2;
    segments.forEach(seg => {
      const sweep = (seg.pct / 100) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, start, start + sweep);
      ctx.strokeStyle = seg.color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.stroke();
      start += sweep + 0.04;
    });

    // Center text
    const totalCal = protein * 4 + carbs * 4 + fat * 9;
    ctx.fillStyle = '#f9fafb';
    ctx.font = `800 ${size * 0.15}px Outfit, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(totalCal).toString(), cx, cy - 4);
    ctx.fillStyle = '#9ca3af';
    ctx.font = `500 ${size * 0.08}px Inter, sans-serif`;
    ctx.fillText('kcal', cx, cy + size * 0.12);
  }, [protein, carbs, fat, size, strokeWidth, pct]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <canvas ref={canvasRef} style={{ width: size, height: size }} />
      {showLabels && (
        <div style={{ display: 'flex', gap: 16, fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-protein)', display: 'inline-block' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Protein {pct.protein}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-carbs)', display: 'inline-block' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Carbs {pct.carbs}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-fat)', display: 'inline-block' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Fat {pct.fat}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
