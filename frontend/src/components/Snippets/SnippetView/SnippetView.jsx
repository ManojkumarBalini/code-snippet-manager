import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSnippets } from '../../../context/SnippetContext'
import { useAuth } from '../../../context/AuthContext'
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
  Link as LinkIcon
} from 'lucide-react'
import CodeEditor from '../CodeEditor/CodeEditor'
import toast from 'react-hot-toast'

const SnippetView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentSnippet, getSnippetById, deleteSnippet, forkSnippet, toggleStar } = useSnippets()
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  React.useEffect(() => {
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
  }, [id])

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
    const forkedSnippet = await forkSnippet(currentSnippet._id)
    navigate(`/snippets/edit/${forkedSnippet._id}`)
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      await deleteSnippet(currentSnippet._id)
      navigate('/dashboard')
    }
  }

  const isOwner = user && currentSnippet?.author?._id === user.id
  const hasStarred = user && currentSnippet?.stars?.includes(user.id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!currentSnippet) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-400 mb-4">
          Snippet not found
        </h2>
        <Link to="/snippets" className="btn-primary">
          Browse Snippets
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
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
              <span>{currentSnippet.starCount || currentSnippet.stars?.length || 0}</span>
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
              <Link
                to={`/snippets/edit/${currentSnippet._id}`}
                className="btn-primary flex items-center space-x-2"
              >
                <Edit3 className="w-5 h-5" />
                <span>Edit</span>
              </Link>
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
      <div className="card p-8">
        {/* Snippet Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
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
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-4">
                {currentSnippet.description}
              </p>
            )}

            <div className="flex items-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {currentSnippet.author?.username?.charAt(0).toUpperCase()}
                </div>
                <span>By {currentSnippet.author?.username}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{currentSnippet.views || 0} views</span>
              </div>
              <span>
                {new Date(currentSnippet.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {currentSnippet.tags && currentSnippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {currentSnippet.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Code */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-slate-800 text-slate-100 rounded-lg text-sm font-medium capitalize">
                {currentSnippet.language}
              </span>
              {currentSnippet.isFork && currentSnippet.forkedFrom && (
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm">
                  Forked
                </span>
              )}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <CodeEditor
            code={currentSnippet.code}
            language={currentSnippet.language}
            readOnly={true}
          />
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
            <Star className="w-5 h-5" />
            <span className="font-medium">{currentSnippet.starCount || currentSnippet.stars?.length || 0} stars</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
            <GitFork className="w-5 h-5" />
            <span className="font-medium">{currentSnippet.forkCount || currentSnippet.forks?.length || 0} forks</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
            <Eye className="w-5 h-5" />
            <span className="font-medium">{currentSnippet.views || 0} views</span>
          </div>
        </div>

        {/* Fork Information */}
        {currentSnippet.isFork && currentSnippet.forkedFrom && (
          <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This snippet was forked from{' '}
              <Link 
                to={`/snippets/${currentSnippet.forkedFrom._id}`}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {currentSnippet.forkedFrom.title}
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SnippetView