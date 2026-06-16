'use client';

import { useEffect, useState } from 'react';
import { Plus, X, TrendingUp, ArrowUpRight, Activity, Users, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

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
    if (!token) {
      console.warn('No authentication token found in localStorage');
      return;
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
      const res = await fetch(`${API_URL}/lands`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setLands(data.data);
      } else {
        console.error('Failed to fetch lands:', data.message);
        toast.error('Failed to fetch lands: ' + data.message);
        setLands([]);
      }
    } catch (e: any) {
      console.error('Error fetching lands:', e);
      toast.error('Error fetching lands: ' + e.message);
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-[#F8F5EE] tracking-tight">Investments</h1>
          <p className="text-[#A8B5AA] text-[15px] mt-1.5 font-medium">{investments.length} investment records</p>
        </div>
        <button 
          onClick={() => { setForm(defaultForm); setEditId(null); setShowModal(true); }} 
          className="h-[48px] px-6 rounded-[16px] text-white font-bold flex items-center gap-3 shadow-[0_10px_20px_rgba(196,154,90,0.2)] hover:shadow-[0_0_25px_rgba(196,154,90,0.5)] hover:-translate-y-1 transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, #C49A5A, #D9B36D)' }}
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm">
            <Plus className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
          Add Investment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          style={{ background: 'linear-gradient(135deg, #0F2745, #153C72, #1E5DB4)', border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}
          className="rounded-[24px] p-6 flex flex-col justify-between h-[130px] relative overflow-hidden group hover:scale-[1.03] hover:brightness-[1.08] transition-all duration-300"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px] pointer-events-none" style={{ boxShadow: '0 0 30px rgba(30,93,180,0.6) inset, 0 0 25px rgba(30,93,180,0.6)' }} />
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[24px]" />
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 rounded-full flex items-center justify-center border border-white/20 shadow-sm backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.12)' }}>
              <Activity className="w-5 h-5 text-[#C49A5A]" />
            </div>
            <div className="font-display text-2xl font-bold text-white tracking-tight drop-shadow-md">₹{(totalAUM / 1e7).toFixed(2)} Cr</div>
          </div>
          <div className="flex items-end justify-between relative z-10 mt-auto">
            <div className="text-white/90 text-sm font-semibold tracking-wide drop-shadow-sm">Total Investment</div>
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
              <Users className="w-5 h-5 text-[#C49A5A]" />
            </div>
            <div className="font-display text-2xl font-bold text-white tracking-tight drop-shadow-md">{activeCount}</div>
          </div>
          <div className="flex items-end justify-between relative z-10 mt-auto">
            <div className="text-white/90 text-sm font-semibold tracking-wide drop-shadow-sm">Active Investors</div>
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
              <Percent className="w-5 h-5 text-[#C49A5A]" />
            </div>
            <div className="font-display text-2xl font-bold text-white tracking-tight drop-shadow-md">
              {investments.length > 0 ? (investments.reduce((s, i) => s + i.roi_percentage, 0) / investments.length).toFixed(1) : 0}%
            </div>
          </div>
          <div className="flex items-end justify-between relative z-10 mt-auto">
            <div className="text-white/90 text-sm font-semibold tracking-wide drop-shadow-sm">Average ROI</div>
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
                {['Investor', 'Amount', 'Land', 'ROI', 'Status', 'Actions'].map((h, i) => (
                  <th key={i} className={`text-left px-7 py-4 font-bold text-[13px] tracking-wider uppercase text-[#C49A5A] whitespace-nowrap ${i === 5 ? 'text-right' : ''} ${i === 2 || i === 3 ? 'hidden md:table-cell' : ''}`} style={{ background: 'rgba(196,154,90,.08)', height: '64px' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C49A5A]/10">
              {investments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-[#A8B5AA] font-medium text-base">
                    No investments yet
                  </td>
                </tr>
              ) : (
                investments.map((inv) => (
                  <tr key={inv.id} className="group transition-all duration-300 hover:bg-[rgba(196,154,90,.05)]" style={{ height: '80px' }}>
                    <td className="px-7 py-4 transition-transform duration-300 group-hover:translate-x-[5px]">
                      <div className="text-[#F8F5EE] font-semibold text-[15px] mb-1">{investorName(inv.investor_id)}</div>
                      <div className="text-[#A8B5AA] text-[12px]">{inv.contract_number || '—'}</div>
                    </td>
                    <td className="px-7 py-4 transition-transform duration-300 group-hover:translate-x-[5px]">
                      <div className="text-[#C49A5A] font-bold text-[15px] mb-1">₹{inv.amount.toLocaleString('en-IN')}</div>
                      <div className="text-[#A8B5AA] text-[12px]">{inv.investment_date}</div>
                    </td>
                    <td className="px-7 py-4 text-[#A8B5AA] font-medium hidden md:table-cell transition-transform duration-300 group-hover:translate-x-[5px]">
                      {landTitle(inv.land_id)}
                    </td>
                    <td className="px-7 py-4 hidden md:table-cell transition-transform duration-300 group-hover:translate-x-[5px]">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wider bg-[#22C55E]/12 text-[#22C55E]">
                        <ArrowUpRight className="w-3 h-3" /> {inv.roi_percentage}%
                      </span>
                    </td>
                    <td className="px-7 py-4 transition-transform duration-300 group-hover:translate-x-[5px]">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[11px] uppercase tracking-wider ${
                        inv.status === 'ACTIVE' ? 'bg-[#22C55E]/12 text-[#22C55E]' :
                        inv.status === 'MATURED' ? 'bg-[#3B82F6]/12 text-[#3B82F6]' :
                        inv.status === 'PENDING' ? 'bg-[#EAB308]/12 text-[#EAB308]' :
                        'bg-white/10 text-white/60'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          inv.status === 'ACTIVE' ? 'bg-[#22C55E]' : 
                          inv.status === 'MATURED' ? 'bg-[#3B82F6]' : 
                          inv.status === 'PENDING' ? 'bg-[#EAB308]' : 
                          'bg-white/60'
                        }`} />
                        {inv.status?.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-7 py-4 transition-transform duration-300 group-hover:-translate-x-[5px] text-right">
                      <button onClick={() => {
                        setForm({ ...defaultForm, investor_id: inv.investor_id, land_id: inv.land_id || '', amount: String(inv.amount), roi_percentage: String(inv.roi_percentage), expected_returns: String(inv.expected_returns), status: inv.status, contract_number: inv.contract_number, investment_date: inv.investment_date });
                        setEditId(inv.id); setShowModal(true);
                      }} className="h-[36px] px-5 rounded-full font-bold text-[11px] uppercase tracking-wider border border-[#C49A5A] text-[#C49A5A] hover:bg-[#C49A5A] hover:text-[#08120D] hover:shadow-[0_0_15px_rgba(196,154,90,0.4)] transition-all duration-300 inline-flex items-center justify-center">
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
