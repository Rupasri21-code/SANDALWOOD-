'use client';

import Link from 'next/link';
import { Leaf, Award, Globe, TrendingUp, ShieldCheck, Sprout, Target, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const benefits = [
  {
    title: 'High Appreciating Value',
    description: 'Sandalwood prices have shown solid annual compounding growth over the past decades, outperforming many indices.',
    icon: TrendingUp,
  },
  {
    title: 'Physical Land Ownership',
    description: 'Every investment is backed by registered, surveyed physical plots with clear titles under your name.',
    icon: ShieldCheck,
  },
  {
    title: 'Zero Market Correlation',
    description: 'Commercial timber growth is unaffected by inflation, stock market volatility, or interest rate fluctuations.',
    icon: Sprout,
  },
  {
    title: 'Sustainable Forestry',
    description: 'Your investment helps expand forest cover, absorbs carbon dioxide, and promotes biodiversity.',
    icon: Leaf,
  },
];

export default function InvestmentPage() {
  return (
    <div className="bg-[#F7F0E4] min-h-screen text-[#1E1E1A] font-sans overflow-x-hidden relative">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex items-center justify-center overflow-hidden w-full h-[60vh] min-h-[450px]">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="https://images.pexels.com/photos/1563604/pexels-photo-1563604.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Sandalwood Forest"
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
              Investor Education
            </span>
          </div>

          <h1 
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight"
            style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              textShadow: '0 4px 15px rgba(0, 0, 0, 0.4)' 
            }}
          >
            A Rare Natural Asset<br />with Long-Term Value
          </h1>
          <p className="text-[#E6D3B3] text-base md:text-lg max-w-2xl leading-relaxed font-serif" style={{ fontFamily: "'Lora', serif" }}>
            Learn why sandalwood is considered one of the world's most valuable timber assets and how managed cultivation unlocks legacy wealth.
          </p>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-20">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px]">
            <path d="M0,35 C300,105 600,15 900,105 L1200,55 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* 2. WHAT IS SANDALWOOD INVESTMENT? */}
      <section className="py-24 bg-[#F7F0E4] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Col - Image */}
            <div className="lg:col-span-5 flex justify-center w-full">
              <div className="relative w-full max-w-[480px] aspect-[0.9] rounded-[2.5rem] p-3 bg-[#F3E8D2] border border-[#C49A5A]/30 shadow-[0_20px_50px_rgba(139,94,60,0.2)]">
                <div className="w-full h-full rounded-[2.2rem] overflow-hidden relative">
                  <img 
                    src="/sandalwood_showcase.png" 
                    alt="Sandalwood Logs" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/6784121/pexels-photo-6784121.jpeg?auto=compress&cs=tinysrgb&w=800';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right Col - Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3">THE FUNDAMENTALS</span>
              <h2 
                className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#12372A] mb-6 leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                What is Sandalwood Investment?
              </h2>
              <p className="text-[#2F3E2F] text-base leading-relaxed mb-6 font-sans">
                Managed Sandalwood Investment is a unique asset class that combines land ownership with commercial forestry. You buy a clearly demarcated plot of land near Dornala. On this plot, we plant certified East Indian Sandalwood (*Santalum album*) saplings.
              </p>
              <p className="text-[#2F3E2F] text-base leading-relaxed mb-6 font-sans">
                Sandalwood is a hemiparasitic tree, meaning it requires primary and secondary host plants to draw nutrients and develop its high-value aromatic heartwood. Managing this host-system requires strict agronomic expertise.
              </p>
              <p className="text-[#2F3E2F] text-base leading-relaxed font-sans">
                Our agricultural management team maintains your plot over the 12-year growth cycle. When the trees mature and harvest occurs, the proceeds from the aromatic heartwood are shared with you, delivering substantial wealth.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. WHY SANDALWOOD IS VALUABLE (DEMAND & SCARCITY) */}
      <section className="py-24 bg-[#0B2F24] relative text-white">
        {/* Top curved wave */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] rotate-180">
            <path d="M0,35 C300,105 600,15 900,105 L1200,55 L1200,120 L0,120 Z" />
          </svg>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 py-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#C49A5A] text-xs font-bold tracking-[0.2em] uppercase block mb-3">GLOBAL ECONOMICS</span>
            <h2 
              className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#F7F0E4] leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Rising Demand. Shrinking Supply.
            </h2>
            <p className="text-[#E6D3B3] text-sm md:text-base leading-relaxed mt-4 font-sans">
              East Indian Sandalwood stands as one of the world's most expensive woods due to severe demand-supply imbalances.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Demand card 1 */}
            <div className="bg-[#12372A] border border-[#C49A5A]/30 p-10 rounded-[2rem] shadow-xl flex flex-col items-start hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-[#C49A5A]/15 border border-[#C49A5A] rounded-xl flex items-center justify-center mb-6 text-[#C49A5A]">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-[#F7F0E4]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Multi-Industry Use
              </h3>
              <p className="text-[#E6D3B3] text-xs md:text-sm leading-relaxed font-sans">
                Widely demanded in high-end French perfumery, traditional medicine, luxury soaps, skin care, religious ceremonies, and fine woodwork.
              </p>
            </div>

            {/* Demand card 2 */}
            <div className="bg-[#12372A] border border-[#C49A5A]/30 p-10 rounded-[2rem] shadow-xl flex flex-col items-start hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-[#C49A5A]/15 border border-[#C49A5A] rounded-xl flex items-center justify-center mb-6 text-[#C49A5A]">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-[#F7F0E4]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Extreme Scarcity
              </h3>
              <p className="text-[#E6D3B3] text-xs md:text-sm leading-relaxed font-sans">
                Natural reserves in government forests have shrunk dramatically due to over-harvesting. Cultivated private farms represent the only stable supply path for the future.
              </p>
            </div>

            {/* Demand card 3 */}
            <div className="bg-[#12372A] border border-[#C49A5A]/30 p-10 rounded-[2rem] shadow-xl flex flex-col items-start hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-[#C49A5A]/15 border border-[#C49A5A] rounded-xl flex items-center justify-center mb-6 text-[#C49A5A]">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-[#F7F0E4]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Compounding Prices
              </h3>
              <p className="text-[#E6D3B3] text-xs md:text-sm leading-relaxed font-sans">
                Limited legal harvests maintain high premium pricing. Raw wood prices have registered consistent year-on-year increases, forming a robust hedge.
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

      {/* 4. LONG-TERM VALUE EXPLANATION */}
      <section className="py-24 bg-[#F7F0E4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left side: Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3">TIMELINE & COMPOUNDING</span>
              <h2 
                className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#12372A] mb-6 leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Why Time is Your Greatest Ally
              </h2>
              <p className="text-[#2F3E2F] text-base leading-relaxed mb-6 font-sans">
                Sandalwood cultivation is a long-term investment asset. The *Santalum album* species takes around 12 years to develop high-density heartwood containing rich levels of sandalwood oil (santalol).
              </p>
              <p className="text-[#2F3E2F] text-base leading-relaxed mb-6 font-sans">
                During the initial 1 to 5 years, the saplings establish strong root-parasitic bonds and rapid vegetative growth. From years 5 to 10, the trunk widens, and transition wood starts forming. Between years 10 and 15, the core heartwood expands rapidly, depositing the oil.
              </p>
              <p className="text-[#2F3E2F] text-base leading-relaxed font-sans">
                Harvesting before 12 years results in low oil concentrations and lower quality ratings. By patient holding, you allow the crop to reach its peak market grade, delivering a high multiplier on your original investment.
              </p>
            </div>

            {/* Right side: Image */}
            <div className="lg:col-span-5 flex justify-center w-full">
              <div className="relative w-full max-w-[480px] aspect-[0.9] rounded-[2.5rem] p-3 bg-[#F3E8D2] border border-[#C49A5A]/30 shadow-[0_20px_50px_rgba(139,94,60,0.2)]">
                <div className="w-full h-full rounded-[2.2rem] overflow-hidden relative">
                  <img 
                    src="https://images.pexels.com/photos/15124451/pexels-photo-15124451.jpeg?auto=compress&cs=tinysrgb&w=800" 
                    alt="Growth cycle" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. MANAGED CULTIVATION EXPLANATION */}
      <section className="py-24 bg-[#F3E8D2] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left side: Image */}
            <div className="lg:col-span-5 order-last lg:order-first flex justify-center w-full">
              <div className="relative w-full max-w-[480px] aspect-[0.9] rounded-[2.5rem] p-3 bg-[#F7F0E4] border border-[#C49A5A]/30 shadow-[0_20px_50px_rgba(139,94,60,0.2)]">
                <div className="w-full h-full rounded-[2.2rem] overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1464254786740-b97e5420c299?auto=format&fit=crop&q=80&w=800" 
                    alt="Managed Farming" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </div>

            {/* Right side: Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3">SCIENTIFIC MANAGEMENT</span>
              <h2 
                className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#12372A] mb-6 leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Our Scientific Cultivation Model
              </h2>
              <p className="text-[#2F3E2F] text-base leading-relaxed mb-6 font-sans">
                Cultivating sandalwood is not a simple agricultural task. Sandalwood trees need host plants for survival. We employ a carefully engineered host pattern:
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#8B5E3C] shrink-0 mt-2" />
                  <p className="text-[#2F3E2F] text-sm"><strong className="text-[#12372A]">Primary Hosts:</strong> Cajanus cajan (Red gram) or Crotalaria are planted next to young saplings to provide nitrogen fixation and early support.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#8B5E3C] shrink-0 mt-2" />
                  <p className="text-[#2F3E2F] text-sm"><strong className="text-[#12372A]">Secondary/Permanent Hosts:</strong> Casuarina, Melia dubia, or Neem trees are planted in between rows to sustain the sandalwood roots throughout their mid-to-late growth stages.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#8B5E3C] shrink-0 mt-2" />
                  <p className="text-[#2F3E2F] text-sm"><strong className="text-[#12372A]">Drip Irrigation & Soil Care:</strong> Sandalwood is sensitive to waterlogging. We maintain customized drip irrigation channels to deliver moisture directly to roots without stagnation.</p>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 6. BENEFITS FOR INVESTORS */}
      <section className="py-24 bg-[#F7F0E4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3">TANGIBLE ADVANTAGES</span>
            <h2 
              className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#12372A] leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Benefits That Grow with You
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b, i) => (
              <div 
                key={i}
                className="bg-[#F3E8D2] border border-[#C49A5A]/30 p-8 rounded-3xl shadow-sm flex flex-col items-start hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#8B5E3C]/10 border border-[#8B5E3C]/35 rounded-xl flex items-center justify-center text-[#8B5E3C] mb-6">
                  <b.icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#12372A] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {b.title}
                </h3>
                <p className="text-[#2F3E2F] text-xs leading-relaxed font-sans">
                  {b.description}
                </p>
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
          <span className="text-[#C49A5A] text-xs font-bold tracking-[0.2em] uppercase block mb-4">START TODAY</span>
          <h2 
            className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Explore the Sandalwood Opportunity
          </h2>
          <p className="text-[#E6D3B3] text-sm md:text-base leading-relaxed max-w-xl mb-10 font-sans">
            Have questions about land titles, tax exemptions, or returns? Speak to our team of investment advisors today.
          </p>
          <Link href="/home#investor-inquiry">
            <Button 
              size="lg"
              className="bg-[#C49A5A] hover:bg-[#8B5E3C] text-white hover:opacity-90 px-10 py-6 text-sm font-semibold uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2 border border-white/10 shadow-lg"
            >
              EXPLORE THE OPPORTUNITY <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
