'use client';

import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Youtube 
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

export default function Footer() {
  return (
    <footer className="bg-[#0B2F24] text-[#F7F0E4]/90 py-16 border-t border-[#C49A5A]/20">
      <div className="max-w-7xl mx-auto px-6 w-full">
        
        {/* Main 4-column footer layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Logo, Brand & Copyright */}
          <div className="flex flex-col items-start">
            <div className="mb-6 flex flex-col items-start gap-4">
              <BrandLogo height={96} />
              <div className="flex flex-col gap-2 items-start">
                <p className="text-[14px] sm:text-[16px] uppercase tracking-[0.32em] text-[#C49A5A] font-bold font-sans">
                  A Project by GK
                </p>
                
                <div className="mt-1 flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-gradient-to-r from-[#C49A5A] to-transparent"></div>
                  <div className="flex flex-col">
                    <span className="text-[7px] uppercase tracking-[0.25em] text-[#F7F0E4]/50 font-semibold mb-0.5">Initiated By</span>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-[#C49A5A] to-[#E5C99F] font-semibold drop-shadow-sm">
                      Mahalakshmi Reality Developers
                    </span>
                  </div>
                </div>

              </div>
            </div>
            <p className="text-xs leading-relaxed max-w-sm text-[#F7F0E4]/70 mb-4 text-left font-sans">
              Discover premium sandalwood estates where nature, long-term value, and generational wealth grow together. Thoughtfully cultivated with a vision for the future, every estate represents enduring value, timeless growth, and lasting prosperity designed to benefit generations to come.
            </p>
            <p className="text-[10px] text-[#F7F0E4]/50 font-sans mt-2">
              &copy; {new Date().getFullYear()} Chandan Nilayam Investments. All rights reserved.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-start text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#C49A5A] mb-6 font-sans">Quick Links</h4>
            <div className="flex flex-col gap-3 text-xs font-sans">
              <Link href="/home#opportunity" className="hover:text-[#C49A5A] transition-colors">The Opportunity</Link>
              <Link href="/home#about-heritage" className="hover:text-[#C49A5A] transition-colors">About Us</Link>
              <Link href="/home#plantation" className="hover:text-[#C49A5A] transition-colors">Our Plantation</Link>
              <Link href="/home#privileges" className="hover:text-[#C49A5A] transition-colors">Investor Privileges</Link>
              <Link href="/home#amenities" className="hover:text-[#C49A5A] transition-colors">Lifestyle Amenities</Link>
              <Link href="/home#calculator" className="hover:text-[#C49A5A] transition-colors">Plan Your Future</Link>
              <Link href="/home#gallery" className="hover:text-[#C49A5A] transition-colors">Gallery</Link>
              <Link href="/home#brochure" className="hover:text-[#C49A5A] transition-colors">Brochure</Link>
            </div>
          </div>

          {/* Column 3: Contact Us */}
          <div className="flex flex-col items-start text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#C49A5A] mb-6 font-sans">Contact Us</h4>
            <div className="flex flex-col gap-4 text-xs font-sans">
              <span className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#C49A5A] shrink-0 mt-0.5" /> 
                <div className="flex flex-col gap-1">
                  <a href="tel:+919063016733" className="hover:text-[#C49A5A] transition-colors">+91 906 301 6733</a>
                  <a href="tel:+916300016733" className="hover:text-[#C49A5A] transition-colors">+91 630 001 6733</a>
                </div>
              </span>
              <span className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C49A5A] shrink-0" /> 
                <a href="mailto:chandhannilayam@gmail.com" className="hover:text-[#C49A5A] transition-colors">chandhannilayam@gmail.com</a>
              </span>
              <span className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C49A5A] shrink-0 mt-0.5" /> 
                <a href="https://maps.google.com/?q=Dornala,+Andhra+Pradesh,+India" target="_blank" rel="noopener noreferrer" className="leading-relaxed hover:text-[#C49A5A] transition-colors">
                  Dornala, Prakasam District,<br />
                  Andhra Pradesh, India
                </a>
              </span>
            </div>
          </div>

          {/* Column 4: Follow Us */}
          <div className="flex flex-col items-start text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#C49A5A] mb-6 font-sans">Follow Us</h4>
            <div className="flex gap-3 mb-8">
              {[
                { icon: Instagram, href: 'https://instagram.com/chandannilayam' },
                { icon: Facebook, href: 'https://facebook.com/chandannilayam' },
                { icon: Linkedin, href: 'https://linkedin.com/company/chandannilayam' },
                { icon: Youtube, href: 'https://youtube.com/@chandannilayam' }
              ].map((social, i) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={i} 
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
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
