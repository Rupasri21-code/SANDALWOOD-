'use client';

import Link from 'next/link';
import { 
  TreePine, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Youtube 
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0B2F24] text-[#F7F0E4]/90 py-16 border-t border-[#C49A5A]/20">
      <div className="max-w-7xl mx-auto px-6 w-full">
        
        {/* Main 4-column footer layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Logo, Brand & Copyright */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5E3C] to-[#C49A5A] flex items-center justify-center border border-white/10 shadow-md">
                <TreePine className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <span className="font-serif text-lg font-bold tracking-wide text-white block">CHANDAN</span>
                <span className="block text-[9px] text-[#C49A5A] tracking-[0.22em] uppercase font-bold -mt-1 font-sans">
                  NILAYAM
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed max-w-xs text-[#F7F0E4]/70 mb-4 text-left font-sans">
              Premium Sandalwood Investments. Building sustainable natural-backed wealth and legacy assets for generations.
            </p>
            <p className="text-[10px] text-[#F7F0E4]/50 font-sans mt-2">
              &copy; {new Date().getFullYear()} Chandan Nilayam. All rights reserved.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-start text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#C49A5A] mb-6 font-sans">Quick Links</h4>
            <div className="flex flex-col gap-3 text-xs font-sans">
              <a href="#opportunity" className="hover:text-[#C49A5A] transition-colors">The Opportunity</a>
              <a href="#plantation" className="hover:text-[#C49A5A] transition-colors">Our Plantation</a>
              <a href="#benefits" className="hover:text-[#C49A5A] transition-colors">Investor Benefits</a>
              <a href="#portal" className="hover:text-[#C49A5A] transition-colors">Investor Portal</a>
              <a href="#gallery" className="hover:text-[#C49A5A] transition-colors">Gallery</a>
              <a href="#inquiry" className="hover:text-[#C49A5A] transition-colors">Contact Us</a>
            </div>
          </div>

          {/* Column 3: Contact Us */}
          <div className="flex flex-col items-start text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#C49A5A] mb-6 font-sans">Contact Us</h4>
            <div className="flex flex-col gap-4 text-xs font-sans">
              <span className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C49A5A] shrink-0" /> 
                <a href="tel:+917337331000" className="hover:text-[#C49A5A] transition-colors">+91 733 733 1000</a>
              </span>
              <span className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C49A5A] shrink-0" /> 
                <a href="mailto:invest@dornalasandalwood.com" className="hover:text-[#C49A5A] transition-colors">invest@dornalasandalwood.com</a>
              </span>
              <span className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C49A5A] shrink-0 mt-0.5" /> 
                <span className="leading-relaxed">
                  Dornala, Guntur District,<br />
                  Andhra Pradesh, India
                </span>
              </span>
            </div>
          </div>

          {/* Column 4: Follow Us */}
          <div className="flex flex-col items-start text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#C49A5A] mb-6 font-sans">Follow Us</h4>
            <div className="flex gap-3 mb-8">
              {[
                { icon: Instagram, href: '#' },
                { icon: Facebook, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Youtube, href: '#' }
              ].map((social, i) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={i} 
                    href={social.href}
                    className="w-8 h-8 rounded-full border border-[#C49A5A]/35 flex items-center justify-center text-[#C49A5A] hover:border-[#C49A5A] hover:bg-[#C49A5A] hover:text-[#0B2F24] transition-all duration-300 shadow-sm"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
            
            {/* Bottom Links */}
            <div className="flex gap-4 text-[10px] tracking-wider uppercase font-bold text-[#F7F0E4]/60 font-sans">
              <Link href="/privacy" className="hover:text-[#C49A5A] transition-colors">Privacy Policy</Link>
              <span className="text-[#C49A5A]/30">|</span>
              <Link href="/terms" className="hover:text-[#C49A5A] transition-colors">Terms & Conditions</Link>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
