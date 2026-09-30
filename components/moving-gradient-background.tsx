"use client"

import { useEffect, useRef } from "react"

export function MovingGradientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const animate = () => {
      timeRef.current += 0.005 // Very slow time progression

      // Create multiple gradient layers that move slowly
      const gradient1 = ctx.createRadialGradient(
        canvas.width * 0.3 + Math.sin(timeRef.current) * 100,
        canvas.height * 0.2 + Math.cos(timeRef.current * 0.8) * 80,
        0,
        canvas.width * 0.3 + Math.sin(timeRef.current) * 100,
        canvas.height * 0.2 + Math.cos(timeRef.current * 0.8) * 80,
        canvas.width * 0.8,
      )
      gradient1.addColorStop(0, "rgba(139, 92, 246, 0.15)") // Purple
      gradient1.addColorStop(0.5, "rgba(59, 130, 246, 0.08)") // Blue
      gradient1.addColorStop(1, "rgba(15, 23, 42, 0)")

      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.7 + Math.cos(timeRef.current * 1.2) * 120,
        canvas.height * 0.6 + Math.sin(timeRef.current * 0.6) * 100,
        0,
        canvas.width * 0.7 + Math.cos(timeRef.current * 1.2) * 120,
        canvas.height * 0.6 + Math.sin(timeRef.current * 0.6) * 100,
        canvas.width * 0.9,
      )
      gradient2.addColorStop(0, "rgba(147, 51, 234, 0.12)") // Purple variant
      gradient2.addColorStop(0.5, "rgba(99, 102, 241, 0.06)") // Indigo
      gradient2.addColorStop(1, "rgba(30, 41, 59, 0)")

      const gradient3 = ctx.createRadialGradient(
        canvas.width * 0.1 + Math.sin(timeRef.current * 0.7) * 80,
        canvas.height * 0.8 + Math.cos(timeRef.current * 1.1) * 90,
        0,
        canvas.width * 0.1 + Math.sin(timeRef.current * 0.7) * 80,
        canvas.height * 0.8 + Math.cos(timeRef.current * 1.1) * 90,
        canvas.width * 0.7,
      )
      gradient3.addColorStop(0, "rgba(168, 85, 247, 0.1)") // Purple light
      gradient3.addColorStop(0.5, "rgba(79, 70, 229, 0.05)") // Indigo dark
      gradient3.addColorStop(1, "rgba(51, 65, 85, 0)")

      // Clear canvas with base gradient
      const baseGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      baseGradient.addColorStop(0, "#0f172a")
      baseGradient.addColorStop(0.5, "#1e293b")
      baseGradient.addColorStop(1, "#334155")

      ctx.fillStyle = baseGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Apply moving gradients with blend modes
      ctx.globalCompositeOperation = "screen"

      ctx.fillStyle = gradient1
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = gradient3
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Reset blend mode
      ctx.globalCompositeOperation = "source-over"

      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </div>
  )
}
