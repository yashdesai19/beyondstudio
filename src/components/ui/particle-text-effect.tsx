"use client"

import { useEffect, useRef, type CSSProperties } from "react"

interface Vector2D {
  x: number
  y: number
}

class Particle {
  pos: Vector2D = { x: 0, y: 0 }
  vel: Vector2D = { x: 0, y: 0 }
  acc: Vector2D = { x: 0, y: 0 }
  target: Vector2D = { x: 0, y: 0 }

  closeEnoughTarget = 100
  maxSpeed = 1.0
  maxForce = 0.1
  particleSize = 10
  isKilled = false

  startColor = { r: 198, g: 164, b: 74 }
  targetColor = { r: 198, g: 164, b: 74 }
  colorWeight = 1.0
  colorBlendRate = 0.015

  move() {
    // Check if particle is close enough to its target to slow down
    let proximityMult = 1
    const distance = Math.sqrt(Math.pow(this.pos.x - this.target.x, 2) + Math.pow(this.pos.y - this.target.y, 2))

    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget
    }

    // Add force towards target
    const towardsTarget = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    }

    const magnitude = Math.sqrt(towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y)
    if (magnitude > 0) {
      towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult
      towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult
    }

    const steer = {
      x: towardsTarget.x - this.vel.x,
      y: towardsTarget.y - this.vel.y,
    }

    const steerMagnitude = Math.sqrt(steer.x * steer.x + steer.y * steer.y)
    if (steerMagnitude > 0) {
      steer.x = (steer.x / steerMagnitude) * this.maxForce
      steer.y = (steer.y / steerMagnitude) * this.maxForce
    }

    this.acc.x += steer.x
    this.acc.y += steer.y

    // Fast and snappy particle movement into target formation
    this.vel.x += this.acc.x
    this.vel.y += this.acc.y
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.acc.x = 0
    this.acc.y = 0
  }

  draw(ctx: CanvasRenderingContext2D, drawAsPoints: boolean) {
    // Blend towards target color
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0)
    }

    // Calculate current color
    const currentColor = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    }

    if (drawAsPoints) {
      ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`
      ctx.fillRect(this.pos.x, this.pos.y, 2.5, 2.5)
    } else {
      ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`
      ctx.beginPath()
      ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  kill(width: number, height: number) {
    if (!this.isKilled) {
      // Set target outside the scene
      const randomPos = this.generateRandomPos(width / 2, height / 2, (width + height) / 2)
      this.target.x = randomPos.x
      this.target.y = randomPos.y

      // Begin blending color to black
      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      }
      this.targetColor = { r: 0, g: 0, b: 0 }
      this.colorWeight = 0

      this.isKilled = true
    }
  }

  private generateRandomPos(x: number, y: number, mag: number): Vector2D {
    const randomX = Math.random() * 1200
    const randomY = Math.random() * 600

    const direction = {
      x: randomX - x,
      y: randomY - y,
    }

    const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y)
    if (magnitude > 0) {
      direction.x = (direction.x / magnitude) * mag
      direction.y = (direction.y / magnitude) * mag
    }

    return {
      x: x + direction.x,
      y: y + direction.y,
    }
  }
}

export interface ParticleTextEffectProps {
  words?: string[]
  colors?: Array<{ r: number; g: number; b: number }>
  className?: string
  style?: CSSProperties
  interval?: number
  showDescription?: boolean
}

// Beyond Studio Luxury Theme & Accent Colors:
// 1. 🟡 Beyond Brand Gold (#c6a44a) - Signature primary gold
// 2. ✨ Champagne Soft Gold (#e6ca7a) - Soft gilded secondary
// 3. 💎 Warm Ivory White (#fbf9f5) - Crisp luxury typographic white
// 4. 🔵 Electric / Cyan Blue (#00d8ff) - User favorite vibrant contrast
// 5. 🟣 Neon Violet / Royal Purple (#bc4eff) - Opulent editorial violet
export const THEME_COLORS = [
  { name: "Beyond Gold", r: 198, g: 164, b: 74 },
  { name: "Champagne Soft Gold", r: 230, g: 202, b: 122 },
  { name: "Warm Ivory White", r: 251, g: 249, b: 245 },
  { name: "Electric Cyan", r: 0, g: 216, b: 255 },
  { name: "Neon Violet", r: 188, g: 78, b: 255 },
]

