"use client";

import React, { useState, useEffect } from "react";
import QuickActions from "@/components/QuickActions";
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

// ✅ Only one default export — this is your full dashboard
export default function Dashboard() {
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
    { name: "ActivePools", label: "Pools", icon: Users },
    { name: "Transactions", label: "History", icon: BarChart3 },
    { name: "Wallet", label: "Wallet", icon: CreditCard },
    { name: "Invites", label: "Invites", icon: Mail },
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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          {/* Logo & App Name */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center shadow">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">StackUp</h1>
              <p className="text-xs text-gray-600">Smart group savings</p>
            </div>
          </div>

          {/* User Profile */}
          {user && (
            <div className="flex items-center space-x-2">
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-gray-900 text-sm">{user.firstName}</p>
                <p className="text-xs text-gray-600 truncate max-w-[100px]">{user.email}</p>
              </div>
              <div
                className="w-10 h-10 bg-cover bg-center rounded-full border-2 border-gray-300"
                style={{ backgroundImage: `url(${user.imageUrl || "/default-avatar.png"})` }}
                aria-label="User profile"
              />
            </div>
          )}
        </div>
      </header>

      {/* Bottom Tabs (Mobile) */}
      <nav className="flex overflow-x-auto space-x-1 bg-white border-t border-gray-200 sm:hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex-shrink-0 flex flex-col items-center py-3 px-4 space-y-1 text-xs font-medium transition ${
                activeTab === tab.name
                  ? "text-blue-700 border-t-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              aria-label={tab.label}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Top Tabs (Desktop) */}
      <div className="hidden sm:block px-4 mt-4">
        <div className="border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`inline-flex items-center space-x-2 py-2 px-4 font-medium text-sm transition border-b-2 ${
                  activeTab === tab.name
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 py-6 pb-20">
        {activeTab === "QuickActions" && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Welcome back, <span className="text-blue-700">{user?.firstName}</span>!
            </h2>
            <QuickActions onCreatePool={() => setActiveTab("CreatePool")} />
          </div>
        )}

        {activeTab === "CreatePool" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Create New Pool</h2>
              <button
                onClick={() => setActiveTab("ActivePools")}
                className="text-gray-500 hover:text-gray-700 text-sm flex items-center space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            </div>
            <CreatePool />
          </div>
        )}

        {activeTab === "ActivePools" && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Your Active Pools</h2>
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
              <span>Back to Pools</span>
            </button>
            <PoolDetailsPage pool={selectedPool} />
          </div>
        )}

        {activeTab === "Transactions" && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Transactions</h2>
            <RecentTransactions />
          </div>
        )}

        {activeTab === "Wallet" && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Your Wallet</h2>
            <WalletPage />
          </div>
        )}

        {activeTab === "Invites" && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Pending Invitations</h2>
            <InvitesPage />
          </div>
        )}
      </main>

      <div className="h-16 sm:h-0"></div>
    </div>
  );
}