'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthModalProps } from '@/shared/types/auth';

export default function AuthModal({ isOpen, onClose, activeTab, setActiveTab }: AuthModalProps) {
  const router = useRouter();
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });
  const [signinData, setSigninData] = useState({ email: '', password: '' });
  const [_hoverClose, setHoverClose] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.username || !signupData.email || !signupData.password) {
      return;
    }
    onClose();
    try {
      await router.push('/archive');
    } catch (error) {
      throw error
    }
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signinData.email || !signinData.password) {
      return;
    }
    onClose();
    try {
      await router.push('/archive');
    } catch (error) {
      throw error
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md bg-[#1b1e26] rounded-2xl border-2 border-[#232730] p-8 transform transition-transform"
        style={{
          boxShadow: '-12px -12px 24px rgba(48, 54, 70, 0.5), 12px 12px 24px rgba(0, 0, 0, 0.8), inset 1px 1px 1px rgba(255,255,255,0.05), 0 0 60px rgba(152, 220, 72, 0.08)'
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
          style={{
            background: 'linear-gradient(90deg, #98dc48, transparent 20%, transparent 80%, #9d72ff)',
            opacity: 0.7,
          }}
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-[#555] hover:text-[#98dc48] transition text-2xl leading-none"
          onMouseEnter={() => setHoverClose(true)}
          onMouseLeave={() => setHoverClose(false)}
        >
          ✕
        </button>

        <div className="text-base sm:text-lg font-bold text-white mb-2">
          Join the Museum
        </div>
        <div className="text-sm text-[#7a8699] mb-6">
          Create your account to mint your first performance asset.
        </div>

        <div className="flex gap-0 mb-6 border-b-2 border-[#232730]">
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-3 font-semibold text-sm transition ${
              activeTab === 'signup'
                ? 'text-[#98dc48] border-b-2 border-[#98dc48] -mb-0.5'
                : 'text-[#555] border-b-2 border-transparent -mb-0.5'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-3 font-semibold text-sm transition ${
              activeTab === 'signin'
                ? 'text-[#98dc48] border-b-2 border-[#98dc48] -mb-0.5'
                : 'text-[#555] border-b-2 border-transparent -mb-0.5'
            }`}
          >
            Sign In
          </button>
        </div>

        {activeTab === 'signup' && (
          <div>
            <form className="space-y-4 mb-6" onSubmit={handleSignup}>
              <div className="space-y-1.5">
                <label
                  className="block text-xs uppercase tracking-wider text-[#8fa0b3]"
                  style={{ fontFamily: "'VT323', monospace" }}
                >
                  Username
                </label>
                <input
                  type="text"
                  placeholder="YourLegendHandle"
                  value={signupData.username}
                  onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f1116] border-2 border-[#2a2e38] rounded-lg text-white placeholder-[#7a8699] focus:border-[#98dc48] focus:outline-none transition"
                  style={{ fontFamily: "'Chakra Petch', sans-serif" }}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className="block text-xs uppercase tracking-wider text-[#8fa0b3]"
                  style={{ fontFamily: "'VT323', monospace" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@domain.com"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f1116] border-2 border-[#2a2e38] rounded-lg text-white placeholder-[#7a8699] focus:border-[#98dc48] focus:outline-none transition"
                  style={{ fontFamily: "'Chakra Petch', sans-serif" }}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className="block text-xs uppercase tracking-wider text-[#8fa0b3]"
                  style={{ fontFamily: "'VT323', monospace" }}
                >
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f1116] border-2 border-[#2a2e38] rounded-lg text-white placeholder-[#7a8699] focus:border-[#98dc48] focus:outline-none transition"
                  style={{ fontFamily: "'Chakra Petch', sans-serif" }}
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 mt-2 bg-[#1b1e26] text-[#98dc48] border-2 border-[#5c852b] rounded-lg font-bold text-xs hover:shadow-lg transition"
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '0.65rem',
                  boxShadow: '-4px -4px 10px rgba(60, 70, 80, 0.3), 4px 4px 10px rgba(0, 0, 0, 0.8), inset 0 0 10px rgba(152, 220, 72, 0.1)'
                }}
              >
                Create Account
              </button>
            </form>
          </div>
        )}

        {activeTab === 'signin' && (
          <div>
            <form className="space-y-4 mb-6" onSubmit={handleSignin}>
              <div className="space-y-1.5">
                <label
                  className="block text-xs uppercase tracking-wider text-[#8fa0b3]"
                  style={{ fontFamily: "'VT323', monospace" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@domain.com"
                  value={signinData.email}
                  onChange={(e) => setSigninData({ ...signinData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f1116] border-2 border-[#2a2e38] rounded-lg text-white placeholder-[#7a8699] focus:border-[#98dc48] focus:outline-none transition"
                  style={{ fontFamily: "'Chakra Petch', sans-serif" }}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className="block text-xs uppercase tracking-wider text-[#8fa0b3]"
                  style={{ fontFamily: "'VT323', monospace" }}
                >
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={signinData.password}
                  onChange={(e) => setSigninData({ ...signinData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f1116] border-2 border-[#2a2e38] rounded-lg text-white placeholder-[#7a8699] focus:border-[#98dc48] focus:outline-none transition"
                  style={{ fontFamily: "'Chakra Petch', sans-serif" }}
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 mt-2 bg-[#1b1e26] text-[#98dc48] border-2 border-[#5c852b] rounded-lg font-bold text-xs hover:shadow-lg transition"
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '0.65rem',
                  boxShadow: '-4px -4px 10px rgba(60, 70, 80, 0.3), 4px 4px 10px rgba(0, 0, 0, 0.8), inset 0 0 10px rgba(152, 220, 72, 0.1)'
                }}
              >
                Sign In
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
