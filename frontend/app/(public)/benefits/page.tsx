'use client';

import Link from 'next/link';
import { Leaf, Shield, TrendingUp, FileText, Activity, User, ShieldAlert, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const benefits = [
  {
    title: 'Tangible Land Asset',
    desc: 'You own the underlying physical land, backed by registered title deeds. The land itself appreciates alongside the trees.',
    icon: Shield,
  },
  {
    title: 'Compounding Long-Term Value',
    desc: 'Sandalwood prices rise steadily due to global demand-supply imbalances, offering a solid multiplier on maturity.',
    icon: TrendingUp,
  },
  {
    title: 'Transparent Documentation',
    desc: 'Every purchase includes a clear registration, property survey sketch, tax records, and joint cultivation agreement.',
    icon: FileText,
  },
  {
    title: 'Regular Crop Updates',
    desc: 'Our agronomists upload growth progress, health metrics, and multimedia files to keep you updated.',
    icon: Activity,
  },
  {
    title: 'Managed Cultivation',
    desc: 'You avoid the hassle of farming. Our professional agronomy team manages planting, weeding, watering, and security.',
    icon: Leaf,
  },
  {
    title: '24/7 Investor Portal Access',
    desc: 'Review document copies, check receipts, and inspect plantation logs anytime from your desktop or phone.',
    icon: User,
  },
  {
    title: 'Secure Documents',
    desc: 'All land registries, certificates, and crop reports are encrypted and backed up securely in your portal.',
    icon: ShieldAlert,
  },
];

export default function BenefitsPage() {
  return (
    <div className="bg-[#F7F0E4] min-h-screen text-[#1E1E1A] font-sans overflow-x-hidden relative">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex items-center justify-center overflow-hidden w-full h-[60vh] min-h-[450px]">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1920"
            alt="Benefits Background"
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
              Wealth Benefits
            </span>
          </div>

          <h1 
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight"
            style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              textShadow: '0 4px 15px rgba(0, 0, 0, 0.4)' 
            }}
          >
            Benefits That Grow with You
          </h1>
          <p className="text-[#E6D3B3] text-base md:text-lg max-w-2xl leading-relaxed font-serif" style={{ fontFamily: "'Lora', serif" }}>
            Discover the unique combination of legal security, managed agricultural excellence, and exceptional long-term appreciation.
          </p>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-20">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px]">
            <path d="M0,35 C300,105 600,15 900,105 L1200,55 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* 2. CORE BENEFITS GRID */}
      <section className="py-24 bg-[#F7F0E4] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3">WHY SANDALWOOD?</span>
            <h2 
              className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#12372A] leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Why Nurturing Trees Beats Traditional Portfolios
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. COMPARISON SECTION */}
      <section className="py-24 bg-[#0B2F24] relative text-white">
        {/* Top curved wave */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] rotate-180">
            <path d="M0,35 C300,105 600,15 900,105 L1200,55 L1200,120 L0,120 Z" />
          </svg>
        </div>

        <div className="relative z-20 max-w-6xl mx-auto px-6 py-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#C49A5A] text-xs font-bold tracking-[0.2em] uppercase block mb-3">ASSET COMPARISON</span>
            <h2 
              className="font-serif text-3xl md:text-4xl font-bold text-[#F7F0E4] leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Comparing Sandalwood with Traditional Assets
            </h2>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-[#C49A5A]/35 bg-[#12372A] shadow-xl">
            <table className="w-full text-left text-sm border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#0B2F24] border-b border-[#C49A5A]/30">
                  <th className="p-6 text-xs font-bold uppercase tracking-wider text-[#C49A5A]">Asset Class</th>
                  <th className="p-6 text-xs font-bold uppercase tracking-wider text-[#C49A5A] text-center">Avg. Returns (15-yr)</th>
                  <th className="p-6 text-xs font-bold uppercase tracking-wider text-[#C49A5A] text-center">Market Risk</th>
                  <th className="p-6 text-xs font-bold uppercase tracking-wider text-[#C49A5A] text-center">Tangible security</th>
                  <th className="p-6 text-xs font-bold uppercase tracking-wider text-[#C49A5A] text-center">Tax Exemption</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C49A5A]/10 text-white/90">
                <tr className="bg-[#8B5E3C]/10">
                  <td className="p-6 font-bold flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-[#C49A5A]" />
                    Sandalwood Land Investment
                  </td>
                  <td className="p-6 text-center text-[#C49A5A] font-bold">12% – 18% CAGR</td>
                  <td className="p-6 text-center">Zero (Biological Growth)</td>
                  <td className="p-6 text-center text-green-400">Yes (Land Registered)</td>
                  <td className="p-6 text-center text-green-400">Yes (Agricultural)</td>
                </tr>
                <tr>
                  <td className="p-6 font-semibold">Equities & Mutual Funds</td>
                  <td className="p-6 text-center">10% – 13% CAGR</td>
                  <td className="p-6 text-center">High (Market Volatile)</td>
                  <td className="p-6 text-center text-red-400">No (Digital Units)</td>
                  <td className="p-6 text-center text-red-400">No (Subject to LTCG)</td>
                </tr>
                <tr>
                  <td className="p-6 font-semibold">Standard Real Estate</td>
                  <td className="p-6 text-center">6% – 9% CAGR</td>
                  <td className="p-6 text-center">Low-Medium</td>
                  <td className="p-6 text-center text-green-400">Yes (Deeds Registered)</td>
                  <td className="p-6 text-center text-red-400">No (Capital Gains Tax)</td>
                </tr>
                <tr>
                  <td className="p-6 font-semibold">Fixed Deposits (FD)</td>
                  <td className="p-6 text-center">5% – 7% p.a.</td>
                  <td className="p-6 text-center">Very Low</td>
                  <td className="p-6 text-center text-red-400">No (Bank Account)</td>
                  <td className="p-6 text-center text-red-400">No (Fully Taxable)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom curved wave */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px]">
            <path d="M0,35 C300,105 600,15 900,105 L1200,55 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* 4. CTA SECTION */}
      <section className="relative py-28 bg-[#0B2F24] overflow-hidden text-center text-white">
        <div className="relative z-20 max-w-4xl mx-auto px-6 py-4 flex flex-col items-center">
          <span className="text-[#C49A5A] text-xs font-bold tracking-[0.2em] uppercase block mb-4">INQUIRY REQUEST</span>
          <h2 
            className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Request Your Personalized Investment Matrix
          </h2>
          <p className="text-[#E6D3B3] text-sm md:text-base leading-relaxed max-w-xl mb-10 font-sans">
            Submit your contact details and let our investment advisors structure a custom sandalwood plot plan based on your financial goals.
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
