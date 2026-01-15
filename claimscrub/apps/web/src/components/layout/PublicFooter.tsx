import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'

export function PublicFooter() {
  return (
    <footer className="bg-neutral-900 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-heading text-xl font-bold text-white">
                Denali Health
              </span>
            </Link>
            <p className="mt-4 text-sm">
              Denials Prevention, Not Denials Management.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} Denali Health. All rights reserved.
          </p>
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-amber-900/50 text-amber-400 text-xs font-medium rounded">
                BAA Pending
              </span>
            </div>
            <p className="text-[10px] italic text-white">
              Powered by Claude for Healthcare from Anthropic
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