export const CURATED_COLORS = THEME_COLORS

const DEFAULT_WORDS = ["BEYOND STUDIO"]

export function ParticleTextEffect({
  words = DEFAULT_WORDS,
  colors = THEME_COLORS,
  className = "",
  style,
  interval = 720, // frames (~12s at 60fps) so color stays much longer before changing
  showDescription = false,
}: ParticleTextEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const frameCountRef = useRef(0)
  const wordIndexRef = useRef(0)
  const colorIndexRef = useRef(0)
  const mouseRef = useRef({ x: -1000, y: -1000, isHovering: false, isPressed: false, isRightClick: false })

  const pixelSteps = 5
  const drawAsPoints = true

  const generateRandomPos = (x: number, y: number, mag: number): Vector2D => {
    const randomX = Math.random() * 1200
    const randomY = Math.random() * 500

    const direction = {
      x: randomX - x,
      y: randomY - y,
    }

    const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y)
    if (magnitude > 0) {
      direction.x = (direction.x / magnitude) * mag
      direction.y = (direction.y / magnitude) * mag
    }

    return {
      x: x + direction.x,
      y: y + direction.y,
    }
  }

  const nextWord = (word: string, canvas: HTMLCanvasElement) => {
    // Create off-screen canvas for text rendering
    const offscreenCanvas = document.createElement("canvas")
    offscreenCanvas.width = canvas.width
    offscreenCanvas.height = canvas.height
    const offscreenCtx = offscreenCanvas.getContext("2d")
    if (!offscreenCtx) return

    // Dynamic font sizing: fit text perfectly within canvas width with comfortable margins
    let fontSize = 110
    offscreenCtx.font = `900 ${fontSize}px "Inter", "Helvetica Neue", Arial, sans-serif`
    while (offscreenCtx.measureText(word).width > canvas.width * 0.84 && fontSize > 36) {
      fontSize -= 3
      offscreenCtx.font = `900 ${fontSize}px "Inter", "Helvetica Neue", Arial, sans-serif`
    }

    // Draw text centered
    offscreenCtx.fillStyle = "white"
    offscreenCtx.textAlign = "center"
    offscreenCtx.textBaseline = "middle"
    offscreenCtx.letterSpacing = "4px"
    offscreenCtx.fillText(word, canvas.width / 2, canvas.height / 2)

    const imageData = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data

    // Cycle between the 3 selected colors:
    // 🔵 Cyan Blue -> 🟡 Warm Gold -> 🟣 Neon Violet
    const paletteList = colors && colors.length > 0 ? colors : CURATED_COLORS
    const newColor = paletteList[colorIndexRef.current % paletteList.length]
    colorIndexRef.current++

    const particles = particlesRef.current
    let particleIndex = 0

    // Collect coordinates
    const coordsIndexes: number[] = []
    for (let i = 0; i < pixels.length; i += pixelSteps * 4) {
      coordsIndexes.push(i)
    }

    // Shuffle coordinates for fluid natural assembly
    for (let i = coordsIndexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j], coordsIndexes[i]]
    }

    for (const coordIndex of coordsIndexes) {
      const pixelIndex = coordIndex
      const alpha = pixels[pixelIndex + 3]

      if (alpha > 50) {
        const x = (pixelIndex / 4) % canvas.width
        const y = Math.floor(pixelIndex / 4 / canvas.width)

        let particle: Particle

        if (particleIndex < particles.length) {
          particle = particles[particleIndex]
          particle.isKilled = false
          particleIndex++
        } else {
          particle = new Particle()

          const randomPos = generateRandomPos(canvas.width / 2, canvas.height / 2, (canvas.width + canvas.height) / 2)
          particle.pos.x = randomPos.x
          particle.pos.y = randomPos.y

          particle.maxSpeed = Math.random() * 5 + 4
          particle.maxForce = particle.maxSpeed * 0.05
          particle.particleSize = Math.random() * 5 + 4
          particle.colorBlendRate = 0.015
          particle.startColor = { ...newColor }
          particle.targetColor = { ...newColor }
          particle.colorWeight = 1.0

          particles.push(particle)
        }

        // Set color transition
        particle.startColor = {
          r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
          g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
          b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
        }
        particle.targetColor = newColor
        particle.colorWeight = 0

        particle.target.x = x
        particle.target.y = y
      }
    }

    // Kill remaining particles that aren't needed for this word
    for (let i = particleIndex; i < particles.length; i++) {
      particles[i].kill(canvas.width, canvas.height)
    }
  }

  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const particles = particlesRef.current

    // Transparent clear with subtle motion persistence
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Interactive mouse repulsion
    const mouseX = mouseRef.current.x
    const mouseY = mouseRef.current.y
    const isInteracting = mouseRef.current.isHovering

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i]

      // Mouse repulsion physics
      if (isInteracting) {
        const dx = particle.pos.x - mouseX
        const dy = particle.pos.y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 85 && dist > 0) {
          const force = (85 - dist) / 85
          particle.acc.x += (dx / dist) * force * 1.2
          particle.acc.y += (dy / dist) * force * 1.2
        }
      }

      particle.move()
      particle.draw(ctx, drawAsPoints)

      // Remove dead particles that are out of bounds
      if (particle.isKilled) {
        if (
          particle.pos.x < 0 ||
          particle.pos.x > canvas.width ||
          particle.pos.y < 0 ||
          particle.pos.y > canvas.height
        ) {
          particles.splice(i, 1)
        }
      }
    }

    // Handle click / right-click interaction to disperse particles
    if (mouseRef.current.isPressed) {
      particles.forEach((particle) => {
        const distance = Math.sqrt(
          Math.pow(particle.pos.x - mouseX, 2) + Math.pow(particle.pos.y - mouseY, 2)
        )
        if (distance < 80) {
          particle.kill(canvas.width, canvas.height)
        }
      })
    }

    // Auto-advance words and update colors every interval (~4 seconds)
    frameCountRef.current++
    if (frameCountRef.current % interval === 0) {
      wordIndexRef.current = (wordIndexRef.current + 1) % words.length
      nextWord(words[wordIndexRef.current], canvas)
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = 1200
    canvas.height = 360

    // Initialize with first word
    nextWord(words[0], canvas)

    // Start animation
    animate()

    // Mouse event handlers
    const updateMousePos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      mouseRef.current.x = (e.clientX - rect.left) * scaleX
      mouseRef.current.y = (e.clientY - rect.top) * scaleY
    }

    const handleMouseMove = (e: MouseEvent) => {
      updateMousePos(e)
      mouseRef.current.isHovering = true
    }

    const handleMouseDown = (e: MouseEvent) => {
      updateMousePos(e)
      mouseRef.current.isPressed = true
      mouseRef.current.isRightClick = e.button === 2
    }

    const handleMouseUp = () => {
      mouseRef.current.isPressed = false
      mouseRef.current.isRightClick = false
    }

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    const handleMouseLeave = () => {
      mouseRef.current.isHovering = false
      mouseRef.current.isPressed = false
      mouseRef.current.isRightClick = false
      mouseRef.current.x = -1000
      mouseRef.current.y = -1000
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height
        mouseRef.current.x = (e.touches[0].clientX - rect.left) * scaleX
        mouseRef.current.y = (e.touches[0].clientY - rect.top) * scaleY
        mouseRef.current.isHovering = true
      }
    }

    const handleTouchEnd = () => {
      mouseRef.current.isHovering = false
      mouseRef.current.isPressed = false
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("contextmenu", handleContextMenu)
    canvas.addEventListener("mouseleave", handleMouseLeave)
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true })
    canvas.addEventListener("touchend", handleTouchEnd)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mouseup", handleMouseUp)
      canvas.removeEventListener("contextmenu", handleContextMenu)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("touchend", handleTouchEnd)
    }
  }, [words, interval, colors])

  return (
    <div
      className={`relative w-full flex flex-col items-center justify-center ${className}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-auto max-w-full block select-none pointer-events-auto"
        style={{ aspectRatio: "1200 / 360" }}
      />
      {showDescription && (
        <div className="mt-4 text-white text-sm text-center max-w-md">
          <p className="mb-2">Particle Text Effect</p>
          <p className="text-gray-400 text-xs">
            Move mouse over letters to disperse particles • Words change automatically every 4 seconds
          </p>
        </div>
      )}
    </div>
  )
}

export default ParticleTextEffect
