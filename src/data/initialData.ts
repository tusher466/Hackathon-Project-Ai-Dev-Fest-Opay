import { Transaction, EscrowHoldItem, AnalyzedEvent, BillProvider, MobileOperator } from '../types';
import { analyzeMessageOrCallLinguistics } from '../utils/scamAnalyzer';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-UPY-894102',
    type: 'send_money',
    title: 'Send Money to 01819-293847',
    titleBn: 'টাকা পাঠানো - ০১৮১৯-২৯৩৮৪৭',
    recipient: '01819-293847',
    recipientName: 'Rafiqul Islam (Brother)',
    amount: 3500,
    fee: 5,
    currency: 'BDT',
    timestamp: Date.now() - 1000 * 60 * 35,
    status: 'completed',
    reference: 'Family Support',
    category: 'Transfer',
  },
  {
    id: 'TXN-UPY-894050',
    type: 'pay_bill',
    title: 'DPDC Electricity Bill Paid',
    titleBn: 'ডিপিডিসি বিদ্যুৎ বিল পরিশোধ',
    recipient: 'DPDC Prepaid Meter #1820491',
    amount: 1850,
    fee: 0,
    currency: 'BDT',
    timestamp: Date.now() - 1000 * 60 * 180,
    status: 'completed',
    reference: 'Meter: 1820491',
    category: 'Utility Bill',
  },
  {
    id: 'TXN-UPY-893992',
    type: 'mobile_recharge',
    title: 'Grameenphone Mobile Recharge',
    titleBn: 'গ্রামীণফোন মোবাইল রিচার্জ',
    recipient: '01712-345678',
    amount: 499,
    fee: 0,
    currency: 'BDT',
    timestamp: Date.now() - 1000 * 60 * 60 * 8,
    status: 'completed',
    reference: '15 GB + 300 Mins Pack',
    category: 'Recharge',
  },
  {
    id: 'TXN-UPY-893821',
    type: 'cash_in',
    title: 'UCB Bank Card Cash In',
    titleBn: 'ইউসিবি ব্যাংক কার্ড ক্যাশ ইন',
    recipient: 'Self (Visa ****4102)',
    amount: 15000,
    fee: 0,
    currency: 'BDT',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    status: 'completed',
    reference: 'Bank Add Money',
    category: 'Cash In',
  },
];

export const INITIAL_ESCROW_ITEMS: EscrowHoldItem[] = [
  {
    id: 'ESC-77401',
    txId: 'TXN-UPY-894210',
    recipientNumber: '01912-883921',
    recipientName: 'Suspicious / Unknown Merchant',
    amount: 8500,
    currency: 'BDT',
    startTime: Date.now() - 1000 * 38, // 38 seconds ago
    totalDurationSeconds: 120, // 2 minutes
    remainingSeconds: 82, // 1m 22s left
    isCloudSynced: true,
    riskScore: 78,
    riskAssessment: 'HIGH',
    matchedScamFlag: 'Recipient number reported for fake online shop prepayment fraud',
    status: 'holding',
  },
];

// Helper to construct analyzed events using the true dynamic linguistic pattern matcher
function buildEvent(
  id: string,
  type: 'sms' | 'call',
  senderOrCaller: string,
  senderName: string,
  content: string,
  timestamp: string,
  callDurationSeconds?: number,
  isUnknownCaller?: boolean,
  isRead: boolean = false
): AnalyzedEvent {
  const analysis = analyzeMessageOrCallLinguistics({
    type,
    content,
    callerNumber: senderOrCaller,
    durationSeconds: callDurationSeconds || 0,
  });

  return {
    id,
    type,
    senderOrCaller,
    senderName,
    content,
    timestamp,
    callDurationSeconds,
    isUnknownCaller,
    threatScore: analysis.threatScore,
    threatLevel: analysis.threatLevel,
    normalStyleMatch: analysis.normalStyleMatch,
    scamStyleMatch: analysis.scamStyleMatch,
    classification: analysis.classification,
    redFlags: analysis.matchedScamFeatures,
    matchedNormalFeatures: analysis.matchedNormalFeatures,
    callDurationAssessment: analysis.callDurationAssessment,
    explanation: analysis.explanation,
    safetyTips: analysis.safetyTips,
    isRead,
    flaggedByAi: analysis.isScam,
  };
}

