import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// ==========================================
// 1. MAIN UPAY CIRCULAR AVATAR LOGO
// ==========================================
export const UpayAppLogoCircle: React.FC<{ size?: number; className?: string }> = ({
  size = 46,
  className = '',
}) => (
  <div
    style={{ width: size, height: size }}
    className={`rounded-full bg-white flex flex-col items-center justify-center p-1 shadow-sm shrink-0 border border-amber-200 select-none ${className}`}
  >
    <svg viewBox="0 0 40 28" className="w-6 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Two top dots */}
      <circle cx="12" cy="6" r="3.2" fill="#FFC700" />
      <circle cx="28" cy="6" r="3.2" fill="#0057B8" />
      {/* 'u' smile curve: left yellow, right blue */}
      <path
        d="M12 12V18C12 21.3137 14.6863 24 18 24H20"
        stroke="#FFC700"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M20 24H22C25.3137 24 28 21.3137 28 18V12"
        stroke="#0057B8"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
    <span className="text-[8.5px] font-black tracking-tight text-slate-900 leading-none mt-0.5">
      Opay
    </span>
  </div>
);

// ==========================================
// 2. MAIN SERVICES (SECTION 1)
// ==========================================

// সেন্ড মানি (Send Money) - Cyan banknote with ৳ and arrow
export const IconSendMoney: React.FC<IconProps> = ({ className = 'w-11 h-11' }) => (
  <svg viewBox="0 0 54 54" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="14" width="42" height="26" rx="5" fill="#E0F7FA" stroke="#00BCD4" strokeWidth="2.5" />
    <circle cx="27" cy="27" r="7" stroke="#00ACC1" strokeWidth="2" fill="#B2EBF2" />
    <text x="27" y="31.5" textAnchor="middle" fill="#00838F" fontSize="11" fontWeight="bold" fontFamily="sans-serif">৳</text>
    {/* Sending arrows */}
    <path d="M42 12L48 18M48 18L42 24M48 18H36" stroke="#0097A7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// মোবাইল রিচার্জ (Mobile Recharge) - Smartphone with ৳ and wave
export const IconMobileRecharge: React.FC<IconProps> = ({ className = 'w-11 h-11' }) => (
  <svg viewBox="0 0 54 54" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="6" width="24" height="42" rx="4" fill="#E0F7FA" stroke="#00BCD4" strokeWidth="2.5" />
    <rect x="19" y="12" width="16" height="28" rx="2" fill="#FFFFFF" />
    {/* Taka symbol in phone screen */}
    <rect x="13" y="20" width="28" height="13" rx="2.5" fill="#4DD0E1" stroke="#0097A7" strokeWidth="1.5" />
    <text x="27" y="30" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">৳</text>
    <circle cx="27" cy="44" r="1.5" fill="#00838F" />
  </svg>
);

// ক্যাশ আউট (Cash Out) - Two phones / cash popping out
export const IconCashOut: React.FC<IconProps> = ({ className = 'w-11 h-11' }) => (
  <svg viewBox="0 0 54 54" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Back phone */}
    <rect x="23" y="10" width="20" height="34" rx="3.5" fill="#FFCCBC" stroke="#FF7043" strokeWidth="2" />
    {/* Front phone */}
    <rect x="11" y="14" width="20" height="34" rx="3.5" fill="#E0F7FA" stroke="#00BCD4" strokeWidth="2.5" />
    {/* Outgoing cash / arrow */}
    <path d="M21 24V10M21 10L17 14M21 10L25 14" stroke="#00838F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="29" y="6" width="14" height="9" rx="1.5" fill="#4DD0E1" stroke="#00ACC1" strokeWidth="1.5" />
  </svg>
);

// পে বিল (Pay Bill) - Phone with utility receipt
export const IconPayBill: React.FC<IconProps> = ({ className = 'w-11 h-11' }) => (
  <svg viewBox="0 0 54 54" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="6" width="26" height="42" rx="4" fill="#E0F7FA" stroke="#00BCD4" strokeWidth="2.5" />
    {/* Receipt with water & flame */}
    <path d="M19 14H35M19 19H31M19 24H27" stroke="#0097A7" strokeWidth="2" strokeLinecap="round" />
    {/* Flame / water droplet icon */}
    <path d="M27 30C27 33 24 37 27 40C30 37 31 34 27 30Z" fill="#FF7043" />
    <path d="M22 34C22 36 20 38 22 40C24 38 25 36 22 34Z" fill="#29B6F6" />
  </svg>
);

