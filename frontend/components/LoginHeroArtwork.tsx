'use client';

import { motion } from 'framer-motion';

type Props = {
  size?: number;
  className?: string;
};

export default function LoginHeroArtwork({ size = 520, className = '' }: Props) {
  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={size ? { maxWidth: size, width: '100%' } : { width: '100%' }}
    >
      {/* Soft Golden Glow Behind Frame */}
      <div className="absolute inset-[-10%] rounded-full bg-[#D9B36D]/20 blur-[80px] animate-pulse pointer-events-none" />

      {/* Real Premium Composited Hero Artwork Image */}
      <motion.img 
        src="/login/premium-tree-frame.webp"
        alt="Premium Luxury Estate"
        className="relative z-10 w-full h-auto object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.9)]"
        initial={{ y: 0 }}
        animate={{ y: [-15, 15, -15] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
