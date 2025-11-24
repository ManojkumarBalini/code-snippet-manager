const express = require('express')
const { auth } = require('../middleware/auth')
const User = require('../models/User')
const Snippet = require('../models/Snippet')

const router = express.Router()

// Get user profile
router.get('/profile', auth, async (req, res) => {
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
})

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, bio, socialLinks } = req.body
    
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
})

// Get user's snippets
router.get('/:id/snippets', async (req, res) => {
  try {
    const snippets = await Snippet.find({ author: req.params.id })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: { snippets }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user snippets',
      error: error.message
    })
  }
})

module.exports = router