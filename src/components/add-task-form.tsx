import { addTask } from "@/app/actions";
import { DREAD_LEVELS } from "@/lib/points";

export function AddTaskForm() {
  return (
    <form action={addTask} className="panel flex flex-col gap-5 rounded-2xl p-6">
      <h2 className="font-display text-sm font-semibold tracking-[0.25em] text-glow-dim">
        POST A NEW QUEST
      </h2>

      <div>
        <label className="mb-1.5 block font-display text-[11px] font-semibold tracking-[0.2em] text-glow-dim/80">
          THE QUEST
        </label>
        <input
          type="text"
          name="title"
          required
          placeholder="e.g. Fold the laundry mountain"
          className="panel-inset w-full rounded-lg px-3.5 py-2.5 text-base text-foreground focus:border-glow-dim focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block font-display text-[11px] font-semibold tracking-[0.2em] text-glow-dim/80">
          TIME REQUIRED (MINUTES)
        </label>
        <input
          type="number"
          name="minutes"
          min={1}
          required
          defaultValue={15}
          className="panel-inset w-full rounded-lg px-3.5 py-2.5 text-base text-foreground focus:border-glow-dim focus:outline-none"
        />
      </div>

      <fieldset>
        <legend className="mb-1.5 block font-display text-[11px] font-semibold tracking-[0.2em] text-glow-dim/80">
          HOW HEAVY IS THE BURDEN?
        </legend>
        <div className="flex flex-wrap gap-2">
          {DREAD_LEVELS.map((level) => (
            <label
              key={level.value}
              className="chip flex cursor-pointer items-center rounded-full px-3.5 py-1.5 text-sm italic"
            >
              <input type="radio" name="dread" value={level.value} defaultChecked={level.value === 3} className="sr-only" />
              {level.label}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        className="btn-glow rounded-full px-6 py-2.5 font-display text-sm font-semibold tracking-[0.15em]"
      >
        POST QUEST
      </button>
    </form>
  );
}
