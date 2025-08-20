'use client';

import React, { useState, useEffect } from 'react';
import { QuickActions } from '@/components/QuickActions';
import { ActivePools } from '@/components/ActivePools';
import WalletPage from '@/components/WalletBalance';
import RecentTransactions from '@/components/RecentTransactions';
import InvitesPage from '@/components/Invites';
import API from '@/app/api/api';
import CreatePool from './CreatePool';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'QuickActions' | 'ActivePools' | 'Transactions' | 'Wallet' | 'Invites' | 'CreatePool'
  >('QuickActions');
  const [user, setUser] = useState<{ firstName: string; email: string; imageUrl?: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/me');
        setUser(res.data as { firstName: string; email: string; imageUrl?: string });
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    fetchUser();
  }, []);

  const tabs = [
    { name: 'QuickActions' },
    { name: 'ActivePools' },
    { name: 'Transactions' },
    { name: 'Wallet' },
    { name: 'Invites' }, // new tab
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* User Info - Top Right */}
      {user && (
        <header className="flex items-center justify-end mb-6 space-x-4">
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">{user.firstName}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
          <div
            className="w-12 h-12 bg-cover bg-center rounded-full border-2 border-gray-300"
            style={{ backgroundImage: `url(${user.imageUrl})` }}
            aria-label="Profile image"
          />
        </header>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={() => setActiveTab(tab.name as any)}
            className={`py-2 px-4 font-medium transition ${
              activeTab === tab.name
                ? 'border-b-2 border-black text-black'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
<div className="space-y-6">
  {activeTab === 'QuickActions' && (
    <QuickActions onCreatePool={() => setActiveTab('CreatePool')} />
  )}
  {activeTab === 'CreatePool' && <CreatePool />}
  {activeTab === 'ActivePools' && <ActivePools onViewPool={() => console.log('Pool clicked')} />}
  {activeTab === 'Transactions' && <RecentTransactions />}
  {activeTab === 'Wallet' && <WalletPage />}
  {activeTab === 'Invites' && <InvitesPage />}
</div>

    </div>
  );
};

export default Dashboard;
