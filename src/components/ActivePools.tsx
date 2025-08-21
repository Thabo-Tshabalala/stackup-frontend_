"use client";

import React, { useState, useEffect } from "react";
import { Users, Calendar, TrendingUp } from "lucide-react";
import axios from "axios";

interface Pool {
  id: number;
  name: string;
  members: number;
  progress: number;
  current: number;
  target: number;
  nextPayout: string;
  category: string;
}

interface ActivePoolsProps {
  onViewPool: () => void;
}

export const ActivePools: React.FC<ActivePoolsProps> = ({ onViewPool }) => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivePools = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        // Backend response type
        type BackendPool = {
          id: number;
          poolName: string;
          members: any[];
          goal: number;
          currentAmount?: number;
          endDate?: string;
          category?: string;
        };

          const res = await axios.get<BackendPool[]>(
          `http://localhost:8080/api/pools/my-active`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const mappedPools: Pool[] = res.data.map((pool) => ({
          id: pool.id,
          name: pool.poolName,
          members: pool.members.length,
          current: pool.currentAmount || 0,
          target: pool.goal,
          progress:
            pool.goal > 0
              ? Math.round(((pool.currentAmount || 0) / pool.goal) * 100)
              : 0,
          nextPayout: pool.endDate
            ? new Date(pool.endDate).toLocaleDateString("en-ZA")
            : "-",
          category: pool.category || "General",
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

  if (loading) return <div className="p-6 text-gray-500">Loading active pools...</div>;
  if (!pools.length) return <div className="p-6 text-gray-700">No active pools yet.</div>;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Active Pools</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          Create New
        </button>
      </div>

      <div className="space-y-4">
        {pools.map((pool) => (
          <div
            key={pool.id}
            className="border border-gray-200 rounded-xl p-4 hover:border-indigo-200 transition-colors cursor-pointer flex flex-col md:flex-row md:justify-between md:items-center gap-4"
            onClick={onViewPool}
          >
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 truncate">{pool.name}</h4>
              <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 flex-wrap">
                <div className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  {pool.members} members
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  Next: {pool.nextPayout}
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 text-right min-w-[80px]">
              <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                R{pool.current.toLocaleString("en-ZA")}
              </p>
              <p className="text-xs text-gray-500 whitespace-nowrap">
                of R{pool.target.toLocaleString("en-ZA")}
              </p>
            </div>

            <div className="flex-1 w-full md:max-w-[200px] mt-2 md:mt-0">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{pool.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${pool.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between flex-shrink-0 mt-2 md:mt-0 space-x-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 whitespace-nowrap">
                {pool.category}
              </span>
              <div className="flex items-center text-xs text-green-600 whitespace-nowrap">
                <TrendingUp className="w-3 h-3 mr-1" />
                On track
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
