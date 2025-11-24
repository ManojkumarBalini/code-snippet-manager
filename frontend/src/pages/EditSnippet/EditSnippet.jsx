import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSnippets } from '../../context/SnippetContext'
import SnippetForm from '../../components/Snippets/SnippetForm/SnippetForm.jsx'
import { Code2, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const EditSnippet = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getSnippetById, loading } = useSnippets()
  const [snippet, setSnippet] = useState(null)

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const snippetData = await getSnippetById(id)
        setSnippet(snippetData)
      } catch (error) {
        toast.error('Snippet not found')
        navigate('/snippets')
      }
    }

    fetchSnippet()
  }, [id, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl">
            <Code2 className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">
          Edit Snippet
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          Update your code snippet
        </p>
      </div>

      {snippet && <SnippetForm snippet={snippet} isEdit={true} />}
    </div>
  )
}

export default EditSnippet
