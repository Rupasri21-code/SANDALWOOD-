'use client';

import { useState } from 'react';
import { Leaf } from 'lucide-react';

type BrandIdentityProps = {
  variant?: 'header' | 'footer';
  className?: string;
};

export default function BrandIdentity({
  variant = 'header',
  className = '',
}: BrandIdentityProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const isFooter = variant === 'footer';

  const containerClasses = isFooter
    ? "flex items-center gap-[28px] shrink-0"
    : "flex items-center gap-[20px] shrink-0 brand-identity";

  // Emblem matches the tight text stack height, max 104px to avoid stretching 108px navbar
  const emblemClasses = isFooter
    ? "shrink-0 w-[100px] h-[100px] flex items-center justify-center"
    : "shrink-0 w-[96px] h-[96px] xl:w-[104px] xl:h-[104px] flex items-center justify-center drop-shadow-sm";

  // Ultra-premium colors, completely solid for maximum crispness and clarity
  const primaryText = isFooter ? "text-[#F7F0E4]" : "text-[#063b27]"; 
  const accentRed = isFooter ? "text-[#C96754]" : "text-[#8a1c11]"; 
  const subText = isFooter ? "text-[#D9B36D]" : "text-[#1b4332]"; 
  const miniText = isFooter ? "text-[#F7F0E4]" : "text-[#1b4332]"; 
  
  const lightGreen = isFooter ? "text-[#85A681]" : "text-[#2D6A4F]";
  const lineColor = isFooter ? "bg-[#F7F0E4]" : "bg-[#0A2F1D]";
  const lightLineColor = isFooter ? "bg-[#85A681]" : "bg-[#2D6A4F]";

  return (
    <div className={`${containerClasses} ${className}`.trim()}>
      
      {/* 1. Official Tree Emblem */}
      <div className={emblemClasses}>
        {!imageFailed ? (
          <img
            src="/branding/chandhan-tree-mark.png"
            alt="Chandhan Nilayam Emblem"
            className="w-full h-full block object-contain object-center drop-shadow-md"
            style={{ flexShrink: 0 }}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center border border-current opacity-20 rounded-full">
            <span className="text-[10px] uppercase font-bold tracking-widest">CN</span>
          </div>
        )}
      </div>

      {/* 2. Brand Typography Block - Maximized for Clarity */}
      <div className="flex flex-col items-center justify-center shrink-0 wordmark">
        
        {/* CHANDHAN */}
        <span 
          className={`font-serif font-black whitespace-nowrap ${primaryText} ${isFooter ? 'text-[24px]' : 'text-[22px] xl:text-[24px]'}`}
          style={{ 
            letterSpacing: '0.22em', 
            lineHeight: 1,
            textShadow: isFooter ? 'none' : '0px 1px 1px rgba(0,0,0,0.04)'
          }}
        >
          CHANDHAN
        </span>
        
        {/* NILAYAM */}
        {isFooter ? (
          <div className="flex items-center w-full my-1 gap-2">
            <Leaf className={`w-3 h-3 ${lightGreen} transform -scale-x-100 rotate-90 shrink-0`} fill="currentColor" />
            <div className={`flex-1 h-[1px] ${lightLineColor} opacity-70`} />
            <span 
              className={`font-serif font-black whitespace-nowrap px-1 ${accentRed} text-[18px]`}
              style={{ letterSpacing: '0.3em', lineHeight: 1 }}
            >
              NILAYAM
            </span>
            <div className={`flex-1 h-[1px] ${lightLineColor} opacity-70`} />
            <Leaf className={`w-3 h-3 ${lightGreen} transform -rotate-90 shrink-0`} fill="currentColor" />
          </div>
        ) : (
          <span 
            className={`font-serif font-black whitespace-nowrap mt-1 ${accentRed} text-[15px] xl:text-[17px]`}
            style={{ 
              letterSpacing: '0.35em', 
              lineHeight: 1,
              marginLeft: '0.35em', 
              textShadow: '0px 1px 1px rgba(0,0,0,0.02)'
            }}
          >
            NILAYAM
          </span>
        )}
        
        {/* Tagline */}
        <span
          className={`font-sans font-bold whitespace-nowrap ${isFooter ? 'mt-1 text-[8px]' : 'mt-1 text-[7px] xl:text-[8px]'} ${subText}`}
          style={{ letterSpacing: '0.28em' }}
        >
          PREMIUM RED SANDALWOOD PLOTS
        </span>

        {/* Separator / Leaves (Footer Only) */}
        {isFooter && (
          <div className="flex items-center w-[65%] mt-2 mb-1.5 gap-2">
            <div className={`flex-1 h-[1px] ${lineColor} opacity-50`} />
            <div className={`flex items-end justify-center gap-0.5 ${lightGreen}`}>
               <Leaf className="w-2 h-2 transform -rotate-45 mb-0.5" fill="currentColor" />
               <Leaf className="w-3 h-3" fill="currentColor" />
               <Leaf className="w-2 h-2 transform rotate-45 mb-0.5" fill="currentColor" />
            </div>
            <div className={`flex-1 h-[1px] ${lineColor} opacity-50`} />
          </div>
        )}

        {/* A PROJECT BY */}
        <span
          className={`font-sans font-bold whitespace-nowrap ${isFooter ? 'text-[#D9B36D]' : miniText} ${isFooter ? 'text-[7.5px]' : 'mt-2 text-[6px] xl:text-[6.5px]'}`}
          style={{ letterSpacing: '0.3em' }}
        >
          A PROJECT BY
        </span>

        {/* COMPANY */}
        <span
          className={`font-sans font-black whitespace-nowrap ${isFooter ? 'text-[#F7F0E4]' : miniText} ${isFooter ? 'mt-1 text-[9px]' : 'mt-0.5 text-[6.5px] xl:text-[7.5px]'}`}
          style={{ letterSpacing: '0.15em' }}
        >
          MAHA LAKSHMI REALTY DEVELOPERS PVT LTD
        </span>

      </div>
    </div>
  );
}