// অ্যাড মানি (Add Money) - Purple cards/wallet with '+' circle
export const IconAddMoney: React.FC<IconProps> = ({ className = 'w-11 h-11' }) => (
  <svg viewBox="0 0 54 54" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="16" y="8" width="28" height="28" rx="4" fill="#EDE7F6" stroke="#7E57C2" strokeWidth="2" />
    <rect x="10" y="14" width="28" height="28" rx="4" fill="#D1C4E9" stroke="#5E35B1" strokeWidth="2.5" />
    {/* Plus circle badge */}
    <circle cx="16" cy="34" r="7" fill="#FFFFFF" stroke="#5E35B1" strokeWidth="2" />
    <path d="M16 30V38M12 34H20" stroke="#5E35B1" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// সঞ্চয় (Savings) - Orange/brown pouch with ৳ coins
export const IconSavings: React.FC<IconProps> = ({ className = 'w-11 h-11' }) => (
  <svg viewBox="0 0 54 54" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Pouch body */}
    <path
      d="M12 24C12 18 16 16 27 16C38 16 42 18 42 24C42 36 38 42 27 42C16 42 12 36 12 24Z"
      fill="#FFB74D"
      stroke="#E65100"
      strokeWidth="2.5"
    />
    {/* Pouch rim / clasp */}
    <rect x="18" y="13" width="18" height="6" rx="2" fill="#FFA726" stroke="#E65100" strokeWidth="2" />
    {/* ৳ symbol on pouch */}
    <text x="27" y="32" textAnchor="middle" fill="#BF360C" fontSize="12" fontWeight="black" fontFamily="sans-serif">৳</text>
    {/* Gold coins */}
    <circle cx="18" cy="12" r="4" fill="#FFD54F" stroke="#FF8F00" strokeWidth="1.5" />
    <circle cx="36" cy="12" r="4" fill="#FFD54F" stroke="#FF8F00" strokeWidth="1.5" />
  </svg>
);

// ফান্ড ট্রান্সফার (Fund Transfer) - Bank building connected to phone
export const IconFundTransfer: React.FC<IconProps> = ({ className = 'w-11 h-11' }) => (
  <svg viewBox="0 0 54 54" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Phone */}
    <rect x="6" y="16" width="16" height="28" rx="2.5" fill="#E0F7FA" stroke="#00BCD4" strokeWidth="2" />
    {/* Bank building */}
    <path d="M30 16L45 10L60 16" stroke="#00ACC1" strokeWidth="2" strokeLinecap="round" />
    <rect x="33" y="15" width="24" height="20" rx="2" fill="#E0F2F1" stroke="#00897B" strokeWidth="2" />
    {/* Columns */}
    <path d="M37 20V30M43 20V30M49 20V30M53 20V30" stroke="#00897B" strokeWidth="2" />
    {/* Transfer arrow */}
    <path d="M18 16C24 10 32 10 36 14" stroke="#FF7043" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
    <path d="M36 14L32 13M36 14L35 18" stroke="#FF7043" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// রিকোয়েস্ট মানি (Request Money) - Circular ৳ with request hand
