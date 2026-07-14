const fs = require('fs');
const path = './app/(public)/home/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const startPrivileges = '{/* 6. Exclusive Investor Privileges (NEW SECTION 1) */}';
const endAmenities = '{/* 7. Progression of Our Sandalwood Plantation (FINAL UPLOADED GALLERY IMPLEMENTATION) */}';

const startIndex = content.indexOf(startPrivileges);
const endIndex = content.indexOf(endAmenities);

if (startIndex === -1 || endIndex === -1) {
  console.log('Could not find sections to remove');
  process.exit(1);
}

// Remove the old sections entirely
const beforeDeletion = content.substring(0, startIndex);
const afterDeletion = content.substring(endIndex);
content = beforeDeletion + afterDeletion;

// The combined section HTML string
const newSection = `      {/* 5.6 Exclusive Investor Privileges & Amenities (COMBINED) */}
      <section id="privileges-amenities" className="py-16 md:py-24 bg-[#F7F0E4] relative overflow-hidden z-20 border-t border-[#8B5E3C]/10">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C49A5A]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#12372A]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-1.5 mb-4">
              <span className="text-[#8B5E3C] text-[10px] font-bold tracking-[2.5px] uppercase font-sans">
                INVESTOR PRIVILEGES
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#12372A] leading-tight mb-4 font-display" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Exclusive Benefits & Amenities
            </h2>
            <p className="text-[#3B2416] text-sm md:text-base max-w-2xl mx-auto font-sans">
              Every investment includes premium benefits designed to maximize comfort, legal security, and long-term value, along with exclusive access to our world-class clubhouse.
            </p>
          </div>

          {/* Core Privileges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto mb-20">
            {[
              {
                title: "Dedicated Plot Allocation",
                desc: "Every investor receives a clearly demarcated premium plot with complete ownership allocation and transparent records.",
                icon: Map
              },
              {
                title: "100% Genuine Legal Documentation",
                desc: "All plots include verified legal documentation, title verification, registration support, and government-compliant paperwork.",
                icon: ShieldCheck
              },
              {
                title: "12-Year Club House Membership",
                desc: "Investors receive complimentary clubhouse membership valid for 12 years, including one annual visit with a complimentary three-day stay.",
                icon: Building2,
                badge: "FREE"
              },
              {
                title: "Yearly VIP Srisailam Darshan Pass",
                desc: "Every investor receives one complimentary VIP Srisailam Darshan pass each year. Applicable for 3–4 family members.",
                icon: Landmark,
                badge: "Annual Benefit",
                goldBadge: true
              }
            ].map((privilege, i) => (
              <div 
                key={i} 
                className="group relative bg-white border border-[#8B5E3C]/15 rounded-2xl p-8 hover:-translate-y-2 transition-all duration-500 shadow-sm hover:shadow-[0_15px_40px_rgba(196,154,90,0.15)] overflow-hidden"
              >
                {/* Border Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#C49A5A]/0 via-transparent to-[#C49A5A]/0 group-hover:from-[#C49A5A]/10 group-hover:to-transparent transition-colors duration-500 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-start gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-[#12372A] rounded-xl flex items-center justify-center border border-[#C49A5A]/30 group-hover:border-[#C49A5A] transition-colors duration-300">
                    <privilege.icon className="w-7 h-7 text-[#C49A5A] group-hover:rotate-6 transition-transform duration-300 stroke-[1.5]" />
                  </div>
                  
                  <div className="flex flex-col flex-1 text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-[#12372A] font-sans leading-tight">
                        {privilege.title}
                      </h3>
                      {privilege.badge && (
                        <span className={\`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap \${privilege.goldBadge ? 'bg-[#C49A5A] text-white' : 'bg-[#12372A]/10 text-[#12372A]'}\`}>
                          {privilege.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[#3B2416]/80 text-xs leading-relaxed font-sans">
                      {privilege.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Lifestyle Amenities (Redesigned for light theme) */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            
            {/* Left Image Side */}
            <div className="w-full lg:w-[45%] flex items-center justify-center">
              <div className="relative w-full max-w-[600px] mx-auto lg:mx-0 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-[#C49A5A]/20 group">
                <img 
                  src="/clubhouse-collage.jpg"
                  alt="Luxury Club House"
                  className="w-full h-auto block transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Protective Gradient for Text */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#12372A]/90 via-[#12372A]/50 to-transparent pointer-events-none" />
                
                {/* Subtle Text Overlay at Bottom */}
                <div className="absolute bottom-6 left-6 right-6 text-left pointer-events-none">
                  <h3 className="text-[#F7F0E4] font-serif text-2xl font-bold mb-1.5 drop-shadow-lg">Premium Lifestyle Amenities</h3>
                  <p className="text-[#E6D3B3] text-[11px] font-sans leading-relaxed drop-shadow-md max-w-[90%]">
                    Designed to deliver a complete lifestyle experience beyond land ownership.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Amenities Grid */}
            <div className="w-full lg:w-[55%] grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { title: "Supplementary Maintenance Agreement", desc: "A transparent and legally binding contract that guarantees scientific plantation care and professional, long-term upkeep of your crops.", icon: FileSignature },
                { title: "Secure Plot Resale Assistance", desc: "Full resale support and marketing assistance to help you seamlessly liquidate your premium sandalwood asset when it matures.", icon: Handshake },
                { title: "Luxury Club House", desc: "Enjoy exclusive, investor-only access to our premium clubhouse, featuring luxury suites and relaxation spaces for your weekend getaways.", icon: Building },
                { title: "Walking Track", desc: "Beautifully landscaped walking and jogging trails designed to let you immerse yourself in the natural tranquility of the estate.", icon: Footprints },
                { title: "Modern Gym", desc: "A fully equipped fitness center with modern machinery, allowing you to prioritize health and wellness during your site visits.", icon: Dumbbell },
                { title: "Swimming Pool", desc: "An elegant, temperature-controlled swimming pool offering a relaxing oasis for you and your family within the clubhouse premises.", icon: Waves },
                { title: "Children's Play Area", desc: "A safe, dedicated recreational play zone with outdoor equipment for children to enjoy while you explore your land holdings.", icon: Smile },
                { title: "Golf Court", desc: "A premium, beautifully maintained putting green allowing you to practice your golf swing and enjoy leisure sports on the estate.", icon: FlagTriangleRight },
                { title: "Affordable Food & Beverages", desc: "An on-site restaurant serving organic, chef-curated meals made from locally sourced ingredients at highly subsidized rates for investors.", icon: Utensils, badge: "Investor Exclusive" }
              ].map((amenity, i) => (
                <div 
                  key={i} 
                  className="group bg-white hover:bg-[#12372A] border border-[#8B5E3C]/15 hover:border-[#12372A] rounded-2xl p-5 flex items-start gap-4 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-full bg-[#F7F0E4] border border-[#C49A5A]/30 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C49A5A]/20 transition-colors duration-300">
                    <amenity.icon className="w-5 h-5 text-[#12372A] group-hover:text-[#F7F0E4] transition-colors duration-300 stroke-[1.5]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-[#12372A] group-hover:text-[#F7F0E4] font-sans transition-colors duration-300">{amenity.title}</h4>
                      {amenity.badge && (
                        <span className="text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-[#C49A5A]/10 text-[#C49A5A] group-hover:text-[#F7F0E4] whitespace-nowrap border border-[#C49A5A]/30 transition-colors duration-300">
                          {amenity.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[#3B2416]/70 group-hover:text-[#F7F0E4]/80 text-[10px] leading-relaxed font-sans transition-colors duration-300">{amenity.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </section>

`;

const insertionPoint = '{/* 5. Our Plantation Journey Section (REDESIGNED TO EXACT REFERENCE STYLE) */}';
const targetIndex = content.indexOf(insertionPoint);

if (targetIndex === -1) {
  console.log('Could not find insertion point');
  process.exit(1);
}

content = content.substring(0, targetIndex) + newSection + content.substring(targetIndex);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated file.');
