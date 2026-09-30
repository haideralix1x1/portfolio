"use client"

import { useEffect, useRef, useCallback } from "react"

export function SimpleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const scrollY = useRef(0)

  // Simple floating particles
  const particles = useRef<
    Array<{
      x: number
      y: number
      baseY: number
      size: number
      opacity: number
      speed: number
    }>
  >([])

  // Initialize particles
  const initializeParticles = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    particles.current = []
    const particleCount = 30 // Reduced number for better performance

    for (let i = 0; i < particleCount; i++) {
      particles.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        baseY: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1, // Very subtle
        speed: Math.random() * 0.5 + 0.2,
      })
    }
  }, [])

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Update and draw particles
    particles.current.forEach((particle) => {
      // Subtle parallax movement
      particle.y = particle.baseY - scrollY.current * 0.1

      // Wrap around screen
      if (particle.y < -10) {
        particle.y = canvas.height + 10
        particle.baseY = canvas.height + 10
      }
      if (particle.y > canvas.height + 10) {
        particle.y = -10
        particle.baseY = -10
      }

      // Draw particle with subtle glow
      const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 3)
      gradient.addColorStop(0, `rgba(139, 92, 246, ${particle.opacity})`)
      gradient.addColorStop(1, `rgba(139, 92, 246, 0)`)

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
      ctx.fill()

      // Draw center dot
      ctx.fillStyle = `rgba(139, 92, 246, ${particle.opacity * 0.8})`
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
    })

    animationRef.current = requestAnimationFrame(animate)
  }, [])

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Initialize and handle resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initializeParticles()
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    // Start animation
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate, initializeParticles])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </div>
  )
}
