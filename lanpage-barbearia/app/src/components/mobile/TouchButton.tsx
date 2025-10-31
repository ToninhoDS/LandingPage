import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  loading?: boolean
  hapticFeedback?: boolean
  children: React.ReactNode
}

export default function TouchButton({
  variant = 'default',
  size = 'md',
  fullWidth = false,
  loading = false,
  hapticFeedback = true,
  className,
  children,
  onClick,
  disabled,
  ...props
}: TouchButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  const handleTouchStart = () => {
    setIsPressed(true)
    
    // Haptic feedback for supported devices
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }
  }

  const handleTouchEnd = () => {
    setIsPressed(false)
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return
    onClick?.(e)
  }

  const baseClasses = cn(
    "relative inline-flex items-center justify-center font-medium transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "active:scale-95 select-none touch-manipulation",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    {
      // Pressed state
      "scale-95": isPressed,
      
      // Full width
      "w-full": fullWidth,
      
      // Loading state
      "cursor-wait": loading,
    }
  )

  const variantClasses = {
    default: "bg-background text-foreground border border-input hover:bg-accent hover:text-accent-foreground focus:ring-ring",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary shadow-lg",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:ring-ring",
    ghost: "hover:bg-accent hover:text-accent-foreground focus:ring-ring",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive shadow-lg",
  }

  const sizeClasses = {
    sm: "h-9 px-3 text-sm rounded-md",
    md: "h-12 px-4 text-base rounded-lg",
    lg: "h-14 px-6 text-lg rounded-xl",
    xl: "h-16 px-8 text-xl rounded-2xl",
  }

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <span className={cn("flex items-center space-x-2", loading && "opacity-0")}>
        {children}
      </span>
    </button>
  )
}