// Deterministic spore field — fixed values so server and client markup match.
const SPORES = [
  { left: "6%", bottom: "12%", size: 3, duration: 22, delay: 0, opacity: 0.5, sway: 30 },
  { left: "14%", bottom: "30%", size: 2, duration: 28, delay: 4, opacity: 0.4, sway: -22 },
  { left: "22%", bottom: "8%", size: 4, duration: 19, delay: 9, opacity: 0.65, sway: 18 },
  { left: "31%", bottom: "22%", size: 2, duration: 26, delay: 2, opacity: 0.35, sway: -30 },
  { left: "39%", bottom: "15%", size: 3, duration: 24, delay: 12, opacity: 0.55, sway: 26 },
  { left: "47%", bottom: "34%", size: 2, duration: 30, delay: 6, opacity: 0.4, sway: 14 },
  { left: "55%", bottom: "10%", size: 3, duration: 21, delay: 15, opacity: 0.6, sway: -18 },
  { left: "63%", bottom: "26%", size: 2, duration: 27, delay: 1, opacity: 0.35, sway: 34 },
  { left: "71%", bottom: "18%", size: 4, duration: 23, delay: 10, opacity: 0.7, sway: -26 },
  { left: "79%", bottom: "6%", size: 2, duration: 29, delay: 5, opacity: 0.45, sway: 20 },
  { left: "86%", bottom: "28%", size: 3, duration: 20, delay: 13, opacity: 0.55, sway: -14 },
  { left: "93%", bottom: "14%", size: 2, duration: 25, delay: 8, opacity: 0.4, sway: 24 },
  { left: "10%", bottom: "48%", size: 2, duration: 32, delay: 17, opacity: 0.3, sway: 16 },
  { left: "58%", bottom: "44%", size: 2, duration: 31, delay: 3, opacity: 0.3, sway: -20 },
  { left: "83%", bottom: "50%", size: 2, duration: 33, delay: 11, opacity: 0.28, sway: 12 },
];

export function Scene() {
  return (
    <div aria-hidden className="scene-sky pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Far hills */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-50"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ height: "38vh" }}
      >
        <path
          d="M0,220 C120,180 240,140 380,160 C520,180 600,120 740,110 C880,100 960,150 1100,140 C1240,130 1340,170 1440,150 L1440,320 L0,320 Z"
          fill="#0c1f1b"
        />
      </svg>

      {/* Mist band */}
      <div
        className="mist absolute bottom-[16vh] left-[-10%] h-[18vh] w-[120%] opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 30% 50%, rgba(168,230,201,0.10), transparent 70%), radial-gradient(ellipse 50% 90% at 75% 40%, rgba(168,230,201,0.07), transparent 70%)",
          filter: "blur(14px)",
        }}
      />

      {/* Near hills with treeline suggestion */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 280"
        preserveAspectRatio="none"
        style={{ height: "26vh" }}
      >
        <path
          d="M0,180 C90,150 170,120 260,135 C300,90 330,100 360,130 C450,110 540,140 640,125 C680,80 710,90 740,120 C850,100 950,135 1060,120 C1100,75 1130,85 1160,115 C1260,100 1360,140 1440,120 L1440,280 L0,280 Z"
          fill="#071411"
        />
      </svg>

      {/* Hanging vines, top corners */}
      <svg className="absolute left-0 top-0 w-[30vw] max-w-md opacity-60" viewBox="0 0 400 220">
        <g stroke="#16302a" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M10,0 C14,60 6,110 22,160" />
          <path d="M48,0 C52,40 40,80 54,118" />
          <path d="M90,0 C86,50 98,90 88,132" />
          <path d="M135,0 C139,30 129,60 141,88" />
        </g>
        <g fill="#1e4436">
          <circle cx="22" cy="160" r="5" />
          <circle cx="54" cy="118" r="4" />
          <circle cx="88" cy="132" r="5" />
          <circle cx="141" cy="88" r="3.5" />
        </g>
        <g fill="#a8e6c9" opacity="0.5">
          <circle cx="22" cy="160" r="1.8" />
          <circle cx="88" cy="132" r="1.8" />
        </g>
      </svg>
      <svg
        className="absolute right-0 top-0 w-[26vw] max-w-sm -scale-x-100 opacity-50"
        viewBox="0 0 400 220"
      >
        <g stroke="#16302a" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M20,0 C24,70 12,120 30,175" />
          <path d="M64,0 C68,45 56,85 70,125" />
          <path d="M110,0 C106,35 118,70 108,100" />
        </g>
        <g fill="#1e4436">
          <circle cx="30" cy="175" r="5" />
          <circle cx="70" cy="125" r="4" />
          <circle cx="108" cy="100" r="4" />
        </g>
        <g fill="#a8e6c9" opacity="0.5">
          <circle cx="30" cy="175" r="1.8" />
          <circle cx="108" cy="100" r="1.5" />
        </g>
      </svg>

      {/* Drifting spores */}
      {SPORES.map((s, i) => (
        <span
          key={i}
          className="spore"
          style={{
            left: s.left,
            bottom: s.bottom,
            width: s.size,
            height: s.size,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            ["--spore-opacity" as string]: s.opacity,
            ["--spore-sway" as string]: `${s.sway}px`,
          }}
        />
      ))}

      {/* Vignette on top of everything */}
      <div className="vignette absolute inset-0" />
    </div>
  );
}
