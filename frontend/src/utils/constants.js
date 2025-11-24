export const LANGUAGES = [
    'javascript',
    'python',
    'typescript',
    'java',
    'cpp',
    'c',
    'csharp',
    'php',
    'ruby',
    'go',
    'rust',
    'swift',
    'html',
    'css',
    'sql',
    'json',
    'xml',
    'yaml',
    'markdown'
  ]
  
  export const VISIBILITY_OPTIONS = [
    { value: 'public', label: 'Public', description: 'Visible to everyone' },
    { value: 'unlisted', label: 'Unlisted', description: 'Anyone with the link can see' },
    { value: 'private', label: 'Private', description: 'Only you can see' }
  ]
  
  export const THEME_COLORS = {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1'
    }
  }
  
  export const API_ENDPOINTS = {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      ME: '/auth/me'
    },
    SNIPPETS: {
      BASE: '/snippets',
      USER: '/snippets?visibility=all',
      STAR: '/snippets/:id/star',
      FORK: '/snippets/:id/fork'
    },
    USERS: {
      PROFILE: '/users/profile'
    }
  }