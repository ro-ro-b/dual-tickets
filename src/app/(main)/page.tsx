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
  imageGradient: string
  imageUrl?: string
  isLive?: boolean
  blockchainTxHash?: string
  explorerUrl?: string
}

const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    name: 'Neon Dreams Festival',
    date: '2026-04-15',
    venue: 'San Francisco Bay Area',
    type: 'concert',
    priceRange: { min: 89, max: 299 },
    available: 340,
    total: 500,
    imageGradient: 'from-cyan-500/40 to-purple-600/40',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    isLive: true,
  },
  {
    id: '2',
    name: 'Virtual Reality Concert',
    date: '2026-05-22',
    venue: 'Los Angeles Convention Center',
    type: 'concert',
    priceRange: { min: 65, max: 199 },
    available: 156,
    total: 400,
    imageGradient: 'from-cyan-500/50 to-pink-500/30',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    isLive: true,
  },
  {
    id: '3',
    name: 'Crypto Cup',
    date: '2026-06-10',
    venue: 'MetaStadium NYC',
    type: 'sports',
    priceRange: { min: 149, max: 799 },
    available: 1250,
    total: 2000,
    imageGradient: 'from-green-400/40 to-cyan-500/40',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80',
    isLive: true,
  },
  {
    id: '4',
    name: 'The Holographic Opera',
    date: '2026-07-08',
    venue: 'Miami Art Deco Theater',
    type: 'theater',
    priceRange: { min: 49, max: 249 },
    available: 89,
    total: 300,
    imageGradient: 'from-pink-500/40 to-purple-600/40',
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&q=80',
    isLive: true,
  },
  {
    id: '5',
    name: 'Web3 Summit 2026',
    date: '2026-08-03',
    venue: 'Denver Convention Center',
    type: 'conference',
    priceRange: { min: 299, max: 999 },
    available: 450,
    total: 1000,
    imageGradient: 'from-purple-600/40 to-blue-500/40',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    isLive: true,
  },
  {
    id: '6',
    name: 'Cyberpunk Live: Electric Revolution',
    date: '2026-04-28',
    venue: 'Seattle Paramount Theatre',
    type: 'concert',
    priceRange: { min: 79, max: 249 },
    available: 223,
    total: 500,
    imageGradient: 'from-cyan-400/50 to-magenta-500/40',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
    isLive: true,
  },
  {
    id: '7',
    name: 'AI vs Humans: Esports Championship',
    date: '2026-05-14',
    venue: 'Tokyo International Center',
    type: 'sports',
    priceRange: { min: 39, max: 199 },
    available: 567,
    total: 1000,
    imageGradient: 'from-lime-400/40 to-cyan-500/40',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    isLive: true,
  },
  {
    id: '8',
    name: 'The Digital Canvas: Immersive Art',
    date: '2026-06-30',
    venue: 'London National Gallery (Web3 Wing)',
    type: 'theater',
    priceRange: { min: 69, max: 199 },
    available: 134,
    total: 400,
    imageGradient: 'from-fuchsia-500/40 to-purple-600/40',
    imageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80',
    isLive: true,
  },
  {
    id: '9',
    name: 'Future Tech Innovators Summit',
    date: '2026-09-12',
    venue: 'Berlin Tech Hub',
    type: 'conference',
    priceRange: { min: 199, max: 599 },
    available: 320,
    total: 800,
    imageGradient: 'from-indigo-500/40 to-blue-600/40',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80',
    isLive: true,
  },
  {
    id: '10',
    name: 'Synth Wave Night: Retrowave Festival',
    date: '2026-07-19',
    venue: 'Chicago Navy Pier',
    type: 'concert',
    priceRange: { min: 55, max: 175 },
    available: 412,
    total: 600,
    imageGradient: 'from-pink-500/50 to-cyan-400/40',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    isLive: true,
  },
]

export default function TicketsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate brief load
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

  const allEvents = MOCK_EVENTS

  const filteredEvents = allEvents.filter((event) => {
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
          background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>

      {/* Hero Section */}
      <div className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight bg-gradient-to-r from-[#00f0ff] via-[#a855f7] to-[#ff2d78] bg-clip-text text-transparent leading-tight">
            The Future of{' '}
            <span className="italic">Live Events</span>
          </h1>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-10">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, artists, venues"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-[#00f0ff]/50 focus:bg-white/8 focus:outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'text-gray-500 border border-transparent hover:text-gray-300 hover:border-white/10'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Event Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
                <div className="h-52 shimmer" />
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
            {filteredEvents.map((event) => (
              <Link key={event.id} href={`/tickets/${event.id}`}>
                <div className="h-full group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] h-full flex flex-col transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04] hover:-translate-y-1">
                    {/* Image */}
                    <div className="h-52 relative overflow-hidden">
                      {event.imageUrl ? (
                        <img src={event.imageUrl} alt={event.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${event.imageGradient}`} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#08080f] via-transparent to-transparent" />

                      {/* Live Badge */}
                      {event.isLive && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#39ff14]/90 text-black text-[10px] font-black flex items-center gap-1 shadow-[0_0_12px_rgba(57,255,20,0.4)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                          LIVE ON-CHAIN
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-base mb-2 leading-snug group-hover:text-[#00f0ff] transition-colors">
                        {event.name}
                      </h3>

                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">calendar_month</span>
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">location_on</span>
                          <span className="truncate max-w-[140px]">{event.venue}</span>
                        </div>
                      </div>

                      {/* Availability Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-[11px] mb-1.5">
                          <span className="text-gray-500">Ticket availability for {Math.round((event.available / event.total) * 100)}%</span>
                          <span className="text-gray-500">Price availability</span>
                        </div>
                        <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#00f0ff] to-[#39ff14]"
                            style={{ width: `${(event.available / event.total) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* View Event Button */}
                      <button className="w-full py-2.5 rounded-lg border border-white/15 text-white text-sm font-medium hover:bg-white/5 hover:border-white/25 transition-all duration-200 mt-auto">
                        View Event
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-gray-700 block mb-4">search_off</span>
            <h2 className="text-xl font-bold text-gray-400 mb-2">No events found</h2>
            <p className="text-gray-600 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
