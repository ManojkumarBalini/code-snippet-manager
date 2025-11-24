import { useContext } from 'react'
import { SnippetContext } from '../context/SnippetContext'

export const useSnippets = () => {
  const context = useContext(SnippetContext)
  
  if (!context) {
    throw new Error('useSnippets must be used within a SnippetProvider')
  }
  
  return context
}

// Additional snippet-related hooks
export const useSnippet = (id) => {
  const { snippets, getSnippetById } = useSnippets()
  
  const snippet = snippets.find(s => s._id === id) || null
  
  return {
    snippet,
    getSnippet: () => getSnippetById(id)
  }
}

export const useSnippetActions = () => {
  const { createSnippet, updateSnippet, deleteSnippet, forkSnippet, toggleStar } = useSnippets()
  
  return {
    createSnippet,
    updateSnippet,
    deleteSnippet,
    forkSnippet,
    toggleStar
  }
}

export const useSnippetSearch = () => {
  const { snippets, fetchSnippets, loading } = useSnippets()
  
  const searchSnippets = (filters = {}) => {
    return fetchSnippets(filters)
  }
  
  return {
    snippets,
    searchSnippets,
    loading
  }
}

export const useUserSnippets = () => {
  const { userSnippets, fetchUserSnippets, loading } = useSnippets()
  
  return {
    userSnippets,
    fetchUserSnippets,
    loading
  }
}