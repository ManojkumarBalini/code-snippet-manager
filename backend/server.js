const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://code-snippet-manager-frontend.onrender.com' // Replace with your actual frontend URL
  ],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Database connection with better error handling
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  
  // Drop problematic indexes if they exist (using correct method)
  const dropProblematicIndexes = async () => {
    try {
      const collection = mongoose.connection.db.collection('snippets');
      const indexes = await collection.indexes();
      console.log('📊 Current indexes:', indexes.map(index => index.name));
      
      // Check if text index exists and drop it
      const textIndex = indexes.find(index => 
        index.name === 'title_text_description_text_tags_text' ||
        index.key?.title === 'text' ||
        index.key?.description === 'text' ||
        index.key?.tags === 'text'
      );
      
      if (textIndex) {
        console.log('⚠️  Removing problematic text index:', textIndex.name);
        await collection.dropIndex(textIndex.name);
        console.log('✅ Problematic text index removed successfully');
      } else {
        console.log('✅ No problematic text indexes found');
      }
    } catch (error) {
      console.log('ℹ️  Index cleanup completed or no action needed:', error.message);
    }
  };

  // Run index cleanup
  dropProblematicIndexes();
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/snippets', require('./routes/snippets'));
app.use('/api/users', require('./routes/users'));

// Error handling middleware
app.use(require('./middleware/errorHandler'));

// Home route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Code Snippet Manager API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Database: ${process.env.MONGODB_URI ? 'Connected to MongoDB Atlas' : 'Local MongoDB'}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
});
