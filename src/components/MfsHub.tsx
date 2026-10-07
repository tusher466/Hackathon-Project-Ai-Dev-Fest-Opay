import React, { useState, useEffect } from 'react';
import {
  Clock,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  CreditCard,
  Building,
  UserCheck,
  X,
  ChevronRight,
  Gift,
  QrCode,
  CheckCircle2,
  Share2,
  Copy,
  Search,
  ExternalLink,
  Phone,
  ArrowRight,
  Plus,
  Send,
  Zap,
  Check,
  HelpCircle,
  Users,
  TrendingUp,
  Activity,
  ShieldAlert
} from 'lucide-react';
import {
  IconSendMoney,
  IconMobileRecharge,
  IconCashOut,
  IconPayBill,
  IconAddMoney,
  IconSavings,
  IconFundTransfer,
  IconRequestMoney,
  IconMakePayment,
  IconReferEarn,
  IconNPSB,
  IconTrafficFine,
  IconTollPayment,
  IconGovtPayment,
  IconEducation,
  IconNGO,
  IconInsurance,
  IconDonation,
  IconZakatPayment,
  IconTicket,
  IconGPFlexiplan,
  IconHotel,
  IconApplicationFee,
  IconOthoba,
  IconMetroRail,
  IconPayoneer,
  IconUpayWheel,
  IconMusic,
  IconLibrary,
  IconGames
} from './UpayIcons';
import { Language, Transaction, BillProvider, MobileOperator } from '../types';
import { BILL_PROVIDERS, MOBILE_OPERATORS } from '../data/initialData';
import { formatBdt } from '../utils/formatters';
import { sound } from '../utils/audio';

interface MfsHubProps {
  balance: number;
  lang: Language;
  onInitiateSendMoney: (params: {
    recipient: string;
    recipientName: string;
    amount: number;
    reference: string;
    use20MinEscrow: boolean;
  }) => void;
  onCashIn: (amount: number, source: string) => void;
  onCashOut: (amount: number, agentNumber: string) => void;
  onMobileRecharge: (amount: number, operator: string, phone: string, packName?: string) => void;
  onPayBill: (bill: BillProvider, billNo: string, amount: number) => void;
  onOpenEscrowTab: () => void;
  onOpenBanglaQR: () => void;
  onOpenTrendsTab?: () => void;
}

