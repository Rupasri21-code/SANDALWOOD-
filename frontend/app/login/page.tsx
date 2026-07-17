'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, Shield, Leaf, TrendingUp, Users, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import LoginHeroArtwork from '@/components/LoginHeroArtwork';
import BrandLogo from '@/components/BrandLogo';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [assetStatus, setAssetStatus] = useState({
    background: false,
    frame: false,
    leaves: false,
  });
  const { signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    const checkImage = (src: string) =>
      new Promise<boolean>((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
      });

    Promise.all([
      checkImage('/login/background.webp'),
      checkImage('/login/tree-frame.webp'),
      checkImage('/login/leaves.svg'),
    ]).then(([background, frame, leaves]) => {
      setAssetStatus({ background, frame, leaves });
    });
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
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          toast.error('Could not connect to backend server. Please make sure the backend is running.');
        } else {
          toast.error(error.message || 'Invalid credentials. Please try again.');
        }
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
      }, 100);
    } catch (err) {
      console.error('Login error:', err);
      toast.error('An unexpected error occurred.');
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen md:h-screen w-full overflow-x-hidden md:overflow-hidden bg-[#08261F] font-['Montserrat',sans-serif]">
      <div className="flex min-h-screen md:h-screen flex-col md:flex-row">
        
        {/* LEFT SIDE - FORM (48%) */}
        <section className="w-full md:w-[48%] flex min-h-screen md:h-screen flex-col bg-[#08261F] text-[#F7F0E4] relative z-20 shadow-2xl overflow-y-auto md:overflow-hidden">
          <div className="flex items-center justify-between px-8 pt-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C49A5A]/30">
                <BrandLogo height={32} logoClassName="h-full w-full object-contain" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#C49A5A] font-bold">CHANDHAN NILAYAM</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#C49A5A] font-semibold">INVESTOR PORTAL</p>
              </div>
            </div>
            <Link href="/" className="text-[11px] font-semibold flex items-center gap-2 text-[#C49A5A] transition hover:text-[#F7F0E4]">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>

          <div className="mx-auto flex w-full max-w-[460px] flex-1 flex-col justify-center px-8 py-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-3">
              <h1 className="text-[48px] md:text-[56px] font-semibold leading-tight tracking-tight text-[#F7F0E4] font-['Cormorant_Garamond',serif]">Welcome Back</h1>
              <p className="text-[15px] text-[#B8C7BC] font-['Lora',serif]">Login to continue to your investor portal</p>
            </motion.div>

            <motion.form onSubmit={handleLogin} className="mt-10 space-y-5" autoComplete="off" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
              <div>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#C49A5A]" />
                  <input
                    type="text"
                    placeholder="Email or Username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    autoComplete="off"
                    className="w-full rounded-[12px] border border-[#C49A5A]/30 bg-[#061D17] px-14 py-4 text-sm text-[#F7F0E4] placeholder-[#B8C7BC]/60 transition duration-300 focus:border-[#C49A5A] focus:outline-none focus:ring-1 focus:ring-[#C49A5A]/50"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#C49A5A]" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full rounded-[12px] border border-[#C49A5A]/30 bg-[#061D17] px-14 py-4 pr-14 text-sm text-[#F7F0E4] placeholder-[#B8C7BC]/60 transition duration-300 focus:border-[#C49A5A] focus:outline-none focus:ring-1 focus:ring-[#C49A5A]/50"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#C49A5A] transition hover:text-[#F7F0E4]">
                    {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-[#B8C7BC] px-1">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="sr-only" />
                  <span className={`grid h-4 w-4 place-items-center rounded-[4px] border border-[#C49A5A] ${rememberMe ? 'bg-[#C49A5A]' : 'bg-transparent'} transition`}>
                    {rememberMe && <Check className="h-3 w-3 text-[#08261F]" />}
                  </span>
                  <span className="text-[#F7F0E4]">Remember Me</span>
                </label>
                <Link href="/forgot-password" className="text-[#D9B36D] transition hover:text-[#C49A5A]">Forgot Password?</Link>
              </div>

              <motion.button
                type="submit"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="mt-6 inline-flex h-14 w-full items-center justify-center rounded-[18px] bg-gradient-to-r from-[#C49A5A] to-[#D9B36D] text-[15px] font-bold text-[#08261F] transition duration-300 hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(196,154,90,0.3)]"
              >
                {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#08261F]/30 border-t-[#08261F]" /> : 'Login'}
              </motion.button>
            </motion.form>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-center mt-8 text-sm text-[#B8C7BC]">
              <span>Don't have an account?</span>{' '}
              <Link href="/home#investor-inquiry" className="font-semibold text-[#D9B36D] hover:text-[#C49A5A]">Sign Up</Link>
            </motion.div>
          </div>


        </section>

        {/* RIGHT SIDE - ARTWORK & HERO (52%) */}
        <section 
          className="relative w-full overflow-hidden md:w-[52%] bg-[#031A14] flex flex-col items-center justify-start min-h-[100vh] md:h-screen pt-[10vh] pb-[6vh] px-6"
          style={{
            backgroundImage: "url('/login/login-forest-bg.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-[rgba(3,20,14,0.65)] z-0 pointer-events-none" />

          {/* Floating Leaves */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <motion.div className="absolute top-[20%] left-[15%] text-[#4ADE80] opacity-40 blur-[1px]"
              animate={{ y: [0, 40, 0], x: [0, 20, 0], rotate: [0, 45, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
              <Leaf className="w-6 h-6 fill-current" />
            </motion.div>
            <motion.div className="absolute top-[50%] right-[10%] text-[#D9B36D] opacity-30"
              animate={{ y: [0, -30, 0], x: [0, -15, 0], rotate: [0, -30, 0] }} transition={{ duration: 12, repeat: Infinity, delay: 2, ease: "easeInOut" }}>
              <Leaf className="w-8 h-8 fill-current" />
            </motion.div>
            <motion.div className="absolute bottom-[20%] left-[25%] text-[#4ADE80] opacity-30 blur-[2px]"
              animate={{ y: [0, 25, 0], x: [0, 30, 0], rotate: [0, -20, 0] }} transition={{ duration: 15, repeat: Infinity, delay: 4, ease: "easeInOut" }}>
              <Leaf className="w-7 h-7 fill-current" />
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="relative z-10 flex flex-col items-center justify-end w-full h-full pb-4">
            
            {/* Soft Gold Glow behind tree */}
            <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[280px] h-[280px] bg-[#D9B36D]/20 blur-[80px] rounded-full pointer-events-none animate-pulse" />

            {/* Flexible Space to push text below the background frame */}
            <div className="flex-1 min-h-[300px] md:min-h-[40vh]" />

            {/* Heading */}
            <h2 
              className="font-['Cormorant_Garamond',serif] text-center text-[#D9B36D] font-semibold md:text-[32px] lg:text-[36px] text-[28px] drop-shadow-lg"
              style={{ lineHeight: '1.1' }}
            >
              Grow with Nature. Invest with Confidence.
            </h2>

            {/* Gap 14px */}
            <div className="h-[14px]" />

            {/* Subtitle */}
            <p className="text-center text-[#4ADE80] font-medium drop-shadow-md mt-2" style={{ fontSize: '15px' }}>
              A smarter way to build wealth and a greener future
            </p>

            {/* Gap */}
            <div className="h-[4vh] max-h-[38px] min-h-[20px]" />

            {/* Stats Cards */}
            <div className="flex w-full max-w-[580px] flex-col gap-3 sm:flex-row sm:justify-between px-2">
              {[
                { value: '1000+', label: 'Happy Investors', icon: Users },
                { value: '500+', label: 'Acres Planted', icon: Leaf },
                { value: '12+', label: 'Years of Trust', icon: Shield }
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={i} 
                    className="flex-1 flex flex-col items-center text-center py-3 px-2 rounded-[16px]"
                    style={{
                      backgroundColor: 'rgba(8, 35, 27, 0.70)',
                      border: '1px solid rgba(196,154,90,0.3)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)'
                    }}
                  >
                    <div className="flex text-[#D9B36D] mb-2">
                      <Icon className="h-5 w-5 stroke-[1.5]" />
                    </div>
                    <div className="text-[20px] font-bold text-[#F7F0E4] leading-none mb-1">{stat.value}</div>
                    <div className="text-[10px] font-medium text-[#F7F0E4] uppercase tracking-wider">{stat.label}</div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}