export const IconRequestMoney: React.FC<IconProps> = ({ className = 'w-11 h-11' }) => (
  <svg viewBox="0 0 54 54" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="27" cy="27" r="18" fill="#E0F7FA" stroke="#00BCD4" strokeWidth="2.5" />
    {/* Central circle with taka */}
    <circle cx="27" cy="27" r="10" fill="#4DD0E1" />
    <text x="27" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="sans-serif">৳</text>
    {/* Curved request arrows */}
    <path d="M14 27A13 13 0 0 1 27 14" stroke="#00838F" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M14 27L17 23M14 27L11 23" stroke="#00838F" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// মেক পেমেন্ট (Make Payment) - QR stand & phone scanning
export const IconMakePayment: React.FC<IconProps> = ({ className = 'w-11 h-11' }) => (
  <svg viewBox="0 0 54 54" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* QR stand */}
    <rect x="8" y="10" width="22" height="26" rx="2.5" fill="#E0F7FA" stroke="#00BCD4" strokeWidth="2" />
    {/* Small QR glyphs */}
    <rect x="12" y="14" width="6" height="6" fill="#00838F" />
    <rect x="20" y="14" width="6" height="6" fill="#00838F" />
    <rect x="12" y="22" width="6" height="6" fill="#00838F" />
    <rect x="20" y="24" width="4" height="4" fill="#00838F" />
    {/* Phone scanning on the right */}
    <rect x="22" y="16" width="18" height="30" rx="3" fill="#FFFFFF" stroke="#0097A7" strokeWidth="2" />
    <path d="M26 22H36M26 28H36" stroke="#26A69A" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// রেফার & আর্ন (Refer & Earn) - Person profile with clipboard & ৳
export const IconReferEarn: React.FC<IconProps> = ({ className = 'w-11 h-11' }) => (
  <svg viewBox="0 0 54 54" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Person head */}
    <circle cx="18" cy="18" r="6" fill="#42A5F5" stroke="#1565C0" strokeWidth="2" />
    <path d="M10 38C10 30 14 28 18 28C22 28 26 30 26 38" fill="#90CAF9" stroke="#1565C0" strokeWidth="2" />
    {/* Clipboard with ৳ */}
    <rect x="26" y="14" width="20" height="28" rx="3" fill="#E8F5E9" stroke="#2E7D32" strokeWidth="2" />
    <rect x="31" y="11" width="10" height="5" rx="1.5" fill="#66BB6A" />
    <text x="36" y="32" textAnchor="middle" fill="#1B5E20" fontSize="12" fontWeight="black" fontFamily="sans-serif">৳</text>
  </svg>
);

// এনপিএসবি (NPSB) - Official Bangladesh Bank NPSB Logo
export const IconNPSB: React.FC<IconProps> = ({ className = 'w-11 h-11' }) => (
  <svg viewBox="0 0 54 54" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Three dynamic swooshes: Red, Green, Blue */}
    <path d="M10 22C14 14 24 12 30 18" stroke="#E53935" strokeWidth="3" strokeLinecap="round" />
    <path d="M10 27C15 20 28 17 38 24" stroke="#43A047" strokeWidth="3" strokeLinecap="round" />
    <path d="M10 32C18 26 32 23 44 28" stroke="#1E88E5" strokeWidth="3" strokeLinecap="round" />
    {/* NPSB text */}
    <text x="27" y="44" textAnchor="middle" fill="#1A237E" fontSize="10" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">
      NPSB
    </text>
  </svg>
);

// ==========================================
// 3. UPAY PAYMENT (SECTION 2)
// ==========================================

// ট্রাফিক ফাইন (Traffic Fine) - Traffic lights on pole + ticket
export const IconTrafficFine: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Traffic light box */}
    <rect x="14" y="6" width="12" height="26" rx="3" fill="#E8F5E9" stroke="#43A047" strokeWidth="2" />
    <circle cx="20" cy="11" r="2.5" fill="#E53935" />
    <circle cx="20" cy="19" r="2.5" fill="#FDD835" />
    <circle cx="20" cy="27" r="2.5" fill="#43A047" />
    <path d="M20 32V42" stroke="#43A047" strokeWidth="2.5" />
    {/* Fine document */}
    <rect x="25" y="16" width="15" height="20" rx="2" fill="#FFFFFF" stroke="#66BB6A" strokeWidth="1.5" />
    <path d="M28 22H36M28 26H34M28 30H36" stroke="#43A047" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// টোল পেমেন্ট (Toll Payment) - Highway barrier toll gate
export const IconTollPayment: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Toll booth */}
    <rect x="24" y="14" width="14" height="24" rx="2" fill="#E0F7FA" stroke="#00ACC1" strokeWidth="2" />
    <rect x="27" y="18" width="8" height="8" fill="#B2EBF2" />
    {/* Barrier gate with stripes */}
    <path d="M8 26H28" stroke="#E53935" strokeWidth="4" strokeLinecap="round" />
    <path d="M12 24L15 28M18 24L21 28M24 24L27 28" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    {/* Post */}
    <rect x="8" y="24" width="4" height="14" rx="1" fill="#78909C" />
  </svg>
);

