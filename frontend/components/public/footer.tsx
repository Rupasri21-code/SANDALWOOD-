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

export default function Footer() {
  return (
    <footer className="text-[#F7F0E4]/90 border-t border-[#C49A5A]/20" style={{ background: 'linear-gradient(135deg, #061A13 0%, #0B2F24 100%)', padding: '70px 64px 34px' }}>
      <div className="max-w-[1560px] mx-auto w-full">
        
        {/* Main responsive grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 items-start mb-20 gap-y-16 lg:gap-x-12">
          
          {/* Column 1: Logo, Brand & Description (Takes 4 columns on large screens) */}
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-10">
            {/* FULL-COLOR LOGO IN CREAM BRAND PANEL */}
            <div 
              className="mb-6 flex items-center justify-center lg:justify-start w-full lg:w-auto"
            >
              <div 
                className="inline-block"
                style={{
                  background: '#F7F0E4',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  border: '1px solid rgba(196, 154, 90, 0.20)'
                }}
              >
                <img 
                  src="/branding/footer-logo-final.png" 
                  alt="Chandhan Nilayam Logo" 
                  className="w-full max-w-[220px] md:max-w-[240px] md:w-[220px] lg:max-w-none lg:w-[260px] h-auto object-contain object-left" 
                />
              </div>
            </div>

            <p className="font-serif text-[18px] leading-[1.8] text-[#F7F0E4]/80 max-w-[400px]">
              Building generational wealth through professionally managed, high-yield premium red sandalwood plantations.
            </p>
          </div>

          {/* Column 2: Quick Links (Takes 2 columns) */}
          <div className="lg:col-span-2 flex flex-col items-start text-left pt-2">
            <h4 className="text-[14px] font-bold uppercase tracking-[0.15em] text-[#C49A5A] mb-8 font-sans border-b border-[#C49A5A]/20 pb-4 w-full">Explore</h4>
            <div className="flex flex-col gap-4 text-[15px] font-sans">
              <Link href="/home#opportunity" className="text-[#F7F0E4]/70 hover:text-[#C49A5A] hover:translate-x-1 transition-all duration-300">The Opportunity</Link>
              <Link href="/home#about-heritage" className="text-[#F7F0E4]/70 hover:text-[#C49A5A] hover:translate-x-1 transition-all duration-300">About Us</Link>
              <Link href="/home#plantation" className="text-[#F7F0E4]/70 hover:text-[#C49A5A] hover:translate-x-1 transition-all duration-300">Our Plantation</Link>
              <Link href="/home#privileges-amenities" className="text-[#F7F0E4]/70 hover:text-[#C49A5A] hover:translate-x-1 transition-all duration-300">Investor Privileges</Link>
              <Link href="/home#privileges-amenities" className="text-[#F7F0E4]/70 hover:text-[#C49A5A] hover:translate-x-1 transition-all duration-300">Lifestyle Amenities</Link>
            </div>
          </div>

          {/* Column 3: Resources (Takes 2 columns) */}
          <div className="lg:col-span-2 flex flex-col items-start text-left pt-2">
            <h4 className="text-[14px] font-bold uppercase tracking-[0.15em] text-[#C49A5A] mb-8 font-sans border-b border-[#C49A5A]/20 pb-4 w-full">Resources</h4>
            <div className="flex flex-col gap-4 text-[15px] font-sans">
              <Link href="/home#calculator" className="text-[#F7F0E4]/70 hover:text-[#C49A5A] hover:translate-x-1 transition-all duration-300">Plan Your Future</Link>
              <Link href="/home#gallery" className="text-[#F7F0E4]/70 hover:text-[#C49A5A] hover:translate-x-1 transition-all duration-300">Gallery</Link>
              <Link href="/home#brochure" className="text-[#F7F0E4]/70 hover:text-[#C49A5A] hover:translate-x-1 transition-all duration-300">Brochure</Link>
              <Link href="/login" className="text-[#F7F0E4]/70 hover:text-[#C49A5A] hover:translate-x-1 transition-all duration-300">Investor Portal</Link>
            </div>
          </div>

          {/* Column 4: Contact & Social (Takes 4 columns) */}
          <div className="lg:col-span-4 flex flex-col items-start text-left pt-2">
            <h4 className="text-[14px] font-bold uppercase tracking-[0.15em] text-[#C49A5A] mb-8 font-sans border-b border-[#C49A5A]/20 pb-4 w-full">Contact Us</h4>
            
            <div className="flex flex-col gap-6 text-[15px] font-sans w-full">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F7F0E4]/5 border border-[#F7F0E4]/10 hover:border-[#C49A5A]/30 transition-colors">
                <MapPin className="w-5 h-5 text-[#C49A5A] shrink-0 mt-0.5" /> 
                <a href="https://maps.google.com/?q=Dornala,+Andhra+Pradesh,+India" target="_blank" rel="noopener noreferrer" className="leading-[1.6] text-[#F7F0E4]/80 hover:text-[#F7F0E4] transition-colors">
                  Dornala, Prakasam District,<br />
                  Andhra Pradesh, India
                </a>
              </div>
              
              <div className="flex flex-col gap-3">
                <span className="flex items-center gap-4 text-[#F7F0E4]/80 group">
                  <Phone className="w-5 h-5 text-[#C49A5A] shrink-0 group-hover:scale-110 transition-transform" /> 
                  <div className="flex items-center gap-3">
                    <a href="tel:+919063016733" className="hover:text-[#C49A5A] transition-colors">+91 906 301 6733</a>
                    <span className="text-[#F7F0E4]/30">|</span>
                    <a href="tel:+916300016733" className="hover:text-[#C49A5A] transition-colors">+91 630 001 6733</a>
                  </div>
                </span>
                <span className="flex items-center gap-4 text-[#F7F0E4]/80 group mt-2">
                  <Mail className="w-5 h-5 text-[#C49A5A] shrink-0 group-hover:scale-110 transition-transform" /> 
                  <a href="mailto:chandhannilayam@gmail.com" className="hover:text-[#C49A5A] transition-colors">chandhannilayam@gmail.com</a>
                </span>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
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
                    className="w-12 h-12 rounded-full border border-[#C49A5A]/30 flex items-center justify-center text-[#C49A5A] hover:border-[#C49A5A] hover:bg-[#C49A5A] hover:text-[#0B2F24] transition-all duration-300 shadow-[0_0_15px_rgba(196,154,90,0.1)] hover:shadow-[0_0_20px_rgba(196,154,90,0.3)] hover:-translate-y-1"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-[22px]" style={{ borderTop: '1px solid rgba(196,154,90,0.18)' }}>
          <p className="text-[12px] text-[#F7F0E4]/60 font-sans">
            &copy; {new Date().getFullYear()} Chandhan Nilayam. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[12px] font-sans text-[#F7F0E4]/60 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-[#C49A5A] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#C49A5A] transition-colors">Terms & Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
