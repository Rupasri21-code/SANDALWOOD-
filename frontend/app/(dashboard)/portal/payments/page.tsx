'use client';

import { useEffect, useState } from 'react';
import { Download, FileText, TrendingUp, CreditCard, Calendar, CheckCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function PortalPaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);
  const [totalInvestment, setTotalInvestment] = useState(0);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res1 = await fetch(`${API_URL}/investments/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data1 = await res1.json();
        if (data1.success) {
          setTotalInvestment(data1.data.reduce((sum: number, inv: any) => sum + (Number(inv.amount) || 0), 0));
        }
        
        const res2 = await fetch(`${API_URL}/payments/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data2 = await res2.json();
        if (data2.success) setPayments(data2.data);
      } catch (err) {
        console.error('Failed to load payment data:', err);
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

  const totalPaid = payments.filter(p => p.status === 'COMPLETED').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const pendingAmount = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + (Number(p.amount) || 0), 0) + Math.max(0, totalInvestment - totalPaid);

  const statCards = [
    { label: 'Total Investment', value: `₹${totalInvestment.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/20' },
    { label: 'Total Paid', value: `₹${totalPaid.toLocaleString('en-IN')}`, icon: CheckCircle, color: 'from-green-500/20 to-green-600/10', border: 'border-green-500/20' },
    { label: 'Pending Amount', value: `₹${pendingAmount.toLocaleString('en-IN')}`, icon: Calendar, color: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/20' },
    { label: 'Payment Status', value: pendingAmount > 0 ? 'Pending Dues' : 'On Track', icon: CreditCard, color: 'from-[#c8851e]/20 to-[#c8851e]/10', border: 'border-[#c8851e]/20' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#F7F0E4]">Payment History</h1>
        <p className="text-[#B8B8A8] text-sm mt-1">Track your installment payments and download receipts.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className={`bg-gradient-to-br ${card.color} border ${card.border} rounded-2xl p-5`}>
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-white/5">
                <card.icon className="w-4 h-4 text-white/70" />
              </div>
            </div>
            <div className="font-display text-2xl font-bold text-white mb-0.5">{card.value}</div>
            <div className="text-white/50 text-xs">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[rgba(18,55,42,0.35)] border border-[rgba(196,154,90,0.25)] rounded-[20px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 border-b border-white/5 text-[#B8B8A8] text-[11px] uppercase tracking-widest">
                <th className="p-5 font-medium">Date</th>
                <th className="p-5 font-medium">Transaction ID</th>
                <th className="p-5 font-medium">Amount</th>
                <th className="p-5 font-medium">Payment Mode</th>
                <th className="p-5 font-medium">Status</th>
                <th className="p-5 font-medium text-right">Receipt / Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {payments.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-white/30">No payments found</td></tr>
              ) : payments.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-5 text-[#F7F0E4] font-medium">{new Date(p.payment_date).toLocaleDateString('en-IN')}</td>
                  <td className="p-5 text-[#B8B8A8] font-mono text-xs">{p.transaction_id || '-'}</td>
                  <td className="p-5 text-[#F7F0E4] font-semibold">₹{Number(p.amount).toLocaleString('en-IN')}</td>
                  <td className="p-5 text-[#B8B8A8] capitalize">{p.payment_method?.replace('_', ' ')}</td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      p.status === 'COMPLETED' ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20' :
                      p.status === 'PENDING' ? 'bg-[#C49A5A]/10 text-[#C49A5A] border border-[#C49A5A]/20' :
                      'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    {p.status === 'COMPLETED' ? (
                      <button className="inline-flex items-center gap-1.5 text-[#C49A5A] hover:text-[#F7F0E4] text-xs font-medium transition-colors">
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    ) : p.notes && p.notes.includes('http') ? (
                      <a href={p.notes} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[#B8B8A8] hover:text-[#F7F0E4] text-xs font-medium transition-colors">
                        <FileText className="w-3.5 h-3.5" /> View Proof
                      </a>
                    ) : (
                      <span className="text-white/20 text-xs">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
