// Pure CSS floating gradient orbs — no JS, no hydration, no re-renders.
// These add ambient depth across the full page, complementing the canvas particles.

export default function FloatingOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }} aria-hidden="true">
      {/* Top-left indigo orb */}
      <div
        className="absolute rounded-full floating-orb-a"
        style={{
          width: "clamp(260px, 35vw, 520px)",
          height: "clamp(260px, 35vw, 520px)",
          top: "-8%",
          left: "-6%",
          animation: "orb-drift-a 18s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Top-right cyan orb */}
      <div
        className="absolute rounded-full floating-orb-b"
        style={{
          width: "clamp(200px, 28vw, 420px)",
          height: "clamp(200px, 28vw, 420px)",
          top: "5%",
          right: "-4%",
          animation: "orb-drift-b 22s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Mid-left purple orb */}
      <div
        className="absolute rounded-full floating-orb-c"
        style={{
          width: "clamp(180px, 24vw, 380px)",
          height: "clamp(180px, 24vw, 380px)",
          top: "38%",
          left: "-3%",
          animation: "orb-drift-c 26s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Mid-right indigo orb */}
      <div
        className="absolute rounded-full floating-orb-d"
        style={{
          width: "clamp(150px, 20vw, 320px)",
          height: "clamp(150px, 20vw, 320px)",
          top: "52%",
          right: "2%",
          animation: "orb-drift-d 20s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Bottom-center cyan orb */}
      <div
        className="absolute rounded-full floating-orb-e"
        style={{
          width: "clamp(220px, 30vw, 460px)",
          height: "clamp(220px, 30vw, 460px)",
          bottom: "-10%",
          left: "35%",
          animation: "orb-drift-e 24s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      <style>{`
        /* ── Dark mode (default) — low opacity, high lightness ── */
        .floating-orb-a {
          background: radial-gradient(circle, hsl(239 84% 67% / 0.12) 0%, hsl(239 84% 67% / 0.05) 45%, transparent 70%);
        }
        .floating-orb-b {
          background: radial-gradient(circle, hsl(188 100% 50% / 0.10) 0%, hsl(188 100% 50% / 0.04) 50%, transparent 70%);
        }
        .floating-orb-c {
          background: radial-gradient(circle, hsl(278 68% 59% / 0.09) 0%, hsl(278 68% 59% / 0.03) 50%, transparent 70%);
        }
        .floating-orb-d {
          background: radial-gradient(circle, hsl(239 84% 67% / 0.08) 0%, transparent 65%);
        }
        .floating-orb-e {
          background: radial-gradient(circle, hsl(188 100% 50% / 0.08) 0%, hsl(278 68% 59% / 0.04) 45%, transparent 70%);
        }

        /* ── Light mode overrides — darker hues, much higher opacity ── */
        :root:not(.dark) .floating-orb-a {
          background: radial-gradient(circle, hsl(239 84% 48% / 0.28) 0%, hsl(239 84% 48% / 0.12) 45%, transparent 70%);
        }
        :root:not(.dark) .floating-orb-b {
          background: radial-gradient(circle, hsl(188 100% 36% / 0.22) 0%, hsl(188 100% 36% / 0.09) 50%, transparent 70%);
        }
        :root:not(.dark) .floating-orb-c {
          background: radial-gradient(circle, hsl(278 68% 44% / 0.22) 0%, hsl(278 68% 44% / 0.08) 50%, transparent 70%);
        }
        :root:not(.dark) .floating-orb-d {
          background: radial-gradient(circle, hsl(239 84% 48% / 0.20) 0%, transparent 65%);
        }
        :root:not(.dark) .floating-orb-e {
          background: radial-gradient(circle, hsl(188 100% 36% / 0.18) 0%, hsl(278 68% 44% / 0.10) 45%, transparent 70%);
        }

        @keyframes orb-drift-a {
          0%   { transform: translate(0px,   0px)  scale(1);    }
          12%  { transform: translate(14px,  8px)  scale(1.02); }
          27%  { transform: translate(30px,  22px) scale(1.04); }
          41%  { transform: translate(18px,  38px) scale(1.02); }
          55%  { transform: translate(-8px,  30px) scale(0.98); }
          70%  { transform: translate(-18px, 12px) scale(0.96); }
          84%  { transform: translate(-6px, -10px) scale(0.99); }
          100% { transform: translate(0px,   0px)  scale(1);    }
        }
        @keyframes orb-drift-b {
          0%   { transform: translate(0px,   0px)  scale(1);    }
          15%  { transform: translate(-10px, 14px) scale(1.02); }
          32%  { transform: translate(-26px, 28px) scale(1.05); }
          48%  { transform: translate(-14px, 10px) scale(1.03); }
          60%  { transform: translate(8px,  -12px) scale(0.98); }
          74%  { transform: translate(16px, -22px) scale(0.95); }
          88%  { transform: translate(6px,  -8px)  scale(0.99); }
          100% { transform: translate(0px,   0px)  scale(1);    }
        }
        @keyframes orb-drift-c {
          0%   { transform: translate(0px,   0px)  scale(1);    }
          10%  { transform: translate(8px,  -14px) scale(1.02); }
          25%  { transform: translate(22px, -32px) scale(1.05); }
          42%  { transform: translate(30px, -18px) scale(1.03); }
          57%  { transform: translate(12px,  6px)  scale(0.99); }
          71%  { transform: translate(-12px, 22px) scale(0.97); }
          86%  { transform: translate(-6px,  10px) scale(0.99); }
          100% { transform: translate(0px,   0px)  scale(1);    }
        }
        @keyframes orb-drift-d {
          0%   { transform: translate(0px,   0px)  scale(1);    }
          14%  { transform: translate(-12px, -6px) scale(1.01); }
          29%  { transform: translate(-28px,-16px) scale(1.03); }
          44%  { transform: translate(-22px,  4px) scale(1.02); }
          58%  { transform: translate(-8px,  18px) scale(0.99); }
          73%  { transform: translate(12px,  26px) scale(0.97); }
          87%  { transform: translate(8px,   10px) scale(0.99); }
          100% { transform: translate(0px,   0px)  scale(1);    }
        }
        @keyframes orb-drift-e {
          0%   { transform: translate(0px,   0px)  scale(1);    }
          11%  { transform: translate(-8px, -10px) scale(1.01); }
          26%  { transform: translate(-22px,-26px) scale(1.04); }
          40%  { transform: translate(-10px,-16px) scale(1.02); }
          54%  { transform: translate(10px, -4px)  scale(1.00); }
          68%  { transform: translate(24px,  10px) scale(0.96); }
          83%  { transform: translate(12px,   6px) scale(0.98); }
          100% { transform: translate(0px,   0px)  scale(1);    }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="floating-orb-"] { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
