import { NextResponse } from 'next/server';

const GEO_971 =
  'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements/971-guadeloupe/departement-971-guadeloupe.geojson';
const GEO_972 =
  'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements/972-martinique/departement-972-martinique.geojson';

export async function GET() {
  try {
    const [res971, res972] = await Promise.all([
      fetch(GEO_971, { next: { revalidate: 86400 } }),
      fetch(GEO_972, { next: { revalidate: 86400 } }),
    ]);
    if (!res971.ok || !res972.ok) throw new Error('Geo fetch failed');
    const [geo971, geo972] = await Promise.all([res971.json(), res972.json()]);
    const features = [
      { ...geo971, properties: { ...geo971.properties, code: '971' } },
      { ...geo972, properties: { ...geo972.properties, code: '972' } },
    ];
    return NextResponse.json({ type: 'FeatureCollection', features });
  } catch (e) {
    console.error('Geo Antilles error:', e);
    return NextResponse.json({ type: 'FeatureCollection', features: [] }, { status: 200 });
  }
}
