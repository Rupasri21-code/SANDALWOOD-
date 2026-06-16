'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, UserCheck, Eye, X, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { InvestorWizard } from '@/components/admin/investors/investor-wizard';
import { ConfirmModal } from '@/components/ui/confirm-modal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-[#F8F5EE] tracking-tight">Investors</h1>
          <p className="text-[#A8B5AA] text-[15px] mt-1.5 font-medium">{investors.length} Total Investors</p>
        </div>
        <motion.button 
          onClick={openNew} 
          whileHover={{ y: -3 }}
          className="h-[50px] px-6 rounded-[16px] text-white font-bold flex items-center gap-3 shadow-[0_10px_20px_rgba(196,154,90,0.2)] hover:shadow-[0_0_25px_rgba(196,154,90,0.5)] transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, #C49A5A, #D9B36D)' }}
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm">
            <Plus className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
          Add Investor
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <div className="h-[56px] bg-[#121F17]/80 backdrop-blur-md border border-[#C49A5A]/30 rounded-[18px] flex items-center px-4 shadow-sm focus-within:shadow-[0_0_15px_rgba(196,154,90,0.3)] focus-within:border-[#C49A5A] transition-all duration-300">
          <div className="w-8 h-8 rounded-full bg-[#08120D] border border-[#C49A5A]/30 flex items-center justify-center shrink-0">
             <Search className="w-4 h-4 text-[#C49A5A]" />
          </div>
          <input
            placeholder="Search investors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-[#F8F5EE] placeholder:text-[#A8B5AA] pl-4 font-medium"
          />
        </div>
      </div>

      {/* Table Container */}
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
                {['Name', 'Email', 'Location', 'Status', 'Actions'].map((h, i) => (
                  <th key={i} className={`text-left px-7 py-4 font-bold text-[13px] tracking-wider uppercase text-[#C49A5A] whitespace-nowrap ${i === 4 ? 'text-right' : ''} ${i === 1 || i === 2 ? 'hidden md:table-cell' : ''}`} style={{ background: 'rgba(196,154,90,.08)', height: '64px' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C49A5A]/10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-[#A8B5AA] font-medium text-base">
                    No investors found
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="group transition-all duration-300 hover:bg-[rgba(196,154,90,.05)]" style={{ height: '80px' }}>
                    <td className="px-7 py-4 transition-transform duration-300 group-hover:translate-x-[6px]">
                      <div className="flex items-center gap-4">
                        <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-[#121F17] to-[#0A1A12] border border-[#C49A5A] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(196,154,90,0.2)]">
                          <span className="text-[#C49A5A] text-sm font-bold uppercase">{c.full_name?.[0]}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[#F8F5EE] font-semibold text-[15px]">{c.full_name}</span>
                          <span className="text-[#A8B5AA] text-[12px] md:hidden">{c.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-7 py-4 text-[#A8B5AA] font-medium hidden md:table-cell transition-transform duration-300 group-hover:translate-x-[6px]">{c.email}</td>
                    <td className="px-7 py-4 text-[#A8B5AA] font-medium hidden md:table-cell transition-transform duration-300 group-hover:translate-x-[6px]">
                      <div className="flex items-center gap-2">
                         <MapPin className="w-4 h-4 text-[#A8B5AA]" />
                         {[c.city, c.state].filter(Boolean).join(', ') || '—'}
                      </div>
                    </td>
                    <td className="px-7 py-4 transition-transform duration-300 group-hover:translate-x-[6px]">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[11px] uppercase tracking-wider ${
                        c.status === 'active' ? 'bg-[#22C55E]/12 text-[#22C55E]' :
                        c.status === 'pending' ? 'bg-[#EAB308]/12 text-[#EAB308]' :
                        'bg-red-500/12 text-red-500'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${c.status === 'active' ? 'bg-[#22C55E]' : c.status === 'pending' ? 'bg-[#EAB308]' : 'bg-red-500'}`} />
                        {c.status}
                      </span>
                    </td>
                    <td className="px-7 py-4 transition-transform duration-300 group-hover:-translate-x-[6px]">
                      <div className="flex items-center gap-3 justify-end">
                        <button onClick={() => openView(c)} className="w-[40px] h-[40px] rounded-full bg-[#121F17] border border-[#C49A5A]/20 flex items-center justify-center text-[#A8B5AA] hover:text-[#3B82F6] hover:border-[#3B82F6] hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEdit(c)} className="w-[40px] h-[40px] rounded-full bg-[#121F17] border border-[#C49A5A]/20 flex items-center justify-center text-[#A8B5AA] hover:text-[#C49A5A] hover:border-[#C49A5A] hover:shadow-[0_0_15px_rgba(196,154,90,0.3)] transition-all duration-300" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setConfirmDeleteId(c.id)} className="w-[40px] h-[40px] rounded-full bg-[#121F17] border border-[#C49A5A]/20 flex items-center justify-center text-[#A8B5AA] hover:text-red-500 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all duration-300" title="Delete">
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
    </motion.div>
  );
}
