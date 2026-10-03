import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  Calculator,
  Building,
  CreditCard,
  X,
  FileCheck,
  Check,
  QrCode,
  Calendar,
  Lock,
  RefreshCw,
  Info,
  Upload
} from 'lucide-react';
import { Language } from '../types';
import { sound } from '../utils/audio';
import { formatBdt } from '../utils/formatters';

export interface ActiveEmiPlan {
  id: string;
  merchantName: string;
  itemTitle: string;
  principalAmount: number;
  tenureMonths: number;
  monthlyInstallment: number;
  remainingMonths: number;
  nextDueDate: string;
  status: 'Active' | 'Paid';
}

interface StudentEmiModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  isKycApproved: boolean;
  totalCreditLimit: number;
  availableCreditLimit: number;
  activeEmis: ActiveEmiPlan[];
  onApproveKyc: () => void;
  onCreateEmiPurchase: (params: {
    merchantName: string;
    itemTitle: string;
    principalAmount: number;
    tenureMonths: number;
    monthlyInstallment: number;
    autoDebitAuthorized: boolean;
  }) => void;
}

export const StudentEmiModal: React.FC<StudentEmiModalProps> = ({
  isOpen,
  onClose,
  lang,
  isKycApproved,
  totalCreditLimit = 20000,
  availableCreditLimit,
  activeEmis,
  onApproveKyc,
  onCreateEmiPurchase,
}) => {
  // Always start newly from onboarding as requested
  const [step, setStep] = useState<'onboarding' | 'dashboard' | 'checkout' | 'receipt'>('onboarding');

  // Manual document upload states for student KYC
  const [universityName, setUniversityName] = useState('');
  const [studentRoll, setStudentRoll] = useState('');
  const [nidFile, setNidFile] = useState<File | null>(null);
  const [studentIdFile, setStudentIdFile] = useState<File | null>(null);
  const [admissionReceiptFile, setAdmissionReceiptFile] = useState<File | null>(null);
  const [kycError, setKycError] = useState('');
  const [isVerifyingKyc, setIsVerifyingKyc] = useState(false);

  // Checkout flow state
  const [selectedMerchant, setSelectedMerchant] = useState('Ryans Computers - Tech Accessories');
  const [itemTitle, setItemTitle] = useState('Logitech MX Master 3S + Mechanical Keyboard');
  const [billAmount, setBillAmount] = useState<number>(6000);
  const [optForEmi, setOptForEmi] = useState(true);
  const [tenure, setTenure] = useState<3 | 6 | 12>(6);
  const [autoDebitChecked, setAutoDebitChecked] = useState(true);

  // PIN & processing
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentReceipt, setRecentReceipt] = useState<any>(null);

  if (!isOpen) return null;

  const monthlyInstallment = Math.round(billAmount / tenure);

  // Handle Manual File Uploads
  const handleNidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setNidFile(e.target.files[0]);
      setKycError('');
      sound.playTap();
    }
  };

  const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setStudentIdFile(e.target.files[0]);
      setKycError('');
      sound.playTap();
    }
  };

  const handleAdmissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAdmissionReceiptFile(e.target.files[0]);
      setKycError('');
      sound.playTap();
    }
  };

  // Submit e-KYC with manual files validation
  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!universityName.trim()) {
      setKycError('Please enter your University or College name');
      return;
    }
    if (!studentRoll.trim()) {
      setKycError('Please enter your Student ID or Roll number');
      return;
    }
    if (!nidFile) {
      setKycError('Please manually upload your National ID (NID) for 18+ verification');
      return;
    }
    if (!studentIdFile) {
      setKycError('Please manually upload your Student ID Card');
      return;
    }

    setKycError('');
    sound.playTap();
    setIsVerifyingKyc(true);

    setTimeout(() => {
      setIsVerifyingKyc(false);
      onApproveKyc();
      sound.playSuccess();
      setStep('dashboard');
    }, 2000);
  };

  // Submit checkout purchase
  const handleConfirmCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!autoDebitChecked) {
      setPinError('You must authorize auto-debit to proceed with student micro-credit');
      return;
    }
    if (pin.length !== 4) {
      setPinError('Enter your 4-digit secret PIN');
      return;
    }
    if (billAmount > availableCreditLimit) {
      setPinError(`Amount exceeds available credit limit of ${formatBdt(availableCreditLimit, lang)}`);
      return;
    }

    setPinError('');
    setIsProcessing(true);
    sound.playTap();

    setTimeout(() => {
      setIsProcessing(false);
      sound.playSuccess();

      const nextMonthDate = new Date();
      nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
      const nextMonthStr = nextMonthDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      const receipt = {
        txnId: `EMI-UCB-${Math.floor(100000 + Math.random() * 900000)}`,
        merchant: selectedMerchant,
        item: itemTitle,
        principal: billAmount,
        tenure,
        monthly: monthlyInstallment,
        nextDueDate: nextMonthStr,
        settlementNote: 'Merchant Paid in Full (Settled upfront by UCB Bank)',
        autoPayNote: `AutoPay Mandate Created: Next deduction of ${formatBdt(monthlyInstallment, lang)} on ${nextMonthStr}`,
      };

      setRecentReceipt(receipt);

      onCreateEmiPurchase({
        merchantName: selectedMerchant,
        itemTitle,
        principalAmount: billAmount,
        tenureMonths: tenure,
        monthlyInstallment,
        autoDebitAuthorized: true,
      });

      setStep('receipt');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header with modern deep blue / purple fintech credit styling */}
        <div className="p-4 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/15 backdrop-blur-xs">
              <GraduationCap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                  Feature 3
                </span>
                <h3 className="text-base font-black tracking-tight">Student Nano-EMI</h3>
              </div>
              <p className="text-[11px] text-indigo-200">
                0% Interest Micro-Credit • Powered by UCB Bank
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

        {/* ========================================================= */}
        {/* STEP 1: STUDENT e-KYC & MANUAL DOCUMENT UPLOAD */}
        {/* ========================================================= */}
        {step === 'onboarding' && (
          <form onSubmit={handleKycSubmit} className="p-5 space-y-4 overflow-y-auto">
            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-900">
                <ShieldCheck className="w-4 h-4 text-indigo-700" />
                <span>Bangladesh Bank 18+ Student Verification Requirement</span>
              </div>
              <p className="text-[11px] leading-relaxed text-indigo-800/90">
                Please upload your original National ID (18+) and University Student ID documents manually. Once verified, UCB Bank approves a 20,000 BDT Nano-Credit Limit.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">University / College *</label>
                <input
                  type="text"
                  placeholder="e.g. University of Dhaka, BUET, NSU..."
                  value={universityName}
                  onChange={(e) => setUniversityName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Student ID / Roll No *</label>
                <input
                  type="text"
                  placeholder="e.g. 2022-CS-8941"
                  value={studentRoll}
                  onChange={(e) => setStudentRoll(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-mono text-slate-800"
                  required
                />
              </div>

              {/* Real Manual Upload Slots */}
              <div className="space-y-2 pt-1">
                <label className="font-bold text-slate-700 block">
                  Manual Verification Proofs (Browse from Device):
                </label>

                {/* 1. National ID Upload */}
                <label className="p-3 rounded-xl border border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 flex items-center justify-between cursor-pointer transition">
                  <div className="flex items-center gap-2 truncate">
                    <Upload className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-slate-800 text-[11px]">
                        {nidFile ? nidFile.name : 'Upload National ID (for 18+ Verification) *'}
                      </p>
                      <p className="text-[9px] text-slate-500">
                        {nidFile ? `${(nidFile.size / 1024).toFixed(1)} KB` : 'Smart NID card front & back'}
                      </p>
                    </div>
                  </div>
                  {nidFile ? (
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                      Uploaded
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full shrink-0">
                      Browse
                    </span>
                  )}
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleNidChange}
                    className="hidden"
                  />
                </label>

                {/* 2. University ID Upload */}
                <label className="p-3 rounded-xl border border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 flex items-center justify-between cursor-pointer transition">
                  <div className="flex items-center gap-2 truncate">
                    <Upload className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-slate-800 text-[11px]">
                        {studentIdFile ? studentIdFile.name : 'Upload Valid University ID Card *'}
                      </p>
                      <p className="text-[9px] text-slate-500">
                        {studentIdFile ? `${(studentIdFile.size / 1024).toFixed(1)} KB` : 'Active semester student card'}
                      </p>
                    </div>
                  </div>
                  {studentIdFile ? (
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                      Uploaded
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full shrink-0">
                      Browse
                    </span>
                  )}
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleStudentIdChange}
                    className="hidden"
                  />
                </label>

                {/* 3. Tuition / Admission receipt (Optional) */}
                <label className="p-3 rounded-xl border border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 flex items-center justify-between cursor-pointer transition">
                  <div className="flex items-center gap-2 truncate">
                    <Upload className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-slate-800 text-[11px]">
                        {admissionReceiptFile ? admissionReceiptFile.name : 'Semester Fee / Tuition Receipt (Optional)'}
                      </p>
                      <p className="text-[9px] text-slate-500">
                        {admissionReceiptFile ? `${(admissionReceiptFile.size / 1024).toFixed(1)} KB` : 'Improves credit score rating'}
                      </p>
                    </div>
                  </div>
                  {admissionReceiptFile ? (
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                      Uploaded
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full shrink-0">
                      Optional
                    </span>
                  )}
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleAdmissionChange}
                    className="hidden"
                  />
                </label>
              </div>

              {kycError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{kycError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifyingKyc}
              className="w-full py-3 bg-gradient-to-r from-indigo-700 to-purple-700 hover:opacity-95 text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isVerifyingKyc ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting & Verifying Student Documents...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Submit for Instant 20,000 BDT Approval</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ========================================================= */}
        {/* STEP 2: THE STUDENT EMI DASHBOARD */}
        {/* ========================================================= */}
        {step === 'dashboard' && (
          <div className="p-5 space-y-4 overflow-y-auto">
            {/* Approval Notification Banner */}
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Congratulations! UCB Bank has approved a Student Nano-Credit Limit of 20,000 BDT.</span>
            </div>

            {/* Credit Limit Banner */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-[#1E1B4B] to-[#3730A3] text-white shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">
                    UCB Bank Student Nano-Credit
                  </span>
                  <h2 className="text-2xl font-black mt-0.5 text-white">
                    {formatBdt(availableCreditLimit, lang)}
                  </h2>
                  <span className="text-xs text-indigo-300">Available Limit</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-indigo-200 block">Total Approved Limit</span>
                  <span className="text-sm font-extrabold text-amber-300">
                    {formatBdt(totalCreditLimit, lang)}
                  </span>
                </div>
              </div>

              {/* Progress bar of used limit */}
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (availableCreditLimit / totalCreditLimit) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Scan & Buy with EMI Button */}
            <button
              onClick={() => {
                sound.playTap();
                setStep('checkout');
              }}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:opacity-95 text-white font-extrabold text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 active:scale-95 group"
            >
              <QrCode className="w-5 h-5 text-amber-300 group-hover:scale-110 transition" />
              <span>Scan & Buy with EMI</span>
            </button>

            {/* Active EMIs Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                  Active EMIs ({activeEmis.length})
                </h4>
                <span className="text-[10px] text-slate-400 font-semibold">Auto-Debit Monthly</span>
              </div>

              {activeEmis.length === 0 ? (
                <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-400 text-xs">
                  <Clock className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                  <p className="font-bold">No active EMIs yet</p>
                  <p className="text-[10px] text-slate-400">
                    Use "Scan & Buy with EMI" at university partner stores
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeEmis.map((emi) => (
                    <div
                      key={emi.id}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 transition shadow-xs space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-black text-slate-800">{emi.merchantName}</p>
                          <p className="text-[11px] text-slate-500">{emi.itemTitle}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase">
                          {emi.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 text-slate-600">
                        <span>
                          Monthly: <strong>{formatBdt(emi.monthlyInstallment, lang)}</strong> ({emi.tenureMonths} Mo)
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Next: {emi.nextDueDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3: THE CHECKOUT & EMI CALCULATOR FLOW */}
        {/* ========================================================= */}
        {step === 'checkout' && (
          <form onSubmit={handleConfirmCheckout} className="p-5 space-y-4 overflow-y-auto">
            {/* Merchant Details Box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Scanned Merchant</span>
              <h3 className="text-sm font-black text-slate-800">{selectedMerchant}</h3>
              <p className="text-slate-600 font-medium">{itemTitle}</p>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-semibold">Total Bill Amount:</span>
                <span className="text-base font-black text-slate-900">
                  {formatBdt(billAmount, lang)}
                </span>
              </div>
            </div>

            {/* Opt for Student EMI Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50 border border-indigo-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-700" />
                <div>
                  <p className="text-xs font-black text-indigo-950">Opt for Student EMI</p>
                  <p className="text-[10px] text-indigo-700">0% processing fee for university students</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOptForEmi((prev) => !prev)}
                className={`w-11 h-6 rounded-full transition relative ${
                  optForEmi ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition transform ${
                    optForEmi ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Tenure Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Select EMI Tenure:</label>
              <div className="grid grid-cols-3 gap-2">
                {([3, 6, 12] as const).map((months) => (
                  <button
                    key={months}
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      setTenure(months);
                    }}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition text-center ${
                      tenure === months
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <p className="font-black">{months} Months</p>
                    <p className="text-[10px] text-slate-500">
                      {formatBdt(Math.round(billAmount / months), lang)}/mo
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Calculation Breakdown */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Principal:</span>
                <span className="font-bold text-slate-800">{formatBdt(billAmount, lang)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Processing Fee (0% for students):</span>
                <span className="font-bold text-emerald-600">0 BDT</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-slate-800 block">Monthly Installment:</span>
                  <span className="text-[10px] text-slate-500">{tenure} equal installments</span>
                </div>
                <span className="text-base font-black text-indigo-700">
                  {formatBdt(monthlyInstallment, lang)}/month
                </span>
              </div>
            </div>

            {/* Auto-Debit Checkbox */}
            <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer p-1">
              <input
                type="checkbox"
                checked={autoDebitChecked}
                onChange={(e) => setAutoDebitChecked(e.target.checked)}
                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span className="leading-snug">
                I authorize Opay & UCB Bank to Auto-Debit{' '}
                <strong>{formatBdt(monthlyInstallment, lang)}</strong> monthly from my wallet on the 10th of every month.
              </span>
            </label>

            {/* PIN entry */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Enter 4-Digit PIN to Confirm:</label>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full px-3 py-2 text-center tracking-[0.5em] text-lg font-black rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              {pinError && <p className="text-xs font-bold text-rose-600">{pinError}</p>}
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep('dashboard')}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-2 py-2.5 bg-gradient-to-r from-indigo-700 to-purple-700 hover:opacity-95 text-white text-xs font-black rounded-xl shadow-md transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Creating AutoPay Mandate...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Authorize EMI Purchase</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* STEP 4: PAYMENT CONFIRMATION & RECEIPT */}
        {/* ========================================================= */}
        {step === 'receipt' && recentReceipt && (
          <div className="p-5 space-y-4 overflow-y-auto">
            <div className="text-center pt-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 shadow-inner">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-base font-black text-slate-900">EMI Purchase Approved!</h3>
              <p className="text-xs text-slate-500 font-mono">{recentReceipt.txnId}</p>
            </div>

            {/* Settlement badges */}
            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{recentReceipt.settlementNote}</span>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs font-bold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-700 shrink-0" />
                <span>{recentReceipt.autoPayNote}</span>
              </div>
            </div>

            {/* Receipt Summary */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Merchant:</span>
                <span className="font-bold text-slate-800">{recentReceipt.merchant}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Item:</span>
                <span className="font-semibold text-slate-700">{recentReceipt.item}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Financed:</span>
                <span className="font-black text-slate-900">
                  {formatBdt(recentReceipt.principal, lang)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Remaining Credit Limit:</span>
                <span className="font-bold text-indigo-700">
                  {formatBdt(availableCreditLimit, lang)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playTap();
                setStep('dashboard');
              }}
              className="w-full py-3 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black shadow-md transition"
            >
              Return to Student EMI Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
