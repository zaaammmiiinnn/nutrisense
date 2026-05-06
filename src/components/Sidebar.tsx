'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Camera, UtensilsCrossed, MessageCircle, MapPin, TrendingUp, Settings, LogOut, ChevronLeft, Leaf } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/meal-log', label: 'Log Meal', icon: Camera },
  { href: '/meal-plan', label: 'Meal Plan', icon: UtensilsCrossed },
  { href: '/chat', label: 'AI Coach', icon: MessageCircle },
  { href: '/explore', label: 'Explore', icon: MapPin },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0,
      width: collapsed ? '72px' : 'var(--sidebar-width)',
      background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-glass)',
      display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease',
      zIndex: 50, overflow: 'hidden',
    }}>
      <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-glass)' }}>
        <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Leaf size={20} color="#fff" />
        </div>
        {!collapsed && <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NutriSense</span>}
      </div>

      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
              borderRadius: 'var(--radius-md)', textDecoration: 'none',
              color: isActive ? 'var(--color-accent)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(16,185,129,0.1)' : 'transparent',
              fontWeight: isActive ? 600 : 400, fontSize: '0.875rem',
              transition: 'all 0.2s',
            }}>
              <item.icon size={20} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border-glass)' }}>
        {user && !collapsed && (
          <div style={{ padding: '8px 12px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-full)', background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
              {user.displayName.charAt(0)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.displayName}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {user.healthGoal.replace('_', ' ')}
              </div>
            </div>
          </div>
        )}
        <button onClick={signOut} style={{
          display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
          borderRadius: 'var(--radius-md)', width: '100%',
          color: 'var(--text-muted)', background: 'transparent',
          fontSize: '0.875rem',
        }}>
          <LogOut size={20} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Sign Out</span>}
        </button>
        <button onClick={onToggle} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '8px', borderRadius: 'var(--radius-md)', width: '100%',
          color: 'var(--text-muted)', background: 'transparent', marginTop: '4px',
        }}>
          <ChevronLeft size={18} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
        </button>
      </div>
    </aside>
  );
}