export const MfsHub: React.FC<MfsHubProps> = ({
  balance,
  lang,
  onInitiateSendMoney,
  onCashIn,
  onCashOut,
  onMobileRecharge,
  onPayBill,
  onOpenEscrowTab,
  onOpenBanglaQR,
  onOpenTrendsTab,
}) => {
  // Modal states
  const [activeModal, setActiveModal] = useState<
    | 'none'
    | 'send'
    | 'recharge'
    | 'cash_out'
    | 'pay_bill'
    | 'cash_in'
    | 'savings'
    | 'fund_transfer'
    | 'request_money'
    | 'make_payment'
    | 'refer_earn'
    | 'npsb'
    | 'payment_action'
  >('none');

  const [paymentActionItem, setPaymentActionItem] = useState<{ id: string; name: string; icon: any } | null>(null);

  // Form states for Send Money
  const [sendRecipient, setSendRecipient] = useState('');
  const [sendName, setSendName] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sendRef, setSendRef] = useState('');
  const [enable2MinEscrow, setEnable2MinEscrow] = useState(true);
  const [sendError, setSendError] = useState('');

  // Cash In form
  const [cashInAmount, setCashInAmount] = useState('5000');
  const [cashInSource, setCashInSource] = useState('UCB Bank NetBanking');

  // Cash Out form
  const [cashOutAmount, setCashOutAmount] = useState('2000');
  const [cashOutAgent, setCashOutAgent] = useState('01811-998877');

  // Mobile Recharge
  const [rechargePhone, setRechargePhone] = useState('01712-345678');
  const [rechargeOp, setRechargeOp] = useState('gp');
  const [rechargeAmount, setRechargeAmount] = useState('199');
  const [selectedPack, setSelectedPack] = useState('15 GB + 300 Mins (30 Days)');

  // Pay Bill
  const [selectedBillProvider, setSelectedBillProvider] = useState<BillProvider>(BILL_PROVIDERS[0]);
  const [billAccountNo, setBillAccountNo] = useState('18293041');
  const [billAmount, setBillAmount] = useState('1450');

  // ==========================================
  // 1. SAVINGS / DPS STATE
  // ==========================================
  const [dpsTab, setDpsTab] = useState<'create' | 'my_dps'>('create');
  const [dpsAmount, setDpsAmount] = useState('1000');
  const [dpsTenure, setDpsTenure] = useState('3'); // 3 years
  const [dpsNominee, setDpsNominee] = useState('Fatema Begum (Mother)');
  const [myDpsList, setMyDpsList] = useState([
    {
      id: 'DPS-UCB-891024',
      bank: 'UCB Bank High-Return DPS',
      monthly: 1000,
      tenure: '3 Years (9.5%)',
      totalDeposited: 7000,
      maturityTarget: 41500,
      nextDueDate: '10 November 2026',
      status: 'Active',
    },
  ]);

  // ==========================================
  // 2. FUND TRANSFER (3 OPTIONS)
  // ==========================================
  const [ftOption, setFtOption] = useState<'bank' | 'card' | 'prepaid'>('bank');
  const [ftBank, setFtBank] = useState('UCB Bank');
  const [ftAccNo, setFtAccNo] = useState('');
  const [ftAccName, setFtAccName] = useState('');
  const [ftAmount, setFtAmount] = useState('');
  const [ftCardNo, setFtCardNo] = useState('');
  const [ftPrepaidCardNo, setFtPrepaidCardNo] = useState('');

  // ==========================================
  // 3. REQUEST MONEY
  // ==========================================
  const [reqPhone, setReqPhone] = useState('');
  const [reqName, setReqName] = useState('');
  const [reqAmount, setReqAmount] = useState('');
  const [reqNote, setReqNote] = useState('');
  const [reqSuccess, setReqSuccess] = useState(false);

  // ==========================================
  // 4. MAKE PAYMENT (2 OPTIONS)
  // ==========================================
  const [payOption, setPayOption] = useState<'number' | 'scanner'>('number');
  const [merchantNo, setMerchantNo] = useState('');
  const [merchantAmount, setMerchantAmount] = useState('');
  const [merchantRef, setMerchantRef] = useState('');

  // ==========================================
  // 5. REFER & EARN
  // ==========================================
  const [copiedReferral, setCopiedReferral] = useState(false);
  const referralLink = 'https://opay.bd/ref/akash01312';

  // ==========================================
  // 6. NPSB INTEROPERABLE MFS
  // ==========================================
  const [npsbDestination, setNpsbDestination] = useState<'bkash' | 'nagad' | 'rocket' | 'cellfin' | 'tap' | 'upay'>('bkash');
  const [npsbWalletNo, setNpsbWalletNo] = useState('');
  const [npsbAmount, setNpsbAmount] = useState('');

  // ==========================================
  // 7. PAYMENT SERVICES DEMO FORM
  // ==========================================
  const [serviceInput1, setServiceInput1] = useState('');
  const [serviceInput2, setServiceInput2] = useState('');
  const [serviceAmount, setServiceAmount] = useState('');
  const [actionSuccess, setActionSuccess] = useState(false);

  // ==========================================
  // 8. SAVED CONTACTS LIST
  // ==========================================
  const savedContacts = [
    { name: 'Ammu (Mother)', phone: '01711-223344', relation: 'Mother' },
    { name: 'Abbu (Father)', phone: '01819-334455', relation: 'Father' },
    { name: 'Rafiqul Islam (Brother)', phone: '01819-293847', relation: 'Brother' },
    { name: 'Nasrin Akter (Sister)', phone: '01912-738291', relation: 'Sister' },
    { name: 'Tanvir Hossain (Office)', phone: '01711-482910', relation: 'Colleague' },
    { name: 'Kazi Imran (Friend)', phone: '01600-449911', relation: 'Friend' },
  ];

  // Helper: check if contact is a close relative to auto-bypass the 2-minute escrow
  const isCloseRelative = (name: string): boolean => {
    return /(ma|ammu|mom|abbu|mother|father|brother|baba|sister|bhai|bon|chachi|mama|khala|wife|husband|son|daughter|family|আম্মু|মা|আব্বু|বাবা|ভাই|বোন)/i.test(
      name
    );
  };

  // Close relative detected on current sendRecipient
  const closeRelativeDetected = isCloseRelative(sendName || sendRecipient);

  // Update escrow checkbox automatically if close relative
  useEffect(() => {
    if (closeRelativeDetected) {
      setEnable2MinEscrow(false);
    }
  }, [closeRelativeDetected]);

  // ==========================================
  // 9. ANIMATED AD CAROUSEL (RIGHT-TO-LEFT)
  // ==========================================
  const [activeAdIndex, setActiveAdIndex] = useState(0);
  const ads = [
    {
      id: 'ad1',
      title: 'রবি আনলিমিটেড ক্যাশব্যাক',
      subtitle: '৳৫০ ক্যাশব্যাক ৭০ জিবি • ৳৭৫ ক্যাশব্যাক ১০০ জিবি',
      tag: 'রবি অফার',
      badgeBg: 'bg-red-600',
      gradient: 'from-[#1565C0] via-[#0288D1] to-[#00ACC1]',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'ad2',
      title: 'ইউসিবি কার্ডে ৳১০০ বোনাস!',
      subtitle: 'যেকোনো ভিসা বা মাস্টারকার্ড দিয়ে অ্যাড মানিতে ক্যাশব্যাক',
      tag: 'অ্যাড মানি',
      badgeBg: 'bg-emerald-600',
      gradient: 'from-[#0057B8] via-[#1E88E5] to-[#26A69A]',
      img: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'ad3',
      title: 'ওপে ক্যাশলেস শপিং উৎসব',
      subtitle: '১৫,০০০+ মার্চেন্ট আউটলেটে ২৫% পর্যন্ত ডিসকাউন্ট',
      tag: 'মার্চেন্ট অফার',
      badgeBg: 'bg-amber-600',
      gradient: 'from-[#6A1B9A] via-[#8E24AA] to-[#AB47BC]',
      img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'ad4',
      title: '০% ফি-তে বিদ্যুৎ ও গ্যাস বিল',
      subtitle: 'ডিপিডিসি, ডেসকো, পল্লী বিদ্যুৎ ও তিতাস গ্যাস বিল ফ্রি',
      tag: 'ইউটিলিটি বিল',
      badgeBg: 'bg-blue-600',
      gradient: 'from-[#00695C] via-[#00897B] to-[#4DB6AC]',
      img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=300&q=80',
    },
  ];

  // Auto slide ads right-to-left
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAdIndex((prev) => (prev + 1) % ads.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [ads.length]);

  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(sendAmount);
    if (!sendRecipient || sendRecipient.length < 11) {
      setSendError(lang === 'bn' ? 'সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন' : 'Enter valid 11-digit mobile number');
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      setSendError(lang === 'bn' ? 'সঠিক টাকার পরিমাণ দিন' : 'Enter valid amount');
      return;
    }
    if (amt > balance) {
      setSendError(lang === 'bn' ? 'পর্যাপ্ত ব্যালেন্স নেই' : 'Insufficient balance');
      return;
    }

    setSendError('');
    onInitiateSendMoney({
      recipient: sendRecipient,
      recipientName: sendName || 'Opay User',
      amount: amt,
      reference: sendRef || 'Transfer',
      use20MinEscrow: closeRelativeDetected ? false : enable2MinEscrow,
    });
    setActiveModal('none');
  };

  const openServiceModal = (id: string, name: string, iconComponent?: any) => {
    sound.playTap();
    if (id === 'send') setActiveModal('send');
    else if (id === 'recharge') setActiveModal('recharge');
    else if (id === 'cash_out') setActiveModal('cash_out');
    else if (id === 'pay_bill') setActiveModal('pay_bill');
    else if (id === 'cash_in') setActiveModal('cash_in');
    else if (id === 'savings') setActiveModal('savings');
    else if (id === 'fund_transfer') setActiveModal('fund_transfer');
    else if (id === 'request') setActiveModal('request_money');
    else if (id === 'merchant') setActiveModal('make_payment');
    else if (id === 'refer') setActiveModal('refer_earn');
    else if (id === 'npsb') setActiveModal('npsb');
    else {
      setPaymentActionItem({ id, name, icon: iconComponent });
      setServiceInput1('');
      setServiceInput2('');
      setServiceAmount('500');
      setActionSuccess(false);
      setActiveModal('payment_action');
    }
  };

  // Section 1: Main Core Services (Exact match with Image 2)
  const coreServices = [
    { id: 'send', name: 'সেন্ড মানি', icon: IconSendMoney },
    { id: 'recharge', name: 'মোবাইল রিচার্জ', icon: IconMobileRecharge },
    { id: 'cash_out', name: 'ক্যাশ আউট', icon: IconCashOut },
    { id: 'pay_bill', name: 'পে বিল', icon: IconPayBill },
    { id: 'cash_in', name: 'অ্যাড মানি', icon: IconAddMoney },
    { id: 'savings', name: 'সঞ্চয়', icon: IconSavings },
    { id: 'fund_transfer', name: 'ফান্ড ট্রান্সফার', icon: IconFundTransfer },
    { id: 'request', name: 'রিকোয়েস্ট মানি', icon: IconRequestMoney },
    { id: 'merchant', name: 'মেক পেমেন্ট', icon: IconMakePayment },
    { id: 'refer', name: 'রেফার & আর্ন', icon: IconReferEarn },
    { id: 'npsb', name: 'এনপিএসবি', icon: IconNPSB },
  ];

  // Section 2: উপায় পেমেন্ট (Opay Payment – 14 Actionable Services)
  const paymentServices = [
    { id: 'traffic', name: 'ট্রাফিক ফাইন', icon: IconTrafficFine },
    { id: 'toll', name: 'টোল পেমেন্ট', icon: IconTollPayment },
    { id: 'govt', name: 'সরকারি পেমেন্ট', icon: IconGovtPayment },
    { id: 'education', name: 'এডুকেশন', icon: IconEducation },
    { id: 'ngo', name: 'এন জি ও', icon: IconNGO },
    { id: 'insurance', name: 'বীমা', icon: IconInsurance },
    { id: 'donation', name: 'ডোনেশন', icon: IconDonation },
    { id: 'zakat', name: 'যাকাত পেমেন্ট', icon: IconZakatPayment },
    { id: 'ticket', name: 'টিকেট', icon: IconTicket },
    { id: 'gp_flexi', name: 'জিপি ফ্লেক্সিপ্ল্যান', icon: IconGPFlexiplan },
    { id: 'hotel', name: 'হোটেল', icon: IconHotel },
    { id: 'application_fee', name: 'আবেদন ফি', icon: IconApplicationFee },
    { id: 'othoba', name: 'Othoba', icon: IconOthoba },
    { id: 'metro_rail', name: 'মেট্রোরেল', icon: IconMetroRail },
  ];

  // Section 3: অন্যান্য সার্ভিস (Other Services)
  const otherServices = [
    { id: 'payoneer', name: 'পেওনিয়ার', icon: IconPayoneer },
    { id: 'wheel', name: 'উপায় চাকা', icon: IconUpayWheel },
    { id: 'music', name: 'মিউজিক', icon: IconMusic },
    { id: 'library', name: 'লাইব্রেরি', icon: IconLibrary },
    { id: 'games', name: 'গেম', icon: IconGames },
  ];

  return (
    <div className="space-y-6 pb-24 select-none">
      {/* ==================================================== */}
      {/* 1. TOP MAIN SERVICES GRID (11 Core Services) */}
      {/* ==================================================== */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100">
        <div className="grid grid-cols-4 gap-y-6 gap-x-2 text-center">
          {coreServices.map((srv) => {
            const IconComponent = srv.icon;
            return (
              <button
                key={srv.id}
                onClick={() => openServiceModal(srv.id, srv.name, IconComponent)}
                className="flex flex-col items-center group cursor-pointer focus:outline-none transition transform hover:-translate-y-0.5 active:scale-95"
              >
                <div className="relative mb-2 flex items-center justify-center">
                  <IconComponent className="w-11 h-11 transition transform group-hover:scale-110 drop-shadow-xs" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-slate-800 tracking-tight leading-tight group-hover:text-[#0057B8] transition">
                  {srv.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. ANIMATED PROMOTIONAL AD BANNER CAROUSEL (RIGHT TO LEFT) */}
      {/* ==================================================== */}
      <div className="relative overflow-hidden rounded-2xl shadow-md transition-all duration-700">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${activeAdIndex * 100}%)` }}
        >
          {ads.map((ad, idx) => (
            <div
              key={ad.id}
              className={`w-full shrink-0 p-4 sm:p-5 flex items-center justify-between min-h-[120px] bg-gradient-to-r ${ad.gradient} text-white`}
            >
              {/* Left Text */}
              <div className="space-y-1.5 z-10 max-w-[65%]">
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full ${ad.badgeBg} text-[10px] font-black tracking-wider text-white shadow-xs`}>
                    {ad.tag}
                  </span>
                  <span className="text-xs font-black tracking-tight text-white drop-shadow">
                    {ad.title}
                  </span>
                </div>
                <p className="text-[11px] text-white/95 font-medium leading-tight">
                  {ad.subtitle}
                </p>
                <button
                  onClick={() => sound.playTap()}
                  className="mt-1 inline-flex items-center gap-1 px-3 py-1 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black shadow-xs transition"
                >
                  <span>ক্লিক করুন</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Right Graphical Image */}
              <div className="relative w-28 sm:w-36 h-24 flex items-center justify-center shrink-0">
                <div className="absolute w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
                <img
                  src={ad.img}
                  alt={ad.title}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white/40 shadow-lg transform -rotate-2"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Pagination Dots */}
        <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5 z-10">
          {ads.map((_, dot) => (
            <button
              key={dot}
              onClick={() => setActiveAdIndex(dot)}
              className={`rounded-full transition-all duration-300 ${
                activeAdIndex === dot ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'
              }`}
              aria-label={`Go to slide ${dot + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2.5 AI SCAM SHIELD & FRAUD TRENDS TELEMETRY BANNER   */}
      {/* ==================================================== */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0057B8] rounded-3xl p-5 text-white shadow-lg border border-slate-700/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-black text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>AI Scam Shield Active</span>
              </span>
              <span className="text-[11px] text-slate-300 font-mono">
                14.2ms P99 Latency
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
              {lang === 'bn' ? 'রিয়েল-টাইম এআই জালিয়াতি পর্যবেক্ষণ ড্যাশবোর্ড' : 'Real-Time Fraud Trends & Safe Escrow Telemetry'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'bn'
                ? 'আজ ১,৪২৮+ প্রতারণা সফলভাবে প্রতিহত করা হয়েছে এবং ২-মিনিটের সেফ হোল্ডে ৩.৮ কোটি টাকা সুরক্ষিত রাখা হয়েছে।'
                : '1,428+ scam attempts blocked today with conditional 2-minute safe-holds preventing advance payment traps.'}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col items-stretch gap-2 shrink-0">
            {onOpenTrendsTab && (
              <button
                onClick={() => {
                  sound.playTap();
                  onOpenTrendsTab();
                }}
                className="px-4 py-2 rounded-xl bg-[#FFCD00] hover:bg-[#ffc200] active:scale-95 text-slate-950 text-xs font-black transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-slate-950" />
                <span>{lang === 'bn' ? 'ট্রেন্ডস ড্যাশবোর্ড দেখুন' : 'View Fraud Trends'}</span>
              </button>
            )}
            <button
              onClick={() => {
                sound.playTap();
                onOpenEscrowTab();
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold transition flex items-center justify-center gap-2 border border-white/20 cursor-pointer"
            >
              <Clock className="w-4 h-4 text-amber-300" />
              <span>{lang === 'bn' ? 'সেফ এসক্রো হোল্ড' : 'Safe Escrow Vault'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 3. ওপে পেমেন্ট (OPAY PAYMENT SECTION - 14 Actionable Services) */}
      {/* ==================================================== */}
      <div className="space-y-3">
        <h2 className="text-sm font-extrabold text-[#0057B8] px-1 tracking-tight">
          উপায় পেমেন্ট
        </h2>

        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100">
          <div className="grid grid-cols-4 gap-y-6 gap-x-2 text-center">
            {paymentServices.map((srv) => {
              const IconComponent = srv.icon;
              return (
                <button
                  key={srv.id}
                  onClick={() => openServiceModal(srv.id, srv.name, IconComponent)}
                  className="flex flex-col items-center group cursor-pointer focus:outline-none transition transform hover:-translate-y-0.5 active:scale-95"
                >
                  <div className="relative mb-2 flex items-center justify-center">
                    <IconComponent className="w-10 h-10 transition transform group-hover:scale-110 drop-shadow-xs" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 tracking-tight leading-tight group-hover:text-[#0057B8] transition">
                    {srv.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 4. অন্যান্য সার্ভিস (OTHER SERVICES) */}
      {/* ==================================================== */}
      <div className="space-y-3">
        <h2 className="text-sm font-extrabold text-[#0057B8] px-1 tracking-tight">
          অন্যান্য সার্ভিস
        </h2>

        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100">
          <div className="grid grid-cols-4 gap-y-6 gap-x-2 text-center">
            {otherServices.map((srv) => {
              const IconComponent = srv.icon;
              return (
                <button
                  key={srv.id}
                  onClick={() => openServiceModal(srv.id, srv.name, IconComponent)}
                  className="flex flex-col items-center group cursor-pointer focus:outline-none transition transform hover:-translate-y-0.5 active:scale-95"
                >
                  <div className="relative mb-2 flex items-center justify-center">
                    <IconComponent className="w-10 h-10 transition transform group-hover:scale-110 drop-shadow-xs" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 tracking-tight leading-tight group-hover:text-[#0057B8] transition">
                    {srv.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 5. DUAL ACTION STRIP: উপায় কার্ড & উপায় অফার */}
      {/* ==================================================== */}
      <div className="bg-[#FFF9E6] border border-amber-200/80 rounded-2xl p-2.5 shadow-xs flex items-center justify-between">
        <button
          onClick={() => openServiceModal('card', 'ওপে কার্ড')}
          className="flex-1 flex items-center justify-center gap-2.5 py-2 px-3 text-slate-900 font-extrabold text-xs sm:text-sm hover:opacity-90 transition active:scale-95"
        >
          <span className="tracking-tight">উপায় কার্ড</span>
          <div className="w-9 h-6 rounded bg-gradient-to-r from-cyan-500 to-blue-600 shadow-xs flex items-center justify-between px-1 border border-white/60">
            <span className="w-2 h-1.5 rounded-xs bg-amber-300" />
            <span className="text-[7px] font-mono text-white">••••</span>
          </div>
        </button>

        <div className="w-px h-6 bg-amber-300" />

        <button
          onClick={() => openServiceModal('offer', 'ওপে অফার')}
          className="flex-1 flex items-center justify-center gap-2.5 py-2 px-3 text-slate-900 font-extrabold text-xs sm:text-sm hover:opacity-90 transition active:scale-95"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-600 shadow-xs flex items-center justify-center text-white relative">
            <Gift className="w-4 h-4 text-pink-300" />
          </div>
          <span className="tracking-tight">উপায় অফার</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* MODAL 1: SEND MONEY (With Auto-Bypass for Relatives) */}
      {/* ==================================================== */}
      {activeModal === 'send' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <IconSendMoney className="w-8 h-8" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">সেন্ড মানি (Send Money)</h3>
                  <p className="text-xs text-slate-500">Free to any Opay Number</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('none')} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Quick Pick Saved Relatives & Contacts */}
            <div>
              <p className="text-xs font-bold text-slate-700 mb-1.5">Quick Pick Saved Contacts:</p>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
                {savedContacts.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSendRecipient(c.phone);
                      setSendName(c.name);
                    }}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 whitespace-nowrap text-left shrink-0 transition"
                  >
                    <p className="font-bold text-slate-900">{c.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{c.phone}</p>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient Number (প্রাপকের নম্বর)
                </label>
                <input
                  type="text"
                  placeholder="01XXXXXXXXX"
                  value={sendRecipient}
                  onChange={(e) => setSendRecipient(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:border-[#0057B8]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient Name (প্রাপকের নাম)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ammu / Brother / Rafiqul"
                  value={sendName}
                  onChange={(e) => setSendName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:border-[#0057B8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Amount in BDT (টাকার পরিমাণ)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold">৳</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    min="10"
                    max={balance}
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 text-base font-extrabold focus:outline-none focus:border-[#0057B8]"
                    required
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-semibold">
                  <span>Available: {formatBdt(balance, lang)}</span>
                  <span>Fee: ৳ 0.00 (FREE)</span>
                </div>
              </div>

              {/* Close Relative Auto-Bypass Notification OR 2-Minute Safe Hold Checkbox */}
              {closeRelativeDetected ? (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Trusted Family Contact Detected</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed font-semibold">
                    The 2-minute safe-hold delay is automatically bypassed for "{sendName || sendRecipient}". Funds will be transferred instantly!
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-extrabold text-amber-900">
                        2-Minute Anti-Fraud Safe-Hold Window
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={enable2MinEscrow}
                      onChange={(e) => setEnable2MinEscrow(e.target.checked)}
                      className="w-4 h-4 accent-[#0057B8] cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Holds the money safely in Opay Cloud Escrow for 2 minutes so you can recall funds in case of wrong number or scam.
                  </p>
                </div>
              )}

              {sendError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>{sendError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0057B8] hover:bg-[#004ca0] text-white font-extrabold text-sm shadow-md transition"
              >
                Proceed to Biometric Confirmation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 1B: মোবাইল রিচার্জ (MOBILE RECHARGE) */}
      {/* ==================================================== */}
      {activeModal === 'recharge' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <IconMobileRecharge className="w-8 h-8" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">মোবাইল রিচার্জ (Mobile Recharge)</h3>
                  <p className="text-xs text-slate-500">Instant Recharge to any Bangladeshi SIM</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('none')} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const amt = parseFloat(rechargeAmount);
                if (!rechargePhone || rechargePhone.length < 11 || isNaN(amt) || amt <= 0) return;
                onMobileRecharge(amt, rechargeOp, rechargePhone, selectedPack);
                setActiveModal('none');
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={rechargePhone}
                  onChange={(e) => setRechargePhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                  placeholder="01XXXXXXXXX"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Mobile Operator</label>
                <div className="grid grid-cols-4 gap-2">
                  {MOBILE_OPERATORS.map((op) => (
                    <button
                      key={op.id}
                      type="button"
                      onClick={() => setRechargeOp(op.id)}
                      className={`p-2 rounded-xl border text-center transition ${
                        rechargeOp === op.id ? 'border-[#0057B8] bg-blue-50 font-black' : 'border-slate-200'
                      }`}
                    >
                      <span className="text-xs block font-bold">{op.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Bundle / Internet Pack</label>
                <select
                  value={selectedPack}
                  onChange={(e) => {
                    setSelectedPack(e.target.value);
                    if (e.target.value.includes('199')) setRechargeAmount('199');
                    else if (e.target.value.includes('498')) setRechargeAmount('498');
                    else if (e.target.value.includes('699')) setRechargeAmount('699');
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                >
                  <option value="15 GB + 300 Mins (30 Days) - 199 Tk">15 GB + 300 Mins (30 Days) - 199 Tk</option>
                  <option value="40 GB Unlimited Data (30 Days) - 498 Tk">40 GB Unlimited Data (30 Days) - 498 Tk</option>
                  <option value="80 GB + 800 Mins (30 Days) - 699 Tk">80 GB + 800 Mins (30 Days) - 699 Tk</option>
                  <option value="Standard Talktime (Any Amount)">Standard Talktime (Any Amount)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount (৳)</label>
                <input
                  type="number"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-base font-black"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0057B8] text-white font-extrabold text-sm shadow-md"
              >
                Confirm Mobile Recharge (৳ {rechargeAmount})
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 1C: ক্যাশ আউট (CASH OUT) */}
      {/* ==================================================== */}
      {activeModal === 'cash_out' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <IconCashOut className="w-8 h-8" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">ক্যাশ আউট (Cash Out)</h3>
                  <p className="text-xs text-slate-500">From any Opay Authorized Agent Point</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('none')} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const amt = parseFloat(cashOutAmount);
                if (isNaN(amt) || amt <= 0 || !cashOutAgent) return;
                onCashOut(amt, cashOutAgent);
                setActiveModal('none');
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Agent Phone Number</label>
                <input
                  type="text"
                  value={cashOutAgent}
                  onChange={(e) => setCashOutAgent(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                  placeholder="01XXXXXXXXX"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cash Out Amount (৳)</label>
                <input
                  type="number"
                  value={cashOutAmount}
                  onChange={(e) => setCashOutAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-base font-black"
                  required
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-semibold">
                  <span>Fee: ৳ {Math.round((parseFloat(cashOutAmount || '0') / 1000) * 14)} (৳14/1000 Tk)</span>
                  <span>Available: {formatBdt(balance, lang)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0057B8] text-white font-extrabold text-sm shadow-md"
              >
                Proceed to Biometric Cash Out
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 1D: পে বিল (PAY BILL) */}
      {/* ==================================================== */}
      {activeModal === 'pay_bill' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <IconPayBill className="w-8 h-8" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">পে বিল (Pay Bill)</h3>
                  <p className="text-xs text-slate-500">Electricity, Gas, Water & Internet</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('none')} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const amt = parseFloat(billAmount);
                if (isNaN(amt) || amt <= 0 || !billAccountNo) return;
                onPayBill(selectedBillProvider, billAccountNo, amt);
                setActiveModal('none');
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Biller / Provider</label>
                <div className="grid grid-cols-2 gap-2">
                  {BILL_PROVIDERS.map((provider) => (
                    <button
                      key={provider.id}
                      type="button"
                      onClick={() => setSelectedBillProvider(provider)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition ${
                        selectedBillProvider.id === provider.id
                          ? 'border-[#0057B8] bg-blue-50 font-black'
                          : 'border-slate-200'
                      }`}
                    >
                      <p className="font-bold text-slate-900">{provider.name}</p>
                      <p className="text-[10px] text-slate-500">{provider.billType}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bill / Customer Account No</label>
                <input
                  type="text"
                  value={billAccountNo}
                  onChange={(e) => setBillAccountNo(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                  placeholder="e.g. 18293041"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bill Amount (৳)</label>
                <input
                  type="number"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-base font-black"
                  required
                />
                <span className="text-[10px] text-emerald-600 font-bold block mt-1">Fee: ৳ 0.00 (Zero Fee)</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0057B8] text-white font-extrabold text-sm shadow-md"
              >
                Proceed to Biometric Pay Bill
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 1E: অ্যাড মানি (ADD MONEY / CASH IN) */}
      {/* ==================================================== */}
      {activeModal === 'cash_in' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <IconAddMoney className="w-8 h-8" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">অ্যাড মানি (Add Money)</h3>
                  <p className="text-xs text-slate-500">From Bank Account or Debit/Credit Card</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('none')} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const amt = parseFloat(cashInAmount);
                if (isNaN(amt) || amt <= 0) return;
                onCashIn(amt, cashInSource);
                setActiveModal('none');
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Add Money Source</label>
                <div className="grid grid-cols-2 gap-2">
                  {['UCB Bank NetBanking', 'Visa / Mastercard', 'Internet Banking (NPSB)', 'Upay Co-branded Card'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setCashInSource(s)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition ${
                        cashInSource === s ? 'border-[#0057B8] bg-blue-50 text-[#0057B8]' : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount to Add (৳)</label>
                <input
                  type="number"
                  value={cashInAmount}
                  onChange={(e) => setCashInAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-base font-black"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0057B8] text-white font-extrabold text-sm shadow-md"
              >
                Add ৳ {cashInAmount} Instantly
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 2: সঞ্চয় (SAVINGS & CREATE NEW DPS SYSTEM) */}
      {/* ==================================================== */}
      {activeModal === 'savings' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <IconSavings className="w-8 h-8" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">সঞ্চয় ও ডিপিএস (Opay DPS)</h3>
                  <p className="text-xs text-slate-500">UCB Bank Backed 9.5% Annual Return</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('none')} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Toggle: Create New DPS vs My Running DPS */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 text-xs font-bold text-center">
              <button
                onClick={() => setDpsTab('create')}
                className={`py-2 rounded-lg transition ${
                  dpsTab === 'create' ? 'bg-[#0057B8] text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Create New DPS
              </button>
              <button
                onClick={() => setDpsTab('my_dps')}
                className={`py-2 rounded-lg transition ${
                  dpsTab === 'my_dps' ? 'bg-[#0057B8] text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                My Active DPS ({myDpsList.length})
              </button>
            </div>

            {dpsTab === 'create' ? (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Deposit Amount (টাকার পরিমাণ)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['500', '1000', '2000', '5000'].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDpsAmount(amt)}
                        className={`py-2 rounded-xl text-xs font-extrabold border transition ${
                          dpsAmount === amt ? 'bg-amber-100 border-amber-400 text-amber-900' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        ৳ {amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tenure (মেয়াদ)</label>
                  <div className="grid grid-cols-4 gap-2 text-xs font-bold">
                    {[
                      { yr: '1', rate: '9.0%' },
                      { yr: '2', rate: '9.25%' },
                      { yr: '3', rate: '9.5%' },
                      { yr: '5', rate: '9.75%' },
                    ].map((t) => (
                      <button
                        key={t.yr}
                        type="button"
                        onClick={() => setDpsTenure(t.yr)}
                        className={`p-2 rounded-xl border text-center transition ${
                          dpsTenure === t.yr ? 'bg-blue-50 border-[#0057B8] text-[#0057B8]' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <p>{t.yr} Year</p>
                        <p className="text-[10px] text-emerald-600 font-semibold">{t.rate}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nominee Name & Relation</label>
                  <input
                    type="text"
                    value={dpsNominee}
                    onChange={(e) => setDpsNominee(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                {/* Return Projection */}
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <div className="flex justify-between text-xs font-bold text-emerald-900">
                    <span>Maturity Return Target:</span>
                    <span className="font-mono text-sm text-emerald-700">
                      ৳ {Number(dpsAmount) * Number(dpsTenure) * 12 + Math.round(Number(dpsAmount) * Number(dpsTenure) * 12 * 0.15)}
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-800">
                    Auto-debit from Opay wallet on the 10th of every month. Fully guaranteed by Bangladesh Bank.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const newDps = {
                      id: `DPS-UCB-${Math.floor(100000 + Math.random() * 900000)}`,
                      bank: 'UCB Bank High-Return DPS',
                      monthly: Number(dpsAmount),
                      tenure: `${dpsTenure} Years (9.5%)`,
                      totalDeposited: Number(dpsAmount),
                      maturityTarget: Number(dpsAmount) * Number(dpsTenure) * 12 + Math.round(Number(dpsAmount) * Number(dpsTenure) * 12 * 0.15),
                      nextDueDate: '10 November 2026',
                      status: 'Active',
                    };
                    setMyDpsList([newDps, ...myDpsList]);
                    sound.playSuccess();
                    setDpsTab('my_dps');
                  }}
                  className="w-full py-3 rounded-xl bg-[#0057B8] text-white font-extrabold text-sm shadow-md"
                >
                  Create & Activate DPS Account
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {myDpsList.map((dps) => (
                  <div key={dps.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-black text-slate-900">{dps.bank}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black">
                        {dps.status}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-500 font-bold">{dps.id}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200 font-semibold">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Monthly Deposit:</span>
                        <span className="text-slate-900 font-bold">৳ {dps.monthly}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Total Deposited:</span>
                        <span className="text-slate-900 font-bold">৳ {dps.totalDeposited}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        sound.playSuccess();
                        alert(`Installment ৳ ${dps.monthly} paid successfully for ${dps.id}!`);
                      }}
                      className="w-full py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs mt-2 transition"
                    >
                      Deposit Installment Manually (৳ {dps.monthly})
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 3: ফান্ড ট্রান্সফার (3 OPTIONS) */}
      {/* ==================================================== */}
      {activeModal === 'fund_transfer' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <IconFundTransfer className="w-8 h-8" />
                <h3 className="text-base font-extrabold text-slate-900">ফান্ড ট্রান্সফার (Fund Transfer)</h3>
              </div>
              <button onClick={() => setActiveModal('none')} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* 3 Options Switcher */}
            <div className="grid grid-cols-3 p-1 rounded-xl bg-slate-100 text-[11px] font-bold text-center">
              <button
                onClick={() => setFtOption('bank')}
                className={`py-2 rounded-lg transition ${
                  ftOption === 'bank' ? 'bg-[#0057B8] text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                1. Bank Account
              </button>
              <button
                onClick={() => setFtOption('card')}
                className={`py-2 rounded-lg transition ${
                  ftOption === 'card' ? 'bg-[#0057B8] text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                2. Visa Debit
              </button>
              <button
                onClick={() => setFtOption('prepaid')}
                className={`py-2 rounded-lg transition ${
                  ftOption === 'prepaid' ? 'bg-[#0057B8] text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                3. Opay Card
              </button>
            </div>

            {ftOption === 'bank' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Bank</label>
                  <select
                    value={ftBank}
                    onChange={(e) => setFtBank(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="UCB Bank">United Commercial Bank (UCB)</option>
                    <option value="City Bank">City Bank</option>
                    <option value="BRAC Bank">BRAC Bank</option>
                    <option value="Dutch-Bangla Bank">Dutch-Bangla Bank (DBBL)</option>
                    <option value="Islami Bank">Islami Bank Bangladesh</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 1029384729103"
                    value={ftAccNo}
                    onChange={(e) => setFtAccNo(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    placeholder="Full name as in bank"
                    value={ftAccName}
                    onChange={(e) => setFtAccName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Amount (৳)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={ftAmount}
                    onChange={(e) => setFtAmount(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                  />
                </div>
              </div>
            )}

            {ftOption === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">16-Digit Visa Debit Card Number</label>
                  <input
                    type="text"
                    maxLength={19}
                    placeholder="4000 1234 5678 9010"
                    value={ftCardNo}
                    onChange={(e) => setFtCardNo(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="Name printed on card"
                    value={ftAccName}
                    onChange={(e) => setFtAccName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Amount (৳)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={ftAmount}
                    onChange={(e) => setFtAmount(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                  />
                </div>
              </div>
            )}

            {ftOption === 'prepaid' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Opay Co-Branded Card Number</label>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="9940 8820 1928 8839"
                    value={ftPrepaidCardNo}
                    onChange={(e) => setFtPrepaidCardNo(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Amount (৳)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={ftAmount}
                    onChange={(e) => setFtAmount(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                  />
                  <p className="text-[10px] text-emerald-600 font-bold mt-1">Instant transfer with zero fees.</p>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                sound.playSuccess();
                alert(`Fund Transfer of ৳ ${ftAmount || '1,000'} submitted successfully via ${ftOption.toUpperCase()}!`);
                setActiveModal('none');
              }}
              className="w-full py-3 rounded-xl bg-[#0057B8] text-white font-extrabold text-sm shadow-md"
            >
              Transfer Funds Instantly
            </button>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 4: রিকোয়েস্ট মানি (REQUEST MONEY FROM CONTACTS) */}
      {/* ==================================================== */}
      {activeModal === 'request_money' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <IconRequestMoney className="w-8 h-8" />
                <h3 className="text-base font-extrabold text-slate-900">রিকোয়েস্ট মানি (Request Money)</h3>
              </div>
              <button onClick={() => setActiveModal('none')} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Saved contacts list */}
            <div>
              <p className="text-xs font-bold text-slate-700 mb-1.5">Request from Saved Contacts:</p>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {savedContacts.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setReqPhone(c.phone);
                      setReqName(c.name);
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition ${
                      reqPhone === c.phone ? 'border-[#0057B8] bg-blue-50' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-slate-900">{c.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{c.phone}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {c.relation}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Phone Number</label>
                <input
                  type="text"
                  placeholder="01XXXXXXXXX"
                  value={reqPhone}
                  onChange={(e) => setReqPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Requested Amount (৳)</label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={reqAmount}
                  onChange={(e) => setReqAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. For dinner bill split"
                  value={reqNote}
                  onChange={(e) => setReqNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <button
                onClick={() => {
                  sound.playSuccess();
                  alert(`Money request of ৳ ${reqAmount || '500'} sent to ${reqName || reqPhone}!`);
                  setActiveModal('none');
                }}
                className="w-full py-3 rounded-xl bg-[#0057B8] text-white font-extrabold text-sm shadow-md"
              >
                Send Money Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 5: মেক পেমেন্ট (2 OPTIONS: NUMBER DIAL & QR SCANNER) */}
      {/* ==================================================== */}
      {activeModal === 'make_payment' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <IconMakePayment className="w-8 h-8" />
                <h3 className="text-base font-extrabold text-slate-900">মেক পেমেন্ট (Make Payment)</h3>
              </div>
              <button onClick={() => setActiveModal('none')} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* 2 Options Switcher */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 text-xs font-bold text-center">
              <button
                onClick={() => setPayOption('number')}
                className={`py-2 rounded-lg transition ${
                  payOption === 'number' ? 'bg-[#0057B8] text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                1. Dial Merchant Number
              </button>
              <button
                onClick={() => setPayOption('scanner')}
                className={`py-2 rounded-lg transition ${
                  payOption === 'scanner' ? 'bg-[#0057B8] text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                2. Scan Merchant QR
              </button>
            </div>

            {payOption === 'number' ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Merchant Account / Counter Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 01800-445566"
                    value={merchantNo}
                    onChange={(e) => setMerchantNo(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payment Amount (৳)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={merchantAmount}
                    onChange={(e) => setMerchantAmount(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Reference / Bill Note</label>
                  <input
                    type="text"
                    placeholder="e.g. Invoice #892"
                    value={merchantRef}
                    onChange={(e) => setMerchantRef(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <button
                  onClick={() => {
                    sound.playSuccess();
                    alert(`Payment of ৳ ${merchantAmount || '750'} to ${merchantNo || 'Merchant'} successful!`);
                    setActiveModal('none');
                  }}
                  className="w-full py-3 rounded-xl bg-[#0057B8] text-white font-extrabold text-sm shadow-md"
                >
                  Pay Merchant Now
                </button>
              </div>
            ) : (
              <div className="text-center space-y-3 py-2">
                <div className="w-48 h-48 mx-auto rounded-2xl bg-slate-900 border-2 border-cyan-400 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-4 border border-dashed border-cyan-400 animate-pulse pointer-events-none" />
                  <QrCode className="w-12 h-12 text-cyan-400" />
                </div>
                <p className="text-xs text-slate-600 font-semibold">Hold your camera against any Bangla QR or Merchant QR stand.</p>
                <button
                  onClick={() => {
                    onOpenBanglaQR();
                    setActiveModal('none');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0057B8] text-white font-bold text-xs shadow-xs"
                >
                  Open Full Screen Camera Scanner
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 6: রেফার & আর্ন (REFER & EARN WITH UNIQUE LINK) */}
      {/* ==================================================== */}
      {activeModal === 'refer_earn' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <IconReferEarn className="w-8 h-8" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">রেফার & আর্ন (Refer & Earn)</h3>
                  <p className="text-xs text-slate-500">Earn ৳ 50 per friend who signs up!</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('none')} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-2">
              <span className="text-xs font-bold text-amber-800 uppercase">Your Total Referral Earnings</span>
              <p className="text-2xl font-black text-amber-900 font-mono">৳ 750.00</p>
              <p className="text-[11px] text-amber-800">15 friends registered using your link</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Unique Invite Link</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold bg-slate-50"
                />
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(referralLink);
                    setCopiedReferral(true);
                    sound.playTap();
                    setTimeout(() => setCopiedReferral(false), 2000);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-[#0057B8] text-white text-xs font-bold shrink-0 flex items-center gap-1"
                >
                  {copiedReferral ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedReferral ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <p className="text-xs font-bold text-slate-700">Share Directly With Friends:</p>
              <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                <button
                  onClick={() => sound.playSuccess()}
                  className="p-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 flex items-center justify-center gap-1"
                >
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => sound.playSuccess()}
                  className="p-2 rounded-xl bg-blue-50 border border-blue-300 text-blue-800 hover:bg-blue-100 flex items-center justify-center gap-1"
                >
                  <span>Messenger</span>
                </button>
                <button
                  onClick={() => sound.playSuccess()}
                  className="p-2 rounded-xl bg-sky-50 border border-sky-300 text-sky-800 hover:bg-sky-100 flex items-center justify-center gap-1"
                >
                  <span>SMS / More</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 7: এনপিএসবি (NPSB INTEROPERABLE MFS TRANSFER) */}
      {/* ==================================================== */}
      {activeModal === 'npsb' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <IconNPSB className="w-8 h-8" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">এনপিএসবি (NPSB Inter-MFS)</h3>
                  <p className="text-xs text-slate-500">Send money directly to any Bangladesh MFS</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('none')} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Destination MFS</label>
              <div className="grid grid-cols-3 gap-2 text-xs font-extrabold">
                {[
                  { id: 'bkash', name: 'bKash', color: 'border-pink-300 text-pink-700 bg-pink-50' },
                  { id: 'nagad', name: 'Nagad', color: 'border-orange-300 text-orange-700 bg-orange-50' },
                  { id: 'rocket', name: 'Rocket', color: 'border-purple-300 text-purple-700 bg-purple-50' },
                  { id: 'cellfin', name: 'Cellfin', color: 'border-emerald-300 text-emerald-700 bg-emerald-50' },
                  { id: 'tap', name: 'tap', color: 'border-cyan-300 text-cyan-700 bg-cyan-50' },
                  { id: 'upay', name: 'Upay', color: 'border-blue-300 text-blue-700 bg-blue-50' },
                ].map((mfs) => (
                  <button
                    key={mfs.id}
                    type="button"
                    onClick={() => setNpsbDestination(mfs.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      npsbDestination === mfs.id ? 'ring-2 ring-[#0057B8] font-black' : mfs.color
                    }`}
                  >
                    {mfs.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient {npsbDestination.toUpperCase()} Wallet Number
                </label>
                <input
                  type="text"
                  placeholder="01XXXXXXXXX"
                  value={npsbWalletNo}
                  onChange={(e) => setNpsbWalletNo(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount (৳)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={npsbAmount}
                  onChange={(e) => setNpsbAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-semibold">
                  <span>NPSB Switch Fee: ৳ 5.00</span>
                  <span>Instant Delivery via Bangladesh Bank</span>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playSuccess();
                  alert(`NPSB Inter-MFS transfer of ৳ ${npsbAmount || '1,000'} to ${npsbDestination.toUpperCase()} (${npsbWalletNo || '017...'}) completed!`);
                  setActiveModal('none');
                }}
                className="w-full py-3 rounded-xl bg-[#0057B8] text-white font-extrabold text-sm shadow-md"
              >
                Send via NPSB Network
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 8: ALL 14 OPAY PAYMENT ACTIONABLE DEMO FORMS */}
      {/* ==================================================== */}
      {activeModal === 'payment_action' && paymentActionItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {paymentActionItem.icon && <paymentActionItem.icon className="w-8 h-8" />}
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{paymentActionItem.name}</h3>
                  <p className="text-xs text-slate-500">Official Opay Verified Payment Service</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('none')} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {actionSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-base font-black text-slate-900">{paymentActionItem.name} Successful!</h4>
                <p className="text-xs text-slate-500">Transaction ID: TXN-OPY-{Math.floor(100000 + Math.random() * 900000)}</p>
                <button
                  onClick={() => setActiveModal('none')}
                  className="px-6 py-2 rounded-xl bg-[#0057B8] text-white font-bold text-xs mt-3"
                >
                  Close Receipt
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {paymentActionItem.id === 'traffic'
                      ? 'Traffic Case Slip No / Vehicle Reg'
                      : paymentActionItem.id === 'toll'
                      ? 'Toll Plaza / Vehicle Category'
                      : paymentActionItem.id === 'metro_rail'
                      ? 'MRT Pass Card Number'
                      : paymentActionItem.id === 'education'
                      ? 'Student ID / Roll No'
                      : paymentActionItem.id === 'insurance'
                      ? 'Policy / Customer ID'
                      : 'Account / Reference / Slip ID'}
                  </label>
                  <input
                    type="text"
                    placeholder="Enter identification / ID"
                    value={serviceInput1}
                    onChange={(e) => setServiceInput1(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Amount in BDT (৳)</label>
                  <input
                    type="number"
                    value={serviceAmount}
                    onChange={(e) => setServiceAmount(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                  />
                </div>

                <button
                  onClick={() => {
                    sound.playSuccess();
                    setActionSuccess(true);
                  }}
                  className="w-full py-3 rounded-xl bg-[#0057B8] text-white font-extrabold text-sm shadow-md"
                >
                  Confirm {paymentActionItem.name}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
