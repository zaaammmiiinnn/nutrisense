'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import ProgressChart from '@/components/ProgressChart';
import MacroChart from '@/components/MacroChart';
import HealthScoreBadge from '@/components/HealthScoreBadge';
import { DEMO_WEEKLY_REPORT, generateDemoCalorieHistory } from '@/lib/demo-data';
import { FileSpreadsheet, BarChart3, TrendingUp, Award, Loader } from 'lucide-react';

export default function ProgressPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [calorieData] = useState(generateDemoCalorieHistory(14));
  const report = DEMO_WEEKLY_REPORT;
  const [exporting, setExporting] = useState(false);

  useEffect(() => { if (!user) router.push('/'); }, [user, router]);
  if (!user) return null;

  const exportToSheets = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/export-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekData: report }),
      });
      const data = await res.json();
      alert(`Report exported! ${data.data.message || 'Check Google Sheets'}\n\nLooker Studio: ${data.data.lookerStudioUrl || 'N/A'}`);
    } catch { alert('Export would be sent to Google Sheets (Demo)'); }
    setExporting(false);
  };

  return (
    <div className="page-container">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="main-content" style={{ marginLeft: collapsed ? 72 : undefined }}>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1>Progress & Analytics 📊</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Track your nutrition journey and export reports</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={exportToSheets} disabled={exporting}>
              {exporting ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <FileSpreadsheet size={14} />}
              Export to Sheets
            </button>
            <button className="btn btn-primary btn-sm">
              <BarChart3 size={14} /> Looker Studio
            </button>
          </div>
        </div>

        {/* Weekly Summary Cards */}
        <div className="grid-4" style={{ marginBottom: 24 }}>
          {[
            { label: 'Avg Calories', value: report.avgCaloriesConsumed, sub: `Target: ${user.targetCalories}`, icon: '🔥', color: 'var(--color-accent)' },
            { label: 'Avg Burned', value: report.avgCaloriesBurned, sub: 'From fitness data', icon: '💪', color: 'var(--color-secondary)' },
            { label: 'Meals Logged', value: report.totalMealsLogged, sub: 'This week', icon: '📝', color: 'var(--color-warning)' },
            { label: 'Health Score', value: report.avgHealthScore, sub: 'Weekly average', icon: '⭐', color: 'var(--color-success)' },
          ].map((s, i) => (
            <div key={i} className="glass-card stat-card animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label} · {s.sub}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ marginBottom: 24 }}>
          <ProgressChart data={calorieData} height={280} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          {/* Macro Distribution */}
          <div className="glass-card animate-fade-in">
            <h3 style={{ marginBottom: 16 }}>Macro Distribution</h3>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <MacroChart protein={report.avgProtein} carbs={report.avgCarbs} fat={report.avgFat} size={180} />
            </div>
          </div>

          {/* Weekly Insights */}
          <div className="glass-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3>Weekly Insights</h3>
              <HealthScoreBadge score={report.avgHealthScore} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {report.recommendations.map((r, i) => (
                <div key={i} style={{ padding: '10px 14px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-secondary)', borderLeft: '3px solid var(--color-accent)' }}>
                  {r}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>Top Foods This Week</h4>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {report.topFoods.map(f => (
                  <span key={f} className="badge badge-success" style={{ fontSize: '0.7rem' }}>{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="glass-card animate-fade-in" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}><Award size={18} style={{ color: 'var(--color-warning)', verticalAlign: 'middle' }} /> Achievements</h3>
          <div className="grid-4">
            {[
              { emoji: '🔥', title: '7-Day Streak', desc: 'Logged meals every day', earned: true },
              { emoji: '💪', title: 'Protein Pro', desc: 'Hit protein target 5 days', earned: true },
              { emoji: '🥗', title: 'Green Machine', desc: 'Ate 5+ servings of veggies', earned: false },
              { emoji: '🏃', title: 'Active Lifestyle', desc: '10K+ steps for 3 days', earned: true },
            ].map((a, i) => (
              <div key={i} style={{
                textAlign: 'center', padding: 16, borderRadius: 'var(--radius-md)',
                background: a.earned ? 'rgba(16,185,129,0.05)' : 'var(--bg-glass)',
                border: `1px solid ${a.earned ? 'rgba(16,185,129,0.2)' : 'var(--border-glass)'}`,
                opacity: a.earned ? 1 : 0.5,
              }}>
                <span style={{ fontSize: '2rem' }}>{a.emoji}</span>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: 8 }}>{a.title}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 4 }}>{a.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* API Info */}
        <div className="glass-card" style={{ padding: 16, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <strong>Google APIs:</strong> Google Sheets API (export) · Looker Studio (dashboard) · Google Fit / Health Connect (fitness data) · Firestore (data storage)
        </div>
      </div>
    </div>
  );
}
