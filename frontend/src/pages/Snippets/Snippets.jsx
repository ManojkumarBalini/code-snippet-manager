import React, { useEffect, useState } from 'react'
import { useSnippets } from '../../context/SnippetContext'
import SearchBar from '../../components/search/SearchBar/SearchBar.jsx'
import FilterPanel from '../../components/search/FilterPanel/FilterPanel.jsx'
import SnippetCard from '../../components/Snippets/SnippetCard/SnippetCard.jsx'
import { Code2, Filter, Grid, List } from 'lucide-react'

const Snippets = () => {
  const { snippets, loading, fetchSnippets } = useSnippets()
  const [filters, setFilters] = useState({
    search: '',
    language: '',
    tags: [],
    author: '',
    visibility: 'public'
  })
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchSnippets(filters)
  }, [filters])

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }))
  }

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      language: '',
      tags: [],
      author: '',
      visibility: 'public'
    })
  }

  if (loading && snippets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    // CHANGED: Added px-4 to match header padding
    <div className="max-w-7xl mx-auto px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">
            Explore Snippets
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Discover and learn from code snippets shared by developers worldwide
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-slate-700 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white dark:bg-slate-700 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="lg:w-80">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </div>
        )}

        {/* Snippets Grid/List */}
        <div className="flex-1">
          {snippets.length > 0 ? (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {snippets.map(snippet => (
                <SnippetCard 
                  key={snippet._id} 
                  snippet={snippet} 
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <Code2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-600 dark:text-slate-400 mb-2">
                {filters.search || filters.language || filters.tags.length > 0
                  ? 'No snippets found'
                  : 'No snippets yet'
                }
              </h3>
              <p className="text-slate-500 dark:text-slate-500 mb-6 max-w-md mx-auto">
                {filters.search || filters.language || filters.tags.length > 0
                  ? 'Try adjusting your search criteria or filters'
                  : 'Be the first to share a code snippet!'
                }
              </p>
              {(filters.search || filters.language || filters.tags.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Snippets
