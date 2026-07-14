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
  AlertTriangle
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import SiteVisitSection from '@/components/public/site-visit-section';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Form validation schema
const inquirySchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string()
    .min(10, 'Phone must be at least 10 digits')
    .max(15, 'Phone number is too long')
    .regex(/^\+?[0-9\s\-]+$/, 'Invalid phone number format'),
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
    question: "What are the long-term benefits of investing in Chandan Nilayam?",
    answer: "Investing in Chandan Nilayam offers high capital appreciation through premium land ownership coupled with high-yield sandalwood cultivation. As sandalwood is a globally scarce and highly valued commodity, investors stand to gain substantial returns at harvest, alongside stable land value growth and tax-free agricultural income."
  },
  {
    question: "Why is sandalwood considered a valuable long-term investment?",
    answer: "Sandalwood is globally renowned for its fragrance, medicinal properties, and cultural significance, yet natural reserves are rapidly depleting. Cultivated sandalwood represents a secure, high-value asset class with a consistent supply-demand deficit, ensuring strong price appreciation and high compounding returns over its 12-year growth cycle."
  },
  {
    question: "Are there any future developments planned around the project?",
    answer: "Yes, Chandan Nilayam is located in a high-growth corridor. Future developments include security enhancements, drip-irrigation infrastructure, premium resort facilities, and eco-tourism initiatives that will further elevate the land value and provide lifestyle benefits for investors."
  },
  {
    question: "How does the surrounding hill station environment add value to the investment?",
    answer: "The project's proximity to scenic hill stations offers optimal soil chemistry, altitude, and climatic conditions for superior sandalwood heartwood formation. This unique microclimate accelerates growth and enhances oil quality, directly increasing the market value of the crop compared to other locations."
  },
  {
    question: "Will investors receive complimentary Srisailam Darshan tickets?",
    answer: "Yes, as a token of appreciation and to welcome our investors into the Chandan Nilayam family, we provide complimentary VIP Darshan tickets to the sacred Srisailam temple during their visits to the plantation site."
  },
  {
    question: "How can investors monitor their plantation and investment progress?",
    answer: "Investors receive access to a secure digital portal providing 24/7 transparency. You can view regular high-resolution photographs, growth status reports, soil health analysis, video updates, and legal documentation of your specific plot, ensuring full peace of mind."
  },
  {
    question: "Is Chandan Nilayam located near major spiritual destinations?",
    answer: "Yes, the estate is strategically positioned near major spiritual hubs, including the historic Srisailam Temple corridor. This location benefits from excellent highway connectivity, high tourism footfall, and spiritual significance, driving rapid regional development and land appreciation."
  },
  {
    question: "Can investors visit the plantation and experience the location?",
    answer: "Absolutely. We encourage our investors to visit Chandan Nilayam. We organize guided site visits where you can inspect your plot, experience the tranquil environment, meet our plantation experts, and witness the advanced agricultural techniques being employed."
  },
  {
    question: "Is the investment suitable for future generations?",
    answer: "Yes, this is an ideal legacy asset. The combination of secure, registered land ownership and the long-term compounding value of sandalwood makes it a perfect generational gift, ensuring wealth preservation and a green legacy for your children and grandchildren."
  },
  {
    question: "Why choose Chandan Nilayam over traditional investment options?",
    answer: "Traditional assets like bank deposits or equities are susceptible to inflation and market volatility. Chandan Nilayam provides a tangible, real-estate backed asset that grows biologically, yielding far higher returns than gold or index funds while offering absolute security and transparent management."
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
          setPublicContent(publicRes.data.data);
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

  // Calculator States
  const [plotSize, setPlotSize] = useState('12.5 Cents');
  const [treeCount, setTreeCount] = useState(50);
  const [plantationAge, setPlantationAge] = useState(12);
  const [survivalRate, setSurvivalRate] = useState(90);
  const [timberYieldPerTree, setTimberYieldPerTree] = useState(20); // in kg
  const [timberPricePerTon, setTimberPricePerTon] = useState(15000000); // 1.5 Cr in Rupees
  const [initialInvestment, setInitialInvestment] = useState(1500000);
  const [annualMaintenance, setAnnualMaintenance] = useState(12000);

  // Sync defaults when plot size changes
  useEffect(() => {
    if (plotSize === '12.5 Cents') {
      setTreeCount(50);
      setInitialInvestment(1500000);
      setAnnualMaintenance(12000);
    } else if (plotSize === '25 Cents') {
      setTreeCount(100);
      setInitialInvestment(3000000);
      setAnnualMaintenance(24000);
    } else if (plotSize === '50 Cents') {
      setTreeCount(200);
      setInitialInvestment(6000000);
      setAnnualMaintenance(48000);
    } else if (plotSize === '1 Acre') {
      setTreeCount(400);
      setInitialInvestment(12000000);
      setAnnualMaintenance(96000);
    } else if (plotSize === '2 Acres') {
      setTreeCount(800);
      setInitialInvestment(24000000);
      setAnnualMaintenance(192000);
    } else if (plotSize === '5 Acres') {
      setTreeCount(2000);
      setInitialInvestment(60000000);
      setAnnualMaintenance(480000);
    }
  }, [plotSize]);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakhs`;
    } else {
      return `₹${val.toLocaleString('en-IN')}`;
    }
  };

  // Centralized calculations
  const calculatorMetrics = useMemo(() => {
    const survivingTrees = Math.round(treeCount * (survivalRate / 100));
    const yieldTons = (survivingTrees * timberYieldPerTree) / 1000;
    const totalCost = initialInvestment + (annualMaintenance * plantationAge);
    const totalRevenue = yieldTons * timberPricePerTon;
    const totalNetProfit = totalRevenue - totalCost;
    
    // Profit Sharing Policy 50:50
    const investorNetProfit = totalNetProfit > 0 ? totalNetProfit * 0.5 : totalNetProfit;
    const investorRevenue = totalCost + investorNetProfit;
    const investorROI = totalCost > 0 ? (investorNetProfit / totalCost) * 100 : 0;

    return {
      survivingTrees,
      yieldTons,
      totalCost,
      totalRevenue,
      totalNetProfit,
      investorNetProfit,
      investorRevenue,
      investorROI
    };
  }, [treeCount, survivalRate, timberYieldPerTree, timberPricePerTon, initialInvestment, annualMaintenance, plantationAge]);

  // Generate real-time chart data
  const chartData = useMemo(() => {
    const data = [];
    
    for (let year = 0; year <= plantationAge; year++) {
      const investmentAtYear = initialInvestment + (annualMaintenance * year);
      
      // Exponential curve for plantation value
      const valueAtYear = calculatorMetrics.investorRevenue * Math.pow(year / plantationAge, 3);

      data.push({
        year: `Year ${year}`,
        investment: investmentAtYear,
        value: valueAtYear
      });
    }
    return data;
  }, [plantationAge, initialInvestment, annualMaintenance, calculatorMetrics]);

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
    setValue,
    formState: { errors },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    mode: 'onTouched',
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
    name: 'Chandan Nilayam Investments',
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
                <img src="/logo.png" alt="Chandan Nilayam Logo" className="w-[280px] md:w-[350px] object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]" />
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
                Preparing Your Legacy
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
              color: '#E7DBC7',
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
          className="rounded-[24px] py-6 px-8 md:py-7 md:px-9 shadow-[0_15px_35px_rgba(0,0,0,0.30)] hover:border-[#C49A5A]/50 transition-all duration-500 group/card border"
          style={{
            background: 'rgba(18, 55, 42, 0.82)',
            borderColor: 'rgba(196, 154, 90, 0.35)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-y-0">
            {/* Stat 1: Acres */}
            <div className="flex items-center gap-3.5 group/item relative px-2 md:px-6 border-r border-[#C49A5A]/15 md:border-r-0 border-b border-[#C49A5A]/15 pb-4 md:pb-0 md:border-b-0">
              <div className="relative flex items-center justify-center w-12 h-12 md:w-[54px] md:h-[54px] rounded-full border border-[#C49A5A]/25 flex-shrink-0 group-hover/item:border-[#C49A5A]/50 transition-colors duration-500" style={{ background: 'rgba(196, 154, 90, 0.05)' }}>
                <Trees className="w-5.5 h-5.5 md:w-6 md:h-6 text-[#C49A5A] relative z-10 transition-transform duration-500 group-hover/item:-translate-y-1" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-2xl md:text-[36px] font-bold tracking-tight leading-none transition-transform duration-500 group-hover/item:scale-102 select-none origin-left" style={{ color: '#C49A5A', fontFamily: "'Cormorant Garamond', serif" }}>
                  {homeContent.statsAum || '100+'}
                </span>
                <span className="text-[9px] md:text-[11px] font-semibold tracking-[1px] uppercase select-none mt-1 leading-tight animate-none" style={{ color: '#F7F2E8', fontFamily: "'Montserrat', sans-serif" }}>
                  ACRES OF PREMIUM LAND
                </span>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[50%] w-[1px] hidden md:block"><div className="h-full w-full bg-[#C49A5A]/20" /></div>
            </div>

            {/* Stat 2: Plots */}
            <div className="flex items-center gap-3.5 group/item relative px-2 md:px-6 border-b border-[#C49A5A]/15 pb-4 md:pb-0 md:border-b-0 md:border-r-0">
              <div className="relative flex items-center justify-center w-12 h-12 md:w-[54px] md:h-[54px] rounded-full border border-[#C49A5A]/25 flex-shrink-0 group-hover/item:border-[#C49A5A]/50 transition-colors duration-500" style={{ background: 'rgba(196, 154, 90, 0.05)' }}>
                <MapPin className="w-5.5 h-5.5 md:w-6 md:h-6 text-[#C49A5A] relative z-10 transition-transform duration-500 group-hover/item:-translate-y-1" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-2xl md:text-[36px] font-bold tracking-tight leading-none transition-transform duration-500 group-hover/item:scale-102 select-none origin-left" style={{ color: '#C49A5A', fontFamily: "'Cormorant Garamond', serif" }}>
                  400+
                </span>
                <span className="text-[9px] md:text-[11px] font-semibold tracking-[1px] uppercase select-none mt-1 leading-tight animate-none" style={{ color: '#F7F2E8', fontFamily: "'Montserrat', sans-serif" }}>
                  PREMIUM PLOTS
                </span>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[50%] w-[1px] hidden md:block"><div className="h-full w-full bg-[#C49A5A]/20" /></div>
            </div>

            {/* Stat 3: Growth Cycle */}
            <div className="flex items-center gap-3.5 group/item relative px-2 md:px-6 border-r border-[#C49A5A]/15 md:border-r-0 pt-4 md:pt-0">
              <div className="relative flex items-center justify-center w-12 h-12 md:w-[54px] md:h-[54px] rounded-full border border-[#C49A5A]/25 flex-shrink-0 group-hover/item:border-[#C49A5A]/50 transition-colors duration-500" style={{ background: 'rgba(196, 154, 90, 0.05)' }}>
                <Sprout className="w-5.5 h-5.5 md:w-6 md:h-6 text-[#C49A5A] relative z-10 transition-transform duration-500 group-hover/item:-translate-y-1" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-2xl md:text-[36px] font-bold tracking-tight leading-none transition-transform duration-500 group-hover/item:scale-102 select-none origin-left" style={{ color: '#C49A5A', fontFamily: "'Cormorant Garamond', serif" }}>
                  {homeContent.statsGrowth || '12+'}
                </span>
                <span className="text-[9px] md:text-[11px] font-semibold tracking-[1px] uppercase select-none mt-1 leading-tight animate-none" style={{ color: '#F7F2E8', fontFamily: "'Montserrat', sans-serif" }}>
                  YEARS OF GROWTH
                </span>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[50%] w-[1px] hidden md:block"><div className="h-full w-full bg-[#C49A5A]/20" /></div>
            </div>

            {/* Stat 4: Investors */}
            <div className="flex items-center gap-3.5 group/item relative px-2 md:px-6 pt-4 md:pt-0">
              <div className="relative flex items-center justify-center w-12 h-12 md:w-[54px] md:h-[54px] rounded-full border border-[#C49A5A]/25 flex-shrink-0 group-hover/item:border-[#C49A5A]/50 transition-colors duration-500" style={{ background: 'rgba(196, 154, 90, 0.05)' }}>
                <Users className="w-5.5 h-5.5 md:w-6 md:h-6 text-[#C49A5A] relative z-10 transition-transform duration-500 group-hover/item:-translate-y-1" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-2xl md:text-[36px] font-bold tracking-tight leading-none transition-transform duration-500 group-hover/item:scale-102 select-none origin-left" style={{ color: '#C49A5A', fontFamily: "'Cormorant Garamond', serif" }}>
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
      <section id="about-heritage" className="py-[80px] lg:py-[100px] bg-[#F7F0E4] relative overflow-hidden">
        <div className="max-w-[1480px] mx-auto px-6 md:px-12 lg:px-[60px]">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">
            
            {/* Left Column */}
            <div className="w-full lg:w-[46%] flex flex-col pt-4">
              
              {/* Eyebrow */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-[1px] bg-[#C49A5A]/65" />
                <span className="text-[#C49A5A] text-[11px] lg:text-xs font-semibold tracking-[0.20em] uppercase font-sans">
                  OUR HERITAGE
                </span>
              </div>
              
              {/* Heading */}
              <h2 className="flex flex-col mb-8">
                <span className="font-serif text-[42px] sm:text-[52px] lg:text-[72px] font-bold leading-[1.05] text-[#0B2F24] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  The Chandan Nilayam
                </span>
                <span className="font-serif text-[38px] sm:text-[48px] lg:text-[64px] font-normal leading-[1.1] italic text-[#C49A5A] mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
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
              <div className="flex flex-col gap-6 mb-12">
                <p className="text-[#4F5D55] text-base md:text-lg lg:text-[19px] leading-[1.7] font-serif" style={{ fontFamily: "'Lora', serif" }}>
                  Chandan Nilayam was established with a singular purpose: to pioneer a secure pathway for generational wealth through managed agroforestry. Specializing in high-yield, premium Sandalwood cultivation, we integrate advanced agricultural methods with verified, clear-title land ownership.
                </p>
                <p className="text-[#4F5D55] text-base md:text-lg lg:text-[19px] leading-[1.7] font-serif" style={{ fontFamily: "'Lora', serif" }}>
                  Our foundation is built on absolute transparency, legal security, and sustainable forest management. Over the years, we have evolved into a trusted legacy partner, successfully aligning high-yielding green investments with active ecological preservation.
                </p>
              </div>

              {/* Bottom Left Quote Panel */}
              <div className="bg-[#F1E9D8] rounded-[20px] p-8 md:p-10 w-full flex flex-col items-center text-center">
                <span className="text-[#8B5E3C] text-[11px] md:text-xs font-semibold tracking-[0.15em] uppercase font-sans mb-4">
                  PREMIUM SANDALWOOD PLOTS NEAR DORNALA
                </span>
                <div className="w-12 h-[2px] bg-[#C49A5A] mb-6 opacity-60" />
                <p className="text-[#0B2F24] font-serif text-[22px] md:text-[30px] lg:text-[32px] italic leading-[1.4]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Building wealth today.<br />
                  Preserving nature for generations to come.
                </p>
              </div>

            </div>

            {/* Right Column */}
            <div className="w-full lg:w-[54%] relative flex flex-col items-center lg:items-end">
              
              {/* Plantation Image */}
              <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[720px] rounded-[32px] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&q=80&w=1200"
                  alt="Premium Sandalwood Sapling in Rich Soil"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Vision & Mission Panel */}
              <div 
                className="relative lg:absolute lg:bottom-12 lg:left-[-10%] w-[95%] lg:w-[105%] mt-[-40px] lg:mt-0 rounded-[28px] p-8 md:p-12 shadow-[0_24px_60px_rgba(11,47,36,0.20)] z-10"
                style={{
                  background: 'linear-gradient(135deg, #12372A 0%, #0B2F24 55%, #164B38 100%)'
                }}
              >
                
                {/* Panel Header */}
                <div className="flex flex-col items-center text-center mb-10">
                  <h3 className="text-[#F7F0E4] font-serif text-[32px] md:text-[40px] font-semibold mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Vision & Mission
                  </h3>
                  <div className="w-12 h-[2px] bg-[#C49A5A]" />
                </div>

                {/* Panel Content (Two Columns) */}
                <div className="flex flex-col md:flex-row gap-8 md:gap-0 relative">
                  
                  {/* Left: Our Vision */}
                  <div className="flex-1 md:pr-10 lg:pr-12 flex flex-col text-left">
                    <h4 className="text-[#C49A5A] font-serif text-[24px] md:text-[26px] font-medium mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Our Vision
                    </h4>
                    <p className="text-[#F7F0E4] text-[15px] md:text-[17px] leading-[1.6] font-sans opacity-90">
                      To be the most trusted name in sustainable sandalwood investments, creating long-term value for investors and a lasting positive impact on the environment.
                    </p>
                  </div>
                  
                  {/* Vertical Divider (Hidden on mobile) */}
                  <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-[rgba(196,154,90,0.3)] -translate-x-1/2" />
                  
                  {/* Horizontal Divider (Visible only on mobile) */}
                  <div className="block md:hidden w-full h-[1px] bg-[rgba(196,154,90,0.3)] my-2" />

                  {/* Right: Our Mission */}
                  <div className="flex-1 md:pl-10 lg:pl-12 flex flex-col text-left">
                    <h4 className="text-[#C49A5A] font-serif text-[24px] md:text-[26px] font-medium mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Our Mission
                    </h4>
                    <p className="text-[#F7F0E4] text-[15px] md:text-[17px] leading-[1.6] font-sans opacity-90">
                      To deliver high-growth green investment opportunities through scientific plantation management, transparent operations, and a commitment to ecological restoration.
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
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Col - Headings & Copy */}
            <div className="lg:col-span-7">
              <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3 font-sans">THE SANDALWOOD OPPORTUNITY</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#12372A] mb-6 leading-tight font-display" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Nurtured by Nature.<br />Built for the Future.
              </h2>
              <p className="text-[#2F3E2F] text-base md:text-lg leading-relaxed mb-10 max-w-2xl font-serif" style={{ fontFamily: "'Lora', serif" }}>
                Sandalwood is a naturally valued resource recognised for its distinctive fragrance and diverse applications across perfumery, wellness, traditional practices, and premium products. Its long cultivation cycle and specialised growing requirements make professionally managed plantations an important part of its long-term value journey.
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
              src="/strategic-location-map.jpg" 
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
            
            <p className="text-[#B8C7BC] text-sm md:text-base leading-relaxed font-sans whitespace-pre-line text-center">
              {publicContent.locationAdvantages || "Dornala is geographically gifted with nutrient-rich soil, optimal elevation, and a microclimate perfectly suited for premium Sandalwood cultivation. Positioned along the secure Srisailam spiritual highway corridor, this location offers exceptional connectivity for efficient plantation logistics. Investing here means securing a land asset that benefits from natural water security, rapid heartwood growth, and a rising regional development curve."}
            </p>
          </div>

        </div>
      </section>

                  {/* 5.6 Exclusive Investor Privileges & Amenities (COMBINED - PREMIUM REDESIGN) */}
      <section id="privileges-amenities" className="py-20 md:py-32 bg-[#0A120E] relative overflow-hidden z-20">
        {/* Subtle Background Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(196,154,90,0.05),_transparent_80%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C49A5A]/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#12372A]/20 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-1.5 mb-4">
              <span className="text-[#C49A5A] text-[10px] font-bold tracking-[3px] uppercase font-sans">
                THE ULTIMATE LIFESTYLE
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#F7F0E4] leading-tight mb-6 font-display" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Exclusive Privileges & Amenities
            </h2>
            <div className="w-20 h-[1.5px] bg-[#C49A5A] mx-auto mb-6"></div>
            <p className="text-[#B8C7BC] text-sm md:text-base max-w-2xl mx-auto font-sans leading-relaxed">
              Beyond land ownership, we offer a complete ecosystem of luxury, security, and tranquility. Experience premium benefits designed exclusively for our esteemed investors.
            </p>
          </div>

          {/* Core Privileges (4 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-24">
            {[
              {
                title: "Dedicated Plot Allocation",
                desc: "Receive a clearly demarcated premium plot with transparent records and complete ownership.",
                icon: Map
              },
              {
                title: "Genuine Legal Security",
                desc: "Verified legal documentation, title verification, and absolute government-compliant paperwork.",
                icon: ShieldCheck
              },
              {
                title: "12-Year Club House Access",
                desc: "Complimentary luxury clubhouse membership valid for 12 years, including an annual 3-day stay.",
                icon: Building2,
                badge: "FREE"
              },
              {
                title: "VIP Srisailam Darshan",
                desc: "Complimentary yearly VIP Srisailam Darshan passes applicable for 3–4 family members.",
                icon: Landmark,
                badge: "Annual Benefit"
              },
              { title: "Supplementary Maintenance", desc: "Scientific plantation care and professional long-term crop upkeep.", icon: FileSignature },
              { title: "Plot Resale Assistance", desc: "Full marketing support to seamlessly liquidate your mature asset.", icon: Handshake },
              { title: "Luxury Suites", desc: "Exclusive access to premium relaxation spaces for weekend getaways.", icon: Building }
            ].map((privilege, i) => (
              <div 
                key={i} 
                className="group relative bg-[#0B241C]/40 backdrop-blur-md border border-[#C49A5A]/20 hover:border-[#C49A5A]/60 rounded-3xl p-8 lg:p-10 transition-all duration-500 overflow-hidden"
              >
                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#C49A5A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#0A120E] border border-[#C49A5A]/30 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C49A5A]/10 transition-colors duration-500 shadow-[0_0_20px_rgba(196,154,90,0.1)]">
                    <privilege.icon className="w-8 h-8 text-[#C49A5A] group-hover:scale-110 transition-transform duration-500 stroke-[1.5]" />
                  </div>
                  
                  <div className="flex flex-col flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-xl font-serif text-[#F7F0E4] leading-tight tracking-wide">
                        {privilege.title}
                      </h3>
                      {privilege.badge && (
                        <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm bg-[#C49A5A]/20 text-[#C49A5A] border border-[#C49A5A]/30">
                          {privilege.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[#A3B8B0] text-sm leading-relaxed font-sans">
                      {privilege.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Panoramic Clubhouse Banner */}
          <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden mb-16 shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-[#C49A5A]/20 group">
            <img 
              src="/clubhouse-collage.jpg"
              alt="Luxury Club House"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A120E] via-[#0A120E]/60 to-transparent" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
            
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
              <div className="max-w-3xl">
                <h3 className="text-[#C49A5A] text-sm font-bold tracking-[3px] uppercase font-sans mb-3">World Class Facilities</h3>
                <h4 className="text-[#F7F0E4] font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-xl">Premium Clubhouse</h4>
                <p className="text-[#E6D3B3] text-sm md:text-base font-sans leading-relaxed drop-shadow-md">
                  A sanctuary of relaxation and leisure, designed exclusively for our investors. Experience state-of-the-art facilities nestled within the tranquility of nature.
                </p>
              </div>
            </div>
          </div>

          {/* Lifestyle Amenities Grid (9 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Walking Track", desc: "Beautifully landscaped trails designed for natural tranquility.", icon: Footprints },
              { title: "Modern Gym", desc: "Fully equipped fitness center to prioritize your health and wellness.", icon: Dumbbell },
              { title: "Swimming Pool", desc: "Elegant, temperature-controlled pool offering a relaxing oasis.", icon: Waves },
              { title: "Children's Play Area", desc: "Safe, dedicated recreational zones with premium outdoor equipment.", icon: Smile },
              { title: "Putting Green", desc: "Beautifully maintained golf court to practice your swing.", icon: FlagTriangleRight },
              { title: "Organic Dining", desc: "On-site restaurant serving chef-curated meals at subsidized rates.", icon: Utensils, badge: "Exclusive" }
            ].map((amenity, i) => (
              <div 
                key={i} 
                className="group bg-white/[0.02] hover:bg-[#C49A5A]/5 border border-white/5 hover:border-[#C49A5A]/30 rounded-2xl p-6 flex items-start gap-4 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-[#0A120E] border border-[#C49A5A]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C49A5A] transition-colors duration-500">
                  <amenity.icon className="w-5 h-5 text-[#C49A5A] group-hover:text-[#0A120E] transition-colors duration-500 stroke-[1.5]" />
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm md:text-base font-bold text-[#F7F0E4] font-sans tracking-wide">{amenity.title}</h4>
                    {amenity.badge && (
                      <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-[#C49A5A]/20 text-[#C49A5A] border border-[#C49A5A]/30">
                        {amenity.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[#A3B8B0] text-xs leading-relaxed font-sans">{amenity.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </section>

{/* 8.5 Estimate Your Red Sandalwood Wealth Section */}
      <section id="calculator" className="py-12 md:py-16 bg-gradient-to-br from-[#061F18] to-[#031A14] text-[#F7F0E4] relative z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full">
          {/* Top Header */}
          <div className="flex flex-col items-center text-center mb-12">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#C49A5A]"></div>
              <span className="text-[#C49A5A] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase font-sans flex items-center gap-2">
                PLAN YOUR FUTURE
              </span>
              <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#C49A5A]"></div>
            </div>
            <h2 
              className="font-serif text-3xl md:text-[48px] font-bold leading-tight font-display mb-4" 
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Estimate Your <span className="text-[#C49A5A]">Red Sandalwood Wealth</span>
            </h2>
            <p 
              className="text-[#B8C7BC] text-sm md:text-[18px] max-w-3xl"
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
            transition={{ duration: 0.6 }}
            className="rounded-[28px] p-6 md:p-8 lg:p-[32px] shadow-[0_30px_80px_rgba(0,0,0,0.45)] border border-[#C49A5A]/35 mb-8"
            style={{ background: 'linear-gradient(145deg, rgba(6,31,24,0.95), rgba(3,12,10,0.98))' }}
          >
            <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12">
              
              {/* LEFT CARD — Investment Calculator */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-[#12372A]/40 p-2 rounded-lg border border-[#C49A5A]/20">
                    <Building2 className="w-5 h-5 text-[#C49A5A]" />
                  </div>
                  <h3 className="text-[#D9B36D] text-[18px] font-serif font-semibold tracking-wide">Investment Calculator</h3>
                </div>

                {/* Plot Size & Number of Trees */}
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] md:text-[13px] text-[#B8C7BC] uppercase font-sans tracking-wide">Plot Size</label>
                    <div className="relative">
                      {plotSize === 'Custom' ? (
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              placeholder="Acres"
                              onChange={(e) => {
                                const acres = parseFloat(e.target.value) || 0;
                                setTreeCount(Math.round(acres * 400));
                                setInitialInvestment(acres * 12000000);
                                setAnnualMaintenance(acres * 96000);
                              }}
                              className="w-full h-[48px] bg-[#0B241C] border border-[#C49A5A]/35 text-[#F7F0E4] rounded-[14px] px-4 pr-16 text-sm focus:outline-none focus:border-[#C49A5A] focus:ring-[3px] focus:ring-[#C49A5A]/15 transition-all font-sans font-medium"
                            />
                            <span className="absolute right-4 top-[14px] text-sm text-[#B8C7BC]">Acres</span>
                          </div>
                          <button 
                            onClick={() => setPlotSize('1 Acre')}
                            className="w-12 h-[48px] rounded-[14px] border border-[#C49A5A]/35 bg-[#0B241C] hover:bg-[#C49A5A]/20 text-[#C49A5A] flex items-center justify-center transition-colors shrink-0"
                            title="Back to predefined sizes"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <select
                            value={plotSize}
                            onChange={(e) => setPlotSize(e.target.value)}
                            className="w-full h-[48px] bg-[#0B241C] border border-[#C49A5A]/35 text-[#F7F0E4] rounded-[14px] px-4 text-sm focus:outline-none focus:border-[#C49A5A] focus:ring-[3px] focus:ring-[#C49A5A]/15 appearance-none cursor-pointer transition-all font-sans font-medium"
                          >
                            <option value="12.5 Cents">12.5 Cents</option>
                            <option value="25 Cents">25 Cents</option>
                            <option value="50 Cents">50 Cents</option>
                            <option value="1 Acre">1 Acre</option>
                            <option value="2 Acres">2 Acres</option>
                            <option value="5 Acres">5 Acres</option>
                            <option value="Custom">Custom</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-[14px] w-5 h-5 text-[#C49A5A] pointer-events-none" />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] md:text-[13px] text-[#B8C7BC] uppercase font-sans tracking-wide">Number of Trees</label>
                    <input
                      type="number"
                      value={treeCount}
                      onChange={(e) => setTreeCount(Math.max(0, parseInt(e.target.value) || 0))}
                      onBlur={() => {
                        if (treeCount < 50) {
                          toast.error("Minimum Number of Trees is 50");
                          setTreeCount(50);
                        }
                      }}
                      className="w-full h-[48px] bg-[#0B241C] border border-[#C49A5A]/35 text-[#F7F0E4] rounded-[14px] px-4 text-sm focus:outline-none focus:border-[#C49A5A] focus:ring-[3px] focus:ring-[#C49A5A]/15 transition-all font-sans font-medium"
                    />
                  </div>
                </div>

                {/* Sliders */}
                <div className="flex flex-col gap-5 mt-2">
                  {/* Plantation Age */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] md:text-[13px] text-[#B8C7BC] font-sans">Plantation Age (Years)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="12"
                        value={plantationAge}
                        onChange={(e) => setPlantationAge(parseInt(e.target.value))}
                        className="flex-1 h-1.5 bg-[#0B241C] rounded-lg appearance-none cursor-pointer accent-[#D9B36D] hover:shadow-[0_0_10px_rgba(217,179,109,0.3)] transition-shadow"
                      />
                      <div className="w-[72px] h-[40px] bg-[#0B241C] border border-[#C49A5A]/35 rounded-[14px] flex items-center justify-center text-sm font-bold text-[#F7F0E4] font-sans">
                        {plantationAge}
                      </div>
                    </div>
                  </div>

                  {/* Survival Rate */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] md:text-[13px] text-[#B8C7BC] font-sans">Survival Rate (%)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="70"
                        max="100"
                        value={survivalRate}
                        onChange={(e) => setSurvivalRate(parseInt(e.target.value))}
                        className="flex-1 h-1.5 bg-[#0B241C] rounded-lg appearance-none cursor-pointer accent-[#D9B36D] hover:shadow-[0_0_10px_rgba(217,179,109,0.3)] transition-shadow"
                      />
                      <div className="w-[72px] h-[40px] bg-[#0B241C] border border-[#C49A5A]/35 rounded-[14px] flex items-center justify-center text-sm font-bold text-[#F7F0E4] font-sans">
                        {survivalRate}
                      </div>
                    </div>
                  </div>

                  {/* Yield */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] md:text-[13px] text-[#B8C7BC] font-sans">Timber Yield Per Tree (kg)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="10"
                        max="150"
                        value={timberYieldPerTree}
                        onChange={(e) => setTimberYieldPerTree(parseFloat(e.target.value))}
                        className="flex-1 h-1.5 bg-[#0B241C] rounded-lg appearance-none cursor-pointer accent-[#D9B36D] hover:shadow-[0_0_10px_rgba(217,179,109,0.3)] transition-shadow"
                      />
                      <div className="w-[72px] h-[40px] bg-[#0B241C] border border-[#C49A5A]/35 rounded-[14px] flex items-center justify-center text-sm font-bold text-[#F7F0E4] font-sans">
                        {timberYieldPerTree}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] md:text-[13px] text-[#B8C7BC] font-sans">Timber Price Per Ton (₹)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1000000"
                        max="25000000"
                        step="100000"
                        value={timberPricePerTon}
                        onChange={(e) => setTimberPricePerTon(parseInt(e.target.value))}
                        className="flex-1 h-1.5 bg-[#0B241C] rounded-lg appearance-none cursor-pointer accent-[#D9B36D] hover:shadow-[0_0_10px_rgba(217,179,109,0.3)] transition-shadow"
                      />
                      <div className="w-[110px] h-[40px] bg-[#0B241C] border border-[#C49A5A]/35 rounded-[14px] flex items-center justify-center text-sm font-bold text-[#F7F0E4] font-sans">
                        {timberPricePerTon.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Investment / Maintenance */}
                <div className="grid grid-cols-2 gap-5 mt-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] md:text-[13px] text-[#B8C7BC] font-sans">Initial Investment (₹)</label>
                    <input
                      type="text"
                      value={initialInvestment.toLocaleString('en-IN')}
                      onChange={(e) => setInitialInvestment(Math.max(0, parseInt(e.target.value.replace(/,/g, '')) || 0))}
                      onBlur={() => {
                        if (initialInvestment < 1500000) {
                          toast.error("Minimum Initial Investment is ₹15,00,000");
                          setInitialInvestment(1500000);
                        }
                      }}
                      className="w-full h-[48px] bg-[#0B241C] border border-[#C49A5A]/35 text-[#F7F0E4] rounded-[14px] px-4 text-sm focus:outline-none focus:border-[#C49A5A] focus:ring-[3px] focus:ring-[#C49A5A]/15 transition-all font-sans font-medium"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] md:text-[13px] text-[#B8C7BC] font-sans">Annual Maintenance (₹)</label>
                    <input
                      type="text"
                      value={annualMaintenance.toLocaleString('en-IN')}
                      onChange={(e) => setAnnualMaintenance(Math.max(0, parseInt(e.target.value.replace(/,/g, '')) || 0))}
                      onBlur={() => {
                        if (annualMaintenance < 12000) {
                          toast.error("Minimum Annual Maintenance is ₹12,000");
                          setAnnualMaintenance(12000);
                        }
                      }}
                      className="w-full h-[48px] bg-[#0B241C] border border-[#C49A5A]/35 text-[#F7F0E4] rounded-[14px] px-4 text-sm focus:outline-none focus:border-[#C49A5A] focus:ring-[3px] focus:ring-[#C49A5A]/15 transition-all font-sans font-medium"
                    />
                  </div>
                </div>

                {/* Profit Sharing Policy Box */}
                <div className="mt-4 border border-[#7F1D1D]/50 bg-gradient-to-r from-[rgba(127,29,29,0.15)] to-[rgba(127,29,29,0.05)] rounded-[16px] p-5 flex gap-4 items-start backdrop-blur-sm">
                  <div className="mt-0.5">
                    <ShieldCheck className="w-5 h-5 text-[#D9B36D]" />
                  </div>
                  <div>
                    <h4 className="text-[#D9B36D] text-[11px] md:text-[12px] font-bold tracking-wide uppercase mb-1.5 font-sans">
                      Profit Sharing Policy
                    </h4>
                    <p className="text-[#B8C7BC] text-[11px] md:text-[12px] leading-relaxed font-sans">
                      Upon completion of the crop cycle, the harvest is sold. The net profits generated are distributed on a 50:50 basis between the investor and the admin/management.
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT CARD — Results Summary */}
              <div className="flex flex-col gap-5 pt-2">
                
                {/* 2x3 Metric Grid */}
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } },
                    hidden: {}
                  }}
                  className="grid grid-cols-2 gap-4"
                >
                  {[
                    { label: 'Total Trees', value: treeCount, icon: Sprout },
                    { label: 'Surviving Trees', value: calculatorMetrics.survivingTrees, icon: Trees },
                    { label: 'Yield (Tons)', value: calculatorMetrics.yieldTons.toFixed(2), icon: Layers },
                    { label: 'Revenue', value: formatCurrency(calculatorMetrics.investorRevenue), icon: Landmark },
                    { label: 'ROI', value: `${Math.round(calculatorMetrics.investorROI)}%`, icon: TrendingUp },
                    { label: 'Net Profit', value: formatCurrency(calculatorMetrics.investorNetProfit), icon: Award }
                  ].map((metric, idx) => (
                    <motion.div 
                      key={idx}
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
                      }}
                      whileHover={{ y: -4, boxShadow: '0 0 15px rgba(196,154,90,0.15)' }}
                      className="bg-[rgba(8,35,27,0.85)] border border-[#C49A5A]/25 rounded-[18px] p-5 flex flex-col items-center justify-center text-center transition-all duration-300"
                    >
                      <metric.icon className="w-6 h-6 text-[#D9B36D] mb-3" />
                      <span className="text-[10px] md:text-[11px] text-[#B8C7BC] font-sans uppercase tracking-[0.1em] mb-1.5 font-medium">
                        {metric.label}
                      </span>
                      <span className="text-[18px] md:text-[22px] font-bold text-[#F7F0E4] font-sans">
                        {metric.value}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* PROJECTED WEALTH CARD */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ boxShadow: '0 0 30px rgba(196,154,90,0.15)' }}
                  className="mt-2 rounded-[20px] border border-[#C49A5A] bg-gradient-to-br from-[rgba(6,31,24,0.9)] to-[rgba(3,15,12,0.95)] p-6 md:p-8 text-center shadow-[inset_0_0_40px_rgba(196,154,90,0.08)] relative overflow-hidden transition-shadow duration-300"
                >
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D9B36D] to-transparent opacity-50" />
                  
                  <h4 className="text-[11px] md:text-[13px] text-[#D9B36D] font-bold tracking-[0.2em] uppercase mb-5 font-sans">
                    PROJECTED WEALTH AT MATURITY
                  </h4>
                  
                  <div className="mb-8">
                    <span className="block text-[10px] md:text-[11px] text-[#B8C7BC] uppercase tracking-widest mb-2 font-sans">Expected Revenue</span>
                    <span className="text-4xl md:text-[54px] font-bold text-[#F7F0E4] font-serif tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {formatCurrency(calculatorMetrics.investorRevenue)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-t border-[#C49A5A]/20 pt-6 px-4 md:px-8">
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] text-[#B8C7BC] uppercase tracking-widest mb-1.5 font-sans">Net Profit</span>
                      <span className="text-[16px] md:text-[20px] font-bold text-[#22C55E] font-sans tracking-wide">
                        {formatCurrency(calculatorMetrics.investorNetProfit)}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-[#B8C7BC] uppercase tracking-widest mb-1.5 font-sans">ROI</span>
                      <span className="text-[16px] md:text-[20px] font-bold text-[#D9B36D] font-sans tracking-wide">
                        {Math.round(calculatorMetrics.investorROI)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

            </div>
          </motion.div>

          {/* CHART SECTION */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-[24px] border border-[#C49A5A]/35 bg-[rgba(8,35,27,0.75)] p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-center backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.3)] mb-8"
          >
            <div className="w-full lg:w-[30%] flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5 text-[#D9B36D]" />
                <h3 className="text-[#D9B36D] text-[20px] font-serif font-bold tracking-wide">Wealth Growth Projection</h3>
              </div>
              <p className="text-[#B8C7BC] text-sm leading-relaxed mb-8 font-sans">
                Your investment today can grow into a legacy for generations.
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[3px] bg-[#D9B36D] rounded-full"></div>
                  <span className="text-[12px] text-[#F7F0E4] font-sans uppercase tracking-widest">Estimated Plantation Value (₹)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[2px] border-t-2 border-dashed border-[#F7F0E4] opacity-80"></div>
                  <span className="text-[12px] text-[#B8C7BC] font-sans uppercase tracking-widest">Total Investment (₹)</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[70%] h-[280px] md:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis 
                    dataKey="year" 
                    stroke="#B8C7BC" 
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    dy={12}
                    tickFormatter={(val) => val.replace('Year ', 'Yr ')}
                  />
                  <YAxis 
                    stroke="#B8C7BC"
                    fontSize={11}
                    tickFormatter={(value) => {
                      if (value >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`;
                      if (value >= 100000) return `${(value / 100000).toFixed(0)}L`;
                      return value.toString();
                    }}
                    tickLine={false}
                    axisLine={false}
                    dx={-8}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(196,154,90,0.05)' }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[rgba(10,38,30,0.95)] border border-[#C49A5A]/50 rounded-[12px] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50">
                            <div className="text-[#D9B36D] font-bold mb-2 text-[13px]">{label.replace('Year ', 'Yr ')}</div>
                            <div className="flex flex-col gap-1 text-[12px]">
                              {payload.map((entry, index) => (
                                <div key={index} className="flex justify-between gap-4 text-[#F7F0E4]">
                                  <span style={{ color: entry.color }}>{entry.name === 'value' ? 'Plantation Value' : 'Total Investment'}</span>
                                  <span className="font-bold">{formatCurrency(entry.value as number)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* Dashed Investment Line */}
                  <Line 
                    type="monotone" 
                    dataKey="investment" 
                    name="Total Investment" 
                    stroke="#F7F0E4" 
                    strokeWidth={2} 
                    strokeDasharray="6 6"
                    strokeOpacity={0.7}
                    dot={false}
                    activeDot={{ r: 4, fill: '#F7F0E4' }}
                  />
                  {/* Gold Growth Curve */}
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Estimated Plantation Value" 
                    stroke="#D9B36D" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, fill: '#D9B36D', stroke: '#0B241C', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* BOTTOM BENEFIT STRIP */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-20">
            {[
              { icon: ShieldCheck, title: "Secure Investment", desc: "100% transparent & secure plantation investment." },
              { icon: Leaf, title: "Sustainable Returns", desc: "High returns with eco-friendly impact." },
              { icon: TrendingUp, title: "Long-Term Growth", desc: "Red sandalwood is a premium & high-value asset." },
              { icon: Users, title: "Legacy for Generations", desc: "Build wealth that grows with nature." },
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
                <div className="mt-1 bg-[#12372A]/50 p-2.5 rounded-[12px] border border-[#C49A5A]/20 shrink-0 shadow-inner">
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
                From Land to Legacy
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
      <section id="gallery-inner" className="py-12 md:py-16 bg-[#F7F0E4] z-20 relative">
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
                  A Legacy of Prestige
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
                Beyond securing a high-yielding natural asset, your investment with Chandan Nilayam grants you entry into an elite community. Experience the perfect harmony of robust financial growth and elevated lifestyle benefits—from 100% genuine legal documentation to luxury clubhouse access and spiritual retreats. We manage the land while you enjoy the prestige and peace of mind.
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
      <section className="py-12 md:py-16 bg-[#F7F0E4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side text and reviews */}
            <div className="lg:col-span-8">
              <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3 font-sans">TRUSTED BY VISIONARY INVESTORS</span>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#12372A] font-display" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Their Words,<br />Our Pride.
                </h2>
                <div className="flex gap-4 flex-wrap mb-2">
                  <button 
                    onClick={() => setIsReviewModalOpen(true)}
                    className="bg-transparent border-2 border-[#C49A5A] hover:bg-[#C49A5A]/10 text-[#C49A5A] font-bold uppercase text-[10px] tracking-wider px-6 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 w-fit"
                  >
                    <Star className="w-3.5 h-3.5" /> Write a Review
                  </button>
                  <Link 
                    href="/testimonials"
                    className="bg-[#C49A5A] hover:bg-[#B38747] text-white border-2 border-[#C49A5A] font-bold uppercase text-[10px] tracking-wider px-6 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 w-fit"
                  >
                    Show more reviews
                  </Link>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {activeTestimonials.slice(0, 6).map((test, i) => (
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
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-[#8B5E3C] font-bold font-sans">{test.location}</span>
                        {test.investment && (
                          <>
                            <span className="text-[#C49A5A]/50 text-[10px]">•</span>
                            <span className="text-[10px] text-[#12372A] font-bold uppercase tracking-wider font-sans bg-[#C49A5A]/10 px-1.5 py-0.5 rounded-sm">{test.investment}</span>
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
            <p className="mb-2">We value your privacy. By proceeding, you agree that your data will be securely processed and stored by Chandan Nilayam Investments.</p>
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
    </div>
  );
}
