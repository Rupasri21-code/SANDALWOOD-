'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, TreePine, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import { Cormorant_Garamond } from 'next/font/google';

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['700'] });

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your credentials');
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error('Invalid credentials. Please try again.');
        setLoading(false);
        return;
      }
      
      toast.success('Welcome back!');
      setTimeout(() => {
        if (profile?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/portal');
        }
      }, 500);
    } catch (err) {
      console.error("Login error:", err);
      toast.error('An unexpected error occurred.');
      setLoading(false);
    }
  };

  // Generate golden particles for the left panel
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    left: `${Math.random() * 100}%`,
    duration: 15 + Math.random() * 15,
    delay: Math.random() * 5,
  }));

  // Define precise leaf positions to match Model 2 placement organically
  const leaves = [
    { id: 0, size: 70, startX: 80, startY: 10, delay: 0.2, color: '#12372A', duration: 15, rotateDir: 1 }, // Top right
    { id: 1, size: 55, startX: 65, startY: 20, delay: 1.5, color: '#2F5D3F', duration: 13, rotateDir: -1 }, // Top right inner
    { id: 2, size: 85, startX: 5, startY: 80, delay: 0.5, color: '#12372A', duration: 16, rotateDir: 1 }, // Bottom left
    { id: 3, size: 60, startX: 20, startY: 70, delay: 2.0, color: '#6B7A3D', duration: 14, rotateDir: -1 }, // Bottom left inner
    { id: 4, size: 65, startX: 5, startY: 30, delay: 1.0, color: '#2F5D3F', duration: 15, rotateDir: 1 }, // Near center split top
    { id: 5, size: 50, startX: 10, startY: 60, delay: 2.5, color: '#6B7A3D', duration: 13, rotateDir: -1 }, // Near center split bottom
    { id: 6, size: 45, startX: 85, startY: 60, delay: 1.2, color: '#2F5D3F', duration: 14, rotateDir: 1 }, // Right edge
    { id: 7, size: 55, startX: 75, startY: 85, delay: 0.8, color: '#12372A', duration: 16, rotateDir: -1 }, // Bottom right
    { id: 8, size: 40, startX: 30, startY: 15, delay: 2.2, color: '#6B7A3D', duration: 12, rotateDir: 1 }, // Top near emblem
    { id: 9, size: 45, startX: 65, startY: 75, delay: 1.8, color: '#2F5D3F', duration: 15, rotateDir: -1 }, // Bottom near emblem
  ];

  if (!mounted) return null;

  return (
    <div className="h-screen w-full flex bg-[#0B2F24] overflow-hidden m-0 p-0 font-sans">
      
      {/* =========================================================
          LEFT SIDE: 50% - LOGIN PANEL
          ========================================================= */}
      <motion.div 
        className="w-full md:w-[50%] relative flex flex-col items-center justify-center px-10 lg:px-20 z-30"
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: 'linear-gradient(180deg, #0B2F24 0%, #12372A 50%, #1A4A38 100%)',
        }}
      >
        {/* Subtle vignette & Particles */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-[#D4AF37]"
              style={{ width: p.size, height: p.size, left: p.left, bottom: '-5%' }}
              animate={{ 
                y: ['0vh', '-110vh'],
                opacity: [0, 0.6, 0.6, 0],
                x: [0, Math.sin(p.id) * 30, 0]
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "linear"
              }}
            />
          ))}
        </div>
        
        <div className="w-full max-w-[460px] relative z-10 flex flex-col h-full justify-center">
          
          {/* Logo - Top Left inside panel */}
          <motion.div 
            className="absolute top-12 left-0 flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <TreePine className="w-10 h-10 text-[#D4AF37]" />
            <span className="text-[13px] font-bold tracking-[0.25em] text-[#D4AF37] uppercase leading-tight">
              Dornala<br/>Sandalwood<br/>Investments
            </span>
          </motion.div>

          <div className="mt-24">
            {/* Welcome Text */}
            <motion.div 
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h1 className={`text-[42px] lg:text-[46px] text-[#F7F0E4] leading-[1.1] mb-2 ${cormorant.className}`}>
                Welcome Back
              </h1>
              <p className="text-[#E6D3B3] text-[16px] tracking-wide">
                Login to continue
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5" noValidate>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-[52px] bg-transparent border border-[rgba(212,175,55,0.45)] rounded-[10px] px-5 text-[16px] text-[#F7F0E4] placeholder-[#E6D3B3] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-[52px] bg-transparent border border-[rgba(212,175,55,0.45)] rounded-[10px] pl-5 pr-12 text-[16px] text-[#F7F0E4] placeholder-[#E6D3B3] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37] hover:text-[#F7F0E4] transition-colors"
                  >
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center justify-between pt-1 pb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.4 }}
              >
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div 
                    className="flex items-center justify-center w-5 h-5 border border-[rgba(212,175,55,0.45)] rounded transition-colors group-hover:border-[#D4AF37]"
                    style={{ backgroundColor: rememberMe ? '#D4AF37' : 'transparent', borderColor: rememberMe ? '#D4AF37' : 'rgba(212,175,55,0.45)' }}
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    {rememberMe && <Check className="w-3.5 h-3.5 text-[#0B2F24]" strokeWidth={3} />}
                  </div>
                  <span className="text-[14px] text-[#E6D3B3] group-hover:text-[#F7F0E4] transition-colors">Remember Me</span>
                </label>
                <Link href="#" className="text-[14px] text-[#D4AF37] hover:text-[#F7F0E4] transition-colors font-medium">
                  Forgot Password?
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.4 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full h-[54px] rounded-[10px] bg-[#D4AF37] text-[#0B2F24] font-semibold text-[16px] tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-[0_4px_14px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.4)]"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-[#0B2F24]/30 border-t-[#0B2F24] rounded-full animate-spin" />
                  ) : (
                    'Login'
                  )}
                </motion.button>
              </motion.div>
            </form>

            <motion.div 
              className="mt-8 text-center sm:text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.4 }}
            >
              <p className="text-[15px] text-[#E6D3B3]">
                Don't have an account?{' '}
                <Link href="/home#investor-inquiry" className="text-[#D4AF37] font-semibold hover:text-[#F7F0E4] transition-colors">
                  Sign Up
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* =========================================================
          RIGHT SIDE: 50% - WOOD TEXTURE PANEL
          ========================================================= */}
      <motion.div 
        className="hidden md:flex md:w-[50%] relative h-full overflow-hidden flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0 }}
        style={{ backgroundColor: '#4A2B1D' }}
      >
        {/* Realistic Vertical Wood Grain Background */}
        {/* 1. Base Gradient for warm brown tone and soft lighting */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(circle at 50% 40%, #8B5E3C 0%, #5B3A29 60%, #3B2416 100%)',
          }}
        />
        
        {/* 2. Vertical Wood Grain lines using SVG Fractal Noise */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply" 
             style={{ 
               backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 400 400%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22wood%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.01 0.4%22 numOctaves=%224%22 seed=%225%22/%3E%3CfeColorMatrix type=%22matrix%22 values=%221 0 0 0 0.2  0 0.8 0 0 0.1  0 0 0.6 0 0  0 0 0 1 0%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23wood)%22/%3E%3C/svg%3E")',
             }} />

        {/* 3. Subtle Vertical Stripes for realistic plank feel */}
        <div 
          className="absolute inset-0 z-0 opacity-20 mix-blend-color-burn"
          style={{
            background: 'repeating-linear-gradient(to right, transparent 0px, transparent 10px, rgba(59, 36, 22, 0.4) 11px, rgba(59, 36, 22, 0.1) 20px)'
          }}
        />

        {/* Subtle Light Movement Animation over Wood */}
        <motion.div
          className="absolute inset-0 z-0 opacity-30 mix-blend-overlay pointer-events-none"
          animate={{ opacity: [0.2, 0.6, 0.2], backgroundPosition: ['0% 0%', '20% 10%', '0% 0%'] }}
          transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
          style={{
            background: 'radial-gradient(circle at 50% 30%, #C49A5A 0%, transparent 65%)',
            backgroundSize: '120% 120%'
          }}
        />

        {/* Edge Shadows for depth */}
        <div className="absolute inset-0 z-0 shadow-[inset_0_0_150px_rgba(20,10,5,0.95)] pointer-events-none" />

        {/* Centerpiece: Highly Detailed Carved Tree Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: [0.98, 1.02, 0.98] }}
          transition={{ 
            opacity: { delay: 0.4, duration: 0.8, ease: "easeOut" },
            scale: { duration: 8, ease: "easeInOut", repeat: Infinity }
          }}
          className="relative z-10 flex items-center justify-center w-[360px] h-[360px] lg:w-[430px] lg:h-[430px] rounded-full"
          style={{
            filter: 'drop-shadow(0 25px 45px rgba(0,0,0,0.6))'
          }}
        >
          {/* Outer Carved Bezel */}
          <div className="absolute inset-0 rounded-full" style={{
            background: 'linear-gradient(135deg, #A97142, #4A2B1D)',
            boxShadow: 'inset 5px 5px 12px rgba(255,255,255,0.15), inset -8px -8px 20px rgba(0,0,0,0.8)',
            padding: '16px'
          }}>
            {/* Inner Recessed Area */}
            <div className="w-full h-full rounded-full relative overflow-hidden" style={{
              background: '#2A170D',
              boxShadow: 'inset 12px 16px 30px rgba(0,0,0,0.95), inset -5px -5px 15px rgba(196,154,90,0.15)'
            }}>
              {/* Inner wood grain for the recess */}
              <div className="absolute inset-0 opacity-40 mix-blend-multiply" 
                   style={{ 
                     backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.01 0.5%22 numOctaves=%223%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")',
                   }} />
              
              {/* The Highly Detailed Tree of Life SVG */}
              <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full p-4 drop-shadow-[0_4px_6px_rgba(0,0,0,1)]">
                <defs>
                  {/* Luxury Emboss Filter for the Tree */}
                  <filter id="luxury-emboss" x="-20%" y="-20%" width="140%" height="140%">
                    {/* Shadow */}
                    <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.9" result="shadow" />
                    {/* Highlight/Bevel */}
                    <feOffset dx="-1.5" dy="-1.5" in="SourceAlpha" result="bevel-offset" />
                    <feGaussianBlur stdDeviation="1.5" in="bevel-offset" result="bevel-blur" />
                    <feComposite operator="out" in="SourceAlpha" in2="bevel-blur" result="bevel-inverse" />
                    <feFlood floodColor="#E6B981" floodOpacity="0.4" result="bevel-color" />
                    <feComposite operator="in" in="bevel-color" in2="bevel-inverse" result="bevel-highlight" />
                    
                    <feMerge>
                      <feMergeNode in="shadow" />
                      <feMergeNode in="SourceGraphic" />
                      <feMergeNode in="bevel-highlight" />
                    </feMerge>
                  </filter>
                </defs>
                <g filter="url(#luxury-emboss)">
                  {/* Detailed Trunk */}
                  <path d="M 185 340 C 185 260, 195 220, 200 200 C 205 220, 215 260, 215 340 Z" fill="#8B5E3C" />
                  
                  {/* Sweeping Branches */}
                  <g stroke="#8B5E3C" strokeLinecap="round" fill="none">
                    <path d="M 200 240 Q 140 200 90 170" strokeWidth="16" />
                    <path d="M 200 240 Q 260 200 310 170" strokeWidth="16" />
                    <path d="M 200 210 Q 130 140 100 100" strokeWidth="14" />
                    <path d="M 200 210 Q 270 140 300 100" strokeWidth="14" />
                    <path d="M 200 190 Q 160 100 150 50" strokeWidth="12" />
                    <path d="M 200 190 Q 240 100 250 50" strokeWidth="12" />
                    <path d="M 200 180 Q 200 100 200 40" strokeWidth="12" />
                    {/* Sub-branches */}
                    <path d="M 145 200 Q 100 160 60 140" strokeWidth="8" />
                    <path d="M 255 200 Q 300 160 340 140" strokeWidth="8" />
                    <path d="M 150 135 Q 110 90 90 60" strokeWidth="8" />
                    <path d="M 250 135 Q 290 90 310 60" strokeWidth="8" />
                    <path d="M 180 110 Q 160 60 120 40" strokeWidth="8" />
                    <path d="M 220 110 Q 240 60 280 40" strokeWidth="8" />
                  </g>

                  {/* Deep Roots */}
                  <g stroke="#8B5E3C" strokeLinecap="round" fill="none">
                    <path d="M 195 330 Q 130 360 70 380" strokeWidth="14" />
                    <path d="M 205 330 Q 270 360 330 380" strokeWidth="14" />
                    <path d="M 190 340 Q 150 380 110 410" strokeWidth="10" />
                    <path d="M 210 340 Q 250 380 290 410" strokeWidth="10" />
                    <path d="M 185 340 Q 170 390 160 420" strokeWidth="8" />
                    <path d="M 215 340 Q 230 390 240 420" strokeWidth="8" />
                    <path d="M 200 340 Q 200 390 200 430" strokeWidth="12" />
                  </g>

                  {/* Intricate Canopy composed of 150 individual carved leaf shapes */}
                  {Array.from({ length: 150 }).map((_, i) => {
                    const angle = (i * 2.4) * (Math.PI / 180);
                    // Create an organic dense circular canopy
                    const radius = 30 + Math.random() * 125;
                    const cx = 200 + Math.cos(angle) * radius;
                    const cy = 160 + Math.sin(angle) * (radius * 0.85);
                    const rot = Math.random() * 360;
                    const scale = 0.6 + Math.random() * 0.6;
                    return (
                      <path 
                        key={i} 
                        d="M0,0 C8,-12 20,-12 28,0 C20,12 8,12 0,0" 
                        transform={`translate(${cx}, ${cy}) rotate(${rot}) scale(${scale})`} 
                        fill="#8B5E3C" 
                      />
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Realistic Sharp Leaves Animation */}
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
          {leaves.map((leaf) => (
            <motion.div
              key={leaf.id}
              className="absolute"
              style={{ 
                width: leaf.size, 
                height: leaf.size, 
                color: leaf.color, 
                left: `${leaf.startX}%`, 
                top: `${leaf.startY}%`,
                filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.65)) drop-shadow(0 5px 10px rgba(0,0,0,0.4)) saturate(1.2)'
              }}
              initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
              animate={{ 
                opacity: 1, // Stay fully opaque and sharp
                x: [0, (Math.random() * 50 - 25), 0],
                y: [0, (Math.random() * 50 - 25), 0],
                rotate: [0, 180 * leaf.rotateDir, 360 * leaf.rotateDir]
              }}
              transition={{
                x: { duration: leaf.duration * 1.2, repeat: Infinity, ease: 'easeInOut', delay: leaf.delay },
                y: { duration: leaf.duration * 1.5, repeat: Infinity, ease: 'easeInOut', delay: leaf.delay },
                rotate: { duration: leaf.duration * 2, repeat: Infinity, ease: 'linear', delay: leaf.delay },
                opacity: { duration: 1.5, ease: 'easeIn', delay: leaf.delay } // Quick fade in, then stay visible
              }}
            >
              {/* Highly detailed photorealistic SVG Leaf */}
              <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                  <linearGradient id={`leafGrad-${leaf.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={leaf.color} stopOpacity="1" />
                    <stop offset="100%" stopColor="#0B2F24" stopOpacity="0.95" />
                  </linearGradient>
                  {/* Subtle inner shadow for leaf thickness */}
                  <filter id={`leafDepth-${leaf.id}`}>
                    <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodColor="#ffffff" floodOpacity="0.25" />
                    <feDropShadow dx="-1" dy="-1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.6" />
                  </filter>
                </defs>
                <path d="M50 2C30 15 15 35 15 65C15 85 35 95 50 95C65 95 85 85 85 65C85 35 70 15 50 2Z" fill={`url(#leafGrad-${leaf.id})`} filter={`url(#leafDepth-${leaf.id})`} />
                <path d="M50 2 Q 55 50 50 95" stroke="#061A14" strokeWidth="2" fill="none" opacity="0.8" />
                <path d="M50 25 Q 35 35 20 30" stroke="#061A14" strokeWidth="1.5" fill="none" opacity="0.7" />
                <path d="M50 40 Q 65 50 80 45" stroke="#061A14" strokeWidth="1.5" fill="none" opacity="0.7" />
                <path d="M50 55 Q 35 65 20 60" stroke="#061A14" strokeWidth="1.5" fill="none" opacity="0.7" />
                <path d="M50 70 Q 65 80 80 75" stroke="#061A14" strokeWidth="1.5" fill="none" opacity="0.7" />
              </svg>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
