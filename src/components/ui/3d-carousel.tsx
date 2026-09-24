"use client"

import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { ArrowUpRight, ChevronLeft, ChevronRight, RotateCw } from "lucide-react"

export interface ThreeDCarouselItem {
  id: string
  title: string
  category: string
  cover: string
  client?: string
}

export interface ThreeDPhotoCarouselProps {
  images?: string[]
  items?: ThreeDCarouselItem[]
  onItemClick?: (item: ThreeDCarouselItem) => void
  autoRotate?: boolean
}

const defaultKeywords = [
  "branding",
  "identity",
  "packaging",
  "luxury",
  "modern",
  "typography",
  "editorial",
  "creative",
  "minimal",
  "studio",
]

export function ThreeDPhotoCarousel({
  images,
  items,
  onItemClick,
  autoRotate = true,
}: ThreeDPhotoCarouselProps) {
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const rotationRef = useRef(0)
  const startXRef = useRef(0)
  const startRotationRef = useRef(0)
  const velocityRef = useRef(0)
  const lastXRef = useRef(0)
  const lastTimeRef = useRef(0)
  const dragDistanceRef = useRef(0)
  const animFrameRef = useRef<number | null>(null)

  // Track window size for responsive cylinder radius & card dimensions
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Build the list of cards
  const displayItems = useMemo(() => {
    if (items && items.length > 0) {
      let list = [...items]
      // Ensure at least 8 cards so cylinder has full 3D body
      while (list.length < 8) {
        list = [...list, ...items]
      }
      return list
    }

    if (images && images.length > 0) {
      return images.map((src, i) => ({
        id: `img-${i}`,
        title: `Visual Project ${i + 1}`,
        category: "Creative Work",
        cover: src,
      }))
    }

    return defaultKeywords.map((k, i) => ({
      id: `sample-${i}`,
      title: `${k.charAt(0).toUpperCase() + k.slice(1)} Identity`,
      category: "Branding",
      cover: `https://picsum.photos/500/600?${k}`,
    }))
  }, [items, images])

  const faceCount = displayItems.length
  const stepAngle = 360 / faceCount

  // Dimensions - refined compact proportions so multiple cards curve gracefully in view
  const cardWidth = isMobile ? 120 : 175
  const cardHeight = isMobile ? 165 : 240
  // Optimal radius so cards form an unclipped circle with pleasant spacing
  const radius = Math.round(
    Math.max(220, (cardWidth / 2) / Math.tan(Math.PI / faceCount) + (isMobile ? 16 : 38))
  )

  // Keep rotation state synchronized with ref
  const updateRotation = useCallback((val: number) => {
    rotationRef.current = val
    setRotation(val)
  }, [])

  // Ambient Auto-Rotation Loop
  useEffect(() => {
    let lastStamp = performance.now()

    const loop = (now: number) => {
      const delta = (now - lastStamp) / 1000
      lastStamp = now

      if (!isDragging) {
        // If there is residual velocity from drag, apply friction
        if (Math.abs(velocityRef.current) > 0.05) {
          updateRotation(rotationRef.current + velocityRef.current)
          velocityRef.current *= 0.92
        } else if (autoRotate && !isHovered) {
          // Slow ambient drift
          updateRotation(rotationRef.current - delta * 9)
        }
      }

      animFrameRef.current = requestAnimationFrame(loop)
    }

    animFrameRef.current = requestAnimationFrame(loop)

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [isDragging, isHovered, autoRotate, updateRotation])

  // Pointer drag handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true)
    startXRef.current = e.clientX
    lastXRef.current = e.clientX
    lastTimeRef.current = performance.now()
    startRotationRef.current = rotationRef.current
    dragDistanceRef.current = 0
    velocityRef.current = 0

    // Capture pointer so drag works smoothly even outside container
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {}
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return

    const now = performance.now()
    const dt = Math.max(1, now - lastTimeRef.current)
    const currentX = e.clientX
    const dx = currentX - lastXRef.current
    const totalDist = Math.abs(currentX - startXRef.current)
    dragDistanceRef.current = totalDist

    // Calculate rotational movement
    const sensitivity = isMobile ? 0.32 : 0.24
    const newRot = startRotationRef.current + (currentX - startXRef.current) * sensitivity
    updateRotation(newRot)

    // Estimate velocity for inertial release
    velocityRef.current = (dx / dt) * 5
    lastXRef.current = currentX
    lastTimeRef.current = now
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    setIsDragging(false)
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {}
  }

  // Next / Previous step buttons
  const rotateNext = () => {
    velocityRef.current = 0
    updateRotation(Math.round(rotationRef.current / stepAngle) * stepAngle - stepAngle)
  }

  const rotatePrev = () => {
    velocityRef.current = 0
    updateRotation(Math.round(rotationRef.current / stepAngle) * stepAngle + stepAngle)
  }

  return (
    <div
      className="devopus-3d-wrapper"
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Perspective Stage */}
      <div
        className="devopus-3d-stage"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Rotating Cylinder Pivot */}
        <div
          className="devopus-3d-cylinder"
          style={{
            transform: `rotateY(${rotation}deg)`,
          }}
        >
          {displayItems.map((item, i) => {
            const angle = i * stepAngle

            return (
              <div
                key={`${item.id}-${i}`}
                className="devopus-3d-card"
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`,
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={(e) => {
                  // Only open if the user clicked, not dragged
                  if (dragDistanceRef.current > 8) {
                    e.stopPropagation()
                    return
                  }
                  if (onItemClick) {
                    onItemClick(item)
                  }
                }}
              >
                <img
                  src={item.cover}
                  alt={item.title}
                  className="devopus-3d-card-img"
                  loading="eager"
                  decoding="async"
                  draggable={false}
                />

                <div className="devopus-3d-card-overlay" />

                <div className="devopus-3d-card-info">
                  <span className="devopus-3d-card-cat">{item.category}</span>
                  <h4 className="devopus-3d-card-title">{item.title}</h4>
                  <div className="devopus-3d-card-btn">
                    <span>View Case Study</span>
                    <ArrowUpRight size={11} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Floating 3D Navigation Controls */}
      <div className="devopus-3d-controls">
        <button
          type="button"
          className="devopus-3d-ctrl-btn"
          onClick={rotatePrev}
          aria-label="Previous project in 3D reel"
          title="Previous project"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="devopus-3d-ctrl-text">
          <RotateCw size={12} className={!isDragging && !isHovered ? "spin-subtle" : ""} />
          <span>Drag horizontally or use arrows to spin</span>
        </span>

        <button
          type="button"
          className="devopus-3d-ctrl-btn"
          onClick={rotateNext}
          aria-label="Next project in 3D reel"
          title="Next project"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
