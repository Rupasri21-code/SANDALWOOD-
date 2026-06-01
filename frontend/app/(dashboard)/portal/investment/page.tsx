'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';

type Investment = {
  id: string;
  amount: number;
  expected_returns: number;
  roi_percentage: number;
  investment_date: string;
  maturity_date: string | null;
  status: string;
  investment_type: string;
  contract_number: string;
  notes: string;
  land_id: string | null;
  landTitle?: string;
};

export default function PortalInvestmentPage() {
  const { profile } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!profile) return;
      const { data: cust } = await supabase.from('customers').select('id').eq('user_id', profile.id).maybeSingle();
      if (!cust) { setLoading(false); return; }

      const { data: inv } = await supabase.from('investments').select('*').eq('customer_id', cust.id).order('investment_date', { ascending: false });
      if (!inv?.length) { setLoading(false); return; }

      const landIds = inv.filter((i) => i.land_id).map((i) => i.land_id);
      let landMap: Record<string, string> = {};
      if (landIds.length) {
        const { data: lands } = await supabase.from('lands').select('id, title').in('id', landIds);
        landMap = Object.fromEntries((lands ?? []).map((l) => [l.id, l.title]));
      }

      setInvestments(inv.map((i) => ({ ...i, landTitle: i.land_id ? landMap[i.land_id] : undefined })));
      setLoading(false);
    };
    load();
  }, [profile]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-[#c8851e] border-t-transparent rounded-full animate-spin" /></div>;
  }

  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);
  const totalExpected = investments.reduce((s, i) => s + i.expected_returns, 0);
  const activeCount = investments.filter((i) => i.status === 'active').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#1a1a1a]">My Investment</h1>
        <p className="text-[#6b6b6b] text-sm mt-1">Overview of your sandalwood investment portfolio</p>
      </div>

      {/* Summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#0a1f0a] to-[#1a4a1a] rounded-2xl p-5 text-white">
          <div className="text-white/50 text-xs mb-1">Total Invested</div>
          <div className="font-display text-2xl font-bold">₹{totalInvested.toLocaleString('en-IN')}</div>
        </div>
        <div className="bg-gradient-to-br from-[#fdf3e0] to-[#faf6f2] rounded-2xl p-5 border border-[#c8851e]/20">
          <div className="text-[#6b6b6b] text-xs mb-1">Expected Returns</div>
          <div className="font-display text-2xl font-bold text-[#c8851e]">
            {totalExpected > 0 ? `₹${totalExpected.toLocaleString('en-IN')}` : '—'}
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200">
          <div className="text-[#6b6b6b] text-xs mb-1">Active Investments</div>
          <div className="font-display text-2xl font-bold text-green-700">{activeCount}</div>
        </div>
      </div>

      {/* Investment Cards */}
      {investments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e8e0d8]">
          <TrendingUp className="w-10 h-10 text-[#c8851e]/30 mx-auto mb-3" />
          <p className="text-[#6b6b6b] text-sm">No investment records found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {investments.map((inv) => (
            <div key={inv.id} className="bg-white rounded-2xl border border-[#e8e0d8] shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-display text-xl font-semibold text-[#1a1a1a]">
                    ₹{inv.amount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[#6b6b6b] text-xs mt-0.5">
                    Contract: {inv.contract_number || 'N/A'} · {inv.investment_type.replace('_', ' ')}
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  inv.status === 'active' ? 'bg-green-100 text-green-700' :
                  inv.status === 'matured' ? 'bg-[#fdf3e0] text-[#c8851e]' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {inv.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-[#faf6f2] rounded-xl p-3">
                  <div className="text-[#6b6b6b] text-[10px] mb-0.5">Land</div>
                  <div className="text-[#1a1a1a] text-xs font-medium">{inv.landTitle || '—'}</div>
                </div>
                <div className="bg-[#faf6f2] rounded-xl p-3">
                  <div className="text-[#6b6b6b] text-[10px] mb-0.5">ROI %</div>
                  <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                    <ArrowUpRight className="w-3 h-3" />{inv.roi_percentage}%
                  </div>
                </div>
                <div className="bg-[#faf6f2] rounded-xl p-3">
                  <div className="text-[#6b6b6b] text-[10px] mb-0.5">Investment Date</div>
                  <div className="text-[#1a1a1a] text-xs font-medium">{inv.investment_date}</div>
                </div>
                <div className="bg-[#faf6f2] rounded-xl p-3">
                  <div className="text-[#6b6b6b] text-[10px] mb-0.5">Maturity Date</div>
                  <div className="text-[#1a1a1a] text-xs font-medium">{inv.maturity_date || '—'}</div>
                </div>
              </div>

              {inv.expected_returns > 0 && (
                <div className="bg-gradient-to-r from-[#fdf3e0] to-[#faf6f2] rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[#6b6b6b] text-xs">Expected Returns at Maturity</div>
                      <div className="font-semibold text-[#c8851e] text-lg">₹{inv.expected_returns.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#6b6b6b] text-xs">Profit</div>
                      <div className="text-green-600 font-semibold">
                        +₹{(inv.expected_returns - inv.amount).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
