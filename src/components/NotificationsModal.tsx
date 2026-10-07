import React from 'react';
import {
  Bell,
  X,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Gift,
  ArrowDownLeft,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { sound } from '../utils/audio';
import { Language } from '../types';

export interface NotificationItem {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  time: string;
  type: 'security' | 'promo' | 'txn' | 'system';
  isRead: boolean;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onOpenShield?: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  lang,
  onOpenShield,
}) => {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Welcome to Opay! Test Balance Loaded',
      titleBn: 'ওপে-তে স্বাগতম! ১,০০,০০০ ৳ টেস্ট ব্যালেন্স যুক্ত হয়েছে',
      description: 'BDT 100,000 has been credited to your Opay wallet for full feature testing.',
      descriptionBn: 'সকল ফিচার পরীক্ষা করার জন্য আপনার অ্যাকাউন্টে ১,০০,০০০ ৳ যুক্ত করা হয়েছে।',
      time: 'Just now',
      type: 'txn',
      isRead: false,
    },
    {
      id: 'notif-2',
      title: 'AI Scam Shield Active',
      titleBn: 'এআই প্রতারণা প্রতিরোধ সক্রিয়',
      description: 'Real-time neural style matching and call duration anomaly detector are guarding your account 24/7.',
      descriptionBn: 'রিয়েল-টাইম নিউরাল স্টাইল ম্যাচিং এবং কল ডুরেশন অ্যানোমালি ডিটেক্টর আপনার অ্যাকাউন্ট সার্বক্ষণিক পাহারা দিচ্ছে।',
      time: '12 mins ago',
      type: 'security',
      isRead: false,
    },
    {
      id: 'notif-3',
      title: '2-Minute Safe-Hold Escrow Protected',
      titleBn: '২-মিনিট সেইফ-হোল্ড প্রোটেকশন সক্রিয়',
      description: 'Voluntary safety buffer stops advance payment fraud and allows instant funds recall with proof.',
      descriptionBn: 'অ্যাডভান্স পেমেন্ট ফ্রড রুখতে সেইফটি বাফারের মাধ্যমে তাৎক্ষণিক টাকা ফেরতের সুরক্ষা সক্রিয়।',
      time: '1 hour ago',
      type: 'security',
      isRead: false,
    },
    {
      id: 'notif-4',
      title: 'Social Engineering Pattern Database Updated',
      titleBn: 'সোশ্যাল ইঞ্জিনিয়ারিং প্যাটার্ন ডাটাবেস আপডেট',
      description: 'AI model trained with latest Bangladesh Bank & Police impersonation fraud patterns.',
      descriptionBn: 'বাংলাদেশ ব্যাংক ও পুলিশ পরিচয় দেওয়া প্রতারণা রুখতে এআই মডেলের নতুন প্যাটার্ন আপডেট হয়েছে।',
      time: '3 hours ago',
      type: 'system',
      isRead: true,
    },
  ]);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    sound.playTap();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in select-none">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#0057B8] to-[#0089D0] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/15 backdrop-blur-xs">
              <Bell className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">
                {lang === 'bn' ? 'বিজ্ঞপ্তি ও নোটিফিকেশন' : 'Notifications & Alerts'}
              </h3>
              <p className="text-xs text-blue-100">
                {unreadCount > 0
                  ? lang === 'bn'
                    ? `${unreadCount} টি নতুন নোটিফিকেশন`
                    : `${unreadCount} unread notices`
                  : lang === 'bn'
                  ? 'সব নোটিফিকেশন পড়া হয়েছে'
                  : 'All notifications read'}
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

        {/* Action bar */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-500">
            {lang === 'bn' ? 'সাম্প্রতিক বিজ্ঞপ্তি' : 'Recent Updates'}
          </span>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[#0057B8] font-bold hover:underline"
            >
              {lang === 'bn' ? 'সবগুলো পড়া হয়েছে' : 'Mark all read'}
            </button>
          )}
        </div>

        {/* List */}
        <div className="p-3 space-y-2 overflow-y-auto flex-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                sound.playTap();
                setNotifications((prev) =>
                  prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item))
                );
                if (n.type === 'security' && onOpenShield) {
                  onClose();
                  onOpenShield();
                }
              }}
              className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                n.isRead
                  ? 'bg-white border-slate-100 hover:border-slate-200'
                  : 'bg-blue-50/60 border-blue-200 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    n.type === 'security'
                      ? 'bg-rose-100 text-rose-600'
                      : n.type === 'promo'
                      ? 'bg-amber-100 text-amber-600'
                      : n.type === 'txn'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-blue-100 text-[#0057B8]'
                  }`}
                >
                  {n.type === 'security' ? (
                    <ShieldAlert className="w-4 h-4" />
                  ) : n.type === 'promo' ? (
                    <Gift className="w-4 h-4" />
                  ) : n.type === 'txn' ? (
                    <ArrowDownLeft className="w-4 h-4" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4
                      className={`text-xs font-black truncate ${
                        n.isRead ? 'text-slate-800' : 'text-[#0057B8]'
                      }`}
                    >
                      {lang === 'bn' ? n.titleBn : n.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {lang === 'bn' ? n.descriptionBn : n.description}
                  </p>
                </div>
                {!n.isRead && (
                  <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5 animate-pulse" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-[#0057B8] hover:bg-[#004799] text-white text-xs font-black shadow-xs transition"
          >
            {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
