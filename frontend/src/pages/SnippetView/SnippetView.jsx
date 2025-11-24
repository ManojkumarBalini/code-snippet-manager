import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSnippets } from '../../context/SnippetContext'
import { useAuth } from '../../context/AuthContext'
import { 
  Star, 
  GitFork, 
  Eye, 
  Edit3, 
  Trash2, 
  ArrowLeft,
  Copy,
  Check,
  Lock,
  Globe,
  Link as LinkIcon,
  Calendar,
  User
} from 'lucide-react'
import toast from 'react-hot-toast'

const SnippetView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentSnippet, getSnippetById, deleteSnippet, forkSnippet, toggleStar } = useSnippets()
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSnippet = async () => {
      try {
        await getSnippetById(id)
      } catch (error) {
        toast.error('Failed to load snippet')
        navigate('/snippets')
      } finally {
        setIsLoading(false)
      }
    }

    loadSnippet()
  }, [id, navigate])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentSnippet?.code || '')
      setCopied(true)
      toast.success('Code copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy code')
    }
  }

  const handleStar = async () => {
    if (!user) {
      toast.error('Please login to star snippets')
      return
    }
    await toggleStar(currentSnippet._id)
  }

  const handleFork = async () => {
    if (!user) {
      toast.error('Please login to fork snippets')
      return
    }
    try {
      const forkedSnippet = await forkSnippet(currentSnippet._id)
      navigate(`/snippets/edit/${forkedSnippet._id}`)
    } catch (error) {
      toast.error('Failed to fork snippet')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      try {
        await deleteSnippet(currentSnippet._id)
        navigate('/dashboard')
      } catch (error) {
        toast.error('Failed to delete snippet')
      }
    }
  }

  const isOwner = user && currentSnippet?.author?._id === user.id
  const hasStarred = user && currentSnippet?.stars?.includes(user.id)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!currentSnippet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-400 mb-4">
            Snippet not found
          </h2>
          <button 
            onClick={() => navigate('/snippets')}
            className="btn-primary"
          >
            Browse Snippets
          </button>
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Snippets</span>
          </button>

          <div className="flex items-center space-x-3">
            {user && (
              <button
                onClick={handleStar}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                  hasStarred
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Star className={`w-5 h-5 ${hasStarred ? 'fill-current' : ''}`} />
                <span>Star ({currentSnippet.starCount || currentSnippet.stars?.length || 0})</span>
              </button>
            )}

            {user && (
              <button
                onClick={handleFork}
                className="btn-secondary flex items-center space-x-2"
              >
                <GitFork className="w-5 h-5" />
                <span>Fork</span>
              </button>
            )}

            {isOwner && (
              <>
                <button
                  onClick={() => navigate(`/snippets/edit/${currentSnippet._id}`)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Edit3 className="w-5 h-5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="btn-secondary flex items-center space-x-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Snippet Content */}
        <div className="card p-8 mb-6">
          {/* Snippet Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
                  {currentSnippet.title}
                </h1>
                {currentSnippet.visibility === 'private' ? (
                  <Lock className="w-6 h-6 text-slate-400" />
                ) : currentSnippet.visibility === 'unlisted' ? (
                  <LinkIcon className="w-6 h-6 text-slate-400" />
                ) : (
                  <Globe className="w-6 h-6 text-slate-400" />
                )}
              </div>

              {currentSnippet.description && (
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {currentSnippet.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold">
                    {currentSnippet.author?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-300">
                      {currentSnippet.author?.username}
                    </p>
                    <p className="text-xs">{currentSnippet.author?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{currentSnippet.views || 0} views</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created {formatDate(currentSnippet.createdAt)}</span>
                </div>
                
                {currentSnippet.updatedAt !== currentSnippet.createdAt && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Updated {formatDate(currentSnippet.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          {currentSnippet.tags && currentSnippet.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {currentSnippet.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Code Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="px-4 py-2 bg-slate-800 text-slate-100 rounded-lg text-sm font-medium capitalize">
                  {currentSnippet.language}
                </span>
                {currentSnippet.isFork && currentSnippet.forkedFrom && (
                  <span className="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm">
                    Forked from another snippet
                  </span>
                )}
              </div>
              <button
                onClick={handleCopy}
                className="btn-secondary flex items-center space-x-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
              <pre className="p-6 overflow-x-auto text-slate-100">
                <code className="font-mono text-sm leading-relaxed">
                  {currentSnippet.code}
                </code>
              </pre>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
              <Star className="w-5 h-5" />
              <div>
                <span className="font-semibold text-lg">{currentSnippet.starCount || currentSnippet.stars?.length || 0}</span>
                <span className="text-sm ml-1">stars</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
              <GitFork className="w-5 h-5" />
              <div>
                <span className="font-semibold text-lg">{currentSnippet.forkCount || currentSnippet.forks?.length || 0}</span>
                <span className="text-sm ml-1">forks</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
              <Eye className="w-5 h-5" />
              <div>
                <span className="font-semibold text-lg">{currentSnippet.views || 0}</span>
                <span className="text-sm ml-1">views</span>
              </div>
            </div>
          </div>

          {/* Fork Information */}
          {currentSnippet.isFork && currentSnippet.forkedFrom && (
            <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                This snippet was forked from another snippet. You can modify it to create your own version.
              </p>
            </div>
          )}
        </div>

        {/* Related Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
              Snippet Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={handleCopy}
                className="w-full btn-secondary flex items-center space-x-2 justify-center"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Code to Clipboard</span>
              </button>
              
              {user && (
                <button
                  onClick={handleStar}
                  className="w-full btn-secondary flex items-center space-x-2 justify-center"
                >
                  <Star className={`w-4 h-4 ${hasStarred ? 'fill-current' : ''}`} />
                  <span>{hasStarred ? 'Unstar Snippet' : 'Star Snippet'}</span>
                </button>
              )}
              
              {user && (
                <button
                  onClick={handleFork}
                  className="w-full btn-secondary flex items-center space-x-2 justify-center"
                >
                  <GitFork className="w-4 h-4" />
                  <span>Fork This Snippet</span>
                </button>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
              Snippet Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Language:</span>
                <span className="font-medium capitalize">{currentSnippet.language}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Visibility:</span>
                <span className="font-medium capitalize">{currentSnippet.visibility}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Created:</span>
                <span className="font-medium">{formatDate(currentSnippet.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Last Updated:</span>
                <span className="font-medium">{formatDate(currentSnippet.updatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Code Lines:</span>
                <span className="font-medium">{currentSnippet.code.split('\n').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SnippetView