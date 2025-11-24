import React from 'react'
import { Filter, X } from 'lucide-react'

const FilterPanel = ({ filters, onFilterChange, onClearFilters }) => {
  const languages = [
    'javascript', 'python', 'typescript', 'java', 'cpp', 'c', 'csharp',
    'php', 'ruby', 'go', 'rust', 'swift', 'html', 'css', 'sql', 'json',
    'xml', 'yaml', 'markdown'
  ]

  const popularTags = [
    'react', 'nodejs', 'express', 'mongodb', 'api', 'authentication',
    'algorithm', 'database', 'frontend', 'backend', 'mobile', 'web'
  ]

  const hasActiveFilters = 
    filters.language || 
    filters.tags.length > 0 || 
    filters.visibility !== 'public'

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center space-x-2">
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Language Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-3">Language</h4>
        <select
          value={filters.language}
          onChange={(e) => onFilterChange({ language: e.target.value })}
          className="w-full input-field"
        >
          <option value="">All Languages</option>
          {languages.map(lang => (
            <option key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Tags Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-3">Popular Tags</h4>
        <div className="flex flex-wrap gap-2">
          {popularTags.map(tag => (
            <button
              key={tag}
              onClick={() => {
                const newTags = filters.tags.includes(tag)
                  ? filters.tags.filter(t => t !== tag)
                  : [...filters.tags, tag]
                onFilterChange({ tags: newTags })
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.tags.includes(tag)
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Visibility Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-3">Visibility</h4>
        <div className="space-y-2">
          {[
            { value: 'public', label: 'Public' },
            { value: 'private', label: 'Private' },
            { value: 'unlisted', label: 'Unlisted' }
          ].map(option => (
            <label key={option.value} className="flex items-center space-x-3">
              <input
                type="radio"
                name="visibility"
                value={option.value}
                checked={filters.visibility === option.value}
                onChange={(e) => onFilterChange({ visibility: e.target.value })}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-slate-700 dark:text-slate-300">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div>
          <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-3">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {filters.language && (
              <span className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                Language: {filters.language}
                <button
                  onClick={() => onFilterChange({ language: '' })}
                  className="ml-2 hover:text-primary-900 dark:hover:text-primary-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
              >
                Tag: {tag}
                <button
                  onClick={() => onFilterChange({ tags: filters.tags.filter(t => t !== tag) })}
                  className="ml-2 hover:text-primary-900 dark:hover:text-primary-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.visibility !== 'public' && (
              <span className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                Visibility: {filters.visibility}
                <button
                  onClick={() => onFilterChange({ visibility: 'public' })}
                  className="ml-2 hover:text-primary-900 dark:hover:text-primary-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterPanel