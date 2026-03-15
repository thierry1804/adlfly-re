import { NextResponse } from 'next/server';
import { getAmadeusClient } from '@/lib/amadeus';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const originCode = searchParams.get('originCode');
  const destinationCode = searchParams.get('destinationCode');
  const departureDate = searchParams.get('departureDate');
  const returnDate = searchParams.get('returnDate');
  const adults = searchParams.get('adults') || '1';

  if (!originCode || !destinationCode || !departureDate) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const amadeus = getAmadeusClient();
    const params: any = {
      originLocationCode: originCode,
      destinationLocationCode: destinationCode,
      departureDate,
      adults: parseInt(adults),
      currencyCode: 'EUR',
      max: 10
    };

    if (returnDate) {
      params.returnDate = returnDate;
    }

    const response = await amadeus.shopping.flightOffersSearch.get(params);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Amadeus Flight Search Error:', error);
    return NextResponse.json({ error: 'Failed to search flights' }, { status: 500 });
  }
}