export const INITIAL_ANALYZED_EVENTS: AnalyzedEvent[] = [
  buildEvent(
    'AI-EVT-01',
    'sms',
    '+8801700998811',
    'Unknown (Purported Upay Helpdesk)',
    'অভিনন্দন! উপায় ৫ বছর পূর্তি উপলক্ষ্যে আপনি জিতেছেন ৫০,০০০ টাকা! টাকা এখনই একাউন্টে যোগ করতে ওটিপি কোডটি জানান অথবা কল করুন 01700998811.',
    '10 mins ago',
    undefined,
    undefined,
    false
  ),
  buildEvent(
    'AI-EVT-02',
    'call',
    '+44 7911 123456',
    'International VOIP Spoofed Caller',
    'Caller claimed to be Bangladesh Bank Compliance Inspector. Stated user account is under freeze investigation and demanded immediate dialing of USSD code *268*5*PIN# while keeping the phone on.',
    '25 mins ago',
    840, // 14 mins duration
    true,
    false
  ),
  buildEvent(
    'AI-EVT-03',
    'sms',
    '+8801822334455',
    'Unknown Number',
    'ভাই ভুল করে আপনার উপায় নাম্বারে ৫০০০ টাকা চলে গেছে! আমার মেয়ের চিকিৎসার টাকা ভাই। দয়া করে এখনই ০১৮২২৩৩৪৪৫৫ নাম্বারে ফেরত পাঠান!',
    '1 hour ago',
    undefined,
    undefined,
    true
  ),
  buildEvent(
    'AI-EVT-04',
    'sms',
    'Upay (16268)',
    'Official Upay Notification',
    'Your Upay account has been successfully credited with BDT 15,000 via UCB Bank Card Add Money. TxnID: TXN-UPY-893821. Available balance: BDT 42,850.00.',
    'Yesterday',
    undefined,
    undefined,
    true
  ),
  buildEvent(
    'AI-EVT-05',
    'call',
    '+8801711223344',
    'Farhana Sultana (Aunt)',
    'Brief 45-second phone conversation discussing Eid holiday visit and family dinner.',
    'Yesterday',
    45,
    false,
    true
  ),
];

export const BILL_PROVIDERS: BillProvider[] = [
  { id: 'dpdc', category: 'electricity', name: 'DPDC (Prepaid/Postpaid)', nameBn: 'ডিপিডিসি বিদ্যুৎ', logo: '⚡', billType: 'Electricity' },
  { id: 'desco', category: 'electricity', name: 'DESCO (Dhaka Electric)', nameBn: 'ডেসকো বিদ্যুৎ', logo: '💡', billType: 'Electricity' },
  { id: 'nesco', category: 'electricity', name: 'NESCO (Northern Electric)', nameBn: 'নেসকো বিদ্যুৎ', logo: '🔌', billType: 'Electricity' },
  { id: 'reb', category: 'electricity', name: 'Polli Bidyut (BREB)', nameBn: 'পল্লী বিদ্যুৎ', logo: '🌾', billType: 'Electricity' },
  { id: 'wasa_dhaka', category: 'water', name: 'Dhaka WASA', nameBn: 'ঢাকা ওয়াসা', logo: '💧', billType: 'Water' },
  { id: 'wasa_ctg', category: 'water', name: 'Chattogram WASA', nameBn: 'চট্টগ্রাম ওয়াসা', logo: '🌊', billType: 'Water' },
  { id: 'titas', category: 'gas', name: 'Titas Gas (Non-Metered & Prepaid)', nameBn: 'তিতাস গ্যাস', logo: '🔥', billType: 'Gas' },
  { id: 'link3', category: 'internet', name: 'Link3 Internet Broadband', nameBn: 'লিংকথ্রি ইন্টারনেট', logo: '🌐', billType: 'Internet' },
  { id: 'carnival', category: 'internet', name: 'Carnival Internet', nameBn: 'কার্নিভাল ইন্টারনেট', logo: '🚀', billType: 'Internet' },
  { id: 'du', category: 'education', name: 'Dhaka University (DU Fees)', nameBn: 'ঢাকা বিশ্ববিদ্যালয় ফি', logo: '🎓', billType: 'Education' },
  { id: 'nsu', category: 'education', name: 'North South University', nameBn: 'নর্থ সাউথ বিশ্ববিদ্যালয়', logo: '🏫', billType: 'Education' },
];

export const MOBILE_OPERATORS: MobileOperator[] = [
  { id: 'gp', name: 'Grameenphone', prefix: '017 / 013', color: 'text-sky-600', bgColor: 'bg-sky-50' },
  { id: 'robi', name: 'Robi Axiata', prefix: '018', color: 'text-red-600', bgColor: 'bg-red-50' },
  { id: 'banglalink', name: 'Banglalink', prefix: '019 / 014', color: 'text-amber-600', bgColor: 'bg-amber-50' },
  { id: 'teletalk', name: 'Teletalk Bangladesh', prefix: '015', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  { id: 'airtel', name: 'Airtel Bangladesh', prefix: '016', color: 'text-rose-600', bgColor: 'bg-rose-50' },
];
