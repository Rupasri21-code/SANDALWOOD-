'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { TreePine, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Invalid or missing reset token.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1'}/auth/reset-password-confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setSuccess(true);
      toast.success('Password reset successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token && !success) {
    return (
      <div className="text-center w-full">
        <p className="text-red-400 mb-6 text-sm leading-relaxed">
          Invalid or missing reset token. Please request a new password reset link.
        </p>
        <Link href="/forgot-password" className="inline-flex justify-center py-3 px-6 rounded-xl text-sm font-bold text-[#06261C] bg-[#D9A441] hover:bg-[#F2C059] transition-all">
          Request New Link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center w-full">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <p className="text-[#D8CBB3] mb-8 text-sm leading-relaxed">
          Your password has been successfully reset. You can now log in with your new password.
        </p>
        <Link href="/login" className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-[#06261C] bg-[#D9A441] hover:bg-[#F2C059] transition-all shadow-lg hover:shadow-[#D9A441]/20 active:scale-[0.98]">
          Go to Login <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="text-[#D8CBB3] mb-8 text-sm leading-relaxed text-center">
        Please enter your new password below.
      </p>
      
      <form onSubmit={handleSubmit} className="w-full space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#D8CBB3] mb-2 ml-1">New Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-[#8A9B8E] group-focus-within:text-[#D9A441] transition-colors" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-11 pr-4 py-3.5 bg-[#0B2F24] border border-[#1A4D3B] rounded-xl text-[#F7F0E4] placeholder-[#8A9B8E] focus:ring-1 focus:ring-[#D9A441] focus:border-[#D9A441] transition-all outline-none"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#D8CBB3] mb-2 ml-1">Confirm New Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-[#8A9B8E] group-focus-within:text-[#D9A441] transition-colors" />
            </div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full pl-11 pr-4 py-3.5 bg-[#0B2F24] border border-[#1A4D3B] rounded-xl text-[#F7F0E4] placeholder-[#8A9B8E] focus:ring-1 focus:ring-[#D9A441] focus:border-[#D9A441] transition-all outline-none"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-[#06261C] bg-[#D9A441] hover:bg-[#F2C059] focus:outline-none transition-all shadow-lg hover:shadow-[#D9A441]/20 active:scale-[0.98] mt-2"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
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

          <h1 className="text-2xl text-[#F7F0E4] mb-2 font-semibold">Set New Password</h1>
          
          <Suspense fallback={<div className="text-[#D8CBB3]">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
