import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { getAmadeusClient } from '@/lib/amadeus';

const isTestEnv = () => (process.env.AMADEUS_HOSTNAME || 'test') === 'test';

async function searchFlightOffers(params: Record<string, string | number | boolean>) {
  const amadeus = getAmadeusClient();
  const response = await amadeus.shopping.flightOffersSearch.get(params);
  const data = Array.isArray(response.data) ? response.data : [];
  console.log(
    `[Amadeus] Flight search ${params.originLocationCode}->${params.destinationLocationCode} ` +
    `${params.departureDate}: ${data.length} offers` +
    (params.includedAirlineCodes ? ` (airline: ${params.includedAirlineCodes})` : '') +
    (params.nonStop ? ' (nonStop)' : ' (with connections)')
  );
  return data;
}

const getCachedFlightOffers = unstable_cache(
  async (paramJson: string) => searchFlightOffers(JSON.parse(paramJson)),
  ['amadeus-flight-offers'],
  { revalidate: 300 }
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const originCode = searchParams.get('originCode');
  const destinationCode = searchParams.get('destinationCode');
  const departureDate = searchParams.get('departureDate');
  const returnDate = searchParams.get('returnDate');
  const adults = searchParams.get('adults') || '1';
  const includedAirlineCodes =
    searchParams.get('includedAirlineCodes')?.trim() ||
    process.env.AMADEUS_DEFAULT_INCLUDED_AIRLINE_CODES?.trim() ||
    undefined;

  if (!originCode || !destinationCode || !departureDate) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  if (!/^[A-Z]{3}$/.test(originCode) || !/^[A-Z]{3}$/.test(destinationCode)) {
    return NextResponse.json({ error: 'Invalid airport/city code format' }, { status: 400 });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(departureDate)) {
    return NextResponse.json({ error: 'Invalid departure date format (expected YYYY-MM-DD)' }, { status: 400 });
  }
  if (returnDate && !/^\d{4}-\d{2}-\d{2}$/.test(returnDate)) {
    return NextResponse.json({ error: 'Invalid return date format (expected YYYY-MM-DD)' }, { status: 400 });
  }

  const adultsCount = parseInt(adults, 10);
  if (isNaN(adultsCount) || adultsCount < 1 || adultsCount > 9) {
    return NextResponse.json({ error: 'Adults must be between 1 and 9' }, { status: 400 });
  }

  try {
    const baseParams: Record<string, string | number | boolean> = {
      originLocationCode: originCode,
      destinationLocationCode: destinationCode,
      departureDate,
      adults: adultsCount,
      currencyCode: 'EUR',
      nonStop: false,
      max: 50,
    };

    if (returnDate) {
      baseParams.returnDate = returnDate;
    }

    // En production, appliquer le filtre compagnie
    if (includedAirlineCodes && !isTestEnv()) {
      baseParams.includedAirlineCodes = includedAirlineCodes;
    }

    let data = await getCachedFlightOffers(JSON.stringify(baseParams));

    // Fallback : si 0 resultats avec filtre compagnie (meme en prod), retenter sans
    if (data.length === 0 && includedAirlineCodes && !isTestEnv()) {
      console.log('[Amadeus] 0 results with airline filter, retrying without...');
      const fallbackParams = { ...baseParams };
      delete fallbackParams.includedAirlineCodes;
      data = await getCachedFlightOffers(JSON.stringify(fallbackParams));
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
      },
    });
  } catch (error: unknown) {
    console.error('Amadeus Flight Search Error:', error);
    const amadeusError = error as { response?: { statusCode?: number; result?: { errors?: { detail?: string }[] } } };
    const detail = amadeusError?.response?.result?.errors?.[0]?.detail;
    const statusCode = amadeusError?.response?.statusCode || 500;
    return NextResponse.json(
      { error: detail || 'Failed to search flights' },
      { status: statusCode >= 400 && statusCode < 600 ? statusCode : 500 }
    );
  }
}
