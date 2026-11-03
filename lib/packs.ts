// Etiqueta de un pack a partir del título de la variante ("2 Tubes", "3 Bottles").
// El sustantivo sale del título, así cada producto nuevo hereda la etiqueta
// correcta sin tocar el diseño.

export type PackLabels = { oneUnit: string; nUnits: string; oneTube: string; nTubes: string };

export function packUnits(title: string): number {
  const m = title.match(/^\s*(\d+)\s/);
  return m ? Number(m[1]) : 0;
}

export function packLabel(title: string, n: number, l: PackLabels): string {
  const tube = /\btubes?\b/i.test(title);
  if (n === 1) return tube ? l.oneTube : l.oneUnit;
  return (tube ? l.nTubes : l.nUnits).replace("{n}", String(n));
}
