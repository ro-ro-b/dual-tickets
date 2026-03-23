'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/', label: 'Events' },
    { href: '/my-tickets', label: 'My Tickets' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/scan', label: 'Scan' },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-[#08080f] text-white overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#08080f] via-[#0d0520] to-[#08080f]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0, 240, 255, 0.02) 39px, rgba(0, 240, 255, 0.02) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0, 240, 255, 0.02) 39px, rgba(0, 240, 255, 0.02) 40px)`,
          }}
        />
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#6c2bd9]/15 to-transparent blur-3xl" />
        <div className="absolute bottom-[-300px] right-[-300px] w-[800px] h-[800px] rounded-full bg-gradient-to-l from-[#ff2d78]/8 to-transparent blur-3xl" />
      </div>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-white/10">
        <div className="backdrop-blur-xl bg-[#08080f]/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f0ff] to-[#6c2bd9] flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-lg">confirmation_number</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">DUAL</span>
              <span className="text-sm text-gray-400 font-light">Tickets</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? 'text-[#00f0ff] bg-[#00f0ff]/10 border border-[#00f0ff]/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="w-px h-6 bg-white/10 mx-2" />
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                <span className="material-symbols-outlined text-base">account_circle</span>
                Profile
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-400 hover:text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-[#00f0ff] bg-[#00f0ff]/10'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-base">account_circle</span>
                Profile
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20">
        <div className="bg-[#08080f]/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00f0ff] to-[#6c2bd9] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-sm">confirmation_number</span>
                  </div>
                  <span className="text-lg font-bold">DUAL Tickets</span>
                </div>
                <p className="text-sm text-gray-500">
                  The future of live events on-chain. Transparent, secure, fair.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4 text-sm">Platform</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-[#00f0ff] transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-[#00f0ff] transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-[#00f0ff] transition-colors">Security</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4 text-sm">Learn</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-[#00f0ff] transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-[#00f0ff] transition-colors">Docs</a></li>
                  <li><a href="#" className="hover:text-[#00f0ff] transition-colors">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4 text-sm">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-[#00f0ff] transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-[#00f0ff] transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-[#00f0ff] transition-colors">Cookies</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8 flex items-center justify-between">
              <p className="text-xs text-gray-600">© 2026 DUAL Tickets. All rights reserved.</p>
              <div className="flex gap-3">
                <a href="https://32f.blockv.io/token/0x41Cf00E593c5623B00F812bC70Ee1A737C5aFF06" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-[#00f0ff] transition-colors">Blockscout</a>
                <a href="#" className="text-xs text-gray-500 hover:text-[#00f0ff] transition-colors">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
