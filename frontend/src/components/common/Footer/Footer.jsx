import React from 'react'
import { Link } from 'react-router-dom'
import { Code2, Github, Twitter, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 text-2xl font-bold mb-4">
              <Code2 className="w-8 h-8 text-primary-400" />
              <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                CodeVault
              </span>
            </Link>
            <p className="text-slate-400 max-w-md text-lg">
              Your personal vault for saving, organizing, and sharing code snippets. 
              Built for developers who value productivity and collaboration.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-3 text-slate-400">
              <li><Link to="/snippets" className="hover:text-white transition-colors">Explore</Link></li>
              <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3 text-slate-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2024 CodeVault. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer