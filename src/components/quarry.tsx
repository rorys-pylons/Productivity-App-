// The Quarry: a flooded gravel pit seen side-on, cut into the foreground. Irregular rock
// benches, a dock and ladder, banded water with a faint thermocline, and something pale
// drifting below. Map coordinates (viewBox 1200 x 720); the pit opens at the ground line, y = 512.
// The map node sits on the lamp post at the left lip, at (736, 496).

// Each wall is a run of small steps, uneven like quarried rock.
const LEFT: [number, number][] = [
  [744, 512], [744, 526], [754, 526], [754, 540], [762, 540], [762, 556], [772, 556], [772, 570],
  [786, 570], [786, 590], [796, 590], [796, 606], [810, 606], [810, 626], [824, 626], [824, 650],
];
const RIGHT: [number, number][] = [
  [1056, 512], [1056, 528], [1046, 528], [1046, 544], [1036, 544], [1036, 562], [1024, 562],
  [1024, 580], [1010, 580], [1010, 598], [998, 598], [998, 618], [982, 618], [982, 650],
];
const pts = (a: [number, number][]) => a.map(([x, y]) => `${x},${y}`).join(" L");
const PIT = `M${pts(LEFT)} L${pts([...RIGHT].reverse())} Z`;
const LEFT_WALL = `M${pts(LEFT)}`;
const RIGHT_WALL = `M${pts(RIGHT)}`;

function Jelly({ x, y, scale, delay, opacity }: { x: number; y: number; scale: number; delay: number; opacity: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <g className="q-jelly" style={{ animationDelay: `${delay}s` }}>
        <circle cx="0" cy="-4" r="22" fill="url(#q-jellyglow)" />
        <path
          className="q-bell"
          d="M-13,0 C-13,-17 13,-17 13,0 Q9,3 6,0 Q3,3 0,0 Q-3,3 -6,0 Q-9,3 -13,0 Z"
          fill="rgba(168,230,201,0.24)"
          stroke="rgba(168,230,201,0.55)"
          strokeWidth="1"
          style={{ animationDelay: `${delay}s` }}
        />
        <g stroke="rgba(168,230,201,0.38)" strokeWidth="1" fill="none" strokeLinecap="round">
          {[-8, -3, 2, 7].map((dx, i) => (
            <path
              key={dx}
              className="q-tent"
              d={`M${dx},2 q${i % 2 ? 3 : -3},8 0,15 q${i % 2 ? -3 : 3},7 0,13`}
              style={{ animationDelay: `${delay + i * 0.7}s` }}
            />
          ))}
        </g>
      </g>
    </g>
  );
}

