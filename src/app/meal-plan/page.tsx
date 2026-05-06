'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { DEMO_MEAL_PLAN } from '@/lib/demo-data';
import { MealPlan } from '@/lib/firestore-schema';
import { RefreshCw, Calendar, Globe, Loader, Clock, Flame, ChevronDown, ChevronUp } from 'lucide-react';

export default function MealPlanPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [plan, setPlan] = useState<MealPlan>(DEMO_MEAL_PLAN);
  const [generating, setGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

  useEffect(() => { if (!user) router.push('/'); }, [user, router]);
  if (!user) return null;

  const generatePlan = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          healthGoal: user.healthGoal, restrictions: user.dietaryRestrictions,
          allergies: user.allergies, targetCalories: user.targetCalories,
        }),
      });
      const data = await res.json();
      if (data.data) setPlan(data.data);
    } catch { /* uses current plan */ }
    setGenerating(false);
  };

  const syncToCalendar = async () => {
    const day = plan.days[selectedDay];
    const events = day.meals.map(m => ({ summary: `🍽️ ${m.mealType}: ${m.name}`, date: day.date }));
    await fetch('/api/calendar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'create', events }) });
    alert('Meal reminders synced to Google Calendar! 📅');
  };

  const translatePlan = async () => {
    const meal = plan.days[selectedDay].meals[0];
    const res = await fetch('/api/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: meal.name, targetLanguage: 'es' }) });
    const data = await res.json();
    alert(`"${meal.name}" → "${data.translated}" (Google Translate API)`);
  };

  const day = plan.days[selectedDay];

  return (
    <div className="page-container">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="main-content" style={{ marginLeft: collapsed ? 72 : undefined }}>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1>Weekly Meal Plan 🍽️</h1>
            <p style={{ color: 'var(--text-secondary)' }}>AI-generated personalized meals for your {user.healthGoal.replace('_', ' ')} goal</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={translatePlan}><Globe size={14} /> Translate</button>
            <button className="btn btn-secondary btn-sm" onClick={syncToCalendar}><Calendar size={14} /> Sync Calendar</button>
            <button className="btn btn-primary btn-sm" onClick={generatePlan} disabled={generating}>
              {generating ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={14} />}
              {generating ? 'Generating...' : 'Regenerate'}
            </button>
          </div>
        </div>

        {/* Day Selector */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
          {plan.days.map((d, i) => (
            <button key={i} onClick={() => setSelectedDay(i)}
              className={`glass-card`}
              style={{
                padding: '12px 20px', minWidth: 120, textAlign: 'center', cursor: 'pointer',
                border: selectedDay === i ? '1px solid var(--color-accent)' : '1px solid var(--border-glass)',
                background: selectedDay === i ? 'rgba(16,185,129,0.1)' : 'var(--bg-glass)',
              }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>{d.dayName}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{d.date.slice(5)}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-accent)', marginTop: 4, fontWeight: 700 }}>{d.totalCalories} kcal</div>
            </button>
          ))}
        </div>

        {/* Day Summary */}
        <div className="grid-4" style={{ marginBottom: 24 }}>
          {[
            { label: 'Calories', value: `${day.totalCalories}`, color: 'var(--color-accent)' },
            { label: 'Protein', value: `${day.totalProtein}g`, color: 'var(--color-protein)' },
            { label: 'Carbs', value: `${day.totalCarbs}g`, color: 'var(--color-carbs)' },
            { label: 'Fat', value: `${day.totalFat}g`, color: 'var(--color-fat)' },
          ].map(s => (
            <div key={s.label} className="glass-card" style={{ textAlign: 'center', padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Meals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {day.meals.map((meal, i) => {
            const isExpanded = expandedMeal === `${selectedDay}-${i}`;
            const mealIcons = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };
            return (
              <div key={i} className="glass-card animate-fade-in" style={{ padding: 0, overflow: 'hidden', animationDelay: `${i * 0.1}s` }}>
                <button onClick={() => setExpandedMeal(isExpanded ? null : `${selectedDay}-${i}`)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'transparent', color: 'var(--text-primary)', textAlign: 'left' }}>
                  <span style={{ fontSize: '1.5rem' }}>{mealIcons[meal.mealType as keyof typeof mealIcons]}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, textTransform: 'capitalize', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{meal.mealType}</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{meal.name}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: '0.8rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Flame size={14} style={{ color: 'var(--color-accent)' }} /> {meal.calories} kcal</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} style={{ color: 'var(--text-muted)' }} /> {meal.prepTime + meal.cookTime}m</span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>
                {isExpanded && (
                  <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border-glass)' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '12px 0' }}>{meal.description}</p>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--color-protein)' }}>Protein: {meal.protein}g</span>
                      <span style={{ color: 'var(--color-carbs)' }}>Carbs: {meal.carbs}g</span>
                      <span style={{ color: 'var(--color-fat)' }}>Fat: {meal.fat}g</span>
                      <span style={{ color: 'var(--color-fiber)' }}>Fiber: {meal.fiber}g</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span className="badge badge-info"><Clock size={10} /> Prep: {meal.prepTime}m</span>
                      <span className="badge badge-warning"><Flame size={10} /> Cook: {meal.cookTime}m</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* API Info */}
        <div className="glass-card" style={{ marginTop: 24, padding: 16, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <strong>Google APIs:</strong> Gemini 1.5 Pro (meal generation) · Calendar API (sync reminders) · Translate API (multi-language) · Firestore (storage)
        </div>
      </div>
    </div>
  );
}
