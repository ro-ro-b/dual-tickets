'use client';

import { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

export default function AuthModal({ isOpen, onClose, onAuthenticated }: AuthModalProps) {
  const [step, setStep] = useState<'email' | 'otp' | 'loading'>('email');
  const [email, setEmail] = useState('icbuswell@gmail.com');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    setError(null);
    setStep('loading');
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStep('otp');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to send OTP');
        setStep('email');
      }
    } catch {
      setError('Network error');
      setStep('email');
    }
  };

  const handleLogin = async () => {
    setError(null);
    setStep('loading');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      if (res.ok) {
        setOtp('');
        setStep('email');
        onAuthenticated();
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid OTP');
        setStep('otp');
      }
    } catch {
      setError('Network error');
      setStep('otp');
    }
  };

  const handleClose = () => {
    setStep('email');
    setOtp('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1b1b1b] border border-[#474747]/20 max-w-sm w-full p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-headline font-bold uppercase tracking-widest text-white">Auth Required</h3>
          <button onClick={handleClose} className="p-1 -mr-1 text-[#919191] hover:text-white">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <p className="text-sm text-[#919191] mb-5">
          A one-time passcode is required to authorise on-chain actions.
        </p>

        {error && (
          <div className="bg-[#d4632a]/10 border border-[#d4632a]/20 px-3 py-2 text-[#d4632a] text-sm mb-4">
            {error}
          </div>
        )}

        {step === 'loading' && (
          <div className="flex flex-col items-center py-8">
            <div className="w-12 h-12 rounded-full border-2 border-[#39ff14]/30 border-t-[#39ff14] animate-spin mb-4" />
            <p className="text-[#919191] text-sm">Please wait...</p>
          </div>
        )}

        {step === 'email' && (
          <>
            <div className="mb-4">
              <label className="block text-[10px] font-headline font-bold text-[#919191] uppercase tracking-[0.3em] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#131313] border border-[#474747]/20 text-sm text-white placeholder:text-[#474747] focus:outline-none focus:border-[#39ff14]/30"
              />
            </div>
            <button
              onClick={handleSendOtp}
              disabled={!email}
              className="w-full py-3 bg-[#39ff14] text-black font-headline font-bold uppercase tracking-widest text-sm active:scale-[0.98] transition-all disabled:opacity-50 hover:shadow-[0_0_15px_rgba(57,255,20,0.3)]"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 'otp' && (
          <>
            <p className="text-xs text-[#919191] mb-3">
              Enter the code sent to <span className="text-[#39ff14]">{email}</span>
            </p>
            <div className="mb-4">
              <label className="block text-[10px] font-headline font-bold text-[#919191] uppercase tracking-[0.3em] mb-1.5">One-Time Passcode</label>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="Enter code..."
                autoFocus
                className="w-full px-4 py-2.5 bg-[#131313] border border-[#474747]/20 text-sm font-mono text-white tracking-widest placeholder:text-[#474747] focus:outline-none focus:border-[#39ff14]/30 text-center text-lg"
                onKeyDown={e => { if (e.key === 'Enter' && otp) handleLogin(); }}
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={!otp}
              className="w-full py-3 bg-[#39ff14] text-black font-headline font-bold uppercase tracking-widest text-sm active:scale-[0.98] transition-all disabled:opacity-50 hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] mb-3"
            >
              Verify & Continue
            </button>
            <button
              onClick={() => { setStep('email'); setOtp(''); setError(null); }}
              className="w-full py-2 text-[#919191] text-xs hover:text-white transition"
            >
              Resend code
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Utility: check auth status, returns true if authenticated
export async function checkAuth(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/status');
    const data = await res.json();
    return data.authenticated === true;
  } catch {
    return false;
  }
}
