import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSnippets } from '../../context/SnippetContext'
import { 
  Code2, 
  Plus, 
  Star, 
  Eye, 
  GitFork, 
  TrendingUp,
  Calendar,
  Search
} from 'lucide-react'
import StatsCard from '../../components/dashboard/StatsCard/StatsCard'
import QuickActions from '../../components/dashboard/QuickActions/QuickActions'
import SnippetCard from '../../components/snippets/SnippetCard/SnippetCard'

const Dashboard = () => {
  const { user } = useAuth()
  const { snippets, userSnippets, loading, fetchUserSnippets } = useSnippets()
  const [recentSnippets, setRecentSnippets] = useState([])
  const [stats, setStats] = useState({
    totalSnippets: 0,
    publicSnippets: 0,
    privateSnippets: 0,
    totalViews: 0,
    totalStars: 0
  })

  useEffect(() => {
    fetchUserSnippets()
  }, [])

  useEffect(() => {
    if (userSnippets) {
      setRecentSnippets(userSnippets.slice(0, 6))
      
      const totalSnippets = userSnippets.length
      const publicSnippets = userSnippets.filter(s => s.visibility === 'public').length
      const privateSnippets = userSnippets.filter(s => s.visibility === 'private').length
      const totalViews = userSnippets.reduce((sum, snippet) => sum + (snippet.views || 0), 0)
      const totalStars = userSnippets.reduce((sum, snippet) => sum + (snippet.starCount || 0), 0)

      setStats({
        totalSnippets,
        publicSnippets,
        privateSnippets,
        totalViews,
        totalStars
      })
    }
  }, [userSnippets])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Here's what's happening with your code snippets.
          </p>
        </div>
        <Link to="/snippets/create" className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>New Snippet</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Snippets"
          value={stats.totalSnippets}
          icon={<Code2 className="w-6 h-6" />}
          color="from-blue-500 to-cyan-500"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Public Snippets"
          value={stats.publicSnippets}
          icon={<Eye className="w-6 h-6" />}
          color="from-green-500 to-emerald-500"
        />
        <StatsCard
          title="Total Views"
          value={stats.totalViews}
          icon={<TrendingUp className="w-6 h-6" />}
          color="from-purple-500 to-pink-500"
        />
        <StatsCard
          title="Stars Received"
          value={stats.totalStars}
          icon={<Star className="w-6 h-6" />}
          color="from-orange-500 to-yellow-500"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Snippets */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Recent Snippets
          </h2>
          <Link 
            to="/snippets" 
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            View all
          </Link>
        </div>

        {recentSnippets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentSnippets.map(snippet => (
              <SnippetCard key={snippet._id} snippet={snippet} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Code2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
              No snippets yet
            </h3>
            <p className="text-slate-500 dark:text-slate-500 mb-6">
              Start by creating your first code snippet
            </p>
            <Link to="/snippets/create" className="btn-primary">
              Create Snippet
            </Link>
          </div>
        )}
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Languages */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
            Top Languages
          </h3>
          <div className="space-y-4">
            {['javascript', 'python', 'typescript', 'java', 'cpp'].map((language, index) => (
              <div key={language} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                  <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">
                    {language}
                  </span>
                </div>
                <span className="text-slate-500 dark:text-slate-400">
                  {Math.floor(Math.random() * 20) + 5}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              { action: 'created', type: 'snippet', name: 'React Hook Example', time: '2 hours ago' },
              { action: 'updated', type: 'snippet', name: 'API Service Class', time: '1 day ago' },
              { action: 'starred', type: 'snippet', name: 'Python Data Analysis', time: '2 days ago' },
              { action: 'forked', type: 'snippet', name: 'Node.js Authentication', time: '3 days ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <div className="flex-1">
                  <span className="text-slate-700 dark:text-slate-300">
                    You {activity.action} {activity.type}{' '}
                    <span className="font-semibold">{activity.name}</span>
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm block">
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard