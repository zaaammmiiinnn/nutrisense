// ================================
// Utility Functions
// ================================

export function isDemoMode(): boolean {
  return !process.env.GOOGLE_GEMINI_API_KEY && 
         process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';
}

export function isClientDemoMode(): boolean {
  return !process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
         process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';
}

export function formatCalories(cal: number): string {
  return Math.round(cal).toLocaleString();
}

export function formatMacro(grams: number): string {
  return `${Math.round(grams)}g`;
}

export function getHealthScoreColor(score: number): string {
  if (score >= 80) return 'var(--color-success)';
  if (score >= 60) return 'var(--color-warning)';
  return 'var(--color-danger)';
}

export function getHealthScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Great';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Needs Improvement';
  return 'Poor';
}

export function getMacroPercentages(protein: number, carbs: number, fat: number) {
  const total = protein * 4 + carbs * 4 + fat * 9;
  if (total === 0) return { protein: 33, carbs: 34, fat: 33 };
  return {
    protein: Math.round((protein * 4 / total) * 100),
    carbs: Math.round((carbs * 4 / total) * 100),
    fat: Math.round((fat * 9 / total) * 100),
  };
}

export function calculateBMR(weight: number, height: number, age: number, gender: string): number {
  if (gender === 'male') return 10 * weight + 6.25 * height - 5 * age + 5;
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

export function calculateTDEE(bmr: number, activityLevel: string): number {
  const m: Record<string, number> = {
    sedentary: 1.2, lightly_active: 1.375, moderately_active: 1.55,
    very_active: 1.725, extremely_active: 1.9,
  };
  return bmr * (m[activityLevel] || 1.55);
}

export function getDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function getDayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

export function getWeekDates(startDate: Date = new Date()): Date[] {
  const dates: Date[] = [];
  const start = new Date(startDate);
  start.setDate(start.getDate() - start.getDay());
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
