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
  { title: 'Mini Theater', desc: 'Private, state-of-the-art screening room for exclusive entertainment experiences.', icon: Film },
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
      className="relative rounded-2xl bg-[#0B1511] border border-[#16251D] p-6 md:p-8 flex items-start gap-5 overflow-hidden group hover:border-[#C49A5A]/30 transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_10px_35px_rgba(0,0,0,0.4)]"
      style={{ transform: isHovered ? 'translateY(-4px)' : 'translateY(0)' }}
    >
      {/* Background Spotlight Glow */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(196, 154, 90, 0.08), transparent 40%)`
        }}
      />

      {/* Border Highlight Glow */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 rounded-2xl transition-opacity duration-300 border border-transparent"
        style={{
          opacity: isHovered ? 1 : 0,
          maskImage: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent 100%)`,
          borderImage: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(196,154,90,0.6), transparent 100%) 1`
        }}
      />

      {/* Left Icon (Relative for Z-index above glow) */}
      <div className="relative z-10 w-12 h-12 rounded-full border border-[#C49A5A]/25 flex items-center justify-center shrink-0 shadow-inner bg-[#0A120E]/80 group-hover:bg-[#C49A5A]/10 group-hover:border-[#C49A5A]/60 transition-all duration-500">
        <Icon className="w-5 h-5 text-[#D4AF37] stroke-[1.5] group-hover:scale-110 transition-transform duration-500" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-[#F7F0E4] font-bold text-[15px] md:text-[17px] font-sans tracking-wide group-hover:text-[#FFF8DC] transition-colors duration-300">
            {item.title}
          </h3>
          {item.badge && (
            <span className="text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-[4px] border border-[#C49A5A]/40 text-[#C49A5A] uppercase bg-[#C49A5A]/5 group-hover:bg-[#C49A5A]/15 transition-colors duration-300">
              {item.badge}
            </span>
          )}
        </div>
        <p className="text-[#899D93] text-[12px] md:text-[13px] leading-[1.6] font-sans group-hover:text-[#A3B8B0] transition-colors duration-300">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubhouseAmenities.map((item, index) => (
            <SpotlightCard key={index} item={item} index={index} />
          ))}
        </div>

      </div>
    </div>
  );
}
