const User = require('../models/User')
const Snippet = require('../models/Snippet')
const Collection = require('../models/Collection')
const { generateAvatar } = require('../config/cloudinary')

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      data: { user }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    })
  }
}

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, bio, socialLinks, preferences } = req.body
    
    // Build update object
    const updateFields = {}
    
    if (username) {
      // Check if username is already taken by another user
      if (username !== req.user.username) {
        const existingUser = await User.findOne({ username })
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'Username is already taken'
          })
        }
      }
      updateFields.username = username
    }
    
    if (bio !== undefined) updateFields.bio = bio
    if (socialLinks) updateFields.socialLinks = socialLinks
    if (preferences) updateFields.preferences = preferences
    
    // Handle avatar upload if file is provided
    if (req.file) {
      updateFields.avatar = req.file.path
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password')

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    })
  }
}

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id
    
    // Get snippet statistics
    const snippetStats = await Snippet.aggregate([
      { $match: { author: userId } },
      {
        $group: {
          _id: null,
          totalSnippets: { $sum: 1 },
          publicSnippets: {
            $sum: { $cond: [{ $eq: ['$visibility', 'public'] }, 1, 0] }
          },
          privateSnippets: {
            $sum: { $cond: [{ $eq: ['$visibility', 'private'] }, 1, 0] }
          },
          totalViews: { $sum: '$views' },
          totalStars: { $sum: { $size: '$stars' } },
          totalForks: { $sum: { $size: '$forks' } }
        }
      }
    ])
    
    // Get collection statistics
    const collectionStats = await Collection.aggregate([
      { $match: { author: userId } },
      {
        $group: {
          _id: null,
          totalCollections: { $sum: 1 },
          publicCollections: {
            $sum: { $cond: [{ $eq: ['$visibility', 'public'] }, 1, 0] }
          }
        }
      }
    ])
    
    // Get language distribution
    const languageStats = await Snippet.aggregate([
      { $match: { author: userId } },
      {
        $group: {
          _id: '$language',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ])
    
    // Get recent activity
    const recentActivity = await Snippet.find({ author: userId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title language updatedAt')
      .lean()

    const stats = {
      snippets: snippetStats[0] || {
        totalSnippets: 0,
        publicSnippets: 0,
        privateSnippets: 0,
        totalViews: 0,
        totalStars: 0,
        totalForks: 0
      },
      collections: collectionStats[0] || {
        totalCollections: 0,
        publicCollections: 0
      },
      languages: languageStats,
      recentActivity
    }

    res.json({
      success: true,
      data: { stats }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message
    })
  }
}

// Get user's snippets with pagination and filtering
exports.getUserSnippets = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      language,
      visibility,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query
    
    const userId = req.user.id
    
    // Build query
    const query = { author: userId }
    
    if (language) {
      query.language = language
    }
    
    if (visibility) {
      query.visibility = visibility
    }
    
    if (search) {
      query.$text = { $search: search }
    }
    
    // Build sort object
    const sort = {}
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1
    
    const snippets = await Snippet.find(query)
      .populate('author', 'username avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean()
    
    // Add virtual fields
    const snippetsWithCounts = snippets.map(snippet => ({
      ...snippet,
      starCount: snippet.stars?.length || 0,
      forkCount: snippet.forks?.length || 0
    }))
    
    const total = await Snippet.countDocuments(query)
    
    res.json({
      success: true,
      data: {
        snippets: snippetsWithCounts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user snippets',
      error: error.message
    })
  }
}

// Get user's starred snippets
exports.getStarredSnippets = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10
    } = req.query
    
    const userId = req.user.id
    
    const snippets = await Snippet.find({ stars: userId })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean()
    
    // Add virtual fields
    const snippetsWithCounts = snippets.map(snippet => ({
      ...snippet,
      starCount: snippet.stars?.length || 0,
      forkCount: snippet.forks?.length || 0
    }))
    
    const total = await Snippet.countDocuments({ stars: userId })
    
    res.json({
      success: true,
      data: {
        snippets: snippetsWithCounts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching starred snippets',
      error: error.message
    })
  }
}

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id
    
    // Delete user's snippets
    await Snippet.deleteMany({ author: userId })
    
    // Delete user's collections
    await Collection.deleteMany({ author: userId })
    
    // Remove user from stars and forks in other snippets
    await Snippet.updateMany(
      { stars: userId },
      { $pull: { stars: userId } }
    )
    
    await Snippet.updateMany(
      { forks: { $in: [userId] } },
      { $pull: { forks: userId } }
    )
    
    // Delete user account
    await User.findByIdAndDelete(userId)
    
    res.json({
      success: true,
      message: 'Account and all associated data deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting account',
      error: error.message
    })
  }
}

// Search users (for @mentions, etc.)
exports.searchUsers = async (req, res) => {
  try {
    const { query, limit = 10 } = req.query
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      })
    }
    
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    })
    .select('username avatar email')
    .limit(parseInt(limit))
    
    res.json({
      success: true,
      data: { users }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching users',
      error: error.message
    })
  }
}

// Get public user profile
exports.getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params
    
    const user = await User.findOne({ username }).select('-password -email')
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
    
    // Get user's public snippets
    const publicSnippets = await Snippet.find({
      author: user._id,
      visibility: 'public'
    })
    .populate('author', 'username avatar')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean()
    
    // Add virtual fields
    const snippetsWithCounts = publicSnippets.map(snippet => ({
      ...snippet,
      starCount: snippet.stars?.length || 0,
      forkCount: snippet.forks?.length || 0
    }))
    
    // Get user statistics (only public data)
    const snippetStats = await Snippet.aggregate([
      { 
        $match: { 
          author: user._id,
          visibility: 'public'
        } 
      },
      {
        $group: {
          _id: null,
          totalSnippets: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalStars: { $sum: { $size: '$stars' } }
        }
      }
    ])
    
    const stats = snippetStats[0] || {
      totalSnippets: 0,
      totalViews: 0,
      totalStars: 0
    }
    
    res.json({
      success: true,
      data: {
        user,
        snippets: snippetsWithCounts,
        stats
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching public profile',
      error: error.message
    })
  }
}