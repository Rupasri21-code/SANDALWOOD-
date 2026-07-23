'use client';

import React, { useState, useRef, MouseEvent } from 'react';
import {
  Footprints,
  Dumbbell,
  Waves,
  Smile,
  Film,
  Utensils,
  Landmark,
  TreePine,
  Map,
  Car,
  Gamepad2,
  Mountain,
  PartyPopper,
  Building2
} from 'lucide-react';
import { motion } from 'framer-motion';

const clubhouseAmenities = [
  { title: 'Walking Track', desc: 'Beautifully landscaped trails designed for natural tranquility.', icon: Footprints },
  { title: 'Modern Gym & Fitness Area', desc: 'Fully equipped fitness center to prioritize your health and wellness.', icon: Dumbbell },
  { title: 'Swimming Pool', desc: 'Elegant, temperature-controlled pool offering a relaxing oasis.', icon: Waves },
  { title: 'Children\'s Play Area', desc: 'Safe, dedicated recreational zones with premium outdoor equipment.', icon: Smile },
  { title: 'Open Air Theater', desc: 'Exclusive outdoor venue for premium cinematic and entertainment experiences under the stars.', icon: Film },
  { title: 'Organic Dining', desc: 'On-site restaurant serving chef-curated meals at subsidized rates.', icon: Utensils, badge: 'EXCLUSIVE' },
  { title: 'Landscaped Gardens', desc: 'Beautifully curated gardens creating a peaceful environment.', icon: TreePine },
  { title: 'Internal Roads', desc: 'Wide, well-planned internal roads ensuring smooth movement.', icon: Map },
  { title: 'Parking Area', desc: 'Dedicated parking spaces for residents and visitors.', icon: Car },
  { title: 'Indoor Games', desc: 'Premium indoor recreational facility featuring billiards, table tennis, and more.', icon: Gamepad2 },
  { title: 'Scenic Hill Views', desc: 'Beautiful surrounding hill landscapes offering peaceful views.', icon: Mountain },
  { title: 'Party Area', desc: 'Elegant outdoor and indoor venues perfectly designed for grand celebrations.', icon: PartyPopper },
  { title: 'Nearby City Access', desc: 'Convenient access to nearby cities and urban conveniences.', icon: Building2 }
];

// Spotlight Card Component
const SpotlightCard = ({ item, index }: { item: any, index: number }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const Icon = item.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-[24px] p-6 md:p-8 flex items-start gap-5 overflow-hidden group transition-all duration-[450ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:-translate-y-[10px] border border-[rgba(255,255,255,0.12)] shadow-[0_20px_60px_rgba(8,18,15,0.35)] hover:shadow-[0_35px_80px_rgba(8,20,18,0.45)] backdrop-blur-[24px] hover:backdrop-blur-[32px]"
      style={{
        background: `
          linear-gradient(180deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05)),
          radial-gradient(circle at top right, rgba(185, 255, 220, 0.4), transparent 50%),
          linear-gradient(135deg, rgba(38, 110, 85, 0.45) 0%, rgba(76, 175, 134, 0.35) 40%, rgba(135, 230, 188, 0.3) 100%)
        `
      }}
    >
      {/* Interactive Border Spotlight Shine */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 rounded-[24px] transition-opacity duration-300 border border-transparent"
        style={{
          opacity: isHovered ? 1 : 0,
          maskImage: `radial-gradient(200px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(200px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent 100%)`,
          borderImage: `radial-gradient(250px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.8), transparent 100%) 1`
        }}
      />

      {/* Hover Brightness Overlay */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-[450ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] pointer-events-none" />

      {/* Mint Highlight on Hover */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#B8F2D5] rounded-full blur-[50px] opacity-0 group-hover:opacity-30 transition-opacity duration-[450ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] pointer-events-none" />

      {/* Left Icon */}
      <div className="relative z-10 w-12 h-12 rounded-full border border-[rgba(255,255,255,0.3)] flex items-center justify-center shrink-0 bg-[rgba(255,255,255,0.15)] shadow-[inset_0_0_12px_rgba(255,255,255,0.15)] group-hover:scale-105 transition-transform duration-[450ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]">
        <Icon className="w-5 h-5 text-white stroke-[1.5]" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-white font-bold text-[15px] md:text-[17px] font-sans group-hover:text-white transition-colors duration-[450ms]" style={{ letterSpacing: '0.2px' }}>
            {item.title}
          </h3>
          {item.badge && (
            <span className="text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-[4px] border border-white/40 text-white uppercase bg-white/10">
              {item.badge}
            </span>
          )}
        </div>
        <p className="text-white/80 font-normal font-sans text-[12px] md:text-[13px] group-hover:text-white transition-colors duration-[450ms]" style={{ lineHeight: '1.7' }}>
          {item.desc}
        </p>
      </div>
    </motion.div>
  );
};

export default function ClubhouseAmenities() {
  return (
    <div className="w-full relative z-20 mt-8 mb-4">
      <div className="w-full">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-1.5 mb-4">
            <span className="text-[#C49A5A] text-[10px] font-bold tracking-[3px] uppercase font-sans">
              PREMIUM FACILITIES
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#F7F0E4] leading-tight font-display" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Clubhouse Amenities
          </h2>
          <div className="w-16 h-[1.5px] bg-[#C49A5A] mt-6"></div>
        </div>

        {/* Spotlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clubhouseAmenities.map((item, index) => (
            <SpotlightCard key={index} item={item} index={index} />
          ))}
        </div>

      </div>
    </div>
  );
}
