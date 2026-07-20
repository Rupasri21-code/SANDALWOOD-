'use client';

import Link from 'next/link';
import { Leaf, MapPin, Activity, Sun, Shield, Settings, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const careSteps = [
  {
    title: 'Soil Preparation',
    desc: 'Deep ploughing, soil neutralization, organic manure blending, and building host planting mounds.',
    icon: Settings,
  },
  {
    title: 'Host Plant Inoculation',
    desc: 'Planting fast-growing primary hosts to supply seedlings with nitrogen and vital macro-nutrients.',
    icon: Leaf,
  },
  {
    title: 'Automated Drip Setup',
    desc: 'Specially designed subsurface lines ensure moisture access without causing root waterlogging.',
    icon: Activity,
  },
  {
    title: 'Multi-Tier Security',
    desc: 'Surrounding fencing, solar wiring, CCTV coverage, and 24/7 security watch guards prevent damage.',
    icon: Shield,
  },
];

export default function PlantationPage() {
  return (
    <div className="bg-[#F7F0E4] min-h-screen text-[#1E1E1A] font-sans overflow-x-hidden relative">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex items-center justify-center overflow-hidden w-full h-[60vh] min-h-[450px]">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1920"
            alt="Developed Sandalwood Plantation"
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
            <Leaf className="w-4 h-4 text-[#8B5E3C]" />
            <span className="text-[10px] font-bold tracking-[2px] uppercase text-[#8B5E3C]">
              Dornala Plantation
            </span>
          </div>

          <h1 
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight"
            style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              textShadow: '0 4px 15px rgba(0, 0, 0, 0.4)' 
            }}
          >
            Developed Land.<br />Nurtured with Science.
          </h1>
          <p className="text-[#E6D3B3] text-base md:text-lg max-w-2xl leading-relaxed font-serif" style={{ fontFamily: "'Lora', serif" }}>
            Explore our 50-acre premium sandalwood plantation located near Dornala, designed for maximum yield and security.
          </p>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-20">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px]">
            <path d="M0,35 C300,105 600,15 900,105 L1200,55 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* 2. 50-ACRE LAND OVERVIEW */}
      <section className="py-24 bg-[#F7F0E4] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Col - Text */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3">PLANNED INFRASTRUCTURE</span>
              <h2 
                className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#12372A] mb-6 leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                A Model 100-Acre Agricultural Estate
              </h2>
              <p className="text-[#2F3E2F] text-base leading-relaxed mb-6 font-sans">
                Our plantation represents 100 acres of premium, high-value agricultural land. The estate is divided systematically into blocks and plots, each connected by access roads to allow seamless monitoring and maintenance.
              </p>
              <p className="text-[#2F3E2F] text-base leading-relaxed mb-6 font-sans">
                The entire boundary is walled and fenced, with central security outposts managing access. Every tree is tagged and cataloged digitally in our database, which feeds crop updates directly to your investor portal.
              </p>
              <p className="text-[#2F3E2F] text-base leading-relaxed font-sans">
                By investing, you purchase a specific plot (e.g. 0.25 acres or 0.5 acres) within this premium ecosystem, benefiting from shared maintenance, professional agronomists, and bulk resources.
              </p>
            </div>

            {/* Right Col - Image */}
            <div className="lg:col-span-5 flex justify-center w-full">
              <div className="relative w-full max-w-[480px] aspect-[0.9] rounded-[2.5rem] p-3 bg-[#F3E8D2] border border-[#C49A5A]/30 shadow-[0_20px_50px_rgba(139,94,60,0.2)]">
                <div className="w-full h-full rounded-[2.2rem] overflow-hidden relative">
                  <img 
                    src="https://images.pexels.com/photos/15124451/pexels-photo-15124451.jpeg?auto=compress&cs=tinysrgb&w=800" 
                    alt="50-Acre Land View" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SOIL AND CLIMATE DETAILS */}
      <section className="py-24 bg-[#0B2F24] relative text-white">
        {/* Top curved wave */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] rotate-180">
            <path d="M0,35 C300,105 600,15 900,105 L1200,55 L1200,120 L0,120 Z" />
          </svg>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 py-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#C49A5A] text-xs font-bold tracking-[0.2em] uppercase block mb-3">AGRONOMY CONDITIONS</span>
            <h2 
              className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#F7F0E4] leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              The Science of Soil and Sunshine
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Soil */}
            <div className="bg-[#12372A] border border-[#C49A5A]/30 p-10 rounded-[2rem] shadow-xl flex flex-col items-start">
              <div className="w-12 h-12 bg-[#C49A5A]/15 border border-[#C49A5A] rounded-xl flex items-center justify-center mb-6 text-[#C49A5A]">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-4 text-[#F7F0E4]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Red Gravelly & Lateritic Soil
              </h3>
              <p className="text-[#E6D3B3] text-sm leading-relaxed font-sans">
                Our soil surveys confirm perfect levels of gravel and sand, preventing water retention. The chemical profile shows adequate mineral counts (iron, potash) and an optimal pH value of 6.5–7.5, matching the natural conditions of native sandalwood zones.
              </p>
            </div>

            {/* Climate */}
            <div className="bg-[#12372A] border border-[#C49A5A]/30 p-10 rounded-[2rem] shadow-xl flex flex-col items-start">
              <div className="w-12 h-12 bg-[#C49A5A]/15 border border-[#C49A5A] rounded-xl flex items-center justify-center mb-6 text-[#C49A5A]">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-4 text-[#F7F0E4]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Semi-Arid Climate Advantage
              </h3>
              <p className="text-[#E6D3B3] text-sm leading-relaxed font-sans">
                Dornala receives moderate rainfall and features warm temperatures with intense sunshine for most of the year. Agronomic studies show that slight dry spells actually stimulate sandalwood trees to synthesize more essential aromatic oil in the heartwood.
              </p>
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

      {/* 4. PLANTATION ROWS IMAGE SECTION */}
      <section className="py-24 bg-[#F7F0E4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left side: Images */}
            <div className="lg:col-span-5 order-last lg:order-first flex justify-center w-full">
              <div className="relative w-full max-w-[480px] aspect-[1.1] rounded-[2.5rem] p-3 bg-[#F3E8D2] border border-[#C49A5A]/30 shadow-[0_20px_50px_rgba(139,94,60,0.2)]">
                <div className="w-full h-full rounded-[2.2rem] overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800" 
                    alt="Plantation Rows" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </div>

            {/* Right side: Row details */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3">SYSTEMATIC PLANTING</span>
              <h2 
                className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#12372A] mb-6 leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Meticulous Row Layout and Spacing
              </h2>
              <p className="text-[#2F3E2F] text-base leading-relaxed mb-6 font-sans">
                Our sandalwood saplings are planted in rows spaced 10 to 12 feet apart. Between rows, we maintain primary and secondary host crops like Melia dubia, pigeon pea, and neem.
              </p>
              <p className="text-[#2F3E2F] text-base leading-relaxed font-sans">
                This spacing ensures that the sandalwood roots can easily tap into host plant root systems, establishing parasitic connections (haustoria) to draw nutrients, while receiving optimal sunlight on their canopy.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. LAND LOCATION NEAR DORNALA */}
      <section className="py-24 bg-[#F3E8D2] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left side: Text */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3">THE REGION</span>
              <h2 
                className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#12372A] mb-6 leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Strategically Positioned near Dornala
              </h2>
              <p className="text-[#2F3E2F] text-base leading-relaxed mb-6 font-sans">
                Dornala lies in Prakasam district, Andhra Pradesh. This region offers an excellent climate, low pollution levels, and secure land holdings.
              </p>
              <p className="text-[#2F3E2F] text-base leading-relaxed font-sans">
                The land has clear registered titles, completely owned by Chandhan Nilayam Investments and sub-deeded directly to investors. Our proximity to transportation routes simplifies physical audits and logistics.
              </p>
            </div>

            {/* Right side: Map Placeholder */}
            <div className="lg:col-span-5 flex justify-center w-full">
              <div className="relative w-full max-w-[480px] aspect-[1.1] rounded-[2.5rem] p-3 bg-[#F7F0E4] border border-[#C49A5A]/30 shadow-[0_20px_50px_rgba(139,94,60,0.2)] flex flex-col items-center justify-center text-center">
                <MapPin className="w-12 h-12 text-[#8B5E3C] mb-4" />
                <h4 className="font-serif text-lg font-bold text-[#12372A] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Dornala, Andhra Pradesh</h4>
                <p className="text-[#2F3E2F] text-xs max-w-xs leading-relaxed">
                  Located near the reserve forests, offering natural shielding, suitable soil depth, and water sources.
                </p>
                <div className="mt-6 w-full h-[150px] rounded-2xl bg-[#E6D3B3]/40 border border-[#C49A5A]/25 flex items-center justify-center text-[#8B5E3C]/60 text-xs font-semibold uppercase tracking-wider">
                  Interactive Map View
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. PLANTATION CARE PROCESS */}
      <section className="py-24 bg-[#F7F0E4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3">HOW WE CARE</span>
            <h2 
              className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#12372A] leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Plantation Care Protocol
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {careSteps.map((step, i) => (
              <div 
                key={i}
                className="bg-[#F3E8D2] border border-[#C49A5A]/30 p-8 rounded-3xl shadow-sm flex flex-col items-start hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#8B5E3C]/10 border border-[#8B5E3C]/35 rounded-xl flex items-center justify-center text-[#8B5E3C] mb-6">
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#12372A] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {step.title}
                </h3>
                <p className="text-[#2F3E2F] text-xs leading-relaxed font-sans">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. GALLERY PREVIEW */}
      <section className="py-24 bg-[#F3E8D2]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3">VISUAL GLIMPSE</span>
              <h2 
                className="font-serif text-3xl md:text-4xl font-bold text-[#12372A] leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Plantation Progress Photos
              </h2>
            </div>
            <Link href="/gallery">
              <Button variant="link" className="text-[#8B5E3C] font-semibold text-sm hover:text-[#0B2F24] p-0 flex items-center gap-1.5 mt-4 md:mt-0 uppercase tracking-wider">
                VIEW FULL GALLERY <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              'https://images.pexels.com/photos/15124451/pexels-photo-15124451.jpeg?auto=compress&cs=tinysrgb&w=400',
              '/investment-growth.jpg',
              'https://images.pexels.com/photos/1563604/pexels-photo-1563604.jpeg?auto=compress&cs=tinysrgb&w=400',
              'https://images.pexels.com/photos/10316168/pexels-photo-10316168.jpeg?auto=compress&cs=tinysrgb&w=400',
            ].map((src, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-sm aspect-video border border-[#C49A5A]/30">
                <img src={src} className="w-full h-full object-cover" alt="Plantation Thumb" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA SECTION */}
      <section className="relative py-28 bg-[#0B2F24] overflow-hidden text-center text-white">
        {/* Top curved wave */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] rotate-180">
            <path d="M0,35 C300,105 600,15 900,105 L1200,55 L1200,120 L0,120 Z" />
          </svg>
        </div>

        <div className="relative z-20 max-w-4xl mx-auto px-6 py-4 flex flex-col items-center">
          <span className="text-[#C49A5A] text-xs font-bold tracking-[0.2em] uppercase block mb-4">VISIT THE ESTATE</span>
          <h2 
            className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Schedule a Plantation Visit
          </h2>
          <p className="text-[#E6D3B3] text-sm md:text-base leading-relaxed max-w-xl mb-10 font-sans">
            Witness the development, soil structure, and host plant system first-hand. We arrange guided tours for prospective investors.
          </p>
          <Link href="/contact">
            <Button 
              size="lg"
              className="bg-[#C49A5A] hover:bg-[#8B5E3C] text-white hover:opacity-90 px-10 py-6 text-sm font-semibold uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2 border border-white/10 shadow-lg"
            >
              BOOK SITE VISIT <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
