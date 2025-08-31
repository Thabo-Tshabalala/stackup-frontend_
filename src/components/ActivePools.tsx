"use client";

import React, { useState, useEffect } from "react";
import { Users, Calendar, TrendingUp } from "lucide-react";
import axios from "axios";

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  contribution: number;
  isCreator: boolean;
}

export interface Contribution {
  id: string;
  date: string;
  amount: number;
  member: string;
}

export interface Pool {
  id: number;
  name: string;
  description: string;
  goal: number;
  currentAmount: number;
  currency: string;
  frequency: string;
  nextPaymentDate: string;
  startDate: string;
  endDate: string;
  createdBy: string;
  members: Member[];
  contributionHistory: Contribution[];
  category: string;
  paymentIdentifier: string;
}

interface ActivePoolsProps {
  onViewPool: (pool: Pool) => void;
}

export const ActivePools: React.FC<ActivePoolsProps> = ({ onViewPool }) => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivePools = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await axios.get(
          `https://stack-up-backend-production.up.railway.app/api/pools/my-active`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const mappedPools: Pool[] = (res.data as any[]).map((pool: any) => ({
          id: pool.id,
          name: pool.poolName,
          description: pool.description || "No description",
          goal: pool.goal,
          currentAmount: pool.currentAmount || 0,
          currency: "R",
          frequency: "Weekly",
          nextPaymentDate: pool.endDate || "",
          startDate: pool.startDate || "",
          endDate: pool.endDate || "",
          createdBy: pool.createdBy || "user-1",
          members: (pool.members || []).map((m: any) => ({
            id: m.id,
            name: m.name,
            email: m.email,
            avatar: m.avatar || "/default.png",
            contribution: m.contribution || 0,
            isCreator: m.isCreator || false,
          })),
          contributionHistory: pool.contributionHistory || [],
          category: pool.category || "General",
          paymentIdentifier: pool.paymentIdentifier || "",
        }));

        setPools(mappedPools);
      } catch (err) {
        console.error("Failed to fetch active pools:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivePools();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">
        <div className="inline-block w-6 h-6 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
        <p className="mt-2">Loading active pools...</p>
      </div>
    );

  if (!pools.length)
    return (
      <div className="p-6 text-center text-gray-700 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
        <Users className="w-10 h-10 mx-auto text-gray-400" />
        <h4 className="mt-3 font-medium">No active pools yet</h4>
        <p className="text-sm text-gray-500 mt-1">Start by creating your first money pool.</p>
      </div>
    );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Active Pools</h3>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">
          Create New
        </button>
      </div>

      <div className="space-y-4">
        {pools.map((pool) => {
          const progress = Math.round((pool.currentAmount / pool.goal) * 100);
          const isOnTrack = progress >= 50;

          return (
            <div
              key={pool.id}
              className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onViewPool(pool)}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{pool.name}</h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">{pool.description}</p>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-3 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Users className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                      {pool.members.length} member{pool.members.length !== 1 ? "s" : ""}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                      Next: {new Date(pool.nextPaymentDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right min-w-[100px]">
                  <p className="text-sm font-bold text-gray-900">
                    {pool.currency}
                    {pool.currentAmount.toLocaleString("en-ZA")}
                  </p>
                  <p className="text-xs text-gray-500">
                    of {pool.currency}
                    {pool.goal.toLocaleString("en-ZA")}
                  </p>
                </div>

                <div className="flex-1 max-w-xs min-w-[150px]">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        progress < 30
                          ? "bg-red-500"
                          : progress < 70
                          ? "bg-teal-500"
                          : "bg-blue-600"
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 min-w-[100px]">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${
                        pool.category === "Savings"
                          ? "bg-blue-100 text-blue-800"
                          : pool.category === "Travel"
                          ? "bg-teal-100 text-teal-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {pool.category}
                  </span>
                  <div className="flex items-center text-xs font-medium text-green-600">
                    <TrendingUp className="w-3.5 h-3.5 mr-1" />
                    {isOnTrack ? "On Track" : "Pending"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};