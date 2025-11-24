const express = require('express');
const {
  createSnippet,
  getSnippets,
  getSnippetById,
  updateSnippet,
  deleteSnippet,
  forkSnippet,
  toggleStar
} = require('../controllers/snippetController');
const { snippetValidation } = require('../middleware/validation');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, getSnippets);
router.get('/:id', optionalAuth, getSnippetById);

// Protected routes
router.post('/', auth, snippetValidation, createSnippet);
router.put('/:id', auth, snippetValidation, updateSnippet);
router.delete('/:id', auth, deleteSnippet);
router.post('/:id/fork', auth, forkSnippet);
router.post('/:id/star', auth, toggleStar);

module.exports = router;