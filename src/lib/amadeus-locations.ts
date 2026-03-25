/** Normalise Unicode avant alias / sanitisation (l'API Amadeus recoit une forme ASCII via `sanitizeKeywordForAmadeus`). */
export function normalizeLocationKeyword(raw: string): string {
  return raw.normalize('NFC').trim();
}

/**
 * Alias exacts (insensible a la casse) : l'API matche souvent le debut d'un mot ;
 * "iva" / "ivato" / "IVA(TO)" -> on cherche "antananarivo" (qui renvoie des donnees dans l'environnement de test),
 * plutot que le code IATA, car Amadeus ne semble pas toujours matcher les codes en recherche texte.
 */
const EXACT_LOCATION_KEYWORD_ALIASES: Record<string, string> = {
  iva: 'antananarivo',
  ivato: 'antananarivo',
};

export function expandLocationSearchKeyword(keyword: string): string {
  const k = keyword.trim();
  const kLower = k.toLowerCase();
  // Ex: "iva(TO)" -> "ivato"
  const lettersOnly = kLower.replace(/[^a-z]/g, '');
  const alias =
    EXACT_LOCATION_KEYWORD_ALIASES[lettersOnly] ??
    EXACT_LOCATION_KEYWORD_ALIASES[kLower];
  return alias ?? k;
}

/**
 * Amadeus Airport & City Search : le parametre `keyword` doit respecter un sous-ensemble ASCII
 * (ex. pas d'accents, "reunion" au lieu de "reunion" -> 477 INVALID FORMAT).
 * City Search : longueur [3, 50] pour `keyword` (sinon 2781 INVALID LENGTH).
 *
 * Strategie multi-mots :
 * 1. Garder les tokens significatifs (>= 3 chars) et les joindre par espace.
 * 2. Si aucun token significatif, concatener tout (saisie en cours, ex. "la re" -> "lare").
 * 3. Retomber sur le dernier token si rien d'autre ne fonctionne.
 *
 * Exemples : "la reunion" -> "reunion", "Grand-Case L Esperance" -> "Grand-Case Esperance"
 */
