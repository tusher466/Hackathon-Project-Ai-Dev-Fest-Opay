import React, { useState, useEffect } from 'react';
import {
  Clock,
  Cloud,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  FileText,
  Upload,
  ArrowRight,
  Lock,
  XCircle,
  HelpCircle,
  Undo2,
  FileCheck
} from 'lucide-react';
import { EscrowHoldItem, Language } from '../types';
import { formatBdt, formatDuration } from '../utils/formatters';
import { sound } from '../utils/audio';

interface EscrowVaultProps {
  escrowItems: EscrowHoldItem[];
  lang: Language;
  onApproveEscrow: (item: EscrowHoldItem) => void;
  onRecallEscrow: (
    item: EscrowHoldItem,
    proofData: { reason: string; evidenceText: string; caseNumber: string }
  ) => void;
  onNewSendMoney: () => void;
}

export const EscrowVault: React.FC<EscrowVaultProps> = ({
  escrowItems,
  lang,
  onApproveEscrow,
  onRecallEscrow,
  onNewSendMoney,
}) => {
  const [selectedDisputeItem, setSelectedDisputeItem] = useState<EscrowHoldItem | null>(null);
  const [disputeReason, setDisputeReason] = useState('Scam / Phishing Pattern Detected by AI Shield');
  const [evidenceText, setEvidenceText] = useState('');
  const [uploadedEvidenceFile, setUploadedEvidenceFile] = useState<File | null>(null);
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);
  const [successRecallDocket, setSuccessRecallDocket] = useState<string | null>(null);

  const activeHoldingItems = escrowItems.filter((i) => i.status === 'holding');
  const pastItems = escrowItems.filter((i) => i.status !== 'holding');

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDisputeItem) return;

    setIsSubmittingProof(true);
    sound.playTap();

    const caseNumber = `BD-FRAUD-${Math.floor(100000 + Math.random() * 900000)}`;

    setTimeout(() => {
      onRecallEscrow(selectedDisputeItem, {
        reason: disputeReason,
        evidenceText: evidenceText || 'Evidence verified against Bangladesh MFS Fraud Registry',
        caseNumber,
      });
      setIsSubmittingProof(false);
      setSuccessRecallDocket(caseNumber);
      sound.playSuccess();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Cloud Sync & Safe-Hold Escrow */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-xs font-bold text-amber-300">
              <Cloud className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              <span>Bank Cloud Storage Sync • 2-Min Anti-Fraud Escrow</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {lang === 'bn'
                ? '২ মিনিটের সেইফ-হোল্ড ক্লাউড ভল্ট'
                : '2-Minute Safe-Hold Escrow Vault'}
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              {lang === 'bn'
                ? 'টাকা পাঠানোর পর ২ মিনিট সময় ক্লাউড ভল্টে জমা থাকে। প্রাপকের কাছে পাঠানোর আগে পুনরায় বায়োমেট্রিক কনফার্মেশন প্রয়োজন। যদি কোনো জালিয়াতি বা স্ক্যাম ধরা পড়ে, প্রমাণ দিয়ে সাথে সাথে ১০০% টাকা রিফান্ড নেওয়া যায়।'
                : 'All transfers routed through Safe-Hold remain in our cloud escrow for 2 minutes. Requires explicit re-confirmation for final release. If fraud is uncovered, recall your money instantly with evidence.'}
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Cloud Storage Sync: Encrypted</span>
            </div>
            <p className="text-2xl font-black text-amber-400">
              {activeHoldingItems.length}
            </p>
            <p className="text-xs text-slate-400">Transactions currently in 2-min hold</p>
          </div>
        </div>
      </div>

      {/* Active Holding Transactions List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {lang === 'bn' ? 'চলমান হোল্ড ট্রানজেকশন (২ মিনিট)' : 'Active Escrow Holds (Awaiting Final Release)'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'bn'
                ? 'সময় শেষ হওয়ার আগে ফাইনাল অ্যাপ্রুভাল দিন অথবা প্রতারণা শনাক্ত হলে টাকা ব্যাক নিন'
                : 'Re-confirm before timer elapses, or recall funds with proof if suspicious'}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            <span>02:00 Auto-Hold Window</span>
          </span>
        </div>

        {activeHoldingItems.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">No active escrow holds</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When you send money with the 2-minute safe-hold escrow enabled, transactions appear here with a live countdown.
            </p>
            <button
              onClick={onNewSendMoney}
              className="px-4 py-2 bg-[#0057B8] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
            >
              Send Money with 2-Min Hold
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {activeHoldingItems.map((item) => {
              const progressPct = ((item.totalDurationSeconds - item.remainingSeconds) / item.totalDurationSeconds) * 100;
              const isHighRisk = item.riskScore >= 60;

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isHighRisk
                      ? 'border-rose-300 bg-rose-50/30'
                      : 'border-amber-200 bg-amber-50/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500">
                          {item.id}
                        </span>
                        {isHighRisk && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold uppercase">
                            High Scam Risk ({item.riskScore}%)
                          </span>
                        )}
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Cloud className="w-3 h-3 text-emerald-600" />
                          <span>Cloud Synced</span>
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 mt-1">
                        To: {item.recipientName} ({item.recipientNumber})
                      </h4>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xs font-bold text-slate-500">Hold Amount</p>
                      <p className="text-2xl font-black text-slate-900">
                        {formatBdt(item.amount, lang)}
                      </p>
                    </div>
                  </div>

                  {/* Countdown Progress Bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Remaining Safe-Hold Window:</span>
                      </span>
                      <span className="font-mono text-amber-600 text-sm">
                        {formatDuration(item.remainingSeconds)} left of 02:00
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-1000"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Scam flag warning if any */}
                  {item.matchedScamFlag && (
                    <div className="p-3 mb-4 rounded-xl bg-rose-100/70 border border-rose-200 text-rose-900 text-xs font-medium flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{item.matchedScamFlag}</span>
                    </div>
                  )}

                  {/* Two Main Core Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-200/60">
                    {/* Approve / Final Release Button */}
                    <button
                      onClick={() => onApproveEscrow(item)}
                      className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow transition flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-200" />
                      <span>
                        {lang === 'bn' ? 'ফাইনাল অনুমোদন ও রিলিজ' : 'Re-Confirm & Release Funds'}
                      </span>
                    </button>

                    {/* Fraud Recall Button */}
                    <button
                      onClick={() => {
                        sound.playTap();
                        setSelectedDisputeItem(item);
                        setSuccessRecallDocket(null);
                      }}
                      className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow transition flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>
                        {lang === 'bn' ? 'প্রতারণা দাবি ও টাকা ব্যাক নিন' : 'Recall Money with Fraud Proof'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FRAUD PROOF & MONEY BACK DISPUTE MODAL */}
      {selectedDisputeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-rose-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="text-lg font-bold">
                    {lang === 'bn' ? 'প্রতারণা প্রমাণ জমা ও টাকা ফেরত' : 'Recall Money with Fraud Evidence'}
                  </h3>
                  <p className="text-xs text-rose-100">
                    Escrow Safe-Hold Cancellation & Immediate 100% Refund
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDisputeItem(null)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            {successRecallDocket ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-black text-slate-900">
                  {lang === 'bn' ? 'টাকা সফলভাবে ফেরত এসেছে!' : '100% Refund Completed!'}
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  {formatBdt(selectedDisputeItem.amount, lang)} has been recalled from escrow and credited back to your Upay MFS cash balance.
                </p>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-1 font-mono text-xs">
                  <p className="text-slate-500 font-bold uppercase">Official Case Docket</p>
                  <p className="text-sm font-bold text-blue-600">{successRecallDocket}</p>
                  <p className="text-slate-500">
                    Forwarded to Bangladesh Police Cyber Security Division & BTRC Registry.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDisputeItem(null)}
                  className="w-full py-3 bg-[#0057B8] text-white font-bold rounded-xl text-sm shadow"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleDisputeSubmit} className="p-6 space-y-4 overflow-y-auto">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                  Holding: <span className="font-bold">{formatBdt(selectedDisputeItem.amount, lang)}</span> to{' '}
                  <span className="font-bold">{selectedDisputeItem.recipientNumber}</span> ({selectedDisputeItem.recipientName}). Providing proof will instantly freeze the recipient's payout and recall funds back to your wallet.
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Select Fraud Category / Reason
                  </label>
                  <select
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
                  >
                    <option value="Scam / Phishing Pattern Detected by AI Shield">
                      AI Shield detected fraudulent phishing pattern
                    </option>
                    <option value="Fake Online Shop Seller Blocked Me">
                      Fake Facebook/Instagram seller blocked me after prepayment
                    </option>
                    <option value="Lottery / Prize Claim Social Engineering">
                      Caller tricked me into sending fee for fake prize
                    </option>
                    <option value="Coercive Accidental Transfer Trap">
                      Accidental transfer blackmail / pressure trap
                    </option>
                    <option value="Authority Impersonation (Bank/Police)">
                      Impersonator claiming to be Bank Inspector or Police
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Describe Evidence / Scam Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter details of what the scammer asked for or copy the phishing SMS/call transcript..."
                    value={evidenceText}
                    onChange={(e) => setEvidenceText(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none"
                    required
                  />
                </div>

                {/* Real manual file/screenshot/audio attachment */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Attach Screenshot / Audio Recording Proof (Browse Device)
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 text-xs cursor-pointer transition">
                    <Upload className="w-5 h-5 text-blue-600 shrink-0" />
                    <div className="flex-1 truncate">
                      <p className="font-bold text-slate-800">
                        {uploadedEvidenceFile ? uploadedEvidenceFile.name : 'Upload Screenshot / Audio Recording / Police GD File'}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {uploadedEvidenceFile
                          ? `${(uploadedEvidenceFile.size / 1024).toFixed(1)} KB • Ready for encrypted police audit`
                          : 'Click to select file from your computer or phone'}
                      </p>
                    </div>
                    {uploadedEvidenceFile ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                        File Attached
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md shrink-0">
                        Browse
                      </span>
                    )}
                    <input
                      type="file"
                      accept="image/*,audio/*,.pdf"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setUploadedEvidenceFile(e.target.files[0]);
                          sound.playTap();
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 space-y-1">
                  <p className="font-bold text-slate-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Upay Anti-Fraud Escrow Guarantee:</span>
                  </p>
                  <p>
                    Funds are immediately credited back to your balance. The recipient will be flagged in the central MFS fraud blacklist.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingProof}
                  className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  {isSubmittingProof ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>Verifying Proof & Recalling Funds...</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      <span>Submit Proof & Reclaim 100% Money Back</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
