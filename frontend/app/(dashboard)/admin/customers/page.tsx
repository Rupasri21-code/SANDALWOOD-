'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, UserCheck, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

type Customer = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
};

type CustomerForm = {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  status: string;
  notes: string;
};

const defaultForm: CustomerForm = {
  full_name: '', email: '', phone: '', address: '',
  city: '', state: '', country: 'India', status: 'active', notes: '',
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<CustomerForm>(defaultForm);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    const { data } = await supabase
      .from('customers')
      .select('id, full_name, email, phone, city, state, status, created_at')
      .order('created_at', { ascending: false });
    setCustomers(data ?? []);
  };

  useEffect(() => { fetchCustomers(); }, []);

  const filtered = customers.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setForm(defaultForm); setEditId(null); setShowModal(true); };
  const openEdit = (c: Customer) => {
    setForm({ ...defaultForm, full_name: c.full_name, email: c.email, phone: c.phone, city: c.city, state: c.state, status: c.status });
    setEditId(c.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.full_name || !form.email) { toast.error('Name and email required'); return; }
    setLoading(true);
    if (editId) {
      const { error } = await supabase.from('customers').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editId);
      if (error) { toast.error('Update failed'); } else { toast.success('Customer updated'); }
    } else {
      const { error } = await supabase.from('customers').insert({ ...form });
      if (error) { toast.error('Create failed: ' + error.message); } else { toast.success('Customer created'); }
    }
    setLoading(false);
    setShowModal(false);
    fetchCustomers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this customer? This action cannot be undone.')) return;
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) { toast.error('Delete failed'); } else { toast.success('Customer deleted'); fetchCustomers(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-white">Customers</h1>
          <p className="text-white/50 text-sm mt-1">{customers.length} total customers</p>
        </div>
        <Button onClick={openNew} className="bg-[#c8851e] hover:bg-[#a96618] text-white gap-2">
          <Plus className="w-4 h-4" /> Add Customer
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#c8851e]"
        />
      </div>

      {/* Table */}
      <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/2">
                <th className="text-left px-5 py-3 text-white/50 font-medium">Name</th>
                <th className="text-left px-5 py-3 text-white/50 font-medium">Email</th>
                <th className="text-left px-5 py-3 text-white/50 font-medium hidden md:table-cell">Location</th>
                <th className="text-left px-5 py-3 text-white/50 font-medium">Status</th>
                <th className="text-right px-5 py-3 text-white/50 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-white/30">
                    No customers found
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#c8851e]/20 border border-[#c8851e]/30 flex items-center justify-center shrink-0">
                          <span className="text-[#e9be55] text-xs font-semibold">{c.full_name?.[0]}</span>
                        </div>
                        <span className="text-white font-medium">{c.full_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-white/60">{c.email}</td>
                    <td className="px-5 py-3 text-white/60 hidden md:table-cell">{[c.city, c.state].filter(Boolean).join(', ') || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        c.status === 'active' ? 'bg-green-400/15 text-green-400' :
                        c.status === 'pending' ? 'bg-amber-400/15 text-amber-400' :
                        'bg-red-400/15 text-red-400'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openEdit(c)} className="text-white/40 hover:text-[#e9be55] transition-colors p-1">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="text-white/40 hover:text-red-400 transition-colors p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#141410] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="text-white font-semibold">{editId ? 'Edit Customer' : 'Add New Customer'}</h2>
              <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70 text-xs mb-1">Full Name *</Label>
                  <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#c8851e]" />
                </div>
                <div>
                  <Label className="text-white/70 text-xs mb-1">Email *</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#c8851e]" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70 text-xs mb-1">Phone</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#c8851e]" />
                </div>
                <div>
                  <Label className="text-white/70 text-xs mb-1">Status</Label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e]">
                    <option value="active" className="bg-[#141410]">Active</option>
                    <option value="pending" className="bg-[#141410]">Pending</option>
                    <option value="inactive" className="bg-[#141410]">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <Label className="text-white/70 text-xs mb-1">Address</Label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#c8851e]" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70 text-xs mb-1">City</Label>
                  <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#c8851e]" />
                </div>
                <div>
                  <Label className="text-white/70 text-xs mb-1">State</Label>
                  <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#c8851e]" />
                </div>
              </div>
              <div>
                <Label className="text-white/70 text-xs mb-1">Notes</Label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3} className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#c8851e] placeholder:text-white/30" />
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-white/10">
              <Button variant="ghost" onClick={() => setShowModal(false)} className="flex-1 text-white/60 hover:bg-white/5">
                Cancel
              </Button>
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
