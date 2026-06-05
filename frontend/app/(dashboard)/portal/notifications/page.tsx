'use client';

import { useEffect, useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function PortalNotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-[#C49A5A] border-t-transparent rounded-full animate-spin" /></div>;
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAllRead = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await fetch(`${API_URL}/notifications/read-all`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      toast.success('All marked as read');
    } catch (err) {
      console.error(err);
    }
  };

  const markRead = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const getTypeStyle = (type: string) => {
    const t = type?.toLowerCase() || '';
    if (t === 'success') return 'bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E]';
    if (t === 'alert' || t === 'warning') return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
    return 'bg-[#C49A5A]/10 border-[#C49A5A]/20 text-[#C49A5A]';
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#F7F0E4]">Notifications</h1>
          <p className="text-[#B8B8A8] text-sm mt-1">{unreadCount} unread • {notifications.length} total messages</p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllRead} className="bg-transparent hover:bg-[#C49A5A]/10 text-[#C49A5A] border border-[#C49A5A]/30 gap-2 h-9 rounded-xl transition-colors">
            <Check className="w-4 h-4" /> Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-10 bg-[rgba(18,55,42,0.35)] rounded-[20px] border border-white/5">
            <Bell className="w-8 h-8 text-[#C49A5A]/30 mx-auto mb-2" />
            <p className="text-[#B8B8A8] text-sm">No notifications available</p>
          </div>
        ) : notifications.map((n) => (
          <div 
            key={n.id}
            onClick={() => !n.is_read && markRead(n.id)}
            className={`p-5 sm:p-6 rounded-[20px] cursor-pointer transition-all flex gap-4 ${
              !n.is_read 
                ? 'bg-[rgba(18,55,42,0.35)] border border-[#C49A5A]/40 shadow-[0_0_15px_rgba(196,154,90,0.05)]' 
                : 'bg-black/20 border border-[rgba(196,154,90,0.1)] opacity-70'
            }`}
          >
            <div className="shrink-0 mt-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${getTypeStyle(n.type)}`}>
                <Bell className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[9px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-widest border ${getTypeStyle(n.type)}`}>
                    {n.type || 'General'}
                  </span>
                  <h3 className={`text-base font-semibold ${!n.is_read ? 'text-[#F7F0E4]' : 'text-[#B8B8A8]'}`}>{n.title}</h3>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[#B8B8A8] text-[11px] font-medium">{new Date(n.created_at).toLocaleDateString()}</span>
                  {!n.is_read && <span className="w-2 h-2 rounded-full bg-[#C49A5A] shadow-[0_0_8px_#C49A5A]" />}
                </div>
              </div>
              <p className={`text-sm leading-relaxed mt-2 ${!n.is_read ? 'text-[#B8B8A8]' : 'text-[#B8B8A8]/60'}`}>
                {n.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
