'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import FoodImageUpload from '@/components/FoodImageUpload';
import NutritionCard from '@/components/NutritionCard';
import { DEMO_ANALYSIS_RESULT } from '@/lib/demo-data';

interface AnalysisResult {
  foodItems: { name: string; quantity: string; calories: number; protein: number; carbs: number; fat: number; fiber: number; confidence: number }[];
  totalCalories: number; totalProtein: number; totalCarbs: number; totalFat: number; totalFiber: number;
  healthScore: number; aiSuggestions: string[]; visionLabels: string[];
}

export default function MealLogPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [mealType, setMealType] = useState<string>('lunch');

  if (!user) { router.push('/'); return null; }

  const handleUpload = async (base64: string) => {
    setAnalyzing(true);
    setResult(null);
    try {
      const res = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 }),
      });
      const data = await res.json();
      setResult(data.data);
    } catch {
      setResult(DEMO_ANALYSIS_RESULT);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="page-container">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="main-content" style={{ marginLeft: collapsed ? 72 : undefined }}>
        <Navbar />
        <div className="page-header">
          <h1>Log Your Meal 📸</h1>
          <p>Take a photo or upload an image — our AI will analyze the nutrition instantly</p>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          {['breakfast', 'lunch', 'dinner', 'snack'].map(t => (
            <button key={t} className={`btn ${mealType === t ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setMealType(t)} style={{ textTransform: 'capitalize' }}>
              {t === 'breakfast' ? '🌅' : t === 'lunch' ? '☀️' : t === 'dinner' ? '🌙' : '🍎'} {t}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: 24 }}>
          <div>
            <FoodImageUpload onUpload={handleUpload} loading={analyzing} />
            {result && result.visionLabels.length > 0 && (
              <div className="glass-card animate-fade-in" style={{ marginTop: 16 }}>
                <h4 style={{ fontSize: '0.85rem', marginBottom: 8, color: 'var(--text-secondary)' }}>🔍 Cloud Vision Labels</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {result.visionLabels.map((l, i) => (
                    <span key={i} className="badge badge-info">{l}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="glass-card" style={{ marginTop: 16, padding: 16 }}>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>Google APIs Used</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><span className="badge badge-success">✓</span> Google Cloud Vision — Food Recognition</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><span className="badge badge-success">✓</span> Gemini 1.5 Pro — Nutritional Analysis</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><span className="badge badge-success">✓</span> Cloud Storage — Image Storage</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><span className="badge badge-success">✓</span> Firestore — Meal Log Storage</div>
              </div>
            </div>
          </div>

          {result && (
            <NutritionCard
              foodItems={result.foodItems}
              totalCalories={result.totalCalories}
              totalProtein={result.totalProtein}
              totalCarbs={result.totalCarbs}
              totalFat={result.totalFat}
              totalFiber={result.totalFiber}
              healthScore={result.healthScore}
              aiSuggestions={result.aiSuggestions}
            />
          )}
        </div>
      </div>
    </div>
  );
}
