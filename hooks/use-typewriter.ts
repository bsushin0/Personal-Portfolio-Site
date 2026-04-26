"use client"

import { useState, useEffect, useRef } from "react"

interface TypewriterOptions {
  typeSpeed?: number
  deleteSpeed?: number
  pauseAfterType?: number
  pauseAfterDelete?: number
}

export function useTypewriter(strings: string[], options: TypewriterOptions = {}) {
  const {
    typeSpeed = 55,
    deleteSpeed = 28,
    pauseAfterType = 1800,
    pauseAfterDelete = 400,
  } = options

  const [displayText, setDisplayText] = useState("")
  const [cursorVisible, setCursorVisible] = useState(true)
  const indexRef = useRef(0)
  const charIndexRef = useRef(0)
  const isTypingRef = useRef(true)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stringsRef = useRef(strings)

  useEffect(() => {
    stringsRef.current = strings
  })

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayText(stringsRef.current[0])
      return
    }

    const tick = () => {
      const current = stringsRef.current[indexRef.current]

      if (isTypingRef.current) {
        charIndexRef.current++
        setDisplayText(current.slice(0, charIndexRef.current))

        if (charIndexRef.current >= current.length) {
          isTypingRef.current = false
          timeoutRef.current = setTimeout(tick, pauseAfterType)
        } else {
          timeoutRef.current = setTimeout(tick, typeSpeed)
        }
      } else {
        charIndexRef.current--
        setDisplayText(current.slice(0, charIndexRef.current))

        if (charIndexRef.current <= 0) {
          isTypingRef.current = true
          indexRef.current = (indexRef.current + 1) % stringsRef.current.length
          timeoutRef.current = setTimeout(tick, pauseAfterDelete)
        } else {
          timeoutRef.current = setTimeout(tick, deleteSpeed)
        }
      }
    }

    timeoutRef.current = setTimeout(tick, typeSpeed)

    const cursorInterval = setInterval(() => {
      setCursorVisible((v) => !v)
    }, 500)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      clearInterval(cursorInterval)
    }
  }, [])

  return { displayText, cursorVisible }
}
