import Link from "next/link";
import { db } from "@/lib/db";
import { getActivePlayer } from "@/lib/active-player";
import { NightBroadcast } from "@/components/night-broadcast";
import { broadcastForWeek, getWeekKey, getWeekStart } from "@/lib/broadcast";

export default async function BroadcastPage() {
  const activePlayer = await getActivePlayer();

  if (!activePlayer) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-6 text-center italic text-glow-dim">
        <p>The farmhouse is dark. No traveler on the line.</p>
        <Link
          href="/"
          className="btn-glow rounded-full px-6 py-2 font-display text-xs font-semibold not-italic tracking-[0.15em]"
        >
          HEAD HOME
        </Link>
      </main>
    );
  }

  const week = getWeekKey();
  const broadcast = broadcastForWeek(week);

  const [completedThisWeek, currentLockIn, log] = await Promise.all([
    db.task.count({
      where: {
        playerId: activePlayer.id,
        completed: true,
        completedAt: { gte: getWeekStart() },
      },
    }),
    db.broadcast.findUnique({
      where: { playerId_week: { playerId: activePlayer.id, week } },
    }),
    db.broadcast.findMany({
      where: { playerId: activePlayer.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const pastTransmissions = log.filter((b) => b.week !== week);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      <div className="text-center">
        <p className="font-display text-[11px] font-semibold tracking-[0.3em] text-glow-dim">
          OHMSTEAD
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-wide text-foreground">
          Something on the air
        </h1>
        <p className="mt-2 italic text-glow-dim">
          The old console radio in the farmhouse kitchen. Every quest you answer clears a little
          more of the static.
        </p>
      </div>

      <NightBroadcast
        completedThisWeek={completedThisWeek}
        broadcast={broadcast}
        alreadyTuned={!!currentLockIn}
      />

      {pastTransmissions.length > 0 && (
        <details className="text-glow-dim">
          <summary className="cursor-pointer font-display text-xs font-semibold tracking-[0.2em]">
            TRANSMISSION LOG ({pastTransmissions.length})
          </summary>
          <ul className="mt-4 flex flex-col gap-4">
            {pastTransmissions.map((b) => (
              <li key={b.id} className="panel-inset rounded-lg px-5 py-4">
                <p className="font-display text-[10px] font-semibold tracking-[0.25em] text-glow-dim">
                  {b.week} — {b.frequency}kc
                </p>
                <p className="mt-1.5 font-serif italic leading-relaxed text-[#9dbcaa]">
                  {b.transmission}
                </p>
              </li>
            ))}
          </ul>
        </details>
      )}
    </main>
  );
}
