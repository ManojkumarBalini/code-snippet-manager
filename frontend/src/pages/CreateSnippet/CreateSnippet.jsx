import React from 'react'
import SnippetForm from '../../components/Snippets/SnippetForm/SnippetForm.jsx'
import { Code2 } from 'lucide-react'

const CreateSnippet = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl">
            <Code2 className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">
          Create New Snippet
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          Share your code with the developer community
        </p>
      </div>

      <SnippetForm />
    </div>
  )
}

export default CreateSnippet
