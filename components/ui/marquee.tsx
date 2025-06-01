"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  direction?: "left" | "right" | "up" | "down"
  speed?: number
  pauseOnHover?: boolean
  vertical?: boolean
  className?: string
  gradient?: boolean
  gradientColor?: string
  gradientWidth?: string
}

export function Marquee({
  children,
  direction = "left",
  speed = 20,
  pauseOnHover = true,
  vertical = false,
  className,
  gradient = true,
  gradientColor = "from-white via-transparent to-white",
  gradientWidth = "100px",
  ...props
}: MarqueeProps) {
  const [isPaused, setIsPaused] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [contentWidth, setContentWidth] = React.useState(0)

  React.useEffect(() => {
    if (containerRef.current) {
      const width = vertical 
        ? containerRef.current.scrollHeight 
        : containerRef.current.scrollWidth
      setContentWidth(width)
    }
  }, [children, vertical])

  const animationDuration = React.useMemo(() => {
    return `${speed}s`
  }, [speed])

  const containerClasses = cn(
    "relative flex w-full overflow-hidden",
    vertical ? "flex-col" : "flex-row",
    className
  )

  const contentClasses = cn(
    "flex whitespace-nowrap",
    vertical ? "flex-col" : "flex-row",
    direction === "left" && "animate-marquee-left",
    direction === "right" && "animate-marquee-right",
    direction === "up" && "animate-marquee-up",
    direction === "down" && "animate-marquee-down",
    isPaused && "animation-pause"
  )

  const gradientClasses = cn(
    "absolute inset-0 pointer-events-none z-10",
    vertical ? "bg-gradient-to-b" : "bg-gradient-to-r",
    gradientColor
  )

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      {...props}
    >
      {gradient && (
        <>
          <div className={cn(gradientClasses, "left-0")} style={{ width: gradientWidth }} />
          <div className={cn(gradientClasses, "right-0")} style={{ width: gradientWidth }} />
        </>
      )}
      <div
        className={contentClasses}
        style={{
          animationDuration,
          width: vertical ? "100%" : `${contentWidth}px`,
        }}
      >
        {children}
      </div>
      <div
        className={contentClasses}
        style={{
          animationDuration,
          width: vertical ? "100%" : `${contentWidth}px`,
        }}
      >
        {children}
      </div>
    </div>
  )
} 