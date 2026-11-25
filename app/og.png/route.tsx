import { ImageResponse } from "next/og"

// 1200x630 link preview image for LinkedIn, X, Slack and iMessage. Built once at build time.

export const dynamic = "force-static"

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(160deg, #050912 0%, #0b1a33 60%, #12305a 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#57d7eb" }}>PURDUE UNIVERSITY · B.S. ARTIFICIAL INTELLIGENCE</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 800, lineHeight: 1 }}>Sushin Bandha</div>
          <div style={{ display: "flex", fontSize: 40, marginTop: 28, color: "#d6e2f0" }}>
            AI student at Purdue. Student pilot. Licensed EMT.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#9fb3cc" }}>
          <span>Projects, case studies and resume</span>
          <span style={{ color: "#5be39a" }}>sushinbandha.com</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
