const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    maxlength: 200
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  snippets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Snippet'
  }],
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'private'
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  icon: {
    type: String,
    default: '📁'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Collection', collectionSchema);