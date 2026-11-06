/** Convertit "2,98 €" ou "11,92" → centimes entiers (298, 1192). */
export function parsePrice(text: string): number {
  const m = text.match(/(\d+)[,.](\d{2})/);
  if (!m) return 0;
  return parseInt(m[1], 10) * 100 + parseInt(m[2], 10);
}

/** Table des entités HTML nommées courantes. */
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

/**
 * Décode les entités HTML : nommées courantes + toutes les numériques décimales
 * (&#39;) et hexadécimales (&#x27;). Un seul passage pour éviter le double-décodage
 * (ex. "&amp;lt;" → "&lt;" et non "<"). Les entités inconnues sont laissées telles quelles.
 */
export function decode(text: string): string {
  return text.replace(/&(#[xX][0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g, (m, ent: string) => {
    if (ent[0] === '#') {
      const code = ent[1] === 'x' || ent[1] === 'X' ? parseInt(ent.slice(2), 16) : parseInt(ent.slice(1), 10);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : m;
    }
    return NAMED_ENTITIES[ent] ?? m;
  });
}
