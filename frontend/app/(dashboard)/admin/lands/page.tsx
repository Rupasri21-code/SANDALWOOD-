'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { Country, State, City } from 'country-state-city';

const allCountries = Country.getAllCountries();

const getStates = (countryName: string) => {
  const country = allCountries.find(c => c.name === countryName);
  return country ? State.getStatesOfCountry(country.isoCode) : [];
};

const getCities = (countryName: string, stateName: string) => {
  const country = allCountries.find(c => c.name === countryName);
  if (!country) return [];
  const state = State.getStatesOfCountry(country.isoCode).find(s => s.name === stateName);
  return state ? City.getCitiesOfState(country.isoCode, state.isoCode) : [];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

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
  latitude?: number;
  longitude?: number;
  created_at: string;
};

type Investor = { id: string; full_name: string };

const defaultForm = {
  title: '', description: '', location: '', district: '', state: '', country: 'India',
  survey_number: '', total_area: '', unit: 'acres', purchase_price: '',
  current_value: '', status: 'active', investor_id: '', latitude: '', longitude: ''
};

export default function LandsPage() {
  const [lands, setLands] = useState<Land[]>([]);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [landsRes, invRes] = await Promise.all([
        fetch(`${API_URL}/lands`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/investors`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [landsData, invData] = await Promise.all([landsRes.json(), invRes.json()]);
      
      setLands(landsData.success ? landsData.data : []);
      setInvestors(invData.success ? invData.data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = lands.filter(
    (l) => l.title.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setForm(defaultForm); setEditId(null); setShowModal(true); };
  const openEdit = (l: Land) => {
    setForm({ ...defaultForm, title: l.title, location: l.location, district: l.district, state: l.state, country: 'India', total_area: String(l.total_area), unit: l.unit, status: l.status, purchase_price: String(l.purchase_price), current_value: String(l.current_value), latitude: l.latitude ? String(l.latitude) : '', longitude: l.longitude ? String(l.longitude) : '', investor_id: '' });
    // Note: Investor ID needs an explicit fetch if it was returned in a different field, but we'll stick to the current implementation.
    setEditId(l.id);
    setShowModal(true);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    
    toast.info('Requesting location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }));
        toast.success('Location captured successfully');
      },
      (error) => {
        toast.error('Failed to get location. Please allow location permissions.');
        console.error(error);
      },
      { enableHighAccuracy: true }
    );
  };

  const copyCoordinates = () => {
    if (!form.latitude || !form.longitude) return;
    navigator.clipboard.writeText(`${form.latitude}, ${form.longitude}`);
    toast.success('Coordinates copied');
  };

  const handleSave = async () => {
    // Validations
    if (!form.title || form.title.trim().length < 3) {
      toast.error('Title is required and must be at least 3 characters');
      return;
    }
    if (!form.location || !form.location.trim()) {
      toast.error('Location is required');
      return;
    }
    if (!form.district || !form.district.trim()) {
      toast.error('District is required');
      return;
    }
    if (!form.state || !form.state.trim()) {
      toast.error('State is required');
      return;
    }
    
    const area = parseFloat(form.total_area);
    if (isNaN(area) || area <= 0) {
      toast.error('Total Area must be a number greater than 0');
      return;
    }
    
    const pPrice = parseFloat(form.purchase_price);
    if (form.purchase_price !== '' && (isNaN(pPrice) || pPrice < 0)) {
      toast.error('Purchase Price must be a valid positive number');
      return;
    }
    
    const cValue = parseFloat(form.current_value);
    if (form.current_value !== '' && (isNaN(cValue) || cValue < 0)) {
      toast.error('Current Value must be a valid positive number');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    
    let backendStatus = 'AVAILABLE';
    if (form.status === 'pending') backendStatus = 'RESERVED';
    if (form.status === 'sold') backendStatus = 'SOLD';
    if (form.status === 'inactive') backendStatus = 'MAINTENANCE';

    const payload = {
      title: form.title,
      description: form.description || 'N/A',
      location: form.location || 'N/A',
      district: form.district || 'N/A',
      state: form.state || 'N/A',
      surveyNumber: form.survey_number || 'N/A',
      totalArea: parseFloat(form.total_area) || 0,
      unit: form.unit || 'Acres',
      purchasePrice: parseFloat(form.purchase_price) || 0,
      currentValue: parseFloat(form.current_value) || 0,
      status: backendStatus,
      investorId: form.investor_id || undefined,
      latitude: form.latitude ? parseFloat(form.latitude) : undefined,
      longitude: form.longitude ? parseFloat(form.longitude) : undefined
    };
    
    try {
      if (editId) {
        const res = await fetch(`${API_URL}/lands/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Update failed');
        toast.success('Land updated');
      } else {
        const res = await fetch(`${API_URL}/lands`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Create failed');
        toast.success('Land added');
      }
      setShowModal(false);
      fetchData();
    } catch(err: any) {
      toast.error('Failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/lands/${confirmDeleteId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    toast.success('Deleted'); fetchData();
    setConfirmDeleteId(null);
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
                    land.status === 'AVAILABLE' ? 'bg-green-400/15 text-green-400' : 'bg-amber-400/15 text-amber-400'
                  }`}>
                    {land.status?.toLowerCase()}
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
                  <Button size="sm" variant="ghost" onClick={() => setConfirmDeleteId(land.id)} className="text-red-400/60 hover:bg-red-400/10 hover:text-red-400 text-xs">
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
                  <Label className="text-white/70 text-xs mb-1">Country</Label>
                  <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value, state: '', district: '' })}
                    className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e]">
                    <option value="" className="bg-[#141410]">Select Country</option>
                    {allCountries.map(c => <option key={c.isoCode} value={c.name} className="bg-[#141410]">{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-white/70 text-xs mb-1">State</Label>
                  <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value, district: '' })} disabled={!form.country}
                    className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e] disabled:opacity-50">
                    <option value="" className="bg-[#141410]">Select State</option>
                    {getStates(form.country).map(s => <option key={s.isoCode} value={s.name} className="bg-[#141410]">{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70 text-xs mb-1">District / City</Label>
                  <select value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} disabled={!form.state}
                    className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e] disabled:opacity-50">
                    <option value="" className="bg-[#141410]">Select City</option>
                    {getCities(form.country, form.state).map(c => <option key={c.name} value={c.name} className="bg-[#141410]">{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-white/70 text-xs mb-1">Location / Village</Label>
                  <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
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
                <Label className="text-white/70 text-xs mb-1">Assign to Investor</Label>
                <select value={form.investor_id} onChange={(e) => setForm({ ...form, investor_id: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e]">
                  <option value="" className="bg-[#141410]">— Unassigned —</option>
                  {investors.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#141410]">{c.full_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-white/70 text-xs mb-1">Description</Label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3} className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#c8851e]" />
              </div>
              
              {/* Google Maps Location Section */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold text-sm">Google Maps Location</h3>
                    <p className="text-white/50 text-[10px]">Stand at the center of the plot and click Use Current Location to pin the exact plot location.</p>
                  </div>
                  <Button type="button" onClick={handleUseCurrentLocation} size="sm" className="bg-[#c8851e]/10 text-[#c8851e] hover:bg-[#c8851e]/20 border border-[#c8851e]/30">
                    <MapPin className="w-3.5 h-3.5 mr-1" /> Use Current Location
                  </Button>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-white/70 text-xs mb-1">Latitude</Label>
                    <Input value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} placeholder="e.g. 15.9129"
                      className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                  </div>
                  <div>
                    <Label className="text-white/70 text-xs mb-1">Longitude</Label>
                    <Input value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} placeholder="e.g. 79.7400"
                      className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                  </div>
                </div>

                {form.latitude && form.longitude && (
                  <div className="rounded-xl overflow-hidden border border-white/10 relative h-[200px] w-full bg-white/5">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://maps.google.com/maps?q=${form.latitude},${form.longitude}&z=15&output=embed`}
                    ></iframe>
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button type="button" size="sm" onClick={copyCoordinates} className="bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm text-[10px] h-7">
                        Copy
                      </Button>
                      <Button type="button" size="sm" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${form.latitude},${form.longitude}`, '_blank')} className="bg-[#c8851e] hover:bg-[#a96618] text-white text-[10px] h-7">
                        Open Map
                      </Button>
                    </div>
                  </div>
                )}
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
      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Land Record"
        description="Are you sure you want to delete this land record? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
