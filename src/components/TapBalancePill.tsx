import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { sound } from '../utils/audio';
import { formatBdt } from '../utils/formatters';
import { Language } from '../types';

interface TapBalancePillProps {
  balance: number;
  lang: Language;
}

export const TapBalancePill: React.FC<TapBalancePillProps> = ({ balance, lang }) => {
  const [revealed, setRevealed] = useState(false);
  const [progressWidth, setProgressWidth] = useState(100);

  const handleTap = () => {
    sound.playTap();
    if (revealed) {
      setRevealed(false);
      setProgressWidth(100);
      return;
    }

    setRevealed(true);
    setProgressWidth(100);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    if (revealed) {
      const startTime = Date.now();
      const duration = 3500; // 3.5 seconds

      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgressWidth(remaining);
      }, 50);

      timer = setTimeout(() => {
        setRevealed(false);
        setProgressWidth(100);
      }, duration);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [revealed]);

  return (
    <button
      onClick={handleTap}
      className={`group relative overflow-hidden flex items-center gap-2.5 px-4 py-2 rounded-full border text-xs sm:text-sm font-bold shadow-md transition-all duration-300 ${
        revealed
          ? 'bg-[#FFD100] text-slate-950 border-amber-300 shadow-amber-400/30'
          : 'bg-white/15 hover:bg-white/25 text-white border-white/25'
      }`}
      aria-label="Tap for Balance"
    >
      {/* Official Upay Taka Coin Icon */}
      <span
        className={`flex items-center justify-center w-6 h-6 rounded-full font-black text-xs transition-all duration-300 ${
          revealed
            ? 'bg-slate-950 text-[#FFD100] scale-110 shadow-xs'
            : 'bg-[#FFD100] text-[#0057B8] shadow-sm'
        }`}
      >
        ৳
      </span>

      {/* Amount or Prompt */}
      <span className="tracking-wide min-w-[100px] text-center font-extrabold select-none">
        {revealed
          ? formatBdt(balance, lang)
          : lang === 'bn'
          ? 'ব্যালেন্স জানতে ট্যাপ করুন'
          : 'Tap for Balance'}
      </span>

      {revealed ? (
        <EyeOff className="w-4 h-4 text-slate-900" />
      ) : (
        <Eye className="w-4 h-4 text-white/80 group-hover:text-white" />
      )}

      {/* Auto-conceal Progress Bar on bottom of button */}
      {revealed && (
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-slate-900 transition-all duration-75"
          style={{ width: `${progressWidth}%` }}
        />
      )}
    </button>
  );
};
