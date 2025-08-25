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

        const mapped: Transaction[] = (txData.transactions || []).map((t: unknown) => {
          const tx = t as {
            id: string;
            value: number;
            txType?: string;
            createdAt: string;
            status?: string;
          };
          return {
            id: tx.id,
            type: tx.value < 0 ? 'send' : 'receive',
            amount: Math.abs(tx.value),
            counterparty: tx.txType?.replace('Payment from ', '') || 'Unknown',
            date: new Date(tx.createdAt).toLocaleDateString('en-ZA', {
              day: '2-digit',
              month: 'short',
            }),
            status: tx.status?.toLowerCase(),
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

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
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
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          View All
        </button>
      </div>

      {transactions.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">No transactions yet</p>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => {
            const isSent = tx.type === 'send';
            const displayName = tx.counterparty || 'Unknown User';
            const category = isSent
              ? 'Pool Contribution'
              : tx.type === 'receive'
              ? 'Pool Payout'
              : 'Bet';

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm ${
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
                    <p className="text-xs text-gray-500">{category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${isSent ? 'text-red-600' : 'text-green-600'}`}>
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