// Client-safe wheel constants — no database imports here.

export const SPIN_COST = 40;
export const MAX_SEGMENTS = 12;
export const MIN_SEGMENTS = 2;

export const SEGMENT_COLORS = [
  "#1d4436",
  "#274a56",
  "#3d3354",
  "#2a5240",
  "#54432a",
  "#1f4a4a",
  "#5c3030",
  "#2e3a38",
  "#33502a",
  "#4a2f42",
  "#2a3a54",
  "#523d22",
];

export function segmentColor(index: number) {
  return SEGMENT_COLORS[index % SEGMENT_COLORS.length];
}

export function pickWeightedIndex(segments: { weight: number }[]): number {
  const total = segments.reduce((sum, s) => sum + Math.max(1, s.weight), 0);
  let roll = Math.random() * total;
  for (let i = 0; i < segments.length; i++) {
    roll -= Math.max(1, segments[i].weight);
    if (roll <= 0) return i;
  }
  return 0;
}
