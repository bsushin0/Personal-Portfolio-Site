"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import type { SkyPhase } from "@/context/flight-context"

// Low-poly high-wing trainer (think C172) built from primitives — no model
// file to download. Banks toward the pointer, bobs in light chop, and pitches
// up and climbs away as the hero scrolls out of view.

function buildPlane() {
  const plane = new THREE.Group()

  const white = new THREE.MeshStandardMaterial({ color: 0xf1f3f7, roughness: 0.45, metalness: 0.15 })
  const accent = new THREE.MeshStandardMaterial({ color: 0xff4fd8, roughness: 0.5, metalness: 0.1 })
  const navy = new THREE.MeshStandardMaterial({ color: 0x1b2a4a, roughness: 0.6 })
  const glass = new THREE.MeshStandardMaterial({ color: 0x0d1b2e, roughness: 0.1, metalness: 0.6 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x222831, roughness: 0.8 })

  // Fuselage — lathe profile along +Y, rotated so the nose points to -Z.
  const profile = [
    [0.02, -2.3], [0.1, -2.25], [0.24, -1.6], [0.4, -0.8], [0.55, 0.0],
    [0.6, 0.6], [0.58, 1.2], [0.48, 1.65], [0.32, 1.95], [0.0, 2.0],
  ].map(([r, y]) => new THREE.Vector2(r, y))
  const fuselage = new THREE.Mesh(new THREE.LatheGeometry(profile, 28), white)
  fuselage.rotation.x = -Math.PI / 2
  fuselage.scale.set(1, 1, 0.92)
  plane.add(fuselage)

  // Cabin glass
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.36, 1.05), glass)
  cabin.position.set(0, 0.42, -0.7)
  cabin.rotation.x = -0.12
  plane.add(cabin)

  // High wing
  const wing = new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.09, 1.05), white)
  wing.position.set(0, 0.66, -0.55)
  plane.add(wing)
  for (const side of [-1, 1]) {
    const tip = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.1, 1.06), accent)
    tip.position.set(side * 3.55, 0.66, -0.55)
    plane.add(tip)
    // Strut from lower fuselage to mid-wing
    const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.1, 6), navy)
    strut.position.set(side * 1.15, 0.05, -0.45)
    strut.rotation.z = side * 1.03
    plane.add(strut)
    // Main gear
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 6), navy)
    leg.position.set(side * 0.55, -0.62, -0.15)
    leg.rotation.z = side * 0.6
    plane.add(leg)
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.1, 14), dark)
    wheel.rotation.z = Math.PI / 2
    wheel.position.set(side * 0.82, -0.95, -0.15)
    plane.add(wheel)
  }
  const noseLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 6), navy)
  noseLeg.position.set(0, -0.62, -1.45)
  plane.add(noseLeg)
  const noseWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.09, 14), dark)
  noseWheel.rotation.z = Math.PI / 2
  noseWheel.position.set(0, -0.92, -1.45)
  plane.add(noseWheel)

  // Tail
  const stab = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.06, 0.62), white)
  stab.position.set(0, 0.05, 2.0)
  plane.add(stab)
  const finShape = new THREE.Shape()
  finShape.moveTo(0, 0)
  finShape.lineTo(0.95, 0)
  finShape.lineTo(0.75, 1.15)
  finShape.lineTo(0.25, 1.15)
  finShape.closePath()
  const fin = new THREE.Mesh(new THREE.ExtrudeGeometry(finShape, { depth: 0.06, bevelEnabled: false }), accent)
  fin.rotation.y = -Math.PI / 2
  fin.position.set(0.03, 0.12, 1.45)
  plane.add(fin)

  // Spinner + propeller
  const spinner = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.38, 16), navy)
  spinner.rotation.x = -Math.PI / 2
  spinner.position.set(0, 0, -2.15)
  plane.add(spinner)
  const prop = new THREE.Group()
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.9, 0.03), dark)
  prop.add(blade)
  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(0.98, 32),
    new THREE.MeshBasicMaterial({ color: 0xbfc8d6, transparent: true, opacity: 0.08, side: THREE.DoubleSide }),
  )
  prop.add(disc)
  prop.position.set(0, 0, -2.08)
  plane.add(prop)

  // Nav lights: red left, green right, white strobe on the tail
  const lightMat = (c: number) => new THREE.MeshBasicMaterial({ color: c })
  const red = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), lightMat(0xff3b3b))
  red.position.set(-3.74, 0.66, -0.55)
  const green = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), lightMat(0x3bff7a))
  green.position.set(3.74, 0.66, -0.55)
  const strobe = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), lightMat(0xffffff))
  strobe.position.set(0, 1.3, 2.25)
  plane.add(red, green, strobe)

  return { plane, prop, strobe }
}

