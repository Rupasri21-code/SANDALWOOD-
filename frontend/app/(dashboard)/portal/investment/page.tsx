'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { TrendingUp, CreditCard, ArrowUpRight, Activity, Calendar } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function PortalInvestmentPage() {
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res1 = await fetch(`${API_URL}/investments/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data1 = await res1.json();
        if (data1.success) setInvestments(data1.data);
        
        const res2 = await fetch(`${API_URL}/payments/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data2 = await res2.json();
        if (data2.success) setPayments(data2.data);
      } catch (err) {
        console.error('Failed to load investment data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-[#C49A5A] border-t-transparent rounded-full animate-spin" /></div>;
  }

  const totalInvested = investments.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const totalPaid = payments.filter(p => p.status === 'COMPLETED').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalPending = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + (Number(p.amount) || 0), 0) + Math.max(0, totalInvested - totalPaid);
  const estimatedValue = totalInvested > 0 ? totalInvested * 6 : 0; // Rough 6x ROI projection over term

  const statCards = [
    { label: 'Total Investment', value: `₹${totalInvested.toLocaleString('en-IN')}`, icon: TrendingUp, change: 'Principal', color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/20' },
    { label: 'Paid Amount', value: `₹${totalPaid.toLocaleString('en-IN')}`, icon: CreditCard, change: totalInvested > 0 ? `${Math.round((totalPaid/totalInvested)*100)}% Paid` : '0%', color: 'from-green-500/20 to-green-600/10', border: 'border-green-500/20' },
    { label: 'Pending Amount', value: `₹${totalPending.toLocaleString('en-IN')}`, icon: Calendar, change: 'Remaining', color: 'from-[#c8851e]/20 to-[#c8851e]/10', border: 'border-[#c8851e]/20' },
    { label: 'Estimated Value', value: `₹${estimatedValue.toLocaleString('en-IN')}`, icon: Activity, change: '+600% ROI', color: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/20' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#F7F0E4]">My Investment</h1>
        <p className="text-[#B8B8A8] text-sm mt-1">Track your financial commitments and projected returns.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className={`bg-gradient-to-br ${card.color} border ${card.border} rounded-2xl p-5`}>
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-white/5">
                <card.icon className="w-4 h-4 text-white/70" />
              </div>
              <span className="text-[#22C55E] text-[11px] uppercase tracking-widest font-medium flex items-center gap-0.5">
                {card.change}
              </span>
            </div>
            <div className="font-display text-2xl font-bold text-white mb-0.5">{card.value}</div>
            <div className="text-white/50 text-xs">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Investment Growth Projection Chart */}
        <div className="lg:col-span-2 bg-[rgba(18,55,42,0.35)] border border-[rgba(196,154,90,0.25)] rounded-[20px] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#F7F0E4] font-semibold text-base">Investment Growth Projection</h2>
            <span className="text-[#C49A5A] text-xs font-medium uppercase tracking-widest bg-[#C49A5A]/10 px-3 py-1 rounded-full border border-[#C49A5A]/20">Harvest Year: ~12 Yrs</span>
          </div>
          <div className="h-[250px] w-full bg-black/20 rounded-xl border border-white/5 flex items-end justify-between p-4 gap-2 relative">
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
              {[6, 4, 2, 1, 0].map((v) => (
                <div key={v} className="w-full h-px bg-white/5 flex items-center">
                  <span className="text-white/20 text-[9px] -translate-y-1/2 -ml-6">{v}x</span>
                </div>
              ))}
            </div>
            
            {[
              { year: 'Y1', height: '10%' },
              { year: 'Y3', height: '15%' },
              { year: 'Y6', height: '25%' },
              { year: 'Y9', height: '40%' },
              { year: 'Y11', height: '60%' },
              { year: 'Y12', height: '95%' },
            ].map((bar, i) => (
              <div key={i} className="flex flex-col items-center w-full gap-2 z-10">
                <div className="w-full max-w-[40px] bg-gradient-to-t from-[#12372A] to-[#C49A5A] rounded-t-sm transition-all duration-1000" style={{ height: bar.height }}></div>
                <span className="text-[#B8B8A8] text-[10px]">{bar.year}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 text-xs text-[#B8B8A8]">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-[#12372A]"></div> Base Value</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-[#C49A5A]"></div> Projected Appreciation</div>
          </div>
        </div>

        {/* Recent Payments - Using Admin style */}
        <div className="bg-[rgba(18,55,42,0.35)] border border-[rgba(196,154,90,0.25)] rounded-[20px] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <h2 className="text-[#F7F0E4] font-semibold text-sm">Recent Payments</h2>
            <Link href="/portal/payments" className="text-[#C49A5A] text-xs hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {payments.slice(0, 5).map((p, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div>
                  <div className="text-white text-xs font-medium">₹{Number(p.amount).toLocaleString('en-IN')}</div>
                  <div className="text-white/40 text-[10px]">{new Date(p.payment_date).toLocaleDateString('en-IN')}</div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  p.status === 'COMPLETED' ? 'bg-green-400/15 text-[#22C55E]' :
                  p.status === 'PENDING' ? 'bg-amber-400/15 text-amber-400' : 'bg-red-400/15 text-red-400'
                }`}>
                  {p.status}
                </span>
              </div>
            ))}
            {payments.length === 0 && (
               <div className="p-6 text-center text-white/30 text-xs">No payments found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
