'use client';

import React from 'react';
import {
  Flag,
  Building,
  TreePine,
  Footprints,
  Waves,
  Dumbbell,
  Baby,
  Armchair,
  Map,
  Car,
  ShieldCheck,
  Mountain,
  Umbrella,
  Building2,
  Shield
} from 'lucide-react';

const amenitiesData = [
  {
    id: 1,
    title: 'GOLF GROUND',
    desc: 'Exclusive golf ground\nfor leisure & recreation.',
    icon: Flag,
    // Lush green golf course
    image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    title: 'CLUBHOUSE',
    desc: 'Exclusive clubhouse designed\nfor recreation, gathering, and\npremium experiences.',
    icon: Building,
    // Modern luxury clubhouse / villa
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    title: 'LANDSCAPED GARDENS',
    desc: 'Beautifully curated gardens\ncreating a peaceful and\nrefreshing environment.',
    icon: TreePine,
    // Premium landscaped garden park
    image: 'https://images.unsplash.com/photo-1558904541-efa843a96f0f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 4,
    title: 'WALKING TRACK',
    desc: 'Dedicated pathways encouraging\nhealthy outdoor living.',
    icon: Footprints,
    // Beautiful paved walking path in nature
    image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 5,
    title: 'SWIMMING POOL',
    desc: 'Premium swimming pool\ndesigned for relaxation\nand leisure.',
    icon: Waves,
    // Luxury resort pool
    image: 'https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 6,
    title: 'SEMI OPEN GYM',
    desc: 'Open-air fitness area\nsurrounded by nature.',
    icon: Dumbbell,
    // Premium open gym / fitness area
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 7,
    title: 'CHILDREN\'S PLAY AREA',
    desc: 'Safe and engaging play spaces\ndesigned for families.',
    icon: Baby,
    // Modern playground equipment in park
    image: 'https://images.unsplash.com/photo-1566450653303-2614cbb292ea?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 8,
    title: 'VISITOR SEATING',
    desc: 'Comfortable outdoor seating\nfor residents and guests.',
    icon: Armchair,
    // Luxury outdoor patio seating
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 9,
    title: 'INTERNAL ROADS',
    desc: 'Wide, well-planned internal roads\nensuring smooth movement.',
    icon: Map,
    // Clean neighborhood road lined with trees
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 10,
    title: 'PARKING AREA',
    desc: 'Dedicated parking spaces\nfor residents and visitors.',
    icon: Car,
    // Organized neat parking lot
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 11,
    title: 'COMPOUND FENCING',
    desc: 'Secure boundary fencing for\nenhanced safety and privacy.',
    icon: ShieldCheck,
    // Premium stone/modern boundary wall
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 12,
    title: 'SCENIC HILL VIEWS',
    desc: 'Beautiful surrounding hill\nlandscapes offering\npeaceful views.',
    icon: Mountain,
    // Panoramic green rolling hills
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 13,
    title: 'SIT-OUT AREA',
    desc: 'Relax and unwind in\ndesignated sit-out spaces.',
    icon: Umbrella,
    // Outdoor luxury gazebo/pavilion
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 14,
    title: 'NEARBY CITY ACCESS',
    desc: 'Convenient access to\nnearby cities and\nurban conveniences.',
    icon: Building2,
    // Modern clean highway leading to city
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 15,
    title: '24/7 SECURITY',
    desc: 'Round-the-clock security\nfor a safe and secure\ncommunity.',
    icon: Shield,
    // Premium gated security entrance
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'
  }
];

export default function AmenitiesGrid() {
  return (
    <section className="bg-[#F8F3E8] pt-[80px] pb-[80px] px-[20px] md:px-[40px] lg:px-[60px] relative w-full flex flex-col items-center">
      <div className="w-full max-w-[1550px] mx-auto flex justify-center">
        
        {/* Exactly 5 cards per row on Desktop, perfectly aligned */}
        <div 
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5"
          style={{ gap: '28px 24px' }}
        >
          {amenitiesData.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group relative bg-[#FDFBF7] border-[1.5px] border-[#C89A45] flex flex-col overflow-hidden transition-all duration-[350ms] ease-out hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] hover:border-[#E8B95F]"
                style={{ 
                  width: '275px', 
                  height: '385px', 
                  borderRadius: '16px',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
                  margin: '0 auto',
                  padding: 0
                }}
              >
                {/* 1. TOP SECTION with the thin horizontal inner line */}
                <div className="w-full relative flex flex-col items-center shrink-0" style={{ height: '110px' }}>
                  
                  {/* The faint horizontal line behind the icon (matches reference exactly) */}
                  <div 
                    className="absolute left-0 right-0 bg-[#E5D7B7] z-0" 
                    style={{ top: '35px', height: '1px' }} 
                  />
                  
                  {/* Circular Icon */}
                  <div 
                    className="bg-[#173C2D] flex items-center justify-center z-10"
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      marginTop: '10px',
                      marginBottom: '10px'
                    }}
                  >
                    <Icon className="text-white" style={{ width: '22px', height: '22px' }} strokeWidth={1.5} />
                  </div>

                  {/* Title */}
                  <h3 
                    className="text-center font-bold text-[#173C2D] leading-none uppercase z-10 px-2"
                    style={{ 
                      fontFamily: "'Cormorant Garamond', serif", 
                      fontSize: '19px',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {item.title}
                  </h3>
                </div>

                {/* 2. HERO IMAGE SECTION */}
                <div className="w-full overflow-hidden shrink-0 bg-[#E8DFD3] relative" style={{ height: '170px' }}>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-[350ms] ease-out group-hover:scale-[1.03]" 
                    onError={(e) => {
                      // Generic safe fallback if any unsplash image fails
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800'; 
                    }}
                  />
                </div>

                {/* 3. DESCRIPTION SECTION */}
                <div className="w-full flex flex-col items-center justify-center px-4 flex-1 bg-[#FDFBF7]" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
                  <p 
                    className="text-center font-normal text-[#4A4A4A] leading-[1.3] whitespace-pre-line"
                    style={{ 
                      fontFamily: "'Lora', serif", 
                      fontSize: '13px' 
                    }}
                  >
                    {item.desc}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
