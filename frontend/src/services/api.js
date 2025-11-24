import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data || '')
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`, response.data)
    return response
  },
  (error) => {
    const { status, data } = error.response || {}
    
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status,
      message: data?.message,
      error: error.message
    })

    switch (status) {
      case 401:
        localStorage.removeItem('token')
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
        break
      case 403:
        toast.error('Access denied. You do not have permission to perform this action.')
        break
      case 404:
        // Don't show toast for 404, it's handled in components
        break
      case 422:
        if (data.errors) {
          Object.values(data.errors).forEach(errorMessage => {
            toast.error(errorMessage)
          })
        } else {
          toast.error(data.message || 'Validation failed')
        }
        break
      case 500:
        toast.error(data?.message || 'Server error. Please try again later.')
        break
      default:
        if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
          toast.error('Network error. Please check your connection and try again.')
        } else if (data?.message) {
          toast.error(data.message)
        }
    }
    
    return Promise.reject(error)
  }
)

export default api