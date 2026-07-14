'use client';

import Link from 'next/link';
import { Leaf, ShieldCheck, Sprout, Target, Eye, Shield, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const team = [
  {
    name: 'Vijay Kumar',
    title: 'Founder & CEO',
    bio: '25 years in agribusiness and land investment. Nurturing agricultural assets with high compliance.',
    image: 'https://images.pexels.com/photos/9623645/pexels-photo-9623645.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Dr. Meena Sharma',
    title: 'Chief Agronomist',
    bio: 'Ph.D. in Forest Sciences. Expert in Santalum album cultivation with 18 years of field experience.',
    image: 'https://images.pexels.com/photos/36733296/pexels-photo-36733296.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Rahul Desai',
    title: 'Head of Investor Relations',
    bio: 'Experienced wealth advisor. Dedicated to transparent client communication and portal support.',
    image: 'https://images.pexels.com/photos/4965009/pexels-photo-4965009.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Sunita Rao',
    title: 'Legal & Land Compliance',
    bio: 'Expert in land acquisition law, ensuring 100% clear titles and registered land deeds for investors.',
    image: 'https://images.pexels.com/photos/10041264/pexels-photo-10041264.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

const values = [
  {
    title: 'Transparency',
    description: 'We offer real-time crop updates, documentation logs, and transaction receipts on your investor portal.',
    icon: Eye,
  },
  {
    title: 'Sustainability',
    description: 'Our cultivation practices enrich local soil quality, restore green cover, and respect natural ecosystem balances.',
    icon: Leaf,
  },
  {
    title: 'Expert Care',
    description: 'Under guidance of forestry scientists, we maintain strict drip irrigation, host-plant spacing, and security.',
    icon: Sprout,
  },
  {
    title: 'Long-term Growth',
    description: 'We structure assets to grow steadily with time, building compounding wealth for you and your future generations.',
    icon: ShieldCheck,
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#F7F0E4] min-h-screen text-[#1E1E1A] font-sans overflow-x-hidden relative">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex items-center justify-center overflow-hidden w-full h-[60vh] min-h-[450px]">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1920"
            alt="Plantation Hills"
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
              About Chandan Nilayam
            </span>
          </div>

          <h1 
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight"
            style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              textShadow: '0 4px 15px rgba(0, 0, 0, 0.4)' 
            }}
          >
            Rooted in Trust.<br />Growing with Purpose.
          </h1>
          <p className="text-[#E6D3B3] text-base md:text-lg max-w-2xl leading-relaxed font-serif" style={{ fontFamily: "'Lora', serif" }}>
            Combining sustainable commercial forestry with legal land security to offer investors premium growth.
          </p>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-20">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px]">
            <path d="M0,35 C300,105 600,15 900,105 L1200,55 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* 2. COMPANY STORY */}
      <section className="py-24 bg-[#F7F0E4] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Side: Text */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3">OUR ORIGIN STORY</span>
              <h2 
                className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#12372A] mb-6 leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Managing Wealth Across Generations
              </h2>
              <p className="text-[#2F3E2F] text-base leading-relaxed mb-6 font-sans">
                Chandan Nilayam Investments manages 100 acres of premium, high-fertility land near Dornala, Andhra Pradesh. We recognized the rare alignment between the soaring global demand for high-grade sandalwood (*Santalum album*) and the security of physical land ownership.
              </p>
              <p className="text-[#2F3E2F] text-base leading-relaxed mb-6 font-sans">
                Our approach divides premium land into clearly surveyed, registered plots sold directly to investors. Post-purchase, our experienced agronomists and estate management teams take complete charge of soil conditioning, host-plant cultivation, security, and tree nourishment.
              </p>
              <p className="text-[#2F3E2F] text-base leading-relaxed font-sans">
                By blending institutional forestry practices with an investor portal that provides transparent updates, documents, and crop logs, we offer a completely hassle-free road to wealth creation.
              </p>
            </div>

            {/* Right Side: Image Showcase */}
            <div className="lg:col-span-5 relative flex justify-center w-full">
              <div className="relative w-full max-w-[480px] aspect-[0.9] rounded-[2.5rem] p-3 bg-[#F3E8D2] border border-[#C49A5A]/30 shadow-[0_20px_50px_rgba(139,94,60,0.2)] group hover:scale-[1.02] transition-transform duration-500">
                <div className="w-full h-full rounded-[2.2rem] overflow-hidden relative">
                  <img 
                    src="/investment-growth.jpg" 
                    alt="Premium Land" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. VISION & MISSION */}
      <section className="py-24 bg-[#0B2F24] relative text-white">
        {/* Top curved wave */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] rotate-180">
            <path d="M0,35 C300,105 600,15 900,105 L1200,55 L1200,120 L0,120 Z" />
          </svg>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Vision card */}
            <div className="bg-[#12372A] border border-[#C49A5A]/30 p-10 rounded-[2rem] shadow-xl flex flex-col items-start hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-[#C49A5A]/25 border border-[#C49A5A] rounded-2xl flex items-center justify-center mb-6 text-[#C49A5A]">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4 text-[#F7F0E4]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Our Vision
              </h3>
              <p className="text-[#E6D3B3] text-sm md:text-base leading-relaxed font-sans">
                To become India's most trusted managed farmland platform, connecting investors with high-value organic forestry, promoting carbon sequestration, and secure generational capital growth.
              </p>
            </div>

            {/* Mission card */}
            <div className="bg-[#12372A] border border-[#C49A5A]/30 p-10 rounded-[2rem] shadow-xl flex flex-col items-start hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-[#C49A5A]/25 border border-[#C49A5A] rounded-2xl flex items-center justify-center mb-6 text-[#C49A5A]">
                <Sprout className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4 text-[#F7F0E4]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Our Mission
              </h3>
              <p className="text-[#E6D3B3] text-sm md:text-base leading-relaxed font-sans">
                To simplify green investments by providing end-to-end, scientifically backed cultivation of premium sandalwood trees, paired with legally secured land titles and real-time monitoring.
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

      {/* 4. VALUE OF DORNALA LOCATION */}
      <section className="py-24 bg-[#F7F0E4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left side: Images */}
            <div className="lg:col-span-5 order-last lg:order-first flex justify-center w-full">
              <div className="relative w-full max-w-[480px] aspect-[0.9] rounded-[2.5rem] p-3 bg-[#F3E8D2] border border-[#C49A5A]/30 shadow-[0_20px_50px_rgba(139,94,60,0.2)]">
                <div className="w-full h-full rounded-[2.2rem] overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800" 
                    alt="Dornala Location" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </div>

            {/* Right side: Location details */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3">LOCATION STRENGTH</span>
              <h2 
                className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#12372A] mb-6 leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Why Dornala is Ideal for Sandalwood
              </h2>
              <p className="text-[#2F3E2F] text-base leading-relaxed mb-6 font-sans">
                Our 50-acre plantation is situated in Dornala mandal, Prakasam district, Andhra Pradesh. This location was meticulously chosen based on key parameters:
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-[#8B5E3C]/10 flex items-center justify-center text-[#8B5E3C] shrink-0 mt-1">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#12372A] text-sm uppercase tracking-wide">Excellent Soil Drainage</h4>
                    <p className="text-[#2F3E2F] text-xs leading-relaxed mt-0.5">Sandalwood requires well-drained red gravelly or lateritic soils. The Dornala soil maintains a perfect pH range, preventing root-rot.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-[#8B5E3C]/10 flex items-center justify-center text-[#8B5E3C] shrink-0 mt-1">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#12372A] text-sm uppercase tracking-wide">Optimal Semi-Arid Climate</h4>
                    <p className="text-[#2F3E2F] text-xs leading-relaxed mt-0.5">Abundant sunlight and moderate rainfall stimulate the synthesis of essential oils in the heartwood. High sunlight accelerates trunk growth.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-[#8B5E3C]/10 flex items-center justify-center text-[#8B5E3C] shrink-0 mt-1">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#12372A] text-sm uppercase tracking-wide">Infrastructure & Accessibility</h4>
                    <p className="text-[#2F3E2F] text-xs leading-relaxed mt-0.5">Located near major national highways, the plot offers perfect physical access for inspections, plantation upkeep, and eventual harvest logistics.</p>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 5. OUR VALUES */}
      <section className="py-24 bg-[#F3E8D2] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3">OUR CORE VALUES</span>
            <h2 
              className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#12372A] leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Built on Professionalism and Stewardship
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div 
                key={i}
                className="bg-[#F7F0E4] border border-[#C49A5A]/30 p-8 rounded-3xl shadow-sm flex flex-col items-start hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#8B5E3C]/10 border border-[#8B5E3C]/35 rounded-xl flex items-center justify-center text-[#8B5E3C] mb-6">
                  <v.icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#12372A] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {v.title}
                </h3>
                <p className="text-[#2F3E2F] text-xs leading-relaxed font-sans">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MANAGEMENT/TEAM SECTION */}
      <section className="py-24 bg-[#F7F0E4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3">EXPERTISE BACKED</span>
            <h2 
              className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#12372A] leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              The Minds Steering Your Investment
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div 
                key={i}
                className="bg-[#F3E8D2] border border-[#C49A5A]/20 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group flex flex-col"
              >
                <div className="w-full aspect-[1] overflow-hidden relative">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 text-left flex-1 flex flex-col">
                  <h3 className="font-serif text-lg font-bold text-[#12372A] leading-none mb-1.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {member.name}
                  </h3>
                  <span className="text-[#8B5E3C] text-[10px] font-bold uppercase tracking-wider block mb-3">
                    {member.title}
                  </span>
                  <p className="text-[#2F3E2F] text-xs leading-relaxed font-sans">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="relative py-28 bg-[#0B2F24] overflow-hidden text-center text-white">
        {/* Top curved wave */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] rotate-180">
            <path d="M0,35 C300,105 600,15 900,105 L1200,55 L1200,120 L0,120 Z" />
          </svg>
        </div>

        <div className="relative z-20 max-w-4xl mx-auto px-6 py-4 flex flex-col items-center">
          <span className="text-[#C49A5A] text-xs font-bold tracking-[0.2em] uppercase block mb-4">SECURE YOUR FUTURE</span>
          <h2 
            className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Start Your Investment Journey Today
          </h2>
          <p className="text-[#E6D3B3] text-sm md:text-base leading-relaxed max-w-xl mb-10 font-sans">
            Plots are allocated on a first-come, first-served basis. Nurture an appreciating asset and create a heritage legacy.
          </p>
          <Link href="/inquiry">
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
