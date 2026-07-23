// Two sagging strings of bulbs over the Circuit Breaker — half of them
// still trying. Dead sockets stay dark; one sputters.
const BULBS: {
  x: number;
  y: number;
  color: string;
  delay: number;
  state?: "dead" | "dying";
}[] = [
  { x: 55, y: 25, color: "#d3b06a", delay: 0 },
  { x: 101, y: 33, color: "#2e3a34", delay: 0, state: "dead" },
  { x: 163, y: 38, color: "#d3b06a", delay: 1.9 },
  { x: 225, y: 35, color: "#a8e6c9", delay: 3.1 },
  { x: 272, y: 30, color: "#2e3a34", delay: 0, state: "dead" },
  { x: 365, y: 25, color: "#a8e6c9", delay: 0.8 },
  { x: 411, y: 33, color: "#d3b06a", delay: 0, state: "dying" },
  { x: 473, y: 38, color: "#a8e6c9", delay: 2.4 },
  { x: 535, y: 35, color: "#2e3a34", delay: 0, state: "dead" },
  { x: 582, y: 30, color: "#d3b06a", delay: 4.2 },
];

export function CarnivalLights() {
  return (
    <svg
      className="w-full max-w-xl"
      viewBox="0 0 640 60"
      aria-hidden
      style={{ overflow: "visible" }}
    >
      <path
        d="M10,14 Q160,58 320,20 Q480,58 630,16"
        stroke="rgba(36,68,58,0.9)"
        strokeWidth="2"
        fill="none"
      />
      {BULBS.map((b) => (
        <g key={b.x}>
          <line x1={b.x} y1={b.y} x2={b.x} y2={b.y + 7} stroke="rgba(36,68,58,0.9)" strokeWidth="1.5" />
          <circle
            className={
              b.state === "dead" ? undefined : b.state === "dying" ? "bulb-dying" : "string-bulb"
            }
            cx={b.x}
            cy={b.y + 10}
            r="3.5"
            fill={b.color}
            opacity={b.state === "dead" ? 0.5 : undefined}
            style={b.state ? undefined : { animationDelay: `${b.delay}s` }}
          />
        </g>
      ))}
    </svg>
  );
}
