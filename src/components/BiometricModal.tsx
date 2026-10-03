import React, { useState, useEffect } from 'react';
import { Fingerprint, Scan, ShieldCheck, CheckCircle2, Lock, X, Timer } from 'lucide-react';
import { sound } from '../utils/audio';
import { Language } from '../types';

interface BiometricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  actionTitle: string;
  actionTitleBn: string;
  amount?: number;
  currency?: string;
  lang: Language;
}

export const BiometricModal: React.FC<BiometricModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  actionTitle,
  actionTitleBn,
  amount,
  currency = 'BDT',
  lang,
}) => {
  const [authMethod, setAuthMethod] = useState<'fingerprint' | 'face' | 'pin'>('fingerprint');
  const [pin, setPin] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setScanning(false);
      setScanProgress(0);
      setSecondsRemaining(5);
      setAuthSuccess(false);
      setErrorMsg('');
      startBiometricScan();
    }
  }, [isOpen, authMethod]);

  const startBiometricScan = () => {
    if (authMethod === 'pin') return;
    setScanning(true);
    setScanProgress(0);
    setSecondsRemaining(5);
    setErrorMsg('');
    sound.playBiometricScan();

    const totalDurationMs = 5000; // Exact 5 seconds
    const intervalMs = 100;
    const increment = (intervalMs / totalDurationMs) * 100;

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + increment;
        const currentSecs = Math.max(1, Math.ceil(5 - (next / 100) * 5));
        setSecondsRemaining(currentSecs);

        if (next >= 100) {
          clearInterval(interval);
          setSecondsRemaining(0);
          setScanning(false);
          setAuthSuccess(true);
          sound.playSuccess();
          setTimeout(() => {
            onSuccess();
          }, 600);
          return 100;
        }
        return next;
      });
    }, intervalMs);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 4) {
      sound.playSuccess();
      setAuthSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 600);
    } else {
      setErrorMsg(lang === 'bn' ? '৪ সংখ্যার গোপন পিন দিন' : 'Enter 4-digit secret PIN');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl">
        {/* Header gradient banner */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-amber-400" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 text-center space-y-5">
          {/* Title & amount info */}
          <div className="space-y-1 mt-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-bold border border-blue-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Opay Biometric Security Protocol</span>
            </div>
            <h3 className="text-base font-extrabold text-white">
              {lang === 'bn' ? actionTitleBn : actionTitle}
            </h3>
            {amount !== undefined && (
              <p className="text-2xl font-black text-amber-400 font-mono">
                ৳ {amount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
              </p>
            )}
          </div>

          {/* Biometric Method Tabs */}
          <div className="flex p-1 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs font-bold">
            <button
              onClick={() => setAuthMethod('fingerprint')}
              className={`flex-1 py-2 rounded-xl transition ${
                authMethod === 'fingerprint' ? 'bg-[#0057B8] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Touch ID
            </button>
            <button
              onClick={() => setAuthMethod('face')}
              className={`flex-1 py-2 rounded-xl transition ${
                authMethod === 'face' ? 'bg-[#0057B8] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Face ID
            </button>
            <button
              onClick={() => setAuthMethod('pin')}
              className={`flex-1 py-2 rounded-xl transition ${
                authMethod === 'pin' ? 'bg-[#0057B8] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              PIN
            </button>
          </div>

          {/* Interactive 5-Second Scanner View */}
          {authMethod !== 'pin' ? (
            <div className="py-2 space-y-4">
              <div
                onClick={startBiometricScan}
                className="relative mx-auto w-32 h-32 rounded-3xl bg-slate-800/90 border-2 border-slate-700 flex items-center justify-center cursor-pointer overflow-hidden group shadow-lg"
              >
                {/* 5-second animated radial pulse */}
                {scanning && (
                  <>
                    <div className="absolute inset-0 bg-cyan-500/10 animate-pulse" />
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00E5FF] animate-bounce" />
                  </>
                )}

                {authSuccess ? (
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-scale-up" />
                ) : authMethod === 'fingerprint' ? (
                  <Fingerprint className={`w-16 h-16 transition-all duration-300 ${scanning ? 'text-cyan-400 animate-pulse scale-105' : 'text-slate-400 group-hover:text-slate-200'}`} />
                ) : (
                  <Scan className={`w-16 h-16 transition-all duration-300 ${scanning ? 'text-cyan-400 animate-pulse scale-105' : 'text-slate-400 group-hover:text-slate-200'}`} />
                )}
              </div>

              {/* 5-Second Countdown & Progress Meter */}
              {scanning ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-cyan-300">
                    <Timer className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Verifying {authMethod === 'face' ? 'Face ID' : 'Touch ID'} ({secondsRemaining}s)...</span>
                  </div>

                  <div className="w-48 mx-auto h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-400 transition-all duration-100 ease-linear rounded-full"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">Keep finger / face still for 5 seconds</p>
                </div>
              ) : authSuccess ? (
                <div className="text-xs font-black text-emerald-400 animate-fade-in flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Biometric Verified Successfully!</span>
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  Tap sensor to begin 5-second secure verification
                </p>
              )}
            </div>
          ) : (
            /* PIN fallback */
            <form onSubmit={handlePinSubmit} className="py-2 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Enter 4-Digit Opay Secret PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-40 mx-auto p-3 text-center text-2xl font-mono tracking-widest font-black rounded-2xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  autoFocus
                />
              </div>

              {errorMsg && (
                <p className="text-xs font-bold text-rose-400">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={pin.length !== 4}
                className="w-full py-3 rounded-2xl bg-[#0057B8] hover:bg-[#004ca0] disabled:opacity-40 text-white font-extrabold text-sm shadow-md transition"
              >
                Confirm PIN & Complete
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-slate-800 flex items-center justify-center gap-2 text-[10px] text-slate-500">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>FIDO2 WebAuthn & Hardware-backed Security Zone</span>
          </div>
        </div>
      </div>
    </div>
  );
};
