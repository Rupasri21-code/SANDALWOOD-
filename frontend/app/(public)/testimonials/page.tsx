'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, Quote, Leaf, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    name: 'Rajesh Patel',
    title: 'Agri-Entrepreneur',
    location: 'Ahmedabad, Gujarat',
    investment: '0.5 Acre Plot – Joined 2018',
    text: "I was highly skeptical about managed farm models, but Chandhan Nilayam's compliance and clear title deed sold me. The investor portal provides regular, verified crop photos and agronomy reports. Highly recommended for long term diversification.",
    rating: 5,
    image: 'https://images.pexels.com/photos/8937582/pexels-photo-8937582.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Priya Krishnamurthy',
    title: 'IT Director',
    location: 'Bengaluru, Karnataka',
    investment: '1.25 Acre Plot – Joined 2019',
    text: "The portal experience is fantastic. I get quarterly soil analyses and sapling growth measurements. Knowing my plot near Dornala is managed by professional agronomists and protected by 24/7 solar fencing gives me solid peace of mind.",
    rating: 5,
    image: 'https://images.pexels.com/photos/3777567/pexels-photo-3777567.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Arjun Nair',
    title: 'Chartered Accountant',
    location: 'Kochi, Kerala',
    investment: '2.5 Acre Plot – Joined 2017',
    text: "As an auditor, I scrutinize cost projections. Sandalwood returns are heavily supported by commercial timber shortage. The fact that the land title is registered in my name means the downside risk is backed by a physical appreciating asset.",
    rating: 5,
    image: 'https://images.pexels.com/photos/9363120/pexels-photo-9363120.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Sunita Rao',
    title: 'Retired Principal',
    location: 'Pune, Maharashtra',
    investment: '0.25 Acre Plot – Joined 2020',
    text: "After retiring, I wanted a secure asset that I could hand down to my children. Chandhan Nilayam made the registration deed process transparent. Every step was managed through their legal department with prompt communications.",
    rating: 5,
    image: 'https://images.pexels.com/photos/10041264/pexels-photo-10041264.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Dr. Vikram Singh',
    title: 'Pediatrician',
    location: 'Delhi, NCR',
    investment: '5.0 Acre Plot – Joined 2016',
    text: "My association with the forestry team has been exceptional. The heartwood deposition studies on my trees show strong growth indicators. The managed host-tree system has been set up with high scientific diligence.",
    rating: 5,
    image: 'https://images.pexels.com/photos/9623645/pexels-photo-9623645.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Ananya Mehta',
    title: 'Retail Business Owner',
    location: 'Hyderabad, Telangana',
    investment: '1.0 Acre Plot – Joined 2021',
    text: "Chandhan Nilayam has delivered 100% on what was promised. Clear boundary sketches, prompt payment receipts, and excellent support response rates. A premium agricultural investment platform.",
    rating: 5,
    image: 'https://images.pexels.com/photos/36733295/pexels-photo-36733295.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
];

