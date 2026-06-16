'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Settings, User, Lock, Bell } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

export default function AdminSettingsPage() {
  const { profile, refreshProfile } = useAuth();
  const [nameForm, setNameForm] = useState({ full_name: profile?.full_name || '', phone: profile?.phone || '' });
  const [pwForm, setPwForm] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!profile) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(nameForm)
      });
      if (!res.ok) throw new Error('Failed to update profile');
      await refreshProfile();
      toast.success('Profile updated');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (pwForm.password !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    if (pwForm.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    
    // We would need the old password to use /auth/reset-password.
    // For now, since the admin settings only has new password, we might need a custom endpoint,
    // or just let it fail if the backend requires oldPassword (which it does in resetPassword).
    // Let's implement this as a mock or prompt user for old password if needed.
    // Wait, let's just make the request.
    const token = localStorage.getItem('token');
    setLoading(true);
    
    try {
      // Prompt user for old password since the backend requires it
      const oldPassword = prompt('Please enter your current password to confirm changes:');
      if (!oldPassword) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: pwForm.password
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update password');
      
      toast.success('Password updated');
      setPwForm({ password: '', confirm: '' });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-3xl font-semibold text-white">Settings</h1>
        <p className="text-white/50 text-sm mt-1">Manage your admin account</p>
      </div>

      {/* Profile */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <User className="w-5 h-5 text-[#e9be55]" />
          <h2 className="text-white font-semibold">Profile Information</h2>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="text-white/70 text-xs mb-1">Email</Label>
            <Input value={profile?.email || ''} disabled className="bg-white/5 border-white/10 text-white/50 cursor-not-allowed" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-white/70 text-xs mb-1">Full Name</Label>
              <Input value={nameForm.full_name} onChange={(e) => setNameForm({ ...nameForm, full_name: e.target.value })}
                className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
            </div>
            <div>
              <Label className="text-white/70 text-xs mb-1">Phone</Label>
              <Input value={nameForm.phone} onChange={(e) => setNameForm({ ...nameForm, phone: e.target.value })}
                className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
            </div>
          </div>
          <Button onClick={handleUpdateProfile} disabled={loading} className="bg-[#c8851e] hover:bg-[#a96618] text-white">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Password */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <Lock className="w-5 h-5 text-[#e9be55]" />
          <h2 className="text-white font-semibold">Change Password</h2>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="text-white/70 text-xs mb-1">New Password</Label>
            <Input type="password" value={pwForm.password} onChange={(e) => setPwForm({ ...pwForm, password: e.target.value })}
              className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
          </div>
          <div>
            <Label className="text-white/70 text-xs mb-1">Confirm Password</Label>
            <Input type="password" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
              className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
          </div>
          <Button onClick={handleUpdatePassword} disabled={loading} className="bg-[#c8851e] hover:bg-[#a96618] text-white">
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <Settings className="w-5 h-5 text-[#e9be55]" />
          <h2 className="text-white font-semibold">System Information</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Platform', value: 'Chandan Nilayam v1.0' },
            { label: 'Role', value: profile?.role || '—' },
            { label: 'Member Since', value: '—' },
            { label: 'Database', value: 'Supabase PostgreSQL' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-white/50 text-sm">{item.label}</span>
              <span className="text-white text-sm font-medium capitalize">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
