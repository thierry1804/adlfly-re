import { NextResponse } from 'next/server';
import { feature } from 'topojson-client';

const GEO_971 =
  'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements/971-guadeloupe/departement-971-guadeloupe.geojson';
const GEO_972 =
  'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements/972-martinique/departement-972-martinique.geojson';
const GEO_974 =
  'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements/974-la-reunion/departement-974-la-reunion.geojson';
const GEO_976 =
  'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements/976-mayotte/departement-976-mayotte.geojson';
const WORLD_TOPJSON_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export async function GET() {
  try {
    const [res971, res972, res974, res976, worldRes] = await Promise.all([
      fetch(GEO_971, { next: { revalidate: 86400 } }),
      fetch(GEO_972, { next: { revalidate: 86400 } }),
      fetch(GEO_974, { next: { revalidate: 86400 } }),
      fetch(GEO_976, { next: { revalidate: 86400 } }),
      fetch(WORLD_TOPJSON_URL, { next: { revalidate: 86400 } }),
    ]);
    if (!res971.ok || !res972.ok || !res974.ok || !res976.ok || !worldRes.ok) {
      throw new Error('Geo fetch failed');
    }

    const [geo971, geo972, reunion, mayotte, world] = await Promise.all([
      res971.json(),
      res972.json(),
      res974.json(),
      res976.json(),
      worldRes.json(),
    ]);

    const worldFeatures = feature(world, world.objects.countries);
    const madagascar = (worldFeatures as GeoJSON.FeatureCollection).features?.find(
      (f: GeoJSON.Feature) => (f.properties as { name?: string } | null)?.name === 'Madagascar'
    );

    const features = [
      { ...reunion, properties: { ...reunion.properties, code: '974' } },
      { ...mayotte, properties: { ...mayotte.properties, code: '976' } },
      { ...geo971, properties: { ...geo971.properties, code: '971' } },
      { ...geo972, properties: { ...geo972.properties, code: '972' } },
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
    console.error('Geo Bureaux error:', e);
    return NextResponse.json({ type: 'FeatureCollection', features: [] }, { status: 200 });
  }
}
