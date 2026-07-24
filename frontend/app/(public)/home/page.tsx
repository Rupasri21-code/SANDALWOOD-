'use client';

import Link from 'next/link';
import {
  useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  X,
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
  Play,
  ArrowRight,
  Users,
  Compass,
  Plus,
  Minus,
  Map,
  Building2,
  Landmark,
  FileSignature,
  Handshake,
  Footprints,
  Dumbbell,
  Waves,
  Smile,
  FlagTriangleRight,
  Utensils,
  FileText,
  Download,
  Calendar,
  Building,
  AlertTriangle,
  Castle,
  Zap
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import SiteVisitSection from '@/components/public/site-visit-section';
import InvestmentCalculator from '@/components/public/investment-calculator';
import WhyRedSandalwood from '@/components/public/why-red-sandalwood';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ClubhouseAmenities from '@/components/public/clubhouse-amenities';
import WhatsAppWidget from '@/components/public/whatsapp-widget';

// Form validation schema
const inquirySchema = z.object({
  fullName: z.string()
    .min(3, 'Full name must be at least 3 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Full Name can only contain letters'),
  email: z.string().email('Invalid email address'),
  phone: z.string()
    .length(10, 'Phone number must be exactly 10 digits')
    .regex(/^[0-9]+$/, 'Phone number must contain only numbers'),
  investmentInterest: z.string().min(1, 'Please select your interest'),
  budgetRange: z.string().min(1, 'Please select your budget'),
  plotSize: z.string().min(1, 'Please select your preferred plot size'),
  message: z.string().optional(),
  agreePrivacy: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the Privacy Policy' }),
  }),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the Terms & Conditions' }),
  }),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

const stats = [
  {
    value: '100+',
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
    value: '12+',
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
    title: 'Established Market Relevance',
    description: 'Used across fragrance, wellness, traditional, and premium product industries, sandalwood continues to hold recognised commercial significance.',
    icon: Globe,
  },
  {
    title: 'Specialised Cultivation',
    description: 'Sandalwood requires time, suitable growing conditions, and structured plantation management throughout its cultivation journey.',
    icon: Award,
  },
  {
    title: 'A Tangible Green Asset',
    description: 'A plantation represents a physical, nature-based asset whose development can be observed and managed through each stage of growth.',
    icon: Leaf,
  },
];

