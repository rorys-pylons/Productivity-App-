import { cookies } from "next/headers";
import { getActivePlayer, COOKIE_NAME } from "@/lib/active-player";
import { getActiveValley } from "@/lib/valley";
import { createPlayer, createValley, resumeLegacySession } from "@/app/actions";
import { WorldMap } from "@/components/world-map";

export default async function Home() {
  const [valley, activePlayer] = await Promise.all([getActiveValley(), getActivePlayer()]);

  if (!valley) {
    const cookieStore = await cookies();
    const hasLegacyPlayer = !!cookieStore.get(COOKIE_NAME)?.value;

    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-7 px-6 py-16 text-center">
        <h1 className="font-display text-4xl font-bold tracking-[0.14em] text-glow lumen-glow">
          STARLINE
        </h1>
        <p className="text-lg italic leading-relaxed text-glow-dim">
          Found a valley of your own, or join one with a friend&apos;s invite link.
        </p>
        <form action={createValley} className="flex w-full gap-2">
          <input
            type="text"
            name="name"
            required
            maxLength={32}
            placeholder="Name your valley"
            className="panel-inset flex-1 rounded-full px-5 py-2.5 text-foreground focus:border-glow-dim focus:outline-none"
          />
          <button
            type="submit"
            className="btn-glow rounded-full px-6 py-2.5 font-display text-sm font-semibold tracking-[0.15em]"
          >
            FOUND
          </button>
        </form>
        {hasLegacyPlayer && (
          <form action={resumeLegacySession}>
            <button
              type="submit"
              className="font-display text-[11px] font-semibold tracking-[0.2em] text-glow-dim transition hover:text-glow"
            >
              BEEN HERE BEFORE? PICK BACK UP →
            </button>
          </form>
        )}
      </main>
    );
  }

  if (!activePlayer) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-7 px-6 py-16 text-center">
        <p className="font-display text-[11px] font-semibold tracking-[0.3em] text-glow-dim">
          {valley.name.toUpperCase()}
        </p>
        <h1 className="font-display text-4xl font-bold tracking-[0.12em] text-glow lumen-glow">
          STARLINE
        </h1>
        <p className="text-lg italic leading-relaxed text-glow-dim">
          Pick a traveler above, or make yourself known.
        </p>
        <form action={createPlayer} className="flex w-full gap-2">
          <input
            type="text"
            name="name"
            required
            placeholder="Name your traveler"
            className="panel-inset flex-1 rounded-full px-5 py-2.5 text-foreground focus:border-glow-dim focus:outline-none"
          />
          <button
            type="submit"
            className="btn-glow rounded-full px-6 py-2.5 font-display text-sm font-semibold tracking-[0.15em]"
          >
            BEGIN
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="text-center">
        <p className="font-display text-[11px] font-semibold tracking-[0.3em] text-glow-dim">
          {valley.name.toUpperCase()}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-wide text-foreground">
          Evening, {activePlayer.name}
        </h1>
      </div>

      <WorldMap />
    </main>
  );
}
