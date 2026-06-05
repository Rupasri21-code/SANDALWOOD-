'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Shield,
  Leaf,
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  TreePine,
  Layers,
  Mail,
  Phone,
  User,
  Activity,
  TrendingUp,
  Globe,
  Award,
  ChevronDown,
  Trees,
  ShieldCheck,
  Sprout,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import SiteVisitSection from '@/components/public/site-visit-section';

// Form validation schema
const inquirySchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  investmentInterest: z.string().min(1, 'Please select your interest'),
  budgetRange: z.string().min(1, 'Please select your budget'),
  plotSize: z.string().min(1, 'Please select your preferred plot size'),
  message: z.string().optional(),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

const stats = [
  {
    value: '50',
    label: 'ACRES',
    description: 'Premium Land\nNear Dornala',
    icon: MapPin,
  },
  {
    value: '400+',
    label: 'PLOTS',
    description: 'Thoughtfully\nPlanned',
    icon: Trees,
  },
  {
    value: '15+',
    label: 'YEARS',
    description: 'Sandalwood\nGrowth Cycle',
    icon: TreePine,
  },
  {
    value: '100%',
    label: 'CLEAR TITLES',
    description: 'Secure &\nDocumented',
    icon: ShieldCheck,
  },
  {
    value: '',
    label: "LONG TERM\nWEALTH",
    description: 'Driven by Nature.\nBuilt for Generations.',
    icon: Sprout,
  },
];

const features = [
  {
    title: 'Rising Global Demand',
    description: 'Used in perfumery, wellness, spirituality and luxury products.',
    icon: Globe,
  },
  {
    title: 'Scarce & Premium',
    description: 'Slow-growing and limited availability drives long-term value.',
    icon: Award,
  },
  {
    title: 'Nature-Backed Growth',
    description: 'A tangible asset that grows stronger with time.',
    icon: Leaf,
  },
];

const journeySteps = [
  {
    num: '01',
    title: 'Land Acquisition',
    description: 'Prime 50 acres near Dornala, secured with clear titles.',
  },
  {
    num: '02',
    title: 'Land Development',
    description: 'Soil preparation, infrastructure and sustainable planning.',
  },
  {
    num: '03',
    title: 'Plantation & Care',
    description: 'Premium sandalwood saplings nurtured with expert care.',
  },
  {
    num: '04',
    title: 'Growth & Monitoring',
    description: 'Regular updates, progress tracking and health monitoring.',
  },
  {
    num: '05',
    title: 'Harvest & Returns',
    description: 'Long-term value realization shared with investors.',
  },
];

const benefits = [
  {
    title: 'Tangible Asset',
    description: 'Invest in real land and real trees.',
    icon: MapPin,
  },
  {
    title: 'Long-Term Returns',
    description: 'Built for compounding and generational wealth.',
    icon: TrendingUp,
  },
  {
    title: 'Transparent & Secure',
    description: 'Clear documents, legal titles and full transparency.',
    icon: Shield,
  },
  {
    title: 'Regular Updates',
    description: 'Timely plantation updates, reports and photos.',
    icon: Activity,
  },
  {
    title: 'Investor Portal',
    description: '24/7 access to your documents, updates and performance.',
    icon: User,
  },
];

const progressionImages = [
  { url: '/gallery_01.png', title: 'Raw Land' },
  { url: '/gallery_02.jpg', title: 'Fresh Sandalwood Saplings' },
  { url: '/gallery_03.jpg', title: '3-Month Growth Stage' },
  { url: '/gallery_04.jpg', title: 'Developed Sandalwood Plantation' },
  { url: '/gallery_05.png', title: 'Mature Sandalwood Trees' },
];

