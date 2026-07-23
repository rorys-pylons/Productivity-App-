"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  addSegment,
  createWheel,
  deleteSegment,
  deleteWheel,
  spinWheel,
  updateSegment,
} from "@/app/actions";
import { burstStars, flareCounter } from "@/lib/celebrate";
import { MAX_SEGMENTS, MIN_SEGMENTS, SPIN_COST, segmentColor } from "@/lib/wheel-config";

export type WheelData = {
  id: string;
  name: string;
  kind: string;
  segments: { id: string; label: string; color: string; bonusPoints: number }[];
};

type QuestData = { id: string; title: string; points: number };

const DEAD_BULBS = new Set([2, 7, 12]);
const DYING_BULB = 5;
const MARQUEE_BULBS = Array.from({ length: 16 }, (_, i) => {
  const angle = (i * 22.5 * Math.PI) / 180;
  return {
    left: 160 + 172 * Math.cos(angle),
    top: 160 + 172 * Math.sin(angle),
    color: DEAD_BULBS.has(i) ? "#2e3a34" : i % 2 === 0 ? "#d3b06a" : "#a8e6c9",
  };
});

type SpinResult = { label: string; bonusPoints: number };

function SpinningWheel({
  segments,
  mode,
  points,
  onPoints,
}: {
  segments: { label: string; color: string }[];
  mode: "rewards" | "custom" | "quests";
  points: number;
  onPoints: (p: number) => void;
}) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<SpinResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const segmentAngle = 360 / Math.max(1, segments.length);
  const isRewards = mode === "rewards";
  const canSpin =
    !spinning && segments.length >= MIN_SEGMENTS && (!isRewards || points >= SPIN_COST);
  const crowded = segments.length > 8;

  function animateTo(index: number, after?: () => void) {
    const targetMid = index * segmentAngle + segmentAngle / 2;
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const baseRotation = rotation - (rotation % 360);
    setRotation(baseRotation + extraSpins * 360 + (360 - targetMid));
    window.setTimeout(() => {
      setSpinning(false);
      after?.();
    }, 4000);
  }

  function handleSpin() {
    setError(null);
    setResult(null);
    setSpinning(true);

    if (isRewards) {
      startTransition(async () => {
        try {
          const r = await spinWheel();
          animateTo(r.index, () => {
            onPoints(r.points);
            setResult({ label: r.label, bonusPoints: r.bonusPoints });
            const counter = document.getElementById("star-counter");
            if (counter) {
              const rect = counter.getBoundingClientRect();
              burstStars(rect.left + rect.width / 2, rect.bottom, r.bonusPoints > 0 ? 10 : 5);
              flareCounter(counter);
            }
          });
        } catch (e) {
          setSpinning(false);
          setError(e instanceof Error ? e.message : "The wheel is stuck. Try again.");
        }
      });
    } else {
      const index = Math.floor(Math.random() * segments.length);
      animateTo(index, () => {
        setResult({ label: segments[index].label, bonusPoints: 0 });
      });
    }
  }

  return (
    <div className="flex flex-col items-center gap-7">
      <div
        id="wheel-points"
        className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-black/30 px-4 py-1.5 font-display text-sm font-semibold text-gold"
      >
        <span className="lumen-glow text-glow">✦</span>
        {points} stars
      </div>

      <div className="relative h-80 w-80">
        {MARQUEE_BULBS.map((b, i) => {
          if (DEAD_BULBS.has(i)) {
            return (
              <span
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full opacity-50"
                style={{ left: b.left - 3, top: b.top - 3, background: b.color }}
              />
            );
          }
          if (i === DYING_BULB && !spinning) {
            return (
              <span
                key={i}
                className="marquee-bulb bulb-dying"
                style={{ left: b.left - 3, top: b.top - 3, background: b.color }}
              />
            );
          }
          return (
            <span
              key={i}
              className="marquee-bulb"
              style={{
                left: b.left - 3,
                top: b.top - 3,
                background: b.color,
                animationDuration: spinning ? "0.55s" : "4.6s",
                animationDelay: spinning ? `${i * -0.069}s` : `${i * -0.58}s`,
              }}
            />
          );
        })}

        {/* Pointer with mount */}
        <div className="absolute -top-3 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center">
          <div
            className="h-3.5 w-3.5 rounded-full"
            style={{
              background: "radial-gradient(circle at 35% 30%, #ecd9a8, #d3b06a 60%, #8a6f38)",
              boxShadow: "0 0 8px rgba(211,176,106,0.6)",
            }}
          />
          <div
            className="-mt-0.5 h-0 w-0 border-l-[11px] border-r-[11px] border-t-[18px] border-l-transparent border-r-transparent"
            style={{
              borderTopColor: "#d3b06a",
              filter: "drop-shadow(0 0 6px rgba(211,176,106,0.6))",
            }}
          />
        </div>

        <div
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: "0 0 40px rgba(168,230,201,0.15), 0 0 80px rgba(168,230,201,0.06)" }}
        />

        {/* Wheel */}
        <div
          className="relative h-80 w-80 rounded-full transition-transform ease-out"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: "4000ms",
            border: "3px solid rgba(211,176,106,0.55)",
            boxShadow:
              "inset 0 0 30px rgba(0,0,0,0.6), inset 0 0 4px rgba(168,230,201,0.3), 0 10px 40px rgba(0,0,0,0.5)",
            background: `conic-gradient(${segments
              .map((s, i) => `${s.color} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg`)
              .join(", ")})`,
          }}
        >
          {segments.map((s, i) => {
            const mid = i * segmentAngle + segmentAngle / 2;
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 h-0 w-40 origin-left"
                style={{ transform: `rotate(${mid - 90}deg)` }}
              >
                <span
                  className={`absolute top-1/2 -translate-y-1/2 text-center font-display font-semibold leading-tight tracking-wide ${
                    crowded ? "left-16 w-20 text-[9px]" : "left-14 w-24 text-[10px]"
                  }`}
                  style={{
                    color: "rgba(220,232,221,0.92)",
                    textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                  }}
                >
                  {s.label.length > 34 ? s.label.slice(0, 32) + "…" : s.label}
                </span>
              </div>
            );
          })}

          {segments.map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 h-px w-40 origin-left"
              style={{
                transform: `rotate(${i * segmentAngle - 90}deg)`,
                background:
                  "linear-gradient(90deg, rgba(211,176,106,0.4), rgba(211,176,106,0.08))",
              }}
            />
          ))}
        </div>

        {/* Center hub */}
        <div
          className={`absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${spinning ? "hub-pulse" : ""}`}
          style={{
            background: "radial-gradient(circle at 35% 30%, #1d4436, #0a1815)",
            border: "2px solid rgba(211,176,106,0.6)",
            boxShadow: "0 0 16px rgba(168,230,201,0.25)",
          }}
        >
          <span className="lumen-glow text-lg text-glow">✦</span>
        </div>
      </div>

      <button
        onClick={handleSpin}
        disabled={!canSpin}
        className="btn-gold rounded-full px-9 py-3 font-display text-sm font-semibold tracking-[0.2em] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {spinning
          ? "THE WHEEL TURNS..."
          : isRewards
            ? `SPIN — ✦ ${SPIN_COST}`
            : "SPIN — FREE"}
      </button>

      {!spinning && isRewards && points < SPIN_COST && (
        <p className="text-sm italic text-glow-dim">
          The wheel wants {SPIN_COST} stars. Come back when your pockets shine.
        </p>
      )}
      {segments.length < MIN_SEGMENTS && (
        <p className="text-sm italic text-glow-dim">
          {mode === "quests"
            ? "Nothing on the board to choose from. Post some quests first."
            : "This wheel needs at least two spokes. Tinker below."}
        </p>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {result && (
        <div
          className="relative rounded-lg px-10 py-5 text-center"
          style={{
            background: "linear-gradient(160deg, rgba(58,47,22,0.5), rgba(20,16,8,0.7))",
            border: "1.5px dashed rgba(211,176,106,0.55)",
            boxShadow: "0 0 20px rgba(211,176,106,0.1)",
            transform: "rotate(-1deg)",
          }}
        >
          <p className="font-display text-[10px] font-semibold tracking-[0.35em] text-gold/70">
            {mode === "quests" ? "— THE WIRE CHOOSES —" : "— YOUR FORTUNE —"}
          </p>
          <p className="mt-1.5 font-display text-lg font-semibold text-glow lumen-glow">
            {result.label}
          </p>
          {result.bonusPoints > 0 && (
            <p className="mt-1 text-sm italic text-gold">
              The wheel pays out, for once. +{result.bonusPoints} stars
            </p>
          )}
          {mode === "quests" && (
            <Link
              href="/quests"
              className="mt-3 inline-block font-display text-[11px] font-semibold tracking-[0.2em] text-glow transition hover:text-foreground"
            >
              TO THE SWITCHBOARD →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function EditPanel({ wheel }: { wheel: WheelData }) {
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const isRewards = wheel.kind === "rewards";

  function run(fn: () => Promise<unknown>) {
    setError(null);
    startTransition(async () => {
      try {
        await fn();
      } catch (e) {
        setError(e instanceof Error ? e.message : "That didn't take.");
      }
    });
  }

  return (
    <div className="panel w-full max-w-md rounded-2xl p-5">
      <p className="font-display text-[11px] font-semibold tracking-[0.25em] text-glow-dim">
        TINKER — {wheel.name.toUpperCase()}
      </p>
      <div className="mt-4 flex flex-col gap-2">
        {wheel.segments.map((s) => (
          <div key={s.id} className="flex items-center gap-2">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ background: s.color }}
            />
            <input
              type="text"
              defaultValue={s.label}
              maxLength={40}
              onBlur={(e) => {
                const value = e.currentTarget.value.trim();
                if (value && value !== s.label) {
                  run(() => updateSegment(s.id, value, s.bonusPoints));
                }
              }}
              className="panel-inset min-w-0 flex-1 rounded-md px-3 py-1.5 text-sm text-foreground focus:border-glow-dim focus:outline-none"
            />
            {isRewards && (
              <label className="flex items-center gap-1 text-xs text-gold">
                +✦
                <input
                  type="number"
                  min={0}
                  max={500}
                  defaultValue={s.bonusPoints}
                  onBlur={(e) => {
                    const value = Number(e.currentTarget.value);
                    if (value !== s.bonusPoints) {
                      run(() => updateSegment(s.id, s.label, value));
                    }
                  }}
                  className="panel-inset w-16 rounded-md px-2 py-1.5 text-sm text-foreground focus:border-glow-dim focus:outline-none"
                />
              </label>
            )}
            <button
              onClick={() => run(() => deleteSegment(s.id))}
              title="Remove spoke"
              className="shrink-0 rounded-full border border-stone-edge px-2.5 py-1 text-xs text-glow-dim transition hover:border-red-400/60 hover:text-red-400"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          onClick={() => run(() => addSegment(wheel.id))}
          disabled={wheel.segments.length >= MAX_SEGMENTS}
          className="btn-glow rounded-full px-4 py-1.5 font-display text-[11px] font-semibold tracking-[0.15em] disabled:opacity-40"
        >
          + ADD SPOKE
        </button>
        {!isRewards && (
          <button
            onClick={() => {
              if (window.confirm(`Retire "${wheel.name}" for good?`)) {
                run(() => deleteWheel(wheel.id));
              }
            }}
            className="rounded-full border border-stone-edge px-4 py-1.5 font-display text-[11px] font-semibold tracking-[0.15em] text-glow-dim transition hover:border-red-400/60 hover:text-red-400"
          >
            RETIRE WHEEL
          </button>
        )}
      </div>
      {wheel.segments.length >= MAX_SEGMENTS && (
        <p className="mt-2 text-xs italic text-glow-dim">A wheel holds {MAX_SEGMENTS} spokes at most.</p>
      )}
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}

export function CircuitBreaker({
  wheels,
  quests,
  initialPoints,
}: {
  wheels: WheelData[];
  quests: QuestData[];
  initialPoints: number;
}) {
  const [activeId, setActiveId] = useState<string>(wheels[0]?.id ?? "quests");
  const [points, setPoints] = useState(initialPoints);
  const [tinkering, setTinkering] = useState(false);
  const [addingWheel, setAddingWheel] = useState(false);

  const activeWheel = wheels.find((w) => w.id === activeId) ?? null;
  const isQuestTab = activeId === "quests";

  const questSegments = quests.map((q, i) => ({
    label: q.title,
    color: segmentColor(i),
  }));

  return (
    <div className="flex w-full flex-col items-center gap-7">
      {/* Wheel tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {wheels.map((w) => (
          <button
            key={w.id}
            onClick={() => setActiveId(w.id)}
            className={`rounded-full border px-4 py-1.5 font-display text-[11px] font-semibold tracking-[0.15em] transition ${
              activeId === w.id
                ? "border-gold/60 bg-black/30 text-gold"
                : "border-stone-edge text-glow-dim hover:text-glow"
            }`}
          >
            {w.name.toUpperCase()}
          </button>
        ))}
        <button
          onClick={() => setActiveId("quests")}
          className={`rounded-full border px-4 py-1.5 font-display text-[11px] font-semibold tracking-[0.15em] transition ${
            isQuestTab
              ? "border-gold/60 bg-black/30 text-gold"
              : "border-stone-edge text-glow-dim hover:text-glow"
          }`}
        >
          YOUR QUESTS
        </button>
        {addingWheel ? (
          <form
            action={async (formData: FormData) => {
              await createWheel(formData);
              setAddingWheel(false);
            }}
            className="flex items-center gap-1.5"
          >
            <input
              type="text"
              name="name"
              required
              autoFocus
              maxLength={24}
              placeholder="Name the wheel"
              className="panel-inset w-36 rounded-full px-3.5 py-1.5 text-sm text-foreground focus:border-glow-dim focus:outline-none"
            />
            <button
              type="submit"
              className="btn-glow rounded-full px-3 py-1.5 font-display text-[11px] font-semibold"
            >
              FORGE
            </button>
          </form>
        ) : (
          <button
            onClick={() => setAddingWheel(true)}
            className="rounded-full border border-dashed border-stone-edge px-4 py-1.5 font-display text-[11px] font-semibold tracking-[0.15em] text-glow-dim transition hover:border-glow-dim hover:text-glow"
          >
            + NEW WHEEL
          </button>
        )}
      </div>

      <SpinningWheel
        key={activeId + (activeWheel?.segments.map((s) => s.id + s.label).join("|") ?? "")}
        segments={isQuestTab ? questSegments : (activeWheel?.segments ?? [])}
        mode={isQuestTab ? "quests" : activeWheel?.kind === "rewards" ? "rewards" : "custom"}
        points={points}
        onPoints={setPoints}
      />

      {!isQuestTab && activeWheel && (
        <button
          onClick={() => setTinkering((t) => !t)}
          className="font-display text-[11px] font-semibold tracking-[0.2em] text-glow-dim transition hover:text-glow"
        >
          {tinkering ? "CLOSE THE PANEL" : "⚙ TINKER WITH THIS WHEEL"}
        </button>
      )}
      {tinkering && !isQuestTab && activeWheel && <EditPanel wheel={activeWheel} />}
    </div>
  );
}
