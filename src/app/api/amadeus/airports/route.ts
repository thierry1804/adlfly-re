import { NextResponse } from 'next/server';
import { getAmadeusClient } from '@/lib/amadeus';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');

  if (!keyword || keyword.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const amadeus = getAmadeusClient();
    const response = await amadeus.referenceData.locations.get({
      keyword,
      subType: 'AIRPORT,CITY'
    });

    return NextResponse.json(response.data.map((loc: any) => ({
      name: loc.name,
      iata: loc.iataCode,
      detailedName: loc.detailedName,
      type: loc.subType,
      city: loc.address.cityName,
      country: loc.address.countryName
    })));
  } catch (error) {
    console.error('Amadeus Airport Search Error:', error);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}
