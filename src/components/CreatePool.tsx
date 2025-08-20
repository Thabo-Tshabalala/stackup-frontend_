// src/components/CreatePool.tsx
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

  const API_TOKEN =
    process.env.NEXT_PUBLIC_API_TOKEN ||
    'ee4786b66aaa953af6691317340bc0c1aff5d87e80c8518ad43e40731f19718f';

  // Fetch current user's API ID from /me endpoint
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const meRes = await API.get('/me');
        const userData = meRes.data as { apiUserId: string };
        setApiUserId(userData.apiUserId);
      } catch (err) {
        console.error('Failed to get API user ID:', err);
      }
    };
    fetchUserId();
  }, []);

  const handleCreate = async () => {
    if (!poolName || !goal || !startDate || !endDate) {
      setError('Please fill all required fields');
      setSuccess('');
      return;
    }
    if (!apiUserId) {
      setError('User not loaded yet. Please wait.');
      return;
    }

    const payload = {
      poolName,
      goal: Number(goal),
      frequency,
      startDate,
      endDate,
      creator: { apiUserId }, // use real API user ID
      members: members.split(',').map(m => ({ email: m.trim() })),
    };

    try {
      const response = await createPool(payload);
      setSuccess('Pool created successfully!');
      setError('');
      if (onCreate) onCreate(response.data as Pool);
      console.log('Created pool:', response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to create pool');
      setSuccess('');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Create a Pool</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}

      {/* Pool Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Pool Name*</label>
        <input
          type="text"
          placeholder="Enter pool name"
          value={poolName}
          onChange={(e) => setPoolName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
        />
      </div>

      {/* Goal Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Goal Amount (ZAR)*</label>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Enter goal amount"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
        />
      </div>

      {/* Frequency */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contribution Frequency</label>
        <div className="flex space-x-2">
          {['Weekly', 'Monthly', 'Custom'].map((f) => (
            <button
              key={f}
              onClick={() => setFrequency(f as 'Weekly' | 'Monthly' | 'Custom')}
              className={`flex-1 py-2 rounded-lg font-medium text-sm transition ${
                frequency === f
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Start / End Dates */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date*</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date*</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />
        </div>
      </div>

      {/* Invite Members */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Invite Members (comma separated emails)
        </label>
        <input
          type="text"
          placeholder="Email1, Email2"
          value={members}
          onChange={(e) => setMembers(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
        />
      </div>

      <button
        onClick={handleCreate}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition"
        disabled={!apiUserId}
      >
        Create Pool
      </button>
    </div>
  );
};

export default CreatePool;
