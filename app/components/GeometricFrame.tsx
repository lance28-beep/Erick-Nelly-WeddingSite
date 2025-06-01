import type { ReactNode } from "react"

interface GeometricFrameProps {
  children: ReactNode
  className?: string
}

export function GeometricFrame({ children, className = "" }: GeometricFrameProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 border-2 border-yellow-400/30 transform rotate-1"></div>
      <div className="absolute inset-2 border border-yellow-400/20 transform -rotate-1"></div>
      <div className="relative z-10">{children}</div>
    </div>
  )
} 