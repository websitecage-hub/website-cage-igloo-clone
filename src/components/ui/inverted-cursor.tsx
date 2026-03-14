"use client"

import React, { useEffect, useRef, useState } from "react"

interface CursorProps {
  size?: number
}

export const Cursor: React.FC<CursorProps> = ({ size = 40 }) => {
  const cursorRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<number>(null)
  const previousPos = useRef({ x: -size, y: -size })

  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ x: -size, y: -size })

  const animate = () => {
    if (!cursorRef.current) return

    const currentX = previousPos.current.x
    const currentY = previousPos.current.y
    const targetX = position.x - size / 2
    const targetY = position.y - size / 2

    // Smoother movement (lower value = more delay/fluidity)
    const deltaX = (targetX - currentX) * 0.1
    const deltaY = (targetY - currentY) * 0.1

    const newX = currentX + deltaX
    const newY = currentY + deltaY

    previousPos.current = { x: newX, y: newY }
    cursorRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0)`

    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!visible) setVisible(true)
      setPosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    const handleMouseEnter = () => setVisible(true)
    const handleMouseLeave = () => setVisible(false)

    window.addEventListener("mousemove", handleMouseMove)
    document.body.addEventListener("mouseenter", handleMouseEnter)
    document.body.addEventListener("mouseleave", handleMouseLeave)

    requestRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.body.removeEventListener("mouseenter", handleMouseEnter)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [position, size, visible])

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[99999] hidden lg:block"
      style={{ overflow: 'hidden' }}
    >
      <div
        ref={cursorRef}
        className="pointer-events-none absolute top-0 left-0 rounded-full bg-white mix-blend-difference will-change-transform"
        style={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        aria-hidden="true"
      />
    </div>
  )
}


export default Cursor
