import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useSnippets } from '../../context/SnippetContext'
import { 
  User, 
  Mail, 
  Calendar, 
  Github, 
  Twitter, 
  Globe, 
  Edit3,
  Save,
  X
} from 'lucide-react'
import SnippetCard from '../../components/Snippets/SnippetCard/SnippetCard.jsx'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const { userSnippets, fetchUserSnippets } = useSnippets()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    socialLinks: {
      github: '',
      twitter: '',
      website: ''
    }
  })
  const [stats, setStats] = useState({
    totalSnippets: 0,
    publicSnippets: 0,
    privateSnippets: 0,
    totalViews: 0,
    totalStars: 0
  })

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
        socialLinks: {
          github: user.socialLinks?.github || '',
          twitter: user.socialLinks?.twitter || '',
          website: user.socialLinks?.website || ''
        }
      })
    }
    fetchUserSnippets()
  }, [user])

  useEffect(() => {
    if (userSnippets) {
      const totalSnippets = userSnippets.length
      const publicSnippets = userSnippets.filter(s => s.visibility === 'public').length
      const privateSnippets = userSnippets.filter(s => s.visibility === 'private').length
      const totalViews = userSnippets.reduce((sum, snippet) => sum + (snippet.views || 0), 0)
      const totalStars = userSnippets.reduce((sum, snippet) => sum + (snippet.starCount || snippet.stars?.length || 0), 0)

      setStats({
        totalSnippets,
        publicSnippets,
        privateSnippets,
        totalViews,
        totalStars
      })
    }
  }, [userSnippets])

  const handleSave = async () => {
    try {
      await updateUser(formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleCancel = () => {
    setFormData({
      username: user.username || '',
      bio: user.bio || '',
      socialLinks: {
        github: user.socialLinks?.github || '',
        twitter: user.socialLinks?.twitter || '',
        website: user.socialLinks?.website || ''
      }
    })
    setIsEditing(false)
  }

  const formatJoinDate = (dateString) => {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="card p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="text-3xl font-bold bg-transparent border-b-2 border-primary-500 text-slate-800 dark:text-white focus:outline-none"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                    {user?.username || 'User'}
                  </h1>
                )}
                
                <div className="flex items-center space-x-4 mt-2 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{user?.email || 'No email'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {formatJoinDate(user?.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bio */}
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself..."
                className="w-full p-3 bg-transparent border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows="3"
              />
            ) : (
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {user?.bio || 'No bio yet. Tell us about yourself!'}
              </p>
            )}

            {/* Social Links */}
            <div className="flex space-x-4 mt-4">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={formData.socialLinks.github}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, github: e.target.value }
                    }))}
                    placeholder="GitHub username"
                    className="flex-1 p-2 bg-transparent border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                    }))}
                    placeholder="Twitter username"
                    className="flex-1 p-2 bg-transparent border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={formData.socialLinks.website}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, website: e.target.value }
                    }))}
                    placeholder="Website URL"
                    className="flex-1 p-2 bg-transparent border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </>
              ) : (
                <>
                  {user?.socialLinks?.github && (
                    <a
                      href={`https://github.com/${user.socialLinks.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {user?.socialLinks?.twitter && (
                    <a
                      href={`https://twitter.com/${user.socialLinks.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {user?.socialLinks?.website && (
                    <a
                      href={user.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                    >
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">{stats.totalSnippets}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Snippets</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">{stats.publicSnippets}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Public</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">{stats.privateSnippets}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Private</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">{stats.totalViews}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Views</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.totalStars}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Stars</div>
        </div>
      </div>

      {/* Recent Snippets */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
          Your Snippets
        </h2>
        
        {userSnippets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userSnippets.slice(0, 6).map(snippet => (
              <SnippetCard key={snippet._id} snippet={snippet} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
              No snippets yet
            </h3>
            <p className="text-slate-500 dark:text-slate-500">
              Start creating your first code snippet
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
