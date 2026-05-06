'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { HealthGoal, DietaryRestriction, ActivityLevel } from '@/lib/firestore-schema';
import { Save, User, Target, Utensils, Globe, Calendar, Bell, Shield } from 'lucide-react';

const healthGoals: { value: HealthGoal; label: string; emoji: string }[] = [
  { value: 'weight_loss', label: 'Weight Loss', emoji: '⚡' },
  { value: 'muscle_gain', label: 'Muscle Gain', emoji: '💪' },
  { value: 'maintenance', label: 'Maintenance', emoji: '⚖️' },
  { value: 'diabetes_management', label: 'Diabetes Management', emoji: '🩺' },
  { value: 'heart_health', label: 'Heart Health', emoji: '❤️' },
  { value: 'general_wellness', label: 'General Wellness', emoji: '🌿' },
];

const dietaryOptions: { value: DietaryRestriction; label: string }[] = [
  { value: 'vegetarian', label: 'Vegetarian' }, { value: 'vegan', label: 'Vegan' },
  { value: 'gluten_free', label: 'Gluten Free' }, { value: 'dairy_free', label: 'Dairy Free' },
  { value: 'keto', label: 'Keto' }, { value: 'paleo', label: 'Paleo' },
  { value: 'halal', label: 'Halal' }, { value: 'kosher', label: 'Kosher' },
  { value: 'low_sodium', label: 'Low Sodium' }, { value: 'low_sugar', label: 'Low Sugar' },
];

const activityLevels: { value: ActivityLevel; label: string }[] = [
  { value: 'sedentary', label: 'Sedentary (little exercise)' },
  { value: 'lightly_active', label: 'Lightly Active (1-3 days/week)' },
  { value: 'moderately_active', label: 'Moderately Active (3-5 days/week)' },
  { value: 'very_active', label: 'Very Active (6-7 days/week)' },
  { value: 'extremely_active', label: 'Extremely Active (athlete)' },
];

const languages = [
  { code: 'en', label: 'English' }, { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' }, { code: 'hi', label: 'हिन्दी' },
  { code: 'de', label: 'Deutsch' }, { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' }, { code: 'ar', label: 'العربية' },
];

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [saved, setSaved] = useState(false);

  const [goal, setGoal] = useState<HealthGoal>(user?.healthGoal || 'general_wellness');
  const [restrictions, setRestrictions] = useState<DietaryRestriction[]>(user?.dietaryRestrictions || []);
  const [allergies, setAllergies] = useState(user?.allergies.join(', ') || '');
  const [language, setLanguage] = useState(user?.preferredLanguage || 'en');
  const [activity, setActivity] = useState<ActivityLevel>(user?.activityLevel || 'moderately_active');
  const [height, setHeight] = useState(user?.height || 170);
  const [weight, setWeight] = useState(user?.weight || 70);
  const [age, setAge] = useState(user?.age || 25);
  const [targetCal, setTargetCal] = useState(user?.targetCalories || 2000);

  useEffect(() => { if (!user) router.push('/'); }, [user, router]);
  if (!user) return null;

  const toggleRestriction = (r: DietaryRestriction) => {
    setRestrictions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
  };

  const handleSave = () => {
    updateProfile({
      healthGoal: goal, dietaryRestrictions: restrictions,
      allergies: allergies.split(',').map(a => a.trim()).filter(Boolean),
      preferredLanguage: language, activityLevel: activity,
      height, weight, age, targetCalories: targetCal,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page-container">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="main-content" style={{ marginLeft: collapsed ? 72 : undefined, maxWidth: 800 }}>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1>Settings ⚙️</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Customize your health profile and preferences</p>
          </div>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} /> {saved ? 'Saved ✓' : 'Save Changes'}
          </button>
        </div>

        {/* Profile */}
        <div className="glass-card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><User size={18} style={{ color: 'var(--color-accent)' }} /><h3>Profile</h3></div>
          <div className="grid-3">
            <div><label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Height (cm)</label><input className="input" type="number" value={height} onChange={e => setHeight(+e.target.value)} /></div>
            <div><label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Weight (kg)</label><input className="input" type="number" value={weight} onChange={e => setWeight(+e.target.value)} /></div>
            <div><label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Age</label><input className="input" type="number" value={age} onChange={e => setAge(+e.target.value)} /></div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Activity Level</label>
            <select className="input" value={activity} onChange={e => setActivity(e.target.value as ActivityLevel)}>
              {activityLevels.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Daily Calorie Target</label>
            <input className="input" type="number" value={targetCal} onChange={e => setTargetCal(+e.target.value)} />
          </div>
        </div>

        {/* Health Goal */}
        <div className="glass-card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><Target size={18} style={{ color: 'var(--color-accent)' }} /><h3>Health Goal</h3></div>
          <div className="grid-3">
            {healthGoals.map(g => (
              <button key={g.value} onClick={() => setGoal(g.value)}
                style={{ padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center', cursor: 'pointer',
                  background: goal === g.value ? 'rgba(16,185,129,0.1)' : 'var(--bg-glass)',
                  border: `2px solid ${goal === g.value ? 'var(--color-accent)' : 'var(--border-glass)'}`,
                  color: 'var(--text-primary)', transition: 'all 0.2s',
                }}>
                <span style={{ fontSize: '1.5rem' }}>{g.emoji}</span>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: 8 }}>{g.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Dietary */}
        <div className="glass-card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><Utensils size={18} style={{ color: 'var(--color-accent)' }} /><h3>Dietary Restrictions</h3></div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {dietaryOptions.map(d => (
              <button key={d.value} onClick={() => toggleRestriction(d.value)}
                className={`btn ${restrictions.includes(d.value) ? 'btn-primary' : 'btn-secondary'} btn-sm`}>
                {d.label}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Allergies (comma separated)</label>
            <input className="input" value={allergies} onChange={e => setAllergies(e.target.value)} placeholder="e.g., peanuts, shellfish, soy" />
          </div>
        </div>

        {/* Language & Integrations */}
        <div className="grid-2" style={{ marginBottom: 20 }}>
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><Globe size={18} style={{ color: 'var(--color-accent)' }} /><h3>Language</h3></div>
            <select className="input" value={language} onChange={e => setLanguage(e.target.value)}>
              {languages.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 8 }}>Meal plans and food labels will be translated via Google Translate API</p>
          </div>
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><Shield size={18} style={{ color: 'var(--color-accent)' }} /><h3>Connected Services</h3></div>
            {[
              { name: 'Firebase Auth', status: 'Connected', icon: '🔐' },
              { name: 'Google Calendar', status: 'Available', icon: '📅' },
              { name: 'Google Fit', status: 'Demo Mode', icon: '🏃' },
              { name: 'Google Sheets', status: 'Available', icon: '📊' },
            ].map(s => (
              <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-glass)', fontSize: '0.8rem' }}>
                <span>{s.icon} {s.name}</span>
                <span className={`badge ${s.status === 'Connected' ? 'badge-success' : s.status === 'Demo Mode' ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: '0.65rem' }}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
