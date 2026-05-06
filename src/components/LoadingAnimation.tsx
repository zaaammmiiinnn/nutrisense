'use client';
import React from 'react';
import { Loader } from 'lucide-react';

export default function LoadingAnimation({ text = 'Loading...', size = 'md' }: { text?: string; size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'lg' ? 48 : size === 'md' ? 32 : 20;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40 }}>
      <div style={{ position: 'relative', width: dim, height: dim }}>
        <Loader size={dim} style={{ animation: 'spin 1.2s linear infinite', color: 'var(--color-accent)' }} />
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: size === 'sm' ? '0.75rem' : '0.875rem', fontWeight: 500 }}>{text}</p>
    </div>
  );
}
