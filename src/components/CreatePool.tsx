/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import type { Pool } from '@/models/Pool';
import { createPool } from '@/app/api/poolApi';
import API from '@/app/api/api';

interface CreatePoolProps {
  onCreate?: (pool: Pool) => void;
  onClose?: () => void;
}

const CreatePool: React.FC<CreatePoolProps> = ({ onCreate, onClose }) => {
  const [poolName, setPoolName] = useState('');
  const [goal, setGoal] = useState('');
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [members, setMembers] = useState('');
  const [poolType, setPoolType] = useState<'savings' | 'stokvel'>('savings');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [apiUserId, setApiUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const meRes = await API.get('/me');
        const userData = meRes.data as { apiUserId: string };
        setApiUserId(userData.apiUserId);
      } catch {
        setError('⚠️ Failed to fetch user. Please log in again.');
      }
    };
    fetchUserId();
  }, []);

  const handleCreate = async () => {
    setError('');
    setSuccess('');

    if (!poolName || !goal || !startDate || !endDate) {
      setError('⚠️ Please fill in all required fields.');
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setError('⚠️ End date must be after start date.');
      return;
    }
    if (!apiUserId) {
      setError('⚠️ User not authenticated. Please reload.');
      return;
    }

    const payload = {
      poolName,
      goal: Number(goal),
      frequency: (frequency.charAt(0).toUpperCase() + frequency.slice(1)) as 'Weekly' | 'Monthly' | 'Custom',
      startDate,
      endDate,
      rotationMethod: poolType === 'stokvel' ? 'RANDOM' : 'FIXED',
      category: poolType,
      creator: { apiUserId },
      members: members
        ? members
            .split(',')
            .map((email) => ({ email: email.trim() }))
            .filter((m) => m.email && /\S+@\S+\.\S+/.test(m.email))
        : [],
    };

    try {
      setIsLoading(true);
      const response = await createPool(payload);
      setSuccess('✅ Pool created successfully! 🎉');

      setPoolName('');
      setGoal('');
      setStartDate('');
      setEndDate('');
      setMembers('');

      if (onCreate) onCreate(response.data as Pool);

      setTimeout(() => {
        setSuccess('');
        if (onClose) onClose();
      }, 2000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          '❌ Failed to create pool. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300">
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900">Create a Pool</h2>
        <p className="text-sm text-gray-600 mt-1">
          Choose a type and grow your group fund
        </p>
      </div>

      <div className="p-6 space-y-5">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl">
            {success}
          </div>
        )}

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-800">
            Select Pool Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setPoolType('savings')}
              className={`p-4 text-left rounded-xl transition-all duration-200 ${
                poolType === 'savings'
                  ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-500 text-blue-800 shadow-sm'
                  : 'bg-gray-50 border border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow'
              }`}
            >
              <div className="font-semibold">Savings / Investment</div>
              <div className="text-xs mt-1 text-gray-600">
                Save toward a goal or invest as a group
              </div>
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setPoolType('stokvel')}
              className={`p-4 text-left rounded-xl transition-all duration-200 ${
                poolType === 'stokvel'
                  ? 'bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-500 text-teal-800 shadow-sm'
                  : 'bg-gray-50 border border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow'
              }`}
            >
              <div className="font-semibold">Stokvel (ROSCA)</div>
              <div className="text-xs mt-1 text-gray-600">
                Rotating access – each member gets a turn
              </div>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Pool Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            disabled={isLoading}
            placeholder={poolType === 'stokvel' ? 'e.g., Family ROSCA' : 'e.g., Vacation Fund'}
            value={poolName}
            onChange={(e) => setPoolName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Target Amount (ZAR) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            step="0.01"
            disabled={isLoading}
            placeholder="5000"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Contribution Frequency
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['weekly', 'monthly'] as const).map((f) => (
              <button
                key={f}
                type="button"
                disabled={isLoading}
                onClick={() => setFrequency(f)}
                className={`py-3 text-sm font-medium rounded-lg transition-all ${
                  frequency === f
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              disabled={isLoading}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              disabled={isLoading}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Invite Members (optional)
          </label>
          <input
            type="text"
            disabled={isLoading}
            placeholder="email1@domain.com, email2@domain.com"
            value={members}
            onChange={(e) => setMembers(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder-gray-500 text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate emails with commas
          </p>
        </div>

        <button
          onClick={handleCreate}
          disabled={isLoading || !apiUserId || !poolName || !goal || !startDate || !endDate}
          className={`w-full py-3 px-6 font-semibold text-white rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 ${
            isLoading
              ? 'bg-blue-400 cursor-wait'
              : !apiUserId || !poolName || !goal || !startDate || !endDate
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-0"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Creating...</span>
            </>
          ) : (
            'Create Pool'
          )}
        </button>
      </div>
    </div>
  );
};

export default CreatePool;