'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Flag,
  Landmark,
  Home,
  TreePine,
  Waves,
  Mountain,
  Trees,
  Activity,
  Map,
  Dumbbell,
  Car,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  ArrowDown
} from 'lucide-react';

const amenities = [
  { 
    id: 1, 
    title: 'GOLF GROUND', 
    desc: 'Exclusive golf ground\nfor leisure & recreation.', 
    icon: Flag,
    image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 2, 
    title: 'GRAND ENTRANCE ARCH', 
    desc: 'Majestic entrance with 24/7 security\nfor a safe & premium community.', 
    icon: Landmark,
    image: 'https://images.unsplash.com/photo-1582570739886-fbf349f7e8a9?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 3, 
    title: 'CLUB HOUSE', 
    desc: 'Modern clubhouse with premium\nfacilities for gatherings & events.', 
    icon: Home,
    image: '/clubhouse-collage.jpg' 
  },
  { 
    id: 4, 
    title: 'GARDEN AREA', 
    desc: 'Beautifully landscaped gardens\nto relax & rejuvenate.', 
    icon: TreePine,
    image: 'https://images.unsplash.com/photo-1558904541-efa843a96f0f?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 5, 
    title: 'SWIMMING POOL', 
    desc: 'Premium swimming pool\nfor relaxation & recreation.', 
    icon: Waves,
    image: 'https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 6, 
    title: 'HILL VIEW', 
    desc: 'Breathtaking hill views\nfor a refreshing experience.', 
    icon: Mountain,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 7, 
    title: 'VISITOR SEATING AREA', 
    desc: 'Comfortable seating area\nfor visitors to relax.', 
    icon: Trees,
    image: 'https://images.unsplash.com/photo-1517592473852-f01831828559?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 8, 
    title: 'WALKING TRACK', 
    desc: 'Scenic walking track\nfor a healthy lifestyle.', 
    icon: Activity,
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 9, 
    title: 'INTERNAL ROADS', 
    desc: 'Well-planned internal roads for\nsmooth & comfortable access.', 
    icon: Map,
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 10, 
    title: 'SEMI OPEN GYM', 
    desc: 'Semi open gym for a\nhealthy & active lifestyle.', 
    icon: Dumbbell,
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 11, 
    title: 'PARKING AREA', 
    desc: 'Spacious parking area\nfor residents & visitors.', 
    icon: Car,
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 12, 
    title: 'COMPOUND FENCING', 
    desc: 'Secure compound fencing ensuring\nsafety & protection.', 
    icon: ShieldCheck,
    image: 'https://images.unsplash.com/photo-1558227976-586fc249962a?auto=format&fit=crop&q=80&w=800' 
  },
];

const desktopRows = [
  { left: amenities[0], right: amenities[1], flow: 'right', downSide: 'right' },
  { left: amenities[3], right: amenities[2], flow: 'left', downSide: 'left' },
  { left: amenities[4], right: amenities[5], flow: 'right', downSide: 'right' },
  { left: amenities[7], right: amenities[6], flow: 'left', downSide: 'left' },
  { left: amenities[8], right: amenities[9], flow: 'right', downSide: 'right' },
  { left: amenities[11], right: amenities[10], flow: 'left', downSide: 'none' },
];

const Card = ({ item }: { item: typeof amenities[0] }) => {
  const Icon = item.icon;
  return (
    <div className="relative w-full max-w-[340px] bg-[#FDFBF7] rounded-[2rem] border-2 border-[#D9B36D] shadow-lg flex flex-col overflow-hidden items-center text-center mt-6 z-10">
      
      {/* Top Overlapping Icon Badge */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-[#12372A] border-4 border-[#FDFBF7] flex items-center justify-center shadow-md z-20">
        <Icon className="w-7 h-7 text-[#FDFBF7]" />
      </div>

      {/* Top Section Background */}
      <div className="w-full bg-[#FDFBF7] pt-10 pb-4 px-4 flex flex-col items-center">
        <h4 className="text-[#12372A] font-bold text-sm tracking-widest uppercase mt-1">
          {item.title}
        </h4>
      </div>

      {/* Image Area */}
      <div className="w-full h-44 bg-gray-200 relative">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
      </div>

      {/* Bottom Description Area */}
      <div className="w-full bg-[#FDFBF7] py-5 px-6 min-h-[90px] flex items-center justify-center border-t-2 border-[#D9B36D]/20">
        <p className="text-[#12372A]/80 text-xs font-medium whitespace-pre-line leading-relaxed">
          {item.desc}
        </p>
      </div>

    </div>
  );
};

export default function AmenitiesZigzag() {
  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 relative flex flex-col items-center">
      
      {/* DESKTOP ZIGZAG LAYOUT */}
      <div className="hidden md:flex flex-col items-center gap-y-16 w-full relative pt-10">
        {desktopRows.map((row, index) => (
          <div key={index} className="flex items-center justify-center w-full gap-24 relative">
            
            {/* Left Card */}
            <div className="flex-1 flex justify-end relative">
              <Card item={row.left} />
              
              {/* Vertical Down Arrow on Left Side */}
              {row.downSide === 'left' && (
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-0">
                  <div className="h-14 w-0 border-r-2 border-dashed border-[#12372A]"></div>
                  <ArrowDown className="w-5 h-5 text-[#12372A] -mt-1" />
                </div>
              )}
            </div>

            {/* Center Horizontal Arrow */}
            <div className="flex-shrink-0 w-24 flex items-center justify-center relative mt-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-0 border-t-2 border-dashed border-[#12372A]"></div>
              </div>
              <div className="absolute bg-[#0A120E] z-10 px-1 rounded-full">
                {row.flow === 'right' ? (
                  <ArrowRight className="w-5 h-5 text-[#C49A5A]" />
                ) : (
                  <ArrowLeft className="w-5 h-5 text-[#C49A5A]" />
                )}
              </div>
            </div>

            {/* Right Card */}
            <div className="flex-1 flex justify-start relative">
              <Card item={row.right} />
              
              {/* Vertical Down Arrow on Right Side */}
              {row.downSide === 'right' && (
                <div className="absolute -bottom-16 right-1/2 translate-x-1/2 flex flex-col items-center justify-center z-0">
                  <div className="h-14 w-0 border-r-2 border-dashed border-[#12372A]"></div>
                  <ArrowDown className="w-5 h-5 text-[#12372A] -mt-1" />
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* MOBILE LINEAR LAYOUT */}
      <div className="md:hidden flex flex-col items-center w-full gap-12 pt-10">
        {amenities.map((item, index) => (
          <div key={item.id} className="relative w-full flex flex-col items-center">
            <Card item={item} />
            {index < amenities.length - 1 && (
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-0">
                <div className="h-10 w-0 border-r-2 border-dashed border-[#12372A]"></div>
                <ArrowDown className="w-5 h-5 text-[#12372A] -mt-1" />
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
