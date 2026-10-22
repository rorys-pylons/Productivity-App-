import Link from "next/link";
import {
  FarScenery,
  Hills,
  LEFT_PULSES,
  MAIN_PULSES,
  PowerLines,
  RIGHT_PULSES,
  Sky,
} from "@/components/valley-scenery";
import { Quarry } from "@/components/quarry";

type MapLocation = {
  name: string;
  blurb: string;
  href: string | null;
  // Leaves this site for a separate app on its own subdomain
  external?: boolean;
  left: string;
  top: string;
};

const LIBRARY_URL = "https://library.powerlinevalley.com";
const STUDY_URL = "https://study.powerlinevalley.com";
// Flip to true once study.powerlinevalley.com is live; until then the quarry shows as "opening soon"
const STUDY_LIVE = false;

// The map is drawn in a 1200 x 720 space; node positions below are percentages of it.
const LOCATIONS: MapLocation[] = [
  {
    name: "The Switchboard",
    blurb: "Post and claim quests.",
    href: "/quests",
    left: "16%",
    top: "56%",
  },
  {
    name: "The Library",
    blurb: "Your reading list.",
    href: LIBRARY_URL,
    external: true,
    left: "33%",
    top: "61.3%",
  },
  {
    name: "Circuit Breaker",
    blurb: "Spin the wheels.",
    href: "/wheel",
    left: "58%",
    top: "58.7%",
  },
  {
    name: "Ohmstead",
    blurb: "The weekly broadcast.",
    href: "/broadcast",
    left: "87%",
    top: "53.3%",
  },
  {
    // Sits on the lamp post at the quarry's left lip (736, 496 in map space)
    name: "The Quarry",
    blurb: STUDY_LIVE ? "Dive in. Study." : "Opening soon.",
    href: STUDY_LIVE ? STUDY_URL : null,
    external: STUDY_LIVE,
    left: "61.3%",
    top: "68.9%",
  },
];

// Fade the scene out at the top and bottom only, so it runs edge to edge sideways.
const FADE =
  "linear-gradient(to bottom, transparent 0%, black 9%, black 88%, transparent 100%)";
const fadeStyle = { maskImage: FADE, WebkitMaskImage: FADE };

