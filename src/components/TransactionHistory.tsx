import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  RotateCcw,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  X,
  FileCheck
} from 'lucide-react';
import { Transaction, Language } from '../types';
import { formatBdt, formatTimeAgo } from '../utils/formatters';
import { sound } from '../utils/audio';

interface TransactionHistoryProps {
  transactions: Transaction[];
  lang: Language;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  lang,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filteredTx = transactions.filter((tx) => {
    if (filterType !== 'all' && tx.type !== filterType) {
      if (filterType === 'recalled' && tx.status !== 'recalled') return false;
      if (filterType !== 'recalled' && tx.type !== filterType) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        tx.id.toLowerCase().includes(q) ||
        tx.recipient.toLowerCase().includes(q) ||
        (tx.recipientName && tx.recipientName.toLowerCase().includes(q)) ||
        tx.title.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              <span>{lang === 'bn' ? 'লেনদেনের বিবরণী ও রসিদ' : 'Transaction History & Statements'}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'bn' ? 'সকল লেনদেনের ডিজিটাল রশিদ ও ট্র্যাকিং' : 'Complete ledger of Upay MFS and Safe-Hold Escrow events'}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search TxnID, number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
          {['all', 'send_money', 'cash_in', 'cash_out', 'pay_bill', 'recalled'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setFilterType(tab);
                sound.playTap();
              }}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                filterType === tab
                  ? 'bg-[#0057B8] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tab === 'all'
                ? 'All'
                : tab === 'send_money'
                ? 'Send Money'
                : tab === 'cash_in'
                ? 'Cash In'
                : tab === 'cash_out'
                ? 'Cash Out'
                : tab === 'pay_bill'
                ? 'Pay Bill'
                : 'Recalled Funds'}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100">
          {filteredTx.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching transactions found
            </div>
          ) : (
            filteredTx.map((tx) => {
              const isCredit = tx.type === 'cash_in' || tx.type === 'remittance' || tx.status === 'recalled';
              return (
                <div
                  key={tx.id}
                  onClick={() => {
                    setSelectedTx(tx);
                    sound.playTap();
                  }}
                  className="py-3.5 px-2 flex items-center justify-between hover:bg-slate-50 rounded-2xl cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 ${
                        tx.status === 'recalled'
                          ? 'bg-rose-100 text-rose-700'
                          : isCredit
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {tx.status === 'recalled' ? (
                        <RotateCcw className="w-5 h-5" />
                      ) : isCredit ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-bold text-slate-900">
                          {lang === 'bn' ? tx.titleBn || tx.title : tx.title}
                        </p>
                        {tx.status === 'recalled' && (
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                            Fraud Recalled
                          </span>
                        )}
                        {tx.status === 'in_escrow_hold' && (
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                            In Escrow Hold
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {tx.id} • {formatTimeAgo(tx.timestamp, lang)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-xs sm:text-sm font-black ${
                        tx.status === 'recalled'
                          ? 'text-rose-600'
                          : isCredit
                          ? 'text-emerald-600'
                          : 'text-slate-900'
                      }`}
                    >
                      {isCredit ? '+' : '-'}{formatBdt(tx.amount, lang)}
                    </p>
                    <p className="text-[10px] text-slate-400 capitalize">
                      {tx.status}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RECEIPT VIEW MODAL */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#0057B8]" />
                <h3 className="text-base font-bold text-slate-900">Upay Digital Receipt</h3>
              </div>
              <button onClick={() => setSelectedTx(null)}>✕</button>
            </div>

            <div className="text-center py-2">
              <p className="text-xs text-slate-500">Total Transaction Amount</p>
              <p className="text-3xl font-black text-slate-900 mt-1">
                {formatBdt(selectedTx.amount, lang)}
              </p>
              <p className="text-xs font-semibold text-emerald-600 mt-1">
                Status: {selectedTx.status.toUpperCase()}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl text-xs space-y-2 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID</span>
                <span className="font-mono font-bold text-slate-900">{selectedTx.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Type</span>
                <span className="font-bold text-slate-800 capitalize">{selectedTx.type.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient / Point</span>
                <span className="font-bold text-slate-800">{selectedTx.recipient}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fee Charged</span>
                <span className="font-bold text-slate-800">{formatBdt(selectedTx.fee, lang)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time</span>
                <span className="font-bold text-slate-800">
                  {new Date(selectedTx.timestamp).toLocaleString('en-GB')}
                </span>
              </div>
              {selectedTx.proofSubmitted && (
                <div className="pt-2 border-t border-slate-200">
                  <p className="font-bold text-rose-600">Dispute Docket #:</p>
                  <p className="font-mono text-xs">{selectedTx.proofSubmitted.caseNumber}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                window.print();
              }}
              className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Receipt</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
