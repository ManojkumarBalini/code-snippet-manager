import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

// Additional auth-related hooks
export const useAuthGuard = (redirectTo = '/login') => {
  const { isAuthenticated, loading } = useAuth()
  
  return {
    isAuthenticated,
    loading,
    requiresAuth: !isAuthenticated && !loading,
    redirectTo
  }
}

export const useUser = () => {
  const { user } = useAuth()
  return user
}

export const useAuthStatus = () => {
  const { isAuthenticated, loading } = useAuth()
  return { isAuthenticated, loading }
}