import Link from "next/link";
import { db } from "@/lib/db";
import { getActivePlayer } from "@/lib/active-player";
import { AddTaskForm } from "@/components/add-task-form";
import { TaskList } from "@/components/task-list";

export default async function QuestsPage() {
  const activePlayer = await getActivePlayer();

  if (!activePlayer) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-6 text-center italic text-glow-dim">
        <p>Pick a traveler first.</p>
        <Link href="/" className="btn-glow rounded-full px-6 py-2 font-display text-xs font-semibold not-italic tracking-[0.15em]">
          HEAD HOME
        </Link>
      </main>
    );
  }

  const tasks = await db.task.findMany({
    where: { playerId: activePlayer.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12">
      <div className="text-center">
        <p className="font-display text-[11px] font-semibold tracking-[0.3em] text-glow-dim">
          THE SWITCHBOARD
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-wide text-foreground">
          Work to be done, {activePlayer.name}
        </h1>
        <p className="mt-2 italic text-glow-dim">
          Longer and more dreaded quests pay more stars.
        </p>
      </div>

      <AddTaskForm />
      <TaskList tasks={tasks} />
    </main>
  );
}
