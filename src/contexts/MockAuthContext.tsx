'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/types/app.types'
import { MockApiService } from '@/lib/mockApi'

interface MockAuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: string }>
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined)

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('mockUser')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem('mockUser')
      }
    }
    setLoading(false)
  }, [])

  async function signIn(email: string, password: string) {
    try {
      setLoading(true)
      const authenticatedUser = await MockApiService.authenticate(email, password)
      
      if (authenticatedUser) {
        setUser(authenticatedUser)
        localStorage.setItem('mockUser', JSON.stringify(authenticatedUser))
        return {}
      } else {
        return { error: 'Geçersiz e-posta veya şifre' }
      }
    } catch (error) {
      return { error: 'Giriş yapılırken bir hata oluştu' }
    } finally {
      setLoading(false)
    }
  }

  async function signOut() {
    try {
      setUser(null)
      localStorage.removeItem('mockUser')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  async function resetPassword(email: string) {
    try {
      // Simulate password reset
      await new Promise(resolve => setTimeout(resolve, 1000))
      return {}
    } catch (error) {
      return { error: 'Şifre sıfırlama e-postası gönderilirken hata oluştu' }
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signOut,
    resetPassword,
  }

  return <MockAuthContext.Provider value={value}>{children}</MockAuthContext.Provider>
}

export function useMockAuth() {
  const context = useContext(MockAuthContext)
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider')
  }
  return context
}
