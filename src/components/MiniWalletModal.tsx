import React, { useState } from 'react';
import {
  Zap,
  ShieldCheck,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  CreditCard,
  Coffee,
  Bus,
  RefreshCw,
  Sliders,
  DollarSign
} from 'lucide-react';
import { Language } from '../types';
import { sound } from '../utils/audio';
import { formatBdt } from '../utils/formatters';

interface MiniWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  mainBalance: number;
  miniBalance: number;
  maxLimit?: number; // default 1000
  lang: Language;
  onTopUpMiniWallet: (amount: number) => void;
  onQuickMicroPay: (amount: number, merchantTitle: string) => void;
}

export const MiniWalletModal: React.FC<MiniWalletModalProps> = ({
  isOpen,
  onClose,
  mainBalance,
  miniBalance,
  maxLimit = 1000,
  lang,
  onTopUpMiniWallet,
  onQuickMicroPay,
}) => {
  const [topUpAmount, setTopUpAmount] = useState('500');
  const [activeTab, setActiveTab] = useState<'pay' | 'topup'>('pay');
  const [selectedMerchant, setSelectedMerchant] = useState('Mama Tea Stall & Bakery');
  const [quickAmount, setQuickAmount] = useState('35');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const quickVendors = [
    { name: 'Mama Tea Stall & Bakery', amount: 35, icon: Coffee, desc: 'Hot Cha & Toast' },
    { name: 'Dhaka City Rickshaw Fare', amount: 60, icon: Bus, desc: 'Dhanmondi to Nilkhet' },
    { name: 'Local Public Bus Ticket', amount: 25, icon: Bus, desc: 'Mirpur-10 to Farmgate' },
    { name: 'Corner Grocery & Paan Shop', amount: 120, icon: Sparkles, desc: 'Snacks & Water' },
  ];

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(topUpAmount);
    if (isNaN(amt) || amt <= 0) {
      setErrorMsg(lang === 'bn' ? 'সঠিক পরিমাণ দিন' : 'Enter valid amount');
      return;
    }
    if (miniBalance + amt > maxLimit) {
      setErrorMsg(
        lang === 'bn'
          ? `মাইক্রো-ওয়ালেটে সর্বোচ্চ ৳${maxLimit} রাখা সম্ভব`
          : `Mini-wallet maximum limit is ৳${maxLimit}`
      );
      return;
    }
    if (amt > mainBalance) {
      setErrorMsg(lang === 'bn' ? 'প্রধান ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই' : 'Insufficient main wallet balance');
      return;
    }

    setErrorMsg('');
    onTopUpMiniWallet(amt);
    sound.playSuccess();
    setSuccessMsg(
      lang === 'bn'
        ? `৳${amt} সফলভাবে মাইক্রো-ওয়ালেটে লোড করা হয়েছে!`
        : `৳${amt} successfully loaded into Mini-Wallet!`
    );
    setTimeout(() => {
      setSuccessMsg('');
      setActiveTab('pay');
    }, 1500);
  };

  const handleInstantPay = (amountToPay: number, vendorName: string) => {
    if (amountToPay > 500) {
      setErrorMsg(
        lang === 'bn'
          ? 'পিন-লেস পেমেন্ট ৫০০ টাকার বেশি হতে পারবে না'
          : 'PIN-less payment must be under ৳500'
      );
      return;
    }
    if (amountToPay > miniBalance) {
      setErrorMsg(
        lang === 'bn'
          ? 'মাইক্রো-ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই! দয়া করে টপ-আপ করুন।'
          : 'Insufficient mini-wallet balance! Please top up.'
      );
      setActiveTab('topup');
      return;
    }

    setErrorMsg('');
    // Instant execution: no PIN, no delay!
    sound.playSuccess();
    onQuickMicroPay(amountToPay, vendorName);
    setSuccessMsg(
      lang === 'bn'
        ? `১-ট্যাপ পেমেন্ট সফল! ৳${amountToPay} প্রদান করা হয়েছে (${vendorName})`
        : `1-Tap Payment Success! ৳${amountToPay} paid to ${vendorName}`
    );
    setTimeout(() => {
      setSuccessMsg('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fade-in select-none">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header with vibrant Cyan / Blue gradient */}
        <div className="p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-[#0057B8] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-xs">
                <Zap className="w-6 h-6 text-amber-300 fill-amber-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                    Feature 1
                  </span>
                  <h3 className="text-base font-black tracking-tight">
                    {lang === 'bn' ? 'পিন-লেস মাইক্রো-পেমেন্ট' : 'PIN-less Micro-Payments'}
                  </h3>
                </div>
                <p className="text-xs text-teal-100">
                  {lang === 'bn'
                    ? '১-ট্যাপে ৫০০ টাকার নিচে তাৎক্ষণিক লেনদেন'
                    : '1-tap on-device mini-wallet for payments < ৳500'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playTap();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-white/20 transition text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mini-Wallet Balance Display */}
          <div className="mt-4 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-teal-100 uppercase tracking-wider">
                {lang === 'bn' ? 'অন-ডিভাইস মাইক্রো ব্যালেন্স' : 'On-Device Mini-Wallet'}
              </p>
              <h2 className="text-2xl font-black tracking-tight text-white mt-0.5">
                {formatBdt(miniBalance, lang)}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-teal-100 font-medium block">
                {lang === 'bn' ? `সর্বোচ্চ সীমা ৳${maxLimit}` : `Max Limit ৳${maxLimit}`}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-black/20 px-2 py-0.5 rounded-full mt-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Zero Bank Delay
              </span>
            </div>
          </div>
        </div>

        {/* Tab switch: Instant 1-Tap Pay vs Top-Up */}
        <div className="flex border-b border-slate-100 text-xs font-bold">
          <button
            onClick={() => {
              sound.playTap();
              setActiveTab('pay');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-center transition flex items-center justify-center gap-1.5 ${
              activeTab === 'pay'
                ? 'text-[#0057B8] border-b-2 border-[#0057B8] bg-blue-50/40'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>{lang === 'bn' ? '১-ট্যাপ পে (চা/রিকশা)' : '1-Tap Pay (Tea/Rickshaw)'}</span>
          </button>
          <button
            onClick={() => {
              sound.playTap();
              setActiveTab('topup');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 text-center transition flex items-center justify-center gap-1.5 ${
              activeTab === 'topup'
                ? 'text-[#0057B8] border-b-2 border-[#0057B8] bg-blue-50/40'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'bn' ? 'ওয়ালেট রিচার্জ' : 'Top-Up Mini Wallet'}</span>
          </button>
        </div>

        {/* Success or Error banner */}
        {successMsg && (
          <div className="m-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="m-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Content body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'pay' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>How Micro-Payments Work:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Transactions under <strong>৳500</strong> execute instantaneously with <strong>NO PIN</strong> and no waiting for core bank settlement. Perfect for tea stalls, local buses, and rickshaw fares.
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-700 mb-2">
                  {lang === 'bn' ? 'তাৎক্ষণিক পেমেন্ট নির্বাচন করুন:' : 'Quick Select Micro-Vendor:'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {quickVendors.map((v, i) => {
                    const VendorIcon = v.icon;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleInstantPay(v.amount, v.name)}
                        className="p-3 rounded-2xl border border-slate-200 hover:border-teal-500 bg-white hover:bg-teal-50/30 text-left transition flex items-center justify-between group shadow-xs active:scale-95"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                            <VendorIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800 group-hover:text-teal-700">
                              {v.name}
                            </p>
                            <p className="text-[10px] text-slate-500">{v.desc}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-teal-700 block">
                            ৳{v.amount}
                          </span>
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                            1-Tap
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom micro amount pay */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700 mb-1.5">
                  {lang === 'bn' ? 'কাস্টম মাইক্রো পেমেন্ট (১-ট্যাপ):' : 'Custom Instant Payment (< ৳500):'}
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedMerchant}
                    onChange={(e) => setSelectedMerchant(e.target.value)}
                    placeholder="Merchant / Vendor Name"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <div className="relative w-24">
                    <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">৳</span>
                    <input
                      type="number"
                      max={500}
                      value={quickAmount}
                      onChange={(e) => setQuickAmount(e.target.value)}
                      placeholder="Amount"
                      className="w-full pl-6 pr-2 py-2 text-xs font-black rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <button
                    onClick={() => handleInstantPay(parseFloat(quickAmount) || 0, selectedMerchant)}
                    className="px-3.5 py-2 bg-gradient-to-r from-teal-600 to-[#0057B8] hover:opacity-95 text-white text-xs font-black rounded-xl shadow-xs transition active:scale-95 shrink-0 flex items-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Pay</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'topup' && (
            <form onSubmit={handleTopUpSubmit} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200/80 p-3 rounded-2xl text-xs text-amber-800 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  Transfer from Main Opay Wallet
                </p>
                <p className="text-[11px] leading-relaxed">
                  Available in Main Wallet: <strong>{formatBdt(mainBalance, lang)}</strong>. Funds are transferred onto your secure device enclave for 0-second offline-capable payments.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {lang === 'bn' ? 'টপ-আপ পরিমাণ (সর্বোচ্চ ৳১,০০০ পর্যন্ত):' : 'Amount to Load (Max ৳1,000):'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">৳</span>
                  <input
                    type="number"
                    max={maxLimit}
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-base font-black text-slate-800"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {['100', '250', '500', '1000'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setTopUpAmount(val)}
                      className="flex-1 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:border-teal-500 bg-slate-50 text-slate-700"
                    >
                      ৳{val}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:opacity-95 text-white font-extrabold text-sm rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {lang === 'bn' ? `৳${topUpAmount} লোড করুন` : `Load ৳${topUpAmount} into Mini-Wallet`}
                </span>
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 px-5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>On-Device Security Enclave Active</span>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="font-bold text-slate-700 hover:underline"
          >
            {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
