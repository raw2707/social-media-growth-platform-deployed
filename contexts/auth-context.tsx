"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import supabase from '@/lib/supabase'

interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (data: SignupData) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

interface SignupData {
  email: string
  password: string
  firstName: string
  lastName: string
  socialHandles: {
    instagram: string
    tiktok: string
    youtube: string
    twitter: string
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      console.log('🔄 Signing in with Supabase auth...')
      
      // Real Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('❌ Supabase auth error:', error.message)
        return false
      }

      if (data.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email || email,
          first_name: data.user.user_metadata?.first_name || email.split('@')[0],
          last_name: data.user.user_metadata?.last_name || 'User'
        }

        setUser(userData)
        localStorage.setItem('currentUser', JSON.stringify(userData))
        
        console.log('✅ Logged in successfully with Supabase!')
        return true
      }

      return false
    } catch (error: any) {
      console.error('❌ Login error:', error.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (data: SignupData): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      console.log('🔄 Creating account with Supabase...')
      
      // Real Supabase authentication
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName
          }
        }
      })

      if (error) {
        console.error('❌ Supabase signup error:', error.message)
        return false
      }

      if (authData.user) {
        const userData: User = {
          id: authData.user.id,
          email: authData.user.email || data.email,
          first_name: data.firstName,
          last_name: data.lastName
        }

        setUser(userData)
        localStorage.setItem('currentUser', JSON.stringify(userData))
        
        console.log('✅ Account created successfully with Supabase!')
        return true
      }

      return false
    } catch (error: any) {
      console.error('❌ Signup error:', error.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      localStorage.removeItem('currentUser')
      console.log('👋 Logged out successfully from Supabase')
    } catch (error: any) {
      console.error('❌ Logout error:', error.message)
      // Still clear local state even if Supabase logout fails
      setUser(null)
      localStorage.removeItem('currentUser')
    }
  }

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 