// সরকারি পেমেন্ট (Govt Payment) - Official Govt of Bangladesh Red Seal
export const IconGovtPayment: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="18" fill="#FFEBEE" stroke="#C62828" strokeWidth="2.5" />
    <circle cx="24" cy="24" r="14" stroke="#D32F2F" strokeWidth="1" strokeDasharray="2 2" />
    <circle cx="24" cy="24" r="9" fill="#D32F2F" />
    {/* Map of BD / Shapla water lily */}
    <path d="M24 18L26 22L29 20L27 24L30 26L26 27L27 30L24 28L21 30L22 27L18 26L21 24L19 20L22 22L24 18Z" fill="#FFEBEE" />
  </svg>
);

// এডুকেশন (Education) - Textbooks with graduation cap
export const IconEducation: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Stack of books */}
    <rect x="10" y="32" width="28" height="6" rx="1.5" fill="#81D4FA" stroke="#0288D1" strokeWidth="1.5" />
    <rect x="10" y="24" width="28" height="6" rx="1.5" fill="#FFCDD2" stroke="#E53935" strokeWidth="1.5" />
    <rect x="10" y="16" width="28" height="6" rx="1.5" fill="#FFE082" stroke="#FFA000" strokeWidth="1.5" />
    {/* Graduation cap */}
    <path d="M24 6L38 12L24 18L10 12L24 6Z" fill="#3949AB" stroke="#1A237E" strokeWidth="1.5" />
    <path d="M38 12V20" stroke="#FFA000" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// এন জি ও (NGO) - NGO blue badge held by hands
export const IconNGO: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Shield */}
    <path d="M24 8L34 13V23C34 30 29 35 24 37C19 35 14 30 14 23V13L24 8Z" fill="#E3F2FD" stroke="#1E88E5" strokeWidth="2" />
    <text x="24" y="23" textAnchor="middle" fill="#0D47A1" fontSize="8" fontWeight="bold" fontFamily="sans-serif">NGO</text>
    {/* Hands below */}
    <path d="M10 32C14 28 20 30 22 34" stroke="#FB8C00" strokeWidth="2" strokeLinecap="round" />
    <path d="M38 32C34 28 28 30 26 34" stroke="#FB8C00" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// বীমা (Insurance) - Medical shield with heartbeat wave & lock
export const IconInsurance: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M24 6L36 12V24C36 32 30 38 24 41C18 38 12 32 12 24V12L24 6Z" fill="#E0F7FA" stroke="#00ACC1" strokeWidth="2.5" />
    {/* Heartbeat pulse line */}
    <path d="M16 23H20L22 17L25 28L28 21L30 23H32" stroke="#00796B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {/* Small padlock */}
    <rect x="20" y="28" width="8" height="7" rx="1.5" fill="#4DD0E1" stroke="#00838F" strokeWidth="1.5" />
    <path d="M22 28V26C22 24.8954 22.8954 24 24 24C25.1046 24 26 24.8954 26 26V28" stroke="#00838F" strokeWidth="1.5" />
  </svg>
);

// ডোনেশন (Donation) - Hand placing cash into charity box
export const IconDonation: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Charity box */}
    <rect x="14" y="24" width="22" height="16" rx="2" fill="#FFFFFF" stroke="#00838F" strokeWidth="2" />
    <rect x="12" y="20" width="26" height="5" rx="1" fill="#4DD0E1" stroke="#00838F" strokeWidth="1.5" />
    <line x1="21" y1="22.5" x2="29" y2="22.5" stroke="#004D40" strokeWidth="2" strokeLinecap="round" />
    {/* Banknote going in */}
    <rect x="20" y="14" width="10" height="6" rx="1" fill="#80DEEA" stroke="#0097A7" strokeWidth="1.5" transform="rotate(-15 25 17)" />
    {/* Hand */}
    <path d="M30 10L36 14L28 18" stroke="#FFAB91" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// যাকাত পেমেন্ট (Zakat Payment) - Green pouch with Islamic star
