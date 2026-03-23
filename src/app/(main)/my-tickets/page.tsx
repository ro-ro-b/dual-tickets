'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { DualInline } from '../DualLogo'

interface Ticket {
  id: string
  eventName: string
  date: string
  venue: string
  tier: 'general' | 'vip' | 'backstage'
  status: 'valid' | 'scanned' | 'collectible'
  section: string
  seat: string
  qrCode: string
  transactionHash: string
  mintedDate: string
  isLive?: boolean
  objectId?: string
  integrityHash?: string
  explorerUrl?: string
  ownerId?: string
}

const DUAL_CONTRACT = '0x41Cf00E593c5623B00F812bC70Ee1A737C5aFF06'
const BLOCKSCOUT = 'https://32f.blockv.io'

export default function MyTicketsPage() {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({})
  const [liveTickets, setLiveTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [transferModal, setTransferModal] = useState<string | null>(null)
  const [transferEmail, setTransferEmail] = useState('')
  const [transferring, setTransferring] = useState(false)
  const [verifying, setVerifying] = useState<string | null>(null)
  const [actionResult, setActionResult] = useState<{
    type: string
    success: boolean
    message: string
  } | null>(null)

  useEffect(() => {
    fetch('/api/tickets')
      .then((r) => r.json())
      .then((data) => {
        const tickets = data.tickets || []
        const mapped: Ticket[] = tickets.map((t: any) => ({
          id: t.id,
          eventName: t.ticketData?.eventName || t.ticketData?.name || 'Event Ticket',
          date: t.ticketData?.eventDate || t.createdAt?.split('T')[0] || '',
          venue: t.ticketData?.venue || 'DUAL Network',
          tier: (t.ticketData?.tier || 'general') as any,
          status: (t.status || 'valid') as any,
          section: t.ticketData?.section || 'On-Chain',
          seat: t.ticketData?.seat || 'NFT',
          qrCode: t.id?.slice(0, 12) || 'DUAL',
          transactionHash: t.blockchainTxHash || t.id?.slice(0, 16) || '',
          mintedDate: t.createdAt?.split('T')[0] || '',
          isLive: true,
          objectId: t.objectId || t.id,
          integrityHash: t.blockchainTxHash,
          explorerUrl: t.blockchainTxHash
            ? `${BLOCKSCOUT}/token/${DUAL_CONTRACT}`
            : undefined,
          ownerId: t.ownerId,
        }))
        setLiveTickets(mapped)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const allTickets = liveTickets

  const toggleFlip = (ticketId: string) => {
    setFlipped((prev) => ({ ...prev, [ticketId]: !prev[ticketId] }))
  }

  const handleTransfer = async (ticketId: string) => {
    if (!transferEmail) return
    setTransferring(true)
    try {
      const res = await fetch(`/api/tickets/${ticketId}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientEmail: transferEmail }),
      })
      const data = await res.json()
      if (data.success) {
        setActionResult({ type: 'transfer', success: true, message: `Transferred to ${transferEmail}` })
      } else {
        setActionResult({ type: 'transfer', success: false, message: data.error || 'Transfer failed' })
      }
    } catch {
      setActionResult({ type: 'transfer', success: false, message: 'Network error' })
    }
    setTransferring(false)
    setTransferModal(null)
    setTransferEmail('')
    setTimeout(() => setActionResult(null), 5000)
  }

  const handleVerify = async (ticketId: string) => {
    setVerifying(ticketId)
    try {
      const res = await fetch(`/api/tickets/${ticketId}/verify`, { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setActionResult({ type: 'verify', success: true, message: 'Ticket verified on-chain!' })
      } else {
        setActionResult({ type: 'verify', success: false, message: data.error || 'Verification failed' })
      }
    } catch {
      setActionResult({ type: 'verify', success: false, message: 'Network error' })
    }
    setVerifying(null)
    setTimeout(() => setActionResult(null), 5000)
  }

  const getTierStyle = (tier: string) => {
    switch (tier) {
      case 'backstage':
        return 'bg-gradient-to-r from-[#d4632a] to-[#6c2bd9] text-white'
      case 'vip':
        return 'bg-[#d4632a]/20 border border-[#d4632a]/40 text-[#d4632a]'
      case 'premium':
        return 'bg-[#6c2bd9]/20 border border-[#6c2bd9]/40 text-[#6c2bd9]'
      default:
        return 'bg-[#e8a838]/15 border border-[#e8a838]/30 text-[#e8a838]'
    }
  }

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'backstage': return 'Backstage'
      case 'vip': return 'VIP'
      case 'premium': return 'Premium'
      default: return 'General'
    }
  }

  return (
    <div className="min-h-screen relative">
      <style>{`
        .ticket-card {
          perspective: 1000px;
          transform-style: preserve-3d;
          transition: transform 0.6s;
        }
        .ticket-card.flipped {
          transform: rotateY(180deg);
        }
        .ticket-front, .ticket-back {
          backface-visibility: hidden;
        }
        .ticket-back {
          transform: rotateY(180deg);
        }
        .ticket-slot {
          opacity: 0;
          animation: slideIn 0.5s ease forwards;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ticket-slot:nth-child(1) { animation-delay: 0s; }
        .ticket-slot:nth-child(2) { animation-delay: 0.08s; }
        .ticket-slot:nth-child(3) { animation-delay: 0.16s; }
        .ticket-slot:nth-child(4) { animation-delay: 0.24s; }
        .ticket-slot:nth-child(5) { animation-delay: 0.32s; }
        .ticket-slot:nth-child(6) { animation-delay: 0.4s; }
      `}</style>

      {/* Toast notification */}
      {actionResult && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl border backdrop-blur-xl shadow-2xl flex items-center gap-2.5 transition-all ${
            actionResult.success
              ? 'bg-[#39ff14]/10 border-[#39ff14]/30 text-[#39ff14]'
              : 'bg-[#d4632a]/10 border-[#d4632a]/30 text-[#d4632a]'
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {actionResult.success ? 'check_circle' : 'error'}
          </span>
          <span className="font-medium text-sm">{actionResult.message}</span>
        </div>
      )}

      {/* Transfer Modal */}
      {transferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#151210] border border-[#2a2420] rounded-2xl p-8 max-w-md w-full mx-4 shadow-[0_0_60px_rgba(232,168,56,0.1)]">
            <h3 className="text-xl font-bold text-white mb-2">Transfer Ticket</h3>
            <p className="text-gray-500 text-sm mb-6">Transfer this NFT ticket to another wallet via email</p>
            <input
              type="email"
              placeholder="Recipient email address"
              value={transferEmail}
              onChange={(e) => setTransferEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0d0b08] border border-[#2a2420] text-white text-sm placeholder-gray-600 focus:border-[#e8a838]/50 focus:outline-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setTransferModal(null); setTransferEmail('') }}
                className="flex-1 py-3 rounded-xl border border-[#2a2420] text-gray-400 text-sm font-medium hover:bg-[#1a1612] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleTransfer(transferModal)}
                disabled={transferring || !transferEmail}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#e8a838] to-[#d4632a] text-black font-bold text-sm hover:shadow-[0_0_20px_rgba(232,168,56,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {transferring ? (
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-sm">send</span>
                )}
                {transferring ? 'Sending...' : 'Transfer'}
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-4 text-center">
              On-chain transfer via <DualInline /> ebus.execute()
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 bg-gradient-to-r from-[#e8a838] via-[#f0c040] to-[#d4632a] bg-clip-text text-transparent">
            My Tickets
          </h1>
          <p className="text-gray-500">
            Your collection of on-chain verified event tickets
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-[#151210] border border-[#2a2420] animate-pulse" />
            ))}
          </div>
        ) : allTickets.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-7xl text-[#2a2420] block mb-6">
              confirmation_number
            </span>
            <h2 className="text-2xl font-bold text-white mb-3">No Tickets Yet</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm">
              You haven't minted any tickets yet. Explore upcoming events to get started.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#e8a838] to-[#d4632a] text-black font-bold text-sm rounded-xl hover:shadow-[0_0_20px_rgba(232,168,56,0.3)] transition-all"
            >
              <span className="material-symbols-outlined text-sm">explore</span>
              Browse Events
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="p-4 rounded-xl border border-[#2a2420] bg-[#151210]">
                <p className="text-xs text-gray-600 mb-1">Total Tickets</p>
                <p className="text-2xl font-black text-white">{allTickets.length}</p>
              </div>
              <div className="p-4 rounded-xl border border-[#2a2420] bg-[#151210]">
                <p className="text-xs text-gray-600 mb-1">On-Chain</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-black text-white">{allTickets.filter(t => t.isLive).length}</p>
                  <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse" />
                </div>
              </div>
              <div className="p-4 rounded-xl border border-[#2a2420] bg-[#151210]">
                <p className="text-xs text-gray-600 mb-1">Valid</p>
                <p className="text-2xl font-black text-[#e8a838]">{allTickets.filter(t => t.status === 'valid').length}</p>
              </div>
              <div className="p-4 rounded-xl border border-[#2a2420] bg-[#151210]">
                <p className="text-xs text-gray-600 mb-1">Used / Collectible</p>
                <p className="text-2xl font-black text-gray-500">
                  {allTickets.filter(t => t.status === 'scanned' || t.status === 'collectible').length}
                </p>
              </div>
            </div>

            {/* Ticket Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allTickets.map((ticket) => {
                const isFlipped = flipped[ticket.id]

                return (
                  <div key={ticket.id} className="ticket-slot">
                    <div
                      className={`ticket-card relative cursor-pointer ${isFlipped ? 'flipped' : ''}`}
                      onClick={() => toggleFlip(ticket.id)}
                    >
                      {/* ── FRONT ── */}
                      <div className="ticket-front">
                        <div className="rounded-2xl overflow-hidden border border-[#2a2420] bg-[#151210] hover:border-[#3a332c] transition-all duration-300">
                          {/* Top accent bar */}
                          <div className="h-1 bg-gradient-to-r from-[#e8a838] via-[#f0c040] to-[#d4632a]" />

                          <div className="p-6">
                            {/* Status row */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                {ticket.isLive && (
                                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#39ff14]/10 border border-[#39ff14]/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-pulse" />
                                    <span className="text-[10px] font-bold text-[#39ff14] uppercase tracking-wide">On-Chain</span>
                                  </div>
                                )}
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getTierStyle(ticket.tier)}`}>
                                  {getTierLabel(ticket.tier)}
                                </span>
                              </div>
                              <span className="material-symbols-outlined text-gray-600 text-sm">flip</span>
                            </div>

                            {/* Event name */}
                            <h3 className="text-xl font-bold text-white mb-3 leading-snug">
                              {ticket.eventName}
                            </h3>

                            {/* Date & Venue */}
                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-5">
                              <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-xs text-[#e8a838]">calendar_month</span>
                                {new Date(ticket.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-xs text-[#e8a838]">location_on</span>
                                <span className="truncate max-w-[140px]">{ticket.venue}</span>
                              </div>
                            </div>

                            {/* Section & Seat */}
                            <div className="grid grid-cols-2 gap-3 mb-5">
                              <div className="p-3 rounded-lg bg-[#0d0b08] border border-[#2a2420]">
                                <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-0.5">Section</p>
                                <p className="font-bold text-sm text-white">{ticket.section}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-[#0d0b08] border border-[#2a2420]">
                                <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-0.5">Seat</p>
                                <p className="font-bold text-sm text-white">{ticket.seat}</p>
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="grid grid-cols-3 gap-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => ticket.isLive ? setTransferModal(ticket.id) : null}
                                className={`py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-[#2a2420] text-gray-400 hover:border-[#e8a838]/30 hover:text-[#e8a838] ${!ticket.isLive ? 'opacity-40 cursor-not-allowed' : ''}`}
                              >
                                <span className="material-symbols-outlined text-xs">send</span>
                                Transfer
                              </button>
                              <button
                                onClick={() => ticket.isLive ? handleVerify(ticket.id) : null}
                                disabled={verifying === ticket.id}
                                className={`py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-[#2a2420] text-gray-400 hover:border-[#39ff14]/30 hover:text-[#39ff14] ${!ticket.isLive ? 'opacity-40 cursor-not-allowed' : ''}`}
                              >
                                {verifying === ticket.id ? (
                                  <span className="w-3 h-3 border-2 border-gray-600 border-t-[#39ff14] rounded-full animate-spin" />
                                ) : (
                                  <span className="material-symbols-outlined text-xs">verified</span>
                                )}
                                Verify
                              </button>
                              <button className="py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-[#2a2420] text-gray-400 hover:border-[#d4632a]/30 hover:text-[#d4632a]">
                                <span className="material-symbols-outlined text-xs">sell</span>
                                List
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ── BACK ── */}
                      <div className="ticket-back absolute inset-0">
                        <div className="h-full rounded-2xl overflow-hidden border border-[#2a2420] bg-[#151210] flex flex-col">
                          {/* Top accent bar */}
                          <div className="h-1 bg-gradient-to-r from-[#6c2bd9] via-[#e8a838] to-[#6c2bd9]" />

                          <div className="p-6 flex flex-col flex-1">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-5">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#e8a838] text-lg">token</span>
                                <span className="text-sm font-bold text-white">On-Chain Details</span>
                              </div>
                              <span className="material-symbols-outlined text-gray-600 text-sm">flip</span>
                            </div>

                            {/* Integrity Hash */}
                            <div className="mb-4">
                              <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1.5">Integrity Hash</p>
                              <p className="font-mono text-xs text-[#e8a838] break-all leading-relaxed bg-[#0d0b08] rounded-lg p-3 border border-[#2a2420]">
                                {ticket.transactionHash}
                              </p>
                            </div>

                            {/* Details Grid */}
                            <div className="space-y-2.5 mb-5">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Contract</span>
                                <span className="font-mono text-xs text-gray-300">
                                  {DUAL_CONTRACT.slice(0, 6)}...{DUAL_CONTRACT.slice(-4)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Standard</span>
                                <span className="font-mono text-xs text-gray-300">ERC-721</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Chain</span>
                                <span className="text-xs text-gray-300"><DualInline /> Network</span>
                              </div>
                              {ticket.ownerId && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-500">Owner</span>
                                  <span className="font-mono text-xs text-gray-300">
                                    {ticket.ownerId.slice(0, 8)}...{ticket.ownerId.slice(-4)}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Minted</span>
                                <span className="text-xs text-gray-300">
                                  {new Date(ticket.mintedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                            </div>

                            {/* Blockscout link */}
                            <div className="mt-auto">
                              {ticket.isLive && ticket.explorerUrl && (
                                <a
                                  href={ticket.explorerUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0d0b08] border border-[#2a2420] text-[#e8a838] text-xs font-semibold hover:border-[#e8a838]/30 transition-colors"
                                >
                                  <span className="material-symbols-outlined text-xs">open_in_new</span>
                                  View on Blockscout
                                </a>
                              )}
                              <p className="text-center text-[10px] text-gray-700 mt-3">Click to flip back</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Marketplace CTA */}
            <div className="mt-14 p-6 rounded-2xl border border-[#2a2420] bg-[#151210]">
              <div className="flex items-center justify-between gap-4 flex-col md:flex-row">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Explore the Marketplace</h3>
                  <p className="text-gray-500 text-sm">
                    Discover and trade verified tickets from other collectors
                  </p>
                </div>
                <Link
                  href="/tickets/marketplace"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#2a2420] text-[#e8a838] text-sm font-semibold hover:border-[#e8a838]/30 hover:shadow-[0_0_15px_rgba(232,168,56,0.1)] transition-all whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-sm">storefront</span>
                  Explore Marketplace
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
