import api from './api.js'

const snippetAPI = {
  getSnippets: (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v))
        } else {
          params.append(key, value)
        }
      }
    })
    return api.get(`/snippets?${params}`)
  },
  
  getUserSnippets: () => api.get('/snippets?visibility=all'),
  
  getSnippet: (id) => api.get(`/snippets/${id}`),
  
  createSnippet: (data) => api.post('/snippets', data),
  
  updateSnippet: (id, data) => api.put(`/snippets/${id}`, data),
  
  deleteSnippet: (id) => api.delete(`/snippets/${id}`),
  
  forkSnippet: (id) => api.post(`/snippets/${id}/fork`),
  
  toggleStar: (id) => api.post(`/snippets/${id}/star`)
}

export { snippetAPI }