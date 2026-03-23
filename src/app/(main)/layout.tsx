'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { DualIcon, DualLogo } from './DualLogo'

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
    <div className="min-h-screen bg-[#0d0b08] text-white overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#0d0b08]" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#5c2848]/8 blur-[120px]" />
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] rounded-full bg-[#e8a838]/5 blur-[100px]" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-[#d4632a]/4 blur-[100px]" />
      </div>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-[#2a2420]">
        <div className="bg-[#0d0b08]/95 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <DualLogo height={22} className="text-[#e8a838]" />
              <span className="text-xl font-bold text-gray-500">Tickets</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? 'text-[#e8a838] border border-[#e8a838]/40 bg-[#e8a838]/5'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="w-px h-5 bg-[#2a2420] mx-3" />
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-gray-400 hover:text-white transition-all"
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
            <div className="md:hidden border-t border-[#2a2420] px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-[#e8a838] bg-[#e8a838]/10 border border-[#e8a838]/30'
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
      <footer className="relative z-10 border-t border-[#2a2420] mt-20">
        <div className="bg-[#0d0b08]/90 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <DualLogo height={18} className="text-[#e8a838]" />
                  <span className="text-lg font-bold text-gray-500">Tickets</span>
                </div>
                <p className="text-sm text-gray-600">
                  The future of live events on-chain. Transparent, secure, fair.
                </p>
              </div>
              <div>
                <h4 className="text-gray-300 font-semibold mb-4 text-sm">Platform</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-[#e8a838] transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-[#e8a838] transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-[#e8a838] transition-colors">Security</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-gray-300 font-semibold mb-4 text-sm">Learn</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-[#e8a838] transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-[#e8a838] transition-colors">Docs</a></li>
                  <li><a href="#" className="hover:text-[#e8a838] transition-colors">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-gray-300 font-semibold mb-4 text-sm">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-[#e8a838] transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-[#e8a838] transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-[#e8a838] transition-colors">Cookies</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-[#2a2420] pt-8 flex items-center justify-between">
              <p className="text-xs text-gray-700">&copy; 2026 DUAL Tickets. All rights reserved.</p>
              <div className="flex gap-4">
                <a href="https://32f.blockv.io/token/0x41Cf00E593c5623B00F812bC70Ee1A737C5aFF06" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 hover:text-[#e8a838] transition-colors">Blockscout</a>
                <a href="#" className="text-xs text-gray-600 hover:text-[#e8a838] transition-colors">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