const testimonials = [
  {
    text: "Investing in Chandan Nilayam was one of the best decisions I've made. The transparency and regular updates give me complete peace of mind.",
    name: "Ramesh B.",
    location: "Hyderabad",
    stars: 5,
  },
  {
    text: "The team is professional, the land is beautiful, and the vision is truly long-term. I'm proud to be part of this green legacy.",
    name: "Anitha K.",
    location: "Bengaluru",
    stars: 5,
  },
  {
    text: "A rare opportunity to own land, grow sandalwood and build wealth for future generations. Highly recommended.",
    name: "Vikram S.",
    location: "Chennai",
    stars: 5,
  },
];

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [prevHeroImage, setPrevHeroImage] = useState<number | null>(null);

  const heroSequence = [
    '/gallery_01.png',
    '/gallery_02.jpg',
    '/gallery_03.jpg',
    '/gallery_04.jpg',
    '/gallery_05.png',
    '/media__1780138743022.png',
    '/media__1780138713953.png',
    '/media__1780138673726.png',
    '/media__1780138759009.png',
    '/media__1780138786375.png',
    '/media__1780238695392.png',
    '/media__1780238718069.png',
    '/media__1780238752402.jpg',
    '/media__1780238775743.png',
    '/media__1780238824506.png',
    '/media__1780239390979.jpg',
    '/media__1780239547699.png',
    '/media__1780239602852.jpg',
    '/media__1780239666538.png',
    '/media__1780239713568.png',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevHeroImage(currentHeroImage);
      setCurrentHeroImage((prev) => (prev + 1) % heroSequence.length);
    }, 5000); // 4 seconds visible + 1 second transition
    return () => clearInterval(timer);
  }, [currentHeroImage]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
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

      toast.success('Your enquiry has been submitted successfully. Our team will contact you within 24 hours.');
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

      {/* 2. Premium Hero Full-Screen Background Image Slider */}
      <section 
        className="relative flex items-center justify-center overflow-hidden w-full h-[calc(100vh-80px)] min-h-[720px] max-md:h-[650px] max-md:min-h-[650px]"
      >
        {/* Background Image Carousel */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          {heroSequence.map((src, idx) => {
            let positionClass = '';
            if (idx === currentHeroImage) {
              positionClass = 'translate-x-0 opacity-100 z-10 transition-all duration-1000 ease-in-out';
            } else if (idx === prevHeroImage) {
              positionClass = '-translate-x-full opacity-0 z-0 transition-all duration-1000 ease-in-out';
            } else {
              positionClass = 'translate-x-full opacity-0 z-0 transition-none';
            }

            return (
              <div
                key={src}
                className={`absolute inset-0 w-full h-full ${positionClass}`}
              >
                <img
                  src={src}
                  alt={`Sandalwood Slide ${idx + 1}`}
                  className="w-full h-full object-cover border-0 outline-none rounded-none shadow-none"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            );
          })}
        </div>

        {/* Readability Green Gradient Overlay */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none" 
          style={{ 
            background: 'linear-gradient(90deg, rgba(11, 47, 36, 0.45), rgba(11, 47, 36, 0.20), rgba(11, 47, 36, 0.35))' 
          }} 
        />

        {/* Fixed Hero Content on Top */}
        <div className="relative z-30 max-w-5xl mx-auto px-6 w-full text-center flex flex-col items-center justify-center">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 mb-8 shadow-md border"
            style={{
              background: 'rgba(247, 240, 228, 0.85)',
              borderColor: '#C49A5A',
            }}
          >
            <Leaf className="w-4 h-4 text-[#8B5E3C]" />
            <span 
              className="text-[11px] font-bold tracking-[2.5px] uppercase font-sans"
              style={{ color: '#8B5E3C' }}
            >
              PREMIUM SANDALWOOD PLOTS NEAR DORNALA
            </span>
          </div>

          {/* Heading */}
          <h1 
            className="font-serif text-5xl md:text-6xl lg:text-[75px] font-bold tracking-tight text-[#0B2F24] leading-[1.1] mb-8 font-display"
            style={{ 
              fontFamily: "'Cormorant Garamond', 'Playfair Display', serif", 
              fontWeight: 700, 
              textShadow: '0 2px 10px rgba(255, 255, 255, 0.5)' 
            }}
          >
            ROOTED IN NATURE.<br />
            GROWING WEALTH.
          </h1>

          {/* Subheading */}
          <p 
            className="text-lg md:text-[25px] font-medium max-w-3xl leading-relaxed mb-12 text-[#0B2F24]" 
            style={{ 
              fontFamily: "'Lora', 'Manrope', serif", 
              textShadow: '0 2px 8px rgba(255, 255, 255, 0.6)' 
            }}
          >
            Premium Sandalwood Plots Near Dornala.<br />
            Legacy land. Long-term value.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center items-center">
            <a href="#opportunity" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto hover:opacity-90 text-white shadow-xl px-10 py-7 text-sm font-semibold uppercase tracking-wider rounded-full transition-all duration-300 font-sans flex items-center justify-center gap-2 border border-white/10"
                style={{ backgroundColor: '#C49A5A' }}
              >
                EXPLORE THE OPPORTUNITY <Leaf className="w-4 h-4 fill-white/20" />
              </Button>
            </a>
            <a href="#plantation" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto hover:opacity-90 text-white shadow-xl px-10 py-7 text-sm font-semibold uppercase tracking-wider rounded-full transition-all border border-white/10 font-sans flex items-center justify-center gap-2"
                style={{ backgroundColor: '#0B2F24' }}
              >
                VIEW PLANTATION <Play className="w-4 h-4 fill-white" />
              </Button>
            </a>
          </div>
        </div>

        {/* CURVED TRANSITION: Organic luxury curved Divider with Gold Trace Line */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-30">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[65px]">
            {/* Golden wave trace line */}
            <path d="M0,35 C300,105 600,15 900,105" fill="none" stroke="#C49A5A" strokeWidth="2" opacity="0.4" />
            <path d="M0,35 C300,105 600,15 900,105 L1200,55 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* 3. Redesigned Statistics Section (EXACT REFERENCE STYLE) */}
      <section className="pt-[60px] pb-[55px] relative z-20 bg-[#F7F0E4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-12">
            {stats.map((stat, i) => (
              <div 
                key={i} 
                className={`px-4 text-center flex flex-col items-center group relative ${
                  i < 4 ? 'lg:border-r lg:border-[#B8A88A]/40' : ''
                }`}
              >
                {/* 1. Icon above number */}
                <div className="mb-4 text-[#C49A5A] flex items-center justify-center">
                  <stat.icon className="w-10 h-10 stroke-[1.2] text-[#C49A5A]" />
                </div>

                {/* 2. Number below icon */}
                {stat.value && (
                  <div 
                    className="font-serif text-[42px] lg:text-[48px] font-bold text-[#12372A] leading-none mb-1.5" 
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {stat.value}
                  </div>
                )}

                {/* 3. Label below number */}
                <div 
                  className="font-serif text-[18px] lg:text-[20px] font-semibold text-[#12372A] uppercase leading-tight mb-2 whitespace-pre-line" 
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {stat.label}
                </div>

                {/* 4. Description below label */}
                <p 
                  className="text-[#1E1E1A] text-sm lg:text-[15px] leading-[1.4] whitespace-pre-line font-sans"
                >
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. The Sandalwood Opportunity Section */}
      <section id="opportunity" className="py-24 bg-[#F7F0E4] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Col - Headings & Copy */}
            <div className="lg:col-span-7">
              <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3 font-sans">THE SANDALWOOD OPPORTUNITY</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#12372A] mb-6 leading-tight font-display" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Rare. Valuable.<br />Timeless.
              </h2>
              <p className="text-[#2F3E2F] text-base md:text-lg leading-relaxed mb-10 max-w-2xl font-serif" style={{ fontFamily: "'Lora', serif" }}>
                Sandalwood is one of the world's most valuable natural assets. High in demand, limited in supply, and trusted for centuries for its fragrance, medicine and heritage.
              </p>

              {/* Stacked columns in left panel */}
              <div className="grid md:grid-cols-3 gap-6">
                {features.map((feat, i) => (
                  <div key={i} className="flex flex-col group">
                    <div className="w-10 h-10 rounded-full bg-[#8B5E3C]/10 flex items-center justify-center text-[#8B5E3C] mb-4 group-hover:scale-105 transition-transform">
                      <feat.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xs font-black uppercase text-[#12372A] tracking-wide mb-2 font-sans">{feat.title}</h3>
                    <p className="text-[#2F3E2F]/80 text-[11px] leading-relaxed font-sans">{feat.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 relative flex justify-center w-full">
              <div className="relative w-full max-w-[520px] aspect-[1.25] rounded-[2rem] md:rounded-[3rem] p-3 bg-[#F3E8D2] border border-[#C49A5A]/30 shadow-[0_30px_70px_rgba(139,94,60,0.25)] group hover:scale-[1.02] transition-all duration-500">
                <div className="w-full h-full rounded-[1.75rem] md:rounded-[2.5rem] overflow-hidden relative">
                  <img 
                    src="/sandalwood_showcase.png" 
                    alt="Premium Sandalwood Showcase" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
              
              {/* Overlay Leaf details */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 text-[#8B5E3C]/40 pointer-events-none">
                <Leaf className="w-full h-full rotate-45" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Our Plantation Journey Section (REDESIGNED TO EXACT REFERENCE STYLE) */}
      <section id="plantation" className="relative min-h-[600px] flex items-center overflow-hidden bg-cover bg-center py-28" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1920')` }}>
        {/* Dark Forest Green Background Overlay */}
        <div className="absolute inset-0 bg-[#0B2F24]/75 z-0" />
        
        {/* Top organic wave curve */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[55px] rotate-180">
            <path d="M0,0 C300,110 600,0 900,110 L1200,60 L1200,120 L0,120 Z" />
          </svg>
        </div>

        {/* Bottom organic wave curve */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[55px]">
            <path d="M0,0 C300,110 600,0 900,110 L1200,60 L1200,120 L0,120 Z" />
          </svg>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full py-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT CONTENT (30% width / lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col items-start text-left">
              {/* Small Label */}
              <div className="flex items-center gap-1.5 mb-4">
                <span className="text-[#C49A5A] text-[10px] font-bold tracking-[2px] uppercase font-sans">
                  OUR PLANTATION JOURNEY
                </span>
                <Leaf className="w-3.5 h-3.5 text-[#C49A5A] fill-[#C49A5A]/30 rotate-45" />
              </div>

              {/* Heading */}
              <h2 
                className="font-serif text-4xl md:text-5xl font-semibold text-[#F7F0E4] leading-[1.1] mb-6 font-display" 
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                From Land to Legacy
              </h2>

              {/* Description */}
              <p className="text-[#E6D3B3] text-sm md:text-[15px] leading-[1.6] mb-8 font-sans max-w-md">
                We own and nurture 50 acres of premium land near Dornala. Every step is managed with care, transparency and expertise.
              </p>

              {/* Button */}
              <a href="#investor-inquiry">
                <button className="bg-transparent hover:bg-[#F7F0E4]/5 border border-[#E6D3B3] text-[#F7F0E4] rounded-[6px] px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all font-sans">
                  EXPLORE OUR JOURNEY <Leaf className="w-3.5 h-3.5" />
                </button>
              </a>
            </div>

            {/* RIGHT TIMELINE (70% width / lg:col-span-8) */}
            <div className="lg:col-span-8 relative w-full">
              {/* Horizontal Connecting Line for Desktop */}
              <div className="absolute top-[20px] left-[10%] right-[10%] h-[1.5px] bg-[rgba(230,211,179,0.3)] z-0 hidden lg:block" />
              
              {/* Vertical Connecting Line for Mobile/Tablet */}
              <div className="absolute left-[20px] top-[20px] bottom-[20px] w-[1.5px] bg-[rgba(230,211,179,0.3)] z-0 lg:hidden" />
              
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-y-10 lg:gap-x-6 relative z-10">
                {journeySteps.map((step, i) => {
                  const icons = [MapPin, Layers, Sprout, Activity, TrendingUp];
                  const StepIcon = icons[i] || Sprout;
                  
                  return (
                    <div 
                      key={i} 
                      className={`relative flex flex-col items-start pl-14 lg:pl-0 z-10 ${
                        i < 4 ? 'lg:border-r border-[rgba(230,211,179,0.15)] lg:pr-4' : ''
                      }`}
                    >
                      {/* 1. Circle Number Badge */}
                      <div 
                        className="absolute left-0 lg:left-auto lg:relative top-0 lg:top-auto w-10 h-10 rounded-full bg-[#F7F0E4] text-[#12372A] border border-[#C49A5A] flex items-center justify-center font-bold text-xs shadow-md mb-6 z-10 font-sans"
                      >
                        {step.num}
                      </div>

                      {/* 2. Gold Line Icon */}
                      <div className="text-[#C49A5A] mb-3 mt-0.5 lg:mt-0">
                        <StepIcon className="w-7 h-7 stroke-[1.25] text-[#C49A5A]" />
                      </div>

                      {/* 3. Step Title */}
                      <h3 className="text-xs font-bold text-[#F7F0E4] tracking-wider mb-2 uppercase font-sans">
                        {step.title}
                      </h3>

                      {/* 4. Step Description */}
                      <p className="text-[#E6D3B3] text-[11px] leading-[1.5] font-sans">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Why Invest With Us & Portal Showcase (REDESIGNED TO EXACT REFERENCE STYLE) */}
      <section id="benefits" className="py-28 bg-gradient-to-b from-[#F7F0E4] via-[#F3E8D2] to-[#F7F0E4] relative overflow-hidden z-20">
        <div className="max-w-[1400px] mx-auto px-6 w-full">
          
          <div className="flex flex-col lg:flex-row gap-16 items-center w-full">
            
            {/* LEFT SIDE (48% Width) */}
            <div className="w-full lg:w-[48%] flex flex-col items-start text-left">
              {/* Small Label */}
              <div className="flex items-center gap-1.5 mb-4">
                <span className="text-[#8B5E3C] text-[10px] font-bold tracking-[2px] uppercase font-sans">
                  WHY INVEST WITH US
                </span>
                <Leaf className="w-3.5 h-3.5 text-[#C49A5A] fill-[#C49A5A]/20 rotate-45" />
              </div>

              {/* Heading */}
              <h2 
                className="font-serif text-4xl md:text-5xl font-semibold text-[#12372A] leading-[1.1] mb-12 font-display" 
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Benefits that Grow<br />with You
              </h2>

              {/* 5-Column Horizontal Benefit Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-y-8 gap-x-3 w-full border-t border-[rgba(139,94,60,0.15)] pt-8">
                {[
                  {
                    title: 'Tangible Asset',
                    desc: 'Invest in real land and real trees.',
                    icon: MapPin,
                  },
                  {
                    title: 'Long-Term Returns',
                    desc: 'Built for compounding and generational wealth.',
                    icon: Sprout,
                  },
                  {
                    title: 'Transparent & Secure',
                    desc: 'Clear documents, legal titles and full transparency.',
                    icon: ShieldCheck,
                  },
                  {
                    title: 'Regular Updates',
                    desc: 'Timely plantation updates, reports and photos.',
                    icon: CheckCircle2,
                  },
                  {
                    title: 'Investor Portal',
                    desc: '24×7 access to your documents, updates and performance.',
                    icon: Globe,
                  },
                ].map((ben, i) => {
                  const Icon = ben.icon;
                  return (
                    <div 
                      key={i} 
                      className={`flex flex-col items-start text-left ${
                        i < 4 ? 'lg:border-r lg:border-[rgba(139,94,60,0.25)] lg:pr-2' : ''
                      }`}
                    >
                      {/* Gold Outline Icon */}
                      <div className="text-[#C49A5A] mb-4">
                        <Icon className="w-9 h-9 stroke-[1.15] text-[#C49A5A]" />
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#12372A] mb-2 font-sans">
                        {ben.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-[#3B2416] text-[10px] leading-relaxed font-sans">
                        {ben.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT SIDE (52% Width) */}
            <div id="portal" className="w-full lg:w-[52%] flex items-center justify-center relative min-h-[480px]">
              <div className="relative w-full max-w-[620px]">
                
                {/* 1. High-Fidelity Laptop Mockup */}
                <div className="bg-[#0B2F24] rounded-2xl p-2 shadow-2xl border-4 border-[#C49A5A]/20 relative z-10 w-full overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
                  {/* Laptop Top Bezel Controls */}
                  <div className="flex items-center gap-1.5 border-b border-white/10 pb-2 mb-2 px-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400/80" />
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/80" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400/80" />
                    <span className="text-[7px] text-white/30 ml-2 font-mono tracking-wider">chandannilayam.com/portal</span>
                  </div>

                  {/* Dashboard Screen */}
                  <div className="bg-[#F7F0E4] rounded-lg overflow-hidden text-[#1E1E1A] flex flex-col h-[340px]">
                    {/* Header */}
                    <div className="bg-[#0B2F24] py-2 px-4 flex items-center gap-2 border-b border-white/5">
                      <TreePine className="w-4 h-4 text-[#C49A5A]" />
                      <div className="flex flex-col text-left">
                        <span className="text-[8px] font-black tracking-[0.18em] text-[#C49A5A] uppercase font-serif">Chandan Nilayam</span>
                        <span className="text-[5.5px] font-bold text-white/50 tracking-[0.2em] uppercase font-sans">Investor Portal</span>
                      </div>
                    </div>

                    {/* Dashboard Layout Body */}
                    <div className="flex-1 flex overflow-hidden">
                      {/* Sidebar */}
                      <div className="w-[110px] bg-[#0B2F24] py-3 px-2 flex flex-col gap-1 border-r border-white/5">
                        {[
                          { label: 'Dashboard', active: true },
                          { label: 'My Investment' },
                          { label: 'Plots' },
                          { label: 'Updates' },
                          { label: 'Documents' },
                          { label: 'Payments' },
                          { label: 'Notifications' },
                          { label: 'Profile' },
                          { label: 'Support' }
                        ].map((item, idx) => (
                          <div 
                            key={idx} 
                            className={`text-left px-2 py-1 rounded text-[7px] font-bold uppercase tracking-wider font-sans transition-colors cursor-pointer ${
                              item.active 
                                ? 'bg-[#C49A5A]/15 text-[#C49A5A]' 
                                : 'text-white/60 hover:text-white/90 hover:bg-white/5'
                            }`}
                          >
                            {item.label}
                          </div>
                        ))}
                      </div>

                      {/* Main Dashboard Panel */}
                      <div className="flex-1 p-3.5 flex flex-col gap-3 overflow-y-auto bg-gradient-to-br from-[#F7F0E4] to-[#F3E8D2]">
                        {/* 4 Metric Cards */}
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { title: 'My Plots', value: '3', sub: 'Active' },
                            { title: 'Total Trees', value: '480', sub: 'Growing Strong' },
                            { title: 'Total Investment', value: '₹48,00,000', sub: 'Invested' },
                            { title: 'Last Update', value: 'May 14, 2024', sub: 'View Details', gold: true }
                          ].map((card, idx) => (
                            <div key={idx} className="bg-[#F3E8D2] border border-[#C49A5A]/25 rounded-md p-2 text-left shadow-sm">
                              <span className="block text-[6.5px] text-[#12372A]/50 font-bold uppercase tracking-wider font-sans">{card.title}</span>
                              <span className="block text-[10px] font-extrabold text-[#12372A] mt-1 font-sans">{card.value}</span>
                              <span className={`block text-[5.5px] font-bold uppercase mt-0.5 font-sans ${card.gold ? 'text-[#8B5E3C]' : 'text-[#12372A]/70'}`}>{card.sub}</span>
                            </div>
                          ))}
                        </div>

                        {/* Recent Updates Panel */}
                        <div className="bg-white/80 backdrop-blur-md border border-[#C49A5A]/20 rounded-lg p-2.5 flex-1 flex flex-col text-left">
                          <h4 className="text-[7.5px] font-bold uppercase tracking-wider text-[#12372A] mb-2 border-b border-[#F7F0E4] pb-1.5 font-sans">
                            Recent Plantation Update
                          </h4>
                          
                          <div className="grid grid-cols-2 gap-2 flex-1 items-start">
                            <div className="flex gap-1.5 items-center bg-[#F7F0E4]/50 p-1.5 rounded border border-[#C49A5A]/10">
                              <img 
                                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=120" 
                                className="w-8 h-8 rounded object-cover shadow-sm"
                                alt="Block A"
                              />
                              <div className="flex flex-col">
                                <span className="text-[5.5px] text-[#8B5E3C] font-extrabold uppercase font-sans">May 14, 2024</span>
                                <span className="text-[6.5px] font-extrabold text-[#12372A] leading-tight font-sans mt-0.5">Healthy growth observed in Block A</span>
                              </div>
                            </div>

                            <div className="flex gap-1.5 items-center bg-[#F7F0E4]/50 p-1.5 rounded border border-[#C49A5A]/10">
                              <img 
                                src="https://images.unsplash.com/photo-1464254786740-b97e5420c299?auto=format&fit=crop&q=80&w=120" 
                                className="w-8 h-8 rounded object-cover shadow-sm"
                                alt="Block C"
                              />
                              <div className="flex flex-col">
                                <span className="text-[5.5px] text-[#8B5E3C] font-extrabold uppercase font-sans">Apr 28, 2024</span>
                                <span className="text-[6.5px] font-extrabold text-[#12372A] leading-tight font-sans mt-0.5">New saplings planted in Block C</span>
                              </div>
                            </div>
                          </div>

                          <Link href="/portal/plantation" className="text-center self-center bg-transparent border border-[#12372A]/30 hover:border-[#12372A] text-[#12372A] text-[6.5px] font-bold uppercase tracking-widest py-1 px-4 rounded mt-2 font-sans transition-colors">
                            VIEW ALL UPDATES
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Overlapping Mobile Mockup Leaning on the Left */}
                <div className="absolute -left-6 -bottom-6 w-36 aspect-[9/19] bg-[#0B2F24] rounded-[22px] p-2 shadow-2xl border-[3px] border-[#C49A5A]/30 z-20 hidden md:flex flex-col overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
                  {/* Phone Speaker & Camera Bezel */}
                  <div className="w-14 h-3 bg-[#0B2F24] rounded-full mx-auto mb-1 flex items-center justify-center border border-white/5">
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                  </div>

                  {/* Phone Screen */}
                  <div className="w-full h-full bg-[#F7F0E4] rounded-[14px] p-2 flex flex-col justify-between text-[#0B2F24] overflow-hidden">
                    <div>
                      {/* Phone Brand Header */}
                      <div className="flex items-center gap-1.5 border-b border-black/5 pb-1.5 mb-2 text-left">
                        <TreePine className="w-3 h-3 text-[#C49A5A]" />
                        <span className="text-[6px] font-black uppercase tracking-wider font-serif text-[#12372A]">Chandan Nilayam</span>
                      </div>

                      {/* My Investment Header */}
                      <span className="block text-[5.5px] text-[#8B5E3C] uppercase font-bold tracking-wider font-sans text-left">My Investment</span>
                      <span className="block text-[8px] font-serif font-black text-[#12372A] mt-0.5 tracking-wide text-left">Plot Details</span>
                      
                      {/* Plot Details Card */}
                      <div className="bg-[#F3E8D2] border border-[#C49A5A]/20 p-2 rounded-lg text-left mt-2">
                        <div className="space-y-1">
                          {[
                            { label: 'Plot ID', val: 'D-102' },
                            { label: 'Area', val: '2.5 Acres' },
                            { label: 'Trees', val: '400+' },
                            { label: 'Status', val: 'Active', gold: true }
                          ].map((row, idx) => (
                            <div key={idx} className="flex justify-between text-[6px] font-sans">
                              <span className="text-[#12372A]/50 font-bold uppercase tracking-wider">{row.label}</span>
                              <span className={`font-extrabold ${row.gold ? 'text-[#8B5E3C]' : 'text-[#12372A]'}`}>{row.val}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Scenic Land Image */}
                      <img 
                        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=220" 
                        className="w-full h-12 rounded-lg object-cover mt-2.5 shadow-sm border border-[#C49A5A]/10"
                        alt="My Plot View"
                      />
                    </div>

                    {/* Action Button */}
                    <Link href="/portal/documents" className="block text-center w-full py-1.5 bg-[#0B2F24] hover:bg-[#12372A] text-white text-[6px] font-bold uppercase tracking-wider rounded-md font-sans border border-white/5 shadow transition-colors">
                      VIEW DOCUMENTS
                    </Link>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Progression of Our Sandalwood Plantation (FINAL UPLOADED GALLERY IMPLEMENTATION) */}
      <section id="gallery" className="py-24 bg-[#F7F0E4] z-20 relative">
        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col items-center">
          
          {/* Section Label */}
          <div className="flex items-center gap-1.5 mb-4 self-center lg:self-start">
            <span className="text-[#8B5E3C] text-xs font-semibold tracking-[2px] uppercase font-sans">
              A GLIMPSE OF OUR LAND
            </span>
            <Leaf className="w-3.5 h-3.5 text-[#C49A5A] fill-[#C49A5A]/20 rotate-45" />
          </div>

          {/* Section Heading */}
          <h2 
            className="font-serif text-4xl md:text-5xl lg:text-[52px] font-semibold text-[#12372A] leading-tight mb-4 text-center font-display"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Our Sandalwood Growth Journey
          </h2>

          {/* Section Description */}
          <p className="text-[#3B2416] text-base leading-relaxed font-sans text-center max-w-3xl mb-12">
            From premium land acquisition to mature sandalwood cultivation, every stage is carefully managed to create long-term value for investors.
          </p>

          {/* 5 rounded landscape thumbnails grid strip - dynamically scales to fit perfectly on all screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[24px] w-full py-2">
            {progressionImages.map((img, i) => (
              <div 
                key={i} 
                className="relative aspect-[1.1] rounded-[32px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.08)] border-2 border-[#F7F0E4] bg-white cursor-pointer hover:scale-[1.02] transition-transform duration-300 w-full"
              >
                {/* Landscape Crop Stage Image */}
                <img 
                  src={img.url} 
                  alt={img.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. Testimonials Section */}
      <section className="py-24 bg-[#F7F0E4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side text and reviews */}
            <div className="lg:col-span-8">
              <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3 font-sans">TRUSTED BY VISIONARY INVESTORS</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#12372A] mb-12 font-display" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Their Words,<br />Our Pride.
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((test, i) => (
                  <div key={i} className="bg-white border border-[#8B5E3C]/15 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex gap-0.5 text-[#C49A5A] mb-4">
                        {[...Array(test.stars)].map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-[#C49A5A]" />
                        ))}
                      </div>
                      <p className="text-[#2F3E2F] text-xs italic leading-relaxed mb-6 font-serif" style={{ fontFamily: "'Lora', serif" }}>
                        "{test.text}"
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-[#12372A] font-sans">{test.name}</h4>
                      <span className="text-[10px] text-[#8B5E3C] font-bold font-sans">{test.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side visual */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="group relative w-full max-w-[340px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90 hover:shadow-[0_0_30px_rgba(196,154,90,0.35)] transition-shadow duration-300">
                <img 
                  src="/investment-growth.jpg" 
                  alt="Investment Growth and Wealth Creation" 
                  className="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-300 ease-in-out" 
                />
                {/* Subtle dark overlay to blend naturally */}
                <div className="absolute inset-0 bg-[#12372A]/10 pointer-events-none transition-opacity duration-300 group-hover:opacity-0" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Investor Inquiry Section (REDESIGNED TO EXACT REFERENCE STYLE) */}
      <section id="investor-inquiry" className="py-24 bg-[#F7F0E4] relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 w-full">
          
          {/* Cream inquiry panel container */}
          <div className="bg-[#F3E8D2] border border-[#C49A5A] rounded-[28px] shadow-[0_12px_35px_rgba(0,0,0,0.08)] relative overflow-hidden p-8 md:p-12 w-full flex flex-col lg:flex-row gap-12 items-center min-h-[500px]">
            
            {/* Sandalwood composition logs and oil bowl overlay at bottom-left */}
            <img 
              src="/sandalwood_composition.png" 
              alt="Premium Sandalwood logs and oil bowl" 
              className="absolute bottom-[-15px] left-[-30px] w-[280px] h-auto object-contain select-none pointer-events-none z-10 hidden lg:block" 
            />

            {/* LEFT SIDE (Inquiry details) */}
            <div className="w-full lg:w-[48%] flex flex-col items-start text-left lg:pr-8 relative z-20 pb-0 lg:pb-16">
              {/* Small Label */}
              <div className="flex items-center gap-1.5 mb-4">
                <span className="text-[#8B5E3C] text-[10px] font-bold tracking-[2px] uppercase font-sans">
                  INVESTOR ENQUIRY
                </span>
                <Leaf className="w-3.5 h-3.5 text-[#C49A5A] fill-[#C49A5A]/20 rotate-45" />
              </div>

              {/* Heading */}
              <h2 
                className="font-serif text-3xl md:text-[40px] font-semibold text-[#12372A] leading-[1.1] mb-6 font-display" 
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Begin Your Sandalwood<br />Investment Journey
              </h2>

              {/* Description */}
              <p className="text-[#3B2416] text-sm md:text-[15px] leading-[1.6] mb-10 font-sans max-w-md">
                Fill in your details and our investment advisors will connect with you to guide you through our plots, process, and long-term opportunities.
              </p>

              {/* Trust Icons Row */}
              <div className="grid grid-cols-4 gap-3 w-full max-w-[400px]">
                {[
                  { label: 'Secure\nInformation', icon: ShieldCheck },
                  { label: 'Expert\nGuidance', icon: Award },
                  { label: 'Transparent\nProcess', icon: Sprout },
                  { label: 'Long-Term\nWealth', icon: Leaf }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center group p-2 rounded-xl bg-[rgba(255,248,235,0.88)] backdrop-blur-sm border border-[#C49A5A]/30 shadow-sm relative z-20 hover:shadow-md transition-shadow">
                    <div className="w-8 h-8 rounded-full bg-[#12372A]/5 flex items-center justify-center mb-2 text-[#C49A5A]">
                      <item.icon className="w-4 h-4 stroke-[1.5] text-[#C49A5A]" />
                    </div>
                    <span className="text-[8.5px] sm:text-[9px] font-bold text-[#12372A] leading-tight whitespace-pre-line font-sans">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE (Premium Form Grid) */}
            <div className="w-full lg:w-[52%] relative z-20">
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                
                {/* Full Name */}
                <div className="relative">
                  <input
                    {...register('fullName')}
                    className="w-full bg-[#F7F0E4] border border-[rgba(139,94,60,0.25)] rounded-lg px-4 py-3.5 text-xs text-[#1E1E1A] placeholder-[#8B5E3C] focus:outline-none focus:border-[#C49A5A] pr-10 font-sans font-bold"
                    placeholder="Full Name"
                  />
                  <User className="absolute right-3.5 top-3.5 w-4 h-4 text-[#8B5E3C]/60 stroke-[1.25]" />
                  {errors.fullName && <p className="text-red-500 text-[9px] mt-1 text-left font-sans">{errors.fullName.message}</p>}
                </div>

                {/* Email Address */}
                <div className="relative">
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full bg-[#F7F0E4] border border-[rgba(139,94,60,0.25)] rounded-lg px-4 py-3.5 text-xs text-[#1E1E1A] placeholder-[#8B5E3C] focus:outline-none focus:border-[#C49A5A] pr-10 font-sans font-bold"
                    placeholder="Email Address"
                  />
                  <Mail className="absolute right-3.5 top-3.5 w-4 h-4 text-[#8B5E3C]/60 stroke-[1.25]" />
                  {errors.email && <p className="text-red-500 text-[9px] mt-1 text-left font-sans">{errors.email.message}</p>}
                </div>

                {/* Phone Number */}
                <div className="relative">
                  <input
                    {...register('phone')}
                    className="w-full bg-[#F7F0E4] border border-[rgba(139,94,60,0.25)] rounded-lg px-4 py-3.5 text-xs text-[#1E1E1A] placeholder-[#8B5E3C] focus:outline-none focus:border-[#C49A5A] pr-10 font-sans font-bold"
                    placeholder="Phone Number"
                  />
                  <Phone className="absolute right-3.5 top-3.5 w-4 h-4 text-[#8B5E3C]/60 stroke-[1.25]" />
                  {errors.phone && <p className="text-red-500 text-[9px] mt-1 text-left font-sans">{errors.phone.message}</p>}
                </div>

                {/* Investment Interest */}
                <div className="relative">
                  <select
                    {...register('investmentInterest')}
                    className="w-full bg-[#F7F0E4] border border-[rgba(139,94,60,0.25)] rounded-lg px-4 py-3.5 text-xs text-[#1E1E1A] placeholder-[#8B5E3C] focus:outline-none focus:border-[#C49A5A] appearance-none pr-10 font-sans font-bold"
                  >
                    <option value="">Investment Interest</option>
                    <option value="Single Plot">Single Plot</option>
                    <option value="Multiple Plots">Multiple Plots</option>
                    <option value="Commercial Partner">Commercial Partner</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-[#8B5E3C]/60 pointer-events-none stroke-[1.25]" />
                  {errors.investmentInterest && <p className="text-red-500 text-[9px] mt-1 text-left font-sans">{errors.investmentInterest.message}</p>}
                </div>

                {/* Budget Range */}
                <div className="relative">
                  <select
                    {...register('budgetRange')}
                    className="w-full bg-[#F7F0E4] border border-[rgba(139,94,60,0.25)] rounded-lg px-4 py-3.5 text-xs text-[#1E1E1A] placeholder-[#8B5E3C] focus:outline-none focus:border-[#C49A5A] appearance-none pr-10 font-sans font-bold"
                  >
                    <option value="">Preferred Budget Range</option>
                    <option value="₹10 Lakhs - ₹25 Lakhs">₹10 Lakhs - ₹25 Lakhs</option>
                    <option value="₹25 Lakhs - ₹50 Lakhs">₹25 Lakhs - ₹50 Lakhs</option>
                    <option value="₹50 Lakhs - ₹1 Crore">₹50 Lakhs - ₹1 Crore</option>
                    <option value="₹1 Crore+">₹1 Crore+</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-[#8B5E3C]/60 pointer-events-none stroke-[1.25]" />
                  {errors.budgetRange && <p className="text-red-500 text-[9px] mt-1 text-left font-sans">{errors.budgetRange.message}</p>}
                </div>

                {/* Plot Size */}
                <div className="relative">
                  <select
                    {...register('plotSize')}
                    className="w-full bg-[#F7F0E4] border border-[rgba(139,94,60,0.25)] rounded-lg px-4 py-3.5 text-xs text-[#1E1E1A] placeholder-[#8B5E3C] focus:outline-none focus:border-[#C49A5A] appearance-none pr-10 font-sans font-bold"
                  >
                    <option value="">Preferred Plot Size</option>
                    <option value="0.25 Acres">0.25 Acres</option>
                    <option value="0.50 Acres">0.50 Acres</option>
                    <option value="1.00 Acres">1.00 Acres</option>
                    <option value="2.00+ Acres">2.00+ Acres</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-[#8B5E3C]/60 pointer-events-none stroke-[1.25]" />
                  {errors.plotSize && <p className="text-red-500 text-[9px] mt-1 text-left font-sans">{errors.plotSize.message}</p>}
                </div>

                {/* Message Field */}
                <div className="relative col-span-1 md:col-span-2">
                  <textarea
                    {...register('message')}
                    rows={3}
                    className="w-full bg-[#F7F0E4] border border-[rgba(139,94,60,0.25)] rounded-lg px-4 py-3 text-xs text-[#1E1E1A] placeholder-[#8B5E3C] focus:outline-none focus:border-[#C49A5A] pr-10 font-sans font-bold"
                    placeholder="Message (Optional)"
                  />
                  <span className="absolute right-3.5 top-3 text-[11px] text-[#8B5E3C]/50">✍️</span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="col-span-1 md:col-span-2 w-full bg-[#0B2F24] hover:bg-[#12372A] text-white py-4 rounded-full font-bold uppercase tracking-wider text-xs border border-white/5 shadow-lg flex items-center justify-center gap-2 font-sans transition-colors"
                >
                  {loading ? 'Submitting Inquiry...' : 'Submit Inquiry'} <Leaf className="w-3.5 h-3.5 text-[#C49A5A]" />
                </button>

                {/* Below button team note */}
                <div className="col-span-1 md:col-span-2 flex items-center justify-center gap-2 mt-2">
                  <ShieldCheck className="w-4 h-4 text-[#C49A5A]" />
                  <span className="text-[10px] text-[#12372A] font-bold font-sans">
                    Our team will contact you within 24 hours.
                  </span>
                </div>

              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Visit Our Investment Site */}
      <SiteVisitSection />
    </div>
  );
}
