'use client';

import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  Instagram, 
  Facebook, 
  Linkedin, 
  Youtube 
} from 'lucide-react';

export default function Footer() {
  const offices = [
    {
      city: 'HYDERABAD',
      phone: '9063016733',
      phoneFormatted: '+91 90630 16733',
      email: 'info@chandhannilayam.com',
      website: 'www.chandhannilayam.com',
      address: '8-277/45, 2nd Floor, Rd No: 3, UBI Colony, Banjara Hills, Hyderabad, Telangana 500034',
      mapUrl: 'https://maps.google.com/?q=8-277/45,+2nd+Floor,+Rd+No:+3,+UBI+Colony,+Banjara+Hills,+Hyderabad,+Telangana+500034'
    },
    {
      city: 'GUNTUR',
      phone: '6300016733',
      phoneFormatted: '+91 63000 16733',
      email: 'info@chandhannilayam.com',
      website: 'www.chandhannilayam.com',
      address: 'Sri Saravana Bhava Nilayam, Lakshmipuram Main Rd, Guntur, Andhra Pradesh 522002',
      mapUrl: 'https://maps.google.com/?q=Sri+Saravana+Bhava+Nilayam,+Lakshmipuram+Main+Rd,+Guntur,+Andhra+Pradesh+522002'
    }
  ];

  return (
    <footer className="text-[#F7F0E4]/90 border-t border-[#D9B36D]/30 bg-gradient-to-br from-[#12402B] to-[#0A2418] px-6 sm:px-12 lg:px-16 py-16">
      <div className="max-w-[1560px] mx-auto w-full">
        
        {/* Main responsive grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 items-start mb-16 gap-y-12 lg:gap-x-10">
          
          {/* Column 1: Logo, Brand & Description (Takes 4 columns on large screens) */}
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-6">
            {/* FULL-COLOR LOGO IN CREAM BRAND PANEL */}
            <div className="mb-6 flex items-center justify-center lg:justify-start w-full lg:w-auto">
              <div 
                className="inline-block"
                style={{
                  background: '#F7F0E4',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  border: '1px solid rgba(217, 179, 109, 0.30)'
                }}
              >
                <img 
                  src="/branding/footer-logo-final.png" 
                  alt="Chandhan Nilayam Logo" 
                  className="w-full max-w-[220px] md:max-w-[240px] md:w-[220px] lg:max-w-none lg:w-[260px] h-auto object-contain object-left" 
                />
              </div>
            </div>

            <p className="font-serif text-[16px] leading-[1.8] text-[#F7F0E4]/80 max-w-[400px] mb-8">
              Building generational wealth through professionally managed, high-yield premium red sandalwood plantations.
            </p>

            {/* Social Media Links */}
            <div className="flex gap-3">
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
                    className="w-10 h-10 rounded-full border border-[#D9B36D]/30 flex items-center justify-center text-[#D9B36D] hover:border-[#D9B36D] hover:bg-[#D9B36D] hover:text-[#0B2F24] transition-all duration-300 shadow-[0_0_15px_rgba(217,179,109,0.1)] hover:shadow-[0_0_20px_rgba(217,179,109,0.3)] hover:-translate-y-1"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links (Takes 2 columns) */}
          <div className="lg:col-span-2 flex flex-col items-start text-left pt-2">
            <h4 className="text-[14px] font-bold uppercase tracking-[0.15em] text-[#D9B36D] mb-6 font-sans border-b border-[#D9B36D]/30 pb-3 w-full">Explore</h4>
            <div className="flex flex-col gap-3.5 text-[15px] font-sans">
              <Link href="/home#opportunity" className="text-[#F7F0E4]/70 hover:text-[#D9B36D] hover:translate-x-1 transition-all duration-300">The Opportunity</Link>
              <Link href="/home#about-heritage" className="text-[#F7F0E4]/70 hover:text-[#D9B36D] hover:translate-x-1 transition-all duration-300">About Us</Link>
              <Link href="/home#plantation" className="text-[#F7F0E4]/70 hover:text-[#D9B36D] hover:translate-x-1 transition-all duration-300">Our Plantation</Link>
              <Link href="/home#privileges-amenities" className="text-[#F7F0E4]/70 hover:text-[#D9B36D] hover:translate-x-1 transition-all duration-300">Investor Privileges</Link>
              <Link href="/home#calculator" className="text-[#F7F0E4]/70 hover:text-[#D9B36D] hover:translate-x-1 transition-all duration-300">Plan Your Future</Link>
              <Link href="/login" className="text-[#F7F0E4]/70 hover:text-[#D9B36D] hover:translate-x-1 transition-all duration-300">Investor Portal</Link>
            </div>
          </div>

          {/* Column 3 & 4: Office Addresses (Takes 6 columns on lg screens) */}
          <div className="lg:col-span-6 flex flex-col items-start text-left pt-2">
            <h4 className="text-[14px] font-bold uppercase tracking-[0.15em] text-[#D9B36D] mb-6 font-sans border-b border-[#D9B36D]/30 pb-3 w-full">Our Offices</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {offices.map((office, index) => (
                <div 
                  key={index}
                  className="flex flex-col p-5 rounded-2xl bg-[#F7F0E4]/[0.04] border border-[#D9B36D]/20 hover:border-[#D9B36D]/50 transition-all duration-300 shadow-lg hover:shadow-[#D9B36D]/5"
                >
                  {/* City Header with Icon */}
                  <div className="flex items-center gap-2.5 mb-4 text-[#F7F0E4]">
                    <div className="w-8 h-8 rounded-full bg-[#D9B36D]/15 border border-[#D9B36D]/40 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-[#D9B36D]" />
                    </div>
                    <h5 className="font-bold tracking-wider text-[16px] text-[#F7F0E4] font-serif uppercase">{office.city}</h5>
                  </div>

                  {/* Contact Info List */}
                  <div className="flex flex-col gap-2.5 text-[14px] font-sans text-[#F7F0E4]/80 mb-5">
                    <a 
                      href={`tel:+91${office.phone}`} 
                      className="flex items-center gap-3 hover:text-[#D9B36D] transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#D9B36D]/10 flex items-center justify-center shrink-0 group-hover:bg-[#D9B36D]/20 transition-colors">
                        <Phone className="w-3.5 h-3.5 text-[#D9B36D]" />
                      </div>
                      <span className="font-mono text-[13px]">{office.phone}</span>
                    </a>

                    <a 
                      href={`mailto:${office.email}`} 
                      className="flex items-center gap-3 hover:text-[#D9B36D] transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#D9B36D]/10 flex items-center justify-center shrink-0 group-hover:bg-[#D9B36D]/20 transition-colors">
                        <Mail className="w-3.5 h-3.5 text-[#D9B36D]" />
                      </div>
                      <span className="truncate">{office.email}</span>
                    </a>

                    <a 
                      href={`https://${office.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-3 hover:text-[#D9B36D] transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#D9B36D]/10 flex items-center justify-center shrink-0 group-hover:bg-[#D9B36D]/20 transition-colors">
                        <Globe className="w-3.5 h-3.5 text-[#D9B36D]" />
                      </div>
                      <span>{office.website}</span>
                    </a>
                  </div>

                  {/* Office Address Pill Badge */}
                  <div className="mt-auto">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#0A2F1D] border border-[#D9B36D]/40 text-[#D9B36D] text-[12px] font-semibold tracking-wide mb-3">
                      Office Address :
                    </div>
                    <a 
                      href={office.mapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block text-[13.5px] leading-relaxed text-[#F7F0E4]/75 hover:text-[#F7F0E4] transition-colors font-serif"
                    >
                      {office.address}
                    </a>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Bottom Legal Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-[22px]" style={{ borderTop: '1px solid rgba(217,179,109,0.25)' }}>
          <p className="text-[12px] text-[#F7F0E4]/60 font-sans">
            &copy; {new Date().getFullYear()} Chandhan Nilayam. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[12px] font-sans text-[#F7F0E4]/60 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-[#D9B36D] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#D9B36D] transition-colors">Terms & Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

