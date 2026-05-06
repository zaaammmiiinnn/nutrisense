'use client';
import React from 'react';
import { getHealthScoreColor, getHealthScoreLabel } from '@/lib/utils';

export default function HealthScoreBadge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'lg' ? 80 : size === 'md' ? 56 : 40;
  const fontSize = size === 'lg' ? '1.5rem' : size === 'md' ? '1.1rem' : '0.8rem';
  const color = getHealthScoreColor(score);
  const circumference = 2 * Math.PI * (dim / 2 - 4);
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{ position: 'relative', width: dim, height: dim }}>
        <svg width={dim} height={dim} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={dim/2} cy={dim/2} r={dim/2 - 4} fill="none" stroke="var(--border-glass)" strokeWidth={3} />
          <circle cx={dim/2} cy={dim/2} r={dim/2 - 4} fill="none" stroke={color} strokeWidth={3}
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <span style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize, color,
        }}>{score}</span>
      </div>
      {size !== 'sm' && (
        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {getHealthScoreLabel(score)}
        </span>
      )}
    </div>
  );
}
