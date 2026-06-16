'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Sprout, X } from 'lucide-react';


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ui/confirm-modal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

type Crop = {
  id: string;
  name: string;
  variety: string;
  land_id: string;
  growth_stage: string;
  health_status: string;
  total_plants: number;
  surviving_plants: number;
  planted_date: string;
  created_at: string;
};

type Land = { id: string; title: string };

const stageColors: Record<string, string> = {
  seedling: 'bg-yellow-400/15 text-yellow-400',
  sapling: 'bg-lime-400/15 text-lime-400',
  juvenile: 'bg-green-400/15 text-green-400',
  mature: 'bg-emerald-400/15 text-emerald-400',
  harvest_ready: 'bg-[#c8851e]/15 text-[#e9be55]',
};

const defaultForm = {
  name: 'Sandalwood', variety: '', land_id: '', planted_date: '',
  total_plants: '', surviving_plants: '', growth_stage: 'seedling',
  health_status: 'good', height_avg: '', notes: '',
};

export default function CropsPage() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [lands, setLands] = useState<Land[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const [updateForm, setUpdateForm] = useState({ title: '', description: '', update_type: 'general', update_date: new Date().toISOString().split('T')[0] });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [cropsRes, landsRes] = await Promise.all([
        fetch(`${API_URL}/crops`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/lands`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [cropsData, landsData] = await Promise.all([cropsRes.json(), landsRes.json()]);
      
      setCrops(cropsData.success ? cropsData.data : []);
      setLands(landsData.success ? landsData.data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = crops.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async () => {
    // Validations
    if (!form.land_id) {
      toast.error('Please select a land');
      return;
    }
    if (!form.variety || !form.variety.trim()) {
      toast.error('Variety is required');
      return;
    }
    
    if (!form.planted_date) {
      toast.error('Planted date is required');
      return;
    }
    
    const planted = new Date(form.planted_date);
    if (planted > new Date()) {
      toast.error('Planted date cannot be in the future');
      return;
    }

    const total = parseInt(form.total_plants);
    if (isNaN(total) || total <= 0) {
      toast.error('Total Plants must be a whole number greater than 0');
      return;
    }

    const surviving = parseInt(form.surviving_plants);
    if (form.surviving_plants !== '' && (isNaN(surviving) || surviving < 0)) {
      toast.error('Surviving Plants must be a valid positive number');
      return;
    }
    
    if (surviving > total) {
      toast.error('Surviving Plants cannot exceed Total Plants');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    
    const payload = {
      landId: form.land_id,
      name: form.name,
      variety: form.variety,
      plantedDate: form.planted_date ? form.planted_date : undefined,
      totalPlants: parseInt(form.total_plants) || 0,
      survivingPlants: parseInt(form.surviving_plants) || 0,
      growthStage: form.growth_stage.toUpperCase(),
      healthStatus: form.health_status.toUpperCase(),
      heightAvg: parseFloat(form.height_avg) || 0,
      notes: form.notes
    };
    
    try {
      if (editId) {
        const res = await fetch(`${API_URL}/crops/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Update failed');
        toast.success('Updated');
      } else {
        const res = await fetch(`${API_URL}/crops`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Create failed');
        toast.success('Created');
      }
      setShowModal(false);
      fetchData();
    } catch(err: any) {
      toast.error('Failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUpdate = async () => {
    if (!updateForm.title || !selectedCropId) return;
    const token = localStorage.getItem('token');
    const land_id = crops.find((c) => c.id === selectedCropId)?.land_id;
    
    try {
      const res = await fetch(`${API_URL}/updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          landId: land_id,
          cropId: selectedCropId,
          title: updateForm.title,
          description: updateForm.description,
          updateType: updateForm.update_type.toUpperCase(),
          updateDate: updateForm.update_date
        })
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Update added');
      setShowUpdateModal(false);
    } catch(err) {
      toast.error('Failed');
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/crops/${confirmDeleteId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    toast.success('Deleted'); fetchData();
    setConfirmDeleteId(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-[#F8F5EE] tracking-tight">Crop & Plantation</h1>
          <p className="text-[#A8B5AA] text-[15px] mt-1.5 font-medium">{crops.length} crop records</p>
        </div>
        <button 
          onClick={() => { setForm(defaultForm); setEditId(null); setShowModal(true); }} 
          whileHover={{ y: -3 }}
          className="h-[48px] px-6 rounded-[16px] text-white font-bold flex items-center gap-3 shadow-[0_10px_20px_rgba(196,154,90,0.2)] hover:shadow-[0_0_25px_rgba(196,154,90,0.5)] transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, #C49A5A, #D9B36D)' }}
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm">
            <Plus className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
          Add Crop
        </button>
      </div>

      <div className="relative max-w-md">
        <div className="h-[56px] bg-[#121F17]/80 backdrop-blur-md border border-[#C49A5A]/30 rounded-[18px] flex items-center px-4 shadow-sm focus-within:shadow-[0_0_15px_rgba(196,154,90,0.3)] focus-within:border-[#C49A5A] transition-all duration-300">
          <div className="w-8 h-8 rounded-full bg-[#08120D] border border-[#C49A5A]/30 flex items-center justify-center shrink-0">
             <Search className="w-4 h-4 text-[#C49A5A]" />
          </div>
          <input
            placeholder="Search crops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-[#F8F5EE] placeholder:text-[#A8B5AA] pl-4 font-medium"
          />
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
                {['Crop', 'Land', 'Stage', 'Plants', 'Health', 'Actions'].map((h, i) => (
                  <th key={i} className={`text-left px-7 py-4 font-bold text-[13px] tracking-wider uppercase text-[#C49A5A] whitespace-nowrap ${i === 5 ? 'text-right' : ''} ${i === 1 || i === 3 ? 'hidden md:table-cell' : ''}`} style={{ background: 'rgba(196,154,90,.08)', height: '64px' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C49A5A]/10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-[#A8B5AA] font-medium text-base">
                    No crops found
                  </td>
                </tr>
              ) : (
                filtered.map((crop) => (
                  <tr key={crop.id} className="group transition-all duration-300 hover:bg-[rgba(196,154,90,.05)]" style={{ height: '80px' }}>
                    <td className="px-7 py-4 transition-transform duration-300 group-hover:translate-x-[5px]">
                      <div className="flex items-center gap-4">
                        <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-[#121F17] to-[#0A1A12] border border-[#C49A5A]/50 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(196,154,90,0.2)]">
                          <Sprout className="w-5 h-5 text-[#22C55E]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[#F8F5EE] font-semibold text-[15px]">{crop.name}</span>
                          <span className="text-[#A8B5AA] text-[12px]">{crop.variety || '—'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-7 py-4 text-[#A8B5AA] font-medium hidden md:table-cell transition-transform duration-300 group-hover:translate-x-[5px]">
                      {lands.find((l) => l.id === crop.land_id)?.title || '—'}
                    </td>
                    <td className="px-7 py-4 transition-transform duration-300 group-hover:translate-x-[5px]">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[11px] uppercase tracking-wider ${
                        crop.growth_stage?.toLowerCase() === 'sapling' ? 'bg-[#22C55E]/12 text-[#22C55E]' :
                        crop.growth_stage?.toLowerCase() === 'juvenile' ? 'bg-[#EAB308]/12 text-[#EAB308]' :
                        crop.growth_stage?.toLowerCase() === 'mature' ? 'bg-[#3B82F6]/12 text-[#3B82F6]' :
                        'bg-white/10 text-white/60'
                      }`}>
                        {crop.growth_stage?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-7 py-4 text-[#A8B5AA] font-medium hidden md:table-cell transition-transform duration-300 group-hover:translate-x-[5px]">
                      <span className="text-[#F8F5EE] font-bold">{crop.surviving_plants}</span> / {crop.total_plants}
                    </td>
                    <td className="px-7 py-4 transition-transform duration-300 group-hover:translate-x-[5px]">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wider ${
                        crop.health_status === 'EXCELLENT' || crop.health_status === 'GOOD' ? 'text-[#22C55E]' :
                        crop.health_status === 'FAIR' ? 'text-[#EAB308]' :
                        'text-[#EF4444]'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          crop.health_status === 'EXCELLENT' || crop.health_status === 'GOOD' ? 'bg-[#22C55E]' :
                          crop.health_status === 'FAIR' ? 'bg-[#EAB308]' :
                          'bg-[#EF4444]'
                        }`} />
                        {crop.health_status?.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-7 py-4 transition-transform duration-300 group-hover:-translate-x-[5px]">
                      <div className="flex items-center gap-3 justify-end">
                        <button onClick={() => { setSelectedCropId(crop.id); setUpdateForm({ ...updateForm }); setShowUpdateModal(true); }}
                          className="h-[36px] px-4 rounded-full font-bold text-[11px] uppercase tracking-wider text-[#08120D] shadow-[0_4px_10px_rgba(196,154,90,0.2)] hover:shadow-[0_0_15px_rgba(196,154,90,0.4)] transition-all duration-300"
                          style={{ background: 'linear-gradient(135deg, #C49A5A, #D9B36D)' }}>
                          + Update
                        </button>
                        <button onClick={() => {
                          setForm({ name: crop.name, variety: crop.variety || '', land_id: crop.land_id, planted_date: crop.planted_date || '', total_plants: String(crop.total_plants), surviving_plants: String(crop.surviving_plants), growth_stage: crop.growth_stage, health_status: crop.health_status, height_avg: '', notes: '' });
                          setEditId(crop.id); setShowModal(true);
                        }} className="w-[40px] h-[40px] rounded-full bg-[#121F17] border border-[#C49A5A]/20 flex items-center justify-center text-[#A8B5AA] hover:text-[#C49A5A] hover:border-[#C49A5A] hover:shadow-[0_0_15px_rgba(196,154,90,0.3)] transition-all duration-300" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setConfirmDeleteId(crop.id)} className="w-[40px] h-[40px] rounded-full bg-[#121F17] border border-[#C49A5A]/20 flex items-center justify-center text-[#A8B5AA] hover:text-red-500 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all duration-300" title="Delete">
                          <Trash2 className="w-4 h-4" />
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

      {/* Crop Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#141410] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="text-white font-semibold">{editId ? 'Edit Crop' : 'Add Crop'}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-white/40" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70 text-xs mb-1">Crop Name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                </div>
                <div>
                  <Label className="text-white/70 text-xs mb-1">Variety</Label>
                  <Input value={form.variety} onChange={(e) => setForm({ ...form, variety: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                </div>
              </div>
              <div>
                <Label className="text-white/70 text-xs mb-1">Assign to Land *</Label>
                <select value={form.land_id} onChange={(e) => setForm({ ...form, land_id: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e]">
                  <option value="" className="bg-[#141410]">Select land</option>
                  {lands.map((l) => <option key={l.id} value={l.id} className="bg-[#141410]">{l.title}</option>)}
                </select>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70 text-xs mb-1">Total Plants</Label>
                  <Input type="number" value={form.total_plants} onChange={(e) => setForm({ ...form, total_plants: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                </div>
                <div>
                  <Label className="text-white/70 text-xs mb-1">Surviving Plants</Label>
                  <Input type="number" value={form.surviving_plants} onChange={(e) => setForm({ ...form, surviving_plants: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70 text-xs mb-1">Growth Stage</Label>
                  <select value={form.growth_stage} onChange={(e) => setForm({ ...form, growth_stage: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e]">
                    {['seedling','sapling','juvenile','mature','harvest_ready'].map((s) => <option key={s} value={s} className="bg-[#141410]">{s.replace('_',' ')}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-white/70 text-xs mb-1">Health Status</Label>
                  <select value={form.health_status} onChange={(e) => setForm({ ...form, health_status: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e]">
                    {['excellent','good','fair','poor'].map((s) => <option key={s} value={s} className="bg-[#141410]">{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70 text-xs mb-1">Planted Date</Label>
                  <Input type="date" value={form.planted_date} onChange={(e) => setForm({ ...form, planted_date: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                </div>
                <div>
                  <Label className="text-white/70 text-xs mb-1">Avg. Height (cm)</Label>
                  <Input type="number" value={form.height_avg} onChange={(e) => setForm({ ...form, height_avg: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                </div>
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

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#141410] border border-white/10 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="text-white font-semibold">Add Plantation Update</h2>
              <button onClick={() => setShowUpdateModal(false)}><X className="w-5 h-5 text-white/40" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <Label className="text-white/70 text-xs mb-1">Update Type</Label>
                <select value={updateForm.update_type} onChange={(e) => setUpdateForm({ ...updateForm, update_type: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e]">
                  {['general','maintenance','growth','pest_control','fertilization','irrigation','harvest'].map((t) => <option key={t} value={t} className="bg-[#141410]">{t.replace('_',' ')}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-white/70 text-xs mb-1">Title *</Label>
                <Input value={updateForm.title} onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
                  className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
              </div>
              <div>
                <Label className="text-white/70 text-xs mb-1">Description</Label>
                <textarea value={updateForm.description} onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
                  rows={3} className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#c8851e]" />
              </div>
              <div>
                <Label className="text-white/70 text-xs mb-1">Date</Label>
                <Input type="date" value={updateForm.update_date} onChange={(e) => setUpdateForm({ ...updateForm, update_date: e.target.value })}
                  className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-white/10">
              <Button variant="ghost" onClick={() => setShowUpdateModal(false)} className="flex-1 text-white/60 hover:bg-white/5">Cancel</Button>
              <Button onClick={handleAddUpdate} className="flex-1 bg-[#c8851e] hover:bg-[#a96618] text-white">Add Update</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Crop"
        description="Are you sure you want to delete this crop record? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
