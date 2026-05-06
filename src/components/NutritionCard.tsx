'use client';
import React from 'react';
import { FoodItem } from '@/lib/firestore-schema';
import { formatMacro } from '@/lib/utils';
import HealthScoreBadge from './HealthScoreBadge';

interface Props {
  foodItems: FoodItem[];
  totalCalories: number; totalProtein: number; totalCarbs: number;
  totalFat: number; totalFiber: number; healthScore: number;
  aiSuggestions: string[];
}

export default function NutritionCard({ foodItems, totalCalories, totalProtein, totalCarbs, totalFat, totalFiber, healthScore, aiSuggestions }: Props) {
  return (
    <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Nutritional Breakdown</h3>
        <HealthScoreBadge score={healthScore} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {[
          { label: 'Calories', value: `${totalCalories}`, unit: 'kcal', color: 'var(--color-accent)' },
          { label: 'Protein', value: formatMacro(totalProtein), unit: '', color: 'var(--color-protein)' },
          { label: 'Carbs', value: formatMacro(totalCarbs), unit: '', color: 'var(--color-carbs)' },
          { label: 'Fat', value: formatMacro(totalFat), unit: '', color: 'var(--color-fat)' },
          { label: 'Fiber', value: formatMacro(totalFiber), unit: '', color: 'var(--color-fiber)' },
        ].map(m => (
          <div key={m.label} style={{ textAlign: 'center', padding: '12px 8px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: m.color }}>{m.value}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {foodItems.length > 0 && (
        <div>
          <h4 style={{ fontSize: '0.85rem', marginBottom: 8, color: 'var(--text-secondary)' }}>Detected Items</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {foodItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                <span style={{ fontWeight: 600 }}>{item.name} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({item.quantity})</span></span>
                <div style={{ display: 'flex', gap: 12, color: 'var(--text-secondary)' }}>
                  <span>{item.calories} cal</span>
                  <span style={{ color: 'var(--color-protein)' }}>P:{formatMacro(item.protein)}</span>
                  <span style={{ color: 'var(--color-carbs)' }}>C:{formatMacro(item.carbs)}</span>
                  <span style={{ color: 'var(--color-fat)' }}>F:{formatMacro(item.fat)}</span>
                  <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{Math.round(item.confidence * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {aiSuggestions.length > 0 && (
        <div>
          <h4 style={{ fontSize: '0.85rem', marginBottom: 8, color: 'var(--text-secondary)' }}>💡 AI Suggestions</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {aiSuggestions.map((s, i) => (
              <div key={i} style={{ padding: '8px 12px', background: 'rgba(16,185,129,0.05)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-secondary)', borderLeft: '3px solid var(--color-accent)' }}>
                {s}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
