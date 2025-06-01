"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion"

interface StackProps {
  cardsData: { id: number; img: string }[]
  cardDimensions: { width: number; height: number }
  sensitivity?: number
  sendToBackOnClick?: boolean
  animationConfig?: {
    stiffness: number
    damping: number
  }
}

export default function Stack({
  cardsData,
  cardDimensions,
  sensitivity = 150,
  sendToBackOnClick = true,
  animationConfig = { stiffness: 200, damping: 25 },
}: StackProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Motion values for drag and spring animations
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-sensitivity, sensitivity], [30, -30])
  const rotateY = useTransform(x, [-sensitivity, sensitivity], [-30, 30])

  // Spring configuration for smooth animations
  const springConfig = {
    stiffness: animationConfig.stiffness,
    damping: animationConfig.damping,
  }

  // Apply spring physics to motion values
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)
  const springRotateX = useSpring(rotateX, springConfig)
  const springRotateY = useSpring(rotateY, springConfig)

  // Handle mouse/touch movement
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current || !isHovered) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    let clientX: number
    let clientY: number

    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    x.set(clientX - centerX)
    y.set(clientY - centerY)
  }

  // Reset position when mouse/touch leaves
  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  // Handle card click
  const handleCardClick = (index: number) => {
    if (sendToBackOnClick) {
      setActiveIndex((prev) => (prev === index ? -1 : index))
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseLeave}
    >
      {cardsData.map((card, index) => {
        const isActive = index === activeIndex
        const zIndex = isActive ? cardsData.length : cardsData.length - index

        return (
          <motion.div
            key={card.id}
            className="absolute w-full h-full cursor-pointer"
            style={{
              zIndex,
              x: isActive ? springX : 0,
              y: isActive ? springY : 0,
              rotateX: isActive ? springRotateX : 0,
              rotateY: isActive ? springRotateY : 0,
              scale: isActive ? 1.05 : 1,
            }}
            whileHover={{ scale: isActive ? 1.05 : 1.02 }}
            transition={{ type: "spring", ...springConfig }}
            onClick={() => handleCardClick(index)}
          >
            <div
              className="w-full h-full rounded-2xl overflow-hidden shadow-lg"
              style={{
                transform: `perspective(1000px) rotateX(${isActive ? springRotateX : 0}deg) rotateY(${isActive ? springRotateY : 0}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              <img
                src={card.img}
                alt={`Card ${index + 1}`}
                className="w-full h-full object-cover"
                style={{
                  transform: "translateZ(20px)",
                }}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
} 