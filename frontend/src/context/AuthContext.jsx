import React, { createContext, useState, useContext, useEffect } from 'react'
import { authAPI } from '../services/auth.js'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await authAPI.getMe()
        if (response.data.success) {
          setUser(response.data.data.user)
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('token')
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password })
      if (response.data.success) {
        const { user, token } = response.data.data

        localStorage.setItem('token', token)
        setUser(user)
        setIsAuthenticated(true)
        
        toast.success('Welcome back!')
        return { success: true }
      } else {
        toast.error(response.data.message || 'Login failed')
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      if (response.data.success) {
        const { user, token } = response.data.data

        localStorage.setItem('token', token)
        setUser(user)
        setIsAuthenticated(true)
        
        toast.success('Account created successfully!')
        return { success: true }
      } else {
        toast.error(response.data.message || 'Registration failed')
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setIsAuthenticated(false)
    toast.success('Logged out successfully')
  }

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }))
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}