export const IconZakatPayment: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Green pouch */}
    <path
      d="M14 20C14 15 18 13 24 13C30 13 34 15 34 20C34 32 30 38 24 38C18 38 14 32 14 20Z"
      fill="#E8F5E9"
      stroke="#2E7D32"
      strokeWidth="2.5"
    />
    <rect x="19" y="10" width="10" height="5" rx="1" fill="#81C784" stroke="#2E7D32" strokeWidth="1.5" />
    {/* Islamic 8-point star */}
    <rect x="21" y="22" width="6" height="6" fill="#43A047" transform="rotate(45 24 25)" />
    <rect x="21" y="22" width="6" height="6" fill="#66BB6A" />
  </svg>
);

// টিকেট (Ticket) - Stack of purple transit tickets
export const IconTicket: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="28" height="15" rx="3" fill="#D1C4E9" stroke="#5E35B1" strokeWidth="2" transform="rotate(-10 24 17)" />
    <rect x="10" y="20" width="28" height="15" rx="3" fill="#EDE7F6" stroke="#673AB7" strokeWidth="2" />
    <path d="M18 20V35M30 20V35" stroke="#9575CD" strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

// জিপি ফ্লেক্সিপ্ল্যান (GP Flexiplan) - 4 colorful dots
export const IconGPFlexiplan: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="6" fill="#00BCD4" />
    <circle cx="32" cy="16" r="6" fill="#4CAF50" />
    <circle cx="16" cy="32" r="6" fill="#FFC107" />
    <circle cx="32" cy="32" r="6" fill="#F44336" />
  </svg>
);

// হোটেল (Hotel) - Cyan hotel building with location pin
export const IconHotel: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Buildings */}
    <rect x="8" y="16" width="14" height="24" rx="2" fill="#E0F7FA" stroke="#00ACC1" strokeWidth="2" />
    <rect x="20" y="10" width="16" height="30" rx="2" fill="#B2EBF2" stroke="#0097A7" strokeWidth="2" />
    <path d="M24 16H27M24 22H27M24 28H27" stroke="#006064" strokeWidth="2" />
    {/* Red location pin */}
    <circle cx="36" cy="14" r="5" fill="#E53935" />
    <path d="M36 19L36 24" stroke="#C62828" strokeWidth="2" />
  </svg>
);

// আবেদন ফি (Application Fee) - Forms with magnifying glass
export const IconApplicationFee: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="8" width="22" height="28" rx="2.5" fill="#E0F7FA" stroke="#00BCD4" strokeWidth="2" />
    <path d="M18 14H30M18 19H26M18 24H28" stroke="#00838F" strokeWidth="2" strokeLinecap="round" />
    {/* Magnifier */}
    <circle cx="32" cy="32" r="6" fill="#FFFFFF" stroke="#0288D1" strokeWidth="2.5" />
    <path d="M37 37L43 43" stroke="#0288D1" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Othoba - Shopping cart with orange/blue
export const IconOthoba: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M10 14H16L20 30H36L40 18H18" stroke="#1E88E5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="22" cy="36" r="3" fill="#1E88E5" />
    <circle cx="34" cy="36" r="3" fill="#1E88E5" />
    <path d="M16 22H36" stroke="#FB8C00" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// মেট্রোরেল (Metro Rail) - Dhaka MRT train front
export const IconMetroRail: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="18" fill="#E8F5E9" stroke="#2E7D32" strokeWidth="2.5" />
    {/* Red swoosh */}
    <path d="M14 30C16 18 32 18 34 30" stroke="#C62828" strokeWidth="3" strokeLinecap="round" />
    {/* Metro train body */}
    <path d="M18 22H30V32C30 34 28 35 24 35C20 35 18 34 18 32V22Z" fill="#FFFFFF" stroke="#2E7D32" strokeWidth="2" />
    <rect x="21" y="24" width="6" height="4" fill="#81C784" />
    <circle cx="20.5" cy="31" r="1.5" fill="#C62828" />
    <circle cx="27.5" cy="31" r="1.5" fill="#C62828" />
  </svg>
);

// ==========================================
// 4. OTHER SERVICES (SECTION 3)
// ==========================================

// পেওনিয়ার (Payoneer) - Multi-colored circle ring
export const IconPayoneer: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="14" stroke="#FF5722" strokeWidth="4.5" />
    <path d="M24 10A14 14 0 0 1 38 24" stroke="#FF9800" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M38 24A14 14 0 0 1 24 38" stroke="#4CAF50" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M24 38A14 14 0 0 1 10 24" stroke="#2196F3" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M10 24A14 14 0 0 1 24 10" stroke="#E91E63" strokeWidth="4.5" strokeLinecap="round" />
  </svg>
);

