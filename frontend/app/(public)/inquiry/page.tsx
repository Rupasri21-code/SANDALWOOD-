'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShieldCheck, UserCheck, Eye, Sprout, Leaf, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api } from '@/lib/api';

// Form validation schema matching the home page
const inquirySchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  investmentInterest: z.string().min(1, 'Please select your interest'),
  budgetRange: z.string().min(1, 'Please select your budget range'),
  plotSize: z.string().min(1, 'Please select your preferred plot size'),
  message: z.string().optional(),
  agreePrivacy: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the Privacy Policy' }),
  }),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

const trustPoints = [
  {
    icon: ShieldCheck,
    title: 'Secure Information',
    desc: 'Your contact details and investment preferences are completely encrypted and never shared.'
  },
  {
    icon: UserCheck,
    title: 'Expert Guidance',
    desc: 'Liaise directly with certified wealth managers and senior agronomists for customized asset plans.'
  },
  {
    icon: Eye,
    title: 'Transparent Process',
    desc: 'Verify registered land boundaries, soil chemistry certifications, and FEMA guidelines openly.'
  },
  {
    icon: Sprout,
    title: 'Long-Term Wealth',
    desc: 'Nurture physical land plots that appreciate biologically, protecting capital from market downturns.'
  }
];

export default function InquiryPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      investmentInterest: '',
      budgetRange: '',
      plotSize: '',
      message: '',
      agreePrivacy: true
    }
  });

  const onSubmit = async (data: InquiryFormValues) => {
    setLoading(true);
    try {
      await api.post('/inquiries', {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        investmentInterest: data.investmentInterest,
        budgetRange: data.budgetRange,
        plotSize: data.plotSize,
        message: data.message || '',
      });

      setSubmitted(true);
      toast.success('Your inquiry has been submitted successfully.');
      reset();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F7F0E4] min-h-screen text-[#1E1E1A] font-sans overflow-x-hidden relative">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex items-center justify-center overflow-hidden w-full h-[50vh] min-h-[400px]">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1920"
            alt="Inquiry Background"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Forest Green Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0B2F24]/80 to-[#0B2F24]/90" />

        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 mb-6 shadow-md border"
            style={{
              background: 'rgba(247, 240, 228, 0.85)',
              borderColor: '#C49A5A',
            }}
          >
            <span className="text-[10px] font-bold tracking-[2px] uppercase text-[#8B5E3C]">
              Booking Form
            </span>
          </div>

          <h1 
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 leading-tight"
            style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              textShadow: '0 4px 15px rgba(0, 0, 0, 0.4)' 
            }}
          >
            Begin Your Sandalwood Journey
          </h1>
          <p className="text-[#E6D3B3] text-base md:text-lg max-w-2xl leading-relaxed font-serif" style={{ fontFamily: "'Lora', serif" }}>
            Submit your plot layout requirements and schedule a formal discussion with our wealth advisory.
          </p>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-20">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px]">
            <path d="M0,35 C300,105 600,15 900,105 L1200,55 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* 2. INQUIRY GRID: Form & Trust Points */}
      <section className="py-24 bg-[#F7F0E4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Col: Trust Points */}
            <div className="lg:col-span-5 text-left">
              <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3">SECURE INVESTING</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#12372A] mb-8 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Our Commitment to Your Security
              </h2>
              
              <div className="space-y-8">
                {trustPoints.map((point, idx) => {
                  const Icon = point.icon;
                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#F3E8D2] border border-[#C49A5A]/35 flex items-center justify-center text-[#8B5E3C] shrink-0">
                        <Icon className="w-6 h-6 stroke-[1.25]" />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg font-bold text-[#12372A] mb-1.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{point.title}</h4>
                        <p className="text-[#2F3E2F]/90 text-xs md:text-sm leading-relaxed">{point.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Col: Premium Form Card */}
            <div className="lg:col-span-7">
              <div className="bg-[#F3E8D2] border border-[#C49A5A]/35 rounded-[3rem] p-8 md:p-12 shadow-sm text-left">
                {submitted ? (
                  <div className="text-center py-16 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-[#0B2F24]/10 border border-[#0B2F24]/30 flex items-center justify-center text-[#0B2F24] mb-6 animate-bounce">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-[#12372A] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Enquiry Received</h3>
                    <p className="text-[#2F3E2F] text-sm max-w-sm mx-auto leading-relaxed">
                      Thank you for contacting Chandan Nilayam. An investment advisor will call you within 24 business hours to verify details.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-serif text-2xl font-bold text-[#12372A] mb-6 animate-pulse" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Submit Inquiry Form</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      
                      {/* Name & Phone */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-[#2F3E2F] text-xs font-bold mb-1 block uppercase tracking-wide">Full Name *</Label>
                          <Input
                            placeholder="Full name"
                            {...register('fullName')}
                            className="bg-white/80 border-[#C49A5A]/30 focus:border-[#C49A5A] rounded-xl h-11 text-xs"
                          />
                          {errors.fullName && <p className="text-red-500 text-[10px] mt-1">{errors.fullName.message}</p>}
                        </div>
                        <div>
                          <Label className="text-[#2F3E2F] text-xs font-bold mb-1 block uppercase tracking-wide">Phone Number *</Label>
                          <Input
                            placeholder="Phone number"
                            {...register('phone')}
                            className="bg-white/80 border-[#C49A5A]/30 focus:border-[#C49A5A] rounded-xl h-11 text-xs"
                          />
                          {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone.message}</p>}
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <Label className="text-[#2F3E2F] text-xs font-bold mb-1 block uppercase tracking-wide">Email Address *</Label>
                        <Input
                          type="email"
                          placeholder="Your email address"
                          {...register('email')}
                          className="bg-white/80 border-[#C49A5A]/30 focus:border-[#C49A5A] rounded-xl h-11 text-xs"
                        />
                        {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email.message}</p>}
                      </div>

                      {/* Interest Type */}
                      <div>
                        <Label className="text-[#2F3E2F] text-xs font-bold mb-1 block uppercase tracking-wide">Investment Interest *</Label>
                        <select
                          {...register('investmentInterest')}
                          className="w-full h-11 px-3 rounded-xl border border-[#C49A5A]/30 bg-white/80 text-xs focus:outline-none text-[#2F3E2F]"
                        >
                          <option value="">Select interest type</option>
                          <option value="Sandalwood Farmland Plot">Sandalwood Farmland Plot</option>
                          <option value="Managed Cultivation Service">Managed Cultivation Service</option>
                          <option value="Joint Development Venture">Joint Development Venture</option>
                        </select>
                        {errors.investmentInterest && <p className="text-red-500 text-[10px] mt-1">{errors.investmentInterest.message}</p>}
                      </div>

                      {/* Budget & Plot Size */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-[#2F3E2F] text-xs font-bold mb-1 block uppercase tracking-wide">Budget Range *</Label>
                          <select
                            {...register('budgetRange')}
                            className="w-full h-11 px-3 rounded-xl border border-[#C49A5A]/30 bg-white/80 text-xs focus:outline-none text-[#2F3E2F]"
                          >
                            <option value="">Select budget range</option>
                            <option value="₹10 Lakhs - ₹25 Lakhs">₹10 Lakhs - ₹25 Lakhs</option>
                            <option value="₹25 Lakhs - ₹50 Lakhs">₹25 Lakhs - ₹50 Lakhs</option>
                            <option value="₹50 Lakhs - ₹1 Crore">₹50 Lakhs - ₹1 Crore</option>
                            <option value="₹1 Crore+">₹1 Crore+</option>
                          </select>
                          {errors.budgetRange && <p className="text-red-500 text-[10px] mt-1">{errors.budgetRange.message}</p>}
                        </div>
                        <div>
                          <Label className="text-[#2F3E2F] text-xs font-bold mb-1 block uppercase tracking-wide">Preferred Plot Size *</Label>
                          <select
                            {...register('plotSize')}
                            className="w-full h-11 px-3 rounded-xl border border-[#C49A5A]/30 bg-white/80 text-xs focus:outline-none text-[#2F3E2F]"
                          >
                            <option value="">Select plot size</option>
                            <option value="0.25 Acres (30 Trees)">0.25 Acres (30 Trees)</option>
                            <option value="0.5 Acres (60 Trees)">0.5 Acres (60 Trees)</option>
                            <option value="1.0 Acres (120 Trees)">1.0 Acres (120 Trees)</option>
                            <option value="2.0+ Acres">2.0+ Acres</option>
                          </select>
                          {errors.plotSize && <p className="text-red-500 text-[10px] mt-1">{errors.plotSize.message}</p>}
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <Label className="text-[#2F3E2F] text-xs font-bold mb-1 block uppercase tracking-wide">Message</Label>
                        <Textarea
                          placeholder="Tell us about your timeline or other requirements..."
                          rows={4}
                          {...register('message')}
                          className="bg-white/80 border-[#C49A5A]/30 focus:border-[#C49A5A] rounded-xl text-xs resize-none"
                        />
                      </div>

                      {/* Privacy Toggle */}
                      <div className="flex items-start gap-2 py-2">
                        <input
                          type="checkbox"
                          id="agreePrivacy"
                          {...register('agreePrivacy')}
                          className="mt-1 accent-[#0B2F24]"
                        />
                        <Label htmlFor="agreePrivacy" className="text-[10px] text-[#2F3E2F] leading-tight cursor-pointer">
                          I agree to securely share my details under the platform privacy conditions.
                        </Label>
                      </div>
                      {errors.agreePrivacy && <p className="text-red-500 text-[10px]">{errors.agreePrivacy.message}</p>}

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#0B2F24] hover:bg-[#12372A] text-white rounded-xl py-6 text-xs font-bold uppercase tracking-wider transition-colors shadow-md mt-2 flex items-center justify-center gap-2"
                      >
                        {loading ? 'Submitting...' : 'Submit Enquiry'} <Send className="w-3.5 h-3.5" />
                      </Button>

                    </form>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
