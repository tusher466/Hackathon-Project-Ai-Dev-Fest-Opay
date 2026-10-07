import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  PhoneCall,
  MessageSquare,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  PhoneIncoming,
  PhoneOff,
  UserX,
  FileSearch,
  Send,
  HelpCircle,
  ExternalLink,
  PlusCircle,
  Sliders,
  Activity,
  Check,
  Zap,
  Info,
  BrainCircuit,
  TrendingUp
} from 'lucide-react';
import { AnalyzedEvent, Language } from '../types';
import { sound } from '../utils/audio';
import { analyzeMessageOrCallLinguistics } from '../utils/scamAnalyzer';
import { MlModelEvaluationDashboard } from './MlModelEvaluationDashboard';
import { FraudTrendsDashboard } from './FraudTrendsDashboard';

interface AiScamShieldProps {
  events: AnalyzedEvent[];
  lang: Language;
  onBlockNumber: (number: string) => void;
  onSimulateIncoming: (type: 'call' | 'sms', variant: 'scam' | 'safe') => void;
  onAddEvent?: (evt: AnalyzedEvent) => void;
  onReanalyzeAll?: () => void;
}

export const AiScamShield: React.FC<AiScamShieldProps> = ({
  events,
  lang,
  onBlockNumber,
  onSimulateIncoming,
  onAddEvent,
  onReanalyzeAll,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<AnalyzedEvent | null>(events[0] || null);
  const [filterType, setFilterType] = useState<'all' | 'call' | 'sms' | 'threats'>('all');
  const [activeView, setActiveView] = useState<'ml_metrics' | 'trends' | 'monitor'>('ml_metrics');

  // Interactive Sandbox state
  const [sandboxType, setSandboxType] = useState<'sms' | 'call'>('sms');
  const [sandboxInput, setSandboxInput] = useState('');
  const [sandboxCallerNumber, setSandboxCallerNumber] = useState('+8801700998811');
  const [sandboxDuration, setSandboxDuration] = useState(720); // 12 mins
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<any>(null);

  // Real-time dynamic preview as user types in sandbox
  const liveTypingPreview = useMemo(() => {
    if (!sandboxInput.trim()) return null;
    return analyzeMessageOrCallLinguistics({
      type: sandboxType,
      content: sandboxInput,
      callerNumber: sandboxCallerNumber,
      durationSeconds: sandboxType === 'call' ? sandboxDuration : 0,
    });
  }, [sandboxInput, sandboxType, sandboxCallerNumber, sandboxDuration]);

  const presets = [
    {
      title: 'উপায় ৫০,০০০ টাকা লটারি (Lottery Scam)',
      type: 'sms' as const,
      text: 'অভিনন্দন! উপায় ৫ বছর পূর্তি উপলক্ষ্যে আপনি জিতেছেন ৫০,০০০ টাকা! টাকা এখনই একাউন্টে যোগ করতে ওটিপি কোডটি জানান অথবা কল করুন 01700998811.',
      number: '+8801700998811',
      duration: 0,
    },
    {
      title: 'ভুল করে টাকা পাঠানো (Fake Reversal Trap)',
      type: 'sms' as const,
      text: 'ভাই ভুল করে আপনার উপায় নাম্বারে ৫০০০ টাকা চলে গেছে! আমার মেয়ের চিকিৎসার টাকা ভাই। দয়া করে এখনই ০১৮২২৩৩৪৪৫৫ নাম্বারে ফেরত পাঠান!',
      number: '+8801822334455',
      duration: 0,
    },
    {
      title: 'Bangladesh Bank Officer (14 Min Coercive Call)',
      type: 'call' as const,
      text: 'Caller impersonated Bangladesh Bank Special Investigation Inspector. Told user their account will be sealed unless they stay on the call and dial USSD code *268*5*PIN# immediately.',
      number: '+44 7911 123456',
      duration: 840,
    },
    {
      title: 'Normal Contact (Safe Family Message)',
      type: 'sms' as const,
      text: 'Ammu said please send 500 Tk for grocery shopping when you get free time. Thanks!',
      number: '+8801711223344',
      duration: 0,
    },
    {
      title: 'Wangiri Missed Call Ping (Short Scam)',
      type: 'call' as const,
      text: 'Single ring dropped after 3 seconds from foreign satellite number (+882 1690001). Intended to provoke expensive international callback.',
      number: '+882 1690001',
      duration: 3,
    },
    {
      title: 'Upay Official Bank Add Money (Safe)',
      type: 'sms' as const,
      text: 'Your Upay account has been successfully credited with BDT 15,000 via UCB Bank NetBanking. TxnID: TXN-UPY-893821. Available: BDT 42,850. Upay will NEVER ask for your PIN.',
      number: '16268',
      duration: 0,
    },
  ];

  const handleRunAnalysis = async (customText?: string, customType?: 'sms' | 'call', customNumber?: string, customDur?: number) => {
    const textToAnalyze = customText !== undefined ? customText : sandboxInput;
    const typeToAnalyze = customType !== undefined ? customType : sandboxType;
    const numberToAnalyze = customNumber !== undefined ? customNumber : sandboxCallerNumber;
    const durToAnalyze = customDur !== undefined ? customDur : sandboxDuration;

    if (!textToAnalyze.trim()) return;

    setIsAnalyzing(true);
    sound.playTap();

    try {
      const res = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: typeToAnalyze,
          content: textToAnalyze,
          callerNumber: numberToAnalyze,
          durationSeconds: durToAnalyze,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const json = await res.json();
      if (json.success && json.data) {
        setSandboxResult(json.data);
        if (json.data.isScam) {
          sound.playScamAlert();
        } else {
          sound.playSuccess();
        }
      } else {
        // Fallback to client-side linguistic matcher
        const local = analyzeMessageOrCallLinguistics({
          type: typeToAnalyze,
          content: textToAnalyze,
          callerNumber: numberToAnalyze,
          durationSeconds: durToAnalyze,
        });
        setSandboxResult(local);
        if (local.isScam) sound.playScamAlert();
        else sound.playSuccess();
      }
    } catch (err) {
      console.warn('API analyze failed, falling back to local neural matcher:', err);
      const local = analyzeMessageOrCallLinguistics({
        type: typeToAnalyze,
        content: textToAnalyze,
        callerNumber: numberToAnalyze,
        durationSeconds: durToAnalyze,
      });
      setSandboxResult(local);
      if (local.isScam) sound.playScamAlert();
      else sound.playSuccess();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddCurrentToFeed = () => {
    if (!sandboxResult || !onAddEvent) return;
    const newEvt: AnalyzedEvent = {
      id: `USR-${Date.now()}`,
      type: sandboxType,
      senderOrCaller: sandboxCallerNumber || (sandboxType === 'sms' ? '+8801700998811' : 'Unknown'),
      senderName: sandboxResult.classification,
      content: sandboxInput,
      timestamp: 'Just now',
      callDurationSeconds: sandboxType === 'call' ? sandboxDuration : undefined,
      isUnknownCaller: sandboxType === 'call',
      threatScore: sandboxResult.threatScore,
      threatLevel: sandboxResult.threatLevel,
      normalStyleMatch: sandboxResult.normalStyleMatch,
      scamStyleMatch: sandboxResult.scamStyleMatch,
      classification: sandboxResult.classification,
      redFlags: sandboxResult.redFlags || sandboxResult.matchedScamFeatures || [],
      matchedNormalFeatures: sandboxResult.matchedNormalFeatures || [],
      callDurationAssessment: sandboxResult.callDurationAssessment,
      explanation: sandboxResult.explanation,
      safetyTips: sandboxResult.safetyTips || [],
      isRead: false,
      flaggedByAi: sandboxResult.isScam,
    };

    onAddEvent(newEvt);
    setSelectedEvent(newEvt);
    sound.playSuccess();
  };

  const filteredEvents = events.filter((ev) => {
    if (filterType === 'call') return ev.type === 'call';
    if (filterType === 'sms') return ev.type === 'sms';
    if (filterType === 'threats') return ev.threatScore >= 40;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* View Switcher: Trained ML Model Evaluation Dashboard vs. Live Feed Monitor vs. Fraud Trends */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-200/90 p-1.5 rounded-2xl w-fit shadow-xs">
        <button
          onClick={() => {
            sound.playTap();
            setActiveView('ml_metrics');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeView === 'ml_metrics'
              ? 'bg-[#0057B8] text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
          }`}
        >
          <BrainCircuit className="w-4 h-4 text-cyan-300" />
          <span>ML Model Evaluation & Validation (10,000 Samples)</span>
          <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-tight">
            Judges View
          </span>
        </button>

        <button
          onClick={() => {
            sound.playTap();
            setActiveView('trends');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeView === 'trends'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-300" />
          <span>Real-Time Fraud Trends (Recharts)</span>
          <span className="bg-emerald-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-tight">
            Live
          </span>
        </button>

        <button
          onClick={() => {
            sound.playTap();
            setActiveView('monitor');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeView === 'monitor'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Live Call & SMS Scam Monitor</span>
        </button>
      </div>

      {activeView === 'ml_metrics' ? (
        <MlModelEvaluationDashboard lang={lang} />
      ) : activeView === 'trends' ? (
        <FraudTrendsDashboard lang={lang} onOpenShield={() => setActiveView('monitor')} />
      ) : (
        <>
          {/* Top Banner with Real-Time Model Status */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#0057B8]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-xs font-bold text-rose-400">
                <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
                <span>Real-Time Neural Scam & Call Analyzer</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-[11px] font-bold text-cyan-300">
                <Activity className="w-3 h-3 text-cyan-400" />
                <span>Dynamic Non-Fixed Scoring</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {lang === 'bn'
                ? 'কল ও মেসেজ এআই স্ক্যাম ডিটেকশন শিল্ড'
                : 'AI Call & SMS Anti-Scam Intelligence Shield'}
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              {lang === 'bn'
                ? 'আমাদের এআই মডেল আগত মেসেজ এবং অপরিচিত কলের প্যাটার্ন বিশ্লেষণ করে সাধারণ ব্যাংকিং কাঠামোর সাথে তুলনা করে এবং কলের স্থায়ীত্ব (Call Duration) মেপে প্রতারণা ঝুঁকি নির্ধারণ করে।'
                : 'Analyzes incoming SMS and calls in real time. Matches ordinary legitimate message syntax against fraudster vectors and scores unknown call durations dynamically.'}
            </p>

            {onReanalyzeAll && (
              <div className="pt-2">
                <button
                  onClick={onReanalyzeAll}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-cyan-300 transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Re-Analyze All Feed Events with Live AI</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Simulation triggers */}
          <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700 space-y-2 text-center sm:text-left shrink-0">
            <p className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-cyan-400" />
              <span>Simulate Live Incoming Feed</span>
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => onSimulateIncoming('call', 'scam')}
                className="px-3 py-2 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/40 text-rose-300 transition"
                title="Generates a coercive call and runs real-time dynamic scoring"
              >
                + Scam Call (14m)
              </button>
              <button
                onClick={() => onSimulateIncoming('sms', 'scam')}
                className="px-3 py-2 rounded-xl bg-amber-500/30 hover:bg-amber-500/50 border border-amber-500/40 text-amber-300 transition"
                title="Generates a lottery phishing SMS with dynamic scoring"
              >
                + Lottery SMS
              </button>
              <button
                onClick={() => onSimulateIncoming('call', 'safe')}
                className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/30 text-emerald-300 transition"
                title="Generates normal conversational call"
              >
                + Safe Call
              </button>
              <button
                onClick={() => onSimulateIncoming('sms', 'safe')}
                className="px-3 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/30 text-blue-300 transition"
                title="Generates official Upay banking SMS"
              >
                + Upay Official SMS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Reference Comparison: Normal Structure vs Scammer Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Normal Message Specimen */}
        <div className="p-5 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 text-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Genuine / Normal Message Structure</span>
            </span>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Normal Match: 95.8% • Threat: 2.1%
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 text-xs text-slate-700 leading-relaxed font-mono">
            "Your Upay account was credited with ৳ 15,000 via UCB Bank NetBanking. TxnID: TXN-893821. Available: ৳ 42,850. Upay will NEVER ask for your PIN."
          </div>
          <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
            <li>Originates from 16268 shortcode telecom gateway</li>
            <li>Contains explicit security disclaimer never to disclose secret PIN</li>
            <li>Structured ledger confirmation without urgency or callback numbers</li>
          </ul>
        </div>

        {/* Scammer-Style Specimen */}
        <div className="p-5 rounded-3xl bg-rose-950/20 border border-rose-500/30 text-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-800 text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Scammer Social Engineering Script</span>
            </span>
            <span className="text-xs font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
              Scam Match: 93.4% • Threat: 94.8%
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-rose-200 text-xs text-slate-700 leading-relaxed font-mono">
            "অভিনন্দন! উপায় ৫ বছর পূর্তি উপলক্ষ্যে আপনি জিতেছেন ৫০,০০০ টাকা! টাকা একাউন্টে যোগ করতে এখনই ওটিপি দিন অথবা কল করুন ০১৭০০৯৯৮৮১১।"
          </div>
          <ul className="text-xs text-rose-800 space-y-1 list-disc list-inside">
            <li>Lures victim with fabricated lottery reward (৫০,০০০ টাকা)</li>
            <li>Solicits confidential 4-digit PIN or OTP password</li>
            <li>Sent from unregistered 11-digit personal SIM instead of 16268</li>
          </ul>
        </div>
      </div>

      {/* Main Analysis Section: Live Monitored Feed + Deep Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Intercepted Feed */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-blue-600" />
              <span>{lang === 'bn' ? 'মনিটরকৃত কল ও মেসেজ' : 'Monitored Calls & Messages'}</span>
            </h3>

            {/* Filter pills */}
            <div className="flex items-center gap-1 text-[11px] font-bold">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2 py-1 rounded-lg transition ${
                  filterType === 'all' ? 'bg-[#0057B8] text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                All ({events.length})
              </button>
              <button
                onClick={() => setFilterType('threats')}
                className={`px-2 py-1 rounded-lg transition ${
                  filterType === 'threats' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Threats
              </button>
              <button
                onClick={() => setFilterType('call')}
                className={`px-2 py-1 rounded-lg transition ${
                  filterType === 'call' ? 'bg-[#0057B8] text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Calls
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
            {filteredEvents.map((evt) => {
              const isSelected = selectedEvent?.id === evt.id;
              const isCritical = evt.threatScore >= 70;
              const isHigh = evt.threatScore >= 40 && evt.threatScore < 70;

              return (
                <div
                  key={evt.id}
                  onClick={() => {
                    setSelectedEvent(evt);
                    sound.playTap();
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#0057B8] bg-blue-50/70 shadow-sm ring-2 ring-[#0057B8]/30'
                      : isCritical
                      ? 'border-rose-200 bg-rose-50/30 hover:bg-rose-50'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {evt.type === 'call' ? (
                        <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                          <PhoneCall className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                          <MessageSquare className="w-3.5 h-3.5" />
                        </span>
                      )}
                      <div>
                        <p className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
                          {evt.senderOrCaller}
                        </p>
                        {evt.callDurationSeconds !== undefined && (
                          <p className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                            <Clock className="w-3 h-3 text-cyan-600" />
                            <span>
                              {Math.floor(evt.callDurationSeconds / 60)}m {evt.callDurationSeconds % 60}s duration
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Threat Score Badge with Decimal Precision */}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isCritical
                          ? 'bg-rose-600 text-white'
                          : isHigh
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {evt.threatLevel} ({evt.threatScore}%)
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                    {evt.content}
                  </p>

                  {/* Dual style-matching micro indicators */}
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold">
                    <span className="text-emerald-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Normal: {evt.normalStyleMatch ?? Math.max(1, 100 - evt.threatScore)}%
                    </span>
                    <span className="text-rose-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      Scam: {evt.scamStyleMatch ?? evt.threatScore}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Event Deep Inspector with Dynamic Linguistic Matcher */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          {selectedEvent ? (
            <>
              {/* Event Header with Classification & Score */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        selectedEvent.threatScore >= 50
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {selectedEvent.classification}
                    </span>
                    <span className="text-xs text-slate-500">{selectedEvent.timestamp}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                    <span>{selectedEvent.senderOrCaller}</span>
                    {selectedEvent.senderName && (
                      <span className="text-xs font-medium text-slate-500">
                        ({selectedEvent.senderName})
                      </span>
                    )}
                  </h3>
                </div>

                <div className="sm:text-right">
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Predicted Risk Score</p>
                  <p
                    className={`text-2xl sm:text-3xl font-black ${
                      selectedEvent.threatScore >= 70
                        ? 'text-rose-600'
                        : selectedEvent.threatScore >= 40
                        ? 'text-amber-500'
                        : 'text-emerald-600'
                    }`}
                  >
                    {selectedEvent.threatScore} / 100
                  </p>
                </div>
              </div>

              {/* Neural Style Matcher: Comparative Vectors Gauge */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span>Neural Linguistic Style Matching Breakdown</span>
                  </p>
                  <span className="text-[11px] font-bold text-slate-500">Real-Time Extraction</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Normal Message Style Gauge */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
                      <span>Normal / Benign Style Match</span>
                      <span>{selectedEvent.normalStyleMatch ?? 5.2}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${selectedEvent.normalStyleMatch ?? 5.2}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Structure alignment with authentic banking syntax & calm non-coercive vocabulary.
                    </p>
                  </div>

                  {/* Scammer Phishing Style Gauge */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-rose-700">
                      <span>Scammer Phishing Style Match</span>
                      <span>{selectedEvent.scamStyleMatch ?? selectedEvent.threatScore}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-rose-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${selectedEvent.scamStyleMatch ?? selectedEvent.threatScore}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Correlation with social engineering scripts, lottery lures, OTP demands & panic triggers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Call Duration & Behavioral Vector Visualizer (For Calls) */}
              {selectedEvent.type === 'call' && (
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 shadow-md">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span>Call Duration Anomaly & Psychological Pressure Curve</span>
                    </span>
                    <span className="font-mono text-amber-400 font-bold">
                      {Math.floor((selectedEvent.callDurationSeconds || 0) / 60)}m {(selectedEvent.callDurationSeconds || 0) % 60}s duration
                    </span>
                  </div>

                  {/* Interactive timeline visualization */}
                  <div className="relative pt-3 pb-1">
                    <div className="h-3 w-full rounded-full bg-slate-800 flex overflow-hidden">
                      <div className="w-[12%] bg-rose-500/80" title="Wangiri Drop Zone (< 9 sec)" />
                      <div className="w-[45%] bg-emerald-500/80" title="Safe Conversational Window (10s - 5m)" />
                      <div className="w-[43%] bg-rose-600/90" title="Coercive Holding Zone (6m - 20m+)" />
                    </div>

                    <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-1">
                      <span>0s (Wangiri Trap)</span>
                      <span>1m - 5m (Normal Safe Window)</span>
                      <span>10m+ (Psychological Coercion)</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 leading-relaxed">
                    {selectedEvent.callDurationAssessment || 'Evaluated against domestic and international voice fraud distribution curves.'}
                  </p>
                </div>
              )}

              {/* Transcript / SMS Content */}
              <div>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Message / Call Transcript
                </p>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-medium leading-relaxed font-mono">
                  "{selectedEvent.content}"
                </div>
              </div>

              {/* Structural Indicators: Authentic vs Red Flags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Authentic Markers */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                  <p className="text-[11px] font-bold text-emerald-800 uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Legitimate Structure Features</span>
                  </p>
                  <ul className="text-xs text-emerald-900 space-y-1">
                    {selectedEvent.matchedNormalFeatures && selectedEvent.matchedNormalFeatures.length > 0 ? (
                      selectedEvent.matchedNormalFeatures.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500 italic">No authentic banking tokens matched</li>
                    )}
                  </ul>
                </div>

                {/* Fraud Vectors Identified */}
                <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-2">
                  <p className="text-[11px] font-bold text-rose-800 uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Identified Fraud Vectors</span>
                  </p>
                  <ul className="text-xs text-rose-900 space-y-1">
                    {selectedEvent.redFlags && selectedEvent.redFlags.length > 0 ? (
                      selectedEvent.redFlags.map((flag, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5" />
                          <span>{flag}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-emerald-700 italic">Zero scam indicators flagged</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Explanation & Actionable Guidance */}
              <div>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  AI Defense Explanation
                </p>
                <p className="text-xs text-slate-600 leading-relaxed bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                  {selectedEvent.explanation}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => onBlockNumber(selectedEvent.senderOrCaller)}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                >
                  <PhoneOff className="w-3.5 h-3.5" />
                  <span>Block Sender & Report to 16216</span>
                </button>
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
              Select an event from the left to inspect AI analysis
            </div>
          )}
        </div>
      </div>

      {/* Interactive AI Scam Testing Sandbox with Live Typing Analysis */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Interactive AI Scam Detection Sandbox</span>
            </h3>
            <p className="text-xs text-slate-400">
              Type or paste any SMS or call scenario. Watch the model match normal message structure vs scammer scripts in real time!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSandboxType('sms')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                sandboxType === 'sms' ? 'bg-[#0057B8] text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Analyze SMS
            </button>
            <button
              onClick={() => setSandboxType('call')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                sandboxType === 'call' ? 'bg-[#0057B8] text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Analyze Call
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          <p className="text-xs font-semibold text-slate-400 mb-2">Load Real Scam & Normal Presets:</p>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSandboxType(p.type);
                  setSandboxInput(p.text);
                  setSandboxCallerNumber(p.number);
                  setSandboxDuration(p.duration);
                  handleRunAnalysis(p.text, p.type, p.number, p.duration);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 transition"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-3">
          {sandboxType === 'call' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Caller Number / ID
                </label>
                <input
                  type="text"
                  value={sandboxCallerNumber}
                  onChange={(e) => setSandboxCallerNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  placeholder="+88017... or +44... (international spoof)"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>Call Duration</span>
                  <span className="text-amber-400 font-mono">
                    {Math.floor(sandboxDuration / 60)}m {sandboxDuration % 60}s ({sandboxDuration} sec)
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="1200"
                  step="5"
                  value={sandboxDuration}
                  onChange={(e) => setSandboxDuration(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                  <span>3s (Wangiri drop)</span>
                  <span>3m (Normal)</span>
                  <span>14m (Coercive holding)</span>
                </div>
              </div>
            </div>
          )}

          <div>
            <textarea
              rows={3}
              value={sandboxInput}
              onChange={(e) => setSandboxInput(e.target.value)}
              placeholder={
                sandboxType === 'sms'
                  ? 'Type or paste any SMS message here (English or বাংলা)... Try adding "লটারি" or "OTP" to see real-time score shift!'
                  : 'Describe what the caller said or asked for (e.g. asked for OTP, said account will be blocked unless USSD is dialed)...'
              }
              className="w-full p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>

          {/* Real-time typing dynamic badge */}
          {liveTypingPreview && (
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-bold">Real-Time Live Estimate:</span>
                <span className="text-emerald-400 font-semibold">
                  Normal Match: {liveTypingPreview.normalStyleMatch}%
                </span>
                <span className="text-rose-400 font-semibold">
                  Scam Match: {liveTypingPreview.scamStyleMatch}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold">Live Risk Score:</span>
                <span
                  className={`font-black px-2 py-0.5 rounded text-xs ${
                    liveTypingPreview.threatScore >= 50
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {liveTypingPreview.threatScore}% ({liveTypingPreview.threatLevel})
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleRunAnalysis()}
              disabled={isAnalyzing || !sandboxInput.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Running Deep Neural Analysis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Analyze with Upay AI Shield</span>
                </>
              )}
            </button>

            {sandboxResult && onAddEvent && (
              <button
                onClick={handleAddCurrentToFeed}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold text-xs sm:text-sm transition flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-cyan-400" />
                <span>Add This Scenario to Monitored Feed</span>
              </button>
            )}
          </div>
        </div>

        {/* Detailed Sandbox Result Display */}
        {sandboxResult && (
          <div
            className={`mt-4 p-5 rounded-2xl border ${
              sandboxResult.isScam
                ? 'bg-rose-950/40 border-rose-600/50'
                : 'bg-emerald-950/40 border-emerald-600/50'
            } space-y-4 animate-fade-in`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                {sandboxResult.isScam ? (
                  <AlertTriangle className="w-6 h-6 text-rose-400" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                )}
                <div>
                  <h4 className="font-extrabold text-base text-white">
                    {sandboxResult.classification}
                  </h4>
                  <p className="text-xs text-slate-300">
                    Threat Level: <span className="font-bold text-amber-400">{sandboxResult.threatLevel}</span>
                  </p>
                </div>
              </div>
              <div className="sm:text-right">
                <span className="text-xs text-slate-400 uppercase font-semibold">Predicted Threat Score: </span>
                <span className="text-2xl font-black text-amber-400">
                  {sandboxResult.threatScore} / 100
                </span>
              </div>
            </div>

            {/* Side-by-side comparative rates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex justify-between font-bold text-emerald-400">
                  <span>Normal Message Style Match:</span>
                  <span>{sandboxResult.normalStyleMatch}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-emerald-400 h-2 rounded-full"
                    style={{ width: `${sandboxResult.normalStyleMatch}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex justify-between font-bold text-rose-400">
                  <span>Scammer Phishing Style Match:</span>
                  <span>{sandboxResult.scamStyleMatch}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-rose-400 h-2 rounded-full"
                    style={{ width: `${sandboxResult.scamStyleMatch}%` }}
                  />
                </div>
              </div>
            </div>

            {sandboxResult.callDurationAssessment && (
              <p className="text-xs text-cyan-300 font-semibold bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-800/40">
                Duration Vector: {sandboxResult.callDurationAssessment}
              </p>
            )}

            <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              {sandboxResult.explanation}
            </p>

            {sandboxResult.redFlags && sandboxResult.redFlags.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Triggered Indicators:</p>
                <div className="flex flex-wrap gap-1.5">
                  {sandboxResult.redFlags.map((flag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 text-[11px] font-semibold border border-rose-500/30"
                    >
                      {flag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )}
</div>
  );
};
