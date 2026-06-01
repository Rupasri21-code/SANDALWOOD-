'use client';

import { useEffect, useState } from 'react';
import { Plus, X, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

type Investment = {
  id: string;
  customer_id: string;
  land_id: string | null;
  amount: number;
  roi_percentage: number;
  status: string;
  investment_date: string;
  contract_number: string;
  expected_returns: number;
};

type Customer = { id: string; full_name: string };
type Land = { id: string; title: string };

const defaultForm = {
  customer_id: '', land_id: '', investment_type: 'full_purchase',
  amount: '', investment_date: new Date().toISOString().split('T')[0],
  maturity_date: '', expected_returns: '', roi_percentage: '',
  status: 'active', contract_number: '', notes: '',
};

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [lands, setLands] = useState<Land[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchData = async () => {
    const [inv, c, l] = await Promise.all([
      supabase.from('investments').select('*').order('created_at', { ascending: false }),
      supabase.from('customers').select('id, full_name'),
      supabase.from('lands').select('id, title'),
    ]);
    setInvestments(inv.data ?? []);
    setCustomers(c.data ?? []);
    setLands(l.data ?? []);
  };

  useEffect(() => { fetchData(); }, []);

  const totalAUM = investments.reduce((s, i) => s + i.amount, 0);
  const activeCount = investments.filter((i) => i.status === 'active').length;

  const handleSave = async () => {
    if (!form.customer_id || !form.amount) { toast.error('Customer and amount required'); return; }
    setLoading(true);
    const payload = {
      ...form,
      amount: parseFloat(form.amount),
      expected_returns: parseFloat(form.expected_returns) || 0,
      roi_percentage: parseFloat(form.roi_percentage) || 0,
      land_id: form.land_id || null,
      maturity_date: form.maturity_date || null,
    };
    const { error } = editId
      ? await supabase.from('investments').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editId)
      : await supabase.from('investments').insert(payload);
    setLoading(false);
    if (error) { toast.error('Failed: ' + error.message); return; }
    toast.success(editId ? 'Updated' : 'Investment created');
    setShowModal(false);
    fetchData();
  };

  const customerName = (id: string) => customers.find((c) => c.id === id)?.full_name || '—';
  const landTitle = (id: string | null) => id ? lands.find((l) => l.id === id)?.title || '—' : '—';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-white">Investments</h1>
          <p className="text-white/50 text-sm mt-1">{investments.length} investment records</p>
        </div>
        <Button onClick={() => { setForm(defaultForm); setEditId(null); setShowModal(true); }} className="bg-[#c8851e] hover:bg-[#a96618] text-white gap-2">
          <Plus className="w-4 h-4" /> Add Investment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#c8851e]/20 to-[#c8851e]/10 border border-[#c8851e]/20 rounded-2xl p-5">
          <div className="text-white/50 text-xs mb-1">Total AUM</div>
          <div className="font-display text-2xl font-bold text-white">₹{(totalAUM / 1e7).toFixed(2)} Cr</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/20 rounded-2xl p-5">
          <div className="text-white/50 text-xs mb-1">Active Investments</div>
          <div className="font-display text-2xl font-bold text-white">{activeCount}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 rounded-2xl p-5">
          <div className="text-white/50 text-xs mb-1">Avg. ROI</div>
          <div className="font-display text-2xl font-bold text-white">
            {investments.length > 0 ? (investments.reduce((s, i) => s + i.roi_percentage, 0) / investments.length).toFixed(1) : 0}%
          </div>
        </div>
      </div>

      <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/2">
                <th className="text-left px-5 py-3 text-white/50 font-medium">Customer</th>
                <th className="text-left px-5 py-3 text-white/50 font-medium">Amount</th>
                <th className="text-left px-5 py-3 text-white/50 font-medium hidden md:table-cell">Land</th>
                <th className="text-left px-5 py-3 text-white/50 font-medium hidden md:table-cell">ROI</th>
                <th className="text-left px-5 py-3 text-white/50 font-medium">Status</th>
                <th className="text-right px-5 py-3 text-white/50 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {investments.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-white/30">No investments yet</td></tr>
              ) : (
                investments.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3">
                      <div className="text-white font-medium">{customerName(inv.customer_id)}</div>
                      <div className="text-white/40 text-xs">{inv.contract_number || '—'}</div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-[#e9be55] font-semibold">₹{inv.amount.toLocaleString('en-IN')}</div>
                      <div className="text-white/40 text-xs">{inv.investment_date}</div>
                    </td>
                    <td className="px-5 py-3 text-white/60 hidden md:table-cell">{landTitle(inv.land_id)}</td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className="flex items-center gap-1 text-green-400 text-xs">
                        <ArrowUpRight className="w-3 h-3" /> {inv.roi_percentage}%
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        inv.status === 'active' ? 'bg-green-400/15 text-green-400' :
                        inv.status === 'matured' ? 'bg-[#c8851e]/15 text-[#e9be55]' :
                        'bg-white/10 text-white/60'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => {
                        setForm({ ...defaultForm, customer_id: inv.customer_id, land_id: inv.land_id || '', amount: String(inv.amount), roi_percentage: String(inv.roi_percentage), expected_returns: String(inv.expected_returns), status: inv.status, contract_number: inv.contract_number, investment_date: inv.investment_date });
                        setEditId(inv.id); setShowModal(true);
                      }} className="text-[#c8851e]/60 hover:text-[#e9be55] text-xs px-2 py-1 rounded border border-white/10 hover:border-[#c8851e]/30">
                        Edit
                      </button>
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
              <h2 className="text-white font-semibold">{editId ? 'Edit Investment' : 'New Investment'}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-white/40" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <Label className="text-white/70 text-xs mb-1">Customer *</Label>
                <select value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e]">
                  <option value="" className="bg-[#141410]">Select customer</option>
                  {customers.map((c) => <option key={c.id} value={c.id} className="bg-[#141410]">{c.full_name}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-white/70 text-xs mb-1">Land</Label>
                <select value={form.land_id} onChange={(e) => setForm({ ...form, land_id: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e]">
                  <option value="" className="bg-[#141410]">— None —</option>
                  {lands.map((l) => <option key={l.id} value={l.id} className="bg-[#141410]">{l.title}</option>)}
                </select>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70 text-xs mb-1">Amount (₹) *</Label>
                  <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                </div>
                <div>
                  <Label className="text-white/70 text-xs mb-1">Expected Returns (₹)</Label>
                  <Input type="number" value={form.expected_returns} onChange={(e) => setForm({ ...form, expected_returns: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70 text-xs mb-1">ROI %</Label>
                  <Input type="number" value={form.roi_percentage} onChange={(e) => setForm({ ...form, roi_percentage: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                </div>
                <div>
                  <Label className="text-white/70 text-xs mb-1">Contract Number</Label>
                  <Input value={form.contract_number} onChange={(e) => setForm({ ...form, contract_number: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70 text-xs mb-1">Investment Date</Label>
                  <Input type="date" value={form.investment_date} onChange={(e) => setForm({ ...form, investment_date: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                </div>
                <div>
                  <Label className="text-white/70 text-xs mb-1">Maturity Date</Label>
                  <Input type="date" value={form.maturity_date} onChange={(e) => setForm({ ...form, maturity_date: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                </div>
              </div>
              <div>
                <Label className="text-white/70 text-xs mb-1">Status</Label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e]">
                  {['active','pending','matured','withdrawn'].map((s) => <option key={s} value={s} className="bg-[#141410]">{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-white/10">
              <Button variant="ghost" onClick={() => setShowModal(false)} className="flex-1 text-white/60 hover:bg-white/5">Cancel</Button>
              <Button onClick={handleSave} disabled={loading} className="flex-1 bg-[#c8851e] hover:bg-[#a96618] text-white">
                {loading ? 'Saving...' : editId ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
