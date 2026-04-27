// Pure CSS floating gradient orbs — no JS, no hydration, no re-renders.
// These add ambient depth across the full page, complementing the canvas particles.

export default function FloatingOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }} aria-hidden="true">
      {/* Top-left indigo orb */}
      <div
        className="absolute rounded-full"
        style={{
          width: "clamp(260px, 35vw, 520px)",
          height: "clamp(260px, 35vw, 520px)",
          top: "-8%",
          left: "-6%",
          background: "radial-gradient(circle, hsl(239 84% 67% / 0.12) 0%, hsl(239 84% 67% / 0.05) 45%, transparent 70%)",
          animation: "orb-drift-a 18s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Top-right cyan orb */}
      <div
        className="absolute rounded-full"
        style={{
          width: "clamp(200px, 28vw, 420px)",
          height: "clamp(200px, 28vw, 420px)",
          top: "5%",
          right: "-4%",
          background: "radial-gradient(circle, hsl(188 100% 50% / 0.10) 0%, hsl(188 100% 50% / 0.04) 50%, transparent 70%)",
          animation: "orb-drift-b 22s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Mid-left purple orb */}
      <div
        className="absolute rounded-full"
        style={{
          width: "clamp(180px, 24vw, 380px)",
          height: "clamp(180px, 24vw, 380px)",
          top: "38%",
          left: "-3%",
          background: "radial-gradient(circle, hsl(278 68% 59% / 0.09) 0%, hsl(278 68% 59% / 0.03) 50%, transparent 70%)",
          animation: "orb-drift-c 26s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Mid-right indigo orb */}
      <div
        className="absolute rounded-full"
        style={{
          width: "clamp(150px, 20vw, 320px)",
          height: "clamp(150px, 20vw, 320px)",
          top: "52%",
          right: "2%",
          background: "radial-gradient(circle, hsl(239 84% 67% / 0.08) 0%, transparent 65%)",
          animation: "orb-drift-d 20s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Bottom-center cyan orb */}
      <div
        className="absolute rounded-full"
        style={{
          width: "clamp(220px, 30vw, 460px)",
          height: "clamp(220px, 30vw, 460px)",
          bottom: "-10%",
          left: "35%",
          background: "radial-gradient(circle, hsl(188 100% 50% / 0.08) 0%, hsl(278 68% 59% / 0.04) 45%, transparent 70%)",
          animation: "orb-drift-e 24s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      <style>{`
        @keyframes orb-drift-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, 20px) scale(1.04); }
          66% { transform: translate(-15px, 35px) scale(0.97); }
        }
        @keyframes orb-drift-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(-25px, 30px) scale(1.06); }
          70% { transform: translate(10px, -20px) scale(0.96); }
        }
        @keyframes orb-drift-c {
          0%, 100% { transform: translate(0, 0) scale(1); }
          30% { transform: translate(20px, -30px) scale(1.05); }
          65% { transform: translate(-10px, 20px) scale(0.98); }
        }
        @keyframes orb-drift-d {
          0%, 100% { transform: translate(0, 0) scale(1); }
          45% { transform: translate(-30px, -15px) scale(1.03); }
          75% { transform: translate(15px, 25px) scale(0.97); }
        }
        @keyframes orb-drift-e {
          0%, 100% { transform: translate(0, 0) scale(1); }
          35% { transform: translate(-20px, -25px) scale(1.05); }
          68% { transform: translate(25px, 10px) scale(0.96); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="orb-drift"] { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
