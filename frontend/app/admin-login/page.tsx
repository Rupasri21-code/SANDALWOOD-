'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import BrandLogo from '@/components/BrandLogo';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter admin credentials');
      return;
    }
    
    try {
      setLoading(true);
      const { error, role } = await signIn(email, password);
      
      if (error) {
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          toast.error('Could not connect to backend server. Please make sure the backend is running.');
        } else {
          toast.error(error.message || 'Invalid credentials');
        }
        setLoading(false);
        return;
      }
      
      if (role !== 'admin') {
        toast.error('Unauthorized access. This area is for admins only.');
        setLoading(false);
        return;
      }

      toast.success('Admin authentication verified');
      setTimeout(() => {
        router.push('/admin');
      }, 500);
    } catch (err) {
      console.error("Admin Login error:", err);
      toast.error('An unexpected error occurred.');
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-6 font-sans relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at center, #0B2F24 0%, #032B1F 60%, #08120D 100%)',
      }}
    >
      {/* Subtle background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`ap-${i}`}
            className="absolute rounded-full bg-[#C49A5A]"
            style={{ width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ opacity: [0, 0.25, 0], y: [0, -40] }}
            transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
      </div>

      <motion.div 
        className="w-full max-w-[420px] bg-[#101A13]/90 border border-[#C49A5A]/35 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative z-10 text-center"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo Branding */}
        <div className="flex flex-col items-center justify-center mb-8">
          <BrandLogo height={54} className="mb-3" />
          <span className="font-serif text-lg font-bold text-white tracking-widest leading-none">DORNALA ADMIN</span>
          <span className="block text-[8px] text-[#C49A5A] tracking-[0.25em] uppercase font-bold mt-1.5 font-sans leading-none">Secure Terminal</span>
        </div>

        <h1 className="text-[26px] md:text-[30px] text-[#F7F0E4] mb-2 leading-none font-['Cormorant_Garamond',serif]">Admin Access</h1>
        <p className="text-[#E6D3B3] text-xs leading-relaxed mb-6">
          Authenticate to access administrative panels and manage logs.
        </p>

        {/* Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4" autoComplete="off">
          
          <div>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C49A5A]" />
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                className="w-full h-[58px] bg-white/[0.02] border border-[#C49A5A]/35 rounded-2xl pl-12 pr-5 text-xs text-[#F7F0E4] placeholder-white/30 focus:outline-none focus:border-[#C49A5A] focus:shadow-[0_0_0_4px_rgba(196,154,90,0.08)] transition-all"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C49A5A]" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full h-[58px] bg-white/[0.02] border border-[#C49A5A]/35 rounded-2xl pl-12 pr-12 text-xs text-[#F7F0E4] placeholder-white/30 focus:outline-none focus:border-[#C49A5A] focus:shadow-[0_0_0_4px_rgba(196,154,90,0.08)] transition-all"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#C49A5A] hover:text-[#F7F0E4] transition-colors">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-[58px] rounded-2xl bg-gradient-to-br from-[#C49A5A] to-[#8B5E3C] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Authenticate Access'}
          </Button>

        </form>

        {/* Secure Note */}
        <div className="flex items-start gap-2.5 bg-red-950/20 border border-red-500/20 p-4 rounded-xl text-left mt-8">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-red-300 leading-normal font-sans">
            This portal is restricted to authorized administrative personnel only. All logins and modifications are securely audited.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/home" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C49A5A] hover:text-white transition-colors uppercase tracking-wider">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Website
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
