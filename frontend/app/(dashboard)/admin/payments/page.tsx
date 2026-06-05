'use client';

import { useEffect, useState } from 'react';
import { Plus, X, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

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
    try {
      const [pRes, cRes, invRes] = await Promise.all([
        fetch(`${API_URL}/payments`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/investors`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/investments`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [pData, cData, invData] = await Promise.all([pRes.json(), cRes.json(), invRes.json()]);
      
      setPayments(pData.success ? pData.data : []);
      setInvestors(cData.success ? cData.data : []);
      setInvestments(invData.success ? invData.data : []);
    } catch (e) {
      console.error(e);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-white">Payments</h1>
          <p className="text-white/50 text-sm mt-1">{payments.length} payment records</p>
        </div>
        <Button onClick={() => { setForm(defaultForm); setShowModal(true); }} className="bg-[#c8851e] hover:bg-[#a96618] text-white gap-2">
          <Plus className="w-4 h-4" /> Record Payment
        </Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/20 rounded-2xl p-5">
          <div className="text-white/50 text-xs mb-1">Total Received</div>
          <div className="font-display text-2xl font-bold text-white">₹{(totalReceived / 1e5).toFixed(2)}L</div>
        </div>
        <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 rounded-2xl p-5">
          <div className="text-white/50 text-xs mb-1">Pending Payments</div>
          <div className="font-display text-2xl font-bold text-white">{pending}</div>
        </div>
        <div className="bg-gradient-to-br from-[#c8851e]/20 to-[#c8851e]/10 border border-[#c8851e]/20 rounded-2xl p-5">
          <div className="text-white/50 text-xs mb-1">Total Transactions</div>
          <div className="font-display text-2xl font-bold text-white">{payments.length}</div>
        </div>
      </div>

      <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/2">
                <th className="text-left px-5 py-3 text-white/50 font-medium">Investor</th>
                <th className="text-left px-5 py-3 text-white/50 font-medium">Amount</th>
                <th className="text-left px-5 py-3 text-white/50 font-medium hidden md:table-cell">Type</th>
                <th className="text-left px-5 py-3 text-white/50 font-medium hidden md:table-cell">Method</th>
                <th className="text-left px-5 py-3 text-white/50 font-medium">Date</th>
                <th className="text-left px-5 py-3 text-white/50 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-white/30">No payments recorded</td></tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3 text-white font-medium">{investorName(p.investor_id)}</td>
                    <td className="px-5 py-3 text-[#e9be55] font-semibold">₹{p.amount.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3 text-white/60 hidden md:table-cell capitalize">{p.payment_type.replace('_', ' ')}</td>
                    <td className="px-5 py-3 text-white/60 hidden md:table-cell capitalize">{p.payment_method.replace('_', ' ')}</td>
                    <td className="px-5 py-3 text-white/60">{p.payment_date}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        p.status === 'COMPLETED' ? 'bg-green-400/15 text-green-400' :
                        p.status === 'PENDING' ? 'bg-amber-400/15 text-amber-400' :
                        'bg-red-400/15 text-red-400'
                      }`}>
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
