'use client';

import { useState } from 'react';

type BrandLogoProps = {
  height?: number;
  className?: string;
  showProjectBy?: boolean;
  projectByText?: string;
  logoClassName?: string;
};

export default function BrandLogo({
  height = 52,
  className = '',
  showProjectBy = false,
  projectByText = 'A Project by GK',
  logoClassName = '',
}: BrandLogoProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const size = height;

  return (
    <div className={`flex flex-col items-center ${className}`.trim()}>
      {!imageFailed ? (
        <img
          src="/chandan nilayam logo.png"
          alt="Chandan Nilayam logo"
          className={`block object-contain ${logoClassName}`.trim()}
          style={{ height, width: 'auto' }}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div
          style={{ width: size, height: size }}
          className="flex items-center justify-center rounded-full border border-[#C49A5A]/20 bg-[#F7F0E4]/5"
        >
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#C49A5A]">CN</span>
        </div>
      )}
      {showProjectBy && (
        <span
          className="mt-3 text-[12px] uppercase tracking-[0.28em] text-[#C8A14A] font-medium font-sans"
          style={{ letterSpacing: '0.18em' }}
        >
          {projectByText}
        </span>
      )}
    </div>
  );
}
