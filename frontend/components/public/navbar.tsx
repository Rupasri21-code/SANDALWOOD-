'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Leaf, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrandLogo from '@/components/BrandLogo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      suppressHydrationWarning={true}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F7F0E4]/95 backdrop-blur-md border-b border-[#C49A5A]/20 py-3 shadow-md'
          : 'bg-[#F7F0E4]/80 backdrop-blur-sm border-b border-[#C49A5A]/10 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <div className="lg:hidden"><BrandLogo height={40} logoClassName="object-contain drop-shadow-sm" /></div>
            <div className="hidden lg:block"><BrandLogo height={75} logoClassName="object-contain drop-shadow-sm" /></div>
            <span className="hidden lg:block text-[9px] uppercase tracking-[0.25em] font-extrabold text-[#0B2F24] mt-1.5 whitespace-nowrap">A PROJECT BY GK</span>
          </div>
        </Link>

        {/* Desktop Links — use same-page anchors for site sections so they don't open separate pages */}
        <div className="hidden lg:flex items-center gap-5">
          <a href="#opportunity" className="text-[#0B2F24]/85 hover:text-[#C49A5A] text-xs font-bold uppercase tracking-wider transition-colors">The Opportunity</a>
          <a href="#about-heritage" className="text-[#0B2F24]/85 hover:text-[#C49A5A] text-xs font-bold uppercase tracking-wider transition-colors">About Us</a>
          <a href="#plantation" className="text-[#0B2F24]/85 hover:text-[#C49A5A] text-xs font-bold uppercase tracking-wider transition-colors">Our Plantation</a>
          <a href="#privileges" className="text-[#0B2F24]/85 hover:text-[#C49A5A] text-xs font-bold uppercase tracking-wider transition-colors">Investor Benefits</a>
          <a href="#calculator" className="text-[#0B2F24]/85 hover:text-[#C49A5A] text-xs font-bold uppercase tracking-wider transition-colors">Plan Your Future</a>
          <a href="#brochure" className="text-[#0B2F24]/85 hover:text-[#C49A5A] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Brochure</a>
          <a href="#gallery" className="text-[#0B2F24]/85 hover:text-[#C49A5A] text-xs font-bold uppercase tracking-wider transition-colors">Gallery</a>
          <Link href="/login" className="bg-[#C49A5A] hover:bg-[#B38541] text-[#12372A] shadow-md hover:shadow-lg rounded-full px-5 py-2 font-bold text-xs tracking-wider uppercase transition-all duration-300 transform hover:translate-y-[-2px] hover:scale-105 flex items-center justify-center border border-white/10">
            Login
          </Link>
        </div>

        {/* Button */}
        <div className="hidden lg:flex items-center gap-4">
          <a href="#investor-inquiry">
            <Button suppressHydrationWarning className="bg-[#C49A5A] hover:bg-[#8B5E3C] text-white shadow-md px-5 py-2 font-bold text-xs tracking-wider uppercase transition-all duration-300 rounded-full flex items-center gap-1.5 border border-white/20">
              Investor Inquiry
            </Button>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-[#092E1C] p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#F8F4EB]/98 backdrop-blur-xl border-t border-[#C8851E]/20 px-6 py-4 space-y-2">
          <a href="#opportunity" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-bold uppercase tracking-wider text-[#092E1C]/80 hover:text-[#C8851E]">The Opportunity</a>
          <a href="#about-heritage" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-bold uppercase tracking-wider text-[#092E1C]/80 hover:text-[#C8851E]">About Us</a>
          <a href="#plantation" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-bold uppercase tracking-wider text-[#092E1C]/80 hover:text-[#C8851E]">Our Plantation</a>
          <a href="#privileges" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-bold uppercase tracking-wider text-[#092E1C]/80 hover:text-[#C8851E]">Investor Benefits</a>
          <a href="#calculator" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-bold uppercase tracking-wider text-[#092E1C]/80 hover:text-[#C8851E]">Plan Your Future</a>
          <a href="#brochure" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-bold uppercase tracking-wider text-[#092E1C]/80 hover:text-[#C8851E] flex items-center gap-1.5"><FileText className="w-4 h-4" /> Brochure</a>
          <a href="#gallery" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-bold uppercase tracking-wider text-[#092E1C]/80 hover:text-[#C8851E]">Gallery</a>
          <Link href="/login" onClick={() => setMobileOpen(false)} className="block w-full text-center bg-[#C49A5A] hover:bg-[#B38541] text-[#12372A] shadow-md hover:shadow-lg rounded-full py-2.5 font-bold uppercase text-xs tracking-wider transition-all duration-300 transform hover:translate-y-[-2px] hover:scale-105 border border-white/10">
            Login
          </Link>
          <a href="#investor-inquiry" onClick={() => setMobileOpen(false)} className="block pt-2">
            <Button suppressHydrationWarning className="w-full bg-[#C8851E] text-white py-3 rounded-xl font-bold uppercase text-xs tracking-wider">
              Investor Inquiry
            </Button>
          </a>
        </div>
      )}
    </nav>
  );
}
