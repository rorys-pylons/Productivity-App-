import { ClaimButton } from "@/components/claim-button";
import { DREAD_LEVELS } from "@/lib/points";
import type { Task } from "@/generated/prisma/client";

function dreadLabel(dread: number) {
  return DREAD_LEVELS.find((l) => l.value === dread)?.label ?? "A grim chore";
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  const pending = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  if (tasks.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-stone-edge p-8 text-center italic text-glow-dim">
        No quests yet. Post one above.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {pending.length > 0 && (
        <ul className="flex flex-col gap-3">
          {pending.map((task) => (
            <li
              key={task.id}
              className="panel flex items-center justify-between gap-4 rounded-xl px-5 py-4"
            >
              <div>
                <p className="text-lg text-foreground">{task.title}</p>
                <p className="text-sm italic text-glow-dim">
                  {task.minutes} min · {dreadLabel(task.dread)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 font-display text-sm font-bold text-gold">
                  <span className="lumen-glow text-glow">✦</span>+{task.points}
                </span>
                <ClaimButton taskId={task.id} points={task.points} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {completed.length > 0 && (
        <details className="text-glow-dim">
          <summary className="cursor-pointer font-display text-xs font-semibold tracking-[0.2em]">
            COMPLETED QUESTS ({completed.length})
          </summary>
          <ul className="mt-3 flex flex-col gap-1.5">
            {completed.map((task) => (
              <li
                key={task.id}
                className="flex justify-between gap-3 border-b border-stone-edge/40 px-1 pb-1.5 italic opacity-60"
              >
                <span className="line-through">{task.title}</span>
                <span className="font-display not-italic">✦ +{task.points}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
