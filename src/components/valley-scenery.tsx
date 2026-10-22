// Shared scenery for the valley map. The main map and its two side "wings" all draw
// the same pylons, wires and ground in the same coordinate space, so they join without a seam.

// Pylons march along the line every 360 units. x = 200, 560, 920 are the originals;
// the rest carry the wires off to both sides of the screen.
const PYLONS = [
  { x: -1240, top: 200, legY: 514 },
  { x: -880, top: 215, legY: 512 },
  { x: -520, top: 195, legY: 518 },
  { x: -160, top: 212, legY: 514 },
  { x: 200, top: 220, legY: 520 },
  { x: 560, top: 200, legY: 514 },
  { x: 920, top: 185, legY: 508 },
  { x: 1280, top: 205, legY: 516 },
  { x: 1640, top: 190, legY: 511 },
  { x: 2000, top: 210, legY: 518 },
  { x: 2360, top: 198, legY: 513 },
  { x: 2720, top: 208, legY: 515 },
];

export type Pulse = { wire: number; dur: number; begin: number; r: number; color: string; opacity: number };

// Wire i runs between pylon i and pylon i+1.
const MAIN_PULSES: Pulse[] = [
  { wire: 4, dur: 7, begin: 0, r: 3, color: "#a8e6c9", opacity: 0.9 },
  { wire: 5, dur: 8, begin: 3.5, r: 2.5, color: "#a8e6c9", opacity: 0.7 },
  { wire: 6, dur: 10, begin: 1.5, r: 2, color: "#d3b06a", opacity: 0.7 },
];
export const LEFT_PULSES: Pulse[] = [
  { wire: 1, dur: 9, begin: 2, r: 2.5, color: "#a8e6c9", opacity: 0.75 },
  { wire: 2, dur: 11, begin: 6, r: 2, color: "#d3b06a", opacity: 0.65 },
];
export const RIGHT_PULSES: Pulse[] = [
  { wire: 7, dur: 9, begin: 1, r: 2.5, color: "#a8e6c9", opacity: 0.75 },
  { wire: 8, dur: 12, begin: 5, r: 2, color: "#d3b06a", opacity: 0.65 },
];
export { MAIN_PULSES };

// A span sags about 13% of its length, like a real catenary.
function wirePath(x0: number, y0: number, x1: number, y1: number) {
  const sag = Math.abs(x1 - x0) * 0.135;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2 + sag * 2;
  return `M${x0},${y0} Q${cx},${cy} ${x1},${y1}`;
}

export function PowerLines({ idp, pulses = [] }: { idp: string; pulses?: Pulse[] }) {
  const spans = PYLONS.slice(0, -1).map((p, i) => {
    const q = PYLONS[i + 1];
    return {
      i,
      main: wirePath(p.x - 46, p.top + 26, q.x - 46, q.top + 26),
      upper: wirePath(p.x - 30, p.top + 8, q.x - 30, q.top + 8),
    };
  });

  return (
    <>
      {PYLONS.map((p) => (
        <g key={p.x} stroke="#122a22" strokeWidth="7" strokeLinecap="round" fill="none">
          {/* legs */}
          <path d={`M${p.x - 34},${p.legY} L${p.x - 8},${p.top + 26}`} />
          <path d={`M${p.x + 34},${p.legY} L${p.x + 8},${p.top + 26}`} />
          {/* mast */}
          <path d={`M${p.x},${p.top} L${p.x},${p.top + 40}`} />
          {/* crossarms */}
          <path d={`M${p.x - 46},${p.top + 26} L${p.x + 46},${p.top + 26}`} />
          <path d={`M${p.x - 30},${p.top + 8} L${p.x + 30},${p.top + 8}`} />
          {/* lattice */}
          <path
            d={`M${p.x - 26},${p.top + 60} L${p.x + 22},${p.top + 110} M${p.x + 26},${p.top + 60} L${p.x - 22},${p.top + 110} M${p.x - 30},${p.top + 130} L${p.x + 26},${p.top + 190} M${p.x + 30},${p.top + 130} L${p.x - 26},${p.top + 190}`}
            strokeWidth="4"
          />
        </g>
      ))}

      <g stroke="rgba(168,230,201,0.32)" strokeWidth="1.5" fill="none">
        {spans.map((s) => (
          <path key={s.i} id={`${idp}-w${s.i}`} d={s.main} />
        ))}
        {/* second, fainter wire on the upper arm */}
        <g opacity="0.5">
          {spans.map((s) => (
            <path key={s.i} d={s.upper} />
          ))}
        </g>
      </g>

      {/* Pulses of light traveling the line */}
      {pulses.map((p) => (
        <circle key={`${p.wire}-${p.begin}`} r={p.r} fill={p.color} opacity={p.opacity}>
          <animateMotion dur={`${p.dur}s`} repeatCount="indefinite" begin={`${p.begin}s`}>
            <mpath href={`#${idp}-w${p.wire}`} />
          </animateMotion>
        </circle>
      ))}
    </>
  );
}

