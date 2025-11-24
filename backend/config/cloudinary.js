const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Create storage engine for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'codevault',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 500, height: 500, crop: 'limit' },
      { quality: 'auto' },
      { format: 'webp' }
    ],
    public_id: (req, file) => {
      // Remove file extension and add timestamp
      const name = file.originalname.split('.')[0]
      return `avatar_${Date.now()}_${name}`
    }
  },
})

// File filter
const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed!'), false)
  }
}

// Configure Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})

// Utility functions
const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'codevault',
      ...options
    })
    return result
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`)
  }
}

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${error.message}`)
  }
}

const extractPublicId = (url) => {
  // Extract public_id from Cloudinary URL
  const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/)
  return matches ? matches[1] : null
}

// Generate avatar placeholder
const generateAvatar = (text, options = {}) => {
  const defaultOptions = {
    width: 200,
    height: 200,
    background: '0ea5e9',
    color: 'ffffff',
    font_size: 80,
    font_weight: 'bold',
    text: text || 'USER'
  }
  
  const params = { ...defaultOptions, ...options }
  const queryString = Object.keys(params)
    .map(key => `${key}_${params[key]}`)
    .join(',')
  
  return `https://via.placeholder.com/${params.width}x${params.height}/${params.background}/${params.color}?text=${params.text}`
}

module.exports = {
  cloudinary,
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId,
  generateAvatar
}