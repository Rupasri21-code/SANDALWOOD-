'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { User, Lock, MapPin } from 'lucide-react';

type CustomerDetails = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
};

export default function PortalProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [nameForm, setNameForm] = useState({ full_name: '', phone: '' });
  const [pwForm, setPwForm] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!profile) return;
      const { data } = await supabase.from('customers').select('*').eq('user_id', profile.id).maybeSingle();
      setCustomer(data);
      setNameForm({ full_name: profile.full_name || '', phone: profile.phone || '' });
    };
    load();
  }, [profile]);

  const handleUpdateProfile = async () => {
    if (!profile) return;
    setLoading(true);
    const { error } = await supabase.from('profiles').update({ ...nameForm, updated_at: new Date().toISOString() }).eq('id', profile.id);
    setLoading(false);
    if (error) { toast.error('Failed'); return; }
    await refreshProfile();
    toast.success('Profile updated');
  };

  const handleUpdatePassword = async () => {
    if (pwForm.password !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    if (pwForm.password.length < 6) { toast.error('At least 6 characters required'); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pwForm.password });
    setLoading(false);
    if (error) { toast.error('Failed'); return; }
    toast.success('Password updated');
    setPwForm({ password: '', confirm: '' });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#1a1a1a]">My Profile</h1>
        <p className="text-[#6b6b6b] text-sm mt-1">Manage your account details</p>
      </div>

      {/* Profile header */}
      <div className="bg-gradient-to-r from-[#0a1f0a] to-[#1a4a1a] rounded-2xl p-6 text-white flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-[#c8851e]/30 border-2 border-[#c8851e] flex items-center justify-center">
          <span className="font-display text-2xl font-semibold text-white">{profile?.full_name?.[0] || 'U'}</span>
        </div>
        <div>
          <div className="font-display text-xl font-semibold">{profile?.full_name || 'Investor'}</div>
          <div className="text-white/60 text-sm">{profile?.email}</div>
          <div className="text-[#e9be55] text-xs mt-1 capitalize">{profile?.role}</div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white border border-[#e8e0d8] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <User className="w-5 h-5 text-[#c8851e]" />
          <h2 className="text-[#1a1a1a] font-semibold">Account Information</h2>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="text-[#4a4a4a] text-xs mb-1">Email Address</Label>
            <Input value={profile?.email || ''} disabled className="bg-[#faf6f2] border-[#e8e0d8] text-[#6b6b6b] cursor-not-allowed" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-[#4a4a4a] text-xs mb-1">Full Name</Label>
              <Input value={nameForm.full_name} onChange={(e) => setNameForm({ ...nameForm, full_name: e.target.value })}
                className="border-[#e8e0d8] focus-visible:ring-[#c8851e]" />
            </div>
            <div>
              <Label className="text-[#4a4a4a] text-xs mb-1">Phone</Label>
              <Input value={nameForm.phone} onChange={(e) => setNameForm({ ...nameForm, phone: e.target.value })}
                className="border-[#e8e0d8] focus-visible:ring-[#c8851e]" />
            </div>
          </div>
          <Button onClick={handleUpdateProfile} disabled={loading} className="bg-[#c8851e] hover:bg-[#a96618] text-white">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Customer Details */}
      {customer && (
        <div className="bg-white border border-[#e8e0d8] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <MapPin className="w-5 h-5 text-[#c8851e]" />
            <h2 className="text-[#1a1a1a] font-semibold">Contact Details</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Address', value: customer.address },
              { label: 'City', value: customer.city },
              { label: 'State', value: customer.state },
              { label: 'Country', value: customer.country },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#e8e0d8] last:border-0">
                <span className="text-[#6b6b6b] text-sm">{item.label}</span>
                <span className="text-[#1a1a1a] text-sm font-medium">{item.value || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Password */}
      <div className="bg-white border border-[#e8e0d8] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <Lock className="w-5 h-5 text-[#c8851e]" />
          <h2 className="text-[#1a1a1a] font-semibold">Change Password</h2>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="text-[#4a4a4a] text-xs mb-1">New Password</Label>
            <Input type="password" value={pwForm.password} onChange={(e) => setPwForm({ ...pwForm, password: e.target.value })}
              className="border-[#e8e0d8] focus-visible:ring-[#c8851e]" />
          </div>
          <div>
            <Label className="text-[#4a4a4a] text-xs mb-1">Confirm Password</Label>
            <Input type="password" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
              className="border-[#e8e0d8] focus-visible:ring-[#c8851e]" />
          </div>
          <Button onClick={handleUpdatePassword} disabled={loading} className="bg-[#c8851e] hover:bg-[#a96618] text-white">
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </div>
    </div>
  );
}
