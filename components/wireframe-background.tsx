"use client"

import { useEffect, useRef, useCallback } from "react"

interface Point {
  x: number
  y: number
  baseY: number
  opacity: number
}

export function WireframeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const mousePosition = useRef({ x: -1000, y: -1000 })
  const scrollY = useRef(0)
  const dotsRef = useRef<Point[]>([])

  // Grid configuration
  const GRID_SPACING = 80
  const DOT_SIZE = 2
  const MOUSE_INFLUENCE_RADIUS = 100

  // Initialize dot grid
  const initializeDotGrid = useCallback((width: number, height: number) => {
    const dots: Point[] = []
    const cols = Math.ceil(width / GRID_SPACING) + 2
    const rows = Math.ceil((height + 1000) / GRID_SPACING) + 6 // Increased buffer for more scrolling range

    for (let row = -3; row < rows; row++) {
      // Start from -3 instead of -2
      for (let col = 0; col < cols; col++) {
        const x = col * GRID_SPACING
        const baseY = row * GRID_SPACING

        dots.push({
          x,
          y: baseY,
          baseY,
          opacity: 0.6,
        })
      }
    }

    dotsRef.current = dots
  }, [])

  // Update dots based on scroll and mouse
  const updateDots = useCallback(() => {
    dotsRef.current.forEach((dot) => {
      // Apply parallax effect - grid moves opposite to scroll direction
      const parallaxOffset = -scrollY.current * 0.3 // Increased from 0.1 to 0.3 for more noticeable movement
      dot.y = dot.baseY + parallaxOffset

      // Mouse interaction
      const mouseDistance = Math.sqrt(
        Math.pow(dot.x - mousePosition.current.x, 2) + Math.pow(dot.y - mousePosition.current.y, 2),
      )

      if (mouseDistance < MOUSE_INFLUENCE_RADIUS) {
        const influence = 1 - mouseDistance / MOUSE_INFLUENCE_RADIUS
        dot.opacity = 0.6 + influence * 0.4
      } else {
        dot.opacity = Math.max(0.6, dot.opacity * 0.98)
      }
    })
  }, [])

  // Get grid connections
  const getGridConnections = useCallback(() => {
    const connections: [Point, Point][] = []
    const canvas = canvasRef.current
    if (!canvas) return connections

    const cols = Math.ceil(canvas.width / GRID_SPACING) + 2

    dotsRef.current.forEach((dot, index) => {
      const row = Math.floor(index / cols)
      const col = index % cols

      // Only render connections for dots visible on screen (with some buffer)
      if (dot.y < -200 || dot.y > canvas.height + 200) return

      // Connect to right neighbor
      if (col < cols - 1) {
        const rightNeighbor = dotsRef.current[index + 1]
        if (rightNeighbor && rightNeighbor.y > -200 && rightNeighbor.y < canvas.height + 200) {
          connections.push([dot, rightNeighbor])
        }
      }

      // Connect to bottom neighbor
      const bottomNeighbor = dotsRef.current[index + cols]
      if (bottomNeighbor && bottomNeighbor.y > -200 && bottomNeighbor.y < canvas.height + 200) {
        connections.push([dot, bottomNeighbor])
      }
    })

    return connections
  }, [])

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    updateDots()
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const connections = getGridConnections()

    // Draw connections
    connections.forEach(([dot1, dot2]) => {
      const avgOpacity = (dot1.opacity + dot2.opacity) / 2
      const connectionOpacity = avgOpacity * 0.3

      ctx.globalAlpha = connectionOpacity
      ctx.strokeStyle = "#8b5cf6"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(dot1.x, dot1.y)
      ctx.lineTo(dot2.x, dot2.y)
      ctx.stroke()
    })

    // Draw dots (only visible ones)
    dotsRef.current.forEach((dot) => {
      // Skip dots that are far off screen
      if (dot.y < -100 || dot.y > canvas.height + 100) return

      // Outer glow
      const glowGradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, 8)
      glowGradient.addColorStop(0, `rgba(139, 92, 246, ${dot.opacity * 0.8})`)
      glowGradient.addColorStop(0.5, `rgba(139, 92, 246, ${dot.opacity * 0.4})`)
      glowGradient.addColorStop(1, `rgba(139, 92, 246, 0)`)

      ctx.globalAlpha = 1
      ctx.fillStyle = glowGradient
      ctx.beginPath()
      ctx.arc(dot.x, dot.y, 8, 0, Math.PI * 2)
      ctx.fill()

      // Inner bright dot
      ctx.globalAlpha = dot.opacity
      ctx.fillStyle = "#a855f7"
      ctx.beginPath()
      ctx.arc(dot.x, dot.y, DOT_SIZE, 0, Math.PI * 2)
      ctx.fill()

      // Center highlight
      ctx.globalAlpha = dot.opacity * 0.9
      ctx.fillStyle = "#e879f9"
      ctx.beginPath()
      ctx.arc(dot.x, dot.y, DOT_SIZE * 0.5, 0, Math.PI * 2)
      ctx.fill()
    })

    animationRef.current = requestAnimationFrame(animate)
  }, [updateDots, getGridConnections])

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      mousePosition.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const handleMouseLeave = () => {
      mousePosition.current = { x: -1000, y: -1000 }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
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
      initializeDotGrid(canvas.width, canvas.height)
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
  }, [animate, initializeDotGrid])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          background: "linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </div>
  )
}
