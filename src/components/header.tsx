import Link from "next/link";
import { createPlayer, switchPlayer } from "@/app/actions";
import { InviteButton } from "@/components/invite-button";
import type { Player } from "@/generated/prisma/client";

export function Header({
  players,
  activePlayer,
  valley,
}: {
  players: Player[];
  activePlayer: Player | null;
  valley: { name: string; inviteCode: string } | null;
}) {
  return (
    <header className="border-b border-stone-edge/60 bg-moss-deep/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-[0.18em] text-glow lumen-glow"
          >
            STARLINE
          </Link>
          <nav className="flex gap-6 font-display text-xs font-semibold tracking-[0.2em] text-glow-dim">
            <Link href="/" className="transition hover:text-glow">
              THE VALLEY
            </Link>
            <Link href="/quests" className="transition hover:text-glow">
              SWITCHBOARD
            </Link>
            <Link href="/wheel" className="transition hover:text-glow">
              CIRCUIT BREAKER
            </Link>
            <Link href="/broadcast" className="transition hover:text-glow">
              OHMSTEAD
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {valley && <InviteButton inviteCode={valley.inviteCode} />}
          {activePlayer && (
            <span
              id="star-counter"
              className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-black/30 px-3 py-1 font-display text-sm font-semibold text-gold"
            >
              <span className="lumen-glow text-glow">✦</span>
              {activePlayer.points}
            </span>
          )}

          <div className="flex items-center gap-1.5">
            {players.map((p) => (
              <form key={p.id} action={switchPlayer}>
                <input type="hidden" name="playerId" value={p.id} />
                <button
                  type="submit"
                  title={p.name}
                  className="flex h-8 w-8 items-center justify-center rounded-full font-display text-xs font-bold transition"
                  style={{
                    backgroundColor: activePlayer?.id === p.id ? p.color : "transparent",
                    border: `1.5px solid ${p.color}`,
                    color: activePlayer?.id === p.id ? "#081413" : p.color,
                    boxShadow:
                      activePlayer?.id === p.id ? `0 0 12px ${p.color}66` : undefined,
                  }}
                >
                  {p.name.slice(0, 1).toUpperCase()}
                </button>
              </form>
            ))}
          </div>

          {valley && (
            <form action={createPlayer} className="flex items-center gap-1.5">
              <input
                type="text"
                name="name"
                placeholder="New traveler"
                className="w-28 rounded-full border border-stone-edge bg-black/30 px-3 py-1 text-sm text-foreground focus:border-glow-dim focus:outline-none"
              />
              <button
                type="submit"
                className="btn-glow rounded-full px-3 py-1 text-xs font-semibold"
              >
                +
              </button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}
