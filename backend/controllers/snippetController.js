const Snippet = require('../models/Snippet');

exports.createSnippet = async (req, res) => {
  try {
    console.log('Creating snippet for user:', req.user.id);
    console.log('Snippet data:', req.body);

    const { title, description, code, language, tags, visibility } = req.body;

    // Validate required fields
    if (!title || !code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Title, code, and language are required fields'
      });
    }

    const snippetData = {
      title: title.trim(),
      description: description ? description.trim() : '',
      code: code.trim(),
      language: language.toLowerCase(),
      tags: Array.isArray(tags) ? tags : [],
      visibility: visibility || 'private',
      author: req.user.id
    };

    console.log('Processed snippet data:', snippetData);

    const snippet = new Snippet(snippetData);
    await snippet.save();

    // Populate author info
    await snippet.populate('author', 'username avatar email');

    console.log('Snippet created successfully:', snippet._id);

    res.status(201).json({
      success: true,
      message: 'Snippet created successfully',
      data: { snippet }
    });
  } catch (error) {
    console.error('Error creating snippet:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate snippet found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating snippet',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.getSnippets = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      language,
      tags,
      author,
      visibility = 'public'
    } = req.query;

    const query = {};

    // Build search query using regex (no text search)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: { $in: [searchRegex] } }
      ];
    }

    if (language && language.trim()) {
      query.language = language.trim().toLowerCase();
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      query.tags = { $in: tagArray.map(tag => tag.trim().toLowerCase()) };
    }

    if (author) {
      query.author = author;
    }

    // Visibility filter
    if (req.user) {
      if (visibility === 'all') {
        query.$or = [
          { visibility: 'public' },
          { author: req.user.id }
        ];
      } else if (visibility === 'private') {
        query.author = req.user.id;
        query.visibility = 'private';
      } else {
        query.visibility = 'public';
      }
    } else {
      query.visibility = 'public';
    }

    console.log('Query for snippets:', query);

    const snippets = await Snippet.find(query)
      .populate('author', 'username avatar email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Snippet.countDocuments(query);

    res.json({
      success: true,
      data: {
        snippets,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching snippets:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching snippets',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.getSnippetById = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id)
      .populate('author', 'username avatar bio email')
      .populate('forkedFrom', 'title author')
      .populate('forks', 'title author');

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: 'Snippet not found'
      });
    }

    // Check visibility
    if (snippet.visibility === 'private' && (!req.user || snippet.author._id.toString() !== req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Increment views for public snippets
    if (snippet.visibility === 'public') {
      snippet.views += 1;
      await snippet.save();
    }

    res.json({
      success: true,
      data: { snippet }
    });
  } catch (error) {
    console.error('Error fetching snippet:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching snippet',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.updateSnippet = async (req, res) => {
  try {
    let snippet = await Snippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: 'Snippet not found'
      });
    }

    // Check ownership
    if (snippet.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    snippet = await Snippet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username avatar email');

    res.json({
      success: true,
      message: 'Snippet updated successfully',
      data: { snippet }
    });
  } catch (error) {
    console.error('Error updating snippet:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating snippet',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.deleteSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: 'Snippet not found'
      });
    }

    // Check ownership
    if (snippet.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Snippet.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Snippet deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting snippet:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting snippet',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.forkSnippet = async (req, res) => {
  try {
    const originalSnippet = await Snippet.findById(req.params.id);

    if (!originalSnippet) {
      return res.status(404).json({
        success: false,
        message: 'Snippet not found'
      });
    }

    if (originalSnippet.visibility === 'private' && (!req.user || originalSnippet.author.toString() !== req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Cannot fork private snippet'
      });
    }

    const forkedSnippet = new Snippet({
      title: `Fork: ${originalSnippet.title}`,
      description: originalSnippet.description,
      code: originalSnippet.code,
      language: originalSnippet.language,
      tags: originalSnippet.tags,
      author: req.user.id,
      isFork: true,
      forkedFrom: originalSnippet._id,
      visibility: 'private'
    });

    await forkedSnippet.save();

    // Add fork to original snippet
    originalSnippet.forks.push(forkedSnippet._id);
    await originalSnippet.save();

    await forkedSnippet.populate('author', 'username avatar email');

    res.status(201).json({
      success: true,
      message: 'Snippet forked successfully',
      data: { snippet: forkedSnippet }
    });
  } catch (error) {
    console.error('Error forking snippet:', error);
    res.status(500).json({
      success: false,
      message: 'Error forking snippet',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.toggleStar = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: 'Snippet not found'
      });
    }

    const hasStarred = snippet.stars.includes(req.user.id);

    if (hasStarred) {
      snippet.stars = snippet.stars.filter(
        star => star.toString() !== req.user.id
      );
    } else {
      snippet.stars.push(req.user.id);
    }

    await snippet.save();

    res.json({
      success: true,
      message: hasStarred ? 'Star removed' : 'Snippet starred',
      data: { starred: !hasStarred }
    });
  } catch (error) {
    console.error('Error toggling star:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling star',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};