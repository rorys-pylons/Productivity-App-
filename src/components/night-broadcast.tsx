"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { tuneIn } from "@/app/actions";
import { burstStars, flareCounter } from "@/lib/celebrate";
import { getAudioContext, playLockIn } from "@/lib/audio";
import {
  FRAGMENT_THRESHOLDS,
  LOCK_IN_REWARD,
  QUESTS_TO_TUNE,
  type WeeklyBroadcast,
} from "@/lib/broadcast";

const GARBLE = [
  "▓▓ ▓▓▓▓▓ ▓▓▓▓ ▓▓▓ ▓▓▓▓▓▓▓ ▓▓▓▓▓ ▓▓▓▓ ▓▓ ▓▓▓▓▓▓",
  "▓▓▓▓▓ ▓▓▓ ▓▓ ▓▓▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓▓ ▓▓ ▓▓▓",
  "▓▓▓ ▓▓▓▓ ▓▓ ▓▓▓▓ ▓▓▓▓▓▓▓ ▓▓▓ ▓▓▓▓ ▓▓ ▓▓▓▓▓",
];

function StaticView({ signal }: { signal: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signalRef = useRef(signal);

  useEffect(() => {
    signalRef.current = signal;
  }, [signal]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;

    function draw() {
      const s = signalRef.current;
      const w = canvas!.width;
      const h = canvas!.height;
      ctx!.fillStyle = "#0b0d0a";
      ctx!.fillRect(0, 0, w, h);
      const noiseAmt = 1 - s;
      const dots = Math.floor(2600 * noiseAmt);
      for (let i = 0; i < dots; i++) {
        const a = Math.random() * 0.5 * noiseAmt + 0.04;
        ctx!.fillStyle = `rgba(157,188,170,${a.toFixed(2)})`;
        ctx!.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
      }
      if (s > 0.08) {
        ctx!.beginPath();
        const t = Date.now() / 900;
        for (let x = 0; x <= w; x += 3) {
          const jitter = (Math.random() - 0.5) * 14 * noiseAmt;
          const y =
            h / 2 +
            Math.sin(x / 38 + t) * 10 * s +
            Math.sin(x / 13 + t * 1.7) * 4 * s +
            jitter;
          if (x === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        ctx!.strokeStyle = `rgba(168,230,201,${(0.15 + 0.6 * s).toFixed(2)})`;
        ctx!.lineWidth = 1.4;
        ctx!.stroke();
      }
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={70}
      className="mt-3 h-[70px] w-full rounded border border-[#1c332b] bg-[#0b0d0a]"
    />
  );
}

export function NightBroadcast({
  completedThisWeek,
  broadcast,
  alreadyTuned,
}: {
  completedThisWeek: number;
  broadcast: WeeklyBroadcast;
  alreadyTuned: boolean;
}) {
  const signal = alreadyTuned ? 1 : Math.min(1, completedThisWeek / QUESTS_TO_TUNE);
  const pct = Math.round(signal * 100);
  const [tuned, setTuned] = useState(alreadyTuned);
  const [transmission, setTransmission] = useState<string | null>(
    alreadyTuned ? broadcast.transmission : null
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Needle rests at the left edge and closes on the station as signal clears
  const needleLeft = 8 + 63 * signal;
  const stationLeft = 71;

  function handleTuneIn() {
    setError(null);
    // Wake the context inside the click gesture so the sound can play after the await
    void getAudioContext().resume();
    startTransition(async () => {
      try {
        const result = await tuneIn();
        playLockIn();
        setTransmission(result.transmission);
        setTuned(true);
        const counter = document.getElementById("star-counter");
        if (counter) {
          const rect = counter.getBoundingClientRect();
          burstStars(rect.left + rect.width / 2, rect.bottom, 10);
          flareCounter(counter);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "The dial slipped. Try again.");
      }
    });
  }

  return (
    <div className="panel w-full rounded-2xl p-6">
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-display text-[11px] font-semibold tracking-[0.25em] text-glow-dim">
          THE NIGHT BROADCAST
        </span>
        <span
          className="font-display text-xs font-semibold tracking-[0.15em]"
          style={{ color: tuned || pct >= 100 ? "#a8e6c9" : "#d3b06a" }}
        >
          {tuned ? `TUNED IN — ${broadcast.frequency}kc` : `SIGNAL ${pct}%`}
        </span>
      </div>

      {/* Dial */}
      <div className="mt-4 rounded-lg border border-[#3a2f16] bg-[#140f0a] px-4 py-3.5">
        <div className="relative h-11 overflow-hidden rounded border border-stone-edge bg-[#0b0d0a]">
          <div className="absolute inset-0 flex justify-between px-2.5 py-1 font-serif text-[10px] text-[#4a6b5c]">
            <span>550</span>
            <span>700</span>
            <span>850</span>
            <span>1000</span>
            <span>1150</span>
            <span>1300</span>
            <span>1450</span>
            <span>1600</span>
          </div>
          <div
            className="absolute bottom-1.5 left-0 right-0 h-2.5"
            style={{
              background: "repeating-linear-gradient(90deg,#24443a 0 1px,transparent 1px 12px)",
            }}
          />
          <div
            className="absolute bottom-0 top-0 w-[3px] bg-gold transition-opacity duration-700"
            style={{ left: `${stationLeft}%`, opacity: 0.12 + 0.7 * signal }}
          />
          <div
            className="absolute bottom-0 top-0 w-[2px] bg-glow transition-all duration-700"
            style={{ left: `${needleLeft}%`, boxShadow: "0 0 6px rgba(168,230,201,0.5)" }}
          />
        </div>
        <StaticView signal={signal} />
      </div>

      {/* Fragments coming through */}
      <div className="mt-5 flex flex-col gap-2.5 text-[15px] leading-relaxed">
        {FRAGMENT_THRESHOLDS.map((threshold, i) =>
          signal >= threshold ? (
            <p key={i} className="italic text-[#9dbcaa]">
              {broadcast.fragments[i]}
            </p>
          ) : (
            <p key={i} className="text-[#2e4a3e]">
              {GARBLE[i]}
            </p>
          )
        )}
      </div>

      {/* Lock-in / transmission */}
      <div className="mt-6">
        {transmission ? (
          <div
            className="rounded-lg px-6 py-5"
            style={{
              background: "linear-gradient(160deg, rgba(29,68,54,0.35), rgba(7,17,15,0.6))",
              border: "1px solid rgba(168,230,201,0.3)",
            }}
          >
            <p className="font-display text-[10px] font-semibold tracking-[0.3em] text-glow-dim">
              TRANSMISSION — {broadcast.frequency}kc
            </p>
            <p className="mt-2 font-serif italic leading-relaxed text-foreground">
              {transmission}
            </p>
          </div>
        ) : signal >= 1 ? (
          <button
            onClick={handleTuneIn}
            disabled={isPending}
            className="btn-gold w-full rounded-full px-8 py-3 font-display text-sm font-semibold tracking-[0.2em] disabled:opacity-60"
          >
            {isPending ? "LOCKING IN..." : `TUNE IN — RECEIVE +${LOCK_IN_REWARD} ✦`}
          </button>
        ) : (
          <p className="text-center text-sm italic text-glow-dim">
            {`${completedThisWeek} of ${QUESTS_TO_TUNE} quests answered this week.`}
          </p>
        )}
        {error && <p className="mt-2 text-center text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}
