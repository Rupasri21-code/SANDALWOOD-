'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ZoomIn, Play, FileText, Leaf, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

const categories = ['All', 'Land', 'Plantation', 'Saplings', 'Sandalwood Trees', 'Videos', 'Documents'];

const initialGalleryItems = [
  { 
    src: '/investment-growth.jpg', 
    category: 'Land', 
    title: '50-Acre Dornala Estate Boundary', 
    location: 'Dornala, Andhra Pradesh',
    type: 'image'
  },
  { 
    src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800', 
    category: 'Plantation', 
    title: 'Developed Plantation Overview', 
    location: 'Block A, Dornala',
    type: 'image'
  },

  { 
    src: 'https://images.pexels.com/photos/15124451/pexels-photo-15124451.jpeg?auto=compress&cs=tinysrgb&w=800', 
    category: 'Plantation', 
    title: 'Irrigation Management Setup', 
    location: 'Block B, Dornala',
    type: 'image'
  },
  { 
    src: 'https://images.pexels.com/photos/1563604/pexels-photo-1563604.jpeg?auto=compress&cs=tinysrgb&w=800', 
    category: 'Sandalwood Trees', 
    title: 'Established Sandalwood Stands (Year 5)', 
    location: 'Block A, Dornala',
    type: 'image'
  },
  { 
    src: 'https://images.pexels.com/photos/10316168/pexels-photo-10316168.jpeg?auto=compress&cs=tinysrgb&w=800', 
    category: 'Land', 
    title: 'Fencing & Solar Security Lines', 
    location: 'Estate Perimeter',
    type: 'image'
  },
  { 
    src: 'https://images.pexels.com/photos/11669262/pexels-photo-11669262.jpeg?auto=compress&cs=tinysrgb&w=800', 
    category: 'Saplings', 
    title: 'Organic Fertilizer Blending', 
    location: 'Dornala Farmhouse',
    type: 'image'
  },
  { 
    src: 'https://images.pexels.com/photos/6784121/pexels-photo-6784121.jpeg?auto=compress&cs=tinysrgb&w=800', 
    category: 'Sandalwood Trees', 
    title: 'High-Density Heartwood Logs', 
    location: 'Maturity Sample',
    type: 'image'
  },
  { 
    src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800', 
    category: 'Videos', 
    title: 'Plantation Walkthrough Video', 
    location: 'Guided Tour',
    type: 'video'
  },
  { 
    src: 'https://images.pexels.com/photos/9363120/pexels-photo-9363120.jpeg?auto=compress&cs=tinysrgb&w=800', 
    category: 'Documents', 
    title: 'FEMA & Land Registration Deed Draft', 
    location: 'Legal Records',
    type: 'document'
  },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [galleryItems, setGalleryItems] = useState<any[]>(initialGalleryItems);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await api.get('/gallery');
        if (response.data?.data && response.data.data.length > 0) {
          const validGallery = response.data.data.filter((item: any) => 
            item.image_url && typeof item.image_url === 'string' && item.image_url.trim().startsWith('http')
          );

          if (validGallery.length > 0) {
            // Map backend items to frontend structure
            const fetched = validGallery.map((item: any) => ({
              src: item.image_url,
              category: item.category || 'Land',
              title: item.title || 'Gallery Image',
              location: 'Dornala, Andhra Pradesh', // Default location
              type: item.type === 'video' ? 'video' : 'image'
            }));
            setGalleryItems(fetched);
          }
        }
      } catch (error) {
        console.error("Failed to fetch gallery items", error);
      }
    };
    fetchGallery();
  }, []);

  const filtered = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div className="bg-[#F7F0E4] min-h-screen text-[#1E1E1A] font-sans overflow-x-hidden relative">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex items-center justify-center overflow-hidden w-full h-[50vh] min-h-[400px]">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1920"
            alt="Gallery Background"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Forest Green Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0B2F24]/80 to-[#0B2F24]/90" />

        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 mb-6 shadow-md border"
            style={{
              background: 'rgba(247, 240, 228, 0.85)',
              borderColor: '#C49A5A',
            }}
          >
            <Leaf className="w-4 h-4 text-[#8B5E3C]" />
            <span className="text-[10px] font-bold tracking-[2px] uppercase text-[#8B5E3C]">
              Media Library
            </span>
          </div>

          <h1 
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 leading-tight"
            style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              textShadow: '0 4px 15px rgba(0, 0, 0, 0.4)' 
            }}
          >
            A Glimpse of Our Land
          </h1>
          <p className="text-[#E6D3B3] text-base md:text-lg max-w-2xl leading-relaxed font-serif" style={{ fontFamily: "'Lora', serif" }}>
            Browse through actual site photos, development layouts, sapling growth milestones, and legal certification files.
          </p>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-20">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px]">
            <path d="M0,35 C300,105 600,15 900,105 L1200,55 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* 2. FEATURED PLANTATION VIEW */}
      <section className="py-20 bg-[#F7F0E4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-[#F3E8D2] border border-[#C49A5A]/35 rounded-[3rem] p-8 md:p-12 shadow-sm grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-[#C49A5A]/25">
              <img 
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800" 
                alt="Featured View" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
                <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center text-[#8B5E3C] shadow-lg hover:scale-105 transition-transform cursor-pointer">
                  <Play className="w-6 h-6 fill-[#8B5E3C] ml-1" />
                </div>
              </div>
            </div>
            <div className="text-left flex flex-col items-start">
              <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3">FEATURED VIEW</span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#12372A] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Flyover & Agronomy Tour – Dornala
              </h2>
              <p className="text-[#2F3E2F] text-sm leading-relaxed mb-6">
                Watch our latest high-definition drone flyover capturing the 50-acre boundary layout, soil mounds, drip irrigation installation, and host trees flourishing under the Prakasam sunshine.
              </p>
              <Link href="/contact">
                <Button className="bg-[#0B2F24] hover:bg-[#12372A] text-white rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors">
                  REQUEST SITE SURVEY REPORT
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FILTERS BAR */}
      <section className="bg-[#F3E8D2] sticky top-16 z-40 border-y border-[#C49A5A]/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-2.5 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-[#C49A5A] text-white shadow-md'
                  : 'bg-white text-[#2F3E2F]/80 border border-[#C49A5A]/30 hover:border-[#C49A5A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 4. GALLERY GRID */}
      <section className="py-16 bg-[#F7F0E4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item, i) => (
              <div
                key={i}
                className="bg-[#F3E8D2] border border-[#C49A5A]/30 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col justify-between"
                onClick={() => setLightbox(galleryItems.indexOf(item))}
              >
                {/* Visual Area */}
                <div className="w-full aspect-[4/3] bg-[#E6D3B3]/40 overflow-hidden relative border-b border-[#C49A5A]/20">
                  {item.type === 'image' && (
                    <img
                      src={item.src}
                      alt={item.title}
                      onError={(e) => { 
                        if (!e.currentTarget.src.includes('gallery_01.png')) {
                          e.currentTarget.src = '/gallery_01.png'; 
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  {item.type === 'video' && (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#8B5E3C]">
                      <Play className="w-12 h-12 stroke-[1.25] mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Video Walkthrough</span>
                    </div>
                  )}
                  {item.type === 'document' && (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#8B5E3C]">
                      <FileText className="w-12 h-12 stroke-[1.25] mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">PDF File Preview</span>
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#0B2F24]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white stroke-[1.5]" />
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 text-left flex-1 flex flex-col justify-center">
                  <h3 className="font-serif text-sm font-bold text-[#12372A] leading-tight mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {item.title}
                  </h3>
                  <div className="text-[#8B5E3C] text-[10px] font-bold uppercase tracking-wider">{item.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LIGHTBOX MODAL */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <div
            className="max-w-4xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {galleryItems[lightbox].type === 'image' && (
              <img
                src={galleryItems[lightbox].src}
                alt={galleryItems[lightbox].title}
                className="w-full max-h-[75vh] object-contain rounded-2xl border border-white/10"
              />
            )}
            
            {galleryItems[lightbox].type === 'video' && (
              <div className="w-full aspect-video bg-black flex flex-col items-center justify-center rounded-2xl border border-white/10 text-white relative">
                <Play className="w-16 h-16 text-[#C49A5A] fill-[#C49A5A]/25 mb-4 animate-pulse" />
                <span className="font-serif text-lg tracking-wide">Video stream connecting...</span>
              </div>
            )}

            {galleryItems[lightbox].type === 'document' && (
              <div className="w-full h-[60vh] bg-white rounded-2xl border border-white/10 flex flex-col items-center justify-center text-[#12372A] p-10">
                <FileText className="w-20 h-20 text-[#8B5E3C] mb-6" />
                <h4 className="font-serif text-xl font-bold mb-2">{galleryItems[lightbox].title}</h4>
                <p className="text-xs text-[#2F3E2F] mb-6">Document format is in PDF. Open in new tab or download below.</p>
                <div className="flex gap-4">
                  <Button className="bg-[#C49A5A] hover:bg-[#8B5E3C] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full">Download PDF</Button>
                  <Button variant="outline" className="border-[#C49A5A] text-[#8B5E3C] text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full" onClick={() => setLightbox(null)}>Close</Button>
                </div>
              </div>
            )}

            <div className="mt-4 text-center">
              <h3 className="font-serif text-lg font-bold text-white leading-none mb-1.5">{galleryItems[lightbox].title}</h3>
              <div className="text-[#C49A5A] text-xs font-bold uppercase tracking-wider">{galleryItems[lightbox].location}</div>
            </div>
          </div>
        </div>
      )}

      {/* 6. CTA SECTION */}
      <section className="relative py-28 bg-[#0B2F24] overflow-hidden text-center text-white">
        {/* Top curved wave */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] rotate-180">
            <path d="M0,35 C300,105 600,15 900,105 L1200,55 L1200,120 L0,120 Z" />
          </svg>
        </div>

        <div className="relative z-20 max-w-4xl mx-auto px-6 py-4 flex flex-col items-center">
          <span className="text-[#C49A5A] text-xs font-bold tracking-[0.2em] uppercase block mb-4">SITE VISITATION</span>
          <h2 
            className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Visit Our Plantation Near Dornala
          </h2>
          <p className="text-[#E6D3B3] text-sm md:text-base leading-relaxed max-w-xl mb-10 font-sans">
            Photos cannot substitute the scent of the soil and the expanse of 50 acres. Schedule your private site inspection with us.
          </p>
          <Link href="/contact">
            <Button 
              size="lg"
              className="bg-[#C49A5A] hover:bg-[#8B5E3C] text-white hover:opacity-90 px-10 py-6 text-sm font-semibold uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2 border border-white/10 shadow-lg"
            >
              VISIT OUR PLANTATION <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
