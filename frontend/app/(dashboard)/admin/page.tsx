'use client';

import { useEffect, useState } from 'react';
import { Users, Map, Sprout, TrendingUp, CreditCard, Bell, Activity, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Stats = {
  customers: number;
  lands: number;
  crops: number;
  investments: number;
  payments: number;
  totalInvestmentValue: number;
  activeInvestments: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    customers: 0, lands: 0, crops: 0, investments: 0,
    payments: 0, totalInvestmentValue: 0, activeInvestments: 0,
  });
  const [recentCustomers, setRecentCustomers] = useState<{ full_name: string; email: string; created_at: string; status: string }[]>([]);
  const [recentPayments, setRecentPayments] = useState<{ amount: number; payment_date: string; status: string; customer_id: string }[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [c, l, cr, inv, pay] = await Promise.all([
        supabase.from('customers').select('*', { count: 'exact', head: true }),
        supabase.from('lands').select('*', { count: 'exact', head: true }),
        supabase.from('crops').select('*', { count: 'exact', head: true }),
        supabase.from('investments').select('amount, status'),
        supabase.from('payments').select('*', { count: 'exact', head: true }),
      ]);

      const totalVal = (inv.data ?? []).reduce((sum, i) => sum + (i.amount || 0), 0);
      const activeInv = (inv.data ?? []).filter((i) => i.status === 'active').length;

      setStats({
        customers: c.count || 0,
        lands: l.count || 0,
        crops: cr.count || 0,
        investments: inv.data?.length || 0,
        payments: pay.count || 0,
        totalInvestmentValue: totalVal,
        activeInvestments: activeInv,
      });
    };

    const fetchRecent = async () => {
      const [rc, rp] = await Promise.all([
        supabase.from('customers').select('full_name, email, created_at, status').order('created_at', { ascending: false }).limit(5),
        supabase.from('payments').select('amount, payment_date, status, customer_id').order('created_at', { ascending: false }).limit(5),
      ]);
      setRecentCustomers(rc.data ?? []);
      setRecentPayments(rp.data ?? []);
    };

    fetchStats();
    fetchRecent();
  }, []);

  const statCards = [
    { label: 'Total Customers', value: stats.customers, icon: Users, change: '+12%', color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/20' },
    { label: 'Land Parcels', value: stats.lands, icon: Map, change: '+5%', color: 'from-green-500/20 to-green-600/10', border: 'border-green-500/20' },
    { label: 'Active Crops', value: stats.crops, icon: Sprout, change: '+8%', color: 'from-[#c8851e]/20 to-[#c8851e]/10', border: 'border-[#c8851e]/20' },
    { label: 'Active Investments', value: stats.activeInvestments, icon: TrendingUp, change: '+15%', color: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/20' },
    { label: 'Payment Records', value: stats.payments, icon: CreditCard, change: '+22%', color: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/20' },
    {
      label: 'Total AUM',
      value: `₹${(stats.totalInvestmentValue / 1e7).toFixed(1)} Cr`,
      icon: Activity,
      change: '+18%',
      color: 'from-red-500/20 to-red-600/10',
      border: 'border-red-500/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-semibold text-white">Dashboard Overview</h1>
        <p className="text-white/50 text-sm mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${card.color} border ${card.border} rounded-2xl p-5 hover:scale-[1.01] transition-transform`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-white/5">
                <card.icon className="w-4 h-4 text-white/70" />
              </div>
              <span className="text-green-400 text-xs font-medium flex items-center gap-0.5">
                {card.change} <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <div className="font-display text-3xl font-bold text-white mb-0.5">{card.value}</div>
            <div className="text-white/50 text-xs">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Customers */}
        <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <h2 className="text-white font-semibold text-sm">Recent Customers</h2>
            <a href="/admin/customers" className="text-[#c8851e] text-xs hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
          {recentCustomers.length === 0 ? (
            <div className="p-10 text-center text-white/30 text-sm">No customers yet</div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentCustomers.map((c, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-white/3 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#c8851e]/20 border border-[#c8851e]/30 flex items-center justify-center">
                      <span className="text-[#e9be55] text-xs font-medium">{c.full_name?.[0] || '?'}</span>
                    </div>
                    <div>
                      <div className="text-white text-xs font-medium">{c.full_name}</div>
                      <div className="text-white/40 text-[10px]">{c.email}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    c.status === 'active' ? 'bg-green-400/15 text-green-400' :
                    c.status === 'pending' ? 'bg-amber-400/15 text-amber-400' :
                    'bg-red-400/15 text-red-400'
                  }`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <h2 className="text-white font-semibold text-sm">Recent Payments</h2>
            <a href="/admin/payments" className="text-[#c8851e] text-xs hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
          {recentPayments.length === 0 ? (
            <div className="p-10 text-center text-white/30 text-sm">No payments yet</div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentPayments.map((p, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-white/3 transition-colors">
                  <div>
                    <div className="text-white text-xs font-medium">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-white/40 text-[10px]">{p.payment_date}</div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    p.status === 'completed' ? 'bg-green-400/15 text-green-400' :
                    p.status === 'pending' ? 'bg-amber-400/15 text-amber-400' :
                    'bg-red-400/15 text-red-400'
                  }`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
        <h2 className="text-white font-semibold text-sm mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/admin/customers?action=new', label: 'Add Customer', icon: Users },
            { href: '/admin/lands?action=new', label: 'Add Land', icon: Map },
            { href: '/admin/crops?action=new', label: 'Add Crop Update', icon: Sprout },
            { href: '/admin/notifications?action=new', label: 'Send Notification', icon: Bell },
          ].map((action, i) => (
            <a
              key={i}
              href={action.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/8 hover:border-[#c8851e]/30 hover:bg-[#c8851e]/5 transition-all text-center"
            >
              <action.icon className="w-5 h-5 text-[#e9be55]" />
              <span className="text-white/70 text-xs">{action.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