export function sanitizeKeywordForAmadeus(keyword: string): string {
  const trimmed = keyword.trim();
  if (!trimmed) return '';

  const noDiacritics = trimmed
    .normalize('NFD')
    .replace(/\p{M}/gu, '');

  // Caracteres autorises cote Amadeus (voir doc Airport & City Search)
  const sanitize = (s: string) => s.replace(/[^A-Za-z0-9 ./:\-'"()]/g, '').trim();

  const tokens = noDiacritics.split(/\s+/).filter(Boolean);

  if (tokens.length <= 1) {
    return sanitize(tokens[0] ?? '');
  }

  // Garder les tokens significatifs (>= 3 chars), ex. "la reunion" -> ["reunion"]
  const significant = tokens.filter((t) => t.replace(/[^A-Za-z]/g, '').length >= 3);

  if (significant.length > 0) {
    return sanitize(significant.join(' ')).slice(0, 50);
  }

  // Saisie partielle : concatener pour garder une requete valide
  return sanitize(tokens.join(''));
}

export type UnifiedLocation = {
  id?: string;
  name: string;
  iata: string;
  detailedName: string;
  type: string;
  city: string;
  country?: string;
  countryCode?: string;
};

function typeRank(type: string): number {
  const t = type.toUpperCase();
  if (t === 'AIRPORT') return 0;
  if (t === 'CITY') return 1;
  return 2;
}

/** Garde une seule entree par code IATA (evite doublon AIRPORT + CITY pour le meme code). */
function pickBetterLocation(a: UnifiedLocation, b: UnifiedLocation): UnifiedLocation {
  const ra = typeRank(a.type);
  const rb = typeRank(b.type);
  if (ra !== rb) return ra < rb ? a : b;
  const la = a.detailedName?.length ?? 0;
  const lb = b.detailedName?.length ?? 0;
  if (la !== lb) return la > lb ? a : b;
  return a;
}

export function mergeAndDedupeLocations(locations: UnifiedLocation[]): UnifiedLocation[] {
  const map = new Map<string, UnifiedLocation>();
  for (const loc of locations) {
    if (!loc.iata) continue;
    const key = loc.iata.trim().toUpperCase();
    const existing = map.get(key);
    if (!existing) {
      map.set(key, loc);
    } else {
      map.set(key, pickBetterLocation(existing, loc));
    }
  }
  return [...map.values()];
}

/** Reponse "Airport & City Search" (v1/reference-data/locations) */
export function mapAirportCityEntry(loc: Record<string, unknown>): UnifiedLocation | null {
  const address = (loc.address ?? {}) as Record<string, unknown>;
  const iata = String(loc.iataCode ?? loc.IATACode ?? '');
  if (!iata) return null;
  const subType = String(loc.subType ?? 'LOCATION').toUpperCase();
  const name = String(loc.name ?? '');
  const city = String(
    address.cityName ?? loc.cityName ?? name
  );
  const country =
    address.countryName != null
      ? String(address.countryName)
      : loc.countryName != null
        ? String(loc.countryName)
        : undefined;
  const countryCode =
    address.countryCode != null
      ? String(address.countryCode)
      : loc.countryCode != null
        ? String(loc.countryCode)
        : undefined;
  const detailedName =
    typeof loc.detailedName === 'string' && loc.detailedName
      ? loc.detailedName
      : [city, country].filter(Boolean).join(' - ');

  return {
    id: typeof loc.id === 'string' ? loc.id : undefined,
    name,
    iata,
    detailedName,
    type: subType,
    city,
    country,
    countryCode,
  };
}

/** Index des aeroports "included" (objet ou tableau style JSON:API). */
function indexIncludedAirports(body: Record<string, unknown>): Record<string, Record<string, unknown>> {
  const inc = body.included;
  if (inc && typeof inc === 'object' && !Array.isArray(inc)) {
    const block = (inc as Record<string, unknown>).airports;
    if (block && typeof block === 'object' && !Array.isArray(block)) {
      return block as Record<string, Record<string, unknown>>;
    }
  }
  if (Array.isArray(inc)) {
    const map: Record<string, Record<string, unknown>> = {};
    for (const item of inc as Record<string, unknown>[]) {
      const st = String(item.subType ?? item.type ?? '').toUpperCase();
      if (st !== 'AIRPORT' && !String(item.type ?? '').toLowerCase().includes('airport')) continue;
      const id = String(item.id ?? item.iataCode ?? '');
      if (id) map[id] = item;
    }
    return map;
  }
  return {};
}

/**
 * City Search + aeroports lies (include=AIRPORTS).
 * Le champ keyword de cette API est limite a 10 caracteres.
 */
export function flattenCitySearchResponse(body: Record<string, unknown>): UnifiedLocation[] {
  const data = body.data;
  if (!Array.isArray(data)) return [];

  const airportsBlock = indexIncludedAirports(body);

  const out: UnifiedLocation[] = [];

  for (const loc of data as Record<string, unknown>[]) {
    const address = (loc.address ?? {}) as Record<string, unknown>;
    const iata = String(loc.iataCode ?? '');
    if (!iata) continue;

    const name = String(loc.name ?? '');
    const countryCode =
      address.countryCode != null
        ? String(address.countryCode)
        : address.CountryCode != null
          ? String(address.CountryCode)
          : undefined;

    const subTypeRaw = String(loc.subType ?? loc.subtype ?? 'CITY');
    const subType = subTypeRaw.toUpperCase();

    const cityLine = countryCode ? `${name}/${countryCode}` : name;

    out.push({
      id: typeof loc.id === 'string' ? loc.id : undefined,
      name,
      iata,
      detailedName: cityLine,
      type: subType === 'CITY' ? 'CITY' : subType,
      city: name,
      countryCode,
    });

    const relationships = loc.relationships;
    if (!Array.isArray(relationships)) continue;

    for (const rel of relationships as Record<string, unknown>[]) {
      if (String(rel.type).toLowerCase() !== 'airport') continue;
      const aid = String(rel.id ?? '');
      const apt = airportsBlock[aid];
      if (!apt) continue;
      const code = String(apt.iataCode ?? aid);
      if (!code) continue;
      const aptName = String(apt.name ?? code);
      out.push({
        id: typeof apt.id === 'string' ? String(apt.id) : aid ? `apt-${aid}` : undefined,
        name: aptName,
        iata: code,
        detailedName: countryCode ? `${cityLine}: ${aptName}` : `${name}: ${aptName}`,
        type: 'AIRPORT',
        city: name,
        countryCode,
      });
    }
  }

  return out;
}
