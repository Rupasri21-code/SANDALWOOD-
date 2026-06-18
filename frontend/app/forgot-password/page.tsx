'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TreePine, ArrowLeft, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1'}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      setSuccess(true);
      toast.success('Reset email sent! Check your inbox.');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#06261C] p-4 font-sans">
      <div className="w-full max-w-md bg-[#12372A] rounded-2xl p-8 shadow-2xl border border-white/5 relative overflow-hidden">
        
        {/* Background Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D9A441] rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border border-[#D9A441] flex items-center justify-center mb-6">
            <TreePine className="w-8 h-8 text-[#D9A441]" />
          </div>

          <h1 className="text-2xl text-[#F7F0E4] mb-2 font-semibold">Forgot Password</h1>
          
          {success ? (
            <div className="text-center w-full">
              <p className="text-[#D8CBB3] mb-6 text-sm leading-relaxed">
                We've sent a password reset link to <span className="text-[#D9A441] font-medium">{email}</span>. 
                Please check your inbox and spam folder.
              </p>
              <Link href="/login" className="inline-flex items-center text-sm text-[#D9A441] hover:text-[#F7F0E4] transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </div>
          ) : (
            <div className="w-full">
              <p className="text-[#D8CBB3] mb-8 text-sm leading-relaxed text-center">
                Enter your registered email address below and we'll send you a link to reset your password.
              </p>
              
              <form onSubmit={handleSubmit} className="w-full space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#D8CBB3] mb-2 ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-[#8A9B8E] group-focus-within:text-[#D9A441] transition-colors" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3.5 bg-[#0B2F24] border border-[#1A4D3B] rounded-xl text-[#F7F0E4] placeholder-[#8A9B8E] focus:ring-1 focus:ring-[#D9A441] focus:border-[#D9A441] transition-all outline-none"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-[#06261C] bg-[#D9A441] hover:bg-[#F2C059] focus:outline-none transition-all shadow-lg hover:shadow-[#D9A441]/20 active:scale-[0.98]"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link href="/login" className="inline-flex items-center text-sm text-[#8A9B8E] hover:text-[#F7F0E4] transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
