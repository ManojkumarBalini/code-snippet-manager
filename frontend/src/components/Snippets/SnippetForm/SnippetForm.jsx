import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSnippets } from '../../../context/SnippetContext'
import { useAuth } from '../../../context/AuthContext'
import { 
  Save, 
  Code2, 
  Lock, 
  Globe,
  Link as LinkIcon
} from 'lucide-react'

const SnippetForm = ({ snippet = null, isEdit = false }) => {
  const { createSnippet, updateSnippet } = useSnippets()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    language: 'javascript',
    tags: [],
    visibility: 'private'
  })
  const [tagInput, setTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isEdit && snippet) {
      setFormData({
        title: snippet.title || '',
        description: snippet.description || '',
        code: snippet.code || '',
        language: snippet.language || 'javascript',
        tags: snippet.tags || [],
        visibility: snippet.visibility || 'private'
      })
    }
  }, [isEdit, snippet])

  const languages = [
    'javascript', 'python', 'typescript', 'java', 'cpp', 'c', 'csharp',
    'php', 'ruby', 'go', 'rust', 'swift', 'html', 'css', 'sql', 'json',
    'xml', 'yaml', 'markdown'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim().toLowerCase()
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }))
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Code is required'
    }

    if (!formData.language) {
      newErrors.language = 'Language is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      if (isEdit) {
        await updateSnippet(snippet._id, formData)
        navigate(`/snippets/${snippet._id}`)
      } else {
        const newSnippet = await createSnippet(formData)
        navigate(`/snippets/${newSnippet._id}`)
      }
    } catch (error) {
      console.error('Error saving snippet:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className={`input-field ${errors.title ? 'border-red-500' : ''}`}
          placeholder="Enter a descriptive title for your snippet"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          className="input-field resize-none"
          placeholder="Describe what this code does..."
        />
      </div>

      {/* Language */}
      <div>
        <label htmlFor="language" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Language *
        </label>
        <select
          id="language"
          name="language"
          required
          value={formData.language}
          onChange={handleChange}
          className={`input-field ${errors.language ? 'border-red-500' : ''}`}
        >
          {languages.map(lang => (
            <option key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>
        {errors.language && (
          <p className="mt-1 text-sm text-red-600">{errors.language}</p>
        )}
      </div>

      {/* Code Editor */}
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Code *
        </label>
        <div className="relative">
          <Code2 className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
          <textarea
            id="code"
            name="code"
            required
            value={formData.code}
            onChange={handleChange}
            className={`input-field pl-11 font-mono text-sm min-h-[300px] resize-none ${errors.code ? 'border-red-500' : ''}`}
            placeholder="Paste your code here..."
            spellCheck="false"
          />
        </div>
        {errors.code && (
          <p className="mt-1 text-sm text-red-600">{errors.code}</p>
        )}
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 hover:text-primary-900 dark:hover:text-primary-100"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          className="input-field"
          placeholder="Type a tag and press Enter to add"
        />
      </div>

      {/* Visibility */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Visibility
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: 'private', icon: Lock, label: 'Private', description: 'Only you can see this snippet' },
            { value: 'unlisted', icon: LinkIcon, label: 'Unlisted', description: 'Anyone with the link can see' },
            { value: 'public', icon: Globe, label: 'Public', description: 'Visible to everyone' }
          ].map(option => (
            <label
              key={option.value}
              className={`relative flex cursor-pointer rounded-xl border p-4 focus:outline-none ${
                formData.visibility === option.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
              }`}
            >
              <input
                type="radio"
                name="visibility"
                value={option.value}
                checked={formData.visibility === option.value}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <div className="text-sm">
                    <div className="flex items-center space-x-2">
                      <option.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      <span className="font-medium text-slate-900 dark:text-white">
                        {option.label}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
                {formData.visibility === option.value && (
                  <div className="flex-shrink-0 text-primary-600">
                    <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          <span>{isSubmitting ? 'Saving...' : isEdit ? 'Update Snippet' : 'Create Snippet'}</span>
        </button>
      </div>
    </form>
  )
}

export default SnippetForm