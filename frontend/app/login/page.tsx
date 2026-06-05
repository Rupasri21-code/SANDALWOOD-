'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, TreePine, ArrowLeft, Mail, Lock, Shield, Leaf, TrendingUp, Users, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import { Cormorant_Garamond } from 'next/font/google';

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['700'] });

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      toast.error('Please enter your credentials');
      return;
    }
    
    try {
      setLoading(true);
      const { error, role } = await signIn(identifier, password);
      
      if (error) {
        toast.error('Invalid credentials. Please try again.');
        setLoading(false);
        return;
      }
      
      toast.success('Welcome back!');
      setTimeout(() => {
        if (role === 'admin') {
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

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#06261C] overflow-x-hidden m-0 p-0 font-sans">
      
      {/* =========================================================
          LEFT SIDE: 47% - LOGIN PANEL
          ========================================================= */}
      <motion.div 
        className="w-full md:w-[47%] relative flex flex-col px-6 md:px-8 lg:px-16 py-8 md:py-10 z-30 flex-grow md:min-h-screen overflow-y-auto"
        initial={{ x: '-10%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: 'linear-gradient(135deg, #06261C 0%, #0B2F24 50%, #12372A 100%)',
        }}
      >
        {/* Subtle background particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={`lp-${i}`}
              className="absolute rounded-full bg-[#D9A441]"
              style={{ width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ opacity: [0, 0.3, 0], y: [0, -20] }}
              transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>
        
        {/* Top Header */}
        <div className="flex justify-between items-start w-full relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-[#D9A441] flex items-center justify-center">
              <TreePine className="w-6 h-6 text-[#D9A441]" />
            </div>
            <div>
              <div className="text-[14px] font-bold tracking-[3px] text-[#D9A441] uppercase leading-tight">Chandan Nilayam</div>
              <div className="text-[10px] tracking-widest text-[#C49A5A] uppercase mt-0.5">Investor Portal</div>
            </div>
          </div>
          
          <Link href="/home" className="inline-flex items-center gap-2 text-[#D9A441] hover:text-[#F7F0E4] hover:-translate-x-1 transition-all font-medium text-sm mt-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        {/* Login Form Area */}
        <div className="flex-1 flex flex-col justify-center w-full max-w-[420px] mx-auto mt-10 md:mt-12 mb-10 md:mb-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <h1 className={`text-[36px] md:text-[42px] text-[#F7F0E4] mb-2 ${cormorant.className}`}>Welcome Back</h1>
            <p className="text-[#F7F0E4]/90 text-sm mb-8">Login to continue to your investor portal</p>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C49A5A]" />
                <input
                  type="text"
                  placeholder="Email or Username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="off"
                  className="w-full h-[64px] bg-[rgba(255,255,255,0.04)] border border-[rgba(196,154,90,0.45)] rounded-[14px] pl-14 pr-5 text-[#F7F0E4] placeholder-white/40 focus:outline-none focus:border-[#D9A441] focus:shadow-[0_0_0_4px_rgba(217,164,65,0.12)] transition-all group-hover:border-[rgba(196,154,90,0.7)]"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C49A5A]" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full h-[64px] bg-[rgba(255,255,255,0.04)] border border-[rgba(196,154,90,0.45)] rounded-[14px] pl-14 pr-12 text-[#F7F0E4] placeholder-white/40 focus:outline-none focus:border-[#D9A441] focus:shadow-[0_0_0_4px_rgba(217,164,65,0.12)] transition-all group-hover:border-[rgba(196,154,90,0.7)]"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#C49A5A] hover:text-[#D9A441] transition-colors">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex justify-between items-center py-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border flex items-center justify-center transition-colors" style={{ backgroundColor: rememberMe ? '#C49A5A' : 'transparent', borderColor: '#C49A5A' }} onClick={() => setRememberMe(!rememberMe)}>
                  {rememberMe && <Check className="w-3 h-3 text-[#06261C]" />}
                </div>
                <span className="text-sm text-[#D8CBB3] group-hover:text-[#F7F0E4] transition-colors">Remember Me</span>
              </label>
              <Link href="#" className="text-sm text-[#D9A441] hover:text-[#F7F0E4] transition-colors">Forgot Password?</Link>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(196,154,90,0.4)' }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full h-[64px] rounded-[14px] bg-gradient-to-br from-[#D9A441] to-[#C49A5A] text-[#06261C] font-bold text-lg transition-all"
            >
              {loading ? <div className="w-6 h-6 border-2 border-[#06261C]/30 border-t-[#06261C] rounded-full animate-spin mx-auto" /> : 'Login'}
            </motion.button>
          </form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-center mt-6">
            <span className="text-[#D8CBB3] text-sm">Don't have an account? </span>
            <Link href="/home#investor-inquiry" className="text-[#D9A441] font-semibold hover:text-[#F7F0E4] transition-colors">Sign Up</Link>
          </motion.div>

        </div>

        {/* Bottom Trust Features */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-4 relative z-10 w-full mt-4"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
        >
          {[
            { icon: Shield, title: 'Secure & Trusted', desc: 'Your information is safe with us' },
            { icon: Leaf, title: 'Sustainable Future', desc: 'Invest in nature, grow with trust' },
            { icon: TrendingUp, title: 'Growth Focused', desc: 'Long term value for generations' }
          ].map((feat, i) => (
            <div key={i} className="flex-1 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full border border-[rgba(196,154,90,0.3)] flex items-center justify-center mb-3">
                <feat.icon className="w-5 h-5 text-[#D9A441] font-light" strokeWidth={1.5} />
              </div>
              <h4 className="text-[#F7F0E4] text-xs font-semibold mb-1">{feat.title}</h4>
              <p className="text-[#D8CBB3] text-[10px] leading-tight max-w-[120px]">{feat.desc}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* =========================================================
          RIGHT SIDE: 53% - CINEMATIC NATURE VISUAL
          ========================================================= */}
      <div className="w-full h-[30vh] min-h-[250px] md:min-h-screen md:h-auto md:w-[53%] relative overflow-hidden flex flex-col justify-end order-first md:order-last">
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center" 
          style={{ backgroundImage: 'url("/login-bg.png")' }} 
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#06261C] via-[#06261C]/20 to-transparent opacity-90" />
        <div className="absolute inset-0 z-0 bg-gradient-to-l from-[#06261C]/50 to-[#06261C] opacity-80" />
        
        {/* Animated Particles */}
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={`rp-${i}`}
              className="absolute rounded-full bg-[#D9A441]"
              style={{ 
                width: Math.random() * 3 + 1, 
                height: Math.random() * 3 + 1, 
                left: `${Math.random() * 100}%`, 
                top: `${Math.random() * 100}%`,
                filter: 'blur(1px)',
              }}
              animate={{ opacity: [0, 0.4, 0], y: [0, -100] }}
              transition={{ duration: 5 + Math.random() * 10, repeat: Infinity, delay: Math.random() * 5 }}
            />
          ))}
        </div>

        {/* Floating Leaves */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => {
             const startX = Math.random() * 100;
             return (
              <motion.div
                key={`leaf-${i}`}
                className="absolute"
                style={{ 
                  left: `${startX}%`, 
                  top: '-10%',
                  width: Math.random() * 20 + 20,
                  height: Math.random() * 20 + 20,
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%235B8A4D\' stroke=\'%233B6A2D\' stroke-width=\'1\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z\'/%3E%3Cpath d=\'M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12\'/%3E%3C/svg%3E")',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  opacity: 0.6
                }}
                animate={{ 
                  y: ['0vh', '110vh'],
                  x: [`${startX}%`, `${startX + (Math.random() * 20 - 10)}%`],
                  rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)]
                }}
                transition={{ 
                  duration: 15 + Math.random() * 10, 
                  repeat: Infinity, 
                  delay: Math.random() * 15,
                  ease: 'linear'
                }}
              />
            )
          })}
        </div>
        
        {/* Subtle emblem floating animation applied to the background image itself conceptually - but since bg is static, we'll just float a lighting effect */}
        <motion.div 
          className="absolute inset-0 z-10 pointer-events-none"
          animate={{ opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(circle at 65% 45%, rgba(217,164,65,0.15) 0%, transparent 60%)' }}
        />

        {/* Text and Stats Content */}
        <div className="relative z-20 w-full p-6 md:p-12 text-center pb-8 md:pb-20 flex flex-col items-center justify-center h-full md:h-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.6 }}>
            <h2 className={`text-[24px] md:text-[34px] text-[#D9A441] mb-2 md:mb-3 ${cormorant.className}`}>Grow with Nature. Invest with Confidence.</h2>
            <p className="max-w-lg mx-auto text-[13px] md:text-[15.5px] leading-relaxed mb-6 md:mb-10 font-semibold text-[#4ADE80] drop-shadow-[0_0_15px_rgba(74,222,128,0.7)] tracking-wide">
              A smarter path to long-term wealth through premium plantation assets. Join us in building a greener tomorrow with sandalwood plantations that create a lasting legacy.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-wrap justify-center gap-6 md:gap-12 border-t border-[rgba(196,154,90,0.2)] pt-6 md:pt-8 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.6 }}
          >
            {[
              { val: '1000+', lbl: 'Happy Investors', icon: Users },
              { val: '500+', lbl: 'Acres Planted', icon: Leaf },
              { val: '15+', lbl: 'Years of Trust', icon: Shield }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-4 text-left">
                <stat.icon className="w-6 h-6 text-[#D9A441] opacity-90" strokeWidth={1.5} />
                <div>
                  <div className="text-white font-bold text-lg leading-tight">{stat.val}</div>
                  <div className="text-[#D8CBB3] text-xs mt-0.5">{stat.lbl}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

    </div>
  );
}
