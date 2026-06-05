'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, User, Phone, Calendar, Clock, Users, Navigation, Map } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

const SITE_ADDRESS = "Dornala, Andhra Pradesh, India";

const siteVisitSchema = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  location: z.string().min(3, "Location is required for directions"),
  visitDate: z.string().optional(),
  visitTime: z.string().optional(),
  visitors: z.string().optional(),
  notes: z.string().optional(),
});

type SiteVisitFormData = z.infer<typeof siteVisitSchema>;

export default function SiteVisitSection() {
  const { register, handleSubmit, watch, formState: { errors }, trigger, getValues } = useForm<SiteVisitFormData>({
    resolver: zodResolver(siteVisitSchema),
  });

  const [loading, setLoading] = useState(false);

  const onGetDirections = async () => {
    const isValid = await trigger(['fullName', 'phone', 'location']);
    if (isValid) {
      const { location } = getValues();
      const encodedUserAddress = encodeURIComponent(location);
      const encodedSiteAddress = encodeURIComponent(SITE_ADDRESS);
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodedUserAddress}&destination=${encodedSiteAddress}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  const onRequestAssistance = async (data: SiteVisitFormData) => {
    if (!data.visitDate || !data.visitTime) {
       toast.error("Please provide preferred visit date and time for assistance.");
       return;
    }
    
    setLoading(true);
    try {
      await api.post('/inquiries', {
        fullName: data.fullName,
        email: 'sitevisit@chandannilayam.com', // Placeholder email for site visit since form doesn't collect it
        phone: data.phone,
        investmentInterest: 'Site Visit',
        budgetRange: 'N/A',
        plotSize: 'N/A',
        message: `Location: ${data.location}\nDate: ${data.visitDate}\nTime: ${data.visitTime}\nVisitors: ${data.visitors || 1}\nNotes: ${data.notes || 'None'}`,
      });
      toast.success("Thank you! Our team will contact you shortly to confirm your site visit.");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="site-visit" className="py-24 bg-[#F7F0E4] relative z-20 overflow-hidden border-t border-[#C49A5A]/20">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row gap-12 items-center w-full">
          
          {/* LEFT SIDE CONTENT */}
          <div className="w-full lg:w-[45%] flex flex-col items-start text-left">
            <div className="flex items-center gap-1.5 mb-4">
              <span className="text-[#8B5E3C] text-[10px] font-bold tracking-[2px] uppercase font-sans">
                VISIT OUR INVESTMENT SITE
              </span>
              <Navigation className="w-3.5 h-3.5 text-[#C49A5A] fill-[#C49A5A]/20" />
            </div>

            <h2 
              className="font-serif text-4xl md:text-5xl font-semibold text-[#12372A] leading-[1.1] mb-6 font-display" 
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Plan Your Site Visit
            </h2>

            <p className="text-[#3B2416] text-base leading-[1.6] mb-8 font-sans max-w-md">
              Enter your location and get directions to our sandalwood investment site instantly. 
              Our team is ready to guide you through a personalized tour of the plantation.
            </p>
            
            <div className="hidden lg:flex w-full max-w-[320px] bg-[#F3E8D2] rounded-xl border border-[#C49A5A]/30 p-4 shadow-sm items-center gap-4">
              <div className="w-12 h-12 bg-[#12372A]/5 rounded-full flex items-center justify-center">
                <Map className="w-6 h-6 text-[#C49A5A]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#8B5E3C] tracking-widest font-sans">Destination</span>
                <span className="text-[#12372A] font-bold font-sans text-sm">Dornala, Andhra Pradesh</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE FORM CARD */}
          <div className="w-full lg:w-[55%] relative z-20">
            <div className="bg-white border border-[#C49A5A]/20 rounded-3xl p-8 shadow-[0_15px_40px_rgba(0,0,0,0.06)]">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full" onSubmit={(e) => e.preventDefault()}>
                
                {/* Full Name */}
                <div className="relative col-span-1 md:col-span-2">
                  <input
                    {...register('fullName')}
                    className="w-full bg-[#F9F6F0] border border-[#C49A5A]/30 rounded-xl px-4 py-3.5 text-sm text-[#12372A] placeholder-[#8B5E3C]/60 focus:outline-none focus:border-[#C49A5A] focus:ring-1 focus:ring-[#C49A5A] transition-all pr-10 font-sans font-medium"
                    placeholder="Full Name"
                  />
                  <User className="absolute right-4 top-3.5 w-4.5 h-4.5 text-[#C49A5A] stroke-[1.5]" />
                  {errors.fullName && <p className="text-red-500 text-[10px] mt-1 text-left font-sans">{errors.fullName.message}</p>}
                </div>

                {/* Phone */}
                <div className="relative">
                  <input
                    {...register('phone')}
                    className="w-full bg-[#F9F6F0] border border-[#C49A5A]/30 rounded-xl px-4 py-3.5 text-sm text-[#12372A] placeholder-[#8B5E3C]/60 focus:outline-none focus:border-[#C49A5A] focus:ring-1 focus:ring-[#C49A5A] transition-all pr-10 font-sans font-medium"
                    placeholder="Phone Number"
                  />
                  <Phone className="absolute right-4 top-3.5 w-4.5 h-4.5 text-[#C49A5A] stroke-[1.5]" />
                  {errors.phone && <p className="text-red-500 text-[10px] mt-1 text-left font-sans">{errors.phone.message}</p>}
                </div>

                {/* Location */}
                <div className="relative">
                  <input
                    {...register('location')}
                    className="w-full bg-[#F9F6F0] border border-[#C49A5A]/30 rounded-xl px-4 py-3.5 text-sm text-[#12372A] placeholder-[#8B5E3C]/60 focus:outline-none focus:border-[#C49A5A] focus:ring-1 focus:ring-[#C49A5A] transition-all pr-10 font-sans font-medium"
                    placeholder="Your Current Location"
                  />
                  <MapPin className="absolute right-4 top-3.5 w-4.5 h-4.5 text-[#C49A5A] stroke-[1.5]" />
                  {errors.location && <p className="text-red-500 text-[10px] mt-1 text-left font-sans">{errors.location.message}</p>}
                </div>

                {/* Visit Date */}
                <div className="relative">
                  <input
                    {...register('visitDate')}
                    type="date"
                    className="w-full bg-[#F9F6F0] border border-[#C49A5A]/30 rounded-xl px-4 py-3.5 text-sm text-[#12372A] placeholder-[#8B5E3C]/60 focus:outline-none focus:border-[#C49A5A] focus:ring-1 focus:ring-[#C49A5A] transition-all pr-10 font-sans font-medium appearance-none"
                  />
                  <Calendar className="absolute right-4 top-3.5 w-4.5 h-4.5 text-[#C49A5A] stroke-[1.5] pointer-events-none" />
                </div>

                {/* Visit Time */}
                <div className="relative">
                  <input
                    {...register('visitTime')}
                    type="time"
                    className="w-full bg-[#F9F6F0] border border-[#C49A5A]/30 rounded-xl px-4 py-3.5 text-sm text-[#12372A] placeholder-[#8B5E3C]/60 focus:outline-none focus:border-[#C49A5A] focus:ring-1 focus:ring-[#C49A5A] transition-all pr-10 font-sans font-medium appearance-none"
                  />
                  <Clock className="absolute right-4 top-3.5 w-4.5 h-4.5 text-[#C49A5A] stroke-[1.5] pointer-events-none" />
                </div>

                {/* Visitors */}
                <div className="relative col-span-1 md:col-span-2">
                  <input
                    {...register('visitors')}
                    type="number"
                    min="1"
                    className="w-full bg-[#F9F6F0] border border-[#C49A5A]/30 rounded-xl px-4 py-3.5 text-sm text-[#12372A] placeholder-[#8B5E3C]/60 focus:outline-none focus:border-[#C49A5A] focus:ring-1 focus:ring-[#C49A5A] transition-all pr-10 font-sans font-medium"
                    placeholder="Number of Visitors"
                  />
                  <Users className="absolute right-4 top-3.5 w-4.5 h-4.5 text-[#C49A5A] stroke-[1.5]" />
                </div>

                {/* Notes */}
                <div className="relative col-span-1 md:col-span-2">
                  <textarea
                    {...register('notes')}
                    rows={2}
                    className="w-full bg-[#F9F6F0] border border-[#C49A5A]/30 rounded-xl px-4 py-3 text-sm text-[#12372A] placeholder-[#8B5E3C]/60 focus:outline-none focus:border-[#C49A5A] focus:ring-1 focus:ring-[#C49A5A] transition-all pr-10 font-sans font-medium"
                    placeholder="Message / Notes (Optional)"
                  />
                </div>

                {/* Buttons */}
                <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row gap-4 mt-4">
                  <button
                    type="button"
                    onClick={onGetDirections}
                    className="flex-1 bg-[#F3E8D2] hover:bg-[#EAE0C5] text-[#12372A] py-3.5 rounded-xl font-bold uppercase tracking-wider text-[11px] border border-[#C49A5A] shadow-sm flex items-center justify-center gap-2 font-sans transition-all hover:-translate-y-0.5"
                  >
                    Get Directions <Navigation className="w-3.5 h-3.5 text-[#8B5E3C]" />
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit(onRequestAssistance)}
                    disabled={loading}
                    className="flex-1 bg-[#0B2F24] hover:bg-[#12372A] text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-[11px] border border-white/5 shadow-lg flex items-center justify-center gap-2 font-sans transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {loading ? 'Requesting...' : 'Request Visit Assistance'} <MapPin className="w-3.5 h-3.5 text-[#C49A5A]" />
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
