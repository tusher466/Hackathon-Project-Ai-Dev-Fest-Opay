import React, { useState, useEffect } from 'react';
import {
  Bell,
  Clock,
  ShieldCheck,
  Globe,
  Wifi,
  BatteryMedium,
  Check,
  ChevronRight
} from 'lucide-react';
import { UpayAppLogoCircle } from './UpayIcons';
import { Language, EscrowHoldItem } from '../types';
import { sound } from '../utils/audio';
import { formatBdt } from '../utils/formatters';

interface HeaderProps {
  balance: number;
  lang: Language;
  onToggleLang: () => void;
  activeEscrowItems: EscrowHoldItem[];
  unreadAlertsCount: number;
  onOpenEscrow: () => void;
  onOpenShield: () => void;
  onOpenNotifications?: () => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  balance,
  lang,
  onToggleLang,
  activeEscrowItems,
  unreadAlertsCount,
  onOpenEscrow,
  onOpenShield,
  onOpenNotifications,
  activeTab,
  setActiveTab,
}) => {
  const [showBalance, setShowBalance] = useState(false);
  const activeEscrowCount = activeEscrowItems.filter((i) => i.status === 'holding').length;

  // Auto-hide balance after 4 seconds
  useEffect(() => {
    if (showBalance) {
      const timer = setTimeout(() => setShowBalance(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showBalance]);

  const handleTapBalance = () => {
    sound.playTap();
    setShowBalance((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFCD00] text-slate-900 shadow-md transition-colors select-none">
      {/* Top Mobile Status Bar Row (Matching Screenshot: 1:13, WhatsApp, Wifi, 67%) */}
      <div className="max-w-6xl mx-auto px-4 pt-1.5 pb-1 flex items-center justify-between text-[11px] font-bold text-slate-800">
        <div className="flex items-center gap-2">
          <span>1:13</span>
          {/* Subtle notification icon */}
          <span className="w-2 h-2 rounded-full bg-slate-800/40 inline-block" />
        </div>
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5" />
          <span className="text-[10px]">67%</span>
          <BatteryMedium className="w-4 h-4" />
        </div>
      </div>

      {/* Main Upay App Profile & Balance Header */}
      <div className="max-w-6xl mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Upay Circular Avatar & User Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setActiveTab('mfs')}
              className="focus:outline-none transition transform hover:scale-105 active:scale-95 shrink-0"
              aria-label="Upay App Home"
            >
              <UpayAppLogoCircle size={48} />
            </button>

            <div className="truncate">
              <h1 className="text-sm sm:text-base font-black tracking-tight text-slate-900 truncate uppercase">
                Akash
              </h1>
              <p className="text-xs font-semibold text-slate-800/90 font-mono tracking-tight">
                01312563458
              </p>
            </div>
          </div>

          {/* Right: Blue Balance Pill + Notification Bell + Security Badges */}
          <div className="flex items-center gap-2 shrink-0">
            {/* 2-Min Safe Escrow Active Badge */}
            {activeEscrowCount > 0 && (
              <button
                onClick={onOpenEscrow}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 text-amber-300 text-[11px] font-black shadow-sm animate-pulse"
                title="Active Safe Escrow Delay"
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeEscrowCount} Hold</span>
              </button>
            )}

            {/* AI Shield Quick Access Button */}
            <button
              onClick={onOpenShield}
              className="relative p-2 rounded-xl bg-slate-900/10 hover:bg-slate-900/15 text-slate-900 transition flex items-center gap-1"
              title="AI Scam Call & SMS Shield"
            >
              <ShieldCheck className="w-4 h-4 text-[#0057B8]" />
              <span className="hidden md:inline text-xs font-bold text-[#0057B8]">
                AI Shield
              </span>
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-black text-white">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Official Blue "ব্যালেন্স" (Balance) Button */}
            <button
              onClick={handleTapBalance}
              className="relative px-3.5 sm:px-4 py-2 rounded-full bg-[#0057B8] hover:bg-[#004ca0] active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center min-w-[88px] sm:min-w-[100px]"
            >
              {showBalance ? (
                <span className="font-mono tracking-tight animate-fade-in font-black text-amber-300">
                  {formatBdt(balance, lang)}
                </span>
              ) : (
                <span className="tracking-wide">
                  {lang === 'bn' ? 'ব্যালেন্স' : 'ব্যালেন্স'}
                </span>
              )}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => {
                sound.playTap();
                if (onOpenNotifications) onOpenNotifications();
              }}
              className="relative p-2 rounded-full hover:bg-slate-900/10 text-slate-900 transition"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 fill-[#0057B8] text-[#0057B8]" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FFC700] ring-2 ring-white animate-pulse" />
            </button>

            {/* Bilingual Switcher */}
            <button
              onClick={onToggleLang}
              className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900/10 text-slate-900 text-xs font-bold"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
