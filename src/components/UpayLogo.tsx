import React from 'react';

interface UpayLogoProps {
  variant?: 'light' | 'dark' | 'white-on-blue' | 'compact';
  className?: string;
  showTagline?: boolean;
}

export const UpayLogo: React.FC<UpayLogoProps> = ({
  variant = 'white-on-blue',
  className = '',
  showTagline = true,
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Official Upay Emblem Circle */}
      <div className="relative w-11 h-11 rounded-full bg-white flex flex-col items-center justify-center p-1 shadow-sm border border-amber-200 shrink-0">
        <svg viewBox="0 0 40 28" className="w-6 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="6" r="3.2" fill="#FFC700" />
          <circle cx="28" cy="6" r="3.2" fill="#0057B8" />
          <path
            d="M12 12V18C12 21.3137 14.6863 24 18 24H20"
            stroke="#FFC700"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M20 24H22C25.3137 24 28 21.3137 28 18V12"
            stroke="#0057B8"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-[7.5px] font-black tracking-tight text-slate-900 leading-none mt-0.5">
          উপায়
        </span>
      </div>

      {/* Upay wordmark and UCB Fintech endorsement */}
      <div>
        <div className="flex items-baseline gap-1">
          <span
            className={`font-black text-2xl sm:text-3xl tracking-tight leading-none ${
              variant === 'dark' ? 'text-[#0057B8]' : 'text-slate-950'
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            upay
          </span>
          <span className="w-2 h-2 rounded-full bg-[#FFC700] inline-block mb-1 shadow-xs" />
        </div>

        {showTagline && (
          <p
            className={`text-[9px] sm:text-[10px] tracking-wider uppercase font-semibold leading-tight ${
              variant === 'dark' ? 'text-slate-500' : 'text-slate-700'
            }`}
          >
            a <span className="font-bold text-[#0057B8]">UCB</span> fintech company
          </p>
        )}
      </div>
    </div>
  );
};
