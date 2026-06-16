'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { User, MapPin, Briefcase, Phone, Mail, FileText, CheckCircle, Key, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

export default function PortalProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [investorData, setInvestorData] = useState<any>(null);

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.data.profile) {
          setInvestorData(data.data.profile);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    setChanging(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Password updated successfully');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.message || 'Failed to change password');
      }
    } catch (err: any) {
      console.error(err);
      toast.error('An error occurred: ' + err.message);
    } finally {
      setChanging(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-[#C49A5A] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#F7F0E4]">Profile</h1>
        <p className="text-[#B8B8A8] text-sm mt-1">Manage your account information and preferences.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Summary & Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Summary Card */}
          <div className="bg-[rgba(18,55,42,0.35)] border border-[rgba(196,154,90,0.25)] rounded-[20px] p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#C49A5A]/20 to-transparent"></div>
            
            <div className="relative w-24 h-24 mx-auto rounded-full bg-black/40 border-2 border-[#C49A5A] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(196,154,90,0.15)]">
              <span className="font-display text-4xl font-bold text-[#C49A5A]">{profile?.full_name?.[0] || 'U'}</span>
              <div className="absolute -bottom-1 -right-1 bg-[#12372A] border border-[#22C55E] rounded-full p-1 shadow-md">
                <CheckCircle className="w-3.5 h-3.5 text-[#22C55E]" />
              </div>
            </div>
            
            <h2 className="text-[#F7F0E4] font-display text-xl font-bold">{profile?.full_name || 'Investor'}</h2>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="text-[10px] px-2.5 py-1 rounded-sm bg-[#C49A5A]/10 text-[#C49A5A] border border-[#C49A5A]/20 font-bold uppercase tracking-widest">
                Investor ID: {investorData?.id?.substring(0,8).toUpperCase() || 'INV-PENDING'}
              </span>
            </div>
            <p className="text-[#B8B8A8] text-xs mt-4">Verified Member</p>
          </div>
        </div>

        {/* Right Column: Information Sections */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Information */}
          <div className="bg-[rgba(18,55,42,0.35)] border border-[rgba(196,154,90,0.25)] rounded-[20px] p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
              <User className="w-5 h-5 text-[#C49A5A]" />
              <h2 className="text-[#F7F0E4] font-semibold text-base">Personal Information</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <label className="text-[#B8B8A8] text-[10px] uppercase tracking-widest mb-1 block">Full Name</label>
                <div className="text-[#F7F0E4] font-medium text-sm">{profile?.full_name || '—'}</div>
              </div>
              <div>
                <label className="text-[#B8B8A8] text-[10px] uppercase tracking-widest mb-1 block">Date of Birth</label>
                <div className="text-[#F7F0E4] font-medium text-sm">{investorData?.dob ? new Date(investorData.dob).toLocaleDateString() : 'Not provided'}</div>
              </div>
              <div>
                <label className="text-[#B8B8A8] text-[10px] uppercase tracking-widest mb-1 block">PAN Number</label>
                <div className="text-[#F7F0E4] font-medium text-sm font-mono tracking-wider">{investorData?.pan_number || 'Not provided'}</div>
              </div>
              <div>
                <label className="text-[#B8B8A8] text-[10px] uppercase tracking-widest mb-1 block">{investorData?.id_type || 'Aadhaar'} Number</label>
                <div className="text-[#F7F0E4] font-medium text-sm font-mono tracking-wider">{investorData?.id_number || 'Not provided'}</div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-[rgba(18,55,42,0.35)] border border-[rgba(196,154,90,0.25)] rounded-[20px] p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
              <Phone className="w-5 h-5 text-[#C49A5A]" />
              <h2 className="text-[#F7F0E4] font-semibold text-base">Contact Information</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <label className="text-[#B8B8A8] text-[10px] uppercase tracking-widest mb-1 block">Email Address</label>
                <div className="text-[#F7F0E4] font-medium text-sm flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#B8B8A8]" /> {profile?.email || '—'}
                </div>
              </div>
              <div>
                <label className="text-[#B8B8A8] text-[10px] uppercase tracking-widest mb-1 block">Phone Number</label>
                <div className="text-[#F7F0E4] font-medium text-sm flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#B8B8A8]" /> {investorData?.phone || 'Not provided'}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[#B8B8A8] text-[10px] uppercase tracking-widest mb-1 block">Residential Address</label>
                <div className="text-[#F7F0E4] font-medium text-sm flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#B8B8A8] shrink-0 mt-0.5" /> 
                  {[investorData?.address_line1, investorData?.village, investorData?.district, investorData?.state, investorData?.country].filter(Boolean).join(', ') || 'Address not updated'}
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="bg-[rgba(18,55,42,0.35)] border border-[rgba(196,154,90,0.25)] rounded-[20px] p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
              <Key className="w-5 h-5 text-[#C49A5A]" />
              <h2 className="text-[#F7F0E4] font-semibold text-base">Change Password</h2>
            </div>
            
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div className="space-y-1.5 relative">
                <label className="text-[#B8B8A8] text-[10px] uppercase tracking-widest block">Current Password</label>
                <div className="relative">
                  <input
                    type={showOldPass ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-lg px-4 pr-10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#C49A5A] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 relative">
                <label className="text-[#B8B8A8] text-[10px] uppercase tracking-widest block">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-lg px-4 pr-10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#C49A5A] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 relative">
                <label className="text-[#B8B8A8] text-[10px] uppercase tracking-widest block">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-lg px-4 pr-10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#C49A5A] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={changing}
                className="w-full sm:w-auto h-11 px-6 rounded-lg bg-gradient-to-r from-[#C49A5A] to-[#a96618] hover:from-[#a96618] hover:to-[#8c5010] text-[#06261C] font-semibold text-sm transition-all hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2"
              >
                {changing ? (
                  <div className="w-4 h-4 border-2 border-[#06261C]/30 border-t-[#06261C] rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Update Password
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
