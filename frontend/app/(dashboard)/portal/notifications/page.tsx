'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  link: string;
};

const typeColors: Record<string, string> = {
  info: 'bg-blue-100 text-blue-700 border-blue-200',
  success: 'bg-green-100 text-green-700 border-green-200',
  warning: 'bg-amber-100 text-amber-700 border-amber-200',
  alert: 'bg-red-100 text-red-700 border-red-200',
  update: 'bg-[#fdf3e0] text-[#c8851e] border-[#e9be55]/30',
};

export default function PortalNotificationsPage() {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!profile) return;
    const { data } = await supabase.from('notifications').select('*').eq('recipient_id', profile.id).order('created_at', { ascending: false });
    setNotifications(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchNotifications(); }, [profile]);

  const markAllRead = async () => {
    if (!profile) return;
    await supabase.from('notifications').update({ is_read: true }).eq('recipient_id', profile.id).eq('is_read', false);
    toast.success('All marked as read');
    fetchNotifications();
  };

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-[#c8851e] border-t-transparent rounded-full animate-spin" /></div>;
  }

  const unread = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#1a1a1a]">Notifications</h1>
          <p className="text-[#6b6b6b] text-sm mt-1">{unread} unread · {notifications.length} total</p>
        </div>
        {unread > 0 && (
          <Button onClick={markAllRead} variant="outline" size="sm" className="border-[#c8851e]/30 text-[#c8851e] hover:bg-[#fdf3e0] gap-2">
            <Check className="w-3 h-3" /> Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e8e0d8]">
          <Bell className="w-10 h-10 text-[#c8851e]/30 mx-auto mb-3" />
          <p className="text-[#6b6b6b] text-sm">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.is_read && markRead(n.id)}
              className={`bg-white rounded-xl border p-5 transition-all cursor-pointer hover:shadow-sm ${
                !n.is_read ? 'border-[#c8851e]/20 shadow-sm' : 'border-[#e8e0d8]'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 mt-0.5 text-xs px-2 py-0.5 rounded-full font-medium border ${typeColors[n.type] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                  {n.type}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className={`font-medium text-sm ${!n.is_read ? 'text-[#1a1a1a]' : 'text-[#4a4a4a]'}`}>
                      {n.title}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!n.is_read && <span className="w-2 h-2 rounded-full bg-[#c8851e]" />}
                      <span className="text-[#6b6b6b] text-xs">{new Date(n.created_at).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                  <p className="text-[#6b6b6b] text-sm mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
