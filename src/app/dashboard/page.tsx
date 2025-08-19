"use client";

import React from "react";
import { WalletBalance } from "@/components/WalletBalance";
import { QuickActions } from "@/components/QuickActions";
import { ActivePools } from "@/components/ActivePools";
import { RecentTransactions } from "@/components/RecentTransactions";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-white p-4 rounded-xl shadow-md flex items-center justify-center">
            <QuickActions />
          </div>

          <div className="flex-1 bg-white p-4 rounded-xl shadow-md flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">Wallet Balance</p>
              <p className="text-3xl font-bold text-gray-900 text-right">
                R2,847.50
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-white p-4 rounded-xl shadow-md">
            <ActivePools onViewPool={() => { }} />
          </div>

          <div className="flex-1 bg-white p-4 rounded-xl shadow-md">
            <RecentTransactions />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
