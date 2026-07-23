'use client';

import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Check, ShieldCheck, TrendingUp, Building2, Coins, Landmark, LineChart, Briefcase, Leaf, Award, ArrowRight, Timer } from 'lucide-react';

const AnimatedNumber = ({ value, prefix = '', suffix = '' }: { value: number, prefix?: string, suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const duration = 800; // ms
    const incrementTime = 20;
    const steps = duration / incrementTime;
    const increment = (end - start) / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  const formatted = Math.round(displayValue).toLocaleString('en-IN');
  return <span>{prefix}{formatted}{suffix}</span>;
};

const traditionalAssets = [
  { name: 'Large Cap Stocks', icon: Briefcase, growth: '15%', risk: 'High', management: 'Self', multiplier: 4.5, color: '#6A7F6E' },
  { name: 'Nifty 50', icon: TrendingUp, growth: '13%', risk: 'High', management: 'Self', multiplier: 4.0, color: '#7E9181' },
  { name: 'Mutual Funds', icon: LineChart, growth: '12%', risk: 'Medium', management: 'Fund Mgr', multiplier: 3.4, color: '#88998C' },
  { name: 'Real Estate', icon: Building2, growth: '9%', risk: 'Medium', management: 'Self', multiplier: 3.2, color: '#B5C4B9' },
  { name: 'Gold', icon: Coins, growth: '8%', risk: 'Low', management: 'Self', multiplier: 2.8, color: '#B0A89A' },
  { name: 'Fixed Deposit', icon: Landmark, growth: '6%', risk: 'Very Low', management: 'Bank', multiplier: 2.1, color: '#97A89B' },
  { name: 'LIC', icon: ShieldCheck, growth: '5%', risk: 'Very Low', management: 'LIC', multiplier: 1.9, color: '#A5B5A9' },
];

export default function WhyRedSandalwood() {
  const [investmentAmount, setInvestmentAmount] = useState(1000000);

  return (
    <section className="py-24 bg-[#F8F6F1] relative overflow-hidden font-sans text-[#2B2B2B]" id="why-sandalwood">
      
      {/* Background ambient glows */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.03),_transparent_50%)] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-[60px] relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-20 flex flex-col items-center">
          <h2 className="text-[#12372A] font-bold text-4xl md:text-5xl lg:text-[56px] leading-[1.1] mb-6 tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Why Red Sandalwood Creates Greater Wealth <br className="hidden md:block"/> Than Traditional Investments
          </h2>
          <div className="w-16 h-[2px] bg-[#D4AF37] mb-6"></div>
          <p className="text-[#5A6D60] text-[16px] md:text-[18px] max-w-4xl leading-[1.8] font-light" style={{ fontFamily: "'Lora', serif" }}>
            See how professionally managed Red Sandalwood plantations outperform traditional investment options over a 12-year investment horizon.
          </p>
        </div>

        {/* SECTION 1: TWO PANELS (WINNER VS OTHERS) */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-28">
          
          {/* LEFT PANEL: RED SANDALWOOD (45%) */}
          <div className="lg:w-[45%]">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[30px] p-2 shadow-[0_20px_50px_rgba(18,55,42,0.1)] border border-[#D4AF37]/40 relative h-full flex flex-col group overflow-hidden"
            >
              {/* Image Header */}
              <div className="relative w-full h-[280px] rounded-[24px] overflow-hidden">
                <img src="/premium-sandalwood-hero.png" alt="Red Sandalwood Plantation" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12372A]/90 via-[#12372A]/40 to-transparent" />
                <div className="absolute top-5 left-5">
                  <span className="bg-[#D4AF37] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <Award className="w-4 h-4" /> HIGHEST WEALTH CREATION
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white font-bold text-3xl mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Red Sandalwood Plantation</h3>
                  <p className="text-[#D4AF37] text-sm font-medium tracking-wide">Professionally Managed Green Investment</p>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                {/* 4 Large Stats */}
                <div className="grid grid-cols-2 gap-6 mb-10 pb-8 border-b border-[#EAE6D8]">
                  <div className="flex flex-col">
                    <span className="text-[#88998C] text-[11px] uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5"><Timer className="w-3.5 h-3.5" /> Investment Period</span>
                    <span className="text-[#12372A] text-xl font-bold">12 Years</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#88998C] text-[11px] uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Estimated Value</span>
                    <span className="text-[#2E7D32] text-xl font-bold">₹50 Lakhs+</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#88998C] text-[11px] uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5"><LineChart className="w-3.5 h-3.5" /> Annual Growth</span>
                    <span className="text-[#12372A] text-xl font-bold">15-20% CAGR</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#88998C] text-[11px] uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Fully Managed</span>
                    <span className="text-[#12372A] text-xl font-bold">Yes</span>
                  </div>
                </div>

                {/* Checklist */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  {[
                    'Scientific Plantation', 'Drip Irrigation', 'Government Compliant', 
                    'Transparent Ownership', 'Low Maintenance', 'Eco Friendly', 
                    'Premium Clubhouse Access', 'Resort Lifestyle', 'International Golf Course', 
                    '24×7 Security', 'Connecting Roads'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-[#D4AF37] stroke-[3]" />
                      </div>
                      <span className="text-[#2B2B2B] text-[13px] font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-4">
                  <a href="#investor-inquiry" className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#C49A5A] text-white font-bold uppercase tracking-wider text-sm py-5 rounded-2xl transition-colors shadow-lg shadow-[#D4AF37]/30">
                    View Investment Opportunity <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT PANEL: CLEAN COMPARISON ROWS (55%) */}
          <div className="lg:w-[55%] flex flex-col justify-center">
            <h3 className="text-[#12372A] text-xl font-bold mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Traditional Alternative Returns (₹10L over 12 Yrs)
            </h3>
            
            <div className="flex flex-col gap-3">
              {traditionalAssets.map((asset, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-[20px] p-4 lg:p-5 shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)] border border-[#EAE6D8] transition-all duration-300 flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#F8F6F1] border border-[#EAE6D8]">
                    <asset.icon className="w-5 h-5 text-[#88998C]" />
                  </div>
                  
                  <div className="flex-grow grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 items-center">
                    <div className="flex flex-col col-span-2 lg:col-span-1">
                      <span className="text-[#12372A] font-bold text-[14px] leading-tight">{asset.name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#88998C] uppercase tracking-widest font-bold">Return</span>
                      <span className="text-[#2B2B2B] font-bold text-[13px]">{asset.growth}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#88998C] uppercase tracking-widest font-bold">Risk</span>
                      <span className="text-[#2B2B2B] font-bold text-[13px]">{asset.risk}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#88998C] uppercase tracking-widest font-bold">Mgmt</span>
                      <span className="text-[#2B2B2B] font-bold text-[13px]">{asset.management}</span>
                    </div>
                    <div className="flex flex-col col-span-2 lg:col-span-1 lg:items-end">
                      <span className="text-[10px] text-[#88998C] uppercase tracking-widest font-bold">Final</span>
                      <span className="text-[#12372A] font-bold text-[15px]">₹{asset.multiplier * 10}L</span>
                    </div>
                  </div>

                  {/* Performance Bar */}
                  <div className="hidden lg:flex w-24 shrink-0 flex-col gap-1 items-end opacity-50 group-hover:opacity-100 transition-opacity">
                    <div className="w-full flex justify-end gap-0.5">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className={`h-2.5 w-1.5 rounded-sm ${i < (asset.multiplier * 2) ? 'bg-[#88998C]' : 'bg-[#F8F6F1]'}`} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2: FULL WIDTH COMPARISON BAR */}
        <div className="mb-28 bg-white rounded-[30px] p-10 lg:p-14 border border-[#EAE6D8] shadow-[0_20px_60px_rgba(18,55,42,0.04)]">
          <div className="text-center mb-12">
            <h3 className="text-[#12372A] font-bold text-2xl md:text-3xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Visual Wealth Comparison Over 12 Years
            </h3>
            <p className="text-[#88998C] text-sm mt-2 font-medium">Initial Investment: ₹10,00,000</p>
          </div>

          <div className="flex flex-col gap-6 max-w-5xl mx-auto">
            {/* Winner */}
            <div className="flex flex-col gap-2 relative z-10">
              <div className="flex justify-between items-end">
                <span className="text-[#12372A] font-bold text-lg">Red Sandalwood</span>
                <span className="text-[#2E7D32] font-bold text-xl drop-shadow-sm">₹50,00,000+</span>
              </div>
              <div className="w-full bg-[#F8F6F1] h-6 rounded-full overflow-hidden p-1 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F1C40F] rounded-full relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-white/30 to-transparent" />
                </motion.div>
              </div>
            </div>

            {/* Others */}
            {traditionalAssets.map((asset, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="text-[#5A6D60] font-semibold text-sm">{asset.name}</span>
                  <span className="text-[#2B2B2B] font-bold text-sm">₹{asset.multiplier * 10},00,000</span>
                </div>
                <div className="w-full bg-[#F8F6F1] h-3 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(asset.multiplier / 5) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 + (i * 0.1) }}
                    className="h-full bg-[#B8C7BC] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: INTERACTIVE CALCULATOR CARD */}
        <div className="mb-28 max-w-5xl mx-auto">
          <div className="bg-[#12372A] rounded-[40px] p-10 lg:p-14 shadow-[0_30px_70px_rgba(18,55,42,0.4)] relative overflow-hidden text-center">
            {/* Glows */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none" />
            
            <h3 className="text-[#D4AF37] font-bold text-3xl md:text-4xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              If You Invest Today...
            </h3>
            
            <div className="flex items-center justify-center gap-4 mb-12">
              {[500000, 1000000, 2500000, 5000000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setInvestmentAmount(amt)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                    investmentAmount === amt 
                      ? 'bg-[#D4AF37] text-white shadow-[0_0_20px_rgba(212,175,55,0.4)]' 
                      : 'bg-white/10 text-[#E0E6E2] hover:bg-white/20'
                  }`}
                >
                  ₹{amt >= 10000000 ? amt/10000000 + 'Cr' : amt/100000 + 'L'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
              {/* Winner */}
              <div className="col-span-2 md:col-span-4 bg-gradient-to-br from-[#D4AF37] to-[#C49A5A] rounded-[24px] p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                <div className="flex flex-col text-left">
                  <span className="text-white/80 text-[11px] uppercase tracking-widest font-bold">Red Sandalwood Final Value</span>
                  <span className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">
                    <AnimatedNumber value={investmentAmount * 5} prefix="₹" suffix="+" />
                  </span>
                </div>
                <div className="bg-white/20 px-6 py-3 rounded-full border border-white/30 backdrop-blur-sm">
                  <span className="text-white font-bold text-sm tracking-widest uppercase">The Clear Winner</span>
                </div>
              </div>

              {/* Losers */}
              {[
                { name: 'Large Cap', mult: 4.5 },
                { name: 'Nifty 50', mult: 4.0 },
                { name: 'Mutual Fund', mult: 3.4 },
                { name: 'Gold', mult: 2.8 },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-[20px] p-5 flex flex-col items-center">
                  <span className="text-[10px] text-[#A5B5A9] uppercase tracking-wider font-bold mb-1">{item.name}</span>
                  <span className="text-xl font-bold text-white">
                    <AnimatedNumber value={investmentAmount * item.mult} prefix="₹" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}
