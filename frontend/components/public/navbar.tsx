'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, FileText, ChevronRight } from 'lucide-react';
import BrandIdentity from '@/components/BrandIdentity';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navLinks = [
    { href: '#opportunity', label: 'THE OPPORTUNITY' },
    { href: '#about-heritage', label: 'ABOUT US' },
    { href: '#plantation', label: 'OUR PLANTATION' },
    { href: '#privileges-amenities', label: 'INVESTOR BENEFITS' },
    { href: '#calculator', label: 'PLAN YOUR FUTURE' },
    { href: '/Chandhan_Nilayam_Brochure.pdf', label: 'BROCHURE', icon: <FileText className="w-[15px] h-[15px] mr-1.5" />, target: '_blank' },
    { href: '#gallery', label: 'GALLERY' },
  ];

  return (
    <nav
      suppressHydrationWarning={true}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
        scrolled
          ? 'shadow-[0_8px_30px_rgba(18,55,42,0.08)] border-b border-[#12372A]/10'
          : 'shadow-[0_4px_20px_rgba(18,55,42,0.05)] border-b border-[#12372A]/10'
      }`}
    >
      <div className="w-full max-w-[1560px] mx-auto px-[20px] md:px-[42px]">
        
        {/* Desktop Layout (104px) / Mobile Layout (72px) */}
        <div className="hidden 2xl:grid items-center h-[104px]" style={{ gridTemplateColumns: '250px minmax(0, 1fr) auto', columnGap: '32px' }}>
          
          {/* COLUMN 1: Brand */}
          <Link href="/home" className="flex items-center justify-start shrink-0 overflow-visible w-[250px] min-w-[250px] h-[82px]">
            <img src="/branding/chandhan-navbar-logo.png" alt="Chandhan Nilayam Logo" className="w-full h-full object-contain object-left block m-0 p-0 transform-none" />
          </Link>

          {/* COLUMN 2: Navigation Links */}
          <div className="flex items-center justify-center gap-[25px] w-full px-4 overflow-hidden">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.target || undefined}
                rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                className="group relative flex items-center text-[#203029] font-sans font-semibold text-[12px] tracking-[0.035em] whitespace-nowrap py-2 transition-colors duration-250 hover:text-[#A97835]"
              >
                {link.icon}
                {link.label}
                <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-[#A97835] transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full" />
              </a>
            ))}
          </div>

          {/* COLUMN 3: CTAs */}
          <div className="flex items-center gap-[14px]">
            <Link 
              href="/login" 
              className="flex items-center justify-center bg-transparent border border-[#C49A5A] text-[#12372A] font-sans font-bold text-[12px] tracking-[0.06em] h-[46px] px-[24px] rounded-full transition-all duration-300 hover:bg-[#12372A] hover:text-[#FFFFFF] hover:border-[#12372A] hover:-translate-y-[2px]"
            >
              LOGIN
            </Link>
            <a href="#investor-inquiry">
              <button 
                suppressHydrationWarning 
                className="flex items-center justify-center bg-gradient-to-br from-[#C49A5A] to-[#D9B36D] text-white font-sans font-bold text-[12px] tracking-[0.03em] h-[48px] px-[26px] rounded-full whitespace-nowrap transition-all duration-300 shadow-[0_8px_22px_rgba(196,154,90,0.28)] hover:-translate-y-[2px] hover:shadow-[0_12px_28px_rgba(196,154,90,0.4)]"
                style={{ minWidth: '162px' }}
              >
                INVESTOR INQUIRY
              </button>
            </a>
          </div>
        </div>

        <div className="2xl:hidden flex justify-between items-center h-[72px] md:h-[82px]">
          <Link href="/home" className="flex items-center justify-start shrink-0 overflow-visible w-[160px] md:w-[180px] h-[55px]" onClick={() => setMobileOpen(false)}>
            <img src="/branding/chandhan-navbar-logo.png" alt="Chandhan Nilayam Logo" className="w-full h-full object-contain object-left block m-0 p-0 transform-none" />
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-[#12372A] p-2 hover:bg-[#12372A]/5 rounded-full transition-colors ml-4 shrink-0"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

      </div>

      {/* Mobile Slide-Down Menu Overlay */}
      <div 
        className={`2xl:hidden fixed inset-0 top-[72px] md:top-[82px] bg-[#0A120E]/40 backdrop-blur-sm transition-opacity duration-300 z-40 ${mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div 
        className={`2xl:hidden fixed top-[72px] md:top-[82px] left-0 right-0 bg-white border-t border-[#12372A]/10 shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-50 overflow-hidden ${mobileOpen ? 'max-h-[calc(100vh-72px)] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="flex flex-col px-[28px] py-[36px] gap-[24px] max-h-[calc(100vh-72px)] overflow-y-auto pb-32">
          {/* Links */}
          <div className="flex flex-col gap-[4px]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.target || undefined}
                rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                onClick={() => {
                  if (link.target !== '_blank') setMobileOpen(false);
                }}
                className="group flex items-center justify-between text-[#12372A] font-sans font-bold text-[14px] tracking-[0.05em] py-[16px] px-[20px] -mx-[20px] rounded-[18px] hover:bg-[#C49A5A]/10 active:bg-[#C49A5A]/20 transition-all duration-300"
              >
                <div className="flex items-center">
                  {link.icon}
                  {link.label}
                </div>
                <ChevronRight className="w-5 h-5 text-[#C49A5A] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-active:opacity-100 group-active:translate-x-0 transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-[14px] mt-[12px] pt-[28px] border-t border-[#12372A]/10">
            <Link 
              href="/login" 
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center w-full bg-white/60 backdrop-blur-md border border-[#C49A5A] text-[#12372A] font-sans font-bold text-[13px] tracking-[0.06em] h-[54px] rounded-full shadow-sm hover:bg-[#C49A5A] hover:text-white transition-colors duration-300"
            >
              LOGIN
            </Link>
            <a 
              href="#investor-inquiry" 
              onClick={() => setMobileOpen(false)}
              className="w-full"
            >
              <button className="flex items-center justify-center w-full bg-gradient-to-r from-[#12372A] to-[#1A4F3C] text-white font-sans font-bold text-[13px] tracking-[0.06em] h-[54px] rounded-full shadow-[0_12px_24px_rgba(18,55,42,0.25)] hover:shadow-[0_16px_32px_rgba(18,55,42,0.35)] hover:-translate-y-1 transition-all duration-300">
                INVESTOR INQUIRY
              </button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
