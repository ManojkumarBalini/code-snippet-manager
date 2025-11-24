const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Auth validation
const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3-30 characters')
    .isAlphanumeric()
    .withMessage('Username must be alphanumeric'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Snippet validation
const snippetValidation = [
  body('title')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1-100 characters'),
  body('code')
    .notEmpty()
    .withMessage('Code is required'),
  body('language')
    .isIn([
      'javascript', 'python', 'java', 'cpp', 'c', 'csharp',
      'php', 'ruby', 'go', 'rust', 'swift', 'typescript',
      'html', 'css', 'sql', 'json', 'xml', 'yaml', 'markdown'
    ])
    .withMessage('Invalid language'),
  body('visibility')
    .isIn(['public', 'private', 'unlisted'])
    .withMessage('Invalid visibility setting'),
  handleValidationErrors
];

module.exports = {
  registerValidation,
  loginValidation,
  snippetValidation
};