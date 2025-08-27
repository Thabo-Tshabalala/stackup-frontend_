'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import API from '@/app/api/api';
import { externalApiFetch } from '@/app/api/externalApi';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'bet';
  amount: number;
  counterparty?: string;
  date: string;
  status?: 'completed' | 'pending' | 'failed';
}

export const RecentTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const meRes = await API.get('/me');
      const userData = meRes.data as { apiUserId: string };
      const apiUserId = userData.apiUserId;
      const txData = await externalApiFetch(`/${apiUserId}/transactions`);

      const mapped: Transaction[] = (txData.transactions || []).map((t: any) => {
        const isSend = t.txType.startsWith('Payment to ');
        const isReceive = t.txType.startsWith('Payment from ');

        return {
          id: t.id,
          type: isSend ? 'send' : isReceive ? 'receive' : 'bet',
          amount: Math.abs(t.value),
          counterparty: t.txType.replace(/^Payment (to|from) /, '') || 'Unknown',
          date: new Date(t.createdAt).toLocaleDateString('en-ZA', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          status: t.status?.toLowerCase() as any,
        };
      });

      setTransactions(mapped.slice(0, 5));
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  fetchTransactions();

  // Poll every 5 seconds
  const intervalId = setInterval(fetchTransactions, 5000);

  // Cleanup on unmount
  return () => clearInterval(intervalId);
}, []);


  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  <div className="w-20 h-3 bg-gray-100 rounded mt-1"></div>
                </div>
              </div>
              <div className="w-16 h-5 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">
          View All
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <ArrowDownLeft className="w-6 h-6 text-gray-400" />
          </div>
          <p className="mt-3 text-sm">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => {
            const isSent = tx.type === 'send';
            const displayName = tx.counterparty || 'Unknown User';
 const category = isSent
  ? 'Contribution (Money Out)'
  : tx.type === 'receive'
  ? 'Payout (Money In)'
  : 'Bet';

const getBadgeColor = () => {
  if (isSent) return 'bg-red-100 text-red-800';
  if (tx.type === 'receive') return 'bg-green-100 text-green-800';
  return 'bg-blue-100 text-blue-800';
};


            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group"
              >

                <div className="flex items-center space-x-3">
                  <div className="relative">

                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm text-white ${
                        isSent ? 'bg-red-500' : 'bg-green-500'
                      }`}
                    >
                      {displayName.charAt(0).toUpperCase()}
                    </div>

                    <div
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${
                        isSent ? 'bg-red-600' : 'bg-green-600'
                      }`}
                    >
                      {isSent ? (
                        <ArrowUpRight className="w-3 h-3 text-white" />
                      ) : (
                        <ArrowDownLeft className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{displayName}</p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getBadgeColor()}`}
                    >
                      {category}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      isSent ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {isSent ? '-' : '+'}R{tx.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">{tx.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;