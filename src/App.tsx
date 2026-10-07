import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NavigationTabs, TabKey } from './components/NavigationTabs';
import { MfsHub } from './components/MfsHub';
import { AiScamShield } from './components/AiScamShield';
import { EscrowVault } from './components/EscrowVault';
import { TransactionHistory } from './components/TransactionHistory';
import { BiometricModal } from './components/BiometricModal';
import { BanglaQRModal } from './components/BanglaQRModal';
import { AccountProfileView } from './components/AccountProfileView';
import { NotificationsModal } from './components/NotificationsModal';
import { FraudTrendsDashboard } from './components/FraudTrendsDashboard';
import {
  Transaction,
  EscrowHoldItem,
  AnalyzedEvent,
  Language,
  BillProvider
} from './types';
import {
  INITIAL_TRANSACTIONS,
  INITIAL_ESCROW_ITEMS,
  INITIAL_ANALYZED_EVENTS
} from './data/initialData';
import { sound } from './utils/audio';
import { analyzeMessageOrCallLinguistics } from './utils/scamAnalyzer';
import { fraudMLService } from './ml/fraudMLPipeline';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<TabKey>('mfs');
  // 100,000 BDT in account as requested to test every option
  const [fiatBalance, setFiatBalance] = useState<number>(100000.0);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [escrowItems, setEscrowItems] = useState<EscrowHoldItem[]>(INITIAL_ESCROW_ITEMS);
  const [analyzedEvents, setAnalyzedEvents] = useState<AnalyzedEvent[]>(INITIAL_ANALYZED_EVENTS);

  // User details
  const [userName, setUserName] = useState<string>('Akash');
  const [userPhone, setUserPhone] = useState<string>('01312563458');

  // Bangla QR modal state
  const [banglaQrOpen, setBanglaQrOpen] = useState<boolean>(false);

  // Notification Modal state
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);

  // Biometric prompt state
  const [biometricOpen, setBiometricOpen] = useState(false);
  const [biometricConfig, setBiometricConfig] = useState<{
    actionTitle: string;
    actionTitleBn: string;
    amount?: number;
    currency?: string;
    onConfirmed: () => void;
  }>({
    actionTitle: '',
    actionTitleBn: '',
    onConfirmed: () => {},
  });

  // Ticking countdown effect for 2-minute Escrow items
  useEffect(() => {
    const timer = setInterval(() => {
      setEscrowItems((prevItems) =>
        prevItems.map((item) => {
          if (item.status === 'holding' && item.remainingSeconds > 0) {
            return {
              ...item,
              remainingSeconds: item.remainingSeconds - 1,
            };
          }
          return item;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerBiometricAuth = (config: {
    actionTitle: string;
    actionTitleBn: string;
    amount?: number;
    currency?: string;
    onConfirmed: () => void;
  }) => {
    setBiometricConfig(config);
    setBiometricOpen(true);
  };

  // SEND MONEY INITIATION (CONNECTED DIRECTLY TO TRAINED ML FRAUD MODEL)
  const handleInitiateSendMoney = ({
    recipient,
    recipientName,
    amount,
    reference,
    use20MinEscrow,
  }: {
    recipient: string;
    recipientName: string;
    amount: number;
    reference: string;
    use20MinEscrow: boolean;
  }) => {
    // Check if the contact is a close relative (Ma, Ammu, Mom, Abbu, Mother, Father, Brother, Baba, Sister, etc.)
    const isCloseRelative = /(ma|ammu|mom|abbu|mother|father|brother|baba|sister|bhai|bon|chachi|mama|khala|wife|husband|son|daughter|family|আম্মু|মা|আব্বু|বাবা|ভাই|বোন)/i.test(
      recipientName || recipient
    );

    // Run inference through trained GBDT + Isolation Forest pipeline
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 1 && currentHour <= 5 ? 1 : 0;
    const isUnverified = !isCloseRelative && (recipient.includes('Unknown') || !recipient.startsWith('017')) ? 1 : 0;

    const mlEval = fraudMLService.predict({
      amount,
      hourOfDay: currentHour,
      isNightHours: isNight,
      isUnverifiedRecipient: isUnverified,
      recipientVelocity1h: isUnverified ? 4 : 0,
      amountToBalanceRatio: Math.min(1.0, amount / fiatBalance),
    });

    // ML Decision Path influences the live transaction:
    // If high-risk anomaly detected by ML, enforce 2-Min Safe Escrow and Biometric Lock!
    const isMlHighRisk = mlEval.decision === 'BIOMETRIC_LOCK' || mlEval.decision === 'AUTO_ESCROW_HOLD';
    const shouldHoldInEscrow = (use20MinEscrow || isMlHighRisk) && !isCloseRelative;

    const actionTitle = isMlHighRisk
      ? `🚨 [ML Shield: ${mlEval.compositeRiskScore}% Risk] ${mlEval.reason}`
      : shouldHoldInEscrow
      ? `Authorize 2-Min Safe Escrow of ৳ ${amount}`
      : `Confirm Instant Send Money of ৳ ${amount}`;

    const actionTitleBn = isMlHighRisk
      ? `🚨 [এআই এমএল অ্যালার্ট: ${mlEval.compositeRiskScore}% ঝুঁকি] বাধ্যতামূলক বায়োমেট্রিক ও ২-মি. সেইফ হোল্ড`
      : shouldHoldInEscrow
      ? `২-মিনিট সেইফ-হোল্ডে ৳ ${amount} নিশ্চিত করুন`
      : `তাৎক্ষণিক টাকা পাঠানো নিশ্চিত করুন ৳ ${amount}`;

    triggerBiometricAuth({
      actionTitle,
      actionTitleBn,
      amount,
      currency: 'BDT',
      onConfirmed: () => {
        const txnId = `TXN-OPY-${Math.floor(100000 + Math.random() * 900000)}`;

        if (shouldHoldInEscrow) {
          // Put in 2-minute Escrow Hold
          setFiatBalance((prev) => prev - amount);

          const newEscrowItem: EscrowHoldItem = {
            id: `ESC-${Math.floor(10000 + Math.random() * 90000)}`,
            txId: txnId,
            recipientNumber: recipient,
            recipientName: recipientName || 'Opay Recipient',
            amount,
            currency: 'BDT',
            startTime: Date.now(),
            totalDurationSeconds: 120, // 2 minutes
            remainingSeconds: 120,
            isCloudSynced: true,
            riskScore: mlEval.compositeRiskScore,
            riskAssessment: isMlHighRisk ? 'CRITICAL' : 'LOW',
            matchedScamFlag: isMlHighRisk ? mlEval.reason : undefined,
            status: 'holding',
          };

          const newTxn: Transaction = {
            id: txnId,
            type: 'send_money',
            title: `Safe-Hold Send to ${recipient}`,
            titleBn: `${recipient} নম্বরে সেইফ-হোল্ড পাঠানো`,
            recipient,
            recipientName,
            amount,
            fee: 5,
            currency: 'BDT',
            timestamp: Date.now(),
            status: 'in_escrow_hold',
            reference,
            category: 'Transfer',
          };

          setEscrowItems((prev) => [newEscrowItem, ...prev]);
          setTransactions((prev) => [newTxn, ...prev]);
          setActiveTab('escrow');
        } else {
          // Direct send completed (Holding period bypassed for trusted family / standard direct)
          setFiatBalance((prev) => prev - amount);
          const newTxn: Transaction = {
            id: txnId,
            type: 'send_money',
            title: isCloseRelative
              ? `Send Money to ${recipientName || recipient} (Family Bypass)`
              : `Send Money to ${recipient}`,
            titleBn: isCloseRelative
              ? `${recipientName || recipient} নম্বরে পাঠানো (নিকটাত্মীয় বাইপাস)`
              : `${recipient} নম্বরে টাকা পাঠানো`,
            recipient,
            recipientName,
            amount,
            fee: 5,
            currency: 'BDT',
            timestamp: Date.now(),
            status: 'completed',
            reference,
            category: 'Transfer',
          };
          setTransactions((prev) => [newTxn, ...prev]);
          sound.playSuccess();
        }
      },
    });
  };

  // RE-CONFIRM & APPROVE ESCROW TRANSACTION
  const handleApproveEscrow = (item: EscrowHoldItem) => {
    triggerBiometricAuth({
      actionTitle: `Final Approval: Release ৳ ${item.amount} to ${item.recipientNumber}`,
      actionTitleBn: `চূড়ান্ত অনুমোদন: ${item.recipientNumber} নম্বরে ৳ ${item.amount} রিলিজ`,
      amount: item.amount,
      currency: 'BDT',
      onConfirmed: () => {
        setEscrowItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'approved' } : i))
        );
        setTransactions((prev) =>
          prev.map((tx) =>
            tx.id === item.txId ? { ...tx, status: 'completed' } : tx
          )
        );
        sound.playSuccess();
      },
    });
  };

  // RECALL ESCROW TRANSACTION WITH FRAUD PROOF
  const handleRecallEscrow = (
    item: EscrowHoldItem,
    proofData: { reason: string; evidenceText: string; caseNumber: string }
  ) => {
    // 100% Refund back to user's balance
    setFiatBalance((prev) => prev + item.amount);

    setEscrowItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'recalled' } : i))
    );

    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === item.txId
          ? {
              ...tx,
              status: 'recalled',
              title: `RECALLED: Fraud Dispute Refund (${item.recipientNumber})`,
              titleBn: `রিফান্ড: প্রতারণা দাবি ফেরত (${item.recipientNumber})`,
              proofSubmitted: proofData,
            }
          : tx
      )
    );
  };

  // CASH IN
  const handleCashIn = (amount: number, source: string) => {
    setFiatBalance((prev) => prev + amount);
    const txnId = `TXN-OPY-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTxn: Transaction = {
      id: txnId,
      type: 'cash_in',
      title: `${source} Cash In`,
      titleBn: `${source} ক্যাশ ইন`,
      recipient: 'Opay Wallet Balance',
      amount,
      fee: 0,
      currency: 'BDT',
      timestamp: Date.now(),
      status: 'completed',
      category: 'Cash In',
    };
    setTransactions((prev) => [newTxn, ...prev]);
    sound.playSuccess();
  };

  // CASH OUT
  const handleCashOut = (amount: number, agentNumber: string) => {
    const fee = Math.round((amount / 1000) * 14); // 14 Tk per 1000 Tk
    triggerBiometricAuth({
      actionTitle: `Authorize Cash Out ৳ ${amount} (Fee: ৳ ${fee})`,
      actionTitleBn: `ক্যাশ আউট অনুমোদন ৳ ${amount} (ফি: ৳ ${fee})`,
      amount,
      currency: 'BDT',
      onConfirmed: () => {
        setFiatBalance((prev) => prev - (amount + fee));
        const txnId = `TXN-OPY-${Math.floor(100000 + Math.random() * 900000)}`;
        const newTxn: Transaction = {
          id: txnId,
          type: 'cash_out',
          title: `Cash Out via Agent ${agentNumber}`,
          titleBn: `এজেন্ট ${agentNumber} এ ক্যাশ আউট`,
          recipient: agentNumber,
          amount,
          fee,
          currency: 'BDT',
          timestamp: Date.now(),
          status: 'completed',
          category: 'Cash Out',
        };
        setTransactions((prev) => [newTxn, ...prev]);
        sound.playSuccess();
      },
    });
  };

  // MOBILE RECHARGE
  const handleMobileRecharge = (
    amount: number,
    operator: string,
    phone: string,
    packName?: string
  ) => {
    setFiatBalance((prev) => prev - amount);
    const txnId = `TXN-OPY-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTxn: Transaction = {
      id: txnId,
      type: 'mobile_recharge',
      title: `${operator.toUpperCase()} Recharge to ${phone}`,
      titleBn: `${phone} নম্বরে রিচার্জ (${operator.toUpperCase()})`,
      recipient: phone,
      amount,
      fee: 0,
      currency: 'BDT',
      timestamp: Date.now(),
      status: 'completed',
      reference: packName,
      category: 'Recharge',
    };
    setTransactions((prev) => [newTxn, ...prev]);
    sound.playSuccess();
  };

  // PAY BILL
  const handlePayBill = (bill: BillProvider, billNo: string, amount: number) => {
    triggerBiometricAuth({
      actionTitle: `Pay Bill ৳ ${amount} to ${bill.name}`,
      actionTitleBn: `${bill.nameBn} বিল পরিশোধ ৳ ${amount}`,
      amount,
      currency: 'BDT',
      onConfirmed: () => {
        setFiatBalance((prev) => prev - amount);
        const txnId = `TXN-OPY-${Math.floor(100000 + Math.random() * 900000)}`;
        const newTxn: Transaction = {
          id: txnId,
          type: 'pay_bill',
          title: `${bill.name} Bill Paid`,
          titleBn: `${bill.nameBn} বিল পরিশোধ`,
          recipient: `${bill.name} (#${billNo})`,
          amount,
          fee: 0,
          currency: 'BDT',
          timestamp: Date.now(),
          status: 'completed',
          category: 'Utility Bill',
        };
        setTransactions((prev) => [newTxn, ...prev]);
        sound.playSuccess();
      },
    });
  };

  // SIMULATE LIVE INCOMING FEED WITH DYNAMIC NEURAL ANALYSIS
  const handleSimulateIncoming = (type: 'call' | 'sms', variant: 'scam' | 'safe') => {
    const id = `SIM-${Date.now()}`;
    let content = '';
    let senderOrCaller = '';
    let senderName = '';
    let durationSeconds = 0;
    let isUnknownCaller = false;

    if (variant === 'scam') {
      sound.playScamAlert();
      if (type === 'call') {
        const randomSeconds = 640 + Math.floor(Math.random() * 260); // 10-15 mins
        senderOrCaller = '+88019' + Math.floor(10000000 + Math.random() * 90000000);
        senderName = 'Coercive Voice Phishing Impersonator';
        content = `Caller claimed to be Opay Central Security Team. Warned customer their account is flagged for illegal transactions. Applied aggressive psychological pressure over ${Math.floor(randomSeconds / 60)} minutes, urging customer to read out the received 6-digit OTP code immediately.`;
        durationSeconds = randomSeconds;
        isUnknownCaller = true;
      } else {
        const scamVariants = [
          'আপনার জাতীয় পরিচয়পত্রের বিপরীতে সরকারি অনুদান ২৫,০০০ টাকা বরাদ্দ হয়েছে। এখনই লিংকটিতে ঢুকে পিন দিয়ে টাকা সংগ্রহ করুন: http://opay-gov-grant.top',
          'অভিনন্দন! ওপে পূর্তি উপলক্ষ্যে আপনি জিতেছেন ৫০,০০০ টাকা লটারি পুরস্কার! টাকা নিতে এখনই ওটিপি জানান অথবা ডায়াল করুন *২৬৮*৫*পিন#।',
          'ভাই ভুল করে আপনার ওপে নাম্বারে ৫০০০ টাকা চলে গেছে! আমার মেয়ের চিকিৎসার টাকা ভাই। দয়া করে এখনই ০১৮২২৩৩৪৪৫৫ নাম্বারে ফেরত পাঠান!',
          'Opay Security Alert: Your wallet is scheduled to be frozen in 24 hours. Immediately verify your 4-digit PIN and OTP at: https://opay-verify-account.xyz',
        ];
        content = scamVariants[Math.floor(Math.random() * scamVariants.length)];
        senderOrCaller = '+88017' + Math.floor(10000000 + Math.random() * 90000000);
        senderName = 'Suspicious Unregistered SIM';
      }
    } else {
      sound.playTap();
      if (type === 'call') {
        durationSeconds = 35 + Math.floor(Math.random() * 55); // 35 - 90 seconds
        senderOrCaller = '+880171' + Math.floor(1000000 + Math.random() * 9000000);
        senderName = 'Family / Trusted Friend';
        content = `Standard casual ${durationSeconds}-second check-in call discussing dinner plans and weekend family meetup.`;
        isUnknownCaller = false;
      } else {
        const safeVariants = [
          `Your Opay account has been successfully credited with BDT ${Math.floor(500 + Math.random() * 8000)}.00. TxnID: TXN-OPY-${Math.floor(100000 + Math.random() * 900000)}. Available balance: BDT ${fiatBalance}.00. Never share your PIN.`,
          'Dear Customer, your biometric security preferences were updated successfully. Opay Helpline: 16268.',
          'Assalamu Alaikum, please send 500 Tk for household grocery items when you get free time. Thanks!',
        ];
        content = safeVariants[Math.floor(Math.random() * safeVariants.length)];
        senderOrCaller = content.includes('TxnID') ? '16268 (Opay)' : '+880181' + Math.floor(1000000 + Math.random() * 9000000);
        senderName = content.includes('TxnID') ? 'Official Opay Gateway' : 'Personal Contact';
      }
    }

    // Genuinely run through dynamic linguistic and behavioral analysis engine
    const analysis = analyzeMessageOrCallLinguistics({
      type,
      content,
      callerNumber: senderOrCaller,
      durationSeconds,
    });

    const newEvt: AnalyzedEvent = {
      id,
      type,
      senderOrCaller,
      senderName,
      content,
      timestamp: 'Just now',
      callDurationSeconds: type === 'call' ? durationSeconds : undefined,
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
      isRead: false,
      flaggedByAi: analysis.isScam,
    };

    setAnalyzedEvents((prev) => [newEvt, ...prev]);
  };

  // Add custom analyzed event to monitored feed
  const handleAddAnalyzedEvent = (evt: AnalyzedEvent) => {
    setAnalyzedEvents((prev) => [evt, ...prev]);
    sound.playSuccess();
  };

  // Live re-analysis of all monitored feed events
  const handleReanalyzeAllEvents = () => {
    setAnalyzedEvents((prev) =>
      prev.map((e) => {
        const analysis = analyzeMessageOrCallLinguistics({
          type: e.type,
          content: e.content,
          callerNumber: e.senderOrCaller,
          durationSeconds: e.callDurationSeconds || 0,
        });
        return {
          ...e,
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
          flaggedByAi: analysis.isScam,
        };
      })
    );
    sound.playSuccess();
  };

  const handleBlockNumber = (num: string) => {
    sound.playTap();
    alert(`Number ${num} has been added to Bangladesh Police & Opay Central Fraud Blacklist.`);
  };

  const unreadAlertsCount = analyzedEvents.filter(
    (e) => !e.isRead && e.threatScore >= 50
  ).length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Official Header */}
      <Header
        balance={fiatBalance}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'en' ? 'bn' : 'en'))}
        activeEscrowItems={escrowItems}
        unreadAlertsCount={unreadAlertsCount}
        onOpenEscrow={() => setActiveTab('escrow')}
        onOpenShield={() => setActiveTab('shield')}
        onOpenNotifications={() => setNotificationsOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Navigation Tabs Bar */}
      <NavigationTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenBanglaQR={() => setBanglaQrOpen(true)}
        lang={lang}
        escrowCount={escrowItems.filter((i) => i.status === 'holding').length}
        threatsCount={unreadAlertsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'mfs' && (
          <MfsHub
            balance={fiatBalance}
            lang={lang}
            onInitiateSendMoney={handleInitiateSendMoney}
            onCashIn={handleCashIn}
            onCashOut={handleCashOut}
            onMobileRecharge={handleMobileRecharge}
            onPayBill={handlePayBill}
            onOpenEscrowTab={() => setActiveTab('escrow')}
            onOpenBanglaQR={() => setBanglaQrOpen(true)}
            onOpenTrendsTab={() => setActiveTab('trends')}
          />
        )}

        {activeTab === 'account' && (
          <AccountProfileView
            userName={userName}
            userPhone={userPhone}
            balance={fiatBalance}
            lang={lang}
            onOpenEscrow={() => setActiveTab('escrow')}
            onOpenShield={() => setActiveTab('shield')}
          />
        )}

        {activeTab === 'shield' && (
          <AiScamShield
            events={analyzedEvents}
            lang={lang}
            onBlockNumber={handleBlockNumber}
            onSimulateIncoming={handleSimulateIncoming}
            onAddEvent={handleAddAnalyzedEvent}
            onReanalyzeAll={handleReanalyzeAllEvents}
          />
        )}

        {activeTab === 'trends' && (
          <FraudTrendsDashboard
            lang={lang}
            onOpenShield={() => setActiveTab('shield')}
            onOpenEscrow={() => setActiveTab('escrow')}
          />
        )}

        {activeTab === 'escrow' && (
          <EscrowVault
            escrowItems={escrowItems}
            lang={lang}
            onApproveEscrow={handleApproveEscrow}
            onRecallEscrow={handleRecallEscrow}
            onNewSendMoney={() => setActiveTab('mfs')}
          />
        )}

        {activeTab === 'history' && (
          <TransactionHistory
            transactions={transactions}
            lang={lang}
          />
        )}
      </main>

      {/* Bangla QR Interactive Modal */}
      <BanglaQRModal
        isOpen={banglaQrOpen}
        onClose={() => setBanglaQrOpen(false)}
        userName={userName}
        userPhone={userPhone}
        onScanMerchant={(name, num) => {
          alert(`Scanned Merchant QR for "${name}" (${num}) successfully! Ready to make payment.`);
          setActiveTab('mfs');
        }}
      />

      {/* Reusable Biometric Verification Modal */}
      <BiometricModal
        isOpen={biometricOpen}
        onClose={() => setBiometricOpen(false)}
        onSuccess={() => {
          setBiometricOpen(false);
          biometricConfig.onConfirmed();
        }}
        actionTitle={biometricConfig.actionTitle}
        actionTitleBn={biometricConfig.actionTitleBn}
        amount={biometricConfig.amount}
        currency={biometricConfig.currency}
        lang={lang}
      />

      {/* Notifications Modal (Actionable Notification Bell) */}
      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        lang={lang}
        onOpenShield={() => {
          setNotificationsOpen(false);
          setActiveTab('shield');
        }}
      />

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs text-center pb-24">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-slate-200">
              Opay MFS (UCB Fintech) • Bangladesh Bank Regulated • AI Shield Active
            </span>
          </div>
          <p className="text-slate-500 max-w-xl mx-auto">
            Protected by Opay 2-Minute Safe-Hold Escrow Delay & Real-time Neural Fraud Screening. Helpline: 16268 | BTRC Cyber Defense: 16216.
          </p>
        </div>
      </footer>
    </div>
  );
}
