import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, history, userContext } = await request.json();
    const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!geminiKey) {
      await new Promise(r => setTimeout(r, 800));
      const responses = [
        "That's a great question! Based on your health goals, I'd recommend focusing on lean proteins and complex carbohydrates. Try incorporating more grilled chicken, quinoa, and leafy greens into your meals. 🥗",
        "Looking at your recent meals, you're doing well with protein intake! Consider adding more fiber-rich foods like lentils, beans, and whole grains to improve digestion and keep you feeling full longer. 💪",
        "For your weight loss goal, try the 80/20 rule: eat nutrient-dense foods 80% of the time and allow yourself treats 20% of the time. This sustainable approach prevents burnout! 🎯",
        "Great to see you tracking your meals! Remember, hydration is key — aim for 8 glasses of water daily. Try adding lemon or cucumber for flavor without calories. 💧",
        "Based on your activity level, I'd suggest a post-workout snack with a 3:1 carb-to-protein ratio. A banana with a scoop of protein powder is perfect! 🍌",
      ];
      return NextResponse.json({
        success: true,
        message: responses[Math.floor(Math.random() * responses.length)],
        mode: 'demo',
      });
    }

    const systemPrompt = `You are NutriSense AI, an expert nutritionist and health coach. You're friendly, encouraging, and knowledgeable. User context: ${JSON.stringify(userContext || {})}. Keep responses concise (2-3 paragraphs max) and actionable. Use emojis sparingly for a friendly tone.`;

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: "I understand! I'm NutriSense AI, your personal health coach. How can I help?" }] },
      ...(history || []).map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    );
    const data = await geminiRes.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here to help! Could you rephrase that?";

    return NextResponse.json({ success: true, message: reply, mode: 'live' });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ success: true, message: "I'm having a moment — please try again! 🙏", mode: 'demo' });
  }
}
