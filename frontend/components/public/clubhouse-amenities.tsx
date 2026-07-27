'use client';

import React, { useState, useRef, MouseEvent } from 'react';
import {
  Footprints,
  Dumbbell,
  Waves,
  Smile,
  Film,
  Utensils,
  TreePine,
  Map,
  Car,
  Gamepad2,
  Mountain,
  PartyPopper,
  Building2,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const clubhouseAmenities = [
  { 
    title: 'Walking Track', 
    desc: 'Beautifully landscaped trails designed for natural tranquility.', 
    icon: Footprints,
    image: 'https://images.unsplash.com/photo-1476514525535-ce74f45814ce?auto=format&fit=crop&w=800&q=80'
  },
  { 
    title: 'Modern Gym & Fitness Area', 
    desc: 'Fully equipped fitness center to prioritize your health and wellness.', 
    icon: Dumbbell,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
  },
  { 
    title: 'Swimming Pool', 
    desc: 'Elegant, temperature-controlled pool offering a relaxing oasis.', 
    icon: Waves,
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80'
  },
  { 
    title: "Children's Play Area", 
    desc: 'Safe, dedicated recreational zones with premium outdoor equipment.', 
    icon: Smile,
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80'
  },
  { 
    title: 'Open Air Theater', 
    desc: 'Exclusive outdoor venue for premium cinematic and entertainment experiences under the stars.', 
    icon: Film,
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80'
  },
  { 
    title: 'Organic Dining', 
    desc: 'On-site restaurant serving chef-curated meals at subsidized rates.', 
    icon: Utensils, 
    badge: 'EXCLUSIVE',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
  },
  { 
    title: 'Landscaped Gardens', 
    desc: 'Beautifully curated gardens creating a peaceful environment.', 
    icon: TreePine,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80'
  },
  { 
    title: 'Internal Roads', 
    desc: 'Wide, well-planned internal roads ensuring smooth movement.', 
    icon: Map,
    image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80'
  },
  { 
    title: 'Parking Area', 
    desc: 'Dedicated parking spaces for residents and visitors.', 
    icon: Car,
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80'
  },
  { 
    title: 'Indoor Games', 
    desc: 'Premium indoor recreational facility featuring billiards, table tennis, and more.', 
    icon: Gamepad2,
    image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?auto=format&fit=crop&w=800&q=80'
  },
  { 
    title: 'Scenic Hill Views', 
    desc: 'Beautiful surrounding hill landscapes offering peaceful views.', 
    icon: Mountain,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
  },
  { 
    title: 'Party Area', 
    desc: 'Elegant outdoor and indoor venues perfectly designed for grand celebrations.', 
    icon: PartyPopper,
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80'
  },
  { 
    title: 'Nearby City Access', 
    desc: 'Convenient access to nearby cities and urban conveniences.', 
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=800&q=80'
  }
];

// Interactive Glowing Spotlight Card with Backside Image & Subtle Ambient Lighting
const SpotlightCard = ({ item, index }: { item: any; index: number }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });

    // Calculate subtle 3D tilt angles based on mouse position relative to card center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6; // subtle 6 deg max tilt
    const rotateY = ((x - centerX) / centerX) * 6;

    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08 }}
      className="relative group perspective-1000"
    >
      {/* 🌿 Soft Ambient Backside Aura (Toned down soft ambient glow) 🌿 */}
      <div
        className={`absolute -inset-1.5 rounded-[28px] bg-gradient-to-r from-emerald-500/30 via-teal-400/25 to-emerald-400/30 blur-lg transition-all duration-500 pointer-events-none ${
          isHovered ? 'opacity-40 scale-102' : 'opacity-0 scale-95'
        }`}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${tilt.rotateX * 0.5}deg) rotateY(${tilt.rotateY * 0.5}deg)`
            : 'none'
        }}
      />

      {/* Subtle Outer Edge Glow */}
      <div
        className={`absolute -inset-0.5 rounded-[25px] bg-gradient-to-tr from-emerald-500/30 via-teal-400/20 to-emerald-600/30 opacity-0 group-hover:opacity-35 blur-sm transition-opacity duration-300 pointer-events-none`}
      />

      {/* Main Glass Card Container with Smooth 3D Tilt */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(8px)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
          transition: isHovered ? 'transform 0.15s ease-out' : 'transform 0.5s ease-out'
        }}
        className="relative rounded-[24px] p-6 md:p-7 flex items-start gap-5 overflow-hidden border border-emerald-500/25 hover:border-emerald-400/50 shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_45px_rgba(16,185,129,0.18)] backdrop-blur-md bg-gradient-to-br from-[#0B231A]/90 via-[#0E2E22]/95 to-[#061811]/90 cursor-pointer"
      >
        {/* Backside Image Layer with Soft Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700 ease-out transform group-hover:scale-108 opacity-20 group-hover:opacity-35 mix-blend-overlay"
          style={{ backgroundImage: `url(${item.image})` }}
        />

        {/* Refined Dark Gradient Overlay */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-br from-emerald-950/50 via-teal-950/70 to-black/85 group-hover:from-emerald-950/40 group-hover:via-teal-950/60 group-hover:to-black/75 transition-colors duration-500 pointer-events-none" />

        {/* Subtle Soft Cursor Spotlight Ray */}
        <div
          className="pointer-events-none absolute inset-0 z-[2] transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(240px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(52, 211, 153, 0.18), transparent 75%)`
          }}
        />

        {/* Soft Cursor Border Highlight */}
        <div
          className="pointer-events-none absolute inset-0 z-[3] rounded-[24px] transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(160px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.4), rgba(52, 211, 153, 0.3), transparent 100%)`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            padding: '1px'
          }}
        />

        {/* Left Icon Capsule with Soft Ring */}
        <div className="relative z-10 w-13 h-13 rounded-2xl border border-emerald-400/30 group-hover:border-emerald-300/60 flex items-center justify-center shrink-0 bg-emerald-950/80 group-hover:bg-emerald-900/80 shadow-[0_0_12px_rgba(16,185,129,0.2)] group-hover:shadow-[0_0_18px_rgba(52,211,153,0.35)] group-hover:scale-105 transition-all duration-300">
          <Icon className="w-6 h-6 text-emerald-300 group-hover:text-white stroke-[2] transition-colors duration-300" />
        </div>

        {/* Card Text Content */}
        <div className="relative z-10 flex flex-col flex-1">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-white font-bold text-[16px] md:text-[18px] tracking-wide group-hover:text-emerald-200 transition-colors duration-300 drop-shadow-md">
              {item.title}
            </h3>
            {item.badge && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full border border-amber-400/50 text-amber-200 bg-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.3)] uppercase shrink-0">
                <Sparkles className="w-3 h-3 text-amber-300" />
                {item.badge}
              </span>
            )}
          </div>
          <p className="text-emerald-100/80 group-hover:text-emerald-50 font-medium text-[13px] leading-relaxed transition-colors duration-300 drop-shadow-sm">
            {item.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default function ClubhouseAmenities() {
  return (
    <div className="w-full relative z-20 mt-10 mb-8 px-4 sm:px-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/40 bg-amber-500/10 backdrop-blur-md mb-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-[11px] font-extrabold tracking-[3px] uppercase font-sans">
              WORLD-CLASS AMENITIES
            </span>
          </div>
          <h2
            className="font-serif text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-emerald-100 to-amber-200 leading-tight drop-shadow-lg"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Clubhouse Amenities
          </h2>
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-6 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
        </div>

        {/* Amenities 3D Spotlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-8">
          {clubhouseAmenities.map((item, index) => (
            <SpotlightCard key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

