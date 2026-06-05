'use client';

import { useEffect, useState } from 'react';
import { Plus, X, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

type Investment = {
  id: string;
  investor_id: string;
  land_id: string | null;
  amount: number;
  roi_percentage: number;
  status: string;
  investment_date: string;
  contract_number: string;
  expected_returns: number;
};

type Investor = { id: string; full_name: string };
type Land = { id: string; title: string; investor_id?: string | null };

const defaultForm = {
  investor_id: '', land_id: '', investment_type: 'full_purchase',
  amount: '', investment_date: new Date().toISOString().split('T')[0],
  maturity_date: '', expected_returns: '', roi_percentage: '',
  status: 'active', contract_number: '', notes: '',
};

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [lands, setLands] = useState<Land[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [invRes, custRes, landsRes] = await Promise.all([
        fetch(`${API_URL}/investments`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/investors`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/lands`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      
      const [invData, custData, landsData] = await Promise.all([invRes.json(), custRes.json(), landsRes.json()]);
      setInvestments(invData.success ? invData.data : []);
      setInvestors(custData.success ? custData.data : []);
      setLands(landsData.success ? landsData.data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const totalAUM = investments.reduce((s, i) => s + i.amount, 0);
  const activeCount = investments.filter((i) => i.status === 'active').length;

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

    if (!form.investment_date) {
      toast.error('Investment date is required');
      return;
    }

    const invDate = new Date(form.investment_date);
    if (form.maturity_date) {
      const matDate = new Date(form.maturity_date);
      if (matDate <= invDate) {
        toast.error('Maturity date must be after the investment date');
        return;
      }
    }

    const expected = parseFloat(form.expected_returns);
    if (form.expected_returns !== '' && (isNaN(expected) || expected < 0)) {
      toast.error('Expected Returns must be a valid positive number');
      return;
    }

    const roi = parseFloat(form.roi_percentage);
    if (form.roi_percentage !== '' && (isNaN(roi) || roi < 0)) {
      toast.error('ROI must be a valid positive number');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    
    const payload = {
      investorId: form.investor_id,
      landId: form.land_id || undefined,
      investmentType: form.investment_type,
      amount: parseFloat(form.amount),
      investmentDate: form.investment_date || undefined,
      maturityDate: form.maturity_date || undefined,
      expectedReturns: parseFloat(form.expected_returns) || 0,
      roiPercentage: parseFloat(form.roi_percentage) || 0,
      status: form.status.toUpperCase(),
      contractNumber: form.contract_number || `INV-${Date.now()}`,
      notes: form.notes
    };
    
    try {
      if (editId) {
        const res = await fetch(`${API_URL}/investments/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Update failed');
        toast.success('Updated');
      } else {
        const res = await fetch(`${API_URL}/investments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Create failed');
        toast.success('Investment created');
      }
      setShowModal(false);
      fetchData();
    } catch(err: any) {
      toast.error('Failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const investorName = (id: string) => investors.find((c) => c.id === id)?.full_name || '—';
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
                <th className="text-left px-5 py-3 text-white/50 font-medium">Investor</th>
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
                      <div className="text-white font-medium">{investorName(inv.investor_id)}</div>
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
                        inv.status === 'ACTIVE' ? 'bg-green-400/15 text-green-400' :
                        inv.status === 'MATURED' ? 'bg-[#c8851e]/15 text-[#e9be55]' :
                        'bg-white/10 text-white/60'
                      }`}>
                        {inv.status?.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => {
                        setForm({ ...defaultForm, investor_id: inv.investor_id, land_id: inv.land_id || '', amount: String(inv.amount), roi_percentage: String(inv.roi_percentage), expected_returns: String(inv.expected_returns), status: inv.status, contract_number: inv.contract_number, investment_date: inv.investment_date });
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
                <Label className="text-white/70 text-xs mb-1">Investor *</Label>
                <select value={form.investor_id} onChange={(e) => setForm({ ...form, investor_id: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e]">
                  <option value="" className="bg-[#141410]">Select investor</option>
                  {investors.map((c) => <option key={c.id} value={c.id} className="bg-[#141410]">{c.full_name}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-white/70 text-xs mb-1">Land</Label>
                <select 
                  value={form.land_id} 
                  onChange={(e) => setForm({ ...form, land_id: e.target.value })}
                  disabled={!form.investor_id}
                  className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e] disabled:opacity-50 disabled:cursor-not-allowed">
                  {!form.investor_id ? (
                    <option value="" className="bg-[#141410]">Select investor first</option>
                  ) : (
                    <>
                      <option value="" className="bg-[#141410]">— None —</option>
                      {lands.filter(l => l.investor_id === form.investor_id).length === 0 ? (
                        <option value="" disabled className="bg-[#141410]">No land assigned to this investor</option>
                      ) : (
                        lands.filter(l => l.investor_id === form.investor_id).map((l) => (
                          <option key={l.id} value={l.id} className="bg-[#141410]">{l.title}</option>
                        ))
                      )}
                    </>
                  )}
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
