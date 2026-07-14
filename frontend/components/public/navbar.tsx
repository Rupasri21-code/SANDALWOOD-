'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, FileText } from 'lucide-react';
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
    { href: '#privileges', label: 'INVESTOR BENEFITS' },
    { href: '#calculator', label: 'PLAN YOUR FUTURE' },
    { href: '/Chandan_Nilayam_Brochure.pdf', label: 'BROCHURE', icon: <FileText className="w-[15px] h-[15px] mr-1.5" />, target: '_blank' },
    { href: '#gallery', label: 'GALLERY' },
  ];

  return (
    <nav
      suppressHydrationWarning={true}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'shadow-[0_8px_30px_rgba(18,55,42,0.08)] border-b border-[#12372A]/10'
          : 'shadow-[0_4px_20px_rgba(18,55,42,0.05)] border-b border-[#12372A]/10'
      }`}
      style={{
        background: 'linear-gradient(90deg, #F8F3E9 0%, #F4ECDD 100%)'
      }}
    >
      <div className="w-full max-w-[1560px] mx-auto px-[20px] md:px-[42px]">
        
        {/* Desktop Layout (104px) / Mobile Layout (72px) */}
        <div className="hidden lg:grid items-center h-[104px]" style={{ gridTemplateColumns: '250px minmax(0, 1fr) auto', columnGap: '32px' }}>
          
          {/* COLUMN 1: Brand */}
          <Link href="/home" className="flex items-center justify-start shrink-0 overflow-visible w-[250px] min-w-[250px] h-[82px]">
            <img src="/branding/chandhan-navbar-logo.png" alt="Chandan Nilayam Logo" className="w-full h-full object-contain object-left block m-0 p-0 transform-none" />
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

        <div className="lg:hidden flex justify-between items-center h-[72px] md:h-[82px]">
          <Link href="/home" className="flex items-center justify-start shrink-0 overflow-visible w-[160px] md:w-[180px] h-[55px]" onClick={() => setMobileOpen(false)}>
            <img src="/branding/chandhan-navbar-logo.png" alt="Chandan Nilayam Logo" className="w-full h-full object-contain object-left block m-0 p-0 transform-none" />
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

      {/* Mobile Slide-Down Menu */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#F5F0E6] border-t border-[#12372A]/10 shadow-2xl h-[calc(100vh-72px)] overflow-y-auto">
          <div className="flex flex-col px-[24px] py-[32px] gap-[16px]">
            {/* Links */}
            <div className="flex flex-col gap-[8px] mb-[24px]">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.target || undefined}
                  rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                  onClick={() => {
                    if (link.target !== '_blank') setMobileOpen(false);
                  }}
                  className="flex items-center text-[#1E2B25] font-sans font-semibold text-[14px] tracking-[0.04em] py-[12px] border-b border-[#12372A]/5 hover:text-[#A97835]"
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTAs */}
            <Link 
              href="/login" 
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center w-full bg-transparent border border-[#C49A5A] text-[#12372A] font-sans font-bold text-[13px] tracking-[0.06em] h-[48px] rounded-full"
            >
              LOGIN
            </Link>
            <a 
              href="#investor-inquiry" 
              onClick={() => setMobileOpen(false)}
              className="w-full"
            >
              <button className="flex items-center justify-center w-full bg-gradient-to-br from-[#C49A5A] to-[#D9B36D] text-white font-sans font-bold text-[13px] tracking-[0.03em] h-[48px] rounded-full shadow-[0_8px_22px_rgba(196,154,90,0.28)]">
                INVESTOR INQUIRY
              </button>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
