"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

interface WalletBalanceProps {
  balance: number;
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({ balance }) => {
  const [showBalance, setShowBalance] = useState(false);
  const [formattedBalance, setFormattedBalance] = useState("");

  useEffect(() => {
    setFormattedBalance(balance.toLocaleString("en-ZA", { minimumFractionDigits: 2 }));
  }, [balance]);

  return (
    <div className="flex justify-between items-center w-full p-4 bg-gradient-to-tr from-indigo-50 to-purple-50 rounded-xl shadow-md">
      <div>
        <p className="text-sm text-gray-500">Wallet Balance</p>
        <p className="text-3xl font-bold text-gray-900 text-right">
          {showBalance ? `R${formattedBalance}` : "R••••••"}
        </p>
      </div>

      <button
        onClick={() => setShowBalance(!showBalance)}
        className="ml-4 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
      >
        {showBalance ? <EyeOff className="h-5 w-5 text-gray-700" /> : <Eye className="h-5 w-5 text-gray-700" />}
      </button>
    </div>
  );
};
