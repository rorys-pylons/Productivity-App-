"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const STORAGE_KEY = "starline-storm";
const CHANGE_EVENT = "starline-storm-change";

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) === "on";
}

function getServerSnapshot() {
  return false;
}

export function Weather() {
  const storm = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!storm) return;
    let alive = true;
    let timer: number;

    function strike() {
      if (!alive) return;
      const el = flashRef.current;
      if (el) {
        // Random horizontal origin so strikes wander across the sky
        const x = 15 + Math.random() * 70;
        el.style.background = `radial-gradient(ellipse 60% 55% at ${x}% 0%, rgba(214,238,225,0.5), rgba(168,230,201,0.12) 50%, transparent 75%)`;
        el.animate(
          [
            { opacity: 0 },
            { opacity: 1, offset: 0.06 },
            { opacity: 0.15, offset: 0.18 },
            { opacity: 0.7, offset: 0.28 },
            { opacity: 0 },
          ],
          { duration: 800 + Math.random() * 500 }
        );
      }
      timer = window.setTimeout(strike, 4000 + Math.random() * 9000);
    }

    timer = window.setTimeout(strike, 1500);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [storm]);

  function toggle() {
    localStorage.setItem(STORAGE_KEY, storm ? "off" : "on");
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  return (
    <>
      {storm && (
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-[5]">
          <div className="absolute inset-0 bg-black/15" />
          <div ref={flashRef} className="absolute inset-0 opacity-0" />
        </div>
      )}

      <button
        onClick={toggle}
        className="btn-glow fixed bottom-5 right-5 z-30 rounded-full px-5 py-2.5 font-display text-[11px] font-semibold tracking-[0.2em]"
        title={storm ? "Let the sky clear" : "Call the storm in"}
      >
        {storm ? "STORM · ON" : "STORM · OFF"}
      </button>
    </>
  );
}
