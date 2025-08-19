'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  email: string
  displayName: string
  socialPins: number
  pinPacks: number
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  updateSocialPins: (newPins: number) => void
  updatePinPacks: (newPacks: number) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('authToken')
    if (token) {
      verifyToken(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        localStorage.removeItem('authToken')
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      localStorage.removeItem('authToken')
    } finally {
      setIsLoading(false)
    }
  }

  const login = (userData: User) => {
    setUser(userData)
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('authToken')
  }

  const updateSocialPins = (newPins: number) => {
    if (user) {
      setUser({ ...user, socialPins: newPins })
    }
  }

  const updatePinPacks = (newPacks: number) => {
    if (user) {
      setUser({ ...user, pinPacks: newPacks })
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      updateSocialPins,
      updatePinPacks,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
