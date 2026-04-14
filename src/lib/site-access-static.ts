/**
 * Accès site par jetons statiques (comparaison dans le code, sans variables Vercel).
 *
 * - Remplacez les chaînes par des valeurs longues et imprévisibles.
 * - Si le dépôt est public, ces jetons seront visibles : préférez un dépôt privé ou acceptez le risque.
 * - Mettez SITE_ACCESS_GATE_ENABLED à false pour laisser le site ouvert à tous.
 */

export const SITE_ACCESS_GATE_ENABLED = true;

/** Jeton permanent : même valeur dans l’URL ?token=… */
export const STATIC_ACCESS_PERM_TOKEN = 'PB5LEk70qv8Odpq9yrwWRuDEvwoPJJaLyb4azAAVtiw';

/** Jeton temporaire : ?token=… valable uniquement entre les deux bornes ci-dessous. */
export const STATIC_ACCESS_TEMP_TOKEN = 'm38k3b4g6QK33r90w60w533M4R7L7E7M33Y';

/** Début de validité du jeton temporaire (ms depuis epoch UTC). */
export const STATIC_ACCESS_TEMP_NOT_BEFORE_MS = Date.parse('2026-04-15T00:00:00+04:00');

/** Fin de validité du jeton temporaire (exclusif : accès refusé dès ce instant). */
export const STATIC_ACCESS_TEMP_EXPIRES_AT_MS = Date.parse('2026-04-18T00:00:00+04:00');

const encoder = new TextEncoder();

const COOKIE_MAX_PERM_MS = 1000 * 60 * 60 * 24 * 365 * 10;

function timingSafeEqualUtf8(a: string, b: string): boolean {
  const ae = encoder.encode(a);
  const be = encoder.encode(b);
  if (ae.length !== be.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < ae.length; i++) {
    diff |= ae[i]! ^ be[i]!;
  }
  return diff === 0;
}

export function isStaticSiteAccessActive(): boolean {
  if (!SITE_ACCESS_GATE_ENABLED) {
    return false;
  }
  const hasPerm = STATIC_ACCESS_PERM_TOKEN.length > 0 && !isPlaceholder(STATIC_ACCESS_PERM_TOKEN);
  const hasTemp = STATIC_ACCESS_TEMP_TOKEN.length > 0 && !isPlaceholder(STATIC_ACCESS_TEMP_TOKEN);
  return hasPerm || hasTemp;
}

function isPlaceholder(s: string): boolean {
  return s.startsWith('REMPLACER');
}

export type StaticSiteAccessVerifyResult =
  | { ok: true; kind: 'permanent' | 'temporary'; cookieExpMs: number }
  | { ok: false; reason: 'invalid' | 'not_yet' | 'expired' };

export function verifyStaticSiteAccess(token: string): StaticSiteAccessVerifyResult {
  const t = token.trim();

  if (
    STATIC_ACCESS_PERM_TOKEN.length > 0 &&
    !isPlaceholder(STATIC_ACCESS_PERM_TOKEN) &&
    timingSafeEqualUtf8(t, STATIC_ACCESS_PERM_TOKEN)
  ) {
    return { ok: true, kind: 'permanent', cookieExpMs: Date.now() + COOKIE_MAX_PERM_MS };
  }

  if (
    STATIC_ACCESS_TEMP_TOKEN.length > 0 &&
    !isPlaceholder(STATIC_ACCESS_TEMP_TOKEN) &&
    timingSafeEqualUtf8(t, STATIC_ACCESS_TEMP_TOKEN)
  ) {
    const now = Date.now();
    if (now < STATIC_ACCESS_TEMP_NOT_BEFORE_MS) {
      return { ok: false, reason: 'not_yet' };
    }
    if (now >= STATIC_ACCESS_TEMP_EXPIRES_AT_MS) {
      return { ok: false, reason: 'expired' };
    }
    return { ok: true, kind: 'temporary', cookieExpMs: STATIC_ACCESS_TEMP_EXPIRES_AT_MS };
  }

  return { ok: false, reason: 'invalid' };
}
