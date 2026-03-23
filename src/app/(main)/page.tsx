'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Event {
  id: string
  name: string
  date: string
  venue: string
  type: 'concert' | 'sports' | 'theater' | 'conference'
  priceRange: { min: number; max: number }
  available: number
  total: number
  imageUrl?: string
  isLive?: boolean
}

const MOCK_EVENTS: Event[] = [
  { id: '1', name: 'Neon Dreams Festival 2026', date: '2026-04-15', venue: 'San Francisco Bay Area', type: 'concert', priceRange: { min: 89, max: 299 }, available: 340, total: 500, imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80', isLive: true },
  { id: '2', name: 'Virtual Reality Concert', date: '2026-05-22', venue: 'Los Angeles Convention Center', type: 'concert', priceRange: { min: 65, max: 199 }, available: 156, total: 400, imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80', isLive: true },
  { id: '3', name: 'Crypto Cup', date: '2026-06-10', venue: 'MetaStadium NYC', type: 'sports', priceRange: { min: 149, max: 799 }, available: 1250, total: 2000, imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80', isLive: true },
  { id: '4', name: 'The Holographic Opera', date: '2026-07-08', venue: 'Miami Art Deco Theater', type: 'theater', priceRange: { min: 49, max: 249 }, available: 89, total: 300, imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&q=80', isLive: true },
  { id: '5', name: 'Web3 Summit 2026', date: '2026-08-03', venue: 'Denver Convention Center', type: 'conference', priceRange: { min: 299, max: 999 }, available: 450, total: 1000, imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', isLive: true },
  { id: '6', name: 'Cyberpunk Live: Electric Revolution', date: '2026-04-28', venue: 'Seattle Paramount Theatre', type: 'concert', priceRange: { min: 79, max: 249 }, available: 223, total: 500, imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80', isLive: true },
  { id: '7', name: 'AI vs Humans: Esports Championship', date: '2026-05-14', venue: 'Tokyo International Center', type: 'sports', priceRange: { min: 39, max: 199 }, available: 567, total: 1000, imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80', isLive: true },
  { id: '8', name: 'The Digital Canvas: Immersive Art', date: '2026-06-30', venue: 'London National Gallery (Web3 Wing)', type: 'theater', priceRange: { min: 69, max: 199 }, available: 134, total: 400, imageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80', isLive: true },
  { id: '9', name: 'Future Tech Innovators Summit', date: '2026-09-12', venue: 'Berlin Tech Hub', type: 'conference', priceRange: { min: 199, max: 599 }, available: 320, total: 800, imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80', isLive: true },
  { id: '10', name: 'Synth Wave Night: Retrowave Festival', date: '2026-07-19', venue: 'Chicago Navy Pier', type: 'concert', priceRange: { min: 55, max: 175 }, available: 412, total: 600, imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', isLive: true },
]

export default function TicketsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  const categories = [
    { id: 'all', label: 'All Events' },
    { id: 'concert', label: 'Concerts' },
    { id: 'sports', label: 'Sports' },
    { id: 'theater', label: 'Theater' },
    { id: 'conference', label: 'Conferences' },
  ]

  const filteredEvents = MOCK_EVENTS.filter((event) => {
    const matchesCategory = selectedCategory === 'all' || event.type === selectedCategory
    const matchesSearch = searchQuery === '' ||
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen relative">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.02) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .card-glow:hover {
          box-shadow: 0 0 30px rgba(232, 168, 56, 0.1), 0 0 60px rgba(108, 43, 217, 0.05);
        }
      `}</style>

      {/* Mountain Landscape Header */}
      <div className="relative overflow-hidden">
        {/* Purple mountain silhouettes */}
        <div className="absolute inset-x-0 top-0 h-80 pointer-events-none">
          <svg className="absolute bottom-0 w-full h-64" viewBox="0 0 1440 256" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            {/* Far mountains - darkest purple */}
            <path d="M0 256L0 180L120 130L240 160L360 100L480 140L600 80L720 120L840 60L960 100L1080 70L1200 110L1320 90L1440 130L1440 256Z" fill="url(#mountain-far)" />
            {/* Mid mountains */}
            <path d="M0 256L0 200L180 150L300 180L420 120L540 170L660 110L780 160L900 100L1020 150L1140 120L1260 160L1380 140L1440 170L1440 256Z" fill="url(#mountain-mid)" />
            {/* Front mountains */}
            <path d="M0 256L0 220L100 190L250 210L400 170L550 200L700 160L850 195L1000 175L1150 200L1300 185L1440 210L1440 256Z" fill="url(#mountain-front)" />
            <defs>
              <linearGradient id="mountain-far" x1="0" y1="60" x2="0" y2="256">
                <stop offset="0%" stopColor="#4a2040" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0d0b08" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="mountain-mid" x1="0" y1="100" x2="0" y2="256">
                <stop offset="0%" stopColor="#5c2848" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0d0b08" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="mountain-front" x1="0" y1="160" x2="0" y2="256">
                <stop offset="0%" stopColor="#2e1425" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#0d0b08" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          {/* Warm glow at the peaks */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[800px] h-[200px] rounded-full bg-gradient-to-b from-[#e8a838]/8 via-[#d4632a]/5 to-transparent blur-[60px]" />
        </div>

        {/* Hero Section */}
        <div className="relative pt-14 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* DUAL Logo + Tagline */}
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e8a838] to-[#d4632a] flex items-center justify-center shadow-[0_0_20px_rgba(232,168,56,0.4)]">
                  <span className="material-symbols-outlined text-white text-2xl">confirmation_number</span>
                </div>
                <span className="text-5xl md:text-6xl font-black tracking-tight text-white">DUAL</span>
              </div>
              <p className="text-xl md:text-2xl italic font-light tracking-wide">
                <span className="bg-gradient-to-r from-[#e8a838] via-[#f0c040] to-[#d4632a] bg-clip-text text-transparent">The Tokenised Future of Events and Tickets</span>
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-lg mx-auto mb-8">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-lg">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events, artists, venues"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#1a1612] border border-[#3a332c] text-white text-sm placeholder-gray-600 focus:border-[#e8a838]/50 focus:outline-none focus:shadow-[0_0_15px_rgba(232,168,56,0.1)] transition-all"
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-[#e8a838] to-[#d4632a] text-white font-semibold shadow-[0_0_15px_rgba(232,168,56,0.3)]'
                      : 'text-gray-500 border border-[#3a332c] hover:border-[#e8a838]/30 hover:text-gray-300'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl border border-[#2a2420] bg-[#151210] overflow-hidden">
                <div className="h-48 shimmer" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 rounded shimmer" />
                  <div className="h-4 w-1/2 rounded shimmer" />
                  <div className="h-10 rounded shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const availPct = Math.round((event.available / event.total) * 100)
              return (
                <Link key={event.id} href={`/tickets/${event.id}`}>
                  <div className="h-full group cursor-pointer">
                    <div className="card-glow relative overflow-hidden rounded-2xl border border-[#2a2420] bg-[#151210] h-full flex flex-col transition-all duration-300 hover:border-[#3a332c] hover:-translate-y-1">
                      {/* Image */}
                      <div className="h-48 relative overflow-hidden rounded-t-2xl">
                        {event.imageUrl && (
                          <img src={event.imageUrl} alt={event.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#151210] via-transparent to-transparent" />

                        {/* LIVE ON-CHAIN Badge */}
                        {event.isLive && (
                          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#39ff14] text-black text-[10px] font-black flex items-center gap-1 shadow-[0_0_10px_rgba(57,255,20,0.5)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                            LIVE ON-CHAIN
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
                        {/* Event Name */}
                        <h3 className="font-bold text-[15px] text-white mb-2 leading-snug group-hover:text-[#e8a838] transition-colors">
                          {event.name}
                        </h3>

                        {/* Date & Venue */}
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[11px] text-gray-600">calendar_month</span>
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[11px] text-[#e8a838]">location_on</span>
                            <span className="truncate max-w-[120px]">{event.venue}</span>
                          </div>
                        </div>

                        {/* Availability */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="text-[#e8a838]">Ticket availability for {availPct}%</span>
                            <span className="text-gray-600">Price availability</span>
                          </div>
                          <div className="w-full h-1 rounded-full bg-[#2a2420] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#e8a838] to-[#39ff14]"
                              style={{ width: `${availPct}%` }}
                            />
                          </div>
                        </div>

                        {/* View Event Button */}
                        <button className="w-full py-2.5 rounded-xl border border-[#3a332c] text-white text-sm font-medium hover:border-[#e8a838]/40 hover:shadow-[0_0_12px_rgba(232,168,56,0.1)] transition-all duration-200 mt-auto">
                          View Event
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-[#2a2420] block mb-4">search_off</span>
            <h2 className="text-xl font-bold text-gray-500 mb-2">No events found</h2>
            <p className="text-gray-700 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
