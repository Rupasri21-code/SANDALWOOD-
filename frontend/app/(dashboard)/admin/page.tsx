'use client';

import { useEffect, useState } from 'react';
import { Users, Map, Sprout, TrendingUp, CreditCard, Bell, Activity, ArrowUpRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

type Stats = {
  investors: number;
  lands: number;
  crops: number;
  investments: number;
  payments: number;
  totalInvestmentValue: number;
  activeInvestments: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    investors: 0, lands: 0, crops: 0, investments: 0,
    payments: 0, totalInvestmentValue: 0, activeInvestments: 0,
  });
  const [recentInvestors, setRecentInvestors] = useState<{ full_name: string; email: string; created_at: string; status: string }[]>([]);
  const [recentPayments, setRecentPayments] = useState<{ amount: number; payment_date: string; status: string; investor_id: string }[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${API_URL}/dashboard/admin`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (res.ok && data.success) {
          const { summary, recentInvestors, recentPayments } = data.data;
          
          setStats({
            investors: summary.totalInvestors || 0,
            lands: summary.totalPlots || 0,
            crops: summary.totalCrops || 0,
            investments: summary.activeInvestments || 0,
            payments: recentPayments.length || 0,
            totalInvestmentValue: summary.totalAum || 0,
            activeInvestments: summary.activeInvestments || 0,
          });
          
          setRecentInvestors(recentInvestors || []);
          setRecentPayments(recentPayments || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Total AUM', value: `₹${(stats.totalInvestmentValue / 1e7).toFixed(1)} Cr`, icon: Activity, change: '+18% this year', color: 'from-[#0F2745] to-[#1E5DB4]', glow: 'hover:shadow-[0_0_25px_rgba(30,93,180,0.4)]' },
    { label: 'Active Investments', value: stats.activeInvestments, icon: TrendingUp, change: '+15% this month', color: 'from-[#0E2A1D] to-[#1F8A50]', glow: 'hover:shadow-[0_0_25px_rgba(31,138,80,0.4)]' },
    { label: 'Total Investors', value: stats.investors, icon: Users, change: '+5 new', color: 'from-[#3A2804] to-[#D4A017]', glow: 'hover:shadow-[0_0_25px_rgba(212,160,23,0.4)]' },
    { label: 'Land Records', value: stats.lands, icon: Map, change: 'Updated', color: 'from-[#24143D] to-[#7B3FE4]', glow: 'hover:shadow-[0_0_25px_rgba(123,63,228,0.4)]' },
    { label: 'Crop Updates', value: stats.crops, icon: Sprout, change: 'Growing', color: 'from-[#3D1212] to-[#D73A3A]', glow: 'hover:shadow-[0_0_25px_rgba(215,58,58,0.4)]' },
    { label: 'Payment Records', value: stats.payments, icon: CreditCard, change: '+22% this month', color: 'from-[#062E3E] to-[#19A7CE]', glow: 'hover:shadow-[0_0_25px_rgba(25,167,206,0.4)]' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="pb-2">
        <h1 className="font-display text-[2rem] font-bold text-[#F8F5EE] tracking-tight">Dashboard Overview</h1>
        <p className="text-[#A8B5AA] text-[15px] mt-1.5 font-medium">Welcome back. Here is your wealth management summary.</p>
      </div>

      {/* Top Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${card.color} rounded-[24px] p-7 shadow-[0_8px_30px_rgba(0,0,0,0.2)] ${card.glow} flex flex-col justify-between h-[140px] relative overflow-hidden group hover:scale-[1.03] transition-all duration-300 border border-white/10`}
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="w-12 h-12 rounded-full bg-[#C49A5A]/20 flex items-center justify-center border border-[#C49A5A]/50 shadow-[0_0_15px_rgba(196,154,90,0.2)] backdrop-blur-md">
                <card.icon className="w-6 h-6 text-[#F8F5EE]" />
              </div>
              <div className="font-display text-[2rem] font-bold text-white tracking-tight drop-shadow-md">{card.value}</div>
            </div>
            <div className="flex items-end justify-between relative z-10 mt-auto pt-2">
              <div className="text-white/90 text-[15px] font-semibold tracking-wide drop-shadow-sm">{card.label}</div>
              <span className="text-white/80 bg-black/20 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide flex items-center gap-1 backdrop-blur-sm border border-white/10">
                {card.change} <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Tables */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Investors */}
        <div className="bg-[#101A13] border border-[#C49A5A]/30 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-500 delay-100">
          <div className="flex items-center justify-between px-7 py-5 border-b border-[#C49A5A]/20 bg-[#121F17]">
            <h2 className="text-[#F8F5EE] font-bold text-base tracking-wide flex items-center gap-2">
              <Users className="w-4 h-4 text-[#C49A5A]" /> Recent Investors
            </h2>
            <a href="/admin/investors" className="text-[#C49A5A] text-xs font-semibold hover:text-[#e9be55] transition-colors flex items-center gap-1 group">
              View all <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
          {recentInvestors.length === 0 ? (
            <div className="p-10 text-center text-[#A8B5AA] text-sm font-medium">No investors yet</div>
          ) : (
            <div className="divide-y divide-[#C49A5A]/10 flex-1">
              {recentInvestors.slice(0,5).map((c, i) => (
                <div key={i} className="px-7 py-4 flex items-center justify-between hover:bg-[#C49A5A]/5 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#121F17] border border-[#C49A5A]/40 shadow-sm flex items-center justify-center group-hover:border-[#C49A5A]/80 transition-colors">
                      <span className="text-[#C49A5A] text-sm font-bold uppercase">{c.full_name?.[0] || '?'}</span>
                    </div>
                    <div>
                      <div className="text-[#F8F5EE] text-[14px] font-semibold mb-0.5 group-hover:text-[#C49A5A] transition-colors">{c.full_name}</div>
                      <div className="text-[#A8B5AA] text-[12px]">{c.email}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${
                    c.status === 'ACTIVE' ? 'bg-[#123F25] text-[#22C55E] border-[#22C55E]/30' :
                    c.status === 'PENDING' ? 'bg-amber-400/10 text-amber-500 border-amber-500/30' :
                    'bg-red-400/10 text-red-500 border-red-500/30'
                  }`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="bg-[#101A13] border border-[#C49A5A]/30 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-500 delay-200">
          <div className="flex items-center justify-between px-7 py-5 border-b border-[#C49A5A]/20 bg-[#121F17]">
            <h2 className="text-[#F8F5EE] font-bold text-base tracking-wide flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#C49A5A]" /> Recent Payments
            </h2>
            <a href="/admin/payments" className="text-[#C49A5A] text-xs font-semibold hover:text-[#e9be55] transition-colors flex items-center gap-1 group">
              View all <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
          {recentPayments.length === 0 ? (
            <div className="p-10 text-center text-[#A8B5AA] text-sm font-medium">No payments yet</div>
          ) : (
            <div className="divide-y divide-[#C49A5A]/10 flex-1">
              {recentPayments.slice(0,5).map((p, i) => (
                <div key={i} className="px-7 py-4 flex items-center justify-between hover:bg-[#C49A5A]/5 transition-colors group cursor-pointer">
                  <div>
                    <div className="text-[#F8F5EE] text-[15px] font-bold tracking-wide mb-1 group-hover:text-[#C49A5A] transition-colors">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[#A8B5AA] text-[12px] font-medium">{p.payment_date}</div>
                  </div>
                  <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${
                    p.status === 'COMPLETED' ? 'bg-[#123F25] text-[#22C55E] border-[#22C55E]/30 shadow-[0_0_8px_rgba(34,197,94,0.3)]' :
                    p.status === 'PENDING' ? 'bg-[#C49A5A]/10 text-[#C49A5A] border-[#C49A5A]/30 shadow-[0_0_8px_rgba(196,154,90,0.3)]' :
                    'bg-red-400/10 text-red-500 border-red-500/30'
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
      <div className="pt-2 animate-in slide-in-from-bottom-4 duration-500 delay-300">
        <h2 className="text-[#F8F5EE] font-bold text-lg mb-6 tracking-wide">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { href: '/admin/investors?action=new', label: 'Manage investors', title: 'Add Investor', icon: Users },
            { href: '/admin/lands?action=new', label: 'Create plot records', title: 'Add Land', icon: Map },
            { href: '/admin/crops?action=new', label: 'Update plantation progress', title: 'Add Crop Update', icon: Sprout },
            { href: '/admin/notifications?action=new', label: 'Broadcast alerts', title: 'Send Notification', icon: Bell },
          ].map((action, i) => (
            <a
              key={i}
              href={action.href}
              className="flex flex-col items-center p-7 text-center group relative overflow-hidden hover:-translate-y-1.5 transition-transform duration-300"
              style={{
                background: 'linear-gradient(145deg, #121F17, #0B1510)',
                border: '1px solid rgba(196,154,90,0.3)',
                borderRadius: '20px'
              }}
            >
              <div className="absolute inset-0 bg-[#C49A5A]/0 group-hover:bg-[#C49A5A]/5 transition-colors duration-300" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 shadow-[0_0_20px_rgba(196,154,90,0.15)] transition-opacity duration-300 pointer-events-none rounded-[20px]" />
              
              <div className="w-16 h-16 rounded-full bg-[#08120D] border border-[#C49A5A]/50 flex items-center justify-center mb-4 group-hover:border-[#C49A5A] group-hover:shadow-[0_0_15px_rgba(196,154,90,0.4)] transition-all duration-300 z-10">
                <action.icon className="w-7 h-7 text-[#C49A5A]" />
              </div>
              <span className="text-[#F8F5EE] text-[15px] font-bold mb-1 z-10">{action.title}</span>
              <span className="text-[#A8B5AA] text-[12px] font-medium z-10">{action.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