const featuredStories = [
  {
    title: "Building Generational Wealth",
    subtitle: "Priya K's Investment Journey",
    desc: "Priya invested in 1.25 acres of land near Dornala in 2019. Over the past 7 years, she has witnessed her 150 sandalwood trees grow into sturdy saplings. Through the portal, she keeps track of height measurements, fertilizer schedules, and soil hydration levels.",
    quote: "Sandalwood is a 12-year legacy. It grows as my children grow, serving as a solid backing for their educational future.",
    src: "https://images.pexels.com/photos/3777567/pexels-photo-3777567.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    title: "Diversifying CA Portfolios",
    subtitle: "Arjun Nair's Financial Perspective",
    desc: "Arjun Naira CA based in Kochi wanted an alternative investment with zero correlation to indices. He chose a 2.5 acre plot. After reviewing agricultural tax exemptions and global market scarcity, he structured his holding as an agricultural estate asset.",
    quote: "Managed forestry offers agricultural income tax benefits under Sec. 2(1A). From a risk-adjusted return angle, it outperforms gold.",
    src: "https://images.pexels.com/photos/9363120/pexels-photo-9363120.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
];

export default function TestimonialsPage() {
  const [carouselIndex, setCarouselIndex] = useState(0);

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev === 0 ? featuredStories.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev === featuredStories.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-[#F7F0E4] min-h-screen text-[#1E1E1A] font-sans overflow-x-hidden relative">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex items-center justify-center overflow-hidden w-full h-[55vh] min-h-[400px]">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1920"
            alt="Testimonials Background"
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
              Investor Words
            </span>
          </div>

          <h1 
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight"
            style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              textShadow: '0 4px 15px rgba(0, 0, 0, 0.4)' 
            }}
          >
            Their Words, Our Pride
          </h1>
          <p className="text-[#E6D3B3] text-base md:text-lg max-w-2xl leading-relaxed font-serif" style={{ fontFamily: "'Lora', serif" }}>
            Read real feedback and wealth narratives from our growing family of plot investors.
          </p>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-20">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px]">
            <path d="M0,35 C300,105 600,15 900,105 L1200,55 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* 2. TRUST STATISTICS */}
      <section className="py-16 bg-[#F3E8D2] border-b border-[#C49A5A]/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { val: '1000+', label: 'Registered Investors' },
              { val: '100 Acres', label: 'Premium Land Near Dornala' },
              { val: '4.9 / 5', label: 'Average Customer Rating' },
              { val: '100%', label: 'Deed Registrations Completed' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="font-serif text-4xl font-bold text-[#12372A]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{stat.val}</span>
                <span className="text-[#8B5E3C] text-xs font-bold uppercase tracking-wider mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TESTIMONIAL CARDS GRID */}
      <section className="py-24 bg-[#F7F0E4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3">INVESTOR TESTIMONIALS</span>
            <h2 
              className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#12372A] leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Stories of Compounding Trust
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-[#F3E8D2] border border-[#C49A5A]/35 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <Quote className="w-8 h-8 text-[#C49A5A]/45 mb-4" />
                  <p className="text-[#2F3E2F] text-xs md:text-sm leading-relaxed mb-6 font-serif italic" style={{ fontFamily: "'Lora', serif" }}>
                    "{t.text}"
                  </p>
                </div>
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-[#C49A5A] text-[#C49A5A]" />
                    ))}
                  </div>
                  <div className="flex items-center gap-3.5 pt-4 border-t border-[#C49A5A]/20">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-[#C49A5A]/30"
                    />
                    <div className="text-left">
                      <h4 className="font-serif text-sm font-bold text-[#12372A] leading-none mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.name}</h4>
                      <div className="text-[#2F3E2F]/80 text-[10px] leading-none mb-0.5">{t.title} · {t.location}</div>
                      <div className="text-[#8B5E3C] text-[9px] font-bold uppercase tracking-wider">{t.investment}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. REVIEW CAROUSEL SECTION */}
      <section className="py-24 bg-[#0B2F24] relative text-white">
        {/* Top curved wave */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] rotate-180">
            <path d="M0,35 C300,105 600,15 900,105 L1200,55 L1200,120 L0,120 Z" />
          </svg>
        </div>

        <div className="relative z-20 max-w-5xl mx-auto px-6 py-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#C49A5A] text-xs font-bold tracking-[0.2em] uppercase block mb-3">FEATURED INVESTOR STORIES</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              In-Depth Investment Journey Case Studies
            </h2>
          </div>

          <div className="bg-[#12372A] border border-[#C49A5A]/35 rounded-[3rem] p-8 md:p-12 shadow-xl relative">
            <div className="grid md:grid-cols-12 gap-8 items-center">
              
              {/* Image */}
              <div className="md:col-span-4 rounded-2xl overflow-hidden border border-[#C49A5A]/25 aspect-square">
                <img 
                  src={featuredStories[carouselIndex].src} 
                  alt="Story profile" 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Text */}
              <div className="md:col-span-8 text-left">
                <span className="text-[#C49A5A] text-[10px] font-bold uppercase tracking-wider block mb-1">{featuredStories[carouselIndex].title}</span>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {featuredStories[carouselIndex].subtitle}
                </h3>
                <p className="text-[#E6D3B3] text-xs md:text-sm leading-relaxed mb-6 font-sans">
                  {featuredStories[carouselIndex].desc}
                </p>
                <div className="border-l-2 border-[#C49A5A] pl-4 italic text-white/90 text-xs md:text-sm mb-6 font-serif">
                  "{featuredStories[carouselIndex].quote}"
                </div>
              </div>

            </div>

            {/* Slider Controls */}
            <div className="absolute right-8 bottom-8 flex gap-3 z-30">
              <button 
                onClick={prevSlide}
                className="w-10 h-10 rounded-full border border-[#C49A5A]/45 hover:border-[#C49A5A] hover:bg-[#C49A5A]/10 flex items-center justify-center text-[#C49A5A] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextSlide}
                className="w-10 h-10 rounded-full border border-[#C49A5A]/45 hover:border-[#C49A5A] hover:bg-[#C49A5A]/10 flex items-center justify-center text-[#C49A5A] transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom curved wave */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px]">
            <path d="M0,35 C300,105 600,15 900,105 L1200,55 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="relative py-28 bg-[#0B2F24] overflow-hidden text-center text-white">
        <div className="relative z-20 max-w-4xl mx-auto px-6 py-4 flex flex-col items-center">
          <span className="text-[#C49A5A] text-xs font-bold tracking-[0.2em] uppercase block mb-4">JOIN US</span>
          <h2 
            className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Join Our Investor Community
          </h2>
          <p className="text-[#E6D3B3] text-sm md:text-base leading-relaxed max-w-xl mb-10 font-sans">
            Ready to secure a physical asset registered in your name? Enter your investment preferences today and let our support team guide you.
          </p>
          <Link href="/home#investor-inquiry">
            <Button 
              size="lg"
              className="bg-[#C49A5A] hover:bg-[#8B5E3C] text-white hover:opacity-90 px-10 py-6 text-sm font-semibold uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2 border border-white/10 shadow-lg"
            >
              BOOK INVESTOR INQUIRY <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
