import React, { useState } from 'react';
import {
  User,
  Phone,
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Key,
  Calendar,
  Building2,
  FileText,
  AlertCircle,
  Eye,
  EyeOff,
  Clock,
  Sparkles
} from 'lucide-react';
import { Language } from '../types';
import { sound } from '../utils/audio';
import { formatBdt } from '../utils/formatters';

interface AccountProfileViewProps {
  userName: string;
  userPhone: string;
  balance: number;
  lang: Language;
  onOpenEscrow: () => void;
  onOpenShield: () => void;
}

export const AccountProfileView: React.FC<AccountProfileViewProps> = ({
  userName,
  userPhone,
  balance,
  lang,
  onOpenEscrow,
  onOpenShield,
}) => {
  const [showPinModal, setShowPinModal] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  const [pinError, setPinError] = useState('');

  const [cards, setCards] = useState([
    { id: 'c1', type: 'Visa Debit Card', bank: 'UCB Bank', number: '•••• •••• •••• 4102', expiry: '08/28', status: 'Primary' },
    { id: 'c2', type: 'Opay Co-Branded Card', bank: 'Opay Prepaid', number: '•••• •••• •••• 8839', expiry: '11/29', status: 'Active' },
  ]);

  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardName, setNewCardName] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');

  const handlePinChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPin.length !== 4) {
      setPinError('Current PIN must be 4 digits');
      return;
    }
    if (newPin.length !== 4) {
      setPinError('New PIN must be 4 digits');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('New PIN and confirmation PIN do not match');
      return;
    }

    setPinError('');
    setPinSuccess(true);
    sound.playSuccess();
    setTimeout(() => {
      setShowPinModal(false);
      setPinSuccess(false);
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
    }, 1800);
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCardNumber.length < 16) return;
    const last4 = newCardNumber.slice(-4);
    setCards((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        type: 'Visa Debit Card',
        bank: newCardName || 'Commercial Bank',
        number: `•••• •••• •••• ${last4}`,
        expiry: newCardExpiry || '12/29',
        status: 'Active',
      },
    ]);
    sound.playSuccess();
    setShowAddCard(false);
    setNewCardNumber('');
    setNewCardName('');
    setNewCardExpiry('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 select-none">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#0057B8] text-white flex items-center justify-center font-black text-xl shadow-md">
              {userName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">{userName}</h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified Tier-2
                </span>
              </div>
              <p className="text-sm font-bold text-slate-600 font-mono mt-0.5">{userPhone}</p>
            </div>
          </div>

          <div className="sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Available Balance</span>
            <p className="text-2xl font-black text-[#0057B8] font-mono">{formatBdt(balance, lang)}</p>
          </div>
        </div>

        {/* NID Details Section */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-[#0057B8]" />
              <span>National Identity (NID) Details</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              EC Bangladesh Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-400 font-bold block text-[10px]">Smart NID Number</span>
              <span className="font-mono font-bold text-slate-900">8291039482103</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-400 font-bold block text-[10px]">Father's Name</span>
              <span className="font-bold text-slate-900">Md. Rafiqul Islam</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-400 font-bold block text-[10px]">Date of Birth</span>
              <span className="font-mono font-bold text-slate-900">14 August 1996</span>
            </div>
          </div>
        </div>

        {/* Added Cards Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
              <CreditCard className="w-4 h-4 text-[#0057B8]" />
              <span>Linked Debit & Prepaid Cards</span>
            </div>
            <button
              onClick={() => setShowAddCard(true)}
              className="text-xs font-bold text-[#0057B8] hover:text-blue-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cards.map((card) => (
              <div
                key={card.id}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-sm space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300">{card.type}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                    {card.status}
                  </span>
                </div>
                <p className="font-mono text-base tracking-widest text-slate-200 font-bold">{card.number}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                  <span>{card.bank}</span>
                  <span>Exp: {card.expiry}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Change PIN Action */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-slate-700">
              Account Security: FaceID & 2-Minute Escrow Active
            </span>
          </div>

          <button
            onClick={() => {
              sound.playTap();
              setShowPinModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#0057B8] hover:bg-[#004ca0] text-white font-extrabold text-xs shadow-md transition flex items-center gap-2"
          >
            <Key className="w-3.5 h-3.5 text-amber-300" />
            <span>Change 4-Digit Security PIN</span>
          </button>
        </div>
      </div>

      {/* Change PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#0057B8]" />
                <h3 className="text-base font-extrabold text-slate-900">Change Opay PIN</h3>
              </div>
              <button
                onClick={() => setShowPinModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                ✕
              </button>
            </div>

            {pinSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-base font-black text-slate-900">PIN Changed Successfully!</h4>
                <p className="text-xs text-slate-500">Your new 4-digit PIN is active across all devices.</p>
              </div>
            ) : (
              <form onSubmit={handlePinChangeSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current 4-Digit PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-center text-lg font-mono tracking-widest font-black"
                    placeholder="••••"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">New 4-Digit PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-center text-lg font-mono tracking-widest font-black"
                    placeholder="••••"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-center text-lg font-mono tracking-widest font-black"
                    placeholder="••••"
                    required
                  />
                </div>

                {pinError && (
                  <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2 rounded-lg border border-rose-200">
                    {pinError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0057B8] hover:bg-blue-700 text-white font-black text-sm shadow-md transition"
                >
                  Confirm & Update PIN
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Link Debit / Credit Card</h3>
              <button onClick={() => setShowAddCard(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCardSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
                <input
                  type="text"
                  maxLength={19}
                  placeholder="1234 5678 9012 3456"
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-mono font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  placeholder="e.g. City Bank / Brac Bank"
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Expiry (MM/YY)</label>
                <input
                  type="text"
                  maxLength={5}
                  placeholder="08/29"
                  value={newCardExpiry}
                  onChange={(e) => setNewCardExpiry(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-mono font-semibold"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0057B8] hover:bg-blue-700 text-white font-black text-sm shadow-md transition"
              >
                Save & Link Card
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
