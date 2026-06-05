'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, TreePine, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F7F0E4]/95 backdrop-blur-md border-b border-[#C49A5A]/20 py-3 shadow-md'
          : 'bg-[#F7F0E4]/80 backdrop-blur-sm border-b border-[#C49A5A]/10 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5E3C] to-[#C49A5A] flex items-center justify-center border border-[#0B2F24]/15">
            <TreePine className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-serif text-lg md:text-xl font-bold text-[#0B2F24] tracking-wide block">
              CHANDAN
            </span>
            <span className="block text-[9px] text-[#C49A5A] tracking-[0.22em] uppercase font-bold -mt-1 font-sans">
              NILAYAM
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          <a href="#opportunity" className="text-[#0B2F24]/85 hover:text-[#C49A5A] text-xs font-bold uppercase tracking-wider transition-colors">The Opportunity</a>
          <a href="#plantation" className="text-[#0B2F24]/85 hover:text-[#C49A5A] text-xs font-bold uppercase tracking-wider transition-colors">Our Plantation</a>
          <a href="#benefits" className="text-[#0B2F24]/85 hover:text-[#C49A5A] text-xs font-bold uppercase tracking-wider transition-colors">Investor Benefits</a>
          <a href="#portal" className="text-[#0B2F24]/85 hover:text-[#C49A5A] text-xs font-bold uppercase tracking-wider transition-colors">Portal</a>
          <Link href="/login" className="text-[#0B2F24]/85 hover:text-[#C49A5A] text-xs font-bold uppercase tracking-wider transition-colors">Login</Link>
          <a href="#gallery" className="text-[#0B2F24]/85 hover:text-[#C49A5A] text-xs font-bold uppercase tracking-wider transition-colors">Gallery</a>
        </div>

        {/* Button */}
        <div className="hidden lg:flex items-center gap-4">
          <a href="#investor-inquiry">
            <Button className="bg-[#C49A5A] hover:bg-[#8B5E3C] text-white shadow-md px-6 py-2.5 font-bold text-xs tracking-wider uppercase transition-all duration-300 rounded-full flex items-center gap-1.5 border border-white/20">
              Investor Inquiry <Leaf className="w-3.5 h-3.5" />
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
        <div className="lg:hidden bg-[#F8F4EB]/98 backdrop-blur-xl border-t border-[#C8851E]/20 px-6 py-4 space-y-3">
          <a href="#opportunity" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-bold uppercase tracking-wider text-[#092E1C]/80 hover:text-[#C8851E]">The Opportunity</a>
          <a href="#plantation" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-bold uppercase tracking-wider text-[#092E1C]/80 hover:text-[#C8851E]">Our Plantation</a>
          <a href="#benefits" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-bold uppercase tracking-wider text-[#092E1C]/80 hover:text-[#C8851E]">Investor Benefits</a>
          <a href="#portal" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-bold uppercase tracking-wider text-[#092E1C]/80 hover:text-[#C8851E]">Portal</a>
          <Link href="/login" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-bold uppercase tracking-wider text-[#092E1C]/80 hover:text-[#C8851E]">Login</Link>
          <a href="#gallery" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-bold uppercase tracking-wider text-[#092E1C]/80 hover:text-[#C8851E]">Gallery</a>
          <a href="#investor-inquiry" onClick={() => setMobileOpen(false)} className="block pt-2">
            <Button className="w-full bg-[#C8851E] text-white py-3 rounded-xl font-bold uppercase text-xs tracking-wider">
              Investor Inquiry
            </Button>
          </a>
        </div>
      )}
    </nav>
  );
}
