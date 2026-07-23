const MINT = "#a8e6c9";
const GOLD = "#d3b06a";

export function flareCounter(el: HTMLElement | null) {
  el?.animate(
    [
      { boxShadow: "0 0 0 0 rgba(211,176,106,0)" },
      { boxShadow: "0 0 20px 5px rgba(211,176,106,0.45)" },
      { boxShadow: "0 0 0 0 rgba(211,176,106,0)" },
    ],
    { duration: 750 }
  );
}

export function burstStars(x: number, y: number, count: number) {
  for (let i = 0; i < count; i++) {
    const star = document.createElement("span");
    star.textContent = "✦";
    const size = 10 + Math.random() * 9;
    star.setAttribute(
      "style",
      `position:fixed;left:${x - 8 + (Math.random() - 0.5) * 26}px;top:${y + Math.random() * 10}px;color:${Math.random() > 0.4 ? MINT : GOLD};font-size:${size.toFixed(0)}px;pointer-events:none;z-index:60`
    );
    document.body.appendChild(star);
    const driftX = (Math.random() - 0.5) * 70;
    const driftY = 16 + Math.random() * 34;
    star.animate(
      [
        { transform: "translate(0,0) scale(0.3)", opacity: 0 },
        {
          transform: `translate(${driftX * 0.5}px,${driftY * 0.6}px) scale(1.1)`,
          opacity: 1,
          offset: 0.3,
        },
        { transform: `translate(${driftX}px,${driftY}px) scale(0.4)`, opacity: 0 },
      ],
      { duration: 950 + Math.random() * 350, easing: "ease-out" }
    );
    window.setTimeout(() => star.remove(), 1400);
  }
}
