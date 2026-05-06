import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage = 'es' } = await request.json();
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

    if (!apiKey) {
      await new Promise(r => setTimeout(r, 300));
      const demoTranslations: Record<string, Record<string, string>> = {
        es: { 'Grilled Chicken Salad': 'Ensalada de Pollo a la Parrilla', 'Protein Smoothie Bowl': 'Bowl de Batido de Proteínas', 'Baked Salmon': 'Salmón al Horno' },
        hi: { 'Grilled Chicken Salad': 'ग्रिल्ड चिकन सलाद', 'Protein Smoothie Bowl': 'प्रोटीन स्मूदी बाउल', 'Baked Salmon': 'बेक्ड सैल्मन' },
        fr: { 'Grilled Chicken Salad': 'Salade de Poulet Grillé', 'Protein Smoothie Bowl': 'Bol Smoothie Protéiné', 'Baked Salmon': 'Saumon Cuit au Four' },
      };
      const translated = demoTranslations[targetLanguage]?.[text] || `[${targetLanguage}] ${text}`;
      return NextResponse.json({ success: true, translated, mode: 'demo' });
    }

    const res = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, target: targetLanguage, format: 'text' }),
      }
    );
    const data = await res.json();
    const translated = data.data?.translations?.[0]?.translatedText || text;

    return NextResponse.json({ success: true, translated, mode: 'live' });
  } catch (error) {
    console.error('Translate error:', error);
    return NextResponse.json({ success: true, translated: 'Translation unavailable', mode: 'demo' });
  }
}
