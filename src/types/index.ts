export type Language = 'en' | 'bn';

export type TransactionType =
  | 'send_money'
  | 'cash_in'
  | 'cash_out'
  | 'mobile_recharge'
  | 'pay_bill'
  | 'merchant_pay'
  | 'remittance'
  | 'micro_pay'
  | 'cross_border_qr'
  | 'student_emi';

export type TransactionStatus =
  | 'completed'
  | 'in_escrow_hold'
  | 'recalled'
  | 'cancelled';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  titleBn: string;
  recipient: string;
  recipientName?: string;
  amount: number;
  fee: number;
  currency: 'BDT';
  timestamp: number;
  status: TransactionStatus;
  escrowExpiry?: number; // timestamp in ms
  escrowRemainingSeconds?: number;
  reference?: string;
  category?: string;
  fraudAlertReason?: string;
  recalledAt?: number;
  proofSubmitted?: {
    reason: string;
    evidenceText: string;
    caseNumber: string;
  };
}

export interface EscrowHoldItem {
  id: string;
  txId: string;
  recipientNumber: string;
  recipientName: string;
  amount: number;
  currency: 'BDT';
  startTime: number;
  totalDurationSeconds: number; // 2 mins = 120 seconds
  remainingSeconds: number;
  isCloudSynced: boolean;
  riskScore: number;
  riskAssessment: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  matchedScamFlag?: string;
  status: 'holding' | 'approved' | 'recalled';
}

export interface AnalyzedEvent {
  id: string;
  type: 'sms' | 'call';
  senderOrCaller: string;
  senderName?: string;
  content: string;
  timestamp: string;
  callDurationSeconds?: number;
  isUnknownCaller?: boolean;
  threatScore: number;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  normalStyleMatch?: number;
  scamStyleMatch?: number;
  classification: string;
  redFlags: string[];
  matchedNormalFeatures?: string[];
  explanation: string;
  safetyTips: string[];
  callDurationAssessment?: string;
  isRead: boolean;
  flaggedByAi: boolean;
}

export interface BillProvider {
  id: string;
  category: 'electricity' | 'water' | 'gas' | 'internet' | 'education';
  name: string;
  nameBn: string;
  logo: string;
  billType: string;
}

export interface MobileOperator {
  id: string;
  name: string;
  prefix: string;
  color: string;
  bgColor: string;
}
