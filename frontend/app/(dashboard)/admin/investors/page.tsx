'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, UserCheck, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { InvestorWizard } from '@/components/admin/investors/investor-wizard';
import { ConfirmModal } from '@/components/ui/confirm-modal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

type Investor = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
};

type InvestorForm = {
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

const defaultForm: InvestorForm = {
  full_name: '', email: '', phone: '', address: '',
  city: '', state: '', country: 'India', status: 'active', notes: '',
};

const mapBackendToForm = (c: any) => {
  return {
    firstName: c.first_name || c.full_name?.split(' ')[0] || '',
    middleName: c.middle_name || '',
    lastName: c.last_name || c.full_name?.split(' ').slice(1).join(' ') || '',
    fullName: c.full_name || '',
    gender: c.gender || '',
    dob: c.dob ? new Date(c.dob).toISOString().split('T')[0] : '',
    age: c.age || '',
    profilePhotoUrl: c.profile_photo_url || '',
    investorType: c.investor_type || 'Individual',
    maritalStatus: c.marital_status || '',
    fatherName: c.father_name || '',
    spouseName: c.spouse_name || '',

    email: c.email || '',
    altEmail: c.alt_email || '',
    phone: c.phone || '',
    altPhone: c.alt_phone || '',
    whatsappNumber: c.whatsapp_number || '',
    prefCommunication: c.pref_communication || 'Phone',
    bestTimeToContact: c.best_time_to_contact || 'Anytime',

    permanentAddressLine1: c.address_line1 || '',
    permanentAddressLine2: c.address_line2 || '',
    permanentLandmark: c.landmark || '',
    permanentVillage: c.village || '',
    permanentDistrict: c.district || '',
    permanentState: c.state || '',
    permanentCountry: c.country || 'India',
    permanentPincode: c.pincode || '',
    sameAsPermanent: c.same_as_permanent ?? true,

    currentAddressLine1: c.current_address_line1 || '',
    currentVillage: c.current_village || '',
    currentDistrict: c.current_district || '',
    currentState: c.current_state || '',
    currentCountry: c.current_country || 'India',
    currentPincode: c.current_pincode || '',

    occupation: c.occupation || '',
    jobTitle: c.job_title || '',
    companyName: c.company_name || '',
    companyType: c.company_type || '',
    industry: c.industry || '',
    workExperience: c.work_experience || '',
    monthlyIncome: c.monthly_income || '',
    annualIncome: c.annual_income || '',
    panNumber: c.pan_number || '',
    aadhaarNumber: c.id_number || '',
    gstNumber: c.gst_number || '',
    companyAddress: c.company_address || '',

    investmentInterest: c.investment_interest || '',
    budgetRange: c.budget_range || '',
    investmentPurpose: c.investment_purpose || '',
    investmentSource: c.investment_source || '',
    holdingPeriod: c.holding_period || '',
    riskPreference: c.risk_preference || '',
    expectedReturnNotes: c.expected_return_notes || '',
    leadSource: c.lead_source || '',
    assignedAdvisor: c.assigned_advisor || '',

    nomineeName: c.nominee_name || '',
    nomineeRelation: c.nominee_relation || '',
    nomineePhone: c.nominee_phone || '',
    nomineeEmail: c.nominee_email || '',
    nomineeAadhaar: c.nominee_aadhaar || '',
    nomineeAddress: c.nominee_address || '',
    nomineeDocumentUrl: c.nominee_id_url || '',

    passbookPhotoUrl: c.passbook_photo_url || '',
    landDocumentUrl: c.land_document_url || '',
    paymentProofUrl: c.payment_proof_url || '',
    aadhaarUrl: c.aadhaar_url || '',
    panUrl: c.pan_url || '',
    agreementUrl: c.agreement_url || '',
    passbookVerificationStatus: c.passbook_verification_status || 'Pending',

    plotConfiguration: c.landPlots?.[0]?.plot_configuration || '',
    plotSize: c.landPlots?.[0]?.total_area?.toString() || '',
    passbookNumber: c.landPlots?.[0]?.passbook_number || '',
    plotPhotosUrls: c.landPlots?.[0]?.plot_photos ? c.landPlots[0].plot_photos.split(',') : [],
    
    totalInvestment: c.payments?.[0]?.total_investment || '',
    paidAmount: c.payments?.[0]?.paid_amount || '',
    paymentStatus: c.payments?.[0]?.payment_status || '',

    sendWelcomeEmail: c.send_welcome_email ?? true,
    sendWhatsapp: c.send_whatsapp ?? true,
    sendSms: c.send_sms ?? true,
    monthlyUpdates: c.monthly_updates ?? true,
    paymentReminders: c.payment_reminders ?? true,
    documentUpdates: c.document_updates ?? true,

    status: c.status || 'PENDING',
    notes: c.notes || '',

    // Pass the raw nested arrays for the Summary view
    landPlots: c.landPlots || [],
    investments: c.investments || [],
    payments: c.payments || [],
    media: c.media || []
  };
};

export default function InvestorsPage() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchInvestors = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/investors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInvestors(data.data ?? []);
      }
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchInvestors(); }, []);

  const filtered = investors.filter(
    (c) =>
      c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setForm(null); setEditId(null); setIsViewMode(false); setShowModal(true); };
  const openEdit = (c: any) => {
    setForm(mapBackendToForm(c));
    setEditId(c.id);
    setIsViewMode(false);
    setShowModal(true);
  };
  
  const openView = async (c: any) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/investors/${c.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setForm(mapBackendToForm(data.data));
      } else {
        setForm(mapBackendToForm(c));
      }
    } catch (e) {
      console.error(e);
      setForm(mapBackendToForm(c));
    }
    setEditId(c.id);
    setIsViewMode(true);
    setShowModal(true);
  };

  const handleSave = async (wizardData: any) => {
    if (!wizardData.firstName || !wizardData.email) { toast.error('First Name and Email are required'); return; }
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      // Create a combined full name if we have first and last
      const combinedName = wizardData.lastName ? `${wizardData.firstName} ${wizardData.lastName}` : wizardData.firstName;
      
      const payload = {
        ...wizardData,
        lastName: wizardData.lastName || 'Unknown', // Required by validator
        phone: wizardData.phone || '0000000000',    // Required min 10 digits
        fullName: combinedName || wizardData.full_name || 'New Investor',
        // Map wizard fields to what backend expects
        country: wizardData.permanentCountry || 'India',
        state: wizardData.permanentState || '',
        district: wizardData.permanentDistrict || '',
        village: wizardData.permanentVillage || '',
        addressLine1: wizardData.permanentAddressLine1 || '',
        addressLine2: wizardData.permanentAddressLine2 || '',
        landmark: wizardData.permanentLandmark || '',
        pincode: wizardData.permanentPincode || '',
        idType: 'Aadhar', // Default placeholder required by backend if not provided
        idNumber: 'PENDING'
      };

      // Upload files to Cloudinary via backend /upload endpoint
      const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!res.ok) throw new Error('File upload failed');
        const data = await res.json();
        return data.data.url; // Cloudinary URL
      };

      // Find all file fields in wizardData and upload them
      for (const [key, value] of Object.entries(wizardData)) {
        if (value instanceof File) {
          toast(`Uploading ${key}...`);
          try {
            const url = await uploadFile(value);
            let baseKey = key;
            if (baseKey.endsWith('File')) {
              baseKey = baseKey.slice(0, -4); // Remove 'File' from the end
            }
            payload[`${baseKey}Url`] = url;
            payload[baseKey] = url;
          } catch (err) {
            console.error(`Failed to upload ${key}`, err);
            toast.error(`Failed to upload ${key}`);
          }
        } else if (Array.isArray(value) && value[0] instanceof File) {
           // For plotPhotos which is an array of files
           toast(`Uploading ${key}...`);
           try {
             const urls = await Promise.all(value.map(f => uploadFile(f)));
             let baseKey = key;
             if (baseKey.endsWith('Files')) {
               baseKey = baseKey.slice(0, -5); // Remove 'Files' from the end
             }
             payload[`${baseKey}Urls`] = urls;
             payload[baseKey] = urls.join(',');
           } catch (err) {
             console.error(`Failed to upload ${key}`, err);
           }
        }
      }
      
      // Fix specific document URLs if they are still blob: (meaning no new file was selected during edit, but old file was lost)
      // Actually, if editing, we shouldn't send blob urls.
      for (const key of Object.keys(payload)) {
        if (typeof payload[key] === 'string' && payload[key].startsWith('blob:')) {
          delete payload[key]; // Don't send invalid blob URLs to backend
        }
      }      
      if (editId) {
        const res = await fetch(`${API_URL}/investors/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Update failed');
        toast.success('Investor updated successfully');
      } else {
        const res = await fetch(`${API_URL}/investors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) {
          console.error("Backend Error Response:", data);
          let errorMsg = data.message || 'Create failed';
          if (data.errors && data.errors.length > 0) {
            errorMsg += ': ' + data.errors.map((e: any) => `${e.field} (${e.message})`).join(', ');
          }
          throw new Error(errorMsg);
        }
        toast.success('Investor created successfully');

        if (data.data?.id) {
           await fetch(`${API_URL}/investors/${data.data.id}/credentials`, {
             method: 'POST',
             headers: { Authorization: `Bearer ${token}` }
           });
           toast.success('WhatsApp credentials sent!');
        }
      }
      setShowModal(false);
      fetchInvestors();
    } catch (err: any) {
      console.error("handleSave Exception:", err);
      toast.error(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/investors/${confirmDeleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Investor deleted'); 
      fetchInvestors();
    } catch(e) {
      toast.error('Delete failed');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-white">Investors</h1>
          <p className="text-white/50 text-sm mt-1">{investors.length} total investors</p>
        </div>
        <Button onClick={openNew} className="bg-[#c8851e] hover:bg-[#a96618] text-white gap-2">
          <Plus className="w-4 h-4" /> Add Investor
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <Input
          placeholder="Search investors..."
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
                    No investors found
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
                        <button onClick={() => openView(c)} className="text-white/40 hover:text-white transition-colors p-1" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => openEdit(c)} className="text-white/40 hover:text-[#e9be55] transition-colors p-1" title="Edit">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setConfirmDeleteId(c.id)} className="text-white/40 hover:text-red-400 transition-colors p-1" title="Delete">
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
      <InvestorWizard
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        initialData={form}
        loading={loading}
        isViewMode={isViewMode}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Investor"
        description="Are you sure you want to delete this investor? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
