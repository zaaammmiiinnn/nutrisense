'use client';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Search } from 'lucide-react';

export default function Navbar() {
  const { user, isDemo } = useAuth();

  return (
    <header style={{
      position: 'fixed', top: 0, right: 0, left: 'var(--sidebar-width)',
      height: 'var(--navbar-height)',
      background: 'rgba(10,14,26,0.8)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-glass)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px', zIndex: 40,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text" placeholder="Search meals, recipes, tips..."
            className="input"
            style={{ paddingLeft: 36, width: 320, height: 38, fontSize: '0.8rem' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isDemo && (
          <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
            ⚡ Demo Mode
          </span>
        )}
        <button className="btn-icon" style={{ position: 'relative' }}>
          <Bell size={18} />
          <span style={{
            position: 'absolute', top: 6, right: 6, width: 8, height: 8,
            borderRadius: '50%', background: 'var(--color-accent)',
          }} />
        </button>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 34, height: 34, borderRadius: 'var(--radius-full)',
              background: 'var(--gradient-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700, color: '#fff',
            }}>
              {user.displayName.charAt(0)}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