const journeySteps = [
  {
    num: '01',
    title: 'Land Acquisition',
    description: 'Prime 100 acres near Dornala, secured with clear titles.',
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

const initialProgressionImages = [
  { url: '/gallery_01.png', title: 'Raw Land' },
  { url: '/gallery_02.jpg', title: 'Fresh Sandalwood Saplings' },
  { url: '/gallery_03.jpg', title: '3-Month Growth Stage' },
  { url: '/gallery_04.jpg', title: 'Developed Sandalwood Plantation' },
  { url: '/gallery_05.png', title: 'Mature Sandalwood Trees' },
];

const initialTestimonials = [
  {
    text: "Investing in Chandhan Nilayam was one of the best decisions I've made. The transparency and regular updates give me complete peace of mind.",
    name: "Ramesh B.",
    location: "Hyderabad",
    stars: 5,
  },
  {
    text: "The team is professional, the land is beautiful, and the vision is truly long-term. I'm proud to be part of this green heritage.",
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

const heroStats = [
  {
    value: '100+',
    label: 'ACRES OF PREMIUM LAND',
    icon: Trees,
  },
  {
    value: '400+',
    label: 'PREMIUM PLOTS',
    icon: MapPin,
  },
  {
    value: '12+',
    label: 'YEARS OF GROWTH',
    icon: Sprout,
  },
  {
    value: '500+',
    label: 'HAPPY INVESTORS',
    icon: Users,
  },
];

const faqData = [
  {
    question: "What are the long-term benefits of investing in Chandhan Nilayam?",
    answer: "Investing in Chandhan Nilayam offers high capital appreciation through premium land ownership coupled with high-yield sandalwood cultivation. As sandalwood is a globally scarce and highly valued commodity, investors stand to gain substantial returns at harvest, alongside stable land value growth and tax-free agricultural income."
  },
  {
    question: "Why is sandalwood considered a valuable long-term investment?",
    answer: "Sandalwood is globally renowned for its fragrance, medicinal properties, and cultural significance, yet natural reserves are rapidly depleting. Cultivated sandalwood represents a secure, high-value asset class with a consistent supply-demand deficit, ensuring strong price appreciation and high compounding returns over its 12-year growth cycle."
  },
  {
    question: "Are there any future developments planned around the project?",
    answer: "Yes, Chandhan Nilayam is located in a high-growth corridor. Future developments include security enhancements, drip-irrigation infrastructure, premium resort facilities, and eco-tourism initiatives that will further elevate the land value and provide lifestyle benefits for investors."
  },
  {
    question: "How does the surrounding hill station environment add value to the investment?",
    answer: "The project's proximity to scenic hill stations offers optimal soil chemistry, altitude, and climatic conditions for superior sandalwood heartwood formation. This unique microclimate accelerates growth and enhances oil quality, directly increasing the market value of the crop compared to other locations."
  },
  {
    question: "Will investors receive complimentary Srisailam Darshan tickets?",
    answer: "Yes, as a token of appreciation and to welcome our investors into the Chandhan Nilayam family, we provide complimentary VIP Darshan tickets to the sacred Srisailam temple during their visits to the plantation site."
  },
  {
    question: "How can investors monitor their plantation and investment progress?",
    answer: "Investors receive access to a secure digital portal providing 24/7 transparency. You can view regular high-resolution photographs, growth status reports, soil health analysis, video updates, and legal documentation of your specific plot, ensuring full peace of mind."
  },
  {
    question: "Is Chandhan Nilayam located near major spiritual destinations?",
    answer: "Yes, the estate is strategically positioned near major spiritual hubs, including the historic Srisailam Temple corridor. This location benefits from excellent highway connectivity, high tourism footfall, and spiritual significance, driving rapid regional development and land appreciation."
  },
  {
    question: "Can investors visit the plantation and experience the location?",
    answer: "Absolutely. We encourage our investors to visit Chandhan Nilayam. We organize guided site visits where you can inspect your plot, experience the tranquil environment, meet our plantation experts, and witness the advanced agricultural techniques being employed."
  },
  {
    question: "Is the investment suitable for future generations?",
    answer: "Yes, this is an ideal heritage asset. The combination of secure, registered land ownership and the long-term compounding value of sandalwood makes it a perfect generational gift, ensuring wealth preservation and a green heritage for your children and grandchildren."
  },
  {
    question: "Why choose Chandhan Nilayam over traditional investment options?",
    answer: "Traditional assets like bank deposits or equities are susceptible to inflation and market volatility. Chandhan Nilayam provides a tangible, real-estate backed asset that grows biologically, yielding far higher returns than gold or index funds while offering absolute security and transparent management."
  },
  {
    question: "What lifestyle and tourism developments are planned around the project?",
    answer: "Plans are underway to develop a luxury eco-resort, wellness center, and nature trails adjacent to the plantation. Investors will enjoy exclusive membership benefits, offering a serene weekend getaway close to nature while the sandalwood crop matures."
  },
  {
    question: "How does the investor portal provide transparency and regular updates?",
    answer: "The portal acts as a single source of truth for your investment. It features digitized title deeds, geo-tagged plot coordinates, maintenance logs, and agricultural reports updated quarterly by our team of expert agronomists, giving you complete visibility from anywhere in the world."
  }
];

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeSplash(true);
    }, 800);
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 1200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  const [loading, setLoading] = useState(false);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [prevHeroImage, setPrevHeroImage] = useState<number | null>(null);

  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [activeTestimonials, setActiveTestimonials] = useState<any[]>(initialTestimonials);
  const [galleryItems, setGalleryItems] = useState<any[]>(initialProgressionImages);
  const [reviewLocation, setReviewLocation] = useState("");
  const [activeFaqs, setActiveFaqs] = useState<any[]>(faqData);
  
  // Dynamic Content State
  const [homeContent, setHomeContent] = useState<any>({
    heroTitle: 'Invest in Nature.\nGrow Your Wealth.',
    heroSubtitle: 'Discover premium sandalwood estates where nature, long-term value, and generational wealth grow together. Thoughtfully cultivated with a vision for the future, every estate represents enduring value, timeless growth, and lasting prosperity designed to benefit generations to come.',
    badgeText: 'EXCLUSIVE SANDALWOOD ESTATES • DORNALA',
    statsAum: '100+',
    statsInvestors: '500+',
    statsGrowth: '12+',
  });

  const [publicContent, setPublicContent] = useState<any>({
    aboutStory: '',
    locationAdvantages: '',
    companyVision: '',
    companyMission: '',
  });

  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        const [testimonialsRes, homeRes, galleryRes, faqsRes, publicRes] = await Promise.all([
          api.get('/testimonials').catch(() => null),
          api.get('/content/home').catch(() => null),
          api.get('/gallery').catch(() => null),
          api.get('/faqs').catch(() => null),
          api.get('/content/public').catch(() => null)
        ]);
        
        if (testimonialsRes?.data?.data && testimonialsRes.data.data.length > 0) {
          const fetched = testimonialsRes.data.data.map((t: any) => ({
            text: t.text,
            name: t.name,
            location: t.location,
            investment: t.investment,
            stars: t.rating || 5
          }));
          setActiveTestimonials(fetched);
        }
        
        if (homeRes?.data?.data) {
          setHomeContent((prev: any) => ({ ...prev, ...homeRes.data.data }));
        }

        if (publicRes?.data?.data) {
          setPublicContent((prev: any) => {
            const data = publicRes.data.data;
            return {
              aboutStory: data.aboutStory && data.aboutStory.trim() !== '' ? data.aboutStory : prev.aboutStory,
              locationAdvantages: data.locationAdvantages && data.locationAdvantages.trim() !== '' ? data.locationAdvantages : prev.locationAdvantages,
              companyVision: data.companyVision && data.companyVision.trim() !== '' ? data.companyVision : prev.companyVision,
              companyMission: data.companyMission && data.companyMission.trim() !== '' ? data.companyMission : prev.companyMission,
            };
          });
        }

        if (galleryRes?.data?.data && galleryRes.data.data.length > 0) {
          const validGallery = galleryRes.data.data.filter((item: any) => 
            item.image_url && typeof item.image_url === 'string' && item.image_url.trim().startsWith('http')
          );

          if (validGallery.length > 0) {
            const fetchedGallery = validGallery.map((item: any) => ({
              url: item.image_url,
              title: item.title || 'Gallery Image',
            }));
            setGalleryItems(fetchedGallery);
          }
        }

        if (faqsRes?.data?.data && faqsRes.data.data.length > 0) {
          const fetchedFaqs = faqsRes.data.data.map((f: any) => ({
            question: f.question,
            answer: f.answer
          }));
          setActiveFaqs([...faqData, ...fetchedFaqs]);
        }
      } catch (error) {
        console.error("Failed to fetch dynamic data", error);
      }
    };
    fetchDynamicData();
  }, []);
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const heroSequence = [
    '/media__1784542732304.jpg',
    '/media__1784542781834.jpg',
    '/media__1784542836552.jpg',
    '/media__1784543215344.jpg',
    '/media__1784543244820.jpg',
    '/media__1784541866089.jpg',
    '/media__1784541877736.jpg',
    '/media__1784541925264.jpg',
    '/media__1784541990743.jpg',
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
    setValue,
    formState: { errors },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    mode: 'onChange',
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Chandhan Nilayam Investments',
    image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chandhannilayam.com'}/sandalwood_hero_bg.png`,
    description: 'Premium sandalwood land investment and plantation management platform near Dornala, Andhra Pradesh.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dornala',
      addressRegion: 'Andhra Pradesh',
      addressCountry: 'IN',
    },
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chandhannilayam.com',
    priceRange: '₹₹₹',
  };

  return (
    <div className="bg-[#F7F0E4] min-h-screen text-[#1E1E1A] font-sans overflow-x-hidden relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {showSplash && (
        <div className={`fixed inset-0 z-[10000] bg-[#07130F] flex flex-col items-center justify-center transition-all duration-1000 ${fadeSplash ? 'opacity-0 scale-105' : 'opacity-100 scale-100'} overflow-hidden`}>
          {/* Subtle Background Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(196,154,90,0.12),_transparent_70%)] pointer-events-none" style={{ animation: 'pulse 4s infinite' }} />
          <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-[#216643]/10 rounded-full blur-[100px] pointer-events-none" style={{ animation: 'pulse 6s infinite alternate' }} />
          <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-[#C49A5A]/10 rounded-full blur-[80px] pointer-events-none" style={{ animation: 'pulse 5s infinite alternate-reverse' }} />
          
          {/* Scattered Floating Leaves (Simulation) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <Leaf className="absolute top-[15%] left-[25%] w-6 h-6 text-[#4CAF50] fill-[#4CAF50] opacity-60 blur-[1px]" style={{ transform: 'rotate(-45deg)', animation: 'float 6s ease-in-out infinite' }} />
            <Leaf className="absolute top-[35%] right-[20%] w-8 h-8 text-[#8BC34A] fill-[#8BC34A] opacity-50 blur-[2px]" style={{ transform: 'rotate(45deg)', animation: 'float 7s ease-in-out infinite 1s' }} />
            <Leaf className="absolute bottom-[30%] left-[20%] w-7 h-7 text-[#4CAF50] fill-[#4CAF50] opacity-70 blur-[1px]" style={{ transform: 'rotate(12deg)', animation: 'float 5s ease-in-out infinite 2s' }} />
            <Leaf className="absolute bottom-[25%] right-[25%] w-10 h-10 text-[#8BC34A] fill-[#8BC34A] opacity-80" style={{ transform: 'rotate(-12deg)', animation: 'float 8s ease-in-out infinite 0.5s' }} />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center gap-6">
            
            {/* Highly Attractive Multi-Layered Golden Circular Animation */}
            <div className="relative flex items-center justify-center w-[260px] h-[260px] md:w-[320px] md:h-[320px]">
              
              {/* Layer 1: Outer Slow Spinning Dashed Ring */}
              <div className="absolute inset-[-15px] rounded-full border-[1.5px] border-dashed border-[#C49A5A]/40 shadow-[0_0_20px_rgba(196,154,90,0.1)]" style={{ animation: 'spin-reverse 15s linear infinite' }} />

              {/* Layer 2: Main Golden Ring with intense glow */}
              <div className="absolute inset-0 rounded-full border border-[#C49A5A]/60 shadow-[0_0_50px_rgba(196,154,90,0.3)]" style={{ animation: 'spin 10s linear infinite' }}>
                <div className="absolute top-0 right-[15%] w-2.5 h-2.5 bg-[#FFF8DC] rounded-full shadow-[0_0_15px_6px_rgba(255,255,255,0.9),_0_0_30px_12px_rgba(196,154,90,0.8)]" />
                <div className="absolute bottom-0 left-[15%] w-2 h-2 bg-[#FFD700] rounded-full shadow-[0_0_15px_5px_rgba(255,255,255,0.8),_0_0_25px_10px_rgba(196,154,90,0.7)]" />
              </div>

              {/* Center Glow Behind Logo */}
              <div className="absolute inset-[30px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(196,154,90,0.3),_transparent_70%)]" style={{ animation: 'pulse 3s infinite' }} />
              
              {/* Logo inside */}
              <div className="relative z-10 scale-[1.1] md:scale-[1.2]" style={{ animation: 'pulse 3s ease-in-out infinite' }}>
                <img src="/logo.png" alt="Chandhan Nilayam Logo" className="w-[280px] md:w-[350px] object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]" />
              </div>
            </div>

            {/* Text Content */}
            <div className="flex flex-col items-center mt-6">
              <h2 
                className="font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF8DC] to-[#D4AF37] text-3xl md:text-4xl font-bold tracking-wider mb-2 drop-shadow-[0_2px_15px_rgba(196,154,90,0.4)]"
                style={{ fontFamily: "'Cormorant Garamond', serif", animation: 'pulse 3s ease-in-out infinite' }}
              >
                Loading Chandhan Nilayam...
              </h2>
              <p className="font-sans text-[#E5C99F] text-sm md:text-base font-semibold tracking-[0.05em] uppercase" style={{ animation: 'pulse 3s ease-in-out infinite 0.5s' }}>
                Preparing Your Heritage
              </p>
            </div>

            {/* Premium Glowing Progress Bar */}
            <div className="w-[280px] md:w-[350px] h-[4px] bg-[#0A120E] rounded-full overflow-hidden relative border border-[#C49A5A]/40 shadow-[0_0_20px_rgba(196,154,90,0.2)] mt-4">
              <div className="absolute top-0 left-0 h-full w-[50%] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent rounded-full opacity-90 shadow-[0_0_15px_#FFD700]" style={{ animation: 'loading-bar-sweep 2s ease-in-out infinite' }} />
            </div>
            
          </div>
          
          {/* Custom Keyframes */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes loading-bar-sweep {
              0% { transform: translateX(-150%); }
              50% { transform: translateX(250%); }
              100% { transform: translateX(-150%); }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-20px); }
            }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes spin-reverse {
              from { transform: rotate(360deg); }
              to { transform: rotate(0deg); }
            }
          `}} />
        </div>
      )}

      {/* 2. Premium Hero Full-Screen Background Image Slider */}
      <section 
        className="relative flex items-center justify-center overflow-hidden w-full h-[calc(100vh-80px)] min-h-[750px] max-md:h-[650px] max-md:min-h-[600px]"
      >
        {/* Background Image Carousel */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          {heroSequence.map((src, idx) => {
            let positionClass = '';
            if (idx === currentHeroImage) {
              positionClass = 'opacity-100 z-10 transition-all duration-[2000ms] ease-in-out scale-105';
            } else if (idx === prevHeroImage) {
              positionClass = 'opacity-0 z-0 transition-all duration-[2000ms] ease-in-out scale-105';
            } else {
              positionClass = 'opacity-0 z-0 transition-none scale-100';
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
          className="absolute inset-0 z-20 pointer-events-none max-md:bg-black/30" 
          style={{ 
            background: 'linear-gradient(90deg, rgba(11, 47, 36, 0.60), rgba(11, 47, 36, 0.35), rgba(11, 47, 36, 0.50))' 
          }} 
        />

        {/* Fixed Hero Content on Top */}
        <div className="relative z-30 max-w-5xl mx-auto px-6 w-full text-center flex flex-col items-center justify-center pb-12 pt-24 sm:pt-0">
          {/* Badge */}
          <div 
            className="inline-flex flex-col sm:flex-row items-center justify-center text-center gap-1 sm:gap-2 rounded-[18px] sm:rounded-full px-4 sm:px-5 py-2 sm:py-2 mb-4 sm:mb-6 border bg-black/35 backdrop-blur-md max-w-[90vw]"
            style={{
              borderColor: '#C49A5A',
            }}
          >
            <Compass className="w-3 h-3 sm:w-4 sm:h-4 text-[#C49A5A] shrink-0" />
            <span 
              className="text-[9px] sm:text-[11px] font-semibold tracking-[1px] sm:tracking-[3px] uppercase leading-snug sm:leading-none"
              style={{ 
                color: '#C49A5A',
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              {homeContent.badgeText}
            </span>
          </div>



          {/* Heading */}
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[68px] font-bold tracking-tight leading-[1.15] mb-4 sm:mb-6 whitespace-pre-line"
            style={{ 
              color: '#F7F2E8',
              fontFamily: "'Cormorant Garamond', serif", 
              textShadow: '0 4px 24px rgba(0, 0, 0, 0.5)' 
            }}
          >
            {homeContent.heroTitle}
          </h1>

          {/* Gold Leaf Divider */}
          <div className="flex items-center gap-4 mb-6 w-full max-w-[280px] justify-center">
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-[#C49A5A]/60" />
            <div className="text-[#C49A5A] flex items-center justify-center">
              <Sprout className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-[#C49A5A]/60" />
          </div>

          {/* Subheading */}
          <p 
            className="text-[15px] md:text-[18px] max-w-2xl leading-relaxed mb-10" 
            style={{ 
              color: '#FFFFFF',
              fontFamily: "'Lora', serif", 
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.4)' 
            }}
          >
            {homeContent.heroSubtitle}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full sm:w-auto justify-center items-center px-2">
            <a href="#opportunity" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto hover:opacity-90 text-white shadow-xl px-6 sm:px-10 py-6 sm:py-7 text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-full transition-all duration-300 font-sans flex items-center justify-center gap-2 border border-[#C49A5A]/20"
                style={{ backgroundColor: '#C49A5A' }}
              >
                <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" /> EXPLORE THE OPPORTUNITY
              </Button>
            </a>
            <a href="#investor-inquiry" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto hover:opacity-90 text-white shadow-xl px-6 sm:px-10 py-6 sm:py-7 text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-full transition-all border border-[#C49A5A]/40 font-sans flex items-center justify-center gap-2"
                style={{ backgroundColor: '#12372A' }}
              >
                SCHEDULE CONSULTATION <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </Button>
            </a>
          </div>
        </div>

        {/* CURVED TRANSITION: Organic luxury curved Divider with Gold Trace Line */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-25">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[65px]">
            {/* Golden wave trace line */}
            <path d="M0,35 C300,105 600,15 900,105" fill="none" stroke="#C49A5A" strokeWidth="2" opacity="0.4" />
            <path d="M0,35 C300,105 600,15 900,105 L1200,55 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* 3. Floating Premium Statistics Section */}
      <section className="relative z-30 -mt-16 md:-mt-20 px-6 max-w-[1080px] mx-auto w-full">
        <div 
          className="rounded-[24px] py-6 px-8 md:py-7 md:px-9 shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:border-[#D9B36D]/60 transition-all duration-500 group/card border border-[#D9B36D]/30 bg-gradient-to-br from-[#12402B] to-[#0A2418] backdrop-blur-xl"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 lg:gap-y-0">
            {/* Stat 1: Acres */}
            <div className="flex items-center gap-3.5 group/item relative px-2 lg:px-6 border-r border-[#D9B36D]/15 lg:border-r-0 border-b border-[#D9B36D]/15 pb-4 lg:pb-0 lg:border-b-0">
              <div className="relative flex items-center justify-center w-12 h-12 md:w-[54px] md:h-[54px] rounded-full border border-[#D9B36D]/30 flex-shrink-0 group-hover/item:border-[#D9B36D]/60 transition-colors duration-500 bg-[#D9B36D]/5">
                <Trees className="w-5.5 h-5.5 md:w-6 md:h-6 text-[#D9B36D] relative z-10 transition-transform duration-500 group-hover/item:-translate-y-1" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-2xl md:text-[36px] font-bold tracking-tight leading-none transition-transform duration-500 group-hover/item:scale-102 select-none origin-left text-[#D9B36D]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {homeContent.statsAum || '100+'}
                </span>
                <span className="text-[9px] md:text-[11px] font-semibold tracking-[1px] uppercase select-none mt-1 leading-tight animate-none" style={{ color: '#F7F2E8', fontFamily: "'Montserrat', sans-serif" }}>
                  ACRES OF PREMIUM LAND
                </span>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[50%] w-[1px] hidden lg:block"><div className="h-full w-full bg-[#D9B36D]/20" /></div>
            </div>

            {/* Stat 2: Plots */}
            <div className="flex items-center gap-3.5 group/item relative px-2 lg:px-6 border-b border-[#D9B36D]/15 pb-4 lg:pb-0 lg:border-b-0 lg:border-r-0">
              <div className="relative flex items-center justify-center w-12 h-12 md:w-[54px] md:h-[54px] rounded-full border border-[#D9B36D]/30 flex-shrink-0 group-hover/item:border-[#D9B36D]/60 transition-colors duration-500 bg-[#D9B36D]/5">
                <MapPin className="w-5.5 h-5.5 md:w-6 md:h-6 text-[#D9B36D] relative z-10 transition-transform duration-500 group-hover/item:-translate-y-1" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-2xl md:text-[36px] font-bold tracking-tight leading-none transition-transform duration-500 group-hover/item:scale-102 select-none origin-left text-[#D9B36D]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  400+
                </span>
                <span className="text-[9px] md:text-[11px] font-semibold tracking-[1px] uppercase select-none mt-1 leading-tight animate-none" style={{ color: '#F7F2E8', fontFamily: "'Montserrat', sans-serif" }}>
                  PREMIUM PLOTS
                </span>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[50%] w-[1px] hidden lg:block"><div className="h-full w-full bg-[#D9B36D]/20" /></div>
            </div>

            {/* Stat 3: Growth Cycle */}
            <div className="flex items-center gap-3.5 group/item relative px-2 lg:px-6 border-r border-[#D9B36D]/15 lg:border-r-0 pt-4 lg:pt-0">
              <div className="relative flex items-center justify-center w-12 h-12 md:w-[54px] md:h-[54px] rounded-full border border-[#D9B36D]/30 flex-shrink-0 group-hover/item:border-[#D9B36D]/60 transition-colors duration-500 bg-[#D9B36D]/5">
                <Sprout className="w-5.5 h-5.5 md:w-6 md:h-6 text-[#D9B36D] relative z-10 transition-transform duration-500 group-hover/item:-translate-y-1" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-2xl md:text-[36px] font-bold tracking-tight leading-none transition-transform duration-500 group-hover/item:scale-102 select-none origin-left text-[#D9B36D]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {homeContent.statsGrowth || '12+'}
                </span>
                <span className="text-[9px] md:text-[11px] font-semibold tracking-[1px] uppercase select-none mt-1 leading-tight animate-none" style={{ color: '#F7F2E8', fontFamily: "'Montserrat', sans-serif" }}>
                  YEARS OF GROWTH
                </span>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[50%] w-[1px] hidden lg:block"><div className="h-full w-full bg-[#D9B36D]/20" /></div>
            </div>

            {/* Stat 4: Investors */}
            <div className="flex items-center gap-3.5 group/item relative px-2 lg:px-6 pt-4 lg:pt-0">
              <div className="relative flex items-center justify-center w-12 h-12 md:w-[54px] md:h-[54px] rounded-full border border-[#D9B36D]/30 flex-shrink-0 group-hover/item:border-[#D9B36D]/60 transition-colors duration-500 bg-[#D9B36D]/5">
                <Users className="w-5.5 h-5.5 md:w-6 md:h-6 text-[#D9B36D] relative z-10 transition-transform duration-500 group-hover/item:-translate-y-1" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-2xl md:text-[36px] font-bold tracking-tight leading-none transition-transform duration-500 group-hover/item:scale-102 select-none origin-left text-[#D9B36D]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {homeContent.statsInvestors || '500+'}
                </span>
                <span className="text-[9px] md:text-[11px] font-semibold tracking-[1px] uppercase select-none mt-1 leading-tight animate-none" style={{ color: '#F7F2E8', fontFamily: "'Montserrat', sans-serif" }}>
                  HAPPY INVESTORS
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* 4. About Our Heritage / Vision & Mission Section */}
      <section id="about-heritage" className="py-[80px] xl:py-[100px] bg-[#F7F0E4] relative overflow-hidden">
        <div className="max-w-[1480px] mx-auto px-6 md:px-12 xl:px-[60px]">
          <div className="flex flex-col xl:flex-row gap-16 xl:gap-20 items-start">
            
            {/* Left Column */}
            <div className="w-full xl:w-[46%] flex flex-col pt-4">
              
              {/* Eyebrow */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-[1px] bg-[#C49A5A]/65" />
                <span className="text-[#C49A5A] text-[11px] xl:text-xs font-semibold tracking-[0.20em] uppercase font-sans">
                  OUR HERITAGE
                </span>
              </div>
              
              {/* Heading */}
              <h2 className="flex flex-col mb-8">
                <span className="font-serif text-[42px] sm:text-[52px] xl:text-[72px] font-bold leading-[1.05] text-[#0B2F24] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  The Chandhan Nilayam
                </span>
                <span className="font-serif text-[38px] sm:text-[48px] xl:text-[64px] font-normal leading-[1.1] italic text-[#C49A5A] mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Story
                </span>
              </h2>
              
              {/* Decorative Divider */}
              <div className="flex items-center w-full max-w-md mb-8 opacity-70">
                <div className="h-[1px] flex-1 bg-[rgba(196,154,90,0.4)]" />
                <div className="px-3 text-[#C49A5A]">
                  <Leaf className="w-3 h-3 md:w-4 md:h-4 stroke-[1.5]" />
                </div>
                <div className="h-[1px] flex-1 bg-[rgba(196,154,90,0.4)]" />
              </div>
              
              {/* Story Content */}
              <div className="flex flex-col gap-6 mb-12 text-[#4F5D55] text-base md:text-lg xl:text-[19px] leading-[1.7] font-serif" style={{ fontFamily: "'Lora', serif" }}>
                {(publicContent.aboutStory || `Chandhan Nilayam was established with a singular vision: to create a secure and professionally managed destination where sustainable wealth creation and meaningful experiences coexist. Rooted in premium Red Sandalwood cultivation, the project combines advanced agroforestry practices with legally verified, clear-title land ownership, offering a foundation built on transparency, responsibility, and long-term value.\n\nMore than a plantation, Chandhan Nilayam has been thoughtfully planned as a nature-inspired lifestyle retreat where investors and their families can reconnect with nature, celebrate special occasions, enjoy weekend getaways, and create lasting memories. The community features a premium clubhouse for gatherings and events, beautifully landscaped gardens, walking tracks, a semi-open fitness zone, children's play area, visitor seating spaces, scenic hill views, and a golf practice area designed to enhance leisure and recreation in a peaceful natural environment.\n\nTo ensure comfort, convenience, and peace of mind, the development also includes wide internal roads, organized parking facilities, professionally managed 24×7 security, secure compound fencing, and seamless connectivity to nearby towns and essential services. Every element has been carefully planned to deliver a harmonious balance between nature, modern infrastructure, and premium community living.\n\nToday, Chandhan Nilayam stands as more than an investment—it is a destination where responsible plantation management, sustainable living, recreational experiences, and enduring family moments come together, creating a Sustainable Future that can be appreciated for generations to come.`)
                  .split('\n')
                  .filter((p: string) => p.trim() !== '')
                  .map((paragraph: string, idx: number) => (
                    <p key={idx} className="text-justify">
                      {paragraph.trim()}
                    </p>
                  ))}
              </div>

              {/* Bottom Left Quote Panel */}
              <div className="bg-[#F1E9D8] rounded-[20px] p-8 md:p-10 w-full flex flex-col items-center text-center">
                <span className="text-[#8B5E3C] text-[11px] md:text-xs font-semibold tracking-[0.15em] uppercase font-sans mb-4">
                  PREMIUM SANDALWOOD PLOTS NEAR DORNALA
                </span>
                <div className="w-12 h-[2px] bg-[#C49A5A] mb-6 opacity-60" />
                <p className="text-[#0B2F24] font-serif text-[22px] md:text-[30px] xl:text-[32px] italic leading-[1.4]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Building wealth today.<br />
                  Preserving nature for generations to come.<br />
                  Enjoying exclusive clubhouse and premium resort amenities.
                </p>
              </div>

            </div>

            {/* Right Column */}
            <div className="w-full xl:w-[54%] relative flex flex-col items-center xl:items-end">
              
              {/* Plantation Image */}
              <div className="relative w-full h-[500px] sm:h-[600px] xl:h-[720px] rounded-[32px] overflow-hidden">
                <img 
                  src="/our_heritage_image.png"
                  alt="Our Heritage Image"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Vision & Mission Panel */}
              <div 
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                }}
                className="group relative xl:absolute xl:bottom-12 xl:left-[-10%] w-full xl:w-[105%] mt-[-40px] xl:mt-0 bg-gradient-to-br from-[#12402B] to-[#0A2418] border border-[#D9B36D]/30 rounded-[28px] p-8 md:p-12 shadow-[0_12px_40px_rgba(0,0,0,0.4)] z-10 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:border-[#D9B36D]/60"
              >
                {/* Interactive Cursor Spotlight Glow */}
                <div 
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(217,179,109,0.08), transparent 40%)'
                  }}
                />
                
                {/* Panel Header */}
                <div className="flex flex-col items-center text-center mb-10">
                  <h3 className="text-[#F7F0E4] font-serif text-[32px] md:text-[40px] font-semibold mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Vision & Mission
                  </h3>
                  <div className="w-12 h-[2px] bg-[#D9B36D]" />
                </div>

                {/* Panel Content (Two Columns) */}
                <div className="flex flex-col md:flex-row gap-8 md:gap-0 relative">
                  
                  {/* Left: Our Vision */}
                  <div className="flex-1 md:pr-10 xl:pr-12 flex flex-col text-left">
                    <h4 className="text-[#D9B36D] font-serif text-[24px] md:text-[26px] font-medium mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Our Vision
                    </h4>
                    <p className="text-[#F7F0E4] text-[15px] md:text-[17px] leading-[1.6] font-sans opacity-90 whitespace-pre-line">
                      {publicContent.companyVision || "To build lasting trust by making every investor our highest priority. We aim to provide a secure, transparent, and professionally managed sandalwood investment opportunity that delivers sustainable long-term value while creating a nature-inspired destination where investments, relationships, and experiences grow together."}
                    </p>
                  </div>
                  
                  {/* Vertical Divider (Hidden on mobile) */}
                  <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#D9B36D]/30 -translate-x-1/2" />
                  
                  {/* Horizontal Divider (Visible only on mobile) */}
                  <div className="block md:hidden w-full h-[1px] bg-[#D9B36D]/30 my-2" />

                  {/* Right: Our Mission */}
                  <div className="flex-1 md:pl-10 xl:pl-12 flex flex-col text-left">
                    <h4 className="text-[#D9B36D] font-serif text-[24px] md:text-[26px] font-medium mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Our Mission
                    </h4>
                    <p className="text-[#F7F0E4] text-[15px] md:text-[17px] leading-[1.6] font-sans opacity-90 whitespace-pre-line">
                      {publicContent.companyMission || "To deliver sustainable, long-term green investment opportunities through scientific plantation management, advanced drip irrigation systems, transparent operations, and environmentally responsible practices, ensuring healthy plantation growth while maximizing long-term value for our investors and contributing to ecological restoration."}
                    </p>
                  </div>
                  
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4.5 The Sandalwood Opportunity Section */}
      <section id="opportunity" className="pt-20 pb-12 md:pt-24 md:pb-16 bg-[#F7F0E4] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid xl:grid-cols-12 gap-12 items-center">
            
            {/* Left Col - Headings & Copy */}
            <div className="xl:col-span-7">
              <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3 font-sans">THE SANDALWOOD OPPORTUNITY</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#12372A] mb-6 leading-tight font-display" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Nurtured by Nature.<br />Built for the Future.
              </h2>
              <p className="text-[#2F3E2F] text-base md:text-lg leading-relaxed mb-10 max-w-2xl font-serif" style={{ fontFamily: "'Lora', serif" }}>
                Sandalwood is a naturally valued resource recognised for its distinctive fragrance and diverse applications across perfumery, wellness, traditional practices, and premium products. Its long cultivation cycle and specialised growing requirements make professionally managed plantations an important part of its long-term value journey.
              </p>

              {/* Stacked columns in left panel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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

            <div className="xl:col-span-5 relative flex justify-center w-full">
              <div className="relative w-full max-w-[520px] aspect-[1.25] rounded-[2rem] md:rounded-[3rem] p-3 bg-[#F3E8D2] border border-[#C49A5A]/30 shadow-[0_30px_70px_rgba(139,94,60,0.25)] group hover:scale-[1.02] transition-all duration-500">
                <div className="w-full h-full rounded-[1.75rem] md:rounded-[2.5rem] overflow-hidden relative">
                  <img 
                    src="/sandalwood_showcase.png" 
                    alt="Premium Sandalwood Showcase" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5.5 Strategic Location Image Card (MOVED UP) */}
      <section id="location" className="py-16 md:py-24 bg-[#0A120E] relative overflow-hidden z-20 flex flex-col justify-center items-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(196,154,90,0.08),_transparent_70%)] pointer-events-none" />
        
        <div className="max-w-6xl w-full px-6 relative z-10 flex flex-col items-center">
          
          {/* Top: Map Image */}
          <div className="w-full relative rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-[#C49A5A]/30 group bg-[#0B2F24] mb-12">
            <img 
              src="/location-mapping.png" 
              alt="Strategic Location Map" 
              className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 border-[1.5px] border-transparent group-hover:border-[#C49A5A]/40 rounded-[1.5rem] md:rounded-[2.5rem] transition-colors duration-500 pointer-events-none" />
          </div>

          {/* Bottom: Text Content */}
          <div className="w-full text-center flex flex-col items-center space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-[#C49A5A] text-[10px] font-bold tracking-[2.5px] uppercase font-sans">
                STRATEGIC ADVANTAGE
              </span>
            </div>
            <h2 
              className="font-serif text-3xl md:text-4xl lg:text-[42px] font-semibold text-[#F7F0E4] leading-tight font-display"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              The Perfect Location
            </h2>
            <div className="w-16 h-[1.5px] bg-[#C49A5A]"></div>
            <div className="flex flex-col gap-4 text-[#B8C7BC] text-sm md:text-base leading-relaxed font-sans">
              {(publicContent.locationAdvantages || "Our plantation in Dornala is strategically positioned for optimal agricultural success. Featuring favorable soil quality, reliable water availability, and ideal climatic conditions, this location supports healthy sandalwood growth and accelerates heartwood development.\n\nSurrounded by breathtaking hill-station views and enhanced with premium lifestyle amenities including an exclusive clubhouse, luxury resort facilities, an international-standard golf course, and excellent road connectivity, Chandhan Nilayam offers the perfect balance of sustainable cultivation, modern comfort, and long-term investment value.\n\nThe seamless transportation network ensures efficient plantation management, easy accessibility, and strong potential for long-term asset appreciation.")
                .split('\n')
                .filter((p: string) => p.trim() !== '')
                .map((paragraph: string, idx: number) => (
                  <p key={idx} className="text-justify">
                    {paragraph.trim()}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5.6 Exclusive Investor Privileges & Amenities */}
      <section id="privileges-amenities" className="py-24 md:py-32 bg-[#06120D] relative z-20">
        <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-[80px]">
          
          {/* HEADER */}
          <div className="text-center mb-16 flex flex-col items-center">
            <div className="inline-flex items-center gap-4 mb-4">
              <span className="text-[#C49A5A] text-[9px] font-bold tracking-[3px] uppercase font-sans">
                THE ULTIMATE LIFESTYLE
              </span>
            </div>
            
            <h2 className="font-serif text-[42px] md:text-[56px] font-bold text-[#F8F4EC] leading-[1.1] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Exclusive Privileges & Amenities
            </h2>
            
            <div className="w-16 h-[2px] bg-[#C49A5A] mb-8"></div>
            
            <p className="text-[#F8F4EC]/70 text-sm md:text-[15px] max-w-[700px] mx-auto font-sans leading-[1.8] font-light">
              Beyond land ownership, we offer a complete ecosystem of luxury, security, and tranquility. 
              Experience premium benefits designed exclusively for our esteemed investors.
            </p>
          </div>

          {/* 3-COLUMN PRIVILEGES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              { 
                icon: Map, 
                title: 'Dedicated Plot Allocation', 
                desc: 'Receive a clearly demarcated premium plot with transparent land records, precise geo-coordinates, and absolute ownership rights.'
              },
              { 
                icon: ShieldCheck, 
                title: 'Genuine Legal Security', 
                desc: 'Experience complete peace of mind with 100% verified legal documentation, rigorous title scrutiny, and government-compliant registration.'
              },
              { 
                icon: FileSignature, 
                title: 'Supplementary Maintenance', 
                desc: 'Benefit from expert agronomical care, continuous soil nourishment, and professional long-term upkeep of your sandalwood crop.'
              },
              { 
                icon: Trees, 
                title: 'Organized Plantation', 
                desc: 'Our estates feature scientifically spaced, methodically planned cultivation techniques designed to maximize robust heartwood growth.'
              },
              { 
                icon: Waves, 
                title: 'Drip Irrigation', 
                desc: 'State-of-the-art automated water management systems ensure optimal hydration for every sapling while maintaining ecological balance.'
              },
              { 
                icon: Handshake, 
                title: 'Plot Resale Assistance', 
                desc: 'Comprehensive marketing and administrative support to help you seamlessly liquidate your mature asset at optimal market value.'
              },
              { 
                icon: Building2, 
                title: 'Luxury Club House', 
                desc: 'A world-class architectural marvel equipped with premium recreational amenities, designed for ultimate relaxation and social gatherings.'
              },
              { 
                icon: Award, 
                title: 'Club House Membership', 
                badge: 'PREMIUM',
                desc: 'Enjoy a complimentary 12-year exclusive membership, featuring an annual 3-day luxurious free stay to unwind amidst nature.'
              },
              { 
                icon: Landmark, 
                title: 'Srisailam Darshanam Pass', 
                badge: 'ANNUAL BENEFIT',
                desc: 'Receive an annual complimentary VIP Darshan pass for 3-4 family members, valid for 12 years, to seek blessings with ease.'
              },
              { 
                icon: Building2, 
                title: 'Ultra Premium Resorts', 
                desc: 'Exclusive access to our meticulously designed luxury resort suites, offering unparalleled hospitality for your weekend getaways.'
              },
              { 
                icon: Activity, 
                title: '24/7 High Visual HD Captured CCTVs', 
                desc: 'Round-the-clock monitoring through high-definition visual capture systems, ensuring absolute safety and security for your asset.'
              },
              { 
                icon: Shield, 
                title: 'Secure Fencing', 
                desc: 'The entire estate is fortified with robust perimeter fencing and controlled access points to protect against unauthorized entry.'
              },
              { 
                icon: Zap, 
                title: 'EV Charging Station', 
                badge: 'ECO-FRIENDLY',
                desc: 'Dedicated high-speed electric vehicle charging hubs across the estate, ensuring seamless eco-friendly mobility and convenience for plot owners.'
              },
              { 
                icon: FlagTriangleRight, 
                title: 'International Golf Course', 
                desc: 'Enjoy access to an international-standard golf course, perfectly landscaped for premium sporting and networking.'
              },
              { 
                icon: Compass, 
                title: 'Grand Arch', 
                desc: 'A magnificent entrance arch that sets a majestic tone, welcoming you into a world of unparalleled luxury and prestige.'
              }
            ].map((item, i) => (
              <div 
                key={i} 
                className="group relative rounded-[22px] p-[30px] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(212,175,55,0.35)] shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-[12px] hover:-translate-y-2 transition-all duration-[450ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] overflow-hidden"
                style={{ 
                  background: 'radial-gradient(circle at top right, #4E6F2A 0%, #254B34 22%, #163A2D 48%, #0F2B24 72%, #081A17 100%)' 
                }}
              >
                {/* Hover Gradient Overlay */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[450ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] z-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at top right, #6A8D39 0%, #356046 25%, #1F4735 50%, #123126 75%, #081A17 100%)'
                  }}
                />
                
                {/* Ambient glow inside card */}
                <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-[rgba(78,111,42,0.15)] rounded-full blur-[40px] z-0 pointer-events-none group-hover:bg-[rgba(106,141,57,0.25)] transition-colors duration-[450ms]" />

                {/* Content Container */}
                <div className="relative z-10 flex items-start gap-5 w-full h-full">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full border border-[rgba(212,175,55,0.18)] flex items-center justify-center shrink-0 bg-[rgba(255,255,255,0.05)] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-shadow duration-[450ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]">
                    <item.icon className="w-5 h-5 text-[#D4AF37] stroke-[1.5]" />
                  </div>
                  
                  {/* Text */}
                  <div className="flex flex-col flex-1">
                    <div className="flex flex-col items-start gap-2 mb-3">
                      <h4 className="text-[#FFF9F0] font-serif text-[18px] md:text-[20px] font-bold leading-tight">{item.title}</h4>
                      {item.badge && (
                        <span className="text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-[4px] border border-[rgba(212,175,55,0.35)] text-[#D4AF37] uppercase bg-[rgba(212,175,55,0.05)]">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[rgba(240,233,220,0.78)] font-sans text-[12px] leading-[1.6]">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PANORAMIC CLUBHOUSE BANNER */}
          <div className="w-full rounded-[24px] md:rounded-[32px] overflow-hidden relative border border-[#163324] group hover:border-[#C49A5A]/40 transition-all duration-500 shadow-2xl">
            <img src="/clubhouse-collage.jpg" alt="Premium Clubhouse" className="w-full h-auto block transform group-hover:scale-[1.02] transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06120D] via-[#06120D]/30 to-transparent opacity-90" />
            
            <div className="absolute bottom-0 left-0 p-5 md:p-10 flex flex-col w-full">
              <span className="text-[#C49A5A] text-[9px] md:text-[10px] font-bold tracking-[3px] uppercase font-sans mb-1 md:mb-2">
                WORLD CLASS FACILITIES
              </span>
              <h3 className="text-[#F8F4EC] font-serif text-[24px] md:text-[36px] font-bold leading-none mb-2 md:mb-3">
                Premium Clubhouse
              </h3>
              <p className="text-[#F8F4EC]/80 font-sans text-[11px] md:text-[13px] leading-[1.6] max-w-[500px]">
                A sanctuary of relaxation and leisure, designed exclusively for our investors. Experience state-of-the-art facilities nestled within the tranquility of nature.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <ClubhouseAmenities />
          </div>

        </div>
      </section>

      {/* --- END MASTER PLANTATION SECTION --- */}
      <WhyRedSandalwood />
{/* 8.5 Estimate Your Red Sandalwood Wealth Section */}
      <section id="calculator" className="py-16 md:py-24 bg-gradient-to-b from-[#0F3524] via-[#0A2418] to-[#06150E] text-[#F7F0E4] relative z-20 overflow-hidden">
        {/* Soft Ambient Spotlights mimicking the reference */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#1A4D35]/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#C49A5A]/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full relative z-10">
          {/* Top Header */}
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-[#D9B36D] text-[10px] md:text-[11px] font-bold tracking-[0.25em] uppercase font-sans flex items-center gap-2 mb-6">
              Plan Your Future
            </span>
            <h2 
              className="font-serif text-4xl md:text-[56px] lg:text-[64px] font-medium leading-[1.1] font-display mb-6 text-[#F2E8D5] drop-shadow-sm" 
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Estimate Your <br className="md:hidden" /><span className="text-[#D9B36D] italic">Red Sandalwood Wealth</span>
            </h2>
            <p 
              className="text-[#9DB0A3] text-sm md:text-[17px] max-w-2xl font-light leading-relaxed"
              style={{ fontFamily: "'Lora', serif" }}
            >
              See how your plantation investment can grow over time based on plot size, tree count, survival rate, timber yield, and market value.
            </p>
          </div>

          {/* MAIN DASHBOARD CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full bg-[#081F15]/80 backdrop-blur-[40px] border border-[#D9B36D]/20 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.6)] p-2 md:p-4 lg:p-6 relative overflow-hidden"
          >
            {/* Inner Glows for the Dashboard Card */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(217,179,109,0.06)' }} />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(26,77,53,0.1)' }} />

            <div className="relative z-10 w-full">
              <InvestmentCalculator />
            </div>
          </motion.div>


          {/* BOTTOM BENEFIT STRIP */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-20">
            {[
              { icon: ShieldCheck, title: "Secure Investment", desc: "100% transparent & secure plantation investment." },
              { icon: Leaf, title: "Sustainable Returns", desc: "High returns with eco-friendly impact." },
              { icon: TrendingUp, title: "Long-Term Growth", desc: "Red sandalwood is a premium & high-value asset." },
              { icon: Users, title: "Heritage for Generations", desc: "Build wealth that grows with nature." },
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex gap-4 items-start p-4 lg:p-2 relative"
              >
                {idx !== 0 && (
                  <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-12 bg-white/10" />
                )}
                <div className="mt-1 bg-gradient-to-br from-[#12402B] to-[#0A2418] p-2.5 rounded-[12px] border border-[#D9B36D]/30 shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                  <item.icon className="w-5 h-5 text-[#D9B36D]" />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-[#D9B36D] text-[13px] font-bold mb-1 font-sans tracking-wide">{item.title}</h4>
                  <p className="text-[#B8C7BC] text-[12px] leading-snug font-sans">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

            {/* --- MASTER PLANTATION SECTION (COMBINED JOURNEY + GALLERY) --- */}
      <div id="plantation" className="w-full flex flex-col relative z-20">
{/* 5. Our Plantation Journey Section (REDESIGNED TO EXACT REFERENCE STYLE) */}
      <section id="plantation-inner" className="relative min-h-[500px] flex items-center overflow-hidden bg-cover bg-center py-16 md:py-20" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1920')` }}>
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
              </div>

              {/* Heading */}
              <h2 
                className="font-serif text-4xl md:text-5xl font-semibold text-[#F7F0E4] leading-[1.1] mb-6 font-display" 
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                From Land to Heritage
              </h2>

              {/* Description */}
              <p className="text-[#E6D3B3] text-sm md:text-[15px] leading-[1.6] mb-8 font-sans max-w-md">
                We own and nurture 100 acres of premium land near Dornala. Every step is managed with care, transparency and expertise.
              </p>

              {/* Button */}
              <a href="#investor-inquiry">
                <button className="bg-transparent hover:bg-[#F7F0E4]/5 border border-[#E6D3B3] text-[#F7F0E4] rounded-[6px] px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center transition-all font-sans">
                  EXPLORE OUR JOURNEY
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

            

{/* 7. Progression of Our Sandalwood Plantation (FINAL UPLOADED GALLERY IMPLEMENTATION) */}
      <section id="gallery" className="py-12 md:py-16 bg-[#F7F0E4] z-20 relative">
        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col items-center">
          
          {/* Section Label */}
          <div className="flex items-center gap-1.5 mb-4 self-center lg:self-start">
            <span className="text-[#8B5E3C] text-xs font-semibold tracking-[2px] uppercase font-sans">
              A GLIMPSE OF OUR LAND
            </span>
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

          {/* Infinite Marquee Scrolling Gallery */}
          <div className="w-full py-4 overflow-hidden relative">
            {/* Fade edges for professional look */}
            <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#F7F0E4] to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#F7F0E4] to-transparent z-10 pointer-events-none" />
            
            <div className="flex gap-[24px] w-max animate-marquee hover:[animation-play-state:paused]">
              {/* Render multiple sets for seamless looping */}
              {[...galleryItems, ...galleryItems, ...galleryItems, ...galleryItems].map((img, i) => (
                <div 
                  key={i} 
                  className="relative w-[280px] sm:w-[320px] lg:w-[360px] aspect-[1.1] rounded-[32px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.08)] border-2 border-[#F7F0E4] bg-white flex-shrink-0 cursor-pointer group"
                >
                  <img 
                    src={img.url} 
                    alt={img.title} 
                    onError={(e) => { 
                      if (!e.currentTarget.src.includes('gallery_01.png')) {
                        e.currentTarget.src = '/gallery_01.png'; 
                      }
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-[#0B2F24]/0 group-hover:bg-[#0B2F24]/10 transition-colors duration-300" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      
      </div>
      {/* --- END MASTER PLANTATION SECTION --- */}
      {/* --- 5.75 More Than An Investment Banner (REDESIGNED PARALLAX) --- */}
      <section className="relative py-24 md:py-32 overflow-hidden flex items-center justify-center z-20">
        {/* Parallax Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed transform scale-105"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2913&auto=format&fit=crop")' }}
        />
        
        {/* Dark Forest Green Gradient Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A120E]/90 via-[#12372A]/70 to-[#0A120E]/90" />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 w-full text-center">
          
          {/* Glassmorphic Container */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] p-10 md:p-16 lg:p-20">
            {/* Subtle glow inside the glass box */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#C49A5A]/20 blur-[80px] pointer-events-none" />
            
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <span className="text-[#C49A5A] text-xs font-bold tracking-[4px] uppercase font-sans">
                  A Lifestyle of Prestige
                </span>
              </div>
              
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#F7F0E4] leading-tight font-display drop-shadow-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                More Than an Investment
              </h2>
              
              <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#C49A5A] to-transparent my-2" />
              
              <h3 className="text-[#E7DBC7] text-lg md:text-xl font-serif leading-relaxed max-w-3xl drop-shadow-md" style={{ fontFamily: "'Lora', serif" }}>
                Own premium red sandalwood land while enjoying exclusive investor privileges, luxury amenities, legal security, and long-term value creation.
              </h3>
              
              <p className="text-[#A3B8B0] text-sm md:text-base font-sans leading-relaxed max-w-4xl mt-2 drop-shadow-sm">
                Beyond securing a high-yielding natural asset, your investment with Chandhan Nilayam grants you entry into an elite community. Experience the perfect harmony of robust financial growth and elevated lifestyle benefits—from 100% genuine legal documentation to luxury clubhouse access and spiritual retreats. We manage the land while you enjoy the prestige and peace of mind.
              </p>

              <button 
                onClick={() => {
                  const el = document.getElementById('privileges-amenities');
                  if(el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-8 px-8 py-4 bg-transparent border border-[#C49A5A] text-[#C49A5A] hover:bg-[#C49A5A] hover:text-[#0A120E] rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_0_20px_rgba(196,154,90,0.15)] hover:shadow-[0_0_30px_rgba(196,154,90,0.4)]"
              >
                Discover The Lifestyle
              </button>
            </div>
          </div>
          
        </div>
      </section>

{/* 8. Testimonials Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-[#FAF6EE] to-[#F6F0E5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side text and reviews */}
            <div className="lg:col-span-8">
              <span className="text-[#A1783C] text-xs font-bold tracking-[0.2em] uppercase block mb-3 font-sans">TRUSTED BY VISIONARY INVESTORS</span>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#14372C] font-display" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Their Words,<br />Our Pride.
                </h2>
                <div className="flex gap-4 flex-wrap mb-2">
                  <button 
                    onClick={() => setIsReviewModalOpen(true)}
                    className="bg-[#D4AF37] hover:bg-[#C89B3C] text-[#14372C] font-bold uppercase text-[10px] tracking-wider px-6 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 w-fit"
                  >
                    <Star className="w-3.5 h-3.5" /> Write a Review
                  </button>
                  {activeTestimonials.length > 6 && (
                    <button 
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="bg-[#D4AF37] hover:bg-[#C89B3C] text-[#14372C] font-bold uppercase text-[10px] tracking-wider px-6 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 w-fit"
                    >
                      {showAllReviews ? 'Show Less Reviews' : 'Show More Reviews'}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTestimonials.slice(0, showAllReviews ? activeTestimonials.length : 6).map((test, i) => (
                  <div key={i} className="bg-gradient-to-b from-[#FFFDF8] to-[#F8F3E8] border border-[rgba(201,155,69,0.18)] rounded-3xl p-6 shadow-[0_12px_35px_rgba(20,35,25,0.08)] hover:shadow-[0_18px_40px_rgba(20,35,25,0.12)] hover:border-[#D4AF37] hover:from-[#FFFCF5] hover:to-[#FFFCF5] transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex gap-0.5 text-[#D4AF37] mb-4">
                        {[...Array(test.stars)].map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-[#D4AF37]" />
                        ))}
                      </div>
                      <p className="text-[#4C4A45] text-xs italic leading-relaxed mb-6 font-serif" style={{ fontFamily: "'Lora', serif" }}>
                        "{test.text}"
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase text-[#14372C] font-sans">{test.name}</h4>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-[#7C776C] font-bold font-sans">{test.location}</span>
                        {test.investment && (
                          <>
                            <span className="text-[#D4AF37]/50 text-[10px]">•</span>
                            <span className="text-[10px] text-[#7C776C] font-bold uppercase tracking-wider font-sans bg-[#D4AF37]/10 px-1.5 py-0.5 rounded-sm">{test.investment}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side visual */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="group relative w-full max-w-[340px] aspect-[4/5] rounded-3xl overflow-hidden border-[3px] border-[#D4AF37] shadow-[0_8px_20px_rgba(212,175,55,0.18)] transition-shadow duration-300">
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
      <section id="investor-inquiry" className="py-12 md:py-16 bg-[#F7F0E4] relative z-20 overflow-hidden">
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
                    className={`w-full bg-[#F7F0E4] rounded-lg px-4 py-3.5 text-xs text-[#1E1E1A] placeholder-[#8B5E3C] focus:outline-none pr-10 font-sans font-bold transition-colors ${
                      errors.fullName 
                        ? 'border-2 border-red-500 focus:border-red-500' 
                        : 'border border-[rgba(139,94,60,0.25)] focus:border-[#C49A5A]'
                    }`}
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
                    className={`w-full bg-[#F7F0E4] rounded-lg px-4 py-3.5 text-xs text-[#1E1E1A] placeholder-[#8B5E3C] focus:outline-none pr-10 font-sans font-bold transition-colors ${
                      errors.email 
                        ? 'border-2 border-red-500 focus:border-red-500' 
                        : 'border border-[rgba(139,94,60,0.25)] focus:border-[#C49A5A]'
                    }`}
                    placeholder="Email Address"
                  />
                  <Mail className="absolute right-3.5 top-3.5 w-4 h-4 text-[#8B5E3C]/60 stroke-[1.25]" />
                  {errors.email && <p className="text-red-500 text-[9px] mt-1 text-left font-sans">{errors.email.message}</p>}
                </div>

                {/* Phone Number */}
                <div className="relative">
                  <input
                    {...register('phone')}
                    className={`w-full bg-[#F7F0E4] rounded-lg px-4 py-3.5 text-xs text-[#1E1E1A] placeholder-[#8B5E3C] focus:outline-none pr-10 font-sans font-bold transition-colors ${
                      errors.phone 
                        ? 'border-2 border-red-500 focus:border-red-500' 
                        : 'border border-[rgba(139,94,60,0.25)] focus:border-[#C49A5A]'
                    }`}
                    placeholder="Phone Number"
                  />
                  <Phone className="absolute right-3.5 top-3.5 w-4 h-4 text-[#8B5E3C]/60 stroke-[1.25]" />
                  {errors.phone && <p className="text-red-500 text-[9px] mt-1 text-left font-sans">{errors.phone.message}</p>}
                </div>

                {/* Investment Interest */}
                <div className="relative">
                  <select
                    {...register('investmentInterest')}
                    className={`w-full bg-[#F7F0E4] rounded-lg px-4 py-3.5 text-xs text-[#1E1E1A] placeholder-[#8B5E3C] focus:outline-none appearance-none pr-10 font-sans font-bold transition-colors ${
                      errors.investmentInterest 
                        ? 'border-2 border-red-500 focus:border-red-500' 
                        : 'border border-[rgba(139,94,60,0.25)] focus:border-[#C49A5A]'
                    }`}
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
                    className={`w-full bg-[#F7F0E4] rounded-lg px-4 py-3.5 text-xs text-[#1E1E1A] placeholder-[#8B5E3C] focus:outline-none appearance-none pr-10 font-sans font-bold transition-colors ${
                      errors.budgetRange 
                        ? 'border-2 border-red-500 focus:border-red-500' 
                        : 'border border-[rgba(139,94,60,0.25)] focus:border-[#C49A5A]'
                    }`}
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
                    className={`w-full bg-[#F7F0E4] rounded-lg px-4 py-3.5 text-xs text-[#1E1E1A] placeholder-[#8B5E3C] focus:outline-none appearance-none pr-10 font-sans font-bold transition-colors ${
                      errors.plotSize 
                        ? 'border-2 border-red-500 focus:border-red-500' 
                        : 'border border-[rgba(139,94,60,0.25)] focus:border-[#C49A5A]'
                    }`}
                  >
                    <option value="">Preferred Plot Size</option>
                    <option value="12.5 Cents">12.5 Cents</option>
                    <option value="25 Cents">25 Cents</option>
                    <option value="50 Cents">50 Cents</option>
                    <option value="1 Acre">1 Acre</option>
                    <option value="2+ Acres">2+ Acres</option>
                    <option value="Custom">Custom</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-[#8B5E3C]/60 pointer-events-none stroke-[1.25]" />
                  {errors.plotSize && <p className="text-red-500 text-[9px] mt-1 text-left font-sans">{errors.plotSize.message}</p>}
                </div>

                {/* Message Field */}
                <div className="relative col-span-1 md:col-span-2">
                  <textarea
                    {...register('message')}
                    rows={3}
                    className={`w-full bg-[#F7F0E4] rounded-lg px-4 py-3 text-xs text-[#1E1E1A] placeholder-[#8B5E3C] focus:outline-none pr-10 font-sans font-bold transition-colors ${
                      errors.message 
                        ? 'border-2 border-red-500 focus:border-red-500' 
                        : 'border border-[rgba(139,94,60,0.25)] focus:border-[#C49A5A]'
                    }`}
                    placeholder="Message (Optional)"
                  />
                  <span className="absolute right-3.5 top-3 text-[11px] text-[#8B5E3C]/50">✍️</span>
                </div>

                {/* Privacy and Terms Checkboxes */}
                <div className="col-span-1 md:col-span-2 flex flex-col gap-3 text-left py-2">
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        disabled={!privacyAccepted || !termsAccepted}
                        checked={privacyAccepted && termsAccepted}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          if (!checked) {
                            setPrivacyAccepted(false);
                            setTermsAccepted(false);
                            setValue('agreePrivacy', undefined as any, { shouldValidate: true });
                            setValue('agreeTerms', undefined as any, { shouldValidate: true });
                          }
                        }}
                        className="w-4 h-4 rounded border-[rgba(139,94,60,0.35)] bg-[#F7F0E4] text-[#0B2F24] focus:ring-[#C49A5A] accent-[#0B2F24] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span className="text-xs text-[#3B2416] font-semibold font-sans">
                        I have read and agree to the{' '}
                        <button type="button" onClick={() => setIsPrivacyOpen(true)} className="text-[#8B5E3C] hover:text-[#C49A5A] underline transition-colors font-bold">
                          Privacy Policy
                        </button>
                        {' '}and{' '}
                        <button type="button" onClick={() => setIsTermsOpen(true)} className="text-[#8B5E3C] hover:text-[#C49A5A] underline transition-colors font-bold">
                          Terms & Conditions
                        </button>
                      </span>
                    </label>
                    {(!privacyAccepted || !termsAccepted) && (
                      <p className="text-[#8B5E3C]/80 text-[10px] font-sans pl-7">Please click and accept both agreements to proceed.</p>
                    )}
                    {(errors.agreePrivacy || errors.agreeTerms) && (privacyAccepted && termsAccepted) && (
                      <p className="text-red-500 text-[10px] font-sans pl-7">You must check the box to agree to the policies.</p>
                    )}
                    
                    {/* Hidden inputs to keep react-hook-form happy */}
                    <input type="hidden" {...register('agreePrivacy')} />
                    <input type="hidden" {...register('agreeTerms')} />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading || !privacyAccepted || !termsAccepted}
                  className="w-full bg-[#12372A] hover:bg-[#0B241C] text-[#F7F0E4] py-4 rounded-[8px] font-bold tracking-wider uppercase text-[11px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-sans"
                >
                  {loading ? 'Submitting Inquiry...' : 'Submit Inquiry'}
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

      {/* 9.5 Premium FAQ Section */}
      <section className="py-16 md:py-20 bg-[#F7F0E4] relative overflow-hidden z-20">
        <div className="max-w-4xl mx-auto px-6 w-full">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-16">
            {/* Small Label */}
            <div className="flex items-center gap-1.5 mb-4">
              <span className="text-[#8B5E3C] text-[10px] font-bold tracking-[2px] uppercase font-sans">
                QUESTIONS & ANSWERS
              </span>
            </div>

            {/* Heading */}
            <h2 
              className="font-serif text-4xl md:text-5xl font-semibold text-[#12372A] leading-[1.1] font-display" 
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Frequently Asked Questions
            </h2>
            
            <p 
              className="text-[#3B2416]/80 text-sm max-w-lg mt-4 font-serif"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Explore detailed information about our premium sandalwood plantation estates, transparency portals, and investor-focused returns.
            </p>
          </div>

          {/* Accordion Layout */}
          <div className="space-y-4">
            {activeFaqs.map((faq, idx) => {
              const isVisible = idx < 5 || showAllFaqs;
              const isOpen = openFaqIndex === idx;

              return (
                <div 
                  key={idx} 
                  className="rounded-2xl overflow-hidden transition-all duration-500 border border-[#C49A5A]/25 hover:border-[#C49A5A]/45 hover:shadow-[0_8px_30px_rgba(196,154,90,0.06)] group"
                  style={{
                    background: 'rgba(243, 232, 210, 0.45)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    maxHeight: isVisible ? '500px' : '0px',
                    opacity: isVisible ? 1 : 0,
                    marginBottom: isVisible ? '1rem' : '0px',
                    pointerEvents: isVisible ? 'auto' : 'none',
                    transitionProperty: 'all',
                    transitionDuration: '500ms',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left px-6 py-5 md:px-8 md:py-6 flex items-center justify-between gap-4 focus:outline-none transition-colors"
                  >
                    <span 
                      className="text-base md:text-lg font-bold text-[#12372A] group-hover:text-[#8B5E3C] transition-colors pr-4"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {faq.question}
                    </span>
                    <span className="flex-shrink-0 w-8 h-8 rounded-full border border-[#C49A5A]/30 flex items-center justify-center text-[#C49A5A] group-hover:border-[#C49A5A]/60 group-hover:bg-[#C49A5A]/5 transition-all duration-300">
                      {isOpen ? (
                        <Minus className="w-4 h-4 stroke-[1.5]" />
                      ) : (
                        <Plus className="w-4 h-4 stroke-[1.5]" />
                      )}
                    </span>
                  </button>
                  
                  <div 
                    className="transition-all duration-500 ease-in-out overflow-hidden"
                    style={{
                      maxHeight: isOpen ? '300px' : '0px',
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div className="px-6 pb-6 md:px-8 md:pb-7 pt-0 border-t border-[rgba(196,154,90,0.15)]">
                      <p 
                        className="text-[#3B2416] text-sm leading-relaxed"
                        style={{ fontFamily: "'Lora', serif" }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show More FAQs Button */}
          {!showAllFaqs && (
            <div className="flex justify-center mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button
                onClick={() => setShowAllFaqs(true)}
                className="group inline-flex items-center gap-2 bg-[#C49A5A] hover:bg-[#b0874b] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-xs shadow-lg transition-all duration-300 hover:scale-105"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Show More FAQs
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 10. Visit Our Investment Site */}
      <SiteVisitSection />

      {/* Privacy Policy Modal */}
      <Dialog open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen}>
        <DialogContent className="sm:max-w-md bg-[#F7F0E4] border-[#C49A5A] z-50">
          <DialogHeader>
            <DialogTitle className="text-[#12372A] font-serif text-2xl">Privacy Policy</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-[#3B2416] max-h-[60vh] overflow-y-auto pr-4 mb-4 font-sans">
            <p className="mb-2">We value your privacy. By proceeding, you agree that your data will be securely processed and stored by Chandhan Nilayam Investments.</p>
            <p className="mb-2">We will not share your personal information with any third-party marketers without your explicit consent.</p>
            <p>You can find our full privacy policy details at our office.</p>
          </div>
          <div className="flex items-center space-x-2 pt-4 border-t border-[rgba(139,94,60,0.15)]">
            <input 
              type="checkbox" 
              id="privacy-accept" 
              checked={privacyAccepted}
              onChange={(e) => {
                setPrivacyAccepted(e.target.checked);
                if (e.target.checked && termsAccepted) {
                  setValue('agreePrivacy', true, { shouldValidate: true });
                  setValue('agreeTerms', true, { shouldValidate: true });
                } else if (!e.target.checked || !termsAccepted) {
                  setValue('agreePrivacy', undefined as any, { shouldValidate: true });
                  setValue('agreeTerms', undefined as any, { shouldValidate: true });
                }
                setTimeout(() => setIsPrivacyOpen(false), 300);
              }}
              className="w-4 h-4 rounded border-[#C49A5A] text-[#12372A] focus:ring-[#C49A5A] cursor-pointer" 
            />
            <label htmlFor="privacy-accept" className="text-sm font-bold leading-none cursor-pointer text-[#12372A] font-sans">
              I accept the Privacy Policy
            </label>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms & Conditions Modal */}
      <Dialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
        <DialogContent className="sm:max-w-md bg-[#F7F0E4] border-[#C49A5A] z-50">
          <DialogHeader>
            <DialogTitle className="text-[#12372A] font-serif text-2xl">Terms & Conditions</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-[#3B2416] max-h-[60vh] overflow-y-auto pr-4 mb-4 font-sans">
            <p className="mb-2">By submitting this inquiry, you confirm that the information provided is accurate.</p>
            <p className="mb-2">This inquiry does not constitute a legally binding agreement to purchase land. It is solely an expression of interest.</p>
            <p>Our team will contact you to explain the exact terms, returns, and agreements.</p>
          </div>
          <div className="flex items-center space-x-2 pt-4 border-t border-[rgba(139,94,60,0.15)]">
            <input 
              type="checkbox" 
              id="terms-accept" 
              checked={termsAccepted}
              onChange={(e) => {
                setTermsAccepted(e.target.checked);
                if (e.target.checked && privacyAccepted) {
                  setValue('agreePrivacy', true, { shouldValidate: true });
                  setValue('agreeTerms', true, { shouldValidate: true });
                } else if (!e.target.checked || !privacyAccepted) {
                  setValue('agreePrivacy', undefined as any, { shouldValidate: true });
                  setValue('agreeTerms', undefined as any, { shouldValidate: true });
                }
                setTimeout(() => setIsTermsOpen(false), 300);
              }}
              className="w-4 h-4 rounded border-[#C49A5A] text-[#12372A] focus:ring-[#C49A5A] cursor-pointer" 
            />
            <label htmlFor="terms-accept" className="text-sm font-bold leading-none cursor-pointer text-[#12372A] font-sans">
              I accept the Terms & Conditions
            </label>
          </div>
        </DialogContent>
      </Dialog>

    
      {/* Review Modal */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden bg-[#F7F0E4] border border-[#C49A5A]/20">
          <div className="bg-[#0B2F24] p-6 text-center border-b border-[#C49A5A]/30">
            <h3 className="text-2xl font-serif text-[#F7F0E4] font-bold">Share Your Experience</h3>
            <p className="text-[#C49A5A] text-xs font-sans mt-1">We value your feedback and trust.</p>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#12372A] mb-2 font-sans">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    type="button" 
                    onClick={() => setReviewStars(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star className={`w-7 h-7 ${star <= reviewStars ? 'fill-[#C49A5A] text-[#C49A5A]' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#12372A] mb-2 font-sans">Your Name</label>
              <input 
                type="text" 
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                placeholder="E.g. Ramesh B." 
                className="w-full bg-white border border-[#8B5E3C]/20 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C49A5A] text-[#12372A] font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#12372A] mb-2 font-sans">Your Location</label>
              <input 
                type="text" 
                value={reviewLocation}
                onChange={(e) => setReviewLocation(e.target.value)}
                placeholder="E.g. Hyderabad" 
                className="w-full bg-white border border-[#8B5E3C]/20 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C49A5A] text-[#12372A] font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#12372A] mb-2 font-sans">Your Review</label>
              <textarea 
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Tell us about your experience..." 
                rows={4}
                className="w-full bg-white border border-[#8B5E3C]/20 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C49A5A] text-[#12372A] font-sans resize-none"
              ></textarea>
            </div>
            <button 
              onClick={async () => {
                if(!reviewName.trim() || !reviewText.trim() || !reviewLocation.trim()) {
                  toast.error("Please fill in all fields.");
                  return;
                }
                if (reviewName.trim().length < 3) {
                  toast.error("Name must be at least 3 characters long.");
                  return;
                }
                if (reviewText.trim().length < 10) {
                  toast.error("Review must be at least 10 characters long.");
                  return;
                }
                
                try {
                  await api.post('/testimonials', {
                    name: reviewName,
                    location: reviewLocation,
                    text: reviewText,
                    rating: reviewStars
                  });
                  
                  // Add the new review to the beginning of the list
                  setActiveTestimonials([{
                    text: reviewText,
                    name: reviewName,
                    location: reviewLocation,
                    stars: reviewStars
                  }, ...activeTestimonials]);
                  
                  toast.success("Thank you! Your review has been added.");
                  setIsReviewModalOpen(false);
                  setReviewName("");
                  setReviewLocation("");
                  setReviewText("");
                  setReviewStars(5);
                } catch (error) {
                  toast.error("Failed to submit review. Please try again.");
                }
              }}
              className="w-full bg-[#C49A5A] hover:bg-[#B38541] text-[#12372A] font-bold uppercase text-xs tracking-wider py-3.5 rounded-full transition-colors shadow-md"
            >
              Submit Review
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating WhatsApp Widget */}
      <WhatsAppWidget />
    </div>
  );
}
