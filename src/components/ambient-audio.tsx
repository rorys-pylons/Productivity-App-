"use client";

import { useRef, useState } from "react";
import { getAudioContext, registerHumDuck } from "@/lib/audio";

type DroneNodes = {
  master: GainNode;
};

// E1 fundamental — low enough to feel more than hear.
const ROOT = 41.2;

function buildDrone(ctx: AudioContext): DroneNodes {
  const master = ctx.createGain();
  master.gain.value = 0;
  // One-shot moments (the lock-in broadcast) pull this down to speak over the hum
  const duck = ctx.createGain();
  duck.gain.value = 1;
  registerHumDuck(duck);
  master.connect(duck);
  duck.connect(ctx.destination);

  // The drone bed lives under a heavy lowpass; the static rides above it.
  const bed = ctx.createBiquadFilter();
  bed.type = "lowpass";
  bed.frequency.value = 270;
  bed.connect(master);

  // Tidal swell — one slow breath, never a pulse
  const swell = ctx.createOscillator();
  swell.frequency.value = 0.007;
  const swellDepth = ctx.createGain();
  swellDepth.gain.value = 0.012;
  swell.connect(swellDepth);
  swellDepth.connect(master.gain);
  swell.start();

  function addVoice(
    type: OscillatorType,
    freq: number,
    level: number,
    driftRate: number,
    driftCents: number
  ) {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.value = level;
    osc.connect(gain);
    gain.connect(bed);
    if (driftRate > 0) {
      const lfo = ctx.createOscillator();
      lfo.frequency.value = driftRate;
      const depth = ctx.createGain();
      depth.gain.value = driftCents;
      lfo.connect(depth);
      depth.connect(osc.detune);
      lfo.start();
    }
    osc.start();
  }

  addVoice("sine", ROOT, 0.55, 0.03, 6);
  addVoice("sine", ROOT * 1.5, 0.11, 0.021, 8);
  addVoice("triangle", ROOT * 2, 0.045, 0.014, 5);
  // The powerline itself, singing its one note
  addVoice("sine", 60, 0.05, 0, 0);

  // Brown-noise wind through the wires
  const windSeconds = 4;
  const windBuffer = ctx.createBuffer(1, ctx.sampleRate * windSeconds, ctx.sampleRate);
  const windData = windBuffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < windData.length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    windData[i] = last * 3.5;
  }
  const wind = ctx.createBufferSource();
  wind.buffer = windBuffer;
  wind.loop = true;
  const windFilter = ctx.createBiquadFilter();
  windFilter.type = "lowpass";
  windFilter.frequency.value = 150;
  const windGain = ctx.createGain();
  windGain.gain.value = 0.06;
  const gust = ctx.createOscillator();
  gust.frequency.value = 0.013;
  const gustDepth = ctx.createGain();
  gustDepth.gain.value = 0.018;
  gust.connect(gustDepth);
  gustDepth.connect(windGain.gain);
  gust.start();
  wind.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(bed);
  wind.start();

  // Internal static — faint broadband hiss with sparse dust-pops,
  // routed around the lowpass so it sits on the skin of the drone.
  const staticSeconds = 6;
  const staticBuffer = ctx.createBuffer(1, ctx.sampleRate * staticSeconds, ctx.sampleRate);
  const staticData = staticBuffer.getChannelData(0);
  for (let i = 0; i < staticData.length; i++) {
    staticData[i] = (Math.random() * 2 - 1) * 0.05;
  }
  const popCount = staticSeconds * 3;
  for (let p = 0; p < popCount; p++) {
    const at = Math.floor(Math.random() * (staticData.length - 400));
    const sign = Math.random() > 0.5 ? 1 : -1;
    const strength = 0.4 + Math.random() * 0.5;
    for (let k = 0; k < 300; k++) {
      staticData[at + k] += sign * strength * Math.exp(-k / 50) * (Math.random() * 0.6 + 0.4);
    }
  }
  const staticSrc = ctx.createBufferSource();
  staticSrc.buffer = staticBuffer;
  staticSrc.loop = true;
  const staticFilter = ctx.createBiquadFilter();
  staticFilter.type = "bandpass";
  staticFilter.frequency.value = 2600;
  staticFilter.Q.value = 0.8;
  const staticGain = ctx.createGain();
  staticGain.gain.value = 0.014;
  const staticBreath = ctx.createOscillator();
  staticBreath.frequency.value = 0.01;
  const staticBreathDepth = ctx.createGain();
  staticBreathDepth.gain.value = 0.005;
  staticBreath.connect(staticBreathDepth);
  staticBreathDepth.connect(staticGain.gain);
  staticBreath.start();
  staticSrc.connect(staticFilter);
  staticFilter.connect(staticGain);
  staticGain.connect(master);
  staticSrc.start();

  return { master };
}

export function AmbientAudio() {
  const [on, setOn] = useState(false);
  const nodesRef = useRef<DroneNodes | null>(null);
  const suspendTimer = useRef<number | undefined>(undefined);

  function toggle() {
    const ctx = getAudioContext();

    if (!on) {
      window.clearTimeout(suspendTimer.current);
      void ctx.resume();
      if (!nodesRef.current) {
        nodesRef.current = buildDrone(ctx);
      }
      const gain = nodesRef.current.master.gain;
      gain.cancelScheduledValues(ctx.currentTime);
      gain.setValueAtTime(gain.value, ctx.currentTime);
      // Present within seconds, then a long organ-swell build to full
      gain.linearRampToValueAtTime(0.09, ctx.currentTime + 5);
      gain.linearRampToValueAtTime(0.19, ctx.currentTime + 60);
      setOn(true);
    } else {
      if (nodesRef.current) {
        const gain = nodesRef.current.master.gain;
        gain.cancelScheduledValues(ctx.currentTime);
        gain.setValueAtTime(gain.value, ctx.currentTime);
        // A few milliseconds, not zero — an instant value change can click/pop
        gain.linearRampToValueAtTime(0, ctx.currentTime + 0.03);
      }
      suspendTimer.current = window.setTimeout(() => void getAudioContext().suspend(), 100);
      setOn(false);
    }
  }

  return (
    <button
      onClick={toggle}
      className="btn-glow fixed bottom-[4.4rem] right-5 z-30 rounded-full px-5 py-2.5 font-display text-[11px] font-semibold tracking-[0.2em]"
      title={on ? "Quiet the wires" : "Let the wires hum"}
    >
      {on ? "HUM · ON" : "HUM · OFF"}
    </button>
  );
}
