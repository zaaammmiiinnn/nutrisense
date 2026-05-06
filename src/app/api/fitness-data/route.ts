import { NextResponse } from 'next/server';
import { DEMO_FITNESS_DATA } from '@/lib/demo-data';

export async function GET() {
  try {
    // Google Fit REST API is deprecated (shutdown 2026).
    // This endpoint provides simulated fitness data with the same structure
    // that would come from Google Health API / Health Connect.
    // When Google Health API is available, swap the data source here.

    await new Promise(r => setTimeout(r, 300));

    const todayData = DEMO_FITNESS_DATA[DEMO_FITNESS_DATA.length - 1];
    const weeklyAvg = {
      avgSteps: Math.round(DEMO_FITNESS_DATA.reduce((s, d) => s + d.steps, 0) / DEMO_FITNESS_DATA.length),
      avgCaloriesBurned: Math.round(DEMO_FITNESS_DATA.reduce((s, d) => s + d.caloriesBurned, 0) / DEMO_FITNESS_DATA.length),
      avgActiveMinutes: Math.round(DEMO_FITNESS_DATA.reduce((s, d) => s + d.activeMinutes, 0) / DEMO_FITNESS_DATA.length),
      totalWorkouts: DEMO_FITNESS_DATA.reduce((s, d) => s + d.workouts.length, 0),
    };

    return NextResponse.json({
      success: true, mode: 'demo',
      data: { today: todayData, history: DEMO_FITNESS_DATA, weeklyAvg },
    });
  } catch (error) {
    console.error('Fitness data error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch fitness data' }, { status: 500 });
  }
}
