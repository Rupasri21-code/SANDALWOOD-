'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  X, User, Phone, MapPin, Briefcase, TrendingUp, 
  Map, CreditCard, FileText, Users, Bell, Key, Settings, Camera,
  CheckCircle2, ChevronRight, ChevronLeft, Save, Upload, Download, Eye, File as FileIcon, Image as ImageIcon, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import { InvestorSummary } from './investor-summary';

const SECTIONS = [
  { id: 1, title: 'Personal Information', icon: User },
  { id: 2, title: 'Contact Information', icon: Phone },
  { id: 3, title: 'Address Information', icon: MapPin },
  { id: 4, title: 'Professional Details', icon: Briefcase },
  { id: 5, title: 'Investment Profile', icon: TrendingUp },
  { id: 6, title: 'Land / Plot Allocation', icon: Map },
  { id: 7, title: 'Payment Details', icon: CreditCard },
  { id: 8, title: 'Document Management', icon: FileText },
  { id: 9, title: 'Nominee Details', icon: Users },
  { id: 10, title: 'Communication Settings', icon: Bell },
  { id: 11, title: 'Dashboard Access', icon: Key },
  { id: 12, title: 'Internal Admin', icon: Settings },
];

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

// Reusable Document Upload Component
const DocumentUploader = ({ title, fieldName, formData, setFormData, accept = "image/jpeg,image/png,image/webp,application/pdf", maxSizeMB = 10, setPreviewData }: any) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const file = formData[fieldName];
  const url = formData[`${fieldName}Url`];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > maxSizeMB * 1024 * 1024) {
        toast.error(`File must be smaller than ${maxSizeMB}MB`);
        return;
      }
      const objectUrl = URL.createObjectURL(selectedFile);
      setFormData((prev: any) => ({
        ...prev,
        [fieldName]: selectedFile,
        [`${fieldName}Url`]: objectUrl,
        [`${fieldName}Name`]: selectedFile.name,
        [`${fieldName}Size`]: (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB',
        [`${fieldName}Date`]: new Date().toLocaleDateString()
      }));
    }
  };

  const handleRemove = (e: any) => {
    e.stopPropagation();
    setFormData((prev: any) => {
      const next = { ...prev };
      delete next[fieldName];
      delete next[`${fieldName}Url`];
      delete next[`${fieldName}Name`];
      delete next[`${fieldName}Size`];
      delete next[`${fieldName}Date`];
      return next;
    });
  };

  const isPdf = file?.type === 'application/pdf' || url?.endsWith('.pdf');

  return (
    <div className="p-5 border border-dashed border-white/20 rounded-xl bg-white/5 flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-white text-sm font-medium">{title}</Label>
      </div>

      {url ? (() => {
        let previewUrl = url;
        if (isPdf && url.includes('/image/upload/')) {
          previewUrl = url.replace('/image/upload/', '/raw/upload/');
        }
        return (
        <div onClick={() => setPreviewData && setPreviewData({url: previewUrl, isPdf})} className="flex flex-col bg-[#1A1A1A] rounded-xl shadow-lg border border-white/10 w-full cursor-pointer overflow-hidden group select-none">
          {/* Top Half: Thumbnail (Dark Background) */}
          <div className="h-32 bg-[#141410] flex items-center justify-center overflow-hidden relative border-b border-white/5 group-hover:bg-[#1C1C1A] transition-colors">
             {isPdf ? (
               url.includes('cloudinary') ? (
                 <img src={url.replace('.pdf', '.jpg')} className="w-full h-full object-cover object-top opacity-80" onError={(e) => { e.currentTarget.style.display='none' }} />
               ) : (
                 <iframe src={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} className="w-full h-[300px] -mt-20 pointer-events-none opacity-80 bg-white" />
               )
             ) : (
               <img src={url} alt={title} className="w-full h-full object-cover opacity-80" />
             )}
             {/* Overlay for view action */}
             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/60 rounded-full py-1.5 px-3 backdrop-blur-sm border border-white/10 text-white flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium tracking-wide">Preview</span>
                </div>
             </div>
          </div>
          
          {/* Middle: PDF/IMG details */}
          <div className="flex items-center gap-3 p-4 relative">
             <div className={`w-11 h-11 shrink-0 ${isPdf ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'} border rounded-lg flex items-center justify-center shadow-inner`}>
                <span className="font-bold text-[11px] tracking-wider uppercase">{isPdf ? 'PDF' : 'IMG'}</span>
             </div>
             <div className="flex-1 min-w-0 pr-8">
                <p className="text-white text-sm font-medium truncate mb-1">{formData[`${fieldName}Name`] || title}</p>
                <div className="flex items-center gap-2">
                   <span className="text-white/40 text-xs font-medium">{isPdf ? 'PDF' : 'IMG'}</span>
                   <span className="text-white/20 text-[10px]">•</span>
                   <span className="text-white/40 text-xs">{formData[`${fieldName}Size`] || 'Uploaded'}</span>
                </div>
             </div>
             {/* Uploaded date fake ticks */}
             <div className="absolute right-4 top-4 flex flex-col items-end gap-1">
                <span className="text-white/30 text-[10px] uppercase tracking-wider">{new Date().toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400/80" />
             </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center border-t border-white/5 bg-[#141410]" onClick={e => e.stopPropagation()}>
             <a href={previewUrl} download target="_blank" rel="noopener noreferrer" className="flex-1 py-3 flex items-center justify-center gap-1.5 text-[#c8851e] hover:text-[#e9be55] hover:bg-white/5 font-medium text-[13px] border-r border-white/5 transition-colors">
                <Download className="w-3.5 h-3.5" /> Download
             </a>
             <button onClick={() => fileRef.current?.click()} type="button" className="flex-1 py-3 flex items-center justify-center gap-1.5 text-white/60 hover:text-white hover:bg-white/5 font-medium text-[13px] border-r border-white/5 transition-colors">
                Replace
             </button>
             <button onClick={handleRemove} type="button" className="flex-1 py-3 flex items-center justify-center gap-1.5 text-red-400/90 hover:text-red-400 hover:bg-white/5 font-medium text-[13px] transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Remove
             </button>
          </div>
        </div>
        );
      })() : (
        <div 
          className="h-28 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="w-6 h-6 text-white/40 mb-2" />
          <p className="text-sm text-white/70">Click to upload {title}</p>
          <p className="text-xs text-white/40 mt-1">PDF, JPG, PNG up to {maxSizeMB}MB</p>
        </div>
      )}
      <input type="file" ref={fileRef} className="hidden" accept={accept} onChange={handleFileChange} />
    </div>
  );
};

export function InvestorWizard({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData = null,
  loading = false,
  isViewMode = false
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (data: any) => void;
  initialData?: any;
  loading?: boolean;
  isViewMode?: boolean;
}) {
  const [activeSection, setActiveSection] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [previewData, setPreviewData] = useState<{url: string, isPdf: boolean} | null>(null);
  const [previewError, setPreviewError] = useState(false);
  
  // Camera State
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const profilePhotoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        status: 'ACTIVE',
        currentCountry: 'India',
        permanentCountry: 'India',
        sendWelcomeEmail: true,
        sendWhatsapp: true,
        sendSms: true,
        monthlyUpdates: true,
        paymentReminders: true,
        documentUpdates: true,
        sameAsPermanent: false,
        passbookVerificationStatus: 'Pending',
        plotPhotosUrls: [],
        plotPhotosFiles: [],
      });
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    const total = Number(formData.totalInvestment) || 0;
    const paid = Number(formData.paidAmount) || 0;
    if (total >= 0 || paid >= 0) {
      const remaining = total - paid;
      const actualRemaining = remaining > 0 ? remaining : 0;
      let status = '';
      
      if (actualRemaining === 0 && total > 0) status = 'Paid';
      else if (paid > 0 && actualRemaining > 0) status = 'Partial Payment Pending';
      else status = 'Not Paid';

      if (formData.remainingAmount !== actualRemaining || formData.paymentStatus !== status) {
        setFormData((prev: any) => ({ ...prev, remainingAmount: actualRemaining, paymentStatus: status }));
      }
    }
  }, [formData.totalInvestment, formData.paidAmount]);

  if (!isOpen) return null;

  const validateSection = (section: number) => {
    switch (section) {
      case 1: // Personal
        if (!formData.profilePhotoUrl) { toast.error("Profile Photo Upload is required"); return false; }
        if (!formData.firstName || formData.firstName.length < 2) { toast.error("First Name must be at least 2 characters"); return false; }
        if (!formData.lastName) { toast.error("Last Name is required"); return false; }
        if (formData.maritalStatus === 'Single' && !formData.fatherName) { toast.error("Father Name is required for Single status"); return false; }
        if (formData.maritalStatus === 'Married' && !formData.spouseName) { toast.error("Husband/Wife Name is required for Married status"); return false; }
        if (['Divorced', 'Widowed'].includes(formData.maritalStatus) && (!formData.fatherName || !formData.spouseName)) {
          toast.error("Both Father Name and Husband/Wife Name are required"); return false;
        }
        return true;
      case 2: // Contact
        if (!formData.email) { toast.error("Email is required"); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { toast.error("Invalid email format"); return false; }
        if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone)) { toast.error("Must be a valid 10-digit Indian mobile number"); return false; }
        return true;
      case 3: // Address
        if (!formData.currentCountry) { toast.error("Current Country is required"); return false; }
        if (formData.currentCountry === 'India' && (!formData.currentState || !formData.currentDistrict)) {
          toast.error("State and District are required for India"); return false;
        }
        if (formData.currentPincode && !/^\d{6}$/.test(formData.currentPincode)) { toast.error("Current Pincode must be exactly 6 digits"); return false; }
        if (!formData.sameAsPermanent) {
          if (!formData.permanentCountry) { toast.error("Permanent Country is required"); return false; }
          if (formData.permanentCountry === 'India' && (!formData.permanentState || !formData.permanentDistrict)) {
            toast.error("Permanent State and District are required"); return false;
          }
          if (formData.permanentPincode && !/^\d{6}$/.test(formData.permanentPincode)) { toast.error("Permanent Pincode must be exactly 6 digits"); return false; }
        }
        return true;
      case 4: // Professional
        if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) {
          toast.error("Invalid PAN format (e.g. ABCDE1234F)"); return false;
        }
        if (formData.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber.toUpperCase())) {
          toast.error("Invalid GST format"); return false;
        }
        if (formData.aadhaarNumber && !/^\d{12}$/.test(formData.aadhaarNumber)) {
          toast.error("Aadhaar Number must be exactly 12 digits"); return false;
        }
        return true;
      case 5: // Investment
        if (!formData.investmentInterest) { toast.error("Investment Interest is required"); return false; }
        if (!formData.budgetRange) { toast.error("Budget Range is required"); return false; }
        return true;
      case 6: // Plot Allocation
        if (!formData.passbookNumber) { toast.error("Passbook Number is required"); return false; }
        if (!formData.plotConfiguration) { toast.error("Plot Configuration is required"); return false; }
        if (!formData.plotPhotosUrls || formData.plotPhotosUrls.length !== 4) { 
          toast.error("Please upload or capture exactly 4 plot photos."); return false; 
        }
        return true;
      case 7: // Payment
        if (!formData.totalInvestment) { toast.error("Total Investment Amount is required"); return false; }
        if (!formData.paidAmount) { toast.error("Paid Amount is required"); return false; }
        if (!formData.paymentStatus) { toast.error("Payment Status is required"); return false; }
        if (formData.paymentStatus === 'Paid' && !formData.paymentProofUrl) { toast.error("Payment Proof Upload is required for completed payments"); return false; }
        return true;
      case 8: // Document Management
        if (!formData.aadhaarUrl || !formData.panUrl || !formData.passbookPhotoUrl || !formData.landDocumentUrl) { 
          toast.error("Please upload all mandatory documents (Aadhaar, PAN, Passbook, Land Document)."); return false; 
        }
        return true;
      case 9: // Nominee
        if (!formData.nomineeName || formData.nomineeName.length < 2) { toast.error("Nominee Name is required (min 2 chars)"); return false; }
        if (!formData.nomineeRelation) { toast.error("Nominee Relationship is required"); return false; }
        if (!formData.nomineePhone || !/^[6-9]\d{9}$/.test(formData.nomineePhone)) { toast.error("Nominee Phone must be a valid 10-digit mobile number"); return false; }
        if (formData.nomineeEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.nomineeEmail)) { toast.error("Invalid nominee email format"); return false; }
        if (formData.nomineeAadhaar && !/^\d{12}$/.test(formData.nomineeAadhaar)) { toast.error("Nominee Aadhaar must be exactly 12 digits"); return false; }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateSection(activeSection)) {
      if (activeSection < SECTIONS.length) setActiveSection(activeSection + 1);
    }
  };

  const handlePrev = () => {
    if (activeSection > 1) setActiveSection(activeSection - 1);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => {
      const next = { ...prev, [field]: value };
      
      // Auto-calculate full name
      if (['firstName', 'middleName', 'lastName'].includes(field)) {
        next.fullName = [next.firstName, next.middleName, next.lastName].filter(Boolean).join(' ');
      }
      
      // Auto-calculate age
      if (field === 'dob' && value) {
        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        next.age = age;
      }
      
      // Auto-copy permanent address logic
      if (field === 'sameAsPermanent') {
        if (value === true) {
          next.currentCountry = next.permanentCountry;
          next.currentState = next.permanentState;
          next.currentDistrict = next.permanentDistrict;
          next.currentVillage = next.permanentVillage;
          next.currentAddressLine1 = next.permanentAddressLine1;
          next.currentAddressLine2 = next.permanentAddressLine2;
          next.currentLandmark = next.permanentLandmark;
          next.currentPincode = next.permanentPincode;
        }
      } else if (field.startsWith('permanent') && next.sameAsPermanent) {
        const currentField = field.replace('permanent', 'current');
        next[currentField] = value;
      }

      return next;
    });
  };

  const handleToggle = (field: string) => {
    handleChange(field, !formData[field]);
  };

  const generateCredentials = () => {
    if (!formData.firstName) {
      toast.error("Please enter First Name in Personal Info first.");
      setActiveSection(1);
      return;
    }
    const username = `${formData.firstName.toLowerCase().replace(/\s/g,'')}.${(formData.lastName || '').toLowerCase().replace(/\s/g,'')}`;
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const firstL = letters[Math.floor(Math.random() * letters.length)];
    const secL = letters[Math.floor(Math.random() * letters.length)].toLowerCase();
    const p1 = Math.floor(1000 + Math.random() * 9000);
    const p2 = Math.floor(100 + Math.random() * 900);
    const password = `${firstL}${secL}#${p1}@${p2}`;
    
    setFormData((prev: any) => ({ ...prev, generatedUsername: username, generatedPassword: password }));
    toast.success("Credentials generated securely.");
  };

  const handleProfilePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Profile photo must be less than 5MB");
        return;
      }
      setFormData((prev: any) => ({
        ...prev,
        profilePhotoFile: file,
        profilePhotoUrl: URL.createObjectURL(file)
      }));
    }
  };

  const handlePlotPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const currentCount = formData.plotPhotosUrls?.length || 0;
      if (currentCount + files.length > 4) {
        toast.error("Only 4 plot photos are allowed.");
        return;
      }
      
      const newUrls = files.map(f => URL.createObjectURL(f));
      const newSources = files.map(() => 'Uploaded');
      setFormData((prev: any) => ({
        ...prev,
        plotPhotosFiles: [...(prev.plotPhotosFiles || []), ...files],
        plotPhotosUrls: [...(prev.plotPhotosUrls || []), ...newUrls],
        plotPhotosSources: [...(prev.plotPhotosSources || []), ...newSources]
      }));
    }
  };

  const removePlotPhoto = (index: number) => {
    setFormData((prev: any) => {
      const newFiles = [...(prev.plotPhotosFiles || [])];
      const newUrls = [...(prev.plotPhotosUrls || [])];
      const newSources = [...(prev.plotPhotosSources || [])];
      newFiles.splice(index, 1);
      newUrls.splice(index, 1);
      newSources.splice(index, 1);
      return { ...prev, plotPhotosFiles: newFiles, plotPhotosUrls: newUrls, plotPhotosSources: newSources };
    });
  };

  // WebRTC Camera Handlers
  const openCamera = async () => {
    setCameraError('');
    setCapturedPhotoUrl(null);
    setCameraModalOpen(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setCameraError("Camera permission denied. Please allow camera access or use Upload From Browser.");
      } else {
        setCameraError("No camera found. Please use Upload From Browser.");
      }
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraModalOpen(false);
    setCapturedPhotoUrl(null);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedPhotoUrl(dataUrl);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedPhotoUrl(null);
  };

  const saveCapturedPhoto = () => {
    if (capturedPhotoUrl) {
      fetch(capturedPhotoUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `captured_plot_${Date.now()}.jpg`, { type: 'image/jpeg' });
          const currentCount = formData.plotPhotosUrls?.length || 0;
          if (currentCount >= 4) {
             toast.error("Only 4 plot photos are allowed.");
             closeCamera();
             return;
          }
          setFormData((prev: any) => ({
            ...prev,
            plotPhotosFiles: [...(prev.plotPhotosFiles || []), file],
            plotPhotosUrls: [...(prev.plotPhotosUrls || []), capturedPhotoUrl],
            plotPhotosSources: [...(prev.plotPhotosSources || []), 'Captured']
          }));
          closeCamera();
        });
    }
  };

  const validateAndSave = () => {
    // Requirements Validation
    if (!formData.firstName) { toast.error("First Name is required"); setActiveSection(1); return; }
    if (!formData.lastName) { toast.error("Last Name is required"); setActiveSection(1); return; }
    if (!formData.phone) { toast.error("Primary Mobile is required"); setActiveSection(2); return; }
    if (!formData.email) { toast.error("Email is required"); setActiveSection(2); return; }
    if (!formData.currentAddressLine1) { toast.error("Current Address is required"); setActiveSection(3); return; }
    if (!formData.investmentInterest) { toast.error("Investment Interest is required"); setActiveSection(5); return; }
    if (!formData.plotConfiguration) { toast.error("Plot Configuration is required"); setActiveSection(6); return; }
    if (!formData.plotPhotosUrls || formData.plotPhotosUrls.length === 0) { toast.error("At least 1 Plot Photo is mandatory"); setActiveSection(6); return; }
    if (!formData.paymentStatus) { toast.error("Payment Status is required"); setActiveSection(7); return; }
    if (!formData.nomineeName || formData.nomineeName.length < 2) { toast.error("Nominee Name is required (min 2 chars)"); setActiveSection(9); return; }
    if (!formData.nomineeRelation) { toast.error("Nominee Relationship is required"); setActiveSection(9); return; }
    if (!formData.nomineePhone || !/^[6-9]\d{9}$/.test(formData.nomineePhone)) { toast.error("Nominee Phone must be a valid 10-digit mobile number"); setActiveSection(9); return; }
    if (formData.nomineeEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.nomineeEmail)) { toast.error("Invalid nominee email format"); setActiveSection(9); return; }
    if (formData.nomineeAadhaar && !/^\d{12}$/.test(formData.nomineeAadhaar)) { toast.error("Nominee Aadhaar must be exactly 12 digits"); setActiveSection(9); return; }

    onSave(formData);
  };

  const renderParentSpouseFields = () => {
    if (!formData.maritalStatus) return null;
    
    if (formData.maritalStatus === 'Single') {
      return (
        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-white/70 text-xs">Father Name *</Label>
          <Input value={formData.fatherName || ''} onChange={(e) => handleChange('fatherName', e.target.value)}
            className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
        </div>
      );
    } else if (formData.maritalStatus === 'Married') {
      return (
        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-white/70 text-xs">Husband / Wife Name *</Label>
          <Input value={formData.spouseName || ''} onChange={(e) => handleChange('spouseName', e.target.value)}
            className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
        </div>
      );
    } else if (['Divorced', 'Widowed'].includes(formData.maritalStatus)) {
      return (
        <>
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs">Father Name</Label>
            <Input value={formData.fatherName || ''} onChange={(e) => handleChange('fatherName', e.target.value)}
              className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs">Husband / Wife Name</Label>
            <Input value={formData.spouseName || ''} onChange={(e) => handleChange('spouseName', e.target.value)}
              className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
          </div>
        </>
      );
    }
  };

  if (isViewMode) {
    return (
      <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-end p-0 print:static print:block print:w-full print:h-auto print:overflow-visible">
        <InvestorSummary formData={formData} onClose={onClose} onEdit={() => toast.info('Please click the Edit (pencil) icon in the table to edit.')} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="w-full max-w-5xl bg-[#141410] border-l border-white/10 shadow-2xl flex flex-col h-full animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/2">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {initialData ? 'Edit Investor' : 'Add New Investor'}
            </h2>
            <p className="text-sm text-white/50 mt-1">
              Complete the profile setup to onboard a new investor.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-white/10 bg-[#141410] overflow-y-auto p-4 hide-scrollbar hidden md:block">
            <nav className="space-y-1">
              {SECTIONS.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                const isCompleted = activeSection > section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      isActive 
                        ? 'bg-[#c8851e]/10 text-[#c8851e] font-medium border border-[#c8851e]/20' 
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#c8851e]' : isCompleted ? 'text-green-400' : 'text-white/40'}`} />
                    <span className="text-left flex-1">{section.title}</span>
                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Form Area */}
          <div className="flex-1 overflow-y-auto p-8 hide-scrollbar bg-gradient-to-b from-white/2 to-transparent relative">
            <div className="max-w-3xl mx-auto space-y-8 pb-20">
              <fieldset disabled={isViewMode} className="space-y-8 contents">
              
              {/* SECTION 1 - Personal Information */}
              {activeSection === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b border-white/10 pb-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-[#c8851e]" />
                      Personal Information
                    </h3>
                  </div>

                  {/* Profile Photo Upload */}
                  <div className="flex flex-col items-center justify-center p-6 border border-dashed border-white/20 bg-white/5 rounded-xl">
                    <div className="relative group cursor-pointer" onClick={() => profilePhotoRef.current?.click()}>
                      <div className="w-28 h-28 rounded-full border-4 border-[#141410] shadow-xl overflow-hidden bg-white/10 flex items-center justify-center">
                        {formData.profilePhotoUrl ? (
                          <img src={formData.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-12 h-12 text-white/40" />
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/50 rounded-full hidden group-hover:flex items-center justify-center transition-all">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <input type="file" ref={profilePhotoRef} accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleProfilePhoto} />
                    <p className="text-sm font-medium text-white mt-4">Profile Photo</p>
                    <p className="text-xs text-white/40 mt-1">JPG, PNG, WEBP max 5MB</p>
                    {formData.profilePhotoUrl && (
                      <button onClick={() => setFormData((prev:any) => ({...prev, profilePhotoUrl: null, profilePhotoFile: null}))} className="text-xs text-red-400 mt-2 hover:text-red-300 flex items-center"><Trash2 className="w-3 h-3 mr-1" /> Remove</button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">First Name *</Label>
                      <Input value={formData.firstName || ''} onChange={(e) => handleChange('firstName', e.target.value)}
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Middle Name</Label>
                      <Input value={formData.middleName || ''} onChange={(e) => handleChange('middleName', e.target.value)}
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Last Name *</Label>
                      <Input value={formData.lastName || ''} onChange={(e) => handleChange('lastName', e.target.value)}
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Full Name</Label>
                      <Input readOnly value={formData.fullName || ''} className="bg-white/10 border-white/10 text-white/50 cursor-not-allowed" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Gender</Label>
                      <select value={formData.gender || ''} onChange={(e) => handleChange('gender', e.target.value)}
                        className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:ring-[#c8851e]">
                        <option value="" className="bg-[#141410]">Select Gender</option>
                        <option value="Male" className="bg-[#141410]">Male</option>
                        <option value="Female" className="bg-[#141410]">Female</option>
                        <option value="Other" className="bg-[#141410]">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Marital Status</Label>
                      <select value={formData.maritalStatus || ''} onChange={(e) => handleChange('maritalStatus', e.target.value)}
                        className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:ring-[#c8851e]">
                        <option value="" className="bg-[#141410]">Select Status</option>
                        <option value="Single" className="bg-[#141410]">Single</option>
                        <option value="Married" className="bg-[#141410]">Married</option>
                        <option value="Divorced" className="bg-[#141410]">Divorced</option>
                        <option value="Widowed" className="bg-[#141410]">Widowed</option>
                      </select>
                    </div>
                    {renderParentSpouseFields()}
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Date of Birth</Label>
                      <Input type="date" value={formData.dob ? formData.dob.split('T')[0] : ''} onChange={(e) => handleChange('dob', e.target.value)}
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Age</Label>
                      <Input type="number" readOnly value={formData.age || ''} className="bg-white/10 border-white/10 text-white/50 cursor-not-allowed" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Investor Category</Label>
                      <select value={formData.investorType || ''} onChange={(e) => handleChange('investorType', e.target.value)}
                        className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:ring-[#c8851e]">
                        <option value="" className="bg-[#141410]">Select Category</option>
                        <option value="Individual" className="bg-[#141410]">Individual</option>
                        <option value="NRI" className="bg-[#141410]">NRI</option>
                        <option value="Business Owner" className="bg-[#141410]">Business Owner</option>
                        <option value="Company" className="bg-[#141410]">Company</option>
                        <option value="Trust" className="bg-[#141410]">Trust</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2 - Contact Information */}
              {activeSection === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <Phone className="w-5 h-5 text-[#c8851e]" />
                      Contact Information
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Email Address *</Label>
                      <Input type="email" value={formData.email || ''} onChange={(e) => handleChange('email', e.target.value)}
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Alternate Email</Label>
                      <Input type="email" value={formData.altEmail || ''} onChange={(e) => handleChange('altEmail', e.target.value)}
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Primary Mobile *</Label>
                      <Input value={formData.phone || ''} onChange={(e) => handleChange('phone', e.target.value)}
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Alternate Mobile</Label>
                      <Input value={formData.altPhone || ''} onChange={(e) => handleChange('altPhone', e.target.value)}
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">WhatsApp Number</Label>
                      <Input value={formData.whatsappNumber || ''} onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Preferred Contact Method</Label>
                      <select value={formData.prefCommunication || ''} onChange={(e) => handleChange('prefCommunication', e.target.value)}
                        className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:ring-[#c8851e]">
                        <option value="Phone" className="bg-[#141410]">Phone</option>
                        <option value="Email" className="bg-[#141410]">Email</option>
                        <option value="WhatsApp" className="bg-[#141410]">WhatsApp</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3 - Address Information */}
              {activeSection === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#c8851e]" />
                      Address Information
                    </h3>
                  </div>
                  
                  {/* PERMANENT ADDRESS */}
                  <div className="space-y-5 bg-white/5 p-5 rounded-xl border border-white/10">
                    <h4 className="font-medium text-white text-sm">Permanent Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-white/70 text-xs">Country</Label>
                        <select value={formData.permanentCountry || ''} onChange={(e) => {
                             handleChange('permanentCountry', e.target.value);
                             handleChange('permanentState', '');
                             handleChange('permanentDistrict', '');
                          }}
                          className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:ring-[#c8851e]">
                          <option value="" className="bg-[#141410]">Select Country</option>
                          {allCountries.map(c => <option key={c.isoCode} value={c.name} className="bg-[#141410]">{c.name}</option>)}
                        </select>
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label className="text-white/70 text-xs">State / Province</Label>
                        <select value={formData.permanentState || ''} onChange={(e) => {
                            handleChange('permanentState', e.target.value);
                            handleChange('permanentDistrict', '');
                          }}
                          disabled={!formData.permanentCountry}
                          className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:ring-[#c8851e] disabled:opacity-50">
                          <option value="" className="bg-[#141410]">Select State</option>
                          {getStates(formData.permanentCountry).map(s => <option key={s.isoCode} value={s.name} className="bg-[#141410]">{s.name}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-white/70 text-xs">District / City</Label>
                        <select value={formData.permanentDistrict || ''} onChange={(e) => handleChange('permanentDistrict', e.target.value)}
                          disabled={!formData.permanentState}
                          className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:ring-[#c8851e] disabled:opacity-50">
                          <option value="" className="bg-[#141410]">Select City</option>
                          {getCities(formData.permanentCountry, formData.permanentState).map(c => <option key={c.name} value={c.name} className="bg-[#141410]">{c.name}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-white/70 text-xs">Village / Town</Label>
                        <Input value={formData.permanentVillage || ''} onChange={(e) => handleChange('permanentVillage', e.target.value)}
                          className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-white/70 text-xs">Address Line 1</Label>
                        <Input value={formData.permanentAddressLine1 || ''} onChange={(e) => handleChange('permanentAddressLine1', e.target.value)}
                          className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-white/70 text-xs">Address Line 2</Label>
                        <Input value={formData.permanentAddressLine2 || ''} onChange={(e) => handleChange('permanentAddressLine2', e.target.value)}
                          className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white/70 text-xs">Landmark</Label>
                        <Input value={formData.permanentLandmark || ''} onChange={(e) => handleChange('permanentLandmark', e.target.value)}
                          className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white/70 text-xs">Pincode</Label>
                        <Input value={formData.permanentPincode || ''} onChange={(e) => handleChange('permanentPincode', e.target.value)}
                          className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-1">
                    <input type="checkbox" id="sameAddress" checked={formData.sameAsPermanent} onChange={(e) => handleChange('sameAsPermanent', e.target.checked)} className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#c8851e] focus:ring-[#c8851e]" />
                    <Label htmlFor="sameAddress" className="text-white cursor-pointer text-sm">Current Address Same As Permanent Address</Label>
                  </div>

                  {/* CURRENT ADDRESS */}
                  <div className={`space-y-5 bg-white/5 p-5 rounded-xl border border-white/10 transition-opacity ${formData.sameAsPermanent ? 'opacity-50 pointer-events-none' : ''}`}>
                    <h4 className="font-medium text-white text-sm">Current Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-white/70 text-xs">Country</Label>
                        <select value={formData.currentCountry || ''} onChange={(e) => {
                             handleChange('currentCountry', e.target.value);
                             handleChange('currentState', '');
                             handleChange('currentDistrict', '');
                          }}
                          className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:ring-[#c8851e]">
                          <option value="" className="bg-[#141410]">Select Country</option>
                          {allCountries.map(c => <option key={c.isoCode} value={c.name} className="bg-[#141410]">{c.name}</option>)}
                        </select>
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label className="text-white/70 text-xs">State / Province</Label>
                        <select value={formData.currentState || ''} onChange={(e) => {
                            handleChange('currentState', e.target.value);
                            handleChange('currentDistrict', '');
                          }}
                          disabled={!formData.currentCountry}
                          className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:ring-[#c8851e] disabled:opacity-50">
                          <option value="" className="bg-[#141410]">Select State</option>
                          {getStates(formData.currentCountry).map(s => <option key={s.isoCode} value={s.name} className="bg-[#141410]">{s.name}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-white/70 text-xs">District / City</Label>
                        <select value={formData.currentDistrict || ''} onChange={(e) => handleChange('currentDistrict', e.target.value)}
                          disabled={!formData.currentState}
                          className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:ring-[#c8851e] disabled:opacity-50">
                          <option value="" className="bg-[#141410]">Select City</option>
                          {getCities(formData.currentCountry, formData.currentState).map(c => <option key={c.name} value={c.name} className="bg-[#141410]">{c.name}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-white/70 text-xs">Village / Town</Label>
                        <Input value={formData.currentVillage || ''} onChange={(e) => handleChange('currentVillage', e.target.value)}
                          className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-white/70 text-xs">Address Line 1</Label>
                        <Input value={formData.currentAddressLine1 || ''} onChange={(e) => handleChange('currentAddressLine1', e.target.value)}
                          className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-white/70 text-xs">Address Line 2</Label>
                        <Input value={formData.currentAddressLine2 || ''} onChange={(e) => handleChange('currentAddressLine2', e.target.value)}
                          className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white/70 text-xs">Landmark</Label>
                        <Input value={formData.currentLandmark || ''} onChange={(e) => handleChange('currentLandmark', e.target.value)}
                          className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white/70 text-xs">Pincode</Label>
                        <Input value={formData.currentPincode || ''} onChange={(e) => handleChange('currentPincode', e.target.value)}
                          className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 4 - Professional Details */}
              {activeSection === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-[#c8851e]" />
                      Professional Details
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Occupation</Label>
                      <Input value={formData.occupation || ''} onChange={(e) => handleChange('occupation', e.target.value)}
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Designation / Job Title</Label>
                      <Input value={formData.jobTitle || ''} onChange={(e) => handleChange('jobTitle', e.target.value)}
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Company Name</Label>
                      <Input value={formData.companyName || ''} onChange={(e) => handleChange('companyName', e.target.value)}
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Industry</Label>
                      <Input value={formData.industry || ''} onChange={(e) => handleChange('industry', e.target.value)}
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Monthly Income Range</Label>
                      <select value={formData.monthlyIncome || ''} onChange={(e) => handleChange('monthlyIncome', e.target.value)}
                        className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:ring-[#c8851e]">
                        <option value="" className="bg-[#141410]">Select Range</option>
                        <option value="Below 50K" className="bg-[#141410]">Below ₹50,000</option>
                        <option value="50K - 1L" className="bg-[#141410]">₹50,000 - ₹1,00,000</option>
                        <option value="1L - 3L" className="bg-[#141410]">₹1,00,000 - ₹3,00,000</option>
                        <option value="Above 3L" className="bg-[#141410]">Above ₹3,00,000</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">PAN Number</Label>
                      <Input value={formData.panNumber || ''} onChange={(e) => handleChange('panNumber', e.target.value)}
                        className="bg-white/5 border-white/10 text-white uppercase focus-visible:ring-[#c8851e]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">GST Number (Optional)</Label>
                      <Input value={formData.gstNumber || ''} onChange={(e) => handleChange('gstNumber', e.target.value)}
                        className="bg-white/5 border-white/10 text-white uppercase focus-visible:ring-[#c8851e]" />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 5 - Investment Profile */}
              {activeSection === 5 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#c8851e]" />
                      Investment Profile
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Investment Interest</Label>
                      <Input value={formData.investmentInterest || ''} onChange={(e) => handleChange('investmentInterest', e.target.value)}
                        placeholder="e.g. Sandalwood, Timber, Farmland"
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Budget Range</Label>
                      <select value={formData.budgetRange || ''} onChange={(e) => handleChange('budgetRange', e.target.value)}
                        className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:ring-[#c8851e]">
                        <option value="" className="bg-[#141410]">Select Budget</option>
                        <option value="0 - 1L" className="bg-[#141410]">₹0 – ₹1 Lakh</option>
                        <option value="1L - 5L" className="bg-[#141410]">₹1 – ₹5 Lakhs</option>
                        <option value="5L - 10L" className="bg-[#141410]">₹5 – ₹10 Lakhs</option>
                        <option value="10L - 25L" className="bg-[#141410]">₹10 – ₹25 Lakhs</option>
                        <option value="25L - 50L" className="bg-[#141410]">₹25 – ₹50 Lakhs</option>
                        <option value="50L - 1Cr" className="bg-[#141410]">₹50 Lakhs – ₹1 Crore</option>
                        <option value="1Cr - 5Cr" className="bg-[#141410]">₹1 Crore – ₹5 Crores</option>
                        <option value="Above 5Cr" className="bg-[#141410]">₹5+ Crores</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Investment Source</Label>
                      <Input value={formData.investmentSource || ''} onChange={(e) => handleChange('investmentSource', e.target.value)}
                        placeholder="e.g. Salary, Business, Loan"
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Risk Preference</Label>
                      <select value={formData.riskPreference || ''} onChange={(e) => handleChange('riskPreference', e.target.value)}
                        className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:ring-[#c8851e]">
                        <option value="" className="bg-[#141410]">Select Profile</option>
                        <option value="Conservative" className="bg-[#141410]">Conservative</option>
                        <option value="Moderate" className="bg-[#141410]">Moderate</option>
                        <option value="Aggressive" className="bg-[#141410]">Aggressive</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Preferred Holding Period</Label>
                      <Input value={formData.holdingPeriod || ''} onChange={(e) => handleChange('holdingPeriod', e.target.value)}
                        placeholder="e.g. 5-7 Years"
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Lead Source</Label>
                      <Input value={formData.leadSource || ''} onChange={(e) => handleChange('leadSource', e.target.value)}
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 6 - Land / Plot Allocation */}
              {activeSection === 6 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <Map className="w-5 h-5 text-[#c8851e]" />
                      Land / Plot Allocation Details
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Passbook Number</Label>
                      <Input value={formData.passbookNumber || ''} onChange={(e) => handleChange('passbookNumber', e.target.value)}
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Plot Configuration</Label>
                      <select value={formData.plotConfiguration || ''} onChange={(e) => handleChange('plotConfiguration', e.target.value)}
                        className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:ring-[#c8851e]">
                        <option value="" className="bg-[#141410]">Select Acreage</option>
                        <option value="0.25 Acre" className="bg-[#141410]">0.25 Acre</option>
                        <option value="0.50 Acre" className="bg-[#141410]">0.50 Acre</option>
                        <option value="1 Acre" className="bg-[#141410]">1 Acre</option>
                        <option value="2 Acres" className="bg-[#141410]">2 Acres</option>
                        <option value="5 Acres" className="bg-[#141410]">5 Acres</option>
                        <option value="Cents" className="bg-[#141410]">Cents</option>
                        <option value="Custom" className="bg-[#141410]">Custom</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 space-y-4">
                      <Label className="text-white/70 text-xs block">Plot Photos (Exactly 4 Required)</Label>
                      
                      {(formData.plotPhotosUrls?.length || 0) < 4 && (
                        <div className="flex flex-col md:flex-row gap-3">
                          <label className="flex-1 h-12 flex items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                            <Upload className="w-4 h-4 text-white/70" />
                            <span className="text-sm text-white/90">Upload From Browser</span>
                            <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handlePlotPhotos} />
                          </label>
                          <Button type="button" onClick={openCamera} className="flex-1 h-12 flex items-center justify-center gap-2 rounded-lg border border-dashed border-[#c8851e]/50 bg-[#c8851e]/5 hover:bg-[#c8851e]/10 text-[#c8851e] transition-colors">
                            <Camera className="w-4 h-4" />
                            <span>Capture From Camera</span>
                          </Button>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(formData.plotPhotosUrls || []).map((url:string, i:number) => {
                          const source = formData.plotPhotosSources?.[i] || 'Uploaded';
                          return (
                          <div key={i} className="flex items-start gap-3 p-3 bg-[#141410]/50 border border-white/10 rounded-lg">
                            <div className="w-20 h-20 shrink-0 rounded-md overflow-hidden bg-white/5 cursor-pointer" onClick={() => setPreviewData({url, isPdf: false})}>
                              <img src={url} alt={`Plot ${i+1}`} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white">Photo {i+1}</p>
                              <p className="text-xs text-white/50 mt-1">{source} Photo</p>
                              <div className="flex flex-wrap items-center gap-3 mt-3">
                                <button type="button" onClick={() => setPreviewData({url, isPdf: false})} className="text-xs text-[#c8851e] hover:text-[#a96618] flex items-center gap-1"><Eye className="w-3 h-3" /> View</button>
                                <label className="text-xs text-[#c8851e] hover:text-[#a96618] flex items-center gap-1 cursor-pointer">
                                  <Upload className="w-3 h-3" /> Replace
                                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => {
                                    if(e.target.files && e.target.files[0]) {
                                      const file = e.target.files[0];
                                      const newUrl = URL.createObjectURL(file);
                                      setFormData((prev:any) => {
                                        const newFiles = [...(prev.plotPhotosFiles||[])];
                                        const newUrls = [...(prev.plotPhotosUrls||[])];
                                        const newSources = [...(prev.plotPhotosSources||[])];
                                        newFiles[i] = file;
                                        newUrls[i] = newUrl;
                                        newSources[i] = 'Uploaded';
                                        return {...prev, plotPhotosFiles: newFiles, plotPhotosUrls: newUrls, plotPhotosSources: newSources};
                                      });
                                    }
                                  }} />
                                </label>
                                <button type="button" onClick={() => removePlotPhoto(i)} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"><Trash2 className="w-3 h-3" /> Remove</button>
                              </div>
                            </div>
                          </div>
                        )})}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 7 - Payment Details */}
              {activeSection === 7 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#c8851e]" />
                      Payment Details
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Total Investment Amount (₹)</Label>
                      <Input type="number" value={formData.totalInvestment || ''} onChange={(e) => handleChange('totalInvestment', e.target.value)}
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Paid Amount (₹)</Label>
                      <Input type="number" value={formData.paidAmount || ''} onChange={(e) => handleChange('paidAmount', e.target.value)}
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Remaining Amount (₹)</Label>
                      <Input readOnly value={formData.remainingAmount || 0}
                        className="bg-white/10 border-white/10 text-white/50 cursor-not-allowed" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Payment Status</Label>
                      <Input readOnly value={formData.paymentStatus || 'Not Paid'}
                        className="bg-white/10 border-white/10 text-white/50 font-medium cursor-not-allowed" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Payment Mode</Label>
                      <select value={formData.paymentMode || ''} onChange={(e) => handleChange('paymentMode', e.target.value)}
                        className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:ring-[#c8851e]">
                        <option value="" className="bg-[#141410]">Select Mode</option>
                        <option value="Bank Transfer" className="bg-[#141410]">Bank Transfer</option>
                        <option value="Cheque" className="bg-[#141410]">Cheque</option>
                        <option value="UPI" className="bg-[#141410]">UPI</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 mt-4 animate-in fade-in zoom-in-95 duration-300">
                      <DocumentUploader title="Payment Receipt Proof Upload" fieldName="paymentProof" formData={formData} setFormData={setFormData} setPreviewData={setPreviewData} />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 8 - Document Management */}
              {activeSection === 8 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#c8851e]" />
                      Document Management
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 mb-2">
                       <div className="space-y-1.5">
                         <Label className="text-white/70 text-xs">Aadhaar Number</Label>
                         <Input value={formData.aadhaarNumber || ''} onChange={(e) => handleChange('aadhaarNumber', e.target.value)}
                           className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                       </div>
                    </div>

                    <DocumentUploader title="Aadhaar Upload" fieldName="aadhaar" formData={formData} setFormData={setFormData} setPreviewData={setPreviewData} />
                    <DocumentUploader title="PAN Upload" fieldName="pan" formData={formData} setFormData={setFormData} setPreviewData={setPreviewData} />
                    
                    <div className="col-span-1 md:col-span-2 bg-white/5 p-5 rounded-xl border border-white/10 space-y-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h4 className="text-white font-medium">Passbook Upload</h4>
                          <p className="text-white/50 text-xs mt-1">Upload the front page of the passbook</p>
                        </div>
                        <div className="w-full md:w-48">
                          <Label className="text-white/70 text-xs">Verification Status</Label>
                          <select value={formData.passbookVerificationStatus || 'Pending'} onChange={(e) => handleChange('passbookVerificationStatus', e.target.value)}
                            className="w-full h-10 px-3 rounded-md bg-[#141410] border border-white/10 text-white text-sm focus:ring-[#c8851e]">
                            <option value="Pending" className="bg-[#141410]">Pending</option>
                            <option value="Verified" className="bg-[#141410]">Verified</option>
                            <option value="Rejected" className="bg-[#141410]">Rejected</option>
                          </select>
                        </div>
                      </div>
                      <DocumentUploader title="Passbook Front Page" fieldName="passbookPhoto" formData={formData} setFormData={setFormData} setPreviewData={setPreviewData} />
                    </div>

                    <DocumentUploader title="Agreement Upload" fieldName="agreement" formData={formData} setFormData={setFormData} setPreviewData={setPreviewData} />
                    <DocumentUploader title="Land Document Upload" fieldName="landDocument" formData={formData} setFormData={setFormData} setPreviewData={setPreviewData} />
                  </div>
                </div>
              )}

              {/* SECTION 9 - Nominee Details */}
              {activeSection === 9 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#c8851e]" />
                      Nominee Details
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Nominee Name</Label>
                      <Input value={formData.nomineeName || ''} onChange={(e) => handleChange('nomineeName', e.target.value)}
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Relationship</Label>
                      <Input value={formData.nomineeRelation || ''} onChange={(e) => handleChange('nomineeRelation', e.target.value)}
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Mobile Number</Label>
                      <Input value={formData.nomineePhone || ''} onChange={(e) => handleChange('nomineePhone', e.target.value)}
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Email</Label>
                      <Input type="email" value={formData.nomineeEmail || ''} onChange={(e) => handleChange('nomineeEmail', e.target.value)}
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-[#c8851e]" />
                    </div>
                    
                    <div className="md:col-span-2 mt-4">
                      <DocumentUploader title="Government ID Proof *" fieldName="nomineeDocument" formData={formData} setFormData={setFormData} setPreviewData={setPreviewData} />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 10 - Communication Settings */}
              {activeSection === 10 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <Bell className="w-5 h-5 text-[#c8851e]" />
                      Communication Settings
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { key: 'sendWelcomeEmail', label: 'Send Welcome Email' },
                      { key: 'sendWhatsapp', label: 'Send WhatsApp Welcome Message' },
                      { key: 'sendSms', label: 'Send SMS Welcome Message' },
                      { key: 'monthlyUpdates', label: 'Enable Plantation Updates (Monthly)' },
                      { key: 'paymentReminders', label: 'Enable Payment Reminders' },
                      { key: 'documentUpdates', label: 'Enable Document Updates' },
                    ].map((pref) => (
                      <div key={pref.key} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                        <Label className="text-white text-sm cursor-pointer">{pref.label}</Label>
                        <div 
                          onClick={() => handleToggle(pref.key)}
                          className={`w-11 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${formData[pref.key] ? 'bg-[#c8851e]' : 'bg-white/20'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${formData[pref.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 11 - Dashboard Access */}
              {activeSection === 11 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <Key className="w-5 h-5 text-[#c8851e]" />
                      Investor Dashboard Access
                    </h3>
                  </div>
                  
                  <div className="p-6 border border-white/10 rounded-xl bg-[#c8851e]/5 text-center space-y-4">
                    <p className="text-white/80">
                      Create an investor portal account to allow this investor to track their plots, payments, and documents online.
                    </p>
                    <p className="text-xs text-white/50 mb-4">
                      A temporary password will be automatically generated and sent to their WhatsApp/Email upon saving.
                    </p>
                    {formData.generatedUsername ? (
                      <div className="bg-[#141410] border border-white/20 rounded-lg p-4 text-left space-y-3">
                        <p className="text-sm font-medium text-white/80 border-b border-white/10 pb-2">Generated Credentials</p>
                        <div>
                          <Label className="text-xs text-white/50">Username</Label>
                          <p className="text-white font-mono">{formData.generatedUsername}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-white/50">Temporary Password</Label>
                          <p className="text-white font-mono">{formData.generatedPassword}</p>
                        </div>
                        <Button type="button" size="sm" onClick={() => setFormData((p:any) => ({...p, generatedUsername: null, generatedPassword: null}))} className="w-full mt-2 border border-red-500/30 bg-transparent text-red-400 hover:bg-red-500/10 transition-colors">Clear Credentials</Button>
                      </div>
                    ) : (
                      <Button type="button" onClick={generateCredentials} className="border border-[#c8851e]/30 bg-transparent text-[#c8851e] hover:bg-[#c8851e]/10 transition-colors">
                        Generate Credentials Now
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION 12 - Internal Admin Details */}
              {activeSection === 12 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <Settings className="w-5 h-5 text-[#c8851e]" />
                      Internal Admin Details
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Profile Status</Label>
                      <select value={formData.status || ''} onChange={(e) => handleChange('status', e.target.value)}
                        className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:ring-[#c8851e]">
                        <option value="ACTIVE" className="bg-[#141410]">Active</option>
                        <option value="PENDING" className="bg-[#141410]">Pending</option>
                        <option value="INACTIVE" className="bg-[#141410]">Inactive</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-white/70 text-xs">Priority Level</Label>
                      <select value={formData.priority || ''} onChange={(e) => handleChange('priority', e.target.value)}
                        className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:ring-[#c8851e]">
                        <option value="" className="bg-[#141410]">Select Priority</option>
                        <option value="High" className="bg-[#141410]">High</option>
                        <option value="Medium" className="bg-[#141410]">Medium</option>
                        <option value="Low" className="bg-[#141410]">Low</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label className="text-white/70 text-xs">Internal Notes</Label>
                      <textarea value={formData.notes || ''} onChange={(e) => handleChange('notes', e.target.value)}
                        rows={4} className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e]" />
                    </div>
                  </div>
                </div>
              )}
              </fieldset>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10 bg-[#141410] flex items-center justify-between">
          <Button variant="ghost" onClick={onClose} className="text-white/60 hover:bg-white/5">
            Cancel
          </Button>
          
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 gap-2">
              <Save className="w-4 h-4" /> Save Draft
            </Button>
            
            <div className="flex items-center gap-2 ml-4">
              <Button 
                type="button"
                onClick={handlePrev} 
                disabled={activeSection === 1}
                className="bg-white/10 hover:bg-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              
              {activeSection < SECTIONS.length ? (
                <Button 
                  onClick={handleNext}
                  className="bg-white/10 hover:bg-white/20 text-white"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : isViewMode ? (
                <Button 
                  onClick={onClose}
                  className="bg-[#c8851e] hover:bg-[#a96618] text-white shadow-lg shadow-[#c8851e]/20 sticky bottom-5 right-5"
                >
                  Close
                </Button>
              ) : (
                <Button 
                  onClick={validateAndSave}
                  disabled={loading}
                  className="bg-[#c8851e] hover:bg-[#a96618] text-white shadow-lg shadow-[#c8851e]/20 sticky bottom-5 right-5"
                >
                  {initialData ? (loading ? 'Updating...' : 'Update Investor') : (loading ? 'Saving...' : 'Create Investor')}
                </Button>
              )}
            </div>
          </div>
        </div>
        {/* Preview Modal */}
        {previewData && (
          <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl h-[80vh] bg-[#141410] border border-white/10 rounded-xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                <h3 className="text-white font-medium">Document Preview</h3>
                <button onClick={() => { setPreviewData(null); setPreviewError(false); }} className="text-white/60 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-auto bg-black/50 flex items-center justify-center p-4">
                {previewError ? (
                  <div className="flex flex-col items-center justify-center p-10">
                    <FileIcon className="w-16 h-16 text-white/30 mb-4" />
                    <p className="text-white font-medium text-lg mb-2">Preview not available.</p>
                    <p className="text-[#FF5252] text-sm font-medium mb-1">This document was uploaded with an old format. Please re-upload it.</p>
                    <p className="text-white/60 text-sm mb-6">Or try downloading the file to view it locally.</p>
                    <a href={previewData.url} download target="_blank" rel="noopener noreferrer" className="bg-[#c8851e] text-white px-6 py-2 rounded hover:bg-[#a96618] transition flex items-center gap-2">
                      <Download className="w-4 h-4" /> Download File
                    </a>
                  </div>
                ) : previewData.isPdf ? (
                  <iframe 
                    src={previewData.url} 
                    className="w-full h-full rounded-lg bg-white" 
                    frameBorder="0"
                    onError={() => { console.error("Document preview failed"); setPreviewError(true); }}
                  />
                ) : (
                  <img 
                    src={previewData.url} 
                    alt="Preview" 
                    className="max-w-full max-h-full object-contain rounded-lg" 
                    onError={() => { console.error("Document preview failed"); setPreviewError(true); }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
        {/* Camera Modal */}
        {cameraModalOpen && (
          <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-[#141410] border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                <h3 className="text-white font-medium flex items-center gap-2"><Camera className="w-5 h-5 text-[#c8851e]" /> Capture Plot Photo</h3>
                <button type="button" onClick={closeCamera} className="text-white/60 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 flex-1 flex flex-col items-center justify-center min-h-[400px]">
                {cameraError ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
                      <Camera className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-red-400 font-medium">{cameraError}</p>
                    <Button type="button" onClick={closeCamera} className="border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-colors">Close Camera</Button>
                  </div>
                ) : capturedPhotoUrl ? (
                  <div className="w-full space-y-4">
                    <img src={capturedPhotoUrl} alt="Captured" className="w-full h-auto max-h-[60vh] object-contain rounded-lg border border-white/10" />
                    <div className="flex items-center gap-3 justify-center">
                      <Button type="button" onClick={retakePhoto} className="border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-colors">Retake Photo</Button>
                      <Button type="button" onClick={saveCapturedPhoto} className="bg-[#c8851e] hover:bg-[#a96618] text-white border-0">Save Photo</Button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full space-y-4">
                    <div className="relative w-full rounded-lg overflow-hidden border border-white/10 bg-black aspect-video flex items-center justify-center">
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                    <div className="flex justify-center">
                      <Button type="button" onClick={capturePhoto} className="bg-[#c8851e] hover:bg-[#a96618] text-white gap-2 border-0">
                        <Camera className="w-4 h-4" /> Capture Photo
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