const LIGHT: Record<SkyPhase, { sun: number; sky: number; ground: number; intensity: number }> = {
  day: { sun: 0xffffff, sky: 0xbfdcff, ground: 0x3a4a3a, intensity: 2.2 },
  dawn: { sun: 0xffc79a, sky: 0x9a8acb, ground: 0x2a2030, intensity: 1.8 },
  dusk: { sun: 0xff9f6e, sky: 0x7a6aa8, ground: 0x221828, intensity: 1.6 },
  night: { sun: 0x8fa8ff, sky: 0x3a4a78, ground: 0x0a0d18, intensity: 1.1 },
}

export default function Plane3D({ phase, className }: { phase: SkyPhase; className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  const phaseRef = useRef(phase)
  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" })
    } catch {
      setFailed(true)
      return
    }
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)
    renderer.domElement.setAttribute("aria-hidden", "true")

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.set(7.5, 3.2, -9.5)
    camera.lookAt(0, 0.2, 0)

    const hemi = new THREE.HemisphereLight(LIGHT[phase].sky, LIGHT[phase].ground, 1.1)
    const sun = new THREE.DirectionalLight(LIGHT[phase].sun, LIGHT[phase].intensity)
    sun.position.set(5, 8, -6)
    scene.add(hemi, sun)

    const { plane, prop, strobe } = buildPlane()
    const rig = new THREE.Group()
    rig.add(plane)
    scene.add(rig)

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect()
      if (!width || !height) return
      renderer.setSize(width, height, false)
      renderer.domElement.style.width = "100%"
      renderer.domElement.style.height = "100%"
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    const pointer = { x: 0, y: 0 }
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener("pointermove", onPointer, { passive: true })

    let bank = 0
    let pitch = 0
    let visible = true
    let raf = 0
    const clock = new THREE.Clock()

    const frame = () => {
      const t = clock.getElapsedTime()
      const hero = Math.min(1.4, window.scrollY / Math.max(1, window.innerHeight))
      const l = LIGHT[phaseRef.current]
      sun.color.setHex(l.sun)
      sun.intensity = l.intensity
      hemi.color.setHex(l.sky)
      hemi.groundColor.setHex(l.ground)

      const targetBank = reduce ? 0 : -pointer.x * 0.45
      const targetPitch = (reduce ? 0 : pointer.y * 0.12) - hero * 0.35
      bank += (targetBank - bank) * 0.05
      pitch += (targetPitch - pitch) * 0.05

      plane.rotation.z = bank + (reduce ? 0 : Math.sin(t * 0.9) * 0.04)
      plane.rotation.x = pitch
      plane.rotation.y = -0.25 + (reduce ? 0 : -pointer.x * 0.18)
      rig.position.y = (reduce ? 0 : Math.sin(t * 1.3) * 0.12) + hero * 3.2
      rig.position.z = hero * -4
      prop.rotation.z += reduce ? 0 : 0.9
      ;(strobe.material as THREE.MeshBasicMaterial).color.setScalar(t % 1.4 < 0.08 ? 1 : 0.15)

      renderer.render(scene, camera)
      if (!reduce && visible) raf = requestAnimationFrame(frame)
    }
    frame()

    const io = new IntersectionObserver(([entry]) => {
      const was = visible
      visible = entry.isIntersecting && !document.hidden
      if (visible && !was && !reduce) raf = requestAnimationFrame(frame)
    })
    io.observe(mount)
    const onVis = () => {
      const was = visible
      visible = !document.hidden
      if (visible && !was && !reduce) raf = requestAnimationFrame(frame)
    }
    document.addEventListener("visibilitychange", onVis)
    const onScrollReduced = () => reduce && frame()
    window.addEventListener("scroll", onScrollReduced, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener("pointermove", onPointer)
      window.removeEventListener("scroll", onScrollReduced)
      document.removeEventListener("visibilitychange", onVis)
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose()
          const m = obj.material
          if (Array.isArray(m)) m.forEach((x) => x.dispose())
          else m.dispose()
        }
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
    // Phase changes are read through phaseRef inside the loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={mountRef} className={className}>
      {failed && (
        <svg viewBox="0 0 24 24" className="mx-auto h-full w-auto rotate-[70deg] drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]" aria-hidden="true">
          <path fill="#eef1f5" d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
        </svg>
      )}
    </div>
  )
}
