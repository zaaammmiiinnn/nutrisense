import { NextRequest, NextResponse } from 'next/server';
import { DEMO_MEAL_PLAN } from '@/lib/demo-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { healthGoal, restrictions, allergies, targetCalories, recentMeals, fitnessData } = body;
    const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!geminiKey) {
      await new Promise(r => setTimeout(r, 2000));
      return NextResponse.json({ success: true, data: DEMO_MEAL_PLAN, mode: 'demo' });
    }

    const prompt = `Generate a personalized 7-day meal plan as JSON.
User profile: Goal: ${healthGoal}, Restrictions: ${restrictions?.join(', ') || 'none'}, Allergies: ${allergies?.join(', ') || 'none'}, Target: ${targetCalories} cal/day.
Recent meals: ${JSON.stringify(recentMeals?.slice(0, 3) || [])}.
Fitness: ${JSON.stringify(fitnessData || {})}.
Return JSON: { "days": [{ "date": "YYYY-MM-DD", "dayName": string, "totalCalories": number, "totalProtein": number, "totalCarbs": number, "totalFat": number, "meals": [{ "mealType": "breakfast"|"lunch"|"dinner"|"snack", "name": string, "description": string, "calories": number, "protein": number, "carbs": number, "fat": number, "fiber": number, "ingredients": string[], "recipe": string, "prepTime": number, "cookTime": number }] }] }
Only return valid JSON.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const data = await geminiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const plan = jsonMatch ? JSON.parse(jsonMatch[0]) : DEMO_MEAL_PLAN;

    return NextResponse.json({ success: true, data: { ...DEMO_MEAL_PLAN, ...plan }, mode: 'live' });
  } catch (error) {
    console.error('Meal plan error:', error);
    return NextResponse.json({ success: true, data: DEMO_MEAL_PLAN, mode: 'demo' });
  }
}
