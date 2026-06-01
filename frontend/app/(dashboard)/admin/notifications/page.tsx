'use client';

import { useEffect, useState } from 'react';
import { Plus, Bell, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
};

type Customer = { id: string; full_name: string; user_id: string | null };

const typeColors: Record<string, string> = {
  info: 'bg-blue-400/15 text-blue-400',
  success: 'bg-green-400/15 text-green-400',
  warning: 'bg-amber-400/15 text-amber-400',
  alert: 'bg-red-400/15 text-red-400',
  update: 'bg-[#c8851e]/15 text-[#e9be55]',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    recipient_id: '', customer_id: '', title: '', message: '', type: 'info', link: '',
  });
  const [loading, setLoading] = useState(false);
  const [sendToAll, setSendToAll] = useState(false);

  const fetchData = async () => {
    const [n, c] = await Promise.all([
      supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('customers').select('id, full_name, user_id'),
    ]);
    setNotifications(n.data ?? []);
    setCustomers(c.data ?? []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSend = async () => {
    if (!form.title || !form.message) { toast.error('Title and message required'); return; }
    setLoading(true);

    if (sendToAll) {
      const eligible = customers.filter((c) => c.user_id);
      if (eligible.length === 0) { toast.error('No customers with user accounts'); setLoading(false); return; }
      const inserts = eligible.map((c) => ({
        recipient_id: c.user_id!,
        customer_id: c.id,
        title: form.title,
        message: form.message,
        type: form.type,
        link: form.link,
      }));
      const { error } = await supabase.from('notifications').insert(inserts);
      if (error) { toast.error('Failed: ' + error.message); } else { toast.success(`Sent to ${eligible.length} customers`); }
    } else {
      if (!form.recipient_id) { toast.error('Select a recipient'); setLoading(false); return; }
      const { error } = await supabase.from('notifications').insert({
        recipient_id: form.recipient_id,
        customer_id: form.customer_id || null,
        title: form.title,
        message: form.message,
        type: form.type,
        link: form.link,
      });
      if (error) { toast.error('Failed: ' + error.message); } else { toast.success('Notification sent'); }
    }

    setLoading(false);
    setShowModal(false);
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-white">Notifications</h1>
          <p className="text-white/50 text-sm mt-1">Send alerts and updates to investors</p>
        </div>
        <Button onClick={() => { setForm({ recipient_id: '', customer_id: '', title: '', message: '', type: 'info', link: '' }); setSendToAll(false); setShowModal(true); }} className="bg-[#c8851e] hover:bg-[#a96618] text-white gap-2">
          <Plus className="w-4 h-4" /> Send Notification
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-white/30 bg-white/3 border border-white/8 rounded-2xl">
            No notifications sent yet
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="flex items-start gap-4 p-4 bg-white/3 border border-white/8 rounded-xl hover:border-[#c8851e]/20 transition-all">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${typeColors[n.type] || 'bg-white/10 text-white'}`}>
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-white font-medium text-sm">{n.title}</div>
                    <div className="text-white/50 text-xs mt-0.5 leading-relaxed">{n.message}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${typeColors[n.type] || 'bg-white/10 text-white/60'}`}>
                      {n.type}
                    </span>
                    {n.is_read && <span className="text-[10px] text-white/30">Read</span>}
                  </div>
                </div>
              </div>
              <div className="text-white/30 text-xs shrink-0">
                {new Date(n.created_at).toLocaleDateString('en-IN')}
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
                  Send to all customers ({customers.filter((c) => c.user_id).length} accounts)
                </label>
              </div>
              {!sendToAll && (
                <div>
                  <Label className="text-white/70 text-xs mb-1">Recipient Customer</Label>
                  <select value={form.customer_id} onChange={(e) => {
                    const c = customers.find((c) => c.id === e.target.value);
                    setForm({ ...form, customer_id: e.target.value, recipient_id: c?.user_id || '' });
                  }} className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e]">
                    <option value="" className="bg-[#141410]">Select customer</option>
                    {customers.map((c) => <option key={c.id} value={c.id} className="bg-[#141410]">{c.full_name}{!c.user_id ? ' (no account)' : ''}</option>)}
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
