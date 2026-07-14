const fs = require('fs');
const path = './app/(public)/home/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const s1 = content.indexOf('{/* 5.75 More Than An Investment Banner */}');
const e1 = content.indexOf('</section>', s1) + 10;

if (s1 === -1 || e1 === -1) {
  console.log('Could not find banner');
  process.exit(1);
}

// Remove the old banner
content = content.substring(0, s1) + content.substring(e1);

// The new redesigned banner
const newBanner = `      {/* --- 5.75 More Than An Investment Banner (REDESIGNED PARALLAX) --- */}
      <section className="relative py-24 md:py-32 overflow-hidden flex items-center justify-center z-20">
        {/* Parallax Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed transform scale-105"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2913&auto=format&fit=crop")' }}
        />
        
        {/* Dark Forest Green Gradient Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A120E]/90 via-[#12372A]/70 to-[#0A120E]/90" />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 w-full text-center">
          
          {/* Glassmorphic Container */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] p-10 md:p-16 lg:p-20">
            {/* Subtle glow inside the glass box */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#C49A5A]/20 blur-[80px] pointer-events-none" />
            
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <span className="text-[#C49A5A] text-xs font-bold tracking-[4px] uppercase font-sans">
                  A Legacy of Prestige
                </span>
              </div>
              
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#F7F0E4] leading-tight font-display drop-shadow-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                More Than an Investment
              </h2>
              
              <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#C49A5A] to-transparent my-2" />
              
              <h3 className="text-[#E7DBC7] text-lg md:text-xl font-serif leading-relaxed max-w-3xl drop-shadow-md" style={{ fontFamily: "'Lora', serif" }}>
                Own premium red sandalwood land while enjoying exclusive investor privileges, luxury amenities, legal security, and long-term value creation.
              </h3>
              
              <p className="text-[#A3B8B0] text-sm md:text-base font-sans leading-relaxed max-w-4xl mt-2 drop-shadow-sm">
                Beyond securing a high-yielding natural asset, your investment with Chandan Nilayam grants you entry into an elite community. Experience the perfect harmony of robust financial growth and elevated lifestyle benefits—from 100% genuine legal documentation to luxury clubhouse access and spiritual retreats. We manage the land while you enjoy the prestige and peace of mind.
              </p>

              <button 
                onClick={() => {
                  const el = document.getElementById('privileges-amenities');
                  if(el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-8 px-8 py-4 bg-transparent border border-[#C49A5A] text-[#C49A5A] hover:bg-[#C49A5A] hover:text-[#0A120E] rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_0_20px_rgba(196,154,90,0.15)] hover:shadow-[0_0_30px_rgba(196,154,90,0.4)]"
              >
                Discover The Lifestyle
              </button>
            </div>
          </div>
          
        </div>
      </section>
`;

const insertIndex = content.indexOf('{/* 8. Testimonials Section */}');

if (insertIndex === -1) {
  console.log('Could not find insertion point');
  process.exit(1);
}

content = content.substring(0, insertIndex) + newBanner + '\n' + content.substring(insertIndex);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully redesigned and moved banner.');
