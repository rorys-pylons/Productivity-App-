// Shared audio plumbing. The hum (ambient-audio.tsx) registers its duck node
// here so one-shot moments like the lock-in broadcast can dip under it.

let ctx: AudioContext | null = null;
let humDuck: GainNode | null = null;

export function getAudioContext(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export function registerHumDuck(node: GainNode) {
  humDuck = node;
}

function duckHum(seconds: number) {
  if (!humDuck || !ctx) return;
  const t = ctx.currentTime;
  const g = humDuck.gain;
  g.cancelScheduledValues(t);
  g.setValueAtTime(g.value, t);
  g.linearRampToValueAtTime(0.25, t + 0.6);
  g.setValueAtTime(0.25, t + seconds - 2.5);
  g.linearRampToValueAtTime(1, t + seconds);
}

// The lock-in moment: a breath of station-seeking static that resolves
// into a warm held chord, then lets the night back in. ~7 seconds.
export function playLockIn() {
  const audio = getAudioContext();
  void audio.resume();
  const t = audio.currentTime;
  duckHum(7);

  const out = audio.createGain();
  out.gain.value = 1;
  out.connect(audio.destination);

  // Seeking static — narrows and dies as the station is found
  const noiseBuffer = audio.createBuffer(1, audio.sampleRate * 3, audio.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) {
    noiseData[i] = Math.random() * 2 - 1;
  }
  const noise = audio.createBufferSource();
  noise.buffer = noiseBuffer;
  const noiseBand = audio.createBiquadFilter();
  noiseBand.type = "bandpass";
  noiseBand.frequency.setValueAtTime(2800, t);
  noiseBand.frequency.exponentialRampToValueAtTime(700, t + 2.4);
  noiseBand.Q.value = 1.1;
  const noiseGain = audio.createGain();
  noiseGain.gain.setValueAtTime(0.09, t);
  noiseGain.gain.linearRampToValueAtTime(0.04, t + 1.6);
  noiseGain.gain.linearRampToValueAtTime(0, t + 2.6);
  noise.connect(noiseBand);
  noiseBand.connect(noiseGain);
  noiseGain.connect(out);
  noise.start(t);
  noise.stop(t + 3);

  // A brief tuning whistle sliding home
  const whistle = audio.createOscillator();
  whistle.type = "sine";
  whistle.frequency.setValueAtTime(1300, t + 0.2);
  whistle.frequency.exponentialRampToValueAtTime(660, t + 1.1);
  const whistleGain = audio.createGain();
  whistleGain.gain.setValueAtTime(0, t);
  whistleGain.gain.linearRampToValueAtTime(0.025, t + 0.35);
  whistleGain.gain.linearRampToValueAtTime(0, t + 1.2);
  whistle.connect(whistleGain);
  whistleGain.connect(out);
  whistle.start(t);
  whistle.stop(t + 1.3);

  // The station itself: a warm low chord that blooms and recedes
  const chordFreqs = [110, 164.8, 220];
  const chordLevels = [0.075, 0.045, 0.028];
  const chordDetunes = [0, -4, 3];
  chordFreqs.forEach((freq, i) => {
    const osc = audio.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.detune.value = chordDetunes[i];
    const gain = audio.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.setValueAtTime(0, t + 1.2);
    gain.gain.linearRampToValueAtTime(chordLevels[i], t + 3);
    gain.gain.setValueAtTime(chordLevels[i], t + 4.6);
    gain.gain.linearRampToValueAtTime(0, t + 7);
    osc.connect(gain);
    gain.connect(out);
    osc.start(t);
    osc.stop(t + 7.2);
  });
}
