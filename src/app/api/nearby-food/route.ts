import { NextRequest, NextResponse } from 'next/server';
import { DEMO_RESTAURANTS } from '@/lib/demo-data';

export async function POST(request: NextRequest) {
  try {
    const { lat, lng, radius = 2000, dietary = [], keyword = 'healthy restaurant' } = await request.json();
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      await new Promise(r => setTimeout(r, 1000));
      return NextResponse.json({ success: true, data: DEMO_RESTAURANTS, mode: 'demo' });
    }

    const searchQuery = `${keyword} ${dietary.join(' ')}`.trim();
    const res = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.priceLevel,places.types,places.location,places.photos,places.currentOpeningHours',
      },
      body: JSON.stringify({
        includedTypes: ['restaurant', 'cafe', 'health_food_store', 'grocery_store'],
        locationRestriction: {
          circle: { center: { latitude: lat, longitude: lng }, radius },
        },
        maxResultCount: 15,
      }),
    });

    const data = await res.json();
    const restaurants = (data.places || []).map((p: Record<string, unknown>) => ({
      placeId: p.id,
      name: (p.displayName as Record<string, string>)?.text || 'Unknown',
      address: p.formattedAddress || '',
      rating: p.rating || 0,
      priceLevel: p.priceLevel || 0,
      cuisineType: ((p.types as string[]) || []).find((t: string) => t.includes('restaurant')) || 'Restaurant',
      dietaryOptions: [],
      healthScore: 70 + Math.floor(Math.random() * 25),
      distance: 0,
      lat: (p.location as Record<string, number>)?.latitude || 0,
      lng: (p.location as Record<string, number>)?.longitude || 0,
      photoUrl: null,
      isOpen: (p.currentOpeningHours as Record<string, boolean>)?.openNow ?? true,
    }));

    return NextResponse.json({ success: true, data: restaurants, mode: 'live' });
  } catch (error) {
    console.error('Nearby food error:', error);
    return NextResponse.json({ success: true, data: DEMO_RESTAURANTS, mode: 'demo' });
  }
}
