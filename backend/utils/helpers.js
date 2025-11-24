const sanitizeInput = (input) => {
    if (typeof input === 'string') {
      return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    }
    return input
  }
  
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const truncateText = (text, length = 100) => {
    if (text.length <= length) return text
    return text.substring(0, length) + '...'
  }
  
  module.exports = {
    sanitizeInput,
    generateSlug,
    formatDate,
    truncateText
  }