export function Sky() {
  return <rect x="-1300" y="280" width="3820" height="200" fill="url(#duskband)" />;
}

// Far hills, then the near ground. Both run well past the visible area on either side.
export function Hills() {
  return (
    <>
      <path
        d="M-1300,455 C-1180,435 -1040,465 -900,448 C-760,431 -640,458 -500,442 C-360,426 -240,455 -120,452 C-60,450 -30,468 0,470 C150,430 280,450 420,435 C560,420 700,445 840,430 C980,415 1100,440 1200,425 C1320,408 1440,440 1580,432 C1720,424 1840,452 1980,436 C2120,420 2240,448 2380,440 C2440,436 2480,444 2520,440 L2520,720 L-1300,720 Z"
        fill="#0a1c17"
      />
      <path
        d="M-1300,512 C-1150,500 -1000,520 -850,508 C-700,496 -560,518 -400,508 C-250,498 -130,516 0,520 C180,495 340,515 520,505 C700,495 880,515 1050,505 C1120,501 1170,508 1200,505 C1260,502 1400,520 1560,508 C1720,496 1860,518 2020,507 C2180,496 2330,516 2520,508 L2520,720 L-1300,720 Z"
        fill="#071310"
      />
    </>
  );
}

// Small far-off silhouettes so the wings aren't just empty hills. Drawn before the hills,
// which then cover their bases.
export function FarScenery({ side }: { side: "left" | "right" }) {
  if (side === "right") {
    return (
      <g fill="#0b1e19">
        {/* a barn with one window still lit, and its silo */}
        <rect x="1520" y="404" width="76" height="46" />
        <path d="M1512,406 L1558,378 L1604,406 Z" />
        <rect x="1610" y="394" width="16" height="56" />
        <path d="M1610,394 Q1618,382 1626,394 Z" />
        <circle cx="1558" cy="396" r="2.5" fill="#d3b06a" opacity="0.6" />
        {/* a lone shack further out */}
        <rect x="2150" y="418" width="34" height="30" />
        <path d="M2144,420 L2167,402 L2190,420 Z" />
        <rect x="2160" y="428" width="6" height="7" fill="#d3b06a" opacity="0.45" />
      </g>
    );
  }
  return (
    <g fill="#0b1e19">
      {/* a grain silo */}
      <rect x="-440" y="390" width="26" height="62" />
      <path d="M-440,390 Q-427,372 -414,390 Z" />
      <rect x="-452" y="436" width="50" height="16" />
      {/* a dead tree */}
      <g stroke="#0b1e19" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M-720,452 L-722,408 M-722,420 L-742,396 M-722,412 L-704,392 M-724,432 L-738,424" />
      </g>
      {/* a lit window out on the flats */}
      <rect x="-1010" y="424" width="30" height="28" />
      <path d="M-1016,426 L-995,408 L-974,426 Z" />
      <rect x="-1000" y="434" width="6" height="7" fill="#d3b06a" opacity="0.45" />
    </g>
  );
}
