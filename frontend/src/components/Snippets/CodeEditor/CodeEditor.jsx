import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CodeEditor = ({ code, language, onChange, readOnly = false }) => {
  if (readOnly) {
    return (
      <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
        <SyntaxHighlighter
          language={language}
          style={atomDark}
          customStyle={{
            margin: 0,
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            lineHeight: '1.5'
          }}
          showLineNumbers
        >
          {code}
        </SyntaxHighlighter>
      </div>
    )
  }

  return (
    <textarea
      value={code}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-96 font-mono text-sm bg-slate-900 text-slate-100 p-4 rounded-lg border border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
      spellCheck="false"
      placeholder="Enter your code here..."
    />
  )
}

export default CodeEditor