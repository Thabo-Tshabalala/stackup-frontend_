"use client";

import React from "react";

export interface PayoutMember {
  id: string;
  name: string;
  avatar?: string;
  amount: string;
  status: "paid" | "next" | "pending";
  position: number;
}

interface PayoutOrderProps {
  members: PayoutMember[];
  nextUpName?: string;
}

const PayoutOrder: React.FC<PayoutOrderProps> = ({ members, nextUpName }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
        <h3 className="text-lg font-semibold text-gray-900">Payout Schedule</h3>
        <span className="px-3 py-1 bg-gradient-to-r from-teal-50 to-emerald-50 text-emerald-800 text-xs font-medium rounded-full whitespace-nowrap">
          Stokvel Mode
        </span>
      </div>


      <p className="text-sm text-gray-600 mb-5">
        Each member will receive the full pot once, in the order below.
      </p>

      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-xl border-2 transition ${
              member.status === "next"
                ? "border-teal-200 bg-teal-50 shadow-sm"
                : "border-gray-100 bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-3 w-full sm:w-auto mb-3 sm:mb-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0 ${
                  member.status === "next" ? "bg-teal-500 ring-4 ring-teal-100" : "bg-gray-400"
                }`}
              >
                {member.position}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`font-medium truncate ${
                    member.status === "next" ? "text-teal-900" : "text-gray-900"
                  }`}
                >
                  {member.name}
                </p>
                <p className="text-sm text-gray-500 truncate">{member.amount} • Cycle {member.position}</p>
              </div>
            </div>

            <div className="flex-shrink-0 self-start sm:self-center">
              {member.status === "paid" && (
                <div className="flex items-center space-x-1 text-green-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs font-medium">Paid</span>
                </div>
              )}
              {member.status === "next" && (
                <div className="text-xs font-semibold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-full">
                  Next Up
                </div>
              )}
              {member.status === "pending" && (
                <div className="text-xs text-gray-500">Pending</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Admin Note */}
      {nextUpName && (
        <div className="mt-5 p-3 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-xs text-blue-800 leading-tight">
            <strong>Admin Note:</strong> Next payout will go to{" "}
            <strong>{nextUpName}</strong> once all contributions are confirmed.
          </p>
        </div>
      )}
    </div>
  );
};

export default PayoutOrder;