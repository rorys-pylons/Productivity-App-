"use client";

import { useState, useTransition } from "react";
import { claimTask } from "@/app/actions";
import { burstStars, flareCounter } from "@/lib/celebrate";

const MINT = "#a8e6c9";

type Point = [number, number];

// A jagged main bolt from A to B with small filament branches spindling off it.
function boltPaths(x1: number, y1: number, x2: number, y2: number) {
  const segments = 12;
  const dx = (x2 - x1) / segments;
  const dy = (y2 - y1) / segments;
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const px = -(y2 - y1) / len;
  const py = (x2 - x1) / len;

  const pts: Point[] = [[x1, y1]];
  for (let i = 1; i < segments; i++) {
    const wobble = (Math.random() - 0.5) * Math.min(52, len * 0.16);
    pts.push([x1 + dx * i + px * wobble, y1 + dy * i + py * wobble]);
  }
  pts.push([x2, y2]);

  let main = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    main += ` L${pts[i][0].toFixed(1)},${pts[i][1].toFixed(1)}`;
  }

  const branches: string[] = [];
  const heading = Math.atan2(dy, dx);
  for (let i = 2; i < segments - 1; i++) {
    if (Math.random() < 0.65) {
      let [bx, by] = pts[i];
      let d = `M${bx.toFixed(1)},${by.toFixed(1)}`;
      const dir = Math.random() > 0.5 ? 1 : -1;
      let angle = heading + dir * (0.5 + Math.random() * 1.1);
      const steps = 2 + Math.floor(Math.random() * 3);
      const branchLen = 12 + Math.random() * 34;
      for (let s = 0; s < steps; s++) {
        angle += (Math.random() - 0.5) * 0.9;
        bx += Math.cos(angle) * (branchLen / steps);
        by += Math.sin(angle) * (branchLen / steps);
        d += ` L${bx.toFixed(1)},${by.toFixed(1)}`;
        // occasionally a filament forks off the branch itself
        if (Math.random() < 0.3) {
          const fa = angle + (Math.random() > 0.5 ? 0.8 : -0.8);
          const fx = bx + Math.cos(fa) * (5 + Math.random() * 10);
          const fy = by + Math.sin(fa) * (5 + Math.random() * 10);
          branches.push(
            `M${bx.toFixed(1)},${by.toFixed(1)} L${fx.toFixed(1)},${fy.toFixed(1)}`
          );
        }
      }
      branches.push(d);
    }
  }

  return { main, branches };
}

function renderBolt(svg: SVGSVGElement, x1: number, y1: number, x2: number, y2: number) {
  const { main, branches } = boltPaths(x1, y1, x2, y2);
  const glowOpacity = (0.25 + Math.random() * 0.2).toFixed(2);
  svg.innerHTML = `
    <path d="${main}" stroke="${MINT}" stroke-opacity="${glowOpacity}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="${main}" stroke="#e9fff4" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    ${branches
      .map(
        (d) =>
          `<path d="${d}" stroke="${MINT}" stroke-opacity="${(0.5 + Math.random() * 0.4).toFixed(2)}" stroke-width="${(0.7 + Math.random() * 0.7).toFixed(1)}" fill="none" stroke-linecap="round"/>`
      )
      .join("")}
  `;
}

function playCrackle(fromEl: HTMLElement, points: number) {
  const counter = document.getElementById("star-counter");
  const from = fromEl.getBoundingClientRect();
  const x1 = from.left + from.width / 2;
  const y1 = from.top + from.height / 2;

  // Without a counter on screen, arc straight up and off the page
  const to = counter?.getBoundingClientRect();
  const x2 = to ? to.left + to.width / 2 : x1;
  const y2 = to ? to.bottom : -20;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute(
    "style",
    "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:60"
  );
  document.body.appendChild(svg);

  // Re-randomize the whole bolt every frame-ish so it crackles like the real thing
  let flickers = 0;
  const interval = window.setInterval(() => {
    renderBolt(svg, x1, y1, x2, y2);
    flickers++;
    if (flickers >= 9) {
      window.clearInterval(interval);
      svg.remove();
      flareCounter(document.getElementById("star-counter"));
      burstStars(x2, y2, Math.min(10, 5 + Math.floor(points / 30)));
    }
  }, 65);
}

export function ClaimButton({ taskId, points }: { taskId: string; points: number }) {
  const [claiming, setClaiming] = useState(false);
  const [, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (claiming) return;
    setClaiming(true);
    playCrackle(e.currentTarget, points);
    startTransition(async () => {
      await claimTask(taskId);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={claiming}
      className="btn-gold rounded-full px-5 py-2 font-display text-xs font-semibold tracking-[0.15em] disabled:opacity-60"
    >
      {claiming ? "ON THE LINE..." : "CLAIM"}
    </button>
  );
}
