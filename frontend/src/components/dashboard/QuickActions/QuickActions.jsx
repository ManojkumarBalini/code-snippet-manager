import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Star, Users } from 'lucide-react'

const QuickActions = () => {
  const actions = [
    {
      icon: <Plus className="w-6 h-6" />,
      title: 'Create Snippet',
      description: 'Add a new code snippet',
      href: '/snippets/create',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Explore',
      description: 'Discover public snippets',
      href: '/snippets',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Starred',
      description: 'View your starred snippets',
      href: '/snippets?filter=starred',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community',
      description: 'See trending snippets',
      href: '/snippets?filter=trending',
      color: 'from-orange-500 to-yellow-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {actions.map((action, index) => (
        <Link
          key={index}
          to={action.href}
          className="card p-6 group hover:transform hover:-translate-y-2 transition-all duration-300"
        >
          <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${action.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
            {action.icon}
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-white mb-2">
            {action.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {action.description}
          </p>
        </Link>
      ))}
    </div>
  )
}

export default QuickActions