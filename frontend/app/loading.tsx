import BrandLogo from '@/components/BrandLogo';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#06120F] text-white flex items-center justify-center overflow-hidden px-6 py-10">
      <div className="relative flex flex-col items-center justify-center gap-8 rounded-[2.5rem] border border-white/10 bg-[#0A1913]/90 p-10 shadow-[0_40px_120px_rgba(0,0,0,0.35)] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(196,154,90,0.18),_transparent_45%)] opacity-70" />
        <div className="absolute inset-x-0 top-1/4 h-28 bg-gradient-to-b from-[#C49A5A]/10 to-transparent blur-3xl" />
        <div className="relative z-10 flex items-center justify-center rounded-full bg-[#0B2F24]/80 border border-[#C49A5A]/20 shadow-[0_0_25px_rgba(196,154,90,0.16)] h-[180px] w-[180px]">
          <div className="absolute inset-0 rounded-full border border-[#C49A5A]/20 opacity-40 animate-[spin_14s_linear_infinite]" />
          <div className="absolute inset-4 rounded-full border border-[#E7D0A3]/25 opacity-70 animate-[spin_10s_linear_reverse_infinite]" />
          <div className="absolute inset-10 rounded-full border border-[#C49A5A]/20 opacity-30" />
          <div className="relative z-10">
            <BrandLogo height={96} />
          </div>
        </div>

        <div className="relative z-10 w-full max-w-[360px] text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#E7D9B5]/80 mb-3 font-semibold">
            Preparing your premium Chandan Nilayam experience
          </p>
          <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="absolute left-[-30%] top-0 h-full w-2/5 rounded-full bg-gradient-to-r from-[#C49A5A] via-[#E9CF7D] to-[#C49A5A]"
              style={{ animation: 'loader 2.2s ease-in-out infinite' }}
            />
          </div>
          <div className="mt-8 flex flex-col items-center justify-center opacity-90 animate-in fade-in duration-1000 delay-500">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#C49A5A] font-semibold font-sans mb-3">
              A Project by GK
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#C49A5A]/60"></div>
              <div className="flex flex-col items-center">
                <span className="text-[7px] uppercase tracking-[0.25em] text-white/50 font-semibold mb-1">Initiated By</span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] bg-clip-text text-transparent bg-gradient-to-r from-[#C49A5A] to-[#E5C99F] font-black drop-shadow-sm">
                  Mahalakshmi Reality Developers
                </span>
              </div>
              <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#C49A5A]/60"></div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex gap-3 mt-4">
          <span className="h-3 w-3 rounded-full bg-[#C49A5A] animate-pulse" />
          <span className="h-3 w-3 rounded-full bg-[#C49A5A] opacity-70 animate-pulse" style={{ animationDelay: '0.18s' }} />
          <span className="h-3 w-3 rounded-full bg-[#C49A5A] opacity-50 animate-pulse" style={{ animationDelay: '0.36s' }} />
        </div>
      </div>
    </div>
  );
}
