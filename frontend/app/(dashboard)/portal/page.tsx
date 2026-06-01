'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Map, Sprout, TrendingUp, CreditCard, ArrowUpRight, Bell, FileText } from 'lucide-react';
import Link from 'next/link';

type CustomerData = {
  id: string;
  full_name: string;
  status: string;
};

type Summary = {
  lands: number;
  crops: number;
  investments: number;
  payments: number;
  totalInvested: number;
  documents: number;
};

export default function PortalDashboard() {
  const { profile } = useAuth();
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [summary, setSummary] = useState<Summary>({ lands: 0, crops: 0, investments: 0, payments: 0, totalInvested: 0, documents: 0 });
  const [recentUpdates, setRecentUpdates] = useState<{ title: string; update_type: string; update_date: string }[]>([]);
  const [notifications, setNotifications] = useState<{ title: string; message: string; type: string; created_at: string }[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!profile) return;
      const { data: cust } = await supabase.from('customers').select('id, full_name, status').eq('user_id', profile.id).maybeSingle();
      if (!cust) return;
      setCustomer(cust);

      const [lands, investments, payments, documents, notifs] = await Promise.all([
        supabase.from('lands').select('id', { count: 'exact', head: true }).eq('customer_id', cust.id),
        supabase.from('investments').select('amount, status').eq('customer_id', cust.id),
        supabase.from('payments').select('id', { count: 'exact', head: true }).eq('customer_id', cust.id),
        supabase.from('documents').select('id', { count: 'exact', head: true }).eq('customer_id', cust.id),
        supabase.from('notifications').select('title, message, type, created_at').eq('recipient_id', profile.id).order('created_at', { ascending: false }).limit(3),
      ]);

      const totalInvested = (investments.data ?? []).reduce((s, i) => s + i.amount, 0);

      const landIds = await supabase.from('lands').select('id').eq('customer_id', cust.id);
      let crops = 0;
      if (landIds.data?.length) {
        const cropCount = await supabase.from('crops').select('id', { count: 'exact', head: true }).in('land_id', landIds.data.map((l) => l.id));
        crops = cropCount.count || 0;
      }

      setSummary({ lands: lands.count || 0, crops, investments: investments.data?.length || 0, payments: payments.count || 0, totalInvested, documents: documents.count || 0 });
      setNotifications(notifs.data ?? []);

      if (landIds.data?.length) {
        const { data: updates } = await supabase.from('plantation_updates').select('title, update_type, update_date').in('land_id', landIds.data.map((l) => l.id)).order('update_date', { ascending: false }).limit(4);
        setRecentUpdates(updates ?? []);
      }
    };
    load();
  }, [profile]);

  const cards = [
    { label: 'Land Parcels', value: summary.lands, icon: Map, href: '/portal/land', color: 'bg-green-50 border-green-200 text-green-700' },
    { label: 'Active Crops', value: summary.crops, icon: Sprout, href: '/portal/plantation', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
    { label: 'Investments', value: summary.investments, icon: TrendingUp, href: '/portal/investment', color: 'bg-[#fdf3e0] border-[#e9be55]/40 text-[#c8851e]' },
    { label: 'Documents', value: summary.documents, icon: FileText, href: '/portal/documents', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  ];

  const typeColors: Record<string, string> = {
    info: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    alert: 'bg-red-100 text-red-700',
    update: 'bg-[#fdf3e0] text-[#c8851e]',
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#0a1f0a] to-[#1a4a1a] rounded-2xl p-6 text-white">
        <p className="text-[#e9be55] text-xs font-medium tracking-widest uppercase mb-1">Welcome back</p>
        <h1 className="font-display text-3xl font-semibold mb-2">
          {customer?.full_name || profile?.full_name || 'Investor'}
        </h1>
        <p className="text-white/60 text-sm">
          Your sandalwood plantation is growing strong. Here's a summary of your investment.
        </p>
        {summary.totalInvested > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
            <span className="text-white/60 text-xs">Total Invested:</span>
            <span className="text-[#e9be55] font-semibold text-sm">₹{summary.totalInvested.toLocaleString('en-IN')}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <Link key={i} href={card.href} className={`${card.color} border rounded-2xl p-5 hover:shadow-md transition-all group`}>
            <div className="flex items-center justify-between mb-3">
              <card.icon className="w-5 h-5 opacity-70" />
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-70 transition-opacity" />
            </div>
            <div className="font-display text-3xl font-bold mb-0.5">{card.value}</div>
            <div className="text-xs opacity-70">{card.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Plantation Updates */}
        <div className="bg-white border border-[#e8e0d8] rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e0d8]">
            <h2 className="text-[#1a1a1a] font-semibold text-sm">Recent Plantation Updates</h2>
            <Link href="/portal/plantation" className="text-[#c8851e] text-xs hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          {recentUpdates.length === 0 ? (
            <div className="p-10 text-center text-[#6b6b6b] text-sm">No updates yet</div>
          ) : (
            <div className="divide-y divide-[#e8e0d8]">
              {recentUpdates.map((u, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-3 hover:bg-[#faf6f2] transition-colors">
                  <div className="w-2 h-2 rounded-full bg-[#c8851e] shrink-0" />
                  <div className="flex-1">
                    <div className="text-[#1a1a1a] text-xs font-medium">{u.title}</div>
                    <div className="text-[#6b6b6b] text-[10px] capitalize">{u.update_type.replace('_', ' ')} · {u.update_date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white border border-[#e8e0d8] rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e0d8]">
            <h2 className="text-[#1a1a1a] font-semibold text-sm">Recent Notifications</h2>
            <Link href="/portal/notifications" className="text-[#c8851e] text-xs hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          {notifications.length === 0 ? (
            <div className="p-10 text-center text-[#6b6b6b] text-sm">No notifications</div>
          ) : (
            <div className="divide-y divide-[#e8e0d8]">
              {notifications.map((n, i) => (
                <div key={i} className="px-5 py-3 hover:bg-[#faf6f2] transition-colors">
                  <div className="flex items-start gap-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium mt-0.5 shrink-0 ${typeColors[n.type] || 'bg-gray-100 text-gray-600'}`}>
                      {n.type}
                    </span>
                    <div>
                      <div className="text-[#1a1a1a] text-xs font-medium">{n.title}</div>
                      <div className="text-[#6b6b6b] text-[10px] mt-0.5">{n.message}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white border border-[#e8e0d8] rounded-2xl p-5 shadow-sm">
        <h2 className="text-[#1a1a1a] font-semibold text-sm mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/portal/payments', label: 'Payment History', icon: CreditCard },
            { href: '/portal/documents', label: 'My Documents', icon: FileText },
            { href: '/portal/plantation', label: 'View Updates', icon: Sprout },
            { href: '/portal/profile', label: 'My Profile', icon: Map },
          ].map((item, i) => (
            <Link key={i} href={item.href} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#e8e0d8] hover:border-[#c8851e]/30 hover:bg-[#fdf3e0] transition-all text-center group">
              <item.icon className="w-5 h-5 text-[#c8851e] group-hover:scale-110 transition-transform" />
              <span className="text-[#6b6b6b] text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
