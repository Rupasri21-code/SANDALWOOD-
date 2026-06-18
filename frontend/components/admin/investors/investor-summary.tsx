import React, { useRef, useState } from 'react';
import { Download, X, User, Phone, MapPin, Briefcase, TrendingUp, Map, CreditCard, FileText, Users, Bell, Printer, Settings, Key, CheckCircle2, File as FileIcon, Maximize2, Sprout, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WhatsAppDocPreview = ({ url, title, fileType, fileSize = '225 KB', onOpen }: any) => {
  if (!url) {
    return (
      <div className="bg-[#E8F5E9] rounded-xl overflow-hidden shadow-sm flex flex-col h-full border border-[#C8E6C9] opacity-70">
        <div className="h-32 bg-white/50 w-full flex items-center justify-center border-b border-black/5 px-4 text-center">
          <p className="text-sm text-gray-500 font-medium">File URL not available.<br/>Please re-upload this document.</p>
        </div>
        <div className="p-3 bg-[#E8F5E9] flex-1 flex flex-col justify-between">
          <div className="flex items-start gap-3 mb-2">
            <div className="bg-gray-400 text-white rounded flex items-center justify-center shrink-0 w-8 h-8 mt-0.5">
              <span className="text-[10px] font-bold">N/A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#111b21] text-sm font-semibold leading-tight truncate">{title}</p>
              <p className="text-[#667781] text-xs mt-1">Not Uploaded</p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-black/5">
            <button disabled className="text-gray-400 font-medium text-sm cursor-not-allowed">OPEN</button>
            <button disabled className="text-gray-400 font-medium text-sm cursor-not-allowed flex items-center gap-1">DOWNLOAD</button>
          </div>
        </div>
      </div>
    );
  }

  const lowerUrl = url.toLowerCase();
  const detectedIsPdf = lowerUrl.endsWith('.pdf') || fileType === 'PDF';
  const displayType = detectedIsPdf ? 'PDF' : 'IMG';

  let previewUrl = url;
  if (detectedIsPdf && url.includes('/image/upload/')) {
    previewUrl = url.replace('/image/upload/', '/raw/upload/');
  }

  return (
    <div className="bg-[#E8F5E9] rounded-xl overflow-hidden shadow-sm flex flex-col h-full border border-[#C8E6C9] hover:shadow-md transition-shadow">
      {/* Thumbnail area */}
      <div className="h-32 bg-white/50 w-full flex items-center justify-center overflow-hidden border-b border-black/5 relative cursor-pointer group" onClick={() => onOpen(previewUrl, detectedIsPdf, title, url)}>
        {detectedIsPdf ? (
          <div className="text-red-500/80 flex items-center justify-center flex-col">
            <FileIcon className="w-12 h-12 mb-1" />
            <span className="text-[10px] font-bold tracking-wider">PDF DOCUMENT</span>
          </div>
        ) : (
          <img src={url} alt={title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 drop-shadow-md transition-opacity" />
        </div>
      </div>
      
      {/* WhatsApp card body */}
      <div className="p-3 bg-[#E8F5E9] flex-1 flex flex-col justify-between">
        <div className="flex items-start gap-3 mb-2">
          <div className="bg-[#FF5252] text-white rounded flex items-center justify-center shrink-0 w-8 h-8 mt-0.5">
            <span className="text-[10px] font-bold">{displayType}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#111b21] text-sm font-semibold leading-tight truncate">{title}</p>
            <p className="text-[#667781] text-xs mt-1">{displayType} • {fileSize}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-black/5">
          <button onClick={() => onOpen(previewUrl, detectedIsPdf, title, url)} className="text-[#008069] font-medium text-sm hover:underline">
            OPEN
          </button>
          <a href={previewUrl} download={title} target="_blank" rel="noopener noreferrer" className="text-[#008069] font-medium text-sm hover:underline flex items-center gap-1">
             DOWNLOAD
          </a>
        </div>
      </div>
    </div>
  );
};

export function InvestorSummary({ formData, onClose, onEdit }: { formData: any, onClose: () => void, onEdit?: () => void }) {
  const printRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<{url: string, isPdf: boolean, title: string, downloadUrl?: string} | null>(null);
  const [previewError, setPreviewError] = useState(false);

  const handleOpenDocument = (url: string, isPdf: boolean, title: string, downloadUrl?: string) => {
    try {
      if (!url) throw new Error("File URL not available");
      setPreview({ url, isPdf, title, downloadUrl: downloadUrl || url });
      setPreviewError(false);
    } catch (err) {
      console.error("Document preview failed", err);
      // Fallback is handled by the missing URL UI now, but we catch it just in case
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const Section = ({ title, icon: Icon, children }: any) => (
    <div className="mb-8 bg-[#1A1A15] border border-white/10 rounded-xl overflow-hidden print:border-gray-300 print:bg-white print:text-black print:break-inside-avoid">
      <div className="bg-white/5 px-6 py-4 flex items-center gap-3 border-b border-white/10 print:bg-gray-100 print:border-gray-300">
        <Icon className="w-5 h-5 text-[#c8851e] print:text-black" />
        <h3 className="text-lg font-semibold text-white print:text-black">{title}</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
          {children}
        </div>
      </div>
    </div>
  );

  const Field = ({ label, value }: { label: string, value: any }) => (
    <div className="space-y-1.5">
      <p className="text-xs text-white/40 print:text-gray-500 uppercase tracking-wider font-medium">{label}</p>
      <p className="text-sm font-medium text-white/90 print:text-black break-words">{value || '—'}</p>
    </div>
  );

  const BooleanField = ({ label, value }: { label: string, value: boolean }) => (
    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${value ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'}`}>
        {value && <CheckCircle2 className="w-4 h-4" />}
      </div>
      <span className="text-sm text-white/80">{label}</span>
    </div>
  );

  return (
    <>
      <div className="flex flex-col h-full print:h-auto print:static print:block print:w-full print:overflow-visible bg-[#141410] print:bg-white overflow-hidden w-full max-w-6xl mx-auto border-l border-white/10 shadow-2xl animate-in slide-in-from-right">
        {/* Header (Hidden in Print) */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5 print:hidden shrink-0">
          <div>
            <h2 className="text-2xl font-display font-semibold text-white">Investor Profile Details</h2>
            <p className="text-sm text-white/50 mt-1">Complete investor onboarding information and uploaded documents.</p>
          </div>
          <div className="flex items-center gap-3">
            {onEdit && (
              <Button onClick={onEdit} className="bg-white/10 hover:bg-white/20 text-white">
                Edit Investor
              </Button>
            )}
            <Button onClick={handlePrint} className="bg-[#c8851e] hover:bg-[#a96618] text-white gap-2">
              <Download className="w-4 h-4" /> Download Profile PDF
            </Button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div id="printable-profile-record" className="flex-1 overflow-y-auto p-8 custom-scrollbar print:p-0 print:overflow-visible" ref={printRef}>
          
          {/* Print Header */}
          <div className="hidden print:block mb-8 text-center border-b border-gray-300 pb-6">
            <h1 className="text-3xl font-bold text-black mb-2">Chandan Nilayam</h1>
            <h2 className="text-xl font-medium text-gray-700">Investor Profile Record</h2>
          </div>

          <Section title="1. Personal Information" icon={User}>
            <Field label="First Name" value={formData.firstName} />
            <Field label="Middle Name" value={formData.middleName} />
            <Field label="Last Name" value={formData.lastName} />
            <Field label="Gender" value={formData.gender} />
            <Field label="Date of Birth" value={formData.dob ? new Date(formData.dob).toLocaleDateString() : ''} />
            <Field label="Age" value={formData.age} />
            <Field label="Marital Status" value={formData.maritalStatus} />
            <Field label="Father's Name" value={formData.fatherName} />
            <Field label="Spouse's Name" value={formData.spouseName} />
            <Field label="Investor Type" value={formData.investorType} />
          </Section>

          <Section title="2. Contact Information" icon={Phone}>
            <Field label="Primary Mobile" value={formData.phone} />
            <Field label="Alternate Mobile" value={formData.altPhone} />
            <Field label="WhatsApp Number" value={formData.whatsappNumber} />
            <Field label="Email Address" value={formData.email} />
            <Field label="Alternate Email" value={formData.altEmail} />
            <Field label="Preferred Contact" value={formData.prefCommunication} />
            <Field label="Best Time to Contact" value={formData.bestTimeToContact} />
          </Section>

          <Section title="3. Address Information" icon={MapPin}>
            <div className="col-span-full border-b border-white/5 pb-2 mb-2">
              <h4 className="text-white/80 font-medium">Permanent Address</h4>
            </div>
            <Field label="Address Line 1" value={formData.permanentAddressLine1} />
            <Field label="Village/Town" value={formData.permanentVillage} />
            <Field label="District/City" value={formData.permanentDistrict} />
            <Field label="State" value={formData.permanentState} />
            <Field label="Country" value={formData.permanentCountry} />
            <Field label="Pincode" value={formData.permanentPincode} />

            <div className="col-span-full border-b border-white/5 pb-2 mb-2 mt-4">
              <h4 className="text-white/80 font-medium">Current Address</h4>
            </div>
            {formData.sameAsPermanent ? (
              <div className="col-span-full"><p className="text-white/50 text-sm">Same as Permanent Address</p></div>
            ) : (
              <>
                <Field label="Address Line 1" value={formData.currentAddressLine1} />
                <Field label="Village/Town" value={formData.currentVillage} />
                <Field label="District/City" value={formData.currentDistrict} />
                <Field label="State" value={formData.currentState} />
                <Field label="Country" value={formData.currentCountry} />
                <Field label="Pincode" value={formData.currentPincode} />
              </>
            )}
          </Section>

          <Section title="4. Professional Details" icon={Briefcase}>
            <Field label="Occupation" value={formData.occupation} />
            <Field label="Company Name" value={formData.companyName} />
            <Field label="Company Type" value={formData.companyType} />
            <Field label="Job Title" value={formData.jobTitle} />
            <Field label="Industry" value={formData.industry} />
            <Field label="Work Experience" value={formData.workExperience} />
            <Field label="Monthly Income" value={formData.monthlyIncome} />
            <Field label="Annual Income" value={formData.annualIncome} />
            <Field label="PAN Number" value={formData.panNumber} />
            <Field label="Company Address" value={formData.companyAddress} />
          </Section>

          <Section title="5. Investment Profile" icon={TrendingUp}>
            <Field label="Investment Interest" value={formData.investmentInterest} />
            <Field label="Budget Range" value={formData.budgetRange} />
            <Field label="Investment Purpose" value={formData.investmentPurpose} />
            <Field label="Investment Source" value={formData.investmentSource} />
            <Field label="Holding Period" value={formData.holdingPeriod} />
            <Field label="Risk Preference" value={formData.riskPreference} />
            <Field label="Lead Source" value={formData.leadSource} />
            <Field label="Assigned Advisor" value={formData.assignedAdvisor} />
            <div className="col-span-full">
              <Field label="Expected Return Notes" value={formData.expectedReturnNotes} />
            </div>
          </Section>

          <Section title="6. Land Plots & Crops" icon={Map}>
            {formData.landPlots && formData.landPlots.length > 0 ? (
              <div className="col-span-full space-y-6">
                {formData.landPlots.map((plot: any, idx: number) => (
                  <div key={idx} className="bg-white/5 p-5 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                      <h4 className="text-white font-medium text-base">{plot.title || `Plot ${plot.passbook_number}`}</h4>
                      <span className="text-xs px-2.5 py-1 bg-green-500/20 text-green-400 rounded-full font-medium">{plot.status}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-2">
                      <Field label="Passbook Number" value={plot.passbook_number} />
                      <Field label="Total Area" value={`${plot.total_area} acres`} />
                      <Field label="Location" value={`${plot.location}, ${plot.district}`} />
                      <Field label="Configuration" value={plot.plot_configuration} />
                    </div>
                    
                    {plot.crops && plot.crops.length > 0 && (
                      <div className="mt-5 pt-5 border-t border-white/10">
                        <h5 className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2"><Sprout className="w-4 h-4 text-[#22C55E]" /> Associated Crops</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {plot.crops.map((crop: any, cIdx: number) => (
                            <div key={cIdx} className="flex items-center justify-between bg-black/20 p-4 rounded-lg border border-white/5">
                              <div>
                                <p className="text-sm font-medium text-white">{crop.name} ({crop.variety})</p>
                                <p className="text-xs text-white/50 mt-1">{crop.total_plants} plants • Planted: {crop.planted_date ? new Date(crop.planted_date).toLocaleDateString() : 'N/A'}</p>
                              </div>
                              <div className="flex gap-4">
                                <div className="text-right">
                                  <p className="text-[10px] text-white/40 uppercase">Stage</p>
                                  <p className="text-xs font-medium text-[#c8851e] mt-0.5">{crop.growth_stage}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] text-white/40 uppercase">Health</p>
                                  <p className="text-xs font-medium text-[#22C55E] mt-0.5">{crop.health_status}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="col-span-full">
                <p className="text-white/50 text-sm">No land plots allocated yet.</p>
              </div>
            )}
          </Section>

          <Section title="7. Financials & Payments" icon={CreditCard}>
            <div className="col-span-full mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-xs text-white/50 uppercase">Total Expected</p>
                <p className="text-xl font-semibold text-white mt-1">
                  ₹{formData.investments?.reduce((sum: number, inv: any) => sum + (Number(inv.total_amount) || 0), 0).toLocaleString() || '0'}
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-xs text-white/50 uppercase">Total Paid</p>
                <p className="text-xl font-semibold text-[#22C55E] mt-1">
                  ₹{formData.payments?.filter((p:any) => p.payment_status === 'COMPLETED').reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0).toLocaleString() || '0'}
                </p>
              </div>
            </div>

            {formData.payments && formData.payments.length > 0 ? (
              <div className="col-span-full overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-white/5 text-white/60">
                    <tr>
                      <th className="px-4 py-3 font-medium rounded-l-lg border-y border-l border-white/10">Date</th>
                      <th className="px-4 py-3 font-medium border-y border-white/10">Amount</th>
                      <th className="px-4 py-3 font-medium border-y border-white/10">Type</th>
                      <th className="px-4 py-3 font-medium border-y border-white/10">Mode</th>
                      <th className="px-4 py-3 font-medium rounded-r-lg border-y border-r border-white/10">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {formData.payments.map((p: any, idx: number) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-white/80">{p.payment_date ? new Date(p.payment_date).toLocaleDateString() : '—'}</td>
                        <td className="px-4 py-3 font-medium text-white">₹{Number(p.amount).toLocaleString()}</td>
                        <td className="px-4 py-3 text-white/60 capitalize">{p.payment_type?.replace('_', ' ') || '—'}</td>
                        <td className="px-4 py-3 text-white/60">{p.payment_mode || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${p.payment_status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {p.payment_status || '—'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="col-span-full">
                <p className="text-white/50 text-sm">No payment history found.</p>
              </div>
            )}
          </Section>

          {/* Section 8: Document Management with WhatsApp Previews */}
          <div className="mb-8 bg-[#1A1A15] border border-white/10 rounded-xl overflow-hidden print:border-gray-300 print:bg-white print:text-black">
            <div className="bg-white/5 px-6 py-4 flex items-center gap-3 border-b border-white/10">
              <FileText className="w-5 h-5 text-[#c8851e]" />
              <h3 className="text-lg font-semibold text-white">8. Document Management</h3>
            </div>
            <div className="p-6 space-y-8">
              
              <div>
                <h4 className="text-white/80 font-medium mb-4 pb-2 border-b border-white/5">KYC Documents</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <WhatsAppDocPreview url={formData.aadhaarUrl} title="Aadhaar_Card.pdf" fileType="PDF" fileSize="450 KB" onOpen={handleOpenDocument} />
                  <WhatsAppDocPreview url={formData.panUrl} title="PAN_Card.pdf" fileType="PDF" fileSize="320 KB" onOpen={handleOpenDocument} />
                </div>
              </div>

              <div>
                <h4 className="text-white/80 font-medium mb-4 pb-2 border-b border-white/5">Bank Documents</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <WhatsAppDocPreview url={formData.passbookPhotoUrl} title="Bank_Passbook.jpg" fileType="IMAGE" fileSize="1.2 MB" onOpen={handleOpenDocument} />
                </div>
              </div>

              <div>
                <h4 className="text-white/80 font-medium mb-4 pb-2 border-b border-white/5">Investment Documents</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <WhatsAppDocPreview url={formData.agreementUrl} title="Investment_Agreement.pdf" fileType="PDF" fileSize="890 KB" onOpen={handleOpenDocument} />
                  <WhatsAppDocPreview url={formData.landDocumentUrl} title="Land_Document.pdf" fileType="PDF" fileSize="2.1 MB" onOpen={handleOpenDocument} />
                  <WhatsAppDocPreview url={formData.paymentProofUrl} title="Payment_Receipt.jpg" fileType="IMAGE" fileSize="500 KB" onOpen={handleOpenDocument} />
                </div>
              </div>

              <div>
                <h4 className="text-white/80 font-medium mb-4 pb-2 border-b border-white/5">Plot Documents & Photos</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {formData.plotPhotosUrls && formData.plotPhotosUrls.length > 0 ? (
                    formData.plotPhotosUrls.map((url: string, i: number) => (
                      <WhatsAppDocPreview key={i} url={url} title={`Plot_Photo_${i+1}.jpg`} fileType="IMAGE" fileSize="1.8 MB" onOpen={handleOpenDocument} />
                    ))
                  ) : (
                    <div className="col-span-full"><p className="text-white/40 text-sm">No plot photos uploaded.</p></div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Section 9: Media & Updates */}
          <Section title="9. Media Library & Updates" icon={ImageIcon}>
             {formData.media && formData.media.length > 0 ? (
                <div className="col-span-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {formData.media.map((m: any, idx: number) => (
                    <div key={idx} className="bg-[#141410] rounded-xl border border-white/10 overflow-hidden flex flex-col group hover:border-white/20 transition-all">
                      <div className="aspect-video bg-black/60 relative">
                        {m.media_url?.includes('.pdf') ? (
                           <div className="w-full h-full flex items-center justify-center"><FileText className="w-8 h-8 text-white/30" /></div>
                        ) : (
                           <img src={m.media_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={m.title} />
                        )}
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white/80 capitalize">
                          {m.media_type?.replace('_', ' ') || '—'}
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <p className="text-white text-sm font-medium line-clamp-1" title={m.title}>{m.title}</p>
                        <p className="text-white/50 text-xs mt-1">{m.upload_date ? new Date(m.upload_date).toLocaleDateString() : '—'}</p>
                        {m.description && (
                          <p className="text-white/60 text-xs mt-2 line-clamp-2">{m.description}</p>
                        )}
                        <div className="mt-auto pt-3">
                          <a href={m.media_url} target="_blank" rel="noreferrer" className="text-[#c8851e] text-xs hover:text-[#e9be55] transition-colors font-medium flex items-center gap-1">View Full File <Maximize2 className="w-3 h-3" /></a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
             ) : (
                <div className="col-span-full">
                  <p className="text-white/50 text-sm">No media updates available yet.</p>
                </div>
             )}
          </Section>

          <Section title="10. Nominee Details" icon={Users}>
            <Field label="Nominee Name" value={formData.nomineeName} />
            <Field label="Relationship" value={formData.nomineeRelation} />
            <Field label="Nominee Phone" value={formData.nomineePhone} />
            <Field label="Nominee Email" value={formData.nomineeEmail} />
            <Field label="Nominee Aadhaar" value={formData.nomineeAadhaar} />
            <Field label="Nominee Address" value={formData.nomineeAddress} />
          </Section>

          <Section title="11. Communication Settings" icon={Bell}>
            <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <BooleanField label="Send Welcome Email" value={formData.sendWelcomeEmail} />
              <BooleanField label="Send WhatsApp Updates" value={formData.sendWhatsapp} />
              <BooleanField label="Send SMS Alerts" value={formData.sendSms} />
              <BooleanField label="Monthly Updates" value={formData.monthlyUpdates} />
              <BooleanField label="Payment Reminders" value={formData.paymentReminders} />
              <BooleanField label="Document Updates" value={formData.documentUpdates} />
            </div>
          </Section>

          <Section title="12. Dashboard Access" icon={Key}>
            <Field label="Portal Access Status" value={formData.status === 'ACTIVE' ? 'Granted' : 'Pending'} />
            <Field label="User Role" value="Investor" />
          </Section>

          <Section title="12. Internal Admin Details" icon={Settings}>
            <Field label="Priority Level" value={formData.priority || 'Medium'} />
            <Field label="Assigned Employee" value={formData.assignedEmployee || formData.assignedAdvisor} />
            <Field label="Follow Up Date" value={formData.followUpDate} />
            <Field label="Follow Up Status" value={formData.followUpStatus} />
            <div className="col-span-full">
              <Field label="Admin Notes" value={formData.notes} />
            </div>
          </Section>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-white/5 flex items-center justify-end gap-4 shrink-0">
          <Button variant="ghost" onClick={onClose} className="text-white/70 hover:text-white hover:bg-white/10">
            Close View
          </Button>
          {onEdit && (
            <Button onClick={onEdit} className="bg-[#c8851e] hover:bg-[#a96618] text-white">
              Edit Investor Details
            </Button>
          )}
        </div>
      </div>

      {/* Global CSS for Print Mode */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          /* Reset viewport height, positioning, and overflow constraints on all page ancestors */
          html, body, #__next, main, [role="dialog"] {
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            position: static !important;
          }
          /* Prevent fixed-overlay containers from clipping the content height */
          .fixed {
            position: absolute !important;
            height: auto !important;
            min-height: 100% !important;
            overflow: visible !important;
          }
          /* Hide everything except the printable profile record */
          body * {
            visibility: hidden !important;
          }
          #printable-profile-record, #printable-profile-record * {
            visibility: visible !important;
          }
          #printable-profile-record {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
          }
          /* Ensure backgrounds and colors are rendered in PDF export */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}} />

      {/* Viewer Modal */}
      {preview && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4">
          <div className="absolute top-4 w-full px-6 flex justify-between items-center">
            <h3 className="text-white font-medium">{preview.title}</h3>
            <div className="flex gap-4">
              <a href={preview.downloadUrl || preview.url} download={preview.title} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <Download className="w-6 h-6" />
              </a>
              <button onClick={() => { setPreview(null); setPreviewError(false); }} className="p-3 rounded-full bg-white/10 hover:bg-[#FF5252] text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="w-full max-w-5xl h-[85vh] mt-8 rounded-xl overflow-hidden flex flex-col items-center justify-center relative">
            {previewError ? (
              <div className="flex flex-col items-center justify-center bg-white/5 p-10 rounded-2xl border border-white/10">
                <FileIcon className="w-16 h-16 text-white/30 mb-4" />
                <p className="text-white font-medium text-lg mb-2">Preview not available.</p>
                <p className="text-[#FF5252] text-sm font-medium mb-1">This document was uploaded with an old format. Please re-upload it.</p>
                <p className="text-white/60 text-sm mb-6">Or try downloading the file to view it locally.</p>
                <a href={preview.downloadUrl || preview.url} download={preview.title} target="_blank" rel="noopener noreferrer" className="bg-[#c8851e] text-white px-6 py-2 rounded hover:bg-[#a96618] transition flex items-center gap-2">
                  <Download className="w-4 h-4" /> Download File
                </a>
              </div>
            ) : preview.isPdf ? (
              <iframe 
                src={preview.url} 
                className="w-full h-full bg-white rounded-xl flex items-center justify-center"
                frameBorder="0"
                onError={() => { console.error("Document preview failed"); setPreviewError(true); }}
              />
            ) : (
              <img 
                src={preview.url} 
                alt="Preview" 
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" 
                onError={() => { console.error("Document preview failed"); setPreviewError(true); }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
