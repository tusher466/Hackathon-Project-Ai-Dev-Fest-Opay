import { Language } from '../types';

export function formatBdt(amount: number, lang: Language = 'en'): string {
  const formatted = new Intl.NumberFormat('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  if (lang === 'bn') {
    return '৳ ' + toBengaliNumerals(formatted);
  }
  return '৳ ' + formatted;
}

export function toBengaliNumerals(str: string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.replace(/[0-9]/g, (w) => bnDigits[parseInt(w, 10)]);
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimeAgo(timestamp: number, lang: Language = 'en'): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) {
    return lang === 'bn' ? 'এইমাত্র' : 'Just now';
  }
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return lang === 'bn' ? `${toBengaliNumerals(diffMin.toString())} মিনিট আগে` : `${diffMin}m ago`;
  }
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    return lang === 'bn' ? `${toBengaliNumerals(diffHours.toString())} ঘণ্টা আগে` : `${diffHours}h ago`;
  }
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}
