import "server-only";
import { db } from "@/lib/db";
import { segmentColor } from "@/lib/wheel-config";
import type { Wheel, WheelSegment } from "@/generated/prisma/client";

export type WheelWithSegments = Wheel & { segments: WheelSegment[] };

const DEFAULT_REWARDS: { label: string; bonusPoints: number; weight: number }[] = [
  { label: "5 min dance break", bonusPoints: 0, weight: 20 },
  { label: "Pick tonight's dinner", bonusPoints: 0, weight: 10 },
  { label: "Skip a chore (once)", bonusPoints: 0, weight: 8 },
  { label: "20 min guilt-free scroll", bonusPoints: 0, weight: 20 },
  { label: "Treat yourself", bonusPoints: 0, weight: 15 },
  { label: "Bonus +20 stars", bonusPoints: 20, weight: 12 },
  { label: "Jackpot! +50 stars", bonusPoints: 50, weight: 5 },
  { label: "Bragging rights only", bonusPoints: 0, weight: 10 },
];

// The house wheel: created once per valley, editable forever after.
export async function ensureRewardsWheel(valleyId: string): Promise<WheelWithSegments> {
  const existing = await db.wheel.findFirst({
    where: { kind: "rewards", valleyId },
    include: { segments: { orderBy: { order: "asc" } } },
  });
  if (existing) return existing;

  return db.wheel.create({
    data: {
      valleyId,
      name: "Wheel of Fortune",
      kind: "rewards",
      segments: {
        create: DEFAULT_REWARDS.map((r, i) => ({
          label: r.label,
          color: segmentColor(i),
          bonusPoints: r.bonusPoints,
          weight: r.weight,
          order: i,
        })),
      },
    },
    include: { segments: { orderBy: { order: "asc" } } },
  });
}
