import { NextResponse } from 'next/server';
import { feature } from 'topojson-client';

const GEO_974 =
  'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements/974-la-reunion/departement-974-la-reunion.geojson';
const GEO_976 =
  'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements/976-mayotte/departement-976-mayotte.geojson';
const WORLD_TOPJSON_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export async function GET() {
  try {
    const [reunionRes, mayotteRes, worldRes] = await Promise.all([
      fetch(GEO_974, { next: { revalidate: 86400 } }),
      fetch(GEO_976, { next: { revalidate: 86400 } }),
      fetch(WORLD_TOPJSON_URL, { next: { revalidate: 86400 } }),
    ]);
    if (!reunionRes.ok || !mayotteRes.ok || !worldRes.ok) throw new Error('Geo fetch failed');

    const [reunion, mayotte, world] = await Promise.all([
      reunionRes.json(),
      mayotteRes.json(),
      worldRes.json(),
    ]);

    const worldFeatures = feature(world, world.objects.countries);
    const madagascar = (worldFeatures as GeoJSON.FeatureCollection).features?.find(
      (f: GeoJSON.Feature) => (f.properties as { name?: string } | null)?.name === 'Madagascar'
    );

    const features = [
      { ...reunion, properties: { ...reunion.properties, code: '974' } },
      { ...mayotte, properties: { ...mayotte.properties, code: '976' } },
    ];
    if (madagascar) {
      (madagascar as GeoJSON.Feature).properties = {
        ...(madagascar.properties || {}),
        code: 'MDG',
      };
      features.push(madagascar);
    }

    return NextResponse.json({ type: 'FeatureCollection', features });
  } catch (e) {
    console.error('Geo Ocean Indien error:', e);
    return NextResponse.json({ type: 'FeatureCollection', features: [] }, { status: 200 });
  }
}
