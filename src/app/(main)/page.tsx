'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { DualInline, DualLogo } from './DualLogo'

interface Event {
  id: string
  name: string
  date: string
  venue: string
  tier: string
  price: number
  originalPrice: number
  imageUrl?: string
  isLive?: boolean
  contractAddress?: string
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const VENUE_MAP: Record<string, string> = {
    'Electric Dreams — Sydney Harbour NYE 2026': 'Sydney Harbour Bridge',
    'Neon Horizon — Sydney Electronic Music Festival 2026': 'Hordern Pavilion, Sydney',
    'Burning Man 2026': 'Black Rock City, Nevada',
    'UEFA Champions League Final 2026': 'Allianz Arena, Munich',
    'Art Basel Miami Beach 2026': 'Miami Beach Convention Center',
    'Tokyo Game Show 2026': 'Makuhari Messe, Tokyo',
    'Sydney Opera House — Luminous Nights Concert': 'Sydney Opera House',
  }

  const IMAGE_MAP: Record<string, string> = {
    'Burning Man 2026': 'https://images.unsplash.com/photo-1504457047772-27faf1c00561?w=800&q=80',
    'UEFA Champions League Final 2026': 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&q=80',
    'Art Basel Miami Beach 2026': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
    'Tokyo Game Show 2026': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80',
    'Sydney Opera House — Luminous Nights Concert': 'https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?w=800&q=80',
  }

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/tickets')
        if (!res.ok) throw new Error('Failed to fetch events')
        const data = await res.json()
        const tickets = data.tickets || []

        const mapped: Event[] = tickets.map((t: any) => {
          const td = t.ticketData || {}
          const eventName = td.eventName || td.name || 'Event'
          return {
            id: t.id || t.objectId,
            name: eventName,
            date: td.eventDate || t.createdAt || '',
            venue: td.venue || VENUE_MAP[eventName] || '',
            tier: td.tier || td.ticketTier || 'General',
            price: td.price || td.originalPrice || 0,
            originalPrice: td.originalPrice || td.price || 0,
            imageUrl: td.imageUrl || IMAGE_MAP[eventName],
            isLive: !!t.blockchainTxHash,
            contractAddress: t.contractAddress || '0x41Cf...5aFF06',
          }
        })

