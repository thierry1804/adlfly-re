import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { getAmadeusClient } from '@/lib/amadeus';
import { filterToAdlflyRegions } from '@/lib/adlfly-allowed-locations';
import {
  expandLocationSearchKeyword,
  flattenCitySearchResponse,
  mapAirportCityEntry,
  mergeAndDedupeLocations,
  normalizeLocationKeyword,
  sanitizeKeywordForAmadeus,
  type UnifiedLocation,
} from '@/lib/amadeus-locations';

/** Corps JSON complet Amadeus (data + included au même niveau). */
function amadeusFullBody(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as { result?: Record<string, unknown>; data?: unknown };
  if (v.result && typeof v.result === 'object') return v.result;
  if (Array.isArray(v.data) || v.data !== undefined) {
    return { data: v.data ?? [] };
  }
  return null;
}

function sortLocations(locations: UnifiedLocation[]): UnifiedLocation[] {
  return [...locations].sort((a, b) => {
    const order = (t: string) => (t === 'AIRPORT' ? 0 : t === 'CITY' ? 1 : 2);
    const d = order(a.type) - order(b.type);
    if (d !== 0) return d;
    return (a.city || a.name).localeCompare(b.city || b.name, 'fr', { sensitivity: 'base' });
  });
}

/** Seuil : second appel (City Search) seulement si peu de résultats après filtre régional. */
const CITY_SEARCH_FALLBACK_THRESHOLD = 4;

async function fetchCitySearchIfNeeded(
  amadeus: ReturnType<typeof getAmadeusClient>,
  cityKeyword: string,
  optionalCountry: string | null,
  unified: UnifiedLocation[]
): Promise<void> {
  /** City Search exige keyword.length entre 3 et 50 (erreur 2781 sinon). */
  if (cityKeyword.length < 3 || cityKeyword.length > 50) return;

  const cityParams: Record<string, string | number> = {
    keyword: cityKeyword,
    max: 15,
    include: 'AIRPORTS',
  };
  if (optionalCountry && /^[A-Za-z]{2}$/.test(optionalCountry)) {
    cityParams.countryCode = optionalCountry.toUpperCase();
  }

  try {
    const cityResult = await amadeus.referenceData.locations.cities.get(cityParams);
    const full = amadeusFullBody(cityResult);
    if (full) {
      unified.push(...flattenCitySearchResponse(full));
    }
  } catch (e) {
    console.error('Amadeus City Search Error:', e);
  }
}

/**
 * Logique Amadeus : 1 appel le plus souvent ; City Search en secours si peu de résultats.
 * Limites réduites ; vue FULL pour des champs `address` fiables.
 */
async function searchAmadeusLocations(
  keyword: string,
  optionalCountry: string | null
): Promise<UnifiedLocation[]> {
  const amadeus = getAmadeusClient();
  const cityKeyword = keyword.slice(0, 50);

  const airportCityParams: Record<string, string | number> = {
    keyword,
    subType: 'AIRPORT,CITY',
    'page[limit]': 22,
    view: 'FULL',
  };

  const unified: UnifiedLocation[] = [];

  try {
    const mainResult = await amadeus.referenceData.locations.get(airportCityParams);
    const rows = mainResult.data;
    if (Array.isArray(rows)) {
      for (const loc of rows) {
        const mapped = mapAirportCityEntry(loc as Record<string, unknown>);
        if (mapped) unified.push(mapped);
      }
    }
  } catch (e) {
    console.error('Amadeus Airport & City Search Error:', e);
  }

  let merged = mergeAndDedupeLocations(unified);
  let sorted = sortLocations(merged);
  let inRegion = filterToAdlflyRegions(sorted);

  if (inRegion.length < CITY_SEARCH_FALLBACK_THRESHOLD) {
    await fetchCitySearchIfNeeded(amadeus, cityKeyword, optionalCountry, unified);
    merged = mergeAndDedupeLocations(unified);
    sorted = sortLocations(merged);
    inRegion = filterToAdlflyRegions(sorted);
  }

  return inRegion.slice(0, 30);
}

/** Inclus dans la clé de cache (résultats différents si filtre ADL désactivé). */
function regionFilterCacheMode(): string {
  return process.env.ADLFLY_DISABLE_LOCATION_FILTER === 'true' ? 'nofilter' : 'filter';
}

const getCachedAirportLocations = unstable_cache(
  async (keyword: string, optionalCountry: string, _regionFilterMode: string) => {
    return searchAmadeusLocations(
      keyword,
      optionalCountry === '' ? null : optionalCountry
    );
  },
  ['amadeus-airport-locations'],
  { revalidate: 180 }
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawKeyword = searchParams.get('keyword');
  const expanded = rawKeyword
    ? expandLocationSearchKeyword(normalizeLocationKeyword(rawKeyword))
    : '';
  const keyword = sanitizeKeywordForAmadeus(expanded);

  if (!keyword || keyword.length < 2) {
    return NextResponse.json([]);
  }

  const optionalCountry = searchParams.get('countryCode');
  const cc =
    optionalCountry && /^[A-Za-z]{2}$/.test(optionalCountry)
      ? optionalCountry.toUpperCase()
      : '';

  const data = await getCachedAirportLocations(keyword, cc, regionFilterCacheMode());

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
    },
  });
}
