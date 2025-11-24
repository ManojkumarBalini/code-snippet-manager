import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  Code2, 
  Search, 
  Users, 
  Lock, 
  Star, 
  GitFork,
  Zap,
  Shield,
  Globe
} from 'lucide-react'

const Home = () => {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: <Code2 className="w-8 h-8" />,
      title: 'Syntax Highlighting',
      description: 'Beautiful code formatting with support for 20+ programming languages.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: 'Smart Search',
      description: 'Find snippets quickly with advanced filtering by language, tags, and author.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Collaborate & Share',
      description: 'Fork public snippets and collaborate with the developer community.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Privacy Control',
      description: 'Choose between public, private, or unlisted visibility for your snippets.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <GitFork className="w-8 h-8" />,
      title: 'Fork System',
      description: 'Build upon others work with our intuitive forking system.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Quick Execution',
      description: 'Preview code execution for safe languages directly in the browser.',
      color: 'from-yellow-500 to-orange-500'
    }
  ]

  const stats = [
    { number: '10K+', label: 'Snippets Shared' },
    { number: '2K+', label: 'Developers' },
    { number: '50+', label: 'Languages' },
    { number: '99.9%', label: 'Uptime' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-current" />
            <span>Trusted by 2,000+ Developers</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-primary-600 to-purple-600 dark:from-white dark:via-primary-400 dark:to-purple-400 bg-clip-text text-transparent">
            Your Code
            <span className="block bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Snippet Vault
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Save, organize, and share your code snippets with beautiful syntax highlighting. 
            Collaborate with developers worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            {isAuthenticated ? (
              <Link to="/snippets/create" className="btn-primary text-lg px-8 py-4">
                Create Snippet
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg px-8 py-4">
                  Get Started Free
                </Link>
                <Link to="/snippets" className="btn-secondary text-lg px-8 py-4">
                  Explore Snippets
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Powerful features designed to make code snippet management effortless and enjoyable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="card p-8 group hover:transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card p-12 bg-gradient-to-br from-primary-500 to-purple-600 text-white">
            <Shield className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to Organize Your Code?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who use CodeVault to save time and write better code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/dashboard" className="bg-white text-primary-600 hover:bg-slate-100 font-semibold py-4 px-8 rounded-xl transition-colors text-lg">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="bg-white text-primary-600 hover:bg-slate-100 font-semibold py-4 px-8 rounded-xl transition-colors text-lg">
                    Start Free Today
                  </Link>
                  <Link to="/snippets" className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold py-4 px-8 rounded-xl transition-colors text-lg">
                    Explore Public Snippets
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home