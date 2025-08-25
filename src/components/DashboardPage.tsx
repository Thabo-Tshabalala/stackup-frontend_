"use client";

import React, { useState, useEffect } from "react";
import { QuickActions } from "@/components/QuickActions";
import { ActivePools, Pool as PoolFromActive } from "@/components/ActivePools";
import WalletPage from "@/components/WalletBalance";
import RecentTransactions from "@/components/RecentTransactions";
import InvitesPage from "@/components/Invites";
import API from "@/app/api/api";
import CreatePool from "./CreatePool";
import PoolDetailsPage, { Pool as PoolDetailsType } from "./pool-details-page";

import {
  Home,
  Users,
  CreditCard,
  BarChart3,
  Mail,
  ArrowLeft,
} from "lucide-react";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | "QuickActions"
    | "ActivePools"
    | "Transactions"
    | "Wallet"
    | "Invites"
    | "CreatePool"
    | "PoolDetails"
  >("QuickActions");

  const [user, setUser] = useState<{ firstName: string; email: string; imageUrl?: string } | null>(
    null
  );
  const [selectedPool, setSelectedPool] = useState<PoolDetailsType | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/me");
        setUser(res.data as { firstName: string; email: string; imageUrl?: string });
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  const tabs: {
    name: "QuickActions" | "ActivePools" | "Transactions" | "Wallet" | "Invites" | "CreatePool" | "PoolDetails";
    label: string;
    icon: React.ElementType;
  }[] = [
    { name: "QuickActions", label: "Home", icon: Home },
    { name: "ActivePools", label: "Active Pools", icon: Users },
    { name: "Transactions", label: "Transactions", icon: BarChart3 },
    { name: "Wallet", label: "Wallet", icon: CreditCard },
    { name: "Invites", label: "Invitations", icon: Mail },
  ];

  const handleViewPool = (pool: PoolFromActive) => {
    const transformedPool: PoolDetailsType = {
      ...pool,
      contributionHistory: (pool.contributionHistory || []).map((c) => ({
        id: c.id,
        date: c.date,
        amount: c.amount,
        memberId: c.id ?? "",
        memberName: c.member ?? "Member",
        memberAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          c.member || "Member"
        )}&background=random`,
      })),
    };

    setSelectedPool(transformedPool);
    setActiveTab("PoolDetails");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center shadow">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">StackUp</h1>
              <p className="text-xs text-gray-600">Smart group savings</p>
            </div>
          </div>

          {user && (
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="font-semibold text-gray-900">{user.firstName}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <div
                className="w-12 h-12 bg-cover bg-center rounded-full border-2 border-gray-300"
                style={{ backgroundImage: `url(${user.imageUrl || "/default-avatar.png"})` }}
                aria-label="User profile"
              />
            </div>
          )}
        </div>
      </header>
      <div className="container mx-auto px-4 mt-6">
        <nav className="flex gap-x-6 border-b border-gray-200 pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center space-x-2 py-2 px-4 rounded-lg font-medium text-sm transition
                  ${
                    activeTab === tab.name
                      ? "border-b-2 border-blue-600 text-blue-700"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {activeTab === "QuickActions" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Welcome back, <span className="text-blue-700">{user?.firstName}</span>!
            </h2>
            <QuickActions onCreatePool={() => setActiveTab("CreatePool")} />
          </div>
        )}

        {activeTab === "CreatePool" && (
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Create New Pool</h2>
              <button
                onClick={() => setActiveTab("ActivePools")}
                className="text-gray-500 hover:text-gray-700 text-sm flex items-center space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Pools</span>
              </button>
            </div>
            <CreatePool />
          </div>
        )}

        {activeTab === "ActivePools" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Active Pools</h2>
            <ActivePools onViewPool={handleViewPool} />
          </div>
        )}

        {activeTab === "PoolDetails" && selectedPool && (
          <div>
            <button
              onClick={() => setActiveTab("ActivePools")}
              className="mb-6 flex items-center space-x-2 text-blue-700 hover:text-blue-800 font-medium"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Active Pools</span>
            </button>
            <PoolDetailsPage pool={selectedPool} />
          </div>
        )}

        {activeTab === "Transactions" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Transactions</h2>
            <RecentTransactions />
          </div>
        )}

        {activeTab === "Wallet" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Wallet</h2>
            <WalletPage />
          </div>
        )}

        {activeTab === "Invites" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Invitations</h2>
            <InvitesPage />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;