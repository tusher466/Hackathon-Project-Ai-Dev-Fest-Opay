import React from 'react';
import { Home, User, History, ShieldAlert, Clock, Smartphone, Zap, Globe2, GraduationCap } from 'lucide-react';
import { IconBanglaQR } from './UpayIcons';
import { Language } from '../types';
import { sound } from '../utils/audio';

export type TabKey = 'mfs' | 'account' | 'shield' | 'escrow' | 'history';

interface NavigationTabsProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  onOpenBanglaQR: () => void;
  onOpenMiniWallet?: () => void;
  onOpenCrossBorder?: () => void;
  onOpenStudentEmi?: () => void;
  lang: Language;
  escrowCount: number;
  threatsCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onSelectTab,
  onOpenBanglaQR,
  onOpenMiniWallet,
  onOpenCrossBorder,
  onOpenStudentEmi,
  lang,
  escrowCount,
  threatsCount,
}) => {
  const topTabs = [
    {
      id: 'mfs' as TabKey,
      label: 'Opay Hub',
      labelBn: 'ওপে হোম',
      icon: Smartphone,
    },
    {
      id: 'account' as TabKey,
      label: 'Account & NID',
      labelBn: 'অ্যাকাউন্ট',
      icon: User,
    },
    {
      id: 'shield' as TabKey,
      label: 'AI Scam Shield',
      labelBn: 'এআই শিল্ড',
      icon: ShieldAlert,
      badge: threatsCount > 0 ? `${threatsCount} Alerts` : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'escrow' as TabKey,
      label: 'Safe Escrow',
      labelBn: '২-মি. হোল্ড',
      icon: Clock,
      badge: escrowCount > 0 ? `${escrowCount} Active` : undefined,
      badgeColor: 'bg-amber-400 text-slate-900',
    },
    {
      id: 'history' as TabKey,
      label: 'Statement',
      labelBn: 'হিস্টরি',
      icon: History,
    },
  ];

  return (
    <>
      {/* Top Secondary Tab Pills for Quick Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-[76px] z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto no-scrollbar py-2">
            {topTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sound.playTap();
                    onSelectTab(tab.id);
                  }}
                  className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-[#0057B8] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                  <span>{lang === 'bn' ? tab.labelBn : tab.label}</span>

                  {tab.badge && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-tight ${
                        tab.badgeColor || (isActive ? 'bg-amber-400 text-slate-950' : 'bg-blue-100 text-blue-700')
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Quick Action Badges for Always-Accessible Innovation Features */}
            <div className="h-4 w-px bg-slate-200 mx-1 shrink-0" />

            {/* Feature 1: Mini-Wallet */}
            <button
              onClick={() => {
                sound.playTap();
                if (onOpenMiniWallet) onOpenMiniWallet();
              }}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 shadow-2xs transition"
              title="PIN-less Micro-Payments"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{lang === 'bn' ? 'মাইক্রো-ওয়ালেট' : 'Micro-Pay'}</span>
            </button>

            {/* Feature 2: Cross Border QR */}
            <button
              onClick={() => {
                sound.playTap();
                if (onOpenCrossBorder) onOpenCrossBorder();
              }}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap bg-blue-50 hover:bg-blue-100 text-[#0057B8] border border-blue-200 shadow-2xs transition"
              title="Cross-Border QR Payments"
            >
              <Globe2 className="w-3.5 h-3.5 text-cyan-600" />
              <span>{lang === 'bn' ? 'আন্তর্জাতিক QR' : 'Cross-Border'}</span>
            </button>

            {/* Feature 3: Student EMI */}
            <button
              onClick={() => {
                sound.playTap();
                if (onOpenStudentEmi) onOpenStudentEmi();
              }}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 shadow-2xs transition"
              title="Student Nano-EMI"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
              <span>{lang === 'bn' ? 'স্টুডেন্ট EMI' : 'Student EMI'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Bottom Navigation Bar (Matching screenshot without 'আরো') */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/90 shadow-2xl">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between relative">
          {/* 1. হোম (Home) */}
          <button
            onClick={() => {
              sound.playTap();
              onSelectTab('mfs');
            }}
            className={`flex flex-col items-center justify-center flex-1 transition ${
              activeTab === 'mfs' ? 'text-[#0057B8]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-black tracking-tight">হোম</span>
          </button>

          {/* 2. অ্যাকাউন্ট (Account / NID / Profile) */}
          <button
            onClick={() => {
              sound.playTap();
              onSelectTab('account');
            }}
            className={`flex flex-col items-center justify-center flex-1 transition ${
              activeTab === 'account' ? 'text-[#0057B8]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-black tracking-tight">অ্যাকাউন্ট</span>
          </button>

          {/* 3. Center: BANGLA QR (Raised Floating Circle Button - Opens Bangla QR Modal) */}
          <div className="relative -top-5 flex flex-col items-center flex-1">
            <button
              onClick={() => {
                sound.playTap();
                onOpenBanglaQR();
              }}
              className="focus:outline-none transition transform hover:scale-105 active:scale-95"
              aria-label="Bangla QR Scanner"
            >
              <IconBanglaQR size={58} />
            </button>
          </div>

          {/* 4. হিস্টরি (History) */}
          <button
            onClick={() => {
              sound.playTap();
              onSelectTab('history');
            }}
            className={`flex flex-col items-center justify-center flex-1 transition ${
              activeTab === 'history' ? 'text-[#0057B8]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <History className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-black tracking-tight">হিস্টরি</span>
          </button>
        </div>
      </div>
    </>
  );
};
