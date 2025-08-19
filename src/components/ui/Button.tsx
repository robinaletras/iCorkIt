import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  children: React.ReactNode
}

export function Button({ 
  className, 
  variant = 'default', 
  size = 'default', 
  children, 
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    default: 'bg-amber-600 text-white hover:bg-amber-700 hover:shadow-lg transform hover:scale-105',
    destructive: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg transform hover:scale-105',
    outline: 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:text-gray-900 hover:border-amber-400 hover:shadow-lg transform hover:scale-105',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-lg transform hover:scale-105',
    ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md transform hover:scale-105',
    link: 'text-amber-600 underline-offset-4 hover:underline hover:text-amber-700'
  }
  
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10'
  }

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
