import React, { useState } from 'react';
import {
  Globe2,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  UploadCloud,
  ArrowRight,
  Sparkles,
  Lock,
  X,
  CreditCard,
  Building,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Plane,
  Camera,
  Check,
  Zap,
  Info,
  Upload,
  FileCheck
} from 'lucide-react';
import { Language } from '../types';
import { sound } from '../utils/audio';
import { formatBdt } from '../utils/formatters';

interface CrossBorderPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  lang: Language;
  hasTravelEndorsement: boolean;
  travelQuotaRemainingUSD: number;
  onEndorseQuota: () => void;
  onExecuteCrossBorderPayment: (params: {
    foreignAmount: number;
    foreignCurrency: string;
    bdtAmount: number;
    merchantName: string;
    country: string;
    network: string;
  }) => void;
}

export const CrossBorderPaymentModal: React.FC<CrossBorderPaymentModalProps> = ({
  isOpen,
  onClose,
  balance,
  lang,
  hasTravelEndorsement,
  travelQuotaRemainingUSD,
  onEndorseQuota,
  onExecuteCrossBorderPayment,
}) => {
  // Always start newly with compliance check or endorse form as requested
  const [step, setStep] = useState<
    'status_check' | 'endorse_form' | 'scanner' | 'confirm' | 'receipt'
  >('status_check');

  // Manual document upload state
  const [passportNum, setPassportNum] = useState('');
  const [nidNum, setNidNum] = useState('');
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [visaFile, setVisaFile] = useState<File | null>(null);
  const [nidFile, setNidFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [isVerifyingEndorsement, setIsVerifyingEndorsement] = useState(false);

  // Manual foreign QR upload or simulated scan
  const [uploadedForeignQr, setUploadedForeignQr] = useState<File | null>(null);

  // Scanned payload
  const [scannedPayload, setScannedPayload] = useState({
    merchantName: 'Apollo Pharmacy, Chennai',
    country: 'India',
    flag: '🇮🇳',
    network: 'NIPL UPI (NPCI International)',
    foreignAmount: 5000,
    foreignCurrency: 'INR',
    currencySymbol: '₹',
    exchangeRate: 1.42, // 1 INR = 1.42 BDT
    bdtPayable: 7100, // 5000 * 1.42
  });

  // PIN input
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isProcessingPay, setIsProcessingPay] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  if (!isOpen) return null;

  // Real QR Code API for the international merchant
  const realInternationalQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=1&format=svg&data=${encodeURIComponent(
    `upi://pay?pa=apollo.chennai@icici&pn=Apollo%20Pharmacy&am=${scannedPayload.foreignAmount}&cu=${scannedPayload.foreignCurrency}`
  )}`;

  // Handle Manual Document File Uploads
  const handlePassportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPassportFile(e.target.files[0]);
      setUploadError('');
      sound.playTap();
    }
  };

  const handleVisaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setVisaFile(e.target.files[0]);
      setUploadError('');
      sound.playTap();
    }
  };

  const handleNidFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setNidFile(e.target.files[0]);
      setUploadError('');
      sound.playTap();
    }
  };

  // Handle Endorsement submission with manual verification
  const handleSubmitEndorsement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passportNum || passportNum.trim().length < 6) {
      setUploadError('Please enter a valid Passport Number');
      return;
    }
    if (!nidNum || nidNum.trim().length < 10) {
      setUploadError('Please enter a valid 10/17-digit National ID (NID)');
      return;
    }
    if (!passportFile) {
      setUploadError('Please upload your Passport Copy manually');
      return;
    }
    if (!visaFile) {
      setUploadError('Please upload your Visa Copy or Air Ticket manually');
      return;
    }

    setUploadError('');
    sound.playTap();
    setIsVerifyingEndorsement(true);

    setTimeout(() => {
      setIsVerifyingEndorsement(false);
      onEndorseQuota();
      sound.playSuccess();
      setStep('scanner');
    }, 2000);
  };

  // Handle manual upload of foreign merchant QR
  const handleManualForeignQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedForeignQr(file);
      sound.playSuccess();
      // Parse Indian UPI payload
      setScannedPayload({
        merchantName: 'Apollo Pharmacy, Chennai',
        country: 'India',
        flag: '🇮🇳',
        network: 'NIPL UPI (Scanned from Uploaded QR)',
        foreignAmount: 5000,
        foreignCurrency: 'INR',
        currencySymbol: '₹',
        exchangeRate: 1.42,
        bdtPayable: 7100,
      });
      setTimeout(() => {
        setStep('confirm');
      }, 1000);
    }
  };

  const handleSimulateScan = (countryOption: 'india' | 'uae') => {
    sound.playTap();
    if (countryOption === 'india') {
      setScannedPayload({
        merchantName: 'Apollo Pharmacy, Chennai',
        country: 'India',
        flag: '🇮🇳',
        network: 'NIPL UPI (NPCI International)',
        foreignAmount: 5000,
        foreignCurrency: 'INR',
        currencySymbol: '₹',
        exchangeRate: 1.42,
        bdtPayable: 7100,
      });
    } else {
      setScannedPayload({
        merchantName: 'Carrefour Hypermarket, Mall of the Emirates',
        country: 'United Arab Emirates',
        flag: '🇦🇪',
        network: 'Network International UAE',
        foreignAmount: 220,
        foreignCurrency: 'AED',
        currencySymbol: 'AED ',
        exchangeRate: 32.8,
        bdtPayable: 7216,
      });
    }
    setStep('confirm');
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setPinError('Please enter your 4-digit Opay PIN');
      return;
    }
    if (scannedPayload.bdtPayable > balance) {
      setPinError('Insufficient BDT balance in your Opay Wallet');
      return;
    }

    setPinError('');
    setIsProcessingPay(true);
    sound.playTap();

    setTimeout(() => {
      setIsProcessingPay(false);
      sound.playSuccess();
      const receipt = {
        txnId: `INTL-OPY-${Math.floor(100000 + Math.random() * 900000)}`,
        merchant: scannedPayload.merchantName,
        country: scannedPayload.country,
        foreignDelivered: `${scannedPayload.currencySymbol}${scannedPayload.foreignAmount} ${scannedPayload.foreignCurrency}`,
        bdtDeducted: scannedPayload.bdtPayable,
        exchangeRate: scannedPayload.exchangeRate,
        network: scannedPayload.network,
        settlementNote: 'Settled via UCB Bank Nostro/Vostro Account via NIPL Gateway.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setReceiptData(receipt);
      onExecuteCrossBorderPayment({
        foreignAmount: scannedPayload.foreignAmount,
        foreignCurrency: scannedPayload.foreignCurrency,
        bdtAmount: scannedPayload.bdtPayable,
        merchantName: scannedPayload.merchantName,
        country: scannedPayload.country,
        network: scannedPayload.network,
      });
      setStep('receipt');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 bg-gradient-to-r from-[#003B73] via-[#0057B8] to-[#0077CC] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/15 backdrop-blur-xs">
              <Globe2 className="w-5 h-5 text-cyan-300 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.2 rounded-full bg-cyan-400 text-slate-950 text-[9px] font-black uppercase">
                  Global MFS
                </span>
                <h3 className="text-base font-black tracking-tight">
                  Cross-Border QR Payments
                </h3>
              </div>
              <p className="text-[11px] text-cyan-100">
                Pay in BDT abroad • Merchant receives local currency
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
        {/* STEP 1: COMPLIANCE CHECK (Bangladesh Bank Passport Endorsement) */}
        {/* ========================================================= */}
        {step === 'status_check' && (
          <div className="p-6 space-y-4 overflow-y-auto">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
              <div className="flex items-center gap-2 text-sm font-extrabold text-amber-800">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Bangladesh Bank Foreign Exchange Compliance</span>
              </div>
              <p className="text-xs leading-relaxed text-amber-900/90">
                According to <strong>Bangladesh Bank Foreign Exchange Guidelines</strong>, citizens cannot spend BDT abroad without an official <strong>Passport Travel Endorsement</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Digital Travel Quota Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black uppercase">
                  Manual Verification Required
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Please upload your Passport, Visa, and NID documents manually to unlock your annual $1,000 / 120,000 BDT foreign travel quota.
              </p>
            </div>

            <button
              onClick={() => {
                sound.playTap();
                setStep('endorse_form');
              }}
              className="w-full py-3 bg-gradient-to-r from-[#0057B8] to-cyan-600 hover:opacity-95 text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Manual Passport & Document Upload</span>
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 1.5: TRAVEL & MEDICAL QUOTA MANUAL DOCUMENT UPLOAD */}
        {/* ========================================================= */}
        {step === 'endorse_form' && (
          <form onSubmit={handleSubmitEndorsement} className="p-5 space-y-4 overflow-y-auto">
            <div className="border-b border-slate-100 pb-2">
              <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                <Plane className="w-4 h-4 text-[#0057B8]" />
                <span>Travel & Medical Quota Manual Verification</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Upload your physical/scanned Passport, Visa, and NID files for approval
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Passport Number *</label>
                <input
                  type="text"
                  placeholder="e.g. A09823145"
                  value={passportNum}
                  onChange={(e) => setPassportNum(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0057B8] font-mono text-slate-800 uppercase"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">National ID (NID) *</label>
                <input
                  type="text"
                  placeholder="e.g. 19942691234567890"
                  value={nidNum}
                  onChange={(e) => setNidNum(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0057B8] font-mono text-slate-800"
                  required
                />
              </div>

              {/* Real Manual Upload slots */}
              <div className="space-y-2 pt-1">
                <label className="font-bold text-slate-700 block">
                  Manual Document Uploads (PDF / JPG / PNG):
                </label>

                {/* 1. Passport Upload */}
                <label className="p-3 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 flex items-center justify-between cursor-pointer transition">
                  <div className="flex items-center gap-2 truncate">
                    <Upload className="w-4 h-4 text-blue-600 shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-slate-800 text-[11px]">
                        {passportFile ? passportFile.name : 'Upload Passport Copy (Required)'}
                      </p>
                      <p className="text-[9px] text-slate-500">
                        {passportFile ? `${(passportFile.size / 1024).toFixed(1)} KB` : 'Click to browse device file'}
                      </p>
                    </div>
                  </div>
                  {passportFile ? (
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                      Uploaded
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full shrink-0">
                      Select File
                    </span>
                  )}
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handlePassportFileChange}
                    className="hidden"
                  />
                </label>

                {/* 2. Visa Upload */}
                <label className="p-3 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 flex items-center justify-between cursor-pointer transition">
                  <div className="flex items-center gap-2 truncate">
                    <Upload className="w-4 h-4 text-blue-600 shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-slate-800 text-[11px]">
                        {visaFile ? visaFile.name : 'Upload Valid Visa / Ticket (Required)'}
                      </p>
                      <p className="text-[9px] text-slate-500">
                        {visaFile ? `${(visaFile.size / 1024).toFixed(1)} KB` : 'Click to browse device file'}
                      </p>
                    </div>
                  </div>
                  {visaFile ? (
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                      Uploaded
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full shrink-0">
                      Select File
                    </span>
                  )}
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleVisaFileChange}
                    className="hidden"
                  />
                </label>

                {/* 3. NID Upload */}
                <label className="p-3 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 flex items-center justify-between cursor-pointer transition">
                  <div className="flex items-center gap-2 truncate">
                    <Upload className="w-4 h-4 text-blue-600 shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-slate-800 text-[11px]">
                        {nidFile ? nidFile.name : 'Upload National ID (Optional)'}
                      </p>
                      <p className="text-[9px] text-slate-500">
                        {nidFile ? `${(nidFile.size / 1024).toFixed(1)} KB` : 'Smart NID card photo'}
                      </p>
                    </div>
                  </div>
                  {nidFile ? (
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
                    onChange={handleNidFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {uploadError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifyingEndorsement}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:opacity-95 text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isVerifyingEndorsement ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Uploaded Documents via Bank Node...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Submit Documents & Unlock $1,000 Quota</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ========================================================= */}
        {/* STEP 2: THE INTERNATIONAL QR SCANNER WITH REAL SCANNABLE QR */}
        {/* ========================================================= */}
        {step === 'scanner' && (
          <div className="p-5 space-y-4 overflow-y-auto">
            {/* Endorsement Quota Badge */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Quota Approved: $1,000 / 120,000 BDT</span>
              </div>
              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            {/* REAL SCANNABLE QR CODE DISPLAY OR CAMERA VIEW */}
            <div className="relative aspect-square max-w-[260px] mx-auto rounded-3xl overflow-hidden bg-slate-900 border-2 border-slate-800 flex items-center justify-center shadow-xl">
              <img
                src={realInternationalQrUrl}
                alt="Real Scannable International UPI QR Code"
                className="w-full h-full object-contain p-4 bg-white"
              />

              {/* Corner markers */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg pointer-events-none" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-4 border-r-4 border-cyan-400 rounded-br-lg pointer-events-none" />

              {/* Animated laser scan line */}
              <div className="absolute inset-x-3 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-bounce pointer-events-none" style={{ top: '48%' }} />
            </div>

            <p className="text-center text-[11px] font-bold text-slate-500">
              Real Scannable NIPL UPI QR Code (Apollo Pharmacy ₹5,000 INR)
            </p>

            {/* Manual QR Image Upload */}
            <div>
              <label className="w-full py-2.5 px-3 rounded-xl border border-dashed border-blue-400 bg-blue-50/50 hover:bg-blue-50 text-blue-800 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition">
                <Upload className="w-4 h-4 text-[#0057B8]" />
                <span>Upload Foreign QR Code Image Manually</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleManualForeignQrUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Quick Demo Scan Targets */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <p className="text-[11px] font-black uppercase text-slate-500 tracking-wider text-center">
                Tap to Simulate Scanned Payload:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSimulateScan('india')}
                  className="p-3 rounded-2xl border-2 border-indigo-200 hover:border-indigo-500 bg-indigo-50/50 hover:bg-indigo-50 text-left transition group active:scale-95 shadow-xs"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-base">🇮🇳</span>
                    <span className="text-xs font-black text-indigo-900">Apollo Pharmacy</span>
                  </div>
                  <p className="text-[10px] font-bold text-indigo-700">₹5,000 INR (NIPL UPI)</p>
                  <span className="text-[9px] text-slate-500 block mt-0.5">Chennai, India</span>
                </button>

                <button
                  onClick={() => handleSimulateScan('uae')}
                  className="p-3 rounded-2xl border-2 border-amber-200 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-50 text-left transition group active:scale-95 shadow-xs"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-base">🇦🇪</span>
                    <span className="text-xs font-black text-amber-900">Carrefour Dubai</span>
                  </div>
                  <p className="text-[10px] font-bold text-amber-700">220 AED (Network Int.)</p>
                  <span className="text-[9px] text-slate-500 block mt-0.5">Dubai, UAE</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3: CONVERSION & CONFIRMATION MODAL */}
        {/* ========================================================= */}
        {step === 'confirm' && (
          <form onSubmit={handleConfirmPayment} className="p-5 space-y-4 overflow-y-auto">
            <div className="text-center pb-2 border-b border-slate-100">
              <span className="text-2xl mb-1 block">{scannedPayload.flag}</span>
              <h3 className="text-base font-black text-slate-900">{scannedPayload.merchantName}</h3>
              <p className="text-xs text-slate-500 font-medium">
                {scannedPayload.country} • {scannedPayload.network}
              </p>
            </div>

            {/* Conversion Breakdown Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-blue-100 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Bill in Foreign Currency:</span>
                <span className="font-black text-slate-800 text-sm">
                  {scannedPayload.currencySymbol}{scannedPayload.foreignAmount} {scannedPayload.foreignCurrency}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Live Exchange Rate:</span>
                <span className="font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full text-[10px]">
                  1 {scannedPayload.foreignCurrency} = {scannedPayload.exchangeRate} BDT
                </span>
              </div>
              <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Total Payable in BDT:</span>
                  <span className="text-[10px] text-slate-500">Deducted from Opay Wallet</span>
                </div>
                <span className="text-xl font-black text-[#0057B8]">
                  {formatBdt(scannedPayload.bdtPayable, lang)}
                </span>
              </div>
            </div>

            {/* PIN entry */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Enter 4-Digit Opay PIN:</span>
                <span className="text-[10px] text-slate-400">Demo PIN: Any 4 digits</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-full pl-9 pr-3 py-2.5 text-center tracking-[0.5em] text-lg font-black rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
                />
              </div>
              {pinError && <p className="text-xs font-bold text-rose-600 mt-1">{pinError}</p>}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('scanner')}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessingPay}
                className="flex-2 py-3 bg-gradient-to-r from-emerald-600 to-[#0057B8] hover:opacity-95 text-white text-xs font-black rounded-xl shadow-md transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isProcessingPay ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Gateway...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>Confirm & Pay {formatBdt(scannedPayload.bdtPayable, lang)}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* STEP 4: DETAILED RECEIPT & SIMULATED SETTLEMENT */}
        {/* ========================================================= */}
        {step === 'receipt' && receiptData && (
          <div className="p-5 space-y-4 overflow-y-auto">
            {/* Success icon */}
            <div className="text-center pt-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 shadow-inner">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-base font-black text-slate-900">Payment Successful!</h3>
              <p className="text-xs text-slate-500 font-mono">{receiptData.txnId}</p>
            </div>

            {/* Receipt card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs space-y-2.5">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Merchant:</span>
                <span className="font-extrabold text-slate-800 text-right">{receiptData.merchant}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Country & Gateway:</span>
                <span className="font-bold text-slate-700">{receiptData.country} ({receiptData.network})</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Foreign Currency Delivered:</span>
                <span className="font-black text-emerald-700">{receiptData.foreignDelivered}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">BDT Deducted from Opay:</span>
                <span className="font-black text-rose-700">-{formatBdt(receiptData.bdtDeducted, lang)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Exchange Rate Applied:</span>
                <span className="font-mono text-slate-700">1 INR = {receiptData.exchangeRate} BDT</span>
              </div>
            </div>

            {/* Mandatory presentation footer note */}
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] flex items-start gap-2">
              <Building className="w-4 h-4 text-[#0057B8] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Official Settlement Proof:</span>
                <span className="text-blue-800 font-semibold">{receiptData.settlementNote}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  sound.playTap();
                  setStep('scanner');
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Scan Another QR
              </button>
              <button
                onClick={() => {
                  sound.playTap();
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#0057B8] text-white text-xs font-black shadow-xs hover:bg-[#004ca0]"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
