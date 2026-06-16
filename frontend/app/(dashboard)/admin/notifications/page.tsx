'use client';

import { useEffect, useState } from 'react';
import { Plus, Bell, X, Send, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
};

type Investor = { id: string; full_name: string; user_id: string | null };

const typeColors: Record<string, string> = {
  info: 'bg-blue-400/15 text-blue-400',
  success: 'bg-green-400/15 text-green-400',
  warning: 'bg-amber-400/15 text-amber-400',
  alert: 'bg-red-400/15 text-red-400',
  update: 'bg-[#c8851e]/15 text-[#e9be55]',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    recipient_id: '', investor_id: '', title: '', message: '', type: 'info', link: '',
  });
  const [loading, setLoading] = useState(false);
  const [sendToAll, setSendToAll] = useState(false);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found in localStorage');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/notifications/admin/all`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      } else {
        console.error('Failed to fetch notifications:', data.message);
        toast.error('Failed to fetch notifications: ' + data.message);
        setNotifications([]);
      }
    } catch (e: any) {
      console.error('Error fetching notifications:', e);
      toast.error('Error fetching notifications: ' + e.message);
    }

    try {
      const res = await fetch(`${API_URL}/investors`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setInvestors(data.data);
      } else {
        console.error('Failed to fetch investors:', data.message);
        toast.error('Failed to fetch investors: ' + data.message);
        setInvestors([]);
      }
    } catch (e: any) {
      console.error('Error fetching investors:', e);
      toast.error('Error fetching investors: ' + e.message);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSend = async () => {
    if (!form.title || !form.message) { toast.error('Title and message required'); return; }
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      if (sendToAll) {
        const eligible = investors.filter((c) => c.user_id);
        if (eligible.length === 0) { toast.error('No investors with user accounts'); setLoading(false); return; }
        
        const res = await fetch(`${API_URL}/notifications/admin/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            sendToAll: true,
            title: form.title,
            message: form.message,
            type: form.type.toUpperCase(),
            link: form.link || undefined,
          })
        });
        if (!res.ok) throw new Error('Failed to send to all');
        toast.success(`Sent to ${eligible.length} investors`);
      } else {
        if (!form.recipient_id) { toast.error('Select a recipient'); setLoading(false); return; }
        
        const res = await fetch(`${API_URL}/notifications/admin/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            recipientId: form.recipient_id,
            investorId: form.investor_id || undefined,
            title: form.title,
            message: form.message,
            type: form.type.toUpperCase(),
            link: form.link || undefined,
          })
        });
        if (!res.ok) throw new Error('Failed to send');
        toast.success('Notification sent');
      }

      setShowModal(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-[#F8F5EE] tracking-tight">Notifications</h1>
          <p className="text-[#A8B5AA] text-[15px] mt-1.5 font-medium">Send alerts and updates to investors</p>
        </div>
        <button 
          onClick={() => { setForm({ recipient_id: '', investor_id: '', title: '', message: '', type: 'info', link: '' }); setSendToAll(false); setShowModal(true); }} 
          whileHover={{ y: -3 }}
          className="h-[48px] px-6 rounded-[16px] text-white font-bold flex items-center gap-3 shadow-[0_10px_20px_rgba(196,154,90,0.2)] hover:shadow-[0_0_25px_rgba(196,154,90,0.5)] transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, #C49A5A, #D9B36D)' }}
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm">
            <Plus className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
          Send Notification
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-16 text-[#A8B5AA] font-medium text-base rounded-[24px] border border-[#C49A5A]/30" style={{ background: 'linear-gradient(145deg, rgba(18,31,23,.95), rgba(10,15,12,.98))' }}>
            No notifications sent yet
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="flex items-center gap-6 p-6 rounded-[20px] border border-[#C49A5A]/30 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_10px_30px_rgba(196,154,90,0.15)] relative overflow-hidden hover:scale-[1.01] hover:-translate-y-[2px] transition-all duration-300"
              style={{ background: 'linear-gradient(145deg, rgba(18,31,23,.95), rgba(10,15,12,.98))', height: '100px' }}
            >
              <div className="w-[50px] h-[50px] rounded-full bg-[#3B82F6]/10 flex items-center justify-center shrink-0 border border-[#3B82F6]/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <Bell className="w-6 h-6 text-[#3B82F6]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[#F8F5EE] font-bold text-[16px] truncate mb-1">{n.title}</div>
                <div className="text-[#A8B5AA] text-[13px] truncate">{n.message}</div>
              </div>
              <div className="flex flex-col items-end shrink-0 gap-2">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                    n.type?.toLowerCase() === 'success' ? 'bg-[#22C55E]/12 text-[#22C55E]' :
                    n.type?.toLowerCase() === 'warning' ? 'bg-[#EAB308]/12 text-[#EAB308]' :
                    n.type?.toLowerCase() === 'alert' ? 'bg-[#EF4444]/12 text-[#EF4444]' :
                    'bg-[#3B82F6]/12 text-[#3B82F6]'
                  }`}>
                    {n.type?.toLowerCase()}
                  </span>
                  <div className="text-[#A8B5AA] text-[12px] font-medium border-l border-[#C49A5A]/20 pl-3">
                    {new Date(n.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!n.is_read ? (
                    <div className="flex items-center gap-1.5 text-[#C49A5A] text-[11px] font-bold uppercase tracking-wider">
                      <div className="w-2 h-2 rounded-full bg-[#C49A5A] animate-pulse shadow-[0_0_8px_#C49A5A]" />
                      Unread
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[#22C55E] text-[11px] font-bold uppercase tracking-wider">
                      <Check className="w-3 h-3" />
                      Read
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#141410] border border-white/10 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="text-white font-semibold">Send Notification</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-white/40" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <input type="checkbox" id="sendAll" checked={sendToAll} onChange={(e) => setSendToAll(e.target.checked)}
                  className="accent-[#c8851e]" />
                <label htmlFor="sendAll" className="text-white/70 text-sm cursor-pointer">
                  Send to all investors ({investors.filter((c) => c.user_id).length} accounts)
                </label>
              </div>
              {!sendToAll && (
                <div>
                  <Label className="text-white/70 text-xs mb-1">Recipient Investor</Label>
                  <select value={form.investor_id} onChange={(e) => {
                    const c = investors.find((c) => c.id === e.target.value);
                    setForm({ ...form, investor_id: e.target.value, recipient_id: c?.user_id || '' });
                  }} className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e]">
                    <option value="" className="bg-[#141410]">Select investor</option>
                    {investors.map((c) => <option key={c.id} value={c.id} className="bg-[#141410]">{c.full_name}{!c.user_id ? ' (no account)' : ''}</option>)}
                  </select>
                </div>
              )}
              <div>
                <Label className="text-white/70 text-xs mb-1">Type</Label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e]">
                  {['info','success','warning','alert','update'].map((t) => <option key={t} value={t} className="bg-[#141410]">{t}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-white/70 text-xs mb-1">Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
              </div>
              <div>
                <Label className="text-white/70 text-xs mb-1">Message *</Label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={4} className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#c8851e]" />
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-white/10">
              <Button variant="ghost" onClick={() => setShowModal(false)} className="flex-1 text-white/60 hover:bg-white/5">Cancel</Button>
              <Button onClick={handleSend} disabled={loading} className="flex-1 bg-[#c8851e] hover:bg-[#a96618] text-white gap-2">
                <Send className="w-4 h-4" />
                {loading ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
