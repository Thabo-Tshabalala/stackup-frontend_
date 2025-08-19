import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const RecentTransactions: React.FC = () => {
  const transactions = [
    {
      id: 1,
      type: 'sent',
      amount: 450,
      recipient: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
      date: '2 hours ago',
      category: 'Pool Contribution'
    },
    {
      id: 2,
      type: 'received',
      amount: 1250,
      recipient: 'Holiday Squad',
      avatar: '🏖️',
      date: '1 day ago',
      category: 'Pool Payout'
    },
    {
      id: 3,
      type: 'sent',
      amount: 150,
      recipient: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
      date: '3 days ago',
      category: 'Split Bill'
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center space-x-3">
              <div className="relative">
                {typeof transaction.avatar === 'string' && transaction.avatar.startsWith('http') ? (
                  <img 
                    src={transaction.avatar} 
                    alt={transaction.recipient}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                    {transaction.avatar}
                  </div>
                )}
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${
                  transaction.type === 'sent' ? 'bg-red-500' : 'bg-green-500'
                }`}>
                  {transaction.type === 'sent' ? (
                    <ArrowUpRight className="w-3 h-3 text-white" />
                  ) : (
                    <ArrowDownLeft className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-900">{transaction.recipient}</p>
                <p className="text-xs text-gray-500">{transaction.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${
                transaction.type === 'sent' ? 'text-red-600' : 'text-green-600'
              }`}>
                {transaction.type === 'sent' ? '-' : '+'}R{transaction.amount}
              </p>
              <p className="text-xs text-gray-500">{transaction.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};