export function WorldMap() {
  return (
    <div className="relative mx-auto w-full max-w-7xl" style={{ aspectRatio: "1200 / 720" }}>
      {/* Heat lightning, far off — paints behind the SVG hills */}
      <div
        aria-hidden
        className="heat-flash-a pointer-events-none absolute"
        style={{
          left: "6%",
          bottom: "26.7%",
          width: "40%",
          height: "37.3%",
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(196,224,210,0.55), rgba(168,230,201,0.1) 55%, transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="heat-flash-b pointer-events-none absolute"
        style={{
          right: "8%",
          bottom: "28.4%",
          width: "34%",
          height: "33.8%",
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(211,176,106,0.4), rgba(211,176,106,0.08) 55%, transparent 75%)",
        }}
      />
      {/* Wings: the same ground and powerlines carried out past each side of the map,
          at the same scale, so the scene fills the whole screen width. */}
      <svg
        className="pointer-events-none absolute top-0 h-full w-full"
        style={{ right: "100%", ...fadeStyle }}
        viewBox="-1200 0 1200 720"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <Sky />
        <FarScenery side="left" />
        <Hills />
        <PowerLines idp="l" pulses={LEFT_PULSES} />
      </svg>
      <svg
        className="pointer-events-none absolute top-0 h-full w-full"
        style={{ left: "100%", ...fadeStyle }}
        viewBox="1200 0 1200 720"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <Sky />
        <FarScenery side="right" />
        <Hills />
        <PowerLines idp="r" pulses={RIGHT_PULSES} />
      </svg>

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 720"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
        style={fadeStyle}
      >
        {/* Dusk band on the horizon */}
        <defs>
          <linearGradient id="duskband" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="70%" stopColor="rgba(211,176,106,0.07)" />
            <stop offset="100%" stopColor="rgba(211,176,106,0.14)" />
          </linearGradient>
          <radialGradient id="nodeglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(168,230,201,0.5)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <Sky />

        {/* Low moon with drifting clouds */}
        <g>
          <circle cx="1020" cy="96" r="54" fill="rgba(207,226,211,0.06)" />
          <circle cx="1020" cy="96" r="38" fill="rgba(207,226,211,0.08)" />
          <circle cx="1020" cy="96" r="24" fill="#cfe2d3" opacity="0.8" />
          <rect
            className="map-cloud"
            x="880"
            y="82"
            width="130"
            height="11"
            rx="6"
            fill="#0d2019"
            opacity="0.85"
            style={{ animationDuration: "44s" }}
          />
          <rect
            className="map-cloud"
            x="920"
            y="102"
            width="90"
            height="8"
            rx="5"
            fill="#0d2019"
            opacity="0.65"
            style={{ animationDuration: "64s", animationDelay: "-30s" }}
          />
        </g>

        {/* Cooling towers on the far horizon, steam still rising */}
        <g>
          <path
            d="M430,448 C443,410 445,382 446,352 L492,352 C493,382 495,410 508,448 Z"
            fill="#0b1e19"
          />
          <path
            d="M524,448 C533,420 534,400 535,378 L567,378 C568,400 569,420 578,448 Z"
            fill="#0a1b16"
          />
          <ellipse className="steam" cx="469" cy="340" rx="26" ry="9" fill="#16302a" opacity="0.16" style={{ filter: "blur(6px)" }} />
          <ellipse
            className="steam"
            cx="549"
            cy="368"
            rx="18"
            ry="7"
            fill="#16302a"
            opacity="0.14"
            style={{ filter: "blur(5px)", animationDelay: "-9s", animationDuration: "22s" }}
          />
          {/* aircraft-warning beacon */}
          <circle className="beacon" cx="469" cy="349" r="2" fill="#b3402e" />
        </g>

        {/* Far hills and near ground — shared with the side wings */}
        <Hills />

        {/* The flooded quarry, cut into the foreground */}
        <Quarry />

        {/* Water tower, background left */}
        <g fill="#0c211b" opacity="0.9">
          <path d="M45,300 L115,300 L108,352 L52,352 Z" />
          <rect x="50" y="286" width="60" height="16" rx="4" />
          <path d="M56,352 L48,455 L56,455 L62,362 Z" />
          <path d="M104,352 L112,455 L104,455 L98,362 Z" />
          <path d="M60,395 L100,412 M100,395 L60,412" stroke="#0c211b" strokeWidth="4" />
          <path d="M80,352 L80,455" stroke="#0c211b" strokeWidth="5" />
        </g>
        <circle cx="80" cy="294" r="2" fill="#d3b06a" opacity="0.7" />

        {/* Pylons, wires and light pulses — shared with the side wings */}
        <PowerLines idp="m" pulses={MAIN_PULSES} />

        {/* Little birds on the wire */}
        <g fill="#0e241d">
          <ellipse cx="330" cy="291" rx="5" ry="4" />
          <path d="M330,288 L333,283 L331,288 Z" />
          <ellipse cx="352" cy="296" rx="4" ry="3.5" />
          <ellipse cx="700" cy="286" rx="5" ry="4" />
        </g>

        {/* ---- Switchboard silhouette: jack field and hanging patch cords ---- */}
        <g transform="translate(150, 372)">
          <g fill="#0c211b">
            <rect x="6" y="20" width="8" height="70" rx="2" />
            <rect x="76" y="20" width="8" height="70" rx="2" />
            <rect x="0" y="0" width="90" height="52" rx="6" />
          </g>
          <rect x="8" y="8" width="74" height="36" rx="3" fill="#12302a" />
          {/* jack field */}
          {[16, 30, 44, 58, 72].map((x) => (
            <g key={x}>
              <circle cx={x} cy={15} r="2" fill="#071310" />
              <circle cx={x} cy={26} r="2" fill="#071310" />
            </g>
          ))}
          {/* lit jacks — calls waiting */}
          <circle cx="30" cy="15" r="1.4" fill="#d3b06a" />
          <circle cx="58" cy="26" r="1.4" fill="#a8e6c9" />
          {/* patch cords sagging between jacks */}
          <g stroke="#071310" strokeWidth="1.6" fill="none">
            <path d="M16,15 Q23,34 30,15" />
            <path d="M44,26 Q51,40 58,26" />
            <path d="M72,15 Q78,38 72,26" />
          </g>
        </g>

        {/* ---- Ferris wheel silhouette (Circuit Breaker) ---- */}
        <g transform="translate(700, 355)">
          {/* legs stay planted while the wheel turns */}
          <path d="M-38,148 L0,4 L38,148" stroke="#0c211b" strokeWidth="6" fill="none" />
          <g className="fw-spin">
            <g stroke="#0c211b" strokeWidth="5" fill="none">
              <circle cx="0" cy="0" r="62" />
              <circle cx="0" cy="0" r="62" strokeWidth="2" strokeDasharray="4 10" opacity="0.7" />
              {[0, 45, 90, 135].map((a) => (
                <path
                  key={a}
                  d={`M${-62 * Math.cos((a * Math.PI) / 180)},${-62 * Math.sin((a * Math.PI) / 180)} L${62 * Math.cos((a * Math.PI) / 180)},${62 * Math.sin((a * Math.PI) / 180)}`}
                  strokeWidth="3"
                />
              ))}
            </g>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <circle
                key={a}
                cx={62 * Math.cos((a * Math.PI) / 180)}
                cy={62 * Math.sin((a * Math.PI) / 180)}
                r="5"
                fill="#0e241d"
              />
            ))}
            <circle cx={62} cy={0} r="2" fill="#d3b06a" opacity="0.85" />
            <circle cx={-43.8} cy={43.8} r="2" fill="#a8e6c9" opacity="0.7" />
            <circle cx={0} cy={-62} r="2" fill="#d3b06a" opacity="0.7" />
          </g>
          <circle cx="0" cy="0" r="6" fill="#122a22" />
        </g>

        {/* ---- Ohmstead silhouette — the radio's on, one window lit ---- */}
        <g transform="translate(1000, 400)">
          <g fill="#0c211b">
            <rect x="0" y="34" width="96" height="66" />
            <path d="M-8,36 L48,0 L104,36 Z" />
          </g>
          <rect x="40" y="66" width="18" height="34" fill="#071310" />
          {/* the kitchen window, warm with radio light */}
          <rect x="12" y="48" width="14" height="14" fill="#d3b06a" opacity="0.55" />
          <rect x="12" y="48" width="14" height="14" fill="none" stroke="#071310" strokeWidth="1" />
          <path d="M19,48 L19,62 M12,55 L26,55" stroke="#071310" strokeWidth="1" />
          <rect x="70" y="48" width="14" height="14" fill="#1a3a2e" />
          {/* porch light */}
          <circle cx="49" cy="58" r="2.5" fill="#d3b06a" opacity="0.9" />
          {/* window glow spilling into the yard */}
          <ellipse cx="19" cy="72" rx="16" ry="6" fill="#d3b06a" opacity="0.08" />
          {/* aerial wire from the roof up to the powerline */}
          <path d="M48,0 Q30,-60 -95,-172" stroke="rgba(168,230,201,0.18)" strokeWidth="1" fill="none" />
        </g>

        {/* ---- The Library — columns, a lit reading-room window, a lamp by the steps ---- */}
        <g transform="translate(335, 398)">
          <g fill="#0c211b">
            <rect x="8" y="84" width="80" height="6" />
            <rect x="14" y="78" width="68" height="6" />
            <rect x="14" y="36" width="68" height="42" />
            <path d="M6,38 L48,12 L90,38 Z" />
          </g>
          {/* columns */}
          <g fill="#071310">
            {[22, 38, 54, 70].map((x) => (
              <rect key={x} x={x} y="40" width="6" height="38" />
            ))}
          </g>
          {/* lit windows between the columns, and the round window in the pediment */}
          <rect x="31" y="48" width="6" height="12" fill="#d3b06a" opacity="0.5" />
          <rect x="59" y="48" width="6" height="12" fill="#d3b06a" opacity="0.35" />
          <circle cx="48" cy="28" r="4" fill="#d3b06a" opacity="0.65" />
          <rect x="44" y="58" width="8" height="20" fill="#071310" />
          {/* reading lamp at the foot of the steps */}
          <path d="M1,90 L1,60" stroke="#0c211b" strokeWidth="2" />
          <circle cx="1" cy="58" r="2.5" fill="#d3b06a" opacity="0.85" />
          <ellipse cx="30" cy="72" rx="24" ry="6" fill="#d3b06a" opacity="0.06" />
        </g>

        {/* Glow pools under the location nodes */}
        <ellipse cx="195" cy="470" rx="70" ry="14" fill="url(#nodeglow)" opacity="0.35" />
        <ellipse cx="383" cy="492" rx="60" ry="12" fill="url(#nodeglow)" opacity="0.3" />
        <ellipse cx="700" cy="512" rx="90" ry="16" fill="url(#nodeglow)" opacity="0.35" />
        <ellipse cx="1048" cy="505" rx="70" ry="14" fill="url(#nodeglow)" opacity="0.2" />
      </svg>

      {/* Clickable location nodes */}
      {LOCATIONS.map((loc) => {
        const body = (
          <>
            <span className="map-node-dot" />
            <span className="mt-2 block whitespace-nowrap text-center">
              <span className="block font-display text-xs font-bold tracking-[0.2em] text-glow">
                {loc.name.toUpperCase()}
                {loc.external && <span aria-hidden> ↗</span>}
              </span>
              <span className="mt-0.5 block text-sm italic text-glow-dim opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {loc.blurb}
              </span>
            </span>
          </>
        );
        const nodeClass = "map-node group absolute -translate-x-1/2 -translate-y-1/2";
        const nodeStyle = { left: loc.left, top: loc.top };

        if (loc.href && loc.external) {
          return (
            <a key={loc.name} href={loc.href} className={nodeClass} style={nodeStyle}>
              {body}
            </a>
          );
        }
        return loc.href ? (
          <Link key={loc.name} href={loc.href} className={nodeClass} style={nodeStyle}>
            {body}
          </Link>
        ) : (
          <div
            key={loc.name}
            className="map-node absolute -translate-x-1/2 -translate-y-1/2 cursor-default opacity-50"
            style={{ left: loc.left, top: loc.top }}
          >
            <span className="map-node-dot map-node-dot-locked" />
            <span className="mt-2 block whitespace-nowrap text-center">
              <span className="block font-display text-xs font-bold tracking-[0.2em] text-glow-dim">
                {loc.name.toUpperCase()}
              </span>
              <span className="mt-0.5 block text-xs italic text-glow-dim">{loc.blurb}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
