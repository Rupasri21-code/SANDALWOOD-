'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Phone, MapPin, Briefcase, TrendingUp, 
  Map, CreditCard, FileText, Users, Bell, 
  ArrowLeft, Save, X, Upload, Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const INDIA_STATES_CITIES: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"]
};

export default function AddInvestorPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Section 1: Basic
    firstName: '', middleName: '', lastName: '', gender: '', dob: '', age: '', investorType: 'Individual',
    maritalStatus: '', fatherName: '', spouseName: '',
    profilePhotoPreview: '',
    // Section 2: Contact
    phone: '', altPhone: '', whatsappNumber: '', email: '', altEmail: '', prefCommunication: 'Phone', bestTimeToContact: 'Anytime',
    // Section 3: Address
    currentCountry: 'India', currentState: '', currentDistrict: '', currentAddressLine1: '', currentVillage: '', currentPincode: '',
    permanentCountry: 'India', permanentState: '', permanentDistrict: '', permanentAddressLine1: '', permanentVillage: '', permanentPincode: '',
    sameAsPermanent: false,
    // Section 4: Professional
    occupation: '', jobTitle: '', companyName: '', companyType: '', industry: '', workExperience: '', monthlyIncome: '', annualIncome: '', panNumber: '', gstNumber: '', companyAddress: '',
    // Section 5: Investment
    investmentInterest: '', budgetRange: '', investmentPurpose: '', investmentSource: '', holdingPeriod: '', riskPreference: '', expectedReturnNotes: '', leadSource: '', assignedAdvisor: '',
    // Section 6: Plot
    plotId: '', plotNumber: '', passbookNumber: '', plotSize: '', plotConfiguration: '', areaInAcres: '', locationBlock: '', landType: '', soilType: '', plantationStage: '', numberOfTrees: '', expectedHarvestYear: '', plotStatus: 'Available', gpsLocation: '', plotNotes: '',
    plotPhotosPreviews: [] as string[],
    // Section 7: Payment
    totalInvestmentAmount: '', bookingAmount: '', paidAmount: '', pendingAmount: '', paymentMode: '', paymentStatus: 'Pending', transactionId: '', paymentDate: '', emiRequired: false, emiPlan: '', nextDueDate: '',
    paymentProofPreview: '',
    // Section 8: Document
    aadhaarNumber: '', documentVerificationStatus: 'Pending', verificationNotes: '',
    passbookPhotoPreview: '', landDocumentPreview: '',
    // Section 9: Nominee
    nomineeName: '', nomineeRelation: '', nomineePhone: '', nomineeEmail: '', nomineeAadhaar: '', nomineeAddress: '',
    // Section 10: Communication
    sendWelcomeEmail: true, sendWhatsapp: true, sendSms: true, monthlyUpdates: true, paymentReminders: true, documentUpdates: true,
    // Section 11: Admin Notes
    followUpDate: '', followUpStatus: 'Pending', priority: 'Medium', assignedEmployee: '', notes: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, isMultiple = false) => {
    if (e.target.files && e.target.files.length > 0) {
      if (isMultiple) {
        const files = Array.from(e.target.files).slice(0, 4); // Max 4
        const urls = files.map(file => URL.createObjectURL(file));
        setFormData(prev => ({ ...prev, [fieldName]: urls }));
      } else {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, [fieldName]: URL.createObjectURL(file) }));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false;
    
    setFormData(prev => {
      const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
      
      // Auto-fill permanent address if sameAsPermanent is true
      if (name === 'sameAsPermanent' && checked) {
        next.permanentAddressLine1 = next.currentAddressLine1;
        next.permanentVillage = next.currentVillage;
        next.permanentDistrict = next.currentDistrict;
        next.permanentState = next.currentState;
        next.permanentCountry = next.currentCountry;
        next.permanentPincode = next.currentPincode;
      } else if (name.startsWith('current') && next.sameAsPermanent) {
        next.permanentAddressLine1 = next.currentAddressLine1;
        next.permanentVillage = next.currentVillage;
        next.permanentDistrict = next.currentDistrict;
        next.permanentState = next.currentState;
        next.permanentCountry = next.currentCountry;
        next.permanentPincode = next.currentPincode;
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const txId = formData.transactionId?.trim();
    if (txId) {
      if (txId.length < 8) {
        setError('Transaction ID must be at least 8 characters long');
        window.scrollTo(0, 0);
        return;
      }
      if (!/^[a-zA-Z0-9-_]+$/.test(txId)) {
        setError('Transaction ID can only contain letters, numbers, hyphens, and underscores');
        window.scrollTo(0, 0);
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const fullName = [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ');

      const payload = {
        ...formData,
        fullName,
        age: formData.age ? parseInt(formData.age) : undefined,
        status: 'PENDING',
        // Map address fields to backend model
        addressLine1: formData.permanentAddressLine1,
        village: formData.permanentVillage,
        district: formData.permanentDistrict,
        state: formData.permanentState,
        country: formData.permanentCountry,
        pincode: formData.permanentPincode,
        
        currentAddressLine1: formData.currentAddressLine1,
        currentVillage: formData.currentVillage,
        currentDistrict: formData.currentDistrict,
        currentState: formData.currentState,
        currentCountry: formData.currentCountry,
        currentPincode: formData.currentPincode,
        
        profilePhotoUrl: formData.profilePhotoPreview,
        passbookPhotoUrl: formData.passbookPhotoPreview,
        landDocumentUrl: formData.landDocumentPreview,
        paymentProofUrl: formData.paymentProofPreview,
        plotPhotos: formData.plotPhotosPreviews.join(','),
      };

      const res = await fetch("http://localhost:5001/api/v1/investors", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add investor');
      }

      router.push('/admin/investors?success=true');
    } catch (err: any) {
      setError(err.message);
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => router.back()}
            className="flex items-center text-[#8B5E3C] hover:text-[#12372A] mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Investors
          </button>
          <h1 className="text-3xl font-bold text-[#12372A]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Add New Investor
          </h1>
          <p className="text-gray-600 mt-1">Complete the professional profile for the new investor lead.</p>
        </div>
        <div className="flex gap-3">
          <button 
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-[#12372A] text-[#12372A] rounded-md hover:bg-gray-50 transition-colors flex items-center"
          >
            <X className="w-4 h-4 mr-2" /> Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#12372A] text-white rounded-md hover:bg-[#0B2F24] transition-colors flex items-center disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" /> 
            {isSubmitting ? 'Saving...' : 'Save Investor'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Profile Picture Section */}
        <section className="bg-[#F7F0E4] rounded-xl border border-[#C49A5A]/30 overflow-hidden shadow-sm p-6 flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-[#C49A5A] flex items-center justify-center bg-white overflow-hidden mb-4 group cursor-pointer" onClick={() => document.getElementById('profilePhotoUpload')?.click()}>
              {formData.profilePhotoPreview ? (
                <img src={formData.profilePhotoPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-[#C49A5A]/50" />
              )}
              <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <input id="profilePhotoUpload" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'profilePhotoPreview')} />
            </div>
            <h3 className="text-lg font-semibold text-[#12372A]">Profile Picture</h3>
            <p className="text-sm text-gray-500">Click the image area to upload a professional photo</p>
        </section>

        {/* Section 1: Basic Details */}
        <section className="bg-[#F7F0E4] rounded-xl border border-[#C49A5A]/30 overflow-hidden shadow-sm">
          <div className="bg-[#12372A] px-6 py-4 flex items-center">
            <User className="w-5 h-5 text-[#C49A5A] mr-3" />
            <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>1. Basic Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#1E1E1A] mb-1">First Name *</label>
              <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C49A5A] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Middle Name</label>
              <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C49A5A] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Last Name *</label>
              <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C49A5A] outline-none" />
            </div>
            
            {/* New Marital Status Fields */}
            <div>
              <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Marital Status</label>
              <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md bg-white focus:ring-[#C49A5A]">
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
            </div>
            {formData.maritalStatus === 'Single' && (
              <div>
                <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Father's Name</label>
                <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md outline-none focus:ring-[#C49A5A]" />
              </div>
            )}
            {formData.maritalStatus === 'Married' && (
              <div>
                <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Husband / Wife Name</label>
                <input type="text" name="spouseName" value={formData.spouseName} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md outline-none focus:ring-[#C49A5A]" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md bg-white">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md" />
            </div>
          </div>
        </section>

        {/* Section 2: Contact Details */}
        <section className="bg-[#F7F0E4] rounded-xl border border-[#C49A5A]/30 overflow-hidden shadow-sm">
          <div className="bg-[#12372A] px-6 py-4 flex items-center">
            <Phone className="w-5 h-5 text-[#C49A5A] mr-3" />
            <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>2. Contact Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Primary Mobile *</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Email Address *</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md" />
            </div>
          </div>
        </section>

        {/* Section 3: Address */}
        <section className="bg-[#F7F0E4] rounded-xl border border-[#C49A5A]/30 overflow-hidden shadow-sm">
          <div className="bg-[#12372A] px-6 py-4 flex items-center">
            <MapPin className="w-5 h-5 text-[#C49A5A] mr-3" />
            <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>3. Address Details</h2>
          </div>
          <div className="p-6 space-y-6">
            
            {/* Current Address */}
            <div>
              <h3 className="text-lg font-medium text-[#12372A] mb-4 border-b border-[#C49A5A]/20 pb-2">Current Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Address Line 1 *</label>
                  <input type="text" name="currentAddressLine1" required value={formData.currentAddressLine1} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Country</label>
                  <select name="currentCountry" value={formData.currentCountry} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md bg-white">
                    <option value="India">India</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                {formData.currentCountry === 'India' ? (
                  <div>
                    <label className="block text-sm font-medium text-[#1E1E1A] mb-1">State</label>
                    <select name="currentState" value={formData.currentState} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md bg-white">
                      <option value="">Select State</option>
                      {Object.keys(INDIA_STATES_CITIES).map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-[#1E1E1A] mb-1">State</label>
                    <input type="text" name="currentState" value={formData.currentState} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md" />
                  </div>
                )}

                {formData.currentCountry === 'India' && formData.currentState ? (
                  <div>
                    <label className="block text-sm font-medium text-[#1E1E1A] mb-1">City / District</label>
                    <select name="currentDistrict" value={formData.currentDistrict} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md bg-white">
                      <option value="">Select City</option>
                      {INDIA_STATES_CITIES[formData.currentState]?.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-[#1E1E1A] mb-1">City / District</label>
                    <input type="text" name="currentDistrict" value={formData.currentDistrict} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md" />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Village/Town</label>
                  <input type="text" name="currentVillage" value={formData.currentVillage} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Pincode</label>
                  <input type="text" name="currentPincode" value={formData.currentPincode} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md" />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-white p-3 rounded-md border border-[#C49A5A]/30">
              <input type="checkbox" name="sameAsPermanent" id="sameAsPermanent" checked={formData.sameAsPermanent} onChange={handleChange} className="w-4 h-4 text-[#12372A] rounded focus:ring-[#C49A5A]" />
              <label htmlFor="sameAsPermanent" className="text-[#1E1E1A] font-medium cursor-pointer">Permanent address is same as current address</label>
            </div>

            {/* Permanent Address */}
            <div className={formData.sameAsPermanent ? 'opacity-50 pointer-events-none' : ''}>
              <h3 className="text-lg font-medium text-[#12372A] mb-4 border-b border-[#C49A5A]/20 pb-2">Permanent Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Address Line 1 *</label>
                  <input type="text" name="permanentAddressLine1" required={!formData.sameAsPermanent} value={formData.permanentAddressLine1} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Country</label>
                  <select name="permanentCountry" value={formData.permanentCountry} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md bg-white">
                    <option value="India">India</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                {formData.permanentCountry === 'India' ? (
                  <div>
                    <label className="block text-sm font-medium text-[#1E1E1A] mb-1">State</label>
                    <select name="permanentState" value={formData.permanentState} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md bg-white">
                      <option value="">Select State</option>
                      {Object.keys(INDIA_STATES_CITIES).map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-[#1E1E1A] mb-1">State</label>
                    <input type="text" name="permanentState" value={formData.permanentState} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md" />
                  </div>
                )}

                {formData.permanentCountry === 'India' && formData.permanentState ? (
                  <div>
                    <label className="block text-sm font-medium text-[#1E1E1A] mb-1">City / District</label>
                    <select name="permanentDistrict" value={formData.permanentDistrict} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md bg-white">
                      <option value="">Select City</option>
                      {INDIA_STATES_CITIES[formData.permanentState]?.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-[#1E1E1A] mb-1">City / District</label>
                    <input type="text" name="permanentDistrict" value={formData.permanentDistrict} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md" />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Village/Town</label>
                  <input type="text" name="permanentVillage" value={formData.permanentVillage} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Pincode</label>
                  <input type="text" name="permanentPincode" value={formData.permanentPincode} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Land / Plot Details */}
        <section className="bg-[#F7F0E4] rounded-xl border border-[#C49A5A]/30 overflow-hidden shadow-sm">
          <div className="bg-[#12372A] px-6 py-4 flex items-center">
            <Map className="w-5 h-5 text-[#C49A5A] mr-3" />
            <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>4. Land / Plot Allocation Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Passbook Number</label>
              <input type="text" name="passbookNumber" value={formData.passbookNumber} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md" placeholder="e.g. PBK123456" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Plot Size / Configuration</label>
              <select name="plotConfiguration" value={formData.plotConfiguration} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md bg-white">
                <option value="">Select Size</option>
                <option value="100 sq. yards">100 sq. yards</option>
                <option value="200 sq. yards">200 sq. yards</option>
                <option value="500 sq. yards">500 sq. yards</option>
                <option value="1 Acre">1 Acre</option>
                <option value="Custom">Custom Configuration</option>
              </select>
            </div>

            {/* Plot Photos Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#1E1E1A] mb-2">Plot Photos (Max 4, Mandatory) *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.plotPhotosPreviews.map((url, i) => (
                  <div key={i} className="relative aspect-video rounded-md overflow-hidden border border-gray-200">
                    <img src={url} alt={`Plot ${i+1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                
                {formData.plotPhotosPreviews.length < 4 && (
                  <div className="aspect-video rounded-md border-2 border-dashed border-[#C49A5A] flex flex-col items-center justify-center cursor-pointer hover:bg-[#C49A5A]/5 transition-colors" onClick={() => document.getElementById('plotPhotosUpload')?.click()}>
                    <Upload className="w-6 h-6 text-[#C49A5A] mb-1" />
                    <span className="text-xs text-gray-500">Upload Photo</span>
                    <input id="plotPhotosUpload" type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileChange(e, 'plotPhotosPreviews', true)} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Payment Details */}
        <section className="bg-[#F7F0E4] rounded-xl border border-[#C49A5A]/30 overflow-hidden shadow-sm">
          <div className="bg-[#12372A] px-6 py-4 flex items-center">
            <CreditCard className="w-5 h-5 text-[#C49A5A] mr-3" />
            <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>5. Payment Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Payment Mode</label>
              <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md bg-white">
                <option value="">Select Mode</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
            
            <div className="row-span-2">
              <label className="block text-sm font-medium text-[#1E1E1A] mb-2">Payment Proof Upload</label>
              <div className="w-full h-32 rounded-md border-2 border-dashed border-[#C49A5A] flex flex-col items-center justify-center cursor-pointer hover:bg-[#C49A5A]/5 transition-colors overflow-hidden" onClick={() => document.getElementById('paymentProofUpload')?.click()}>
                {formData.paymentProofPreview ? (
                   <img src={formData.paymentProofPreview} alt="Payment Proof" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-[#C49A5A] mb-2" />
                    <span className="text-sm text-gray-500">Click to upload receipt</span>
                  </>
                )}
                <input id="paymentProofUpload" type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFileChange(e, 'paymentProofPreview')} />
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Document Management */}
        <section className="bg-[#F7F0E4] rounded-xl border border-[#C49A5A]/30 overflow-hidden shadow-sm">
          <div className="bg-[#12372A] px-6 py-4 flex items-center">
            <FileText className="w-5 h-5 text-[#C49A5A] mr-3" />
            <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>6. Document Management</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#1E1E1A] mb-2">Passbook Photo Upload</label>
              <div className="w-full h-40 rounded-md border-2 border-dashed border-[#C49A5A] flex flex-col items-center justify-center cursor-pointer hover:bg-[#C49A5A]/5 transition-colors overflow-hidden relative" onClick={() => document.getElementById('passbookPhotoUpload')?.click()}>
                {formData.passbookPhotoPreview ? (
                   <img src={formData.passbookPhotoPreview} alt="Passbook" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-[#C49A5A] mb-2" />
                    <span className="text-sm text-gray-500">Click to upload passbook photo</span>
                  </>
                )}
                <input id="passbookPhotoUpload" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'passbookPhotoPreview')} />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#1E1E1A] mb-2">Land Document Upload</label>
              <div className="w-full h-40 rounded-md border-2 border-dashed border-[#C49A5A] flex flex-col items-center justify-center cursor-pointer hover:bg-[#C49A5A]/5 transition-colors overflow-hidden relative" onClick={() => document.getElementById('landDocumentUpload')?.click()}>
                {formData.landDocumentPreview ? (
                   <img src={formData.landDocumentPreview} alt="Land Document" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <FileText className="w-8 h-8 text-[#C49A5A] mb-2" />
                    <span className="text-sm text-gray-500">Click to upload land document</span>
                  </>
                )}
                <input id="landDocumentUpload" type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFileChange(e, 'landDocumentPreview')} />
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Nominee Details */}
        <section className="bg-[#F7F0E4] rounded-xl border border-[#C49A5A]/30 overflow-hidden shadow-sm">
          <div className="bg-[#12372A] px-6 py-4 flex items-center">
            <Users className="w-5 h-5 text-[#C49A5A] mr-3" />
            <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>7. Nominee Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Nominee Name *</label>
              <input type="text" name="nomineeName" required value={formData.nomineeName} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C49A5A] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Relationship *</label>
              <select name="nomineeRelation" required value={formData.nomineeRelation} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md bg-white focus:ring-[#C49A5A]">
                <option value="">Select Relationship</option>
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Nominee Phone *</label>
              <input 
                type="tel" 
                name="nomineePhone" 
                required 
                pattern="^[6-9]\d{9}$" 
                title="Must be a valid 10-digit Indian mobile number" 
                value={formData.nomineePhone} 
                onChange={handleChange} 
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-[#C49A5A]" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Nominee Email</label>
              <input type="email" name="nomineeEmail" value={formData.nomineeEmail} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-[#C49A5A]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Nominee Aadhaar (12 digits)</label>
              <input 
                type="text" 
                name="nomineeAadhaar" 
                pattern="^\d{12}$" 
                title="Aadhaar Number must be exactly 12 digits" 
                value={formData.nomineeAadhaar} 
                onChange={handleChange} 
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-[#C49A5A]" 
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-[#1E1E1A] mb-1">Nominee Address</label>
              <textarea name="nomineeAddress" rows={2} value={formData.nomineeAddress} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-[#C49A5A]" />
            </div>
          </div>
        </section>

      </form>
    </div>
  );
}
