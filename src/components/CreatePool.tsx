'use client';
import { useState, useEffect } from 'react';
import type { Pool } from '@/models/Pool';
import { createPool } from '@/app/api/poolApi';
import API from '@/app/api/api';

interface CreatePoolProps {
  onCreate?: (pool: Pool) => void;
}

const CreatePool: React.FC<CreatePoolProps> = ({ onCreate }) => {
  const [poolName, setPoolName] = useState('');
  const [goal, setGoal] = useState('');
  const [frequency, setFrequency] = useState<'Weekly' | 'Monthly' | 'Custom'>('Weekly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [members, setMembers] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [apiUserId, setApiUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const meRes = await API.get('/me');
        const userData = meRes.data as { apiUserId: string };
        setApiUserId(userData.apiUserId);
      } catch (err) {
        setError('Failed to fetch user. Please log in again.');
      }
    };
    fetchUserId();
  }, []);

  const handleCreate = async () => {
    if (!poolName || !goal || !startDate || !endDate) {
      setError('Please fill in all required fields.');
      setSuccess('');
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setError('End date must be after start date.');
      return;
    }
    if (!apiUserId) {
      setError('User not authenticated. Please reload.');
      return;
    }

    const payload = {
      poolName,
      goal: Number(goal),
      frequency,
      startDate,
      endDate,
      creator: { apiUserId },
      members: members
        ? members.split(',').map((m) => ({ email: m.trim() })).filter((m) => m.email)
        : [],
    };

    try {
      const response = await createPool(payload);
      setSuccess(' Pool created successfully!');
      setError('');
      setPoolName('');
      setGoal('');
      setStartDate('');
      setEndDate('');
      setMembers('');
      if (onCreate) onCreate(response.data as Pool);
    } catch (err) {
      setError('❌ Failed to create pool. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-7 border border-gray-100 transition-all duration-300">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-1 text-center">
        Create a Pool
      </h2>
      <p className="text-sm text-gray-500 mb-6 text-center">Start saving together</p>

      {/* Success & Error Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl animate-fade-in">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl animate-fade-in">
          {success}
        </div>
      )}

      {/* Pool Name */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Pool Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Vacation Fund"
          value={poolName}
          onChange={(e) => setPoolName(e.target.value)}
          className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
        />
      </div>

      {/* Goal Amount */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Goal Amount (ZAR) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="e.g., 5000.00"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
        />
      </div>

      {/* Frequency Buttons */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Contribution Frequency</label>
        <div className="grid grid-cols-3 gap-2">
          {(['Weekly', 'Monthly', 'Custom'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFrequency(f)}
              className={`py-3 rounded-xl font-medium text-sm capitalize transition-all duration-200 transform ${
                frequency === f
                  ? 'bg-teal-500 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-102'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-indigo-300 transition-all duration-200 text-gray-900"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-indigo-300 transition-all duration-200 text-gray-900"
          />
        </div>
      </div>

      {/* Invite Members */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Invite Members (comma-separated)
        </label>
        <input
          type="text"
          placeholder="friend@email.com, family@email.com"
          value={members}
          onChange={(e) => setMembers(e.target.value)}
          className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
        />
      </div>

      {/* Create Button , come back here to fix the ui and do validation*/}
      <button
        onClick={handleCreate}
        disabled={!apiUserId}
        className={`w-full py-4 font-bold text-white rounded-xl shadow-lg transition-all duration-300 transform ${
          !apiUserId
            ? 'bg-gray-400 cursor-not-allowed opacity-70'
            : 'bg-gradient-to-r from-gray-600 to-grey-600 hover:from-green-700 hover:to-green-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
        }`}
      >
        {apiUserId ? ' Create Pool' : 'Loading...'}
      </button>
    </div>
  );
};

export default CreatePool;