const fs = require('fs');
const path = './app/(public)/home/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const sectionStart = '{/* 5.6 Exclusive Investor Privileges & Amenities (COMBINED) */}';
const nextSection = '{/* 5. Our Plantation Journey Section (REDESIGNED TO EXACT REFERENCE STYLE) */}';

const startIndex = content.indexOf(sectionStart);
const endIndex = content.indexOf(nextSection);

if (startIndex === -1 || endIndex === -1) {
  console.log('Could not find boundaries');
  process.exit(1);
}

const beforeDeletion = content.substring(0, startIndex);
const afterDeletion = content.substring(endIndex);

const redesignedSection = `      {/* 5.6 Exclusive Investor Privileges & Amenities (COMBINED - PREMIUM REDESIGN) */}
      <section id="privileges-amenities" className="py-20 md:py-32 bg-[#0A120E] relative overflow-hidden z-20">
        {/* Subtle Background Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(196,154,90,0.05),_transparent_80%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C49A5A]/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#12372A]/20 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-1.5 mb-4">
              <span className="text-[#C49A5A] text-[10px] font-bold tracking-[3px] uppercase font-sans">
                THE ULTIMATE LIFESTYLE
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#F7F0E4] leading-tight mb-6 font-display" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Exclusive Privileges & Amenities
            </h2>
            <div className="w-20 h-[1.5px] bg-[#C49A5A] mx-auto mb-6"></div>
            <p className="text-[#B8C7BC] text-sm md:text-base max-w-2xl mx-auto font-sans leading-relaxed">
              Beyond land ownership, we offer a complete ecosystem of luxury, security, and tranquility. Experience premium benefits designed exclusively for our esteemed investors.
            </p>
          </div>

          {/* Core Privileges (4 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-24">
            {[
              {
                title: "Dedicated Plot Allocation",
                desc: "Receive a clearly demarcated premium plot with transparent records and complete ownership.",
                icon: Map
              },
              {
                title: "Genuine Legal Security",
                desc: "Verified legal documentation, title verification, and absolute government-compliant paperwork.",
                icon: ShieldCheck
              },
              {
                title: "12-Year Club House Access",
                desc: "Complimentary luxury clubhouse membership valid for 12 years, including an annual 3-day stay.",
                icon: Building2,
                badge: "FREE"
              },
              {
                title: "VIP Srisailam Darshan",
                desc: "Complimentary yearly VIP Srisailam Darshan passes applicable for 3–4 family members.",
                icon: Landmark,
                badge: "Annual Benefit"
              }
            ].map((privilege, i) => (
              <div 
                key={i} 
                className="group relative bg-[#0B241C]/40 backdrop-blur-md border border-[#C49A5A]/20 hover:border-[#C49A5A]/60 rounded-3xl p-8 lg:p-10 transition-all duration-500 overflow-hidden"
              >
                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#C49A5A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#0A120E] border border-[#C49A5A]/30 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C49A5A]/10 transition-colors duration-500 shadow-[0_0_20px_rgba(196,154,90,0.1)]">
                    <privilege.icon className="w-8 h-8 text-[#C49A5A] group-hover:scale-110 transition-transform duration-500 stroke-[1.5]" />
                  </div>
                  
                  <div className="flex flex-col flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-xl font-serif text-[#F7F0E4] leading-tight tracking-wide">
                        {privilege.title}
                      </h3>
                      {privilege.badge && (
                        <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm bg-[#C49A5A]/20 text-[#C49A5A] border border-[#C49A5A]/30">
                          {privilege.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[#A3B8B0] text-sm leading-relaxed font-sans">
                      {privilege.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Panoramic Clubhouse Banner */}
          <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden mb-16 shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-[#C49A5A]/20 group">
            <img 
              src="/clubhouse-collage.jpg"
              alt="Luxury Club House"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A120E] via-[#0A120E]/60 to-transparent" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
            
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
              <div className="max-w-3xl">
                <h3 className="text-[#C49A5A] text-sm font-bold tracking-[3px] uppercase font-sans mb-3">World Class Facilities</h3>
                <h4 className="text-[#F7F0E4] font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-xl">Premium Clubhouse</h4>
                <p className="text-[#E6D3B3] text-sm md:text-base font-sans leading-relaxed drop-shadow-md">
                  A sanctuary of relaxation and leisure, designed exclusively for our investors. Experience state-of-the-art facilities nestled within the tranquility of nature.
                </p>
              </div>
            </div>
          </div>

          {/* Lifestyle Amenities Grid (9 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Supplementary Maintenance", desc: "Scientific plantation care and professional long-term crop upkeep.", icon: FileSignature },
              { title: "Plot Resale Assistance", desc: "Full marketing support to seamlessly liquidate your mature asset.", icon: Handshake },
              { title: "Luxury Suites", desc: "Exclusive access to premium relaxation spaces for weekend getaways.", icon: Building },
              { title: "Walking Track", desc: "Beautifully landscaped trails designed for natural tranquility.", icon: Footprints },
              { title: "Modern Gym", desc: "Fully equipped fitness center to prioritize your health and wellness.", icon: Dumbbell },
              { title: "Swimming Pool", desc: "Elegant, temperature-controlled pool offering a relaxing oasis.", icon: Waves },
              { title: "Children's Play Area", desc: "Safe, dedicated recreational zones with premium outdoor equipment.", icon: Smile },
              { title: "Putting Green", desc: "Beautifully maintained golf court to practice your swing.", icon: FlagTriangleRight },
              { title: "Organic Dining", desc: "On-site restaurant serving chef-curated meals at subsidized rates.", icon: Utensils, badge: "Exclusive" }
            ].map((amenity, i) => (
              <div 
                key={i} 
                className="group bg-white/[0.02] hover:bg-[#C49A5A]/5 border border-white/5 hover:border-[#C49A5A]/30 rounded-2xl p-6 flex items-start gap-4 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-[#0A120E] border border-[#C49A5A]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C49A5A] transition-colors duration-500">
                  <amenity.icon className="w-5 h-5 text-[#C49A5A] group-hover:text-[#0A120E] transition-colors duration-500 stroke-[1.5]" />
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm md:text-base font-bold text-[#F7F0E4] font-sans tracking-wide">{amenity.title}</h4>
                    {amenity.badge && (
                      <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-[#C49A5A]/20 text-[#C49A5A] border border-[#C49A5A]/30">
                        {amenity.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[#A3B8B0] text-xs leading-relaxed font-sans">{amenity.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </section>

`;

const newContent = beforeDeletion + redesignedSection + afterDeletion;
fs.writeFileSync(path, newContent, 'utf8');
console.log('Successfully redesigned section.');