// উপায় চাকা (Upay Fortune Wheel)
export const IconUpayWheel: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="18" fill="#FFF9C4" stroke="#F57F17" strokeWidth="2.5" />
    {/* Wheel sectors */}
    <path d="M24 6V42M6 24H42" stroke="#F57F17" strokeWidth="2" />
    <path d="M11 11L37 37M11 37L37 11" stroke="#0057B8" strokeWidth="2" />
    <circle cx="24" cy="24" r="5" fill="#FFC700" stroke="#0057B8" strokeWidth="2" />
  </svg>
);

// মিউজিক (Music)
export const IconMusic: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20 32C20 35 17 37 14 37C11 37 9 35 9 32C9 29 11 27 14 27C17 27 20 29 20 32ZM20 32V12L36 8V28M36 28C36 31 33 33 30 33C27 33 25 31 25 28C25 25 27 23 30 23C33 23 36 25 36 28Z"
      stroke="#00BCD4"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// লাইব্রেরি / বই
export const IconLibrary: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="14" r="6" stroke="#0288D1" strokeWidth="1.5" />
    <ellipse cx="24" cy="14" rx="3" ry="6" stroke="#0288D1" strokeWidth="1" />
    <line x1="18" y1="14" x2="30" y2="14" stroke="#0288D1" strokeWidth="1" />
    <rect x="8" y="24" width="32" height="6" rx="1.5" fill="#FFCDD2" stroke="#C62828" strokeWidth="1.5" />
    <rect x="8" y="32" width="32" height="6" rx="1.5" fill="#B3E5FC" stroke="#0288D1" strokeWidth="1.5" />
  </svg>
);

// গেম (Games) - Purple Gamepad
export const IconGames: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 28L8 38C7 40 10 42 12 40L18 34H30L36 40C38 42 41 40 40 38L36 28C36 20 34 16 24 16C14 16 12 20 12 28Z"
      fill="#D1C4E9"
      stroke="#5E35B1"
      strokeWidth="2.5"
    />
    {/* D-pad */}
    <path d="M16 25V29M14 27H18" stroke="#5E35B1" strokeWidth="2" strokeLinecap="round" />
    {/* Buttons */}
    <circle cx="31" cy="25" r="1.5" fill="#E53935" />
    <circle cx="34" cy="28" r="1.5" fill="#43A047" />
  </svg>
);

// ==========================================
// 5. BANGLA QR LOGO (FOR CENTER SCANNER)
// ==========================================
export const IconBanglaQR: React.FC<{ size?: number; className?: string }> = ({
  size = 56,
  className = '',
}) => (
  <div
    style={{ width: size, height: size }}
    className={`rounded-full bg-white border-3 border-[#0057B8] flex flex-col items-center justify-center shadow-lg cursor-pointer transform hover:scale-105 transition shrink-0 ${className}`}
  >
    <span className="text-[7.5px] font-black text-[#D32F2F] tracking-tight leading-none mt-1">
      BANGLA
    </span>
    {/* QR matrix representation */}
    <svg viewBox="0 0 24 24" className="w-6 h-6 my-0.5" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="8" height="8" rx="1.5" stroke="#2E7D32" strokeWidth="2" />
      <rect x="5" y="5" width="2" height="2" fill="#2E7D32" />
      <rect x="14" y="2" width="8" height="8" rx="1.5" stroke="#2E7D32" strokeWidth="2" />
      <rect x="17" y="5" width="2" height="2" fill="#2E7D32" />
      <rect x="2" y="14" width="8" height="8" rx="1.5" stroke="#2E7D32" strokeWidth="2" />
      <rect x="5" y="17" width="2" height="2" fill="#2E7D32" />
      <rect x="14" y="14" width="3" height="3" fill="#D32F2F" />
      <rect x="19" y="14" width="3" height="3" fill="#2E7D32" />
      <rect x="14" y="19" width="3" height="3" fill="#2E7D32" />
      <rect x="19" y="19" width="3" height="3" fill="#D32F2F" />
    </svg>
    <span className="text-[7.5px] font-black text-[#2E7D32] tracking-tight leading-none mb-1">
      QR
    </span>
  </div>
);