export function Quarry() {
  return (
    <g>
      <defs>
        <clipPath id="q-pit">
          <path d={PIT} />
        </clipPath>
        {/* air in the pit starts as ground-colour at the lip so it blends in, darker toward the water */}
        <linearGradient id="q-air" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#071310" />
          <stop offset="100%" stopColor="#030b0a" />
        </linearGradient>
        <linearGradient id="q-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#14423c" stopOpacity="0.92" />
          <stop offset="30%" stopColor="#0d343a" />
          <stop offset="68%" stopColor="#07212c" />
          <stop offset="100%" stopColor="#020b12" />
        </linearGradient>
        <linearGradient id="q-band" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(168,230,201,0)" />
          <stop offset="50%" stopColor="rgba(168,230,201,0.13)" />
          <stop offset="100%" stopColor="rgba(168,230,201,0)" />
        </linearGradient>
        <radialGradient id="q-jellyglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(168,230,201,0.4)" />
          <stop offset="100%" stopColor="rgba(168,230,201,0)" />
        </radialGradient>
      </defs>

      {/* the hole: air down to the waterline, then layered water */}
      <path d={PIT} fill="url(#q-air)" />
      <g clipPath="url(#q-pit)">
        <rect x="700" y="548" width="400" height="120" fill="url(#q-water)" />
        {/* the thermocline: a thin, brighter layer where warm water meets cold */}
        <rect x="700" y="586" width="400" height="18" fill="url(#q-band)" />
        <path className="q-shimmer" d="M700,595 L1100,595" stroke="#a8e6c9" strokeWidth="1" opacity="0.26" />
        <rect x="700" y="624" width="400" height="10" fill="url(#q-band)" opacity="0.5" />
      </g>

      {/* waterline sheen */}
      <path d="M762,548 L1036,548" stroke="#a8e6c9" strokeWidth="1" opacity="0.28" />
      <g fill="#a8e6c9">
        <ellipse className="q-shimmer" cx="880" cy="549.5" rx="34" ry="1.1" opacity="0.24" />
        <ellipse className="q-shimmer" cx="975" cy="550" rx="22" ry="1" opacity="0.2" style={{ animationDelay: "-3s" }} />
      </g>

      {/* rock walls, rim-lit, with strata running back into the ground */}
      <g stroke="#17382f" strokeWidth="1.5" fill="none" strokeLinejoin="round">
        <path d={LEFT_WALL} />
        <path d={RIGHT_WALL} />
      </g>
      <g stroke="#0e2a23" strokeWidth="1" opacity="0.5">
        <path d="M690,534 L744,534 M700,562 L762,562 M712,598 L796,598 M726,632 L810,632" />
        <path d="M1056,538 L1110,538 M1046,568 L1100,568 M1024,600 L1086,600 M998,630 L1070,630" />
      </g>
      {/* rubble along the lip */}
      <g fill="#0c211b">
        <ellipse cx="730" cy="511.5" rx="9" ry="3.5" />
        <ellipse cx="714" cy="513" rx="6" ry="2.8" />
        <ellipse cx="1063" cy="511.5" rx="8" ry="3.5" />
        <ellipse cx="1080" cy="513" rx="6" ry="2.8" />
      </g>

      {/* the lamp post on the left lip — the map node sits on its lantern */}
      <path d="M736,512 L736,499" stroke="#1b3128" strokeWidth="2" />
      <ellipse cx="736" cy="510" rx="34" ry="5" fill="#d3b06a" opacity="0.06" />

      {/* dock, a small lantern, and a ladder down into the water */}
      <g>
        <rect x="762" y="541" width="94" height="4" fill="#1b3128" />
        <rect x="762" y="541" width="94" height="1" fill="rgba(168,230,201,0.14)" />
        <rect x="771" y="545" width="3" height="21" fill="#14261f" />
        <rect x="846" y="545" width="3" height="21" fill="#14261f" />
        <path d="M772.5,541 L772.5,531" stroke="#1b3128" strokeWidth="2" />
        <circle cx="772.5" cy="529.5" r="2" fill="#d3b06a" opacity="0.75" />
        <ellipse cx="778" cy="543" rx="30" ry="6" fill="#d3b06a" opacity="0.07" />
        <g stroke="#1b3128" strokeWidth="1.6">
          <path d="M836,545 L836,590 M844,545 L844,590" />
          <path d="M836,552 L844,552 M836,560 L844,560 M836,568 L844,568 M836,576 L844,576 M836,584 L844,584" strokeWidth="1.2" />
        </g>
        <g fill="#d3b06a">
          <ellipse className="q-shimmer" cx="773" cy="556" rx="4.5" ry="1.2" opacity="0.3" />
          <ellipse className="q-shimmer" cx="773.5" cy="562" rx="3" ry="1" opacity="0.2" style={{ animationDelay: "-2s" }} />
        </g>
      </g>

      {/* a post lamp on the far lip */}
      <path d="M1048,512 L1048,490" stroke="#122a22" strokeWidth="2" />
      <circle cx="1048" cy="488" r="2.2" fill="#d3b06a" opacity="0.55" />
      <ellipse cx="1048" cy="508" rx="22" ry="4" fill="#d3b06a" opacity="0.05" />

      {/* what lives below */}
      <Jelly x={905} y={611} scale={1} delay={0} opacity={0.95} />
      <Jelly x={958} y={634} scale={0.6} delay={-3} opacity={0.5} />
      <g fill="none" stroke="#a8e6c9">
        <circle className="q-bubble" cx="841" cy="588" r="1.6" strokeWidth="0.8" />
        <circle className="q-bubble" cx="845" cy="590" r="1.1" strokeWidth="0.8" style={{ animationDelay: "-2.4s" }} />
        <circle className="q-bubble" cx="839" cy="589" r="1.3" strokeWidth="0.8" style={{ animationDelay: "-4.8s" }} />
      </g>
    </g>
  );
}
