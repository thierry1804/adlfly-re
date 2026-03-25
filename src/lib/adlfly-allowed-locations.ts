/**
 * Codes IATA ville / aéroport autorisés pour ADL Fly :
 * Réunion, Mayotte, Madagascar, Martinique, Guadeloupe (+ îles françaises du même bassin).
 *
 * Le filtre pays seul ne suffit pas (FR inclurait toute la France métropolitaine).
 */

const ALLOWED_IATA = new Set(
  [
    // France métropolitaine — hubs Corsair
    'CDG', // Paris Charles de Gaulle
    'ORY', // Paris Orly
    'PAR', // Paris (ville)
    'LYS', // Lyon
    'MRS', // Marseille
    // Réunion
    'RUN',
    'RFP',
    // Mayotte
    'DZA',
    // Martinique
    'FDF',
    // Guadeloupe et dépendances / proche bassin FR
    'PTP',
    'SBH',
    'SFG',
    'MDE',
    'GBJ',
    'LSS',
    // Madagascar — aéroports / villes IATA courants
    'TNR',
    'NOS',
    'MJN',
    'DIE',
    'MOQ',
    'FTU',
    'TMM',
    'WVK',
    'WTA',
    'WTS',
    'BMD',
    'SMS',
    'ZVA',
    'SVB',
    'AMP',
    'BPY',
  ].map((c) => c.toUpperCase())
);

export function isAdlflyAllowedIata(iata: string | undefined | null): boolean {
  if (!iata || iata.length < 3) return false;
  return ALLOWED_IATA.has(iata.trim().toUpperCase());
}

/** Désactive le filtre régional (ex. démo / tests). */
export function isAdlflyLocationFilterDisabled(): boolean {
  return process.env.ADLFLY_DISABLE_LOCATION_FILTER === 'true';
}

export function filterToAdlflyRegions<T extends { iata: string }>(locations: T[]): T[] {
  if (isAdlflyLocationFilterDisabled()) return locations;
  return locations.filter((loc) => isAdlflyAllowedIata(loc.iata));
}
