"use client"

import { useEffect, useRef, useState } from "react"

export default function CursorSystem() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: -9999, y: -9999 })
  const ringPosRef = useRef({ x: -9999, y: -9999 })
  const rafRef = useRef<number | null>(null)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return

    setIsActive(true)
    document.body.style.cursor = "none"

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const loop = () => {
      ringPosRef.current.x = lerp(ringPosRef.current.x, posRef.current.x, 0.1)
      ringPosRef.current.y = lerp(ringPosRef.current.y, posRef.current.y, 0.1)

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${posRef.current.x - 3}px, ${posRef.current.y - 3}px)`
      }
      if (ringRef.current) {
        const r = parseInt(ringRef.current.style.width || "36")
        const offset = r / 2
        ringRef.current.style.transform = `translate(${ringPosRef.current.x - offset}px, ${ringPosRef.current.y - offset}px)`
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    loop()

    const onMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as Element
      const interactive = !!target.closest("a, button, [role='button'], input, textarea, select, label, [data-cursor-hover]")

      if (ringRef.current) {
        const size = interactive ? "52px" : "36px"
        ringRef.current.style.width = size
        ringRef.current.style.height = size
        ringRef.current.style.opacity = interactive ? "0.4" : "0.7"
      }
    }

    const onMouseDown = () => {
      if (dotRef.current) {
        dotRef.current.style.transform += " scale(0.5)"
        dotRef.current.style.transition = "transform 150ms ease"
      }
    }

    const onMouseUp = () => {
      if (dotRef.current) {
        dotRef.current.style.transition = "transform 150ms ease"
        // scale resets naturally via the loop overwriting transform next frame
      }
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseover", onMouseOver)
    window.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mouseup", onMouseUp)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      document.body.style.cursor = ""
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseover", onMouseOver)
      window.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [])

  if (!isActive) return null

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: "1.5px solid hsl(239 84% 67%)",
          opacity: 0.7,
          pointerEvents: "none",
          zIndex: 99999,
          willChange: "transform",
          transition: "width 200ms cubic-bezier(0.23,1,0.32,1), height 200ms cubic-bezier(0.23,1,0.32,1), opacity 200ms ease",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "hsl(239 84% 67%)",
          pointerEvents: "none",
          zIndex: 100000,
          willChange: "transform",
        }}
      />
    </>
  )
}
