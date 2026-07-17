'use client';

import Link from 'next/link';
import { Leaf, MapPin, Layers, Sprout, Activity, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  {
    num: '01',
    title: 'Land Acquisition',
    description: 'Securing high-fertility, surveyed land blocks near Dornala with 100% legal compliance and clear, verify-ready deeds.',
    icon: MapPin,
    image: '/investment-growth.jpg',
  },
  {
    num: '02',
    title: 'Land Development',
    description: 'Leveling plots, conditioning soil chemistry, setting boundary fences, and erecting security posts and water channels.',
    icon: Layers,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=300',
  },
  {
    num: '03',
    title: 'Plot Allocation',
    description: 'Registered plots are legally deeded to our investors, granting them clear agricultural title deeds.',
    icon: Award,
    image: 'https://images.pexels.com/photos/9363120/pexels-photo-9363120.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    num: '04',
    title: 'Sandalwood Plantation',
    description: 'East Indian sandalwood saplings along with their host tree crops are planted in a scientifically spacing matrix.',
    icon: Sprout,
    image: 'https://images.unsplash.com/photo-1464254786740-b97e5420c299?auto=format&fit=crop&q=80&w=300',
  },
  {
    num: '05',
    title: 'Maintenance & Monitoring',
    description: 'Deploying agronomic teams for organic fertilization, micro-irrigation management, pruning, and security runs.',
    icon: SettingsIcon,
    image: 'https://images.pexels.com/photos/11669262/pexels-photo-11669262.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    num: '06',
    title: 'Growth Updates',
    description: 'Publishing regular tree health logs, growth dimensions, and media galleries directly to the investor dashboard portal.',
    icon: Activity,
    image: 'https://images.pexels.com/photos/15124451/pexels-photo-15124451.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    num: '07',
    title: 'Harvest & Returns',
    description: 'Harvesting mature timber after 12 years. Heartwood is sold, and profits are distributed to plot holders.',
    icon: TrendingUp,
    image: 'https://images.pexels.com/photos/6784121/pexels-photo-6784121.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
];

function SettingsIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function ProcessPage() {
  return (
    <div className="bg-[#F7F0E4] min-h-screen text-[#1E1E1A] font-sans overflow-x-hidden relative">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex items-center justify-center overflow-hidden w-full h-[60vh] min-h-[450px]">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="https://images.unsplash.com/photo-1464254786740-b97e5420c299?auto=format&fit=crop&q=80&w=1920"
            alt="Timeline Background"
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
              Plantation Cycle
            </span>
          </div>

          <h1 
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight"
            style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              textShadow: '0 4px 15px rgba(0, 0, 0, 0.4)' 
            }}
          >
            From Land to Legacy
          </h1>
          <p className="text-[#E6D3B3] text-base md:text-lg max-w-2xl leading-relaxed font-serif" style={{ fontFamily: "'Lora', serif" }}>
            Follow our structured 7-stage cultivation lifecycle designed to yield top-grade sandalwood heartwood.
          </p>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-20">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px]">
            <path d="M0,35 C300,105 600,15 900,105 L1200,55 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* 2. TIMELINE SECTION */}
      <section className="py-24 bg-[#F7F0E4] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3">CULTIVATION TIMELINE</span>
            <h2 
              className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#12372A] leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Our Step-by-Step Plantation Journey
            </h2>
          </div>

          {/* DESKTOP TIMELINE: Horizontal scrolling layout */}
          <div className="hidden lg:block relative w-full mb-16 overflow-x-auto pb-10 scrollbar-thin scrollbar-thumb-[#C49A5A]/30">
            {/* Horizontal Line */}
            <div className="absolute top-[160px] left-[150px] right-[150px] h-[2px] bg-[#C49A5A]/35 z-0" />
            
            <div className="flex gap-8 min-w-[1600px] px-8 relative z-10">
              {steps.map((step, i) => {
                const StepIcon = step.icon;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center text-center max-w-[240px]">
                    
                    {/* Image Box */}
                    <div className="w-[200px] h-[120px] rounded-2xl overflow-hidden border border-[#C49A5A]/30 mb-6 shadow-sm">
                      <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Step Number Badge */}
                    <div className="w-12 h-12 rounded-full bg-[#F3E8D2] border-2 border-[#C49A5A] text-[#12372A] flex items-center justify-center font-bold text-sm shadow-md mb-4 hover:scale-110 transition-transform">
                      {step.num}
                    </div>

                    {/* Icon */}
                    <div className="text-[#8B5E3C] mb-3">
                      <StepIcon className="w-6 h-6 stroke-[1.5]" />
                    </div>

                    {/* Content */}
                    <h3 className="font-serif text-lg font-bold text-[#12372A] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {step.title}
                    </h3>
                    <p className="text-[#2F3E2F] text-xs leading-relaxed font-sans px-2">
                      {step.description}
                    </p>

                  </div>
                );
              })}
            </div>
          </div>

          {/* MOBILE TIMELINE: Vertical layout */}
          <div className="lg:hidden relative w-full px-4">
            {/* Vertical Connector Line */}
            <div className="absolute left-[30px] top-[10px] bottom-[10px] w-[2px] bg-[#C49A5A]/35 z-0" />
            
            <div className="space-y-12 relative z-10">
              {steps.map((step, i) => {
                const StepIcon = step.icon;
                return (
                  <div key={i} className="flex gap-6 items-start">
                    
                    {/* Circle Badge */}
                    <div className="w-12 h-12 rounded-full bg-[#F3E8D2] border-2 border-[#C49A5A] text-[#12372A] flex items-center justify-center font-bold text-sm shadow-md shrink-0">
                      {step.num}
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 bg-[#F3E8D2] border border-[#C49A5A]/35 p-6 rounded-3xl shadow-sm text-left">
                      <div className="flex items-center gap-3 text-[#8B5E3C] mb-3">
                        <StepIcon className="w-5 h-5 stroke-[1.5]" />
                        <h3 className="font-serif text-lg font-bold text-[#12372A]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {step.title}
                        </h3>
                      </div>
                      
                      {/* Image */}
                      <div className="w-full h-[150px] rounded-xl overflow-hidden mb-4 border border-[#C49A5A]/25">
                        <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                      </div>

                      <p className="text-[#2F3E2F] text-xs leading-relaxed font-sans">
                        {step.description}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 3. CTA SECTION */}
      <section className="relative py-28 bg-[#0B2F24] overflow-hidden text-center text-white">
        {/* Top curved wave */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] rotate-180">
            <path d="M0,35 C300,105 600,15 900,105 L1200,55 L1200,120 L0,120 Z" />
          </svg>
        </div>

        <div className="relative z-20 max-w-4xl mx-auto px-6 py-4 flex flex-col items-center">
          <span className="text-[#C49A5A] text-xs font-bold tracking-[0.2em] uppercase block mb-4">ESTATE UPDATES</span>
          <h2 
            className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            View Our Plantation Journey
          </h2>
          <p className="text-[#E6D3B3] text-sm md:text-base leading-relaxed max-w-xl mb-10 font-sans">
            Ready to explore plots and see historical project data? Visit our dedicated investor inquiry page to start.
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
