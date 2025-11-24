import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { useSnippets } from '../../../context/SnippetContext'
import { 
  Star, 
  GitFork, 
  Eye, 
  MoreVertical, 
  Edit3, 
  Trash2,
  Lock,
  Globe
} from 'lucide-react'
import toast from 'react-hot-toast'

const SnippetCard = ({ snippet, viewMode = 'grid' }) => {
  const [showMenu, setShowMenu] = useState(false)
  const { user } = useAuth()
  const { deleteSnippet, toggleStar } = useSnippets()

  const isOwner = user && snippet.author._id === user.id

  const handleStar = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast.error('Please login to star snippets')
      return
    }
    await toggleStar(snippet._id)
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      await deleteSnippet(snippet._id)
    }
    setShowMenu(false)
  }

  const getLanguageColor = (language) => {
    const colors = {
      javascript: 'bg-yellow-500',
      python: 'bg-blue-500',
      typescript: 'bg-blue-600',
      java: 'bg-red-500',
      cpp: 'bg-pink-500',
      c: 'bg-gray-500',
      csharp: 'bg-green-600',
      php: 'bg-purple-500',
      ruby: 'bg-red-600',
      go: 'bg-cyan-500',
      rust: 'bg-orange-500',
      swift: 'bg-orange-400',
      html: 'bg-orange-600',
      css: 'bg-blue-400',
      sql: 'bg-gray-600',
      json: 'bg-gray-400',
      xml: 'bg-yellow-600',
      yaml: 'bg-red-400',
      markdown: 'bg-gray-300'
    }
    return colors[language] || 'bg-gray-500'
  }

  const formatCodePreview = (code) => {
    return code.length > 150 ? code.substring(0, 150) + '...' : code
  }

  if (viewMode === 'list') {
    return (
      <div className="card p-6 hover:transform hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link to={`/snippets/${snippet._id}`} className="block">
              <div className="flex items-center space-x-3 mb-3">
                <h3 className="font-semibold text-slate-800 dark:text-white text-lg hover:text-primary-600 transition-colors">
                  {snippet.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getLanguageColor(snippet.language)}`}>
                  {snippet.language}
                </span>
                {snippet.visibility === 'private' && (
                  <Lock className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </Link>
            
            {snippet.description && (
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                {snippet.description}
              </p>
            )}

            <pre className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg text-sm overflow-x-auto mb-3">
              <code>{formatCodePreview(snippet.code)}</code>
            </pre>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{snippet.views || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>{snippet.starCount || snippet.stars?.length || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <GitFork className="w-4 h-4" />
                  <span>{snippet.forkCount || snippet.forks?.length || 0}</span>
                </div>
                <span>By {snippet.author.username}</span>
              </div>

              <div className="flex items-center space-x-2">
                {snippet.tags?.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {snippet.tags?.length > 3 && (
                  <span className="text-xs text-slate-500">
                    +{snippet.tags.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="relative ml-4">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-10 card p-2 w-48 z-10">
                <Link
                  to={`/snippets/${snippet._id}`}
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  onClick={() => setShowMenu(false)}
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </Link>
                
                {user && (
                  <button
                    onClick={handleStar}
                    className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Star className="w-4 h-4" />
                    <span>Star</span>
                  </button>
                )}

                {user && (
                  <Link
                    to={`/snippets/${snippet._id}/fork`}
                    className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    <GitFork className="w-4 h-4" />
                    <span>Fork</span>
                  </Link>
                )}

                {isOwner && (
                  <>
                    <Link
                      to={`/snippets/edit/${snippet._id}`}
                      className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      onClick={() => setShowMenu(false)}
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Grid View
  return (
    <div className="card p-6 hover:transform hover:-translate-y-2 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${getLanguageColor(snippet.language)}`}></span>
          <span className="font-medium text-slate-700 dark:text-slate-300 text-sm capitalize">
            {snippet.language}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {snippet.visibility === 'private' ? (
            <Lock className="w-4 h-4 text-slate-400" />
          ) : (
            <Globe className="w-4 h-4 text-slate-400" />
          )}
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 card p-2 w-40 z-10">
                <Link
                  to={`/snippets/${snippet._id}`}
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm"
                  onClick={() => setShowMenu(false)}
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </Link>
                
                {user && (
                  <button
                    onClick={handleStar}
                    className="flex items-center space-x-2 w-full px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm"
                  >
                    <Star className="w-4 h-4" />
                    <span>Star</span>
                  </button>
                )}

                {user && (
                  <Link
                    to={`/snippets/${snippet._id}/fork`}
                    className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm"
                    onClick={() => setShowMenu(false)}
                  >
                    <GitFork className="w-4 h-4" />
                    <span>Fork</span>
                  </Link>
                )}

                {isOwner && (
                  <>
                    <Link
                      to={`/snippets/edit/${snippet._id}`}
                      className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm"
                      onClick={() => setShowMenu(false)}
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Link to={`/snippets/${snippet._id}`} className="block">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {snippet.title}
        </h3>
      </Link>

      {snippet.description && (
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
          {snippet.description}
        </p>
      )}

      <pre className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg text-sm overflow-x-auto mb-4 max-h-32">
        <code className="text-xs">{formatCodePreview(snippet.code)}</code>
      </pre>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{snippet.views || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span>{snippet.starCount || snippet.stars?.length || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <GitFork className="w-4 h-4" />
            <span>{snippet.forkCount || snippet.forks?.length || 0}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            {snippet.author.username?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {snippet.author.username}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 justify-end">
          {snippet.tags?.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
          {snippet.tags?.length > 2 && (
            <span className="text-xs text-slate-500 px-1">
              +{snippet.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default SnippetCard