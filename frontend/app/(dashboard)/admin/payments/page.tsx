'use client';

import { useEffect, useState } from 'react';
import { Plus, X, CreditCard, Banknote, Clock, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

type Payment = {
  id: string;
  investor_id: string;
  amount: number;
  payment_type: string;
  payment_method: string;
  transaction_id: string;
  payment_date: string;
  status: string;
};

type Investor = { id: string; full_name: string };
type Investment = { id: string; contract_number: string; investor_id: string };

const defaultForm = {
  investor_id: '', investment_id: '', amount: '', payment_type: 'installment',
  payment_method: 'bank_transfer', transaction_id: '', payment_date: new Date().toISOString().split('T')[0],
  status: 'completed', notes: '',
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found in localStorage');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/payments`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setPayments(data.data);
      } else {
        console.error('Failed to fetch payments:', data.message);
        toast.error('Failed to fetch payments: ' + data.message);
        setPayments([]);
      }
    } catch (e: any) {
      console.error('Error fetching payments:', e);
      toast.error('Error fetching payments: ' + e.message);
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

    try {
      const res = await fetch(`${API_URL}/investments`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setInvestments(data.data);
      } else {
        console.error('Failed to fetch investments:', data.message);
        toast.error('Failed to fetch investments: ' + data.message);
        setInvestments([]);
      }
    } catch (e: any) {
      console.error('Error fetching investments:', e);
      toast.error('Error fetching investments: ' + e.message);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const totalReceived = payments.filter((p) => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter((p) => p.status === 'pending').length;

  const handleSave = async () => {
    // Validations
    if (!form.investor_id) {
      toast.error('Please select an investor');
      return;
    }

    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Amount must be a number greater than 0');
      return;
    }

    if (!form.payment_date) {
      toast.error('Payment date is required');
      return;
    }

    const pDate = new Date(form.payment_date);
    if (pDate > new Date()) {
      toast.error('Payment date cannot be in the future');
      return;
    }

    const txId = form.transaction_id?.trim() || '';
    if (!txId) {
      toast.error('Transaction ID is required');
      return;
    }
    
    if (txId.length < 8) {
      toast.error('Transaction ID must be at least 8 characters long');
      return;
    }

    if (!/^[a-zA-Z0-9-_]+$/.test(txId)) {
      toast.error('Transaction ID can only contain letters, numbers, hyphens, and underscores');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${API_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          investorId: form.investor_id,
          investmentId: form.investment_id || undefined,
          amount: parseFloat(form.amount),
          paymentType: form.payment_type,
          paymentMethod: form.payment_method,
          transactionId: form.transaction_id || `TRX-${Date.now()}`,
          paymentDate: form.payment_date || undefined,
          status: form.status.toUpperCase(),
          notes: form.notes
        })
      });
      if (!res.ok) throw new Error('Create failed');
      toast.success('Payment recorded');
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      toast.error('Failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const investorName = (id: string) => investors.find((c) => c.id === id)?.full_name || '—';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-[#F8F5EE] tracking-tight">Payments</h1>
          <p className="text-[#A8B5AA] text-[15px] mt-1.5 font-medium">{payments.length} payment records</p>
        </div>
        <button 
          onClick={() => { setForm(defaultForm); setShowModal(true); }} 
          className="h-[48px] px-6 rounded-[16px] text-white font-bold flex items-center gap-3 shadow-[0_10px_20px_rgba(196,154,90,0.2)] hover:shadow-[0_0_25px_rgba(196,154,90,0.5)] hover:-translate-y-1 transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, #C49A5A, #D9B36D)' }}
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm">
            <Plus className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
          Record Payment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          style={{ background: 'linear-gradient(135deg, #0F2745, #153C72, #1E5DB4)', border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}
          className="rounded-[24px] p-6 flex flex-col justify-between h-[130px] relative overflow-hidden group hover:scale-[1.03] hover:brightness-[1.08] transition-all duration-300"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px] pointer-events-none" style={{ boxShadow: '0 0 30px rgba(30,93,180,0.6) inset, 0 0 25px rgba(30,93,180,0.6)' }} />
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[24px]" />
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 rounded-full flex items-center justify-center border border-white/20 shadow-sm backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.12)' }}>
              <Banknote className="w-5 h-5 text-[#C49A5A]" />
            </div>
            <div className="font-display text-2xl font-bold text-white tracking-tight drop-shadow-md">₹{(totalReceived / 1e5).toFixed(2)}L</div>
          </div>
          <div className="flex items-end justify-between relative z-10 mt-auto">
            <div className="text-white/90 text-sm font-semibold tracking-wide drop-shadow-sm">Total Received</div>
          </div>
        </div>

        <div 
          style={{ background: 'linear-gradient(135deg, #0E2A1D, #12643A, #1F8A50)', border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}
          className="rounded-[24px] p-6 flex flex-col justify-between h-[130px] relative overflow-hidden group hover:scale-[1.03] hover:brightness-[1.08] transition-all duration-300"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px] pointer-events-none" style={{ boxShadow: '0 0 30px rgba(31,138,80,0.6) inset, 0 0 25px rgba(31,138,80,0.6)' }} />
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[24px]" />
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 rounded-full flex items-center justify-center border border-white/20 shadow-sm backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.12)' }}>
              <Clock className="w-5 h-5 text-[#C49A5A]" />
            </div>
            <div className="font-display text-2xl font-bold text-white tracking-tight drop-shadow-md">{pending}</div>
          </div>
          <div className="flex items-end justify-between relative z-10 mt-auto">
            <div className="text-white/90 text-sm font-semibold tracking-wide drop-shadow-sm">Pending Payments</div>
          </div>
        </div>

        <div 
          style={{ background: 'linear-gradient(135deg, #3A2804, #8A6411, #D4A017)', border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}
          className="rounded-[24px] p-6 flex flex-col justify-between h-[130px] relative overflow-hidden group hover:scale-[1.03] hover:brightness-[1.08] transition-all duration-300"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px] pointer-events-none" style={{ boxShadow: '0 0 30px rgba(212,160,23,0.6) inset, 0 0 25px rgba(212,160,23,0.6)' }} />
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[24px]" />
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 rounded-full flex items-center justify-center border border-white/20 shadow-sm backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.12)' }}>
              <Activity className="w-5 h-5 text-[#C49A5A]" />
            </div>
            <div className="font-display text-2xl font-bold text-white tracking-tight drop-shadow-md">{payments.length}</div>
          </div>
          <div className="flex items-end justify-between relative z-10 mt-auto">
            <div className="text-white/90 text-sm font-semibold tracking-wide drop-shadow-sm">Total Transactions</div>
          </div>
        </div>
      </div>

      <div 
        className="rounded-[24px] overflow-hidden relative"
        style={{
          background: 'linear-gradient(145deg, rgba(18,31,23,.95), rgba(10,15,12,.98))',
          border: '1px solid rgba(196,154,90,.3)',
          boxShadow: '0 20px 40px rgba(0,0,0,.5)'
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 backdrop-blur-md">
              <tr>
                {['Investor', 'Amount', 'Type', 'Method', 'Date', 'Status'].map((h, i) => (
                  <th key={i} className={`text-left px-7 py-4 font-bold text-[13px] tracking-wider uppercase text-[#C49A5A] whitespace-nowrap ${i === 2 || i === 3 ? 'hidden md:table-cell' : ''}`} style={{ background: 'rgba(196,154,90,.08)', height: '64px' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C49A5A]/10">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-[#A8B5AA] font-medium text-base">
                    No payments recorded
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="group transition-all duration-300 hover:bg-[rgba(196,154,90,.05)]" style={{ height: '80px' }}>
                    <td className="px-7 py-4 transition-transform duration-300 group-hover:translate-x-[5px]">
                      <div className="flex items-center gap-4">
                        <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-[#121F17] to-[#0A1A12] border border-[#C49A5A]/50 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(196,154,90,0.2)]">
                          <CreditCard className="w-5 h-5 text-[#C49A5A]" />
                        </div>
                        <div className="text-[#F8F5EE] font-semibold text-[15px]">{investorName(p.investor_id)}</div>
                      </div>
                    </td>
                    <td className="px-7 py-4 transition-transform duration-300 group-hover:translate-x-[5px]">
                      <span className="text-[#C49A5A] font-bold text-[15px]">₹{p.amount.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-7 py-4 text-[#A8B5AA] font-medium hidden md:table-cell capitalize transition-transform duration-300 group-hover:translate-x-[5px]">
                      {p.payment_type.replace('_', ' ')}
                    </td>
                    <td className="px-7 py-4 hidden md:table-cell transition-transform duration-300 group-hover:translate-x-[5px]">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full font-semibold text-[11px] uppercase tracking-wider bg-white/5 border border-white/10 text-[#A8B5AA]">
                        {p.payment_method.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-7 py-4 text-[#A8B5AA] font-medium transition-transform duration-300 group-hover:translate-x-[5px]">
                      {p.payment_date}
                    </td>
                    <td className="px-7 py-4 transition-transform duration-300 group-hover:translate-x-[5px]">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[11px] uppercase tracking-wider ${
                        p.status === 'COMPLETED' ? 'bg-[#22C55E]/12 text-[#22C55E]' :
                        p.status === 'PENDING' ? 'bg-[#EAB308]/12 text-[#EAB308]' :
                        'bg-[#EF4444]/12 text-[#EF4444]'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          p.status === 'COMPLETED' ? 'bg-[#22C55E]' : 
                          p.status === 'PENDING' ? 'bg-[#EAB308]' : 
                          'bg-[#EF4444]'
                        }`} />
                        {p.status?.toLowerCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#141410] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="text-white font-semibold">Record Payment</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-white/40" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <Label className="text-white/70 text-xs mb-1">Investor *</Label>
                <select value={form.investor_id} onChange={(e) => setForm({ ...form, investor_id: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e]">
                  <option value="" className="bg-[#141410]">Select investor</option>
                  {investors.map((c) => <option key={c.id} value={c.id} className="bg-[#141410]">{c.full_name}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-white/70 text-xs mb-1">Investment (optional)</Label>
                <select value={form.investment_id} onChange={(e) => setForm({ ...form, investment_id: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e]">
                  <option value="" className="bg-[#141410]">— None —</option>
                  {investments.filter((i) => !form.investor_id || i.investor_id === form.investor_id).map((i) => (
                    <option key={i.id} value={i.id} className="bg-[#141410]">{i.contract_number || i.id.slice(0,8)}</option>
                  ))}
                </select>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70 text-xs mb-1">Amount (₹) *</Label>
                  <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                </div>
                <div>
                  <Label className="text-white/70 text-xs mb-1">Payment Date</Label>
                  <Input type="date" value={form.payment_date} onChange={(e) => setForm({ ...form, payment_date: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70 text-xs mb-1">Payment Type</Label>
                  <select value={form.payment_type} onChange={(e) => setForm({ ...form, payment_type: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e]">
                    {['installment','full','returns','refund','maintenance_fee'].map((t) => <option key={t} value={t} className="bg-[#141410]">{t.replace('_',' ')}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-white/70 text-xs mb-1">Status</Label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e]">
                    {['completed','pending','failed','refunded'].map((s) => <option key={s} value={s} className="bg-[#141410]">{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <Label className="text-white/70 text-xs mb-1">Transaction ID</Label>
                <Input value={form.transaction_id} onChange={(e) => setForm({ ...form, transaction_id: e.target.value })}
                  className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-white/10">
              <Button variant="ghost" onClick={() => setShowModal(false)} className="flex-1 text-white/60 hover:bg-white/5">Cancel</Button>
              <Button onClick={handleSave} disabled={loading} className="flex-1 bg-[#c8851e] hover:bg-[#a96618] text-white">
                {loading ? 'Saving...' : 'Record Payment'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
