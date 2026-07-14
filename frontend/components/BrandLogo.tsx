'use client';

import { useState } from 'react';

type BrandLogoProps = {
  isMobile?: boolean;
  darkMode?: boolean;
  className?: string;
  logoClassName?: string;
  height?: number;
  width?: number;
};

export default function BrandLogo({
  isMobile = false,
  darkMode = false,
  className = '',
  logoClassName = '',
  height,
  width,
}: BrandLogoProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const logoHeight = height || (isMobile ? 48 : 64);

  return (
    <div className={`flex items-center ${className}`.trim()} style={{ minWidth: 'max-content' }}>
      {!imageFailed ? (
        <img
          src="/logo.png"
          alt="Chandan Nilayam Logo"
          className={`block object-contain object-left ${logoClassName}`.trim()}
          style={{ height: logoHeight, width: width || 'auto' }}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div
          className="flex items-center justify-center rounded border border-current opacity-20 px-4"
          style={{ height: logoHeight }}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider">CHANDAN NILAYAM</span>
        </div>
      )}
    </div>
  );
}
