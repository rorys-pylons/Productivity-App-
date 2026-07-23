export const DREAD_LEVELS = [
  { value: 1, label: "A gentle errand" },
  { value: 2, label: "A minor nuisance" },
  { value: 3, label: "A grim chore" },
  { value: 4, label: "A dreaded task" },
  { value: 5, label: "A true ordeal" },
] as const;

const DREAD_MULTIPLIERS: Record<number, number> = {
  1: 0.6,
  2: 0.9,
  3: 1.2,
  4: 1.6,
  5: 2.2,
};

export function calculateTaskPoints(minutes: number, dread: number): number {
  const multiplier = DREAD_MULTIPLIERS[dread] ?? 1.2;
  return Math.max(5, Math.round(minutes * multiplier));
}
