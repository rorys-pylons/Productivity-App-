import Link from "next/link";
import { db } from "@/lib/db";
import { getActivePlayer } from "@/lib/active-player";
import { ensureRewardsWheel } from "@/lib/wheels";
import { CircuitBreaker, type WheelData } from "@/components/circuit-breaker";
import { CarnivalLights } from "@/components/carnival-lights";

export default async function WheelPage() {
  const activePlayer = await getActivePlayer();

  if (!activePlayer) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-6 text-center italic text-glow-dim">
        <p>The breaker&apos;s thrown. No traveler on the line.</p>
        <Link href="/" className="btn-glow rounded-full px-6 py-2 font-display text-xs font-semibold not-italic tracking-[0.15em]">
          HEAD HOME
        </Link>
      </main>
    );
  }

  await ensureRewardsWheel(activePlayer.valleyId);

  const [wheelRows, questRows] = await Promise.all([
    db.wheel.findMany({
      where: { valleyId: activePlayer.valleyId },
      orderBy: [{ kind: "desc" }, { createdAt: "asc" }],
      include: { segments: { orderBy: { order: "asc" } } },
    }),
    db.task.findMany({
      where: { playerId: activePlayer.id, completed: false },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const wheels: WheelData[] = wheelRows.map((w) => ({
    id: w.id,
    name: w.name,
    kind: w.kind,
    segments: w.segments.map((s) => ({
      id: s.id,
      label: s.label,
      color: s.color,
      bonusPoints: s.bonusPoints,
    })),
  }));

  const quests = questRows.map((q) => ({ id: q.id, title: q.title, points: q.points }));

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-8 px-6 py-12">
      <div className="text-center">
        <p className="font-display text-[11px] font-semibold tracking-[0.3em] text-glow-dim">
          CIRCUIT BREAKER
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-wide text-foreground">
          Step right up
        </h1>
        <p className="mt-2 italic text-glow-dim">
          Old wheels wired straight into the grid. The house wheel takes its toll — the rest
          spin free, for when deciding is the hardest chore of all.
        </p>
      </div>
      <CarnivalLights />
      <CircuitBreaker
        key={activePlayer.id}
        wheels={wheels}
        quests={quests}
        initialPoints={activePlayer.points}
      />
    </main>
  );
}
