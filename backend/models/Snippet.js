const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: [
      'javascript', 'python', 'java', 'cpp', 'c', 'csharp',
      'php', 'ruby', 'go', 'rust', 'swift', 'typescript',
      'html', 'css', 'sql', 'json', 'xml', 'yaml', 'markdown'
    ]
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'unlisted'],
    default: 'private'
  },
  isFork: {
    type: Boolean,
    default: false
  },
  forkedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Snippet'
  },
  forks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Snippet'
  }],
  stars: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  collections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection'
  }]
}, {
  timestamps: true
});

// Remove ALL text indexes completely - they are causing the language override error
// Only use regular indexes for filtering
snippetSchema.index({ language: 1 });
snippetSchema.index({ author: 1 });
snippetSchema.index({ visibility: 1 });
snippetSchema.index({ createdAt: -1 });
snippetSchema.index({ tags: 1 });

// Virtual for star count
snippetSchema.virtual('starCount').get(function() {
  return this.stars ? this.stars.length : 0;
});

// Virtual for fork count
snippetSchema.virtual('forkCount').get(function() {
  return this.forks ? this.forks.length : 0;
});

// Ensure virtuals are included in JSON output
snippetSchema.set('toJSON', { virtuals: true });
snippetSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Snippet', snippetSchema);