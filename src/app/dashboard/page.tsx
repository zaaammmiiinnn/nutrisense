'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import MacroChart from '@/components/MacroChart';
import HealthScoreBadge from '@/components/HealthScoreBadge';
import { DEMO_MEAL_LOGS, DEMO_FITNESS_DATA } from '@/lib/demo-data';
import { Flame, Footprints, Dumbbell, Droplets, Camera, UtensilsCrossed, MessageCircle, TrendingUp, ChevronRight, Zap } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [fitnessData, setFitnessData] = useState(DEMO_FITNESS_DATA[DEMO_FITNESS_DATA.length - 1]);

  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    fetch('/api/fitness-data').then(r => r.json()).then(d => {
      if (d.success) setFitnessData(d.data.today);
    }).catch(() => {});
  }, []);

  if (loading || !user) return null;

  const meals = DEMO_MEAL_LOGS;
  const consumed = meals.reduce((s, m) => s + m.totalCalories, 0);
  const target = user.targetCalories;
  const totalP = meals.reduce((s, m) => s + m.totalProtein, 0);
  const totalC = meals.reduce((s, m) => s + m.totalCarbs, 0);
  const totalF = meals.reduce((s, m) => s + m.totalFat, 0);
  const avgScore = Math.round(meals.reduce((s, m) => s + m.healthScore, 0) / (meals.length || 1));
  const remaining = Math.max(0, target - consumed);
  const pct = Math.min(100, Math.round((consumed / target) * 100));

  return (
    <div className="page-container">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="main-content" style={{ marginLeft: collapsed ? 72 : undefined }}>
        <Navbar />
        <div className="page-header">
          <h1>Welcome back, {user.displayName.split(' ')[0]} 👋</h1>
          <p>Here&apos;s your nutrition overview for today</p>
        </div>

        {/* Top Stats */}
        <div className="grid-4" style={{ marginBottom: 24 }}>
          {[
            { icon: Flame, label: 'Calories', value: `${consumed} / ${target}`, sub: `${remaining} remaining`, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
            { icon: Footprints, label: 'Steps', value: fitnessData.steps.toLocaleString(), sub: `${fitnessData.activeMinutes} active min`, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
            { icon: Dumbbell, label: 'Burned', value: `${fitnessData.caloriesBurned} kcal`, sub: `${fitnessData.workouts.length} workout${fitnessData.workouts.length !== 1 ? 's' : ''}`, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
            { icon: Droplets, label: 'Hydration', value: '6 / 8 glasses', sub: 'Stay hydrated!', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
          ].map((s, i) => (
            <div key={i} className="glass-card stat-card animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="stat-icon" style={{ background: s.bg }}>
                <s.icon size={22} style={{ color: s.color }} />
              </div>
              <div className="stat-value" style={{ fontSize: '1.3rem' }}>{s.value}</div>
              <div className="stat-label">{s.label} · <span style={{ color: s.color }}>{s.sub}</span></div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          {/* Calorie Progress */}
          <div className="glass-card animate-fade-in">
            <h3 style={{ marginBottom: 16 }}>Daily Progress</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              <MacroChart protein={totalP} carbs={totalC} fat={totalF} size={150} />
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Calorie Budget</span>
                    <span style={{ fontWeight: 700 }}>{pct}%</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--bg-glass)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: pct > 100 ? 'var(--color-danger)' : 'var(--gradient-accent)', borderRadius: 'var(--radius-full)', transition: 'width 1s ease' }} />
                  </div>
                </div>
                {[
                  { label: 'Protein', value: totalP, target: user.targetProtein, color: 'var(--color-protein)' },
                  { label: 'Carbs', value: totalC, target: user.targetCarbs, color: 'var(--color-carbs)' },
                  { label: 'Fat', value: totalF, target: user.targetFat, color: 'var(--color-fat)' },
                ].map(m => (
                  <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', flex: 1 }}>{m.label}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{m.value}g / {m.target}g</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Insight */}
          <div className="glass-card animate-fade-in" style={{ animationDelay: '0.15s', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3>AI Health Insight</h3>
              <HealthScoreBadge score={avgScore} size="sm" />
            </div>
            <div style={{ flex: 1, padding: '16px', background: 'rgba(16,185,129,0.05)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-accent)' }}>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                <Zap size={14} style={{ color: 'var(--color-accent)', verticalAlign: 'middle' }} />{' '}
                Great job today! You&apos;re on track with your <strong style={{ color: 'var(--text-primary)' }}>{user.healthGoal.replace('_', ' ')}</strong> goal.
                Your protein intake is excellent at {totalP}g. Consider adding more fiber-rich vegetables to your dinner.
                Keep up the momentum! 🌟
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <span className="badge badge-success">Protein ✓</span>
              <span className="badge badge-warning">Fiber needs work</span>
              <span className="badge badge-info">Hydration good</span>
            </div>
          </div>
        </div>

        {/* Today's Meals */}
        <div className="glass-card animate-fade-in" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3>Today&apos;s Meals</h3>
            <button className="btn btn-primary btn-sm" onClick={() => router.push('/meal-log')}>
              <Camera size={14} /> Log Meal
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {meals.map((meal, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: ['rgba(245,158,11,0.1)', 'rgba(16,185,129,0.1)', 'rgba(59,130,246,0.1)'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                  {['🌅', '☀️', '🌙'][i]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', textTransform: 'capitalize' }}>{meal.mealType}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{meal.foodItems.map(f => f.name).join(', ')}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font-heading)' }}>{meal.totalCalories} kcal</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    P:{meal.totalProtein}g C:{meal.totalCarbs}g F:{meal.totalFat}g
                  </div>
                </div>
                <HealthScoreBadge score={meal.healthScore} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid-4" style={{ marginBottom: 24 }}>
          {[
            { icon: Camera, label: 'Log Meal', href: '/meal-log', color: '#10b981' },
            { icon: UtensilsCrossed, label: 'Meal Plan', href: '/meal-plan', color: '#3b82f6' },
            { icon: MessageCircle, label: 'AI Coach', href: '/chat', color: '#f59e0b' },
            { icon: TrendingUp, label: 'Progress', href: '/progress', color: '#8b5cf6' },
          ].map((a, i) => (
            <button key={i} className="glass-card" onClick={() => router.push(a.href)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', cursor: 'pointer', textAlign: 'left', animationDelay: `${i * 0.1}s` }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <a.icon size={20} style={{ color: a.color }} />
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', flex: 1 }}>{a.label}</span>
              <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
