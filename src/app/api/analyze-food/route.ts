import { NextRequest, NextResponse } from 'next/server';
import { DEMO_ANALYSIS_RESULT } from '@/lib/demo-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64 } = body;
    const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!geminiKey) {
      // Demo mode
      await new Promise(r => setTimeout(r, 1500));
      return NextResponse.json({ success: true, data: DEMO_ANALYSIS_RESULT, mode: 'demo' });
    }

    // Step 1: Cloud Vision API - Label Detection
    let visionLabels: string[] = [];
    try {
      const visionRes = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requests: [{
              image: { content: imageBase64 },
              features: [
                { type: 'LABEL_DETECTION', maxResults: 15 },
                { type: 'TEXT_DETECTION', maxResults: 5 },
              ],
            }],
          }),
        }
      );
      const visionData = await visionRes.json();
      visionLabels = visionData.responses?.[0]?.labelAnnotations?.map(
        (l: { description: string }) => l.description
      ) || [];
    } catch (e) {
      console.error('Vision API error:', e);
    }

    // Detect mime type from base64 string
    const mimeType = imageBase64.startsWith('/') ? 'image/jpeg' : 
                     imageBase64.startsWith('iVBO') ? 'image/png' : 
                     imageBase64.startsWith('UklG') ? 'image/webp' : 'image/jpeg';

    // Step 2: Gemini 1.5 Pro - Nutritional Analysis (Multimodal)
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inlineData: { mimeType, data: imageBase64 } },
              { text: `Analyze this food image. Vision API detected: ${visionLabels.join(', ')}.
Return a JSON object with:
{
  "foodItems": [{"name": string, "quantity": string, "calories": number, "protein": number, "carbs": number, "fat": number, "fiber": number, "confidence": number}],
  "totalCalories": number, "totalProtein": number, "totalCarbs": number, "totalFat": number, "totalFiber": number,
  "healthScore": number (1-100),
  "aiSuggestions": string[]
}
Only return valid JSON.` },
            ],
          }],
        }),
      }
    );

    const geminiData = await geminiRes.json();
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : DEMO_ANALYSIS_RESULT;
    analysis.visionLabels = visionLabels;

    return NextResponse.json({ success: true, data: analysis, mode: 'live' });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ success: true, data: DEMO_ANALYSIS_RESULT, mode: 'demo' });
  }
}
