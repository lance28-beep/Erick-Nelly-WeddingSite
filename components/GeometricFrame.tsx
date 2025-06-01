import * as React from "react"
import { cn } from "@/lib/utils"

interface GeometricFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  variant?: "default" | "elegant" | "subtle"
}

export function GeometricFrame({ 
  children, 
  className, 
  variant = "default",
  ...props 
}: GeometricFrameProps) {
  const frameStyles = {
    default: {
      outer: "border-2 border-[#800020]/30 transform rotate-1",
      middle: "border border-[#800020]/20 transform -rotate-1",
      inner: "border border-[#800020]/10 transform rotate-1"
    },
    elegant: {
      outer: "border-2 border-[#800020]/40 transform rotate-1 shadow-lg",
      middle: "border border-[#800020]/30 transform -rotate-1",
      inner: "border border-[#800020]/20 transform rotate-1"
    },
    subtle: {
      outer: "border border-[#800020]/20 transform rotate-0.5",
      middle: "border border-[#800020]/15 transform -rotate-0.5",
      inner: "border border-[#800020]/10 transform rotate-0.5"
    }
  }

  const selectedStyle = frameStyles[variant]

  return (
    <div className={cn("relative group", className)} {...props}>
      {/* Outer frame */}
      <div className={cn(
        "absolute inset-0 transition-all duration-300",
        selectedStyle.outer,
        "group-hover:border-[#800020]/40 group-hover:shadow-md"
      )}></div>
      {/* Middle frame */}
      <div className={cn(
        "absolute inset-2 transition-all duration-300",
        selectedStyle.middle,
        "group-hover:border-[#800020]/30"
      )}></div>
      {/* Inner frame */}
      <div className={cn(
        "absolute inset-4 transition-all duration-300",
        selectedStyle.inner,
        "group-hover:border-[#800020]/20"
      )}></div>
      {/* Content */}
      <div className="relative z-10">
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && typeof child.props.children === 'string') {
            return React.cloneElement(child, {
              className: cn(child.props.className, "great-vibes-regular")
            });
          }
          return child;
        })}
      </div>
    </div>
  )
} 