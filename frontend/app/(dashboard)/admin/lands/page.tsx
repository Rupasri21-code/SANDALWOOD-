'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

type Land = {
  id: string;
  title: string;
  location: string;
  district: string;
  state: string;
  total_area: number;
  unit: string;
  status: string;
  purchase_price: number;
  current_value: number;
  created_at: string;
};

type Customer = { id: string; full_name: string };

const defaultForm = {
  title: '', description: '', location: '', district: '', state: '',
  survey_number: '', total_area: '', unit: 'acres', purchase_price: '',
  current_value: '', status: 'active', customer_id: '',
};

export default function LandsPage() {
  const [lands, setLands] = useState<Land[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const [l, c] = await Promise.all([
      supabase.from('lands').select('id, title, location, district, state, total_area, unit, status, purchase_price, current_value, created_at').order('created_at', { ascending: false }),
      supabase.from('customers').select('id, full_name'),
    ]);
    setLands(l.data ?? []);
    setCustomers(c.data ?? []);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = lands.filter(
    (l) => l.title.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setForm(defaultForm); setEditId(null); setShowModal(true); };
  const openEdit = (l: Land) => {
    setForm({ ...defaultForm, title: l.title, location: l.location, district: l.district, state: l.state, total_area: String(l.total_area), unit: l.unit, status: l.status, purchase_price: String(l.purchase_price), current_value: String(l.current_value) });
    setEditId(l.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title) { toast.error('Title is required'); return; }
    setLoading(true);
    const payload = { ...form, total_area: parseFloat(form.total_area) || 0, purchase_price: parseFloat(form.purchase_price) || 0, current_value: parseFloat(form.current_value) || 0 };
    const { error } = editId
      ? await supabase.from('lands').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editId)
      : await supabase.from('lands').insert(payload);
    setLoading(false);
    if (error) { toast.error('Failed: ' + error.message); return; }
    toast.success(editId ? 'Land updated' : 'Land added');
    setShowModal(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this land record?')) return;
    await supabase.from('lands').delete().eq('id', id);
    toast.success('Deleted'); fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-white">Land Management</h1>
          <p className="text-white/50 text-sm mt-1">{lands.length} registered parcels</p>
        </div>
        <Button onClick={openNew} className="bg-[#c8851e] hover:bg-[#a96618] text-white gap-2">
          <Plus className="w-4 h-4" /> Add Land
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <Input placeholder="Search lands..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#c8851e]" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-white/30 bg-white/3 border border-white/8 rounded-2xl">
            No land parcels found
          </div>
        ) : (
          filtered.map((land) => (
            <div key={land.id} className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden hover:border-[#c8851e]/30 transition-all group">
              <div className="h-32 bg-gradient-to-br from-[#1a4a1a]/60 to-[#3d2210]/60 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-[#c8851e]/50" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-medium text-sm">{land.title}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    land.status === 'active' ? 'bg-green-400/15 text-green-400' : 'bg-amber-400/15 text-amber-400'
                  }`}>
                    {land.status}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-white/50 text-xs mb-3">
                  <MapPin className="w-3 h-3" />
                  {[land.district, land.state].filter(Boolean).join(', ') || land.location || '—'}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-white/3 rounded-lg p-2">
                    <div className="text-white/40 text-[10px]">Area</div>
                    <div className="text-white text-xs font-medium">{land.total_area} {land.unit}</div>
                  </div>
                  <div className="bg-white/3 rounded-lg p-2">
                    <div className="text-white/40 text-[10px]">Value</div>
                    <div className="text-[#e9be55] text-xs font-medium">₹{(land.current_value / 100000).toFixed(1)}L</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(land)} className="flex-1 text-white/60 hover:bg-white/5 text-xs gap-1">
                    <Edit2 className="w-3 h-3" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(land.id)} className="text-red-400/60 hover:bg-red-400/10 hover:text-red-400 text-xs">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#141410] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="text-white font-semibold">{editId ? 'Edit Land' : 'Add New Land'}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-white/40" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <Label className="text-white/70 text-xs mb-1">Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70 text-xs mb-1">Location</Label>
                  <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                </div>
                <div>
                  <Label className="text-white/70 text-xs mb-1">District</Label>
                  <Input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70 text-xs mb-1">State</Label>
                  <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                </div>
                <div>
                  <Label className="text-white/70 text-xs mb-1">Survey Number</Label>
                  <Input value={form.survey_number} onChange={(e) => setForm({ ...form, survey_number: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-white/70 text-xs mb-1">Total Area</Label>
                  <Input type="number" value={form.total_area} onChange={(e) => setForm({ ...form, total_area: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                </div>
                <div>
                  <Label className="text-white/70 text-xs mb-1">Unit</Label>
                  <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e]">
                    <option value="acres" className="bg-[#141410]">Acres</option>
                    <option value="hectares" className="bg-[#141410]">Hectares</option>
                    <option value="sqft" className="bg-[#141410]">Sq.ft</option>
                  </select>
                </div>
                <div>
                  <Label className="text-white/70 text-xs mb-1">Status</Label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e]">
                    <option value="active" className="bg-[#141410]">Active</option>
                    <option value="pending" className="bg-[#141410]">Pending</option>
                    <option value="sold" className="bg-[#141410]">Sold</option>
                    <option value="inactive" className="bg-[#141410]">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70 text-xs mb-1">Purchase Price (₹)</Label>
                  <Input type="number" value={form.purchase_price} onChange={(e) => setForm({ ...form, purchase_price: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                </div>
                <div>
                  <Label className="text-white/70 text-xs mb-1">Current Value (₹)</Label>
                  <Input type="number" value={form.current_value} onChange={(e) => setForm({ ...form, current_value: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                </div>
              </div>
              <div>
                <Label className="text-white/70 text-xs mb-1">Assign to Customer</Label>
                <select value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e]">
                  <option value="" className="bg-[#141410]">— Unassigned —</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#141410]">{c.full_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-white/70 text-xs mb-1">Description</Label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3} className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#c8851e]" />
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
