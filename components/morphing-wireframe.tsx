"use client"

import { useEffect, useRef, useCallback } from "react"

interface Point {
  x: number
  y: number
  opacity: number
  velocityY: number
  baseY: number
}

export function MorphingWireframe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const mousePosition = useRef({ x: -1000, y: -1000 })
  const scrollY = useRef(0)
  const lastScrollY = useRef(0)
  const scrollVelocity = useRef(0)
  const dotsRef = useRef<Point[]>([])

  // Grid configuration
  const GRID_SPACING = 100
  const DOT_SIZE = 3
  const CONNECTION_DISTANCE = 140 // Increased for more connections
  const MOUSE_INFLUENCE_RADIUS = 150

  // Initialize dot grid with physics - cover full document
  const initializeDotGrid = useCallback((width: number, height: number) => {
    const dots: Point[] = []
    // Get the full document height to ensure complete coverage
    const documentHeight = Math.max(height, document.documentElement.scrollHeight, document.body.scrollHeight)
    const cols = Math.ceil(width / GRID_SPACING) + 4
    const rows = Math.ceil((documentHeight + 2000) / GRID_SPACING) + 6

    for (let row = -3; row < rows; row++) {
      for (let col = -2; col < cols; col++) {
        const x = col * GRID_SPACING
        const baseY = row * GRID_SPACING

        dots.push({
          x,
          y: baseY,
          baseY,
          opacity: 0.4,
          velocityY: 0,
        })
      }
    }

    dotsRef.current = dots
  }, [])

  // Update dot physics based on scroll
  const updateDotPhysics = useCallback(() => {
    const currentScrollVelocity = scrollY.current - lastScrollY.current
    scrollVelocity.current = scrollVelocity.current * 0.85 + currentScrollVelocity * 0.15
    lastScrollY.current = scrollY.current

    dotsRef.current.forEach((dot, index) => {
      const parallaxOffset = -scrollY.current * 0.3
      const targetY = dot.baseY + parallaxOffset
      const velocityEffect = -scrollVelocity.current * 3
      const finalTargetY = targetY + velocityEffect

      const springForce = (finalTargetY - dot.y) * 0.12
      const damping = dot.velocityY * 0.88

      dot.velocityY += springForce - damping
      dot.y += dot.velocityY

      if (Math.abs(scrollVelocity.current) < 0.5) {
        const returnForce = (targetY - dot.y) * 0.06
        dot.velocityY += returnForce
      }

      dot.velocityY = Math.max(-20, Math.min(20, dot.velocityY))

      const mouseDistance = Math.sqrt(
        Math.pow(dot.x - mousePosition.current.x, 2) + Math.pow(dot.y - mousePosition.current.y, 2),
      )

      if (mouseDistance < MOUSE_INFLUENCE_RADIUS) {
        dot.opacity = 0.4 + (1 - mouseDistance / MOUSE_INFLUENCE_RADIUS) * 0.6
      } else {
        dot.opacity = Math.max(0.3, dot.opacity * 0.95)
      }

      const movementIntensity = Math.abs(dot.velocityY) / 15
      dot.opacity = Math.min(1, dot.opacity + movementIntensity * 0.3)
    })
  }, [])

  // Get grid-based connections
  const getGridConnections = useCallback(() => {
    const connections: [Point, Point][] = []
    const canvas = canvasRef.current
    if (!canvas) return connections

    const cols = Math.ceil(canvas.width / GRID_SPACING) + 4

    dotsRef.current.forEach((dot, index) => {
      const row = Math.floor(index / cols)
      const col = index % cols

      if (col < cols - 1) {
        const rightNeighbor = dotsRef.current[index + 1]
        if (rightNeighbor) {
          connections.push([dot, rightNeighbor])
        }
      }

      const bottomNeighbor = dotsRef.current[index + cols]
      if (bottomNeighbor) {
        connections.push([dot, bottomNeighbor])
      }

      if (col < cols - 1) {
        const bottomRightNeighbor = dotsRef.current[index + cols + 1]
        if (bottomRightNeighbor && Math.random() > 0.7) {
          connections.push([dot, bottomRightNeighbor])
        }
      }

      if (col > 0) {
        const bottomLeftNeighbor = dotsRef.current[index + cols - 1]
        if (bottomLeftNeighbor && Math.random() > 0.8) {
          connections.push([dot, bottomLeftNeighbor])
        }
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

    // Update canvas height to match full document
    const documentHeight = Math.max(
      window.innerHeight,
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
    )
    if (canvas.height !== documentHeight) {
      canvas.height = documentHeight
    }

    updateDotPhysics()
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Render dots that are near the viewport for performance
    const viewportTop = scrollY.current - 300
    const viewportBottom = scrollY.current + window.innerHeight + 300
    const visibleDots = dotsRef.current.filter((dot) => dot.y > viewportTop && dot.y < viewportBottom)
    const connections = getGridConnections()

    // Draw connections
    connections.forEach(([dot1, dot2]) => {
      if ((dot1.y < viewportTop || dot1.y > viewportBottom) && (dot2.y < viewportTop || dot2.y > viewportBottom)) return

      const distance = Math.sqrt(Math.pow(dot1.x - dot2.x, 2) + Math.pow(dot1.y - dot2.y, 2))

      if (distance < CONNECTION_DISTANCE) {
        const avgOpacity = (dot1.opacity + dot2.opacity) / 2
        const connectionOpacity = avgOpacity * 0.6
        const avgMovement = (Math.abs(dot1.velocityY) + Math.abs(dot2.velocityY)) / 2
        const lineWidth = 1 + (avgMovement / 10) * 1.5

        const gradient = ctx.createLinearGradient(dot1.x, dot1.y, dot2.x, dot2.y)
        gradient.addColorStop(0, `rgba(139, 92, 246, ${connectionOpacity})`)
        gradient.addColorStop(0.5, `rgba(147, 51, 234, ${connectionOpacity * 0.8})`)
        gradient.addColorStop(1, `rgba(139, 92, 246, ${connectionOpacity})`)

        ctx.globalAlpha = 1
        ctx.strokeStyle = gradient
        ctx.lineWidth = lineWidth
        ctx.beginPath()
        ctx.moveTo(dot1.x, dot1.y)
        ctx.lineTo(dot2.x, dot2.y)
        ctx.stroke()
      }
    })

    // Draw dots
    visibleDots.forEach((dot) => {
      const movementSize = DOT_SIZE + (Math.abs(dot.velocityY) / 15) * 2

      const gradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, movementSize * 2)
      gradient.addColorStop(0, `rgba(139, 92, 246, ${dot.opacity})`)
      gradient.addColorStop(0.5, `rgba(147, 51, 234, ${dot.opacity * 0.8})`)
      gradient.addColorStop(1, `rgba(139, 92, 246, 0)`)

      ctx.globalAlpha = 1
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(dot.x, dot.y, movementSize, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = `rgba(255, 255, 255, ${dot.opacity * 0.8})`
      ctx.beginPath()
      ctx.arc(dot.x, dot.y, movementSize * 0.4, 0, Math.PI * 2)
      ctx.fill()

      if (Math.abs(dot.velocityY) > 5) {
        const glowGradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, movementSize * 4)
        glowGradient.addColorStop(0, `rgba(139, 92, 246, ${dot.opacity * 0.3})`)
        glowGradient.addColorStop(1, `rgba(139, 92, 246, 0)`)

        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, movementSize * 3, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    animationRef.current = requestAnimationFrame(animate)
  }, [updateDotPhysics, getGridConnections])

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
      const documentHeight = Math.max(
        window.innerHeight,
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      )
      canvas.height = documentHeight
      initializeDotGrid(canvas.width, canvas.height)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    // Monitor document height changes
    const observer = new ResizeObserver(() => {
      handleResize()
    })
    observer.observe(document.body)

    // Start animation
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", handleResize)
      observer.disconnect()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate, initializeDotGrid])

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