        setEvents(mapped)
      } catch (err: any) {
        console.error('Failed to load events:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const uniqueTiers = ['all', ...Array.from(new Set(events.map((e) => e.tier)))]

  const filteredEvents = events.filter((event) => {
    return selectedFilter === 'all' || event.tier === selectedFilter
  })

  const liveCount = events.filter((e) => e.isLive).length

  return (
    <div className="min-h-screen">
      {/* Live Ticker */}
      <div className="w-full bg-[#0e0e0e] border-y border-[#474747]/20 py-3 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee">
          <span className="font-headline text-xs tracking-[0.2em] uppercase text-[#c6c6c6] flex items-center space-x-4">
            <span className="inline-block w-2 h-2 bg-[#39ff14] animate-pulse" />
            <span>{liveCount} live listings with on-chain price enforcement</span>
            <span className="mx-8 text-[#474747] opacity-30">|</span>
            <span className="inline-block w-2 h-2 bg-[#39ff14] animate-pulse" />
            <span><DualInline className="text-[#c6c6c6]" /> Network — ERC-721 tokenised tickets with anti-scalp enforcement</span>
            <span className="mx-8 text-[#474747] opacity-30">|</span>
            <span className="inline-block w-2 h-2 bg-[#39ff14] animate-pulse" />
            <span>Contract: 0x41Cf00E593c5623B00F812bC70Ee1A737C5aFF06</span>
            <span className="mx-8 text-[#474747] opacity-30">|</span>
            <span className="inline-block w-2 h-2 bg-[#39ff14] animate-pulse" />
            <span>{liveCount} live listings with on-chain price enforcement</span>
            <span className="mx-8 text-[#474747] opacity-30">|</span>
            <span className="inline-block w-2 h-2 bg-[#39ff14] animate-pulse" />
            <span><DualInline className="text-[#c6c6c6]" /> Network — ERC-721 tokenised tickets with anti-scalp enforcement</span>
          </span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 mt-12">
        {/* Hero / Editorial Header */}
        <header className="grid grid-cols-12 gap-8 mb-16">
          <div className="col-span-12 lg:col-span-7">
            <div className="mb-6">
              <DualLogo height={72} className="text-white md:hidden" />
              <DualLogo height={110} className="text-white hidden md:block" />
            </div>
            <h1 className="font-headline text-6xl md:text-8xl font-bold uppercase tracking-tight leading-none mb-6">
              Tickets.<br /><span className="text-[#39ff14]">Tokenised</span>
            </h1>
          </div>
          <div className="col-span-12 lg:col-span-5 flex flex-col justify-end pb-4 border-l border-[#474747]/20 pl-8">
            <p className="text-[#c6c6c6] text-lg leading-relaxed mb-8 max-w-sm">
              Curated high-stakes digital access for global events. Secured by the architectural integrity of <DualInline className="text-white" /> Network&apos;s on-chain enforcement.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#events">
                <button className="bg-[#39ff14] text-black font-headline font-bold text-xs uppercase tracking-widest px-8 py-4 transition-all hover:bg-[#2de010] hover:shadow-[0_0_20px_rgba(57,255,20,0.3)]">
                  View Collections
                </button>
              </a>
              <Link href="/marketplace">
                <button className="bg-transparent border-2 border-[#39ff14] text-[#39ff14] font-headline font-bold text-xs uppercase tracking-widest px-8 py-4 transition-all hover:bg-[#39ff14] hover:text-black">
                  Marketplace
                </button>
              </Link>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-6 md:space-y-0">
          <div className="flex flex-wrap gap-3">
            <span className="font-headline text-[10px] uppercase tracking-[0.3em] text-[#c6c6c6] w-full mb-2">Filter by Tier</span>
            {uniqueTiers.map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedFilter(tier)}
                className={`px-6 py-2 font-headline text-xs uppercase tracking-widest transition-colors ${
                  selectedFilter === tier
                    ? 'bg-[#39ff14] text-black font-bold shadow-[0_0_12px_rgba(57,255,20,0.25)]'
                    : 'bg-[#353535] text-white hover:bg-[#39ff14] hover:text-black'
                }`}
              >
                {tier === 'all' ? 'All' : tier}
              </button>
            ))}
          </div>
        </div>

        {/* Event Grid */}
        <div id="events">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col">
                <div className="aspect-[4/5] bg-[#1f1f1f] mb-6" />
                <div className="space-y-4">
                  <div className="h-6 w-3/4 bg-[#1f1f1f]" />
                  <div className="h-4 w-1/2 bg-[#1f1f1f]" />
                  <div className="h-12 bg-[#1f1f1f]" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-[#353535] block mb-4">cloud_off</span>
            <h2 className="font-headline text-xl font-bold text-[#919191] uppercase tracking-widest mb-2">Unable to load events</h2>
            <p className="text-[#c6c6c6] text-sm">Could not connect to the <DualInline className="text-[#c6c6c6]" /> network. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredEvents.map((event) => (
              <Link key={event.id} href={`/tickets/${event.id}`}>
                <article className="flex flex-col group cursor-pointer">
                  {/* Image */}
                  <div className="aspect-[4/5] overflow-hidden mb-6 relative">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1f1f1f] flex items-center justify-center">
                        <span className="material-symbols-outlined text-6xl text-[#353535]">confirmation_number</span>
                      </div>
                    )}
                    {/* Tier Badge */}
                    <div className="absolute top-0 right-0 bg-[#39ff14] text-black px-4 py-2 font-headline font-bold text-xs uppercase tracking-widest">
                      {event.tier}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="space-y-4">
                    <h3 className="font-headline text-2xl font-bold uppercase tracking-tight group-hover:text-[#39ff14] transition-colors">
                      {event.name}
                    </h3>

                    {/* Date & Venue */}
                    {(event.date || event.venue) && (
                      <div className="flex items-center gap-4 text-xs text-[#919191] font-headline uppercase tracking-widest">
                        {event.date && (
                          <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        )}
                        {event.venue && <span>{event.venue}</span>}
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-[#c6c6c6] font-headline">Original Price</p>
                        {event.originalPrice !== event.price && event.originalPrice > 0 && (
                          <p className="text-[#c7c6c6] line-through text-sm">${event.originalPrice.toFixed(2)}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-white font-headline">Current Floor</p>
                        <p className="text-3xl font-headline font-bold">${event.price.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Contract Address */}
                    <div className="p-4 bg-[#1b1b1b] border border-[#39ff14]/10">
                      <p className="text-[9px] text-[#39ff14]/60 font-mono uppercase mb-1">Contract Address</p>
                      <p className="text-[10px] text-white font-mono break-all opacity-80">{event.contractAddress}</p>
                    </div>

                    {/* CTA Button */}
                    <button className="w-full bg-white text-black py-4 font-headline font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#39ff14] hover:shadow-[0_0_15px_rgba(57,255,20,0.2)] transition-all">
                      View Event
                    </button>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {!loading && !error && filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-[#353535] block mb-4">search_off</span>
            <h2 className="font-headline text-xl font-bold text-[#919191] uppercase tracking-widest mb-2">No events found</h2>
            <p className="text-[#c6c6c6] text-sm">Try adjusting your filter criteria</p>
          </div>
        )}

        {/* End of Feed */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="mt-20 mb-12 border-t border-[#474747]/20 pt-8 text-center">
            <p className="font-headline text-[10px] uppercase tracking-[0.3em] text-[#39ff14]/40">End of Live Feed</p>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
