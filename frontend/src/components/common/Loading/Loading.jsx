import React from 'react'

const Loading = ({ size = 'medium', text = 'Loading...' }) => {
  const sizes = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`animate-spin rounded-full border-b-2 border-primary-600 ${sizes[size]}`}></div>
      {text && <p className="text-slate-600 dark:text-slate-400">{text}</p>}
    </div>
  )
}

export default Loading