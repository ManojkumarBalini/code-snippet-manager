import React, { createContext, useState, useContext } from 'react'
import { snippetAPI } from '../services/snippets.js'
import toast from 'react-hot-toast'

const SnippetContext = createContext()

export const useSnippets = () => {
  const context = useContext(SnippetContext)
  if (!context) {
    throw new Error('useSnippets must be used within a SnippetProvider')
  }
  return context
}

export const SnippetProvider = ({ children }) => {
  const [snippets, setSnippets] = useState([])
  const [userSnippets, setUserSnippets] = useState([])
  const [currentSnippet, setCurrentSnippet] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchSnippets = async (filters = {}) => {
    setLoading(true)
    try {
      const response = await snippetAPI.getSnippets(filters)
      if (response.data.success) {
        setSnippets(response.data.data.snippets || [])
      } else {
        console.error('Failed to fetch snippets:', response.data.message)
      }
    } catch (error) {
      console.error('Error fetching snippets:', error)
      if (Object.keys(filters).length > 0) {
        toast.error('Failed to fetch snippets')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchUserSnippets = async () => {
    setLoading(true)
    try {
      const response = await snippetAPI.getUserSnippets()
      if (response.data.success) {
        setUserSnippets(response.data.data.snippets || [])
      }
    } catch (error) {
      console.error('Error fetching user snippets:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSnippetById = async (id) => {
    try {
      const response = await snippetAPI.getSnippet(id)
      if (response.data.success) {
        const snippet = response.data.data.snippet
        setCurrentSnippet(snippet)
        return snippet
      } else {
        toast.error(response.data.message || 'Failed to fetch snippet')
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('Error fetching snippet:', error)
      toast.error('Failed to fetch snippet')
      throw error
    }
  }

  const createSnippet = async (snippetData) => {
    try {
      console.log('🔄 Creating snippet with data:', snippetData)
      const response = await snippetAPI.createSnippet(snippetData)
      
      if (response.data.success) {
        const newSnippet = response.data.data.snippet
        console.log('✅ Snippet created successfully:', newSnippet)
        
        // Update both snippets and userSnippets
        setSnippets(prev => [newSnippet, ...prev])
        setUserSnippets(prev => [newSnippet, ...prev])
        
        toast.success('Snippet created successfully!')
        return newSnippet
      } else {
        console.error('❌ Failed to create snippet:', response.data.message)
        toast.error(response.data.message || 'Failed to create snippet')
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('❌ Error creating snippet:', error)
      const message = error.response?.data?.message || error.response?.data?.error || 'Failed to create snippet'
      toast.error(message)
      throw error
    }
  }

  const updateSnippet = async (id, snippetData) => {
    try {
      const response = await snippetAPI.updateSnippet(id, snippetData)
      if (response.data.success) {
        const updatedSnippet = response.data.data.snippet
        
        setSnippets(prev => prev.map(s => 
          s._id === id ? updatedSnippet : s
        ))
        setUserSnippets(prev => prev.map(s => 
          s._id === id ? updatedSnippet : s
        ))
        
        toast.success('Snippet updated successfully!')
        return updatedSnippet
      } else {
        toast.error(response.data.message || 'Failed to update snippet')
        throw new Error(response.data.message)
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update snippet'
      toast.error(message)
      throw error
    }
  }

  const deleteSnippet = async (id) => {
    try {
      const response = await snippetAPI.deleteSnippet(id)
      if (response.data.success) {
        setSnippets(prev => prev.filter(s => s._id !== id))
        setUserSnippets(prev => prev.filter(s => s._id !== id))
        toast.success('Snippet deleted successfully!')
      } else {
        toast.error(response.data.message || 'Failed to delete snippet')
        throw new Error(response.data.message)
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete snippet'
      toast.error(message)
      throw error
    }
  }

  const forkSnippet = async (id) => {
    try {
      const response = await snippetAPI.forkSnippet(id)
      if (response.data.success) {
        const forkedSnippet = response.data.data.snippet
        
        setSnippets(prev => [forkedSnippet, ...prev])
        setUserSnippets(prev => [forkedSnippet, ...prev])
        
        toast.success('Snippet forked successfully!')
        return forkedSnippet
      } else {
        toast.error(response.data.message || 'Failed to fork snippet')
        throw new Error(response.data.message)
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fork snippet'
      toast.error(message)
      throw error
    }
  }

  const toggleStar = async (id) => {
    try {
      const response = await snippetAPI.toggleStar(id)
      if (response.data.success) {
        const updateSnippetInArray = (arr) => arr.map(s => 
          s._id === id ? { 
            ...s, 
            stars: response.data.data.starred 
              ? [...(s.stars || []), 'current-user'] 
              : (s.stars || []).filter(star => star !== 'current-user'),
            starCount: response.data.data.starred 
              ? (s.starCount || s.stars?.length || 0) + 1
              : Math.max(0, (s.starCount || s.stars?.length || 0) - 1)
          } : s
        )
        
        setSnippets(updateSnippetInArray)
        setUserSnippets(updateSnippetInArray)
        
        toast.success(response.data.data.starred ? 'Snippet starred!' : 'Star removed')
      } else {
        toast.error(response.data.message || 'Failed to toggle star')
        throw new Error(response.data.message)
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to toggle star'
      toast.error(message)
      throw error
    }
  }

  const value = {
    snippets,
    userSnippets,
    currentSnippet,
    loading,
    fetchSnippets,
    fetchUserSnippets,
    getSnippetById,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    forkSnippet,
    toggleStar
  }

  return (
    <SnippetContext.Provider value={value}>
      {children}
    </SnippetContext.Provider>
  )
}