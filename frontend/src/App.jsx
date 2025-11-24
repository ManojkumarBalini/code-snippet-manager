import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { SnippetProvider } from './context/SnippetContext'

// Components
import Header from './components/common/Header/Header'
import Footer from './components/common/Footer/Footer'

// Pages
import Home from './pages/Home/Home'
import Dashboard from './pages/Dashboard/Dashboard'
import Snippets from './pages/Snippets/Snippets'
import CreateSnippet from './pages/CreateSnippet/CreateSnippet'
import EditSnippet from './pages/EditSnippet/EditSnippet'
import Profile from './pages/Profile/Profile'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import SnippetView from './pages/SnippetView/SnippetView'

import './App.css'

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
          <div className="card p-8 max-w-md text-center">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
              Something went wrong
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              We're sorry, but something went wrong. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SnippetProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/snippets" element={<Snippets />} />
                  <Route path="/snippets/create" element={<CreateSnippet />} />
                  <Route path="/snippets/edit/:id" element={<EditSnippet />} />
                  <Route path="/snippets/:id" element={<SnippetView />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </main>
              <Footer />
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                  },
                  error: {
                    duration: 5000,
                  },
                }}
              />
            </div>
          </Router>
        </SnippetProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App