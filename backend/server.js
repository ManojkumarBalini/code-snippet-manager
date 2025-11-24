const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://code-snippet-manager-frontend.onrender.com',
    'https://code-snippet-manager-backend-7v42.onrender.com'
  ],
  credentials: true
}));

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Database connection with index cleanup logic
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ MongoDB connected successfully');

  // Drop problematic text indexes
  try {
    const collection = mongoose.connection.db.collection('snippets');
    const indexes = await collection.indexes();

    console.log('📊 Current indexes:', indexes.map(index => index.name));

    const textIndex = indexes.find(index =>
      index.name === 'title_text_description_text_tags_text' ||
      index.key?.title === 'text' ||
      index.key?.description === 'text' ||
      index.key?.tags === 'text'
    );

    if (textIndex) {
      console.log('⚠️ Removing problematic text index:', textIndex.name);
      await collection.dropIndex(textIndex.name);
      console.log('✅ Text index removed successfully');
    } else {
      console.log('✅ No problematic text indexes found');
    }

  } catch (error) {
    console.log('ℹ️ Index cleanup skipped or not needed:', error.message);
  }
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

// ⭐ Serve Frontend in Production (NEW LINE ADDED)
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Code Snippet Manager API',
    status: 'running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Health check
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
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
});

