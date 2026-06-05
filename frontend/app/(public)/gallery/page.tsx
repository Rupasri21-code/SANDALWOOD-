'use client';

import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

const categories = ['All', 'Plantation', 'Nursery', 'Harvest', 'Land', 'Infrastructure'];

const images = [
  { src: 'https://images.pexels.com/photos/32849312/pexels-photo-32849312.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Plantation', title: 'Mature Sandalwood Grove', location: 'Hassan, Karnataka' },
  { src: 'https://images.pexels.com/photos/17052523/pexels-photo-17052523.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Land', title: 'Premium Agricultural Plot', location: 'Mysore, Karnataka' },
  { src: 'https://images.pexels.com/photos/15124451/pexels-photo-15124451.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Plantation', title: 'Aerial View – 50 Acre Block', location: 'Vellore, Tamil Nadu' },
  { src: 'https://images.pexels.com/photos/10971334/pexels-photo-10971334.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Plantation', title: 'Morning Mist Over Plantation', location: 'Coorg, Karnataka' },
  { src: 'https://images.pexels.com/photos/1563604/pexels-photo-1563604.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Plantation', title: '10-Year Sandalwood Stand', location: 'Chittoor, Andhra Pradesh' },
  { src: 'https://images.pexels.com/photos/10316168/pexels-photo-10316168.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Land', title: 'River-Adjacent Farmland', location: 'Bellary, Karnataka' },
  { src: 'https://images.pexels.com/photos/11669262/pexels-photo-11669262.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Nursery', title: 'Certified Sapling Nursery', location: 'Chandan Nilayam Farm, Bangalore' },
  { src: 'https://images.pexels.com/photos/34042459/pexels-photo-34042459.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Infrastructure', title: 'Drip Irrigation Network', location: 'Tumkur, Karnataka' },
  { src: 'https://images.pexels.com/photos/6784121/pexels-photo-6784121.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Harvest', title: 'Sandalwood Log – Grade A', location: 'Hassan, Karnataka' },
  { src: 'https://images.pexels.com/photos/35804970/pexels-photo-35804970.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Plantation', title: 'Young Saplings — Year 2', location: 'Mandya, Karnataka' },
  { src: 'https://images.pexels.com/photos/35071430/pexels-photo-35071430.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Land', title: 'Surveyed Plot Boundary', location: 'Krishnagiri, Tamil Nadu' },
  { src: 'https://images.pexels.com/photos/35071429/pexels-photo-35071429.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Plantation', title: 'Dense Canopy – Year 8', location: 'Hassan, Karnataka' },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = activeCategory === 'All'
    ? images
    : images.filter((img) => img.category === activeCategory);

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-[#0a1f0a]">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#c8851e] text-sm font-medium tracking-widest uppercase mb-4">Visual Portfolio</p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-white mb-4">
            Our <span className="text-gradient-gold">Plantation Gallery</span>
          </h1>
          <p className="text-white/60 text-lg">
            See the land, the trees, the progress — a visual testament to our commitment.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-[#faf6f2] sticky top-16 z-40 border-b border-[#e8e0d8]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-[#c8851e] text-white shadow-md'
                  : 'bg-white text-[#6b6b6b] border border-[#e8e0d8] hover:border-[#c8851e]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 bg-[#faf6f2]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map((img, i) => (
              <div
                key={i}
                className="break-inside-avoid cursor-pointer group relative rounded-xl overflow-hidden"
                onClick={() => setLightbox(images.indexOf(img))}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f0a]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <div className="text-white font-semibold text-sm">{img.title}</div>
                  <div className="text-white/60 text-xs">{img.location}</div>
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div
            className="max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightbox].src}
              alt={images[lightbox].title}
              className="w-full rounded-xl object-contain max-h-[80vh]"
            />
            <div className="mt-4 text-center">
              <div className="text-white font-semibold">{images[lightbox].title}</div>
              <div className="text-white/50 text-sm">{images[lightbox].location}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
