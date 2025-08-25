'use client';

import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { getMyInvites, respondToInvite } from '@/app/api/poolInvite';

interface PoolInviteDTO {
  id: string;
  poolName: string;
  creatorName: string;
  goal: number;
  frequency: string;
  contributionPerMember: number;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
}

const InvitesPage: React.FC = () => {
  const [invites, setInvites] = useState<PoolInviteDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const res = await getMyInvites();
        const data = res.data;
        setInvites(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch invites:', err);
        setError('Failed to load invites.');
      } finally {
        setLoading(false);
      }
    };
    fetchInvites();
  }, []);

  const handleAction = async (inviteId: string, action: 'ACCEPTED' | 'DECLINED') => {
    try {
      await respondToInvite(inviteId, action);
      setInvites((prev) => prev.filter((i) => i.id !== inviteId));
      if (action === 'ACCEPTED') {
        alert('You have joined the pool.');
      }
    } catch (err) {
      console.error('Action failed:', err);
      alert('Failed to respond. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-5 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
        <div className="inline-block w-5 h-5 border-2 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
        <p className="mt-2 text-sm">Loading invites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl">
        {error}
      </div>
    );
  }

  if (invites.length === 0) {
    return (
      <div className="p-5 text-center text-gray-600 bg-white rounded-xl border border-gray-200">
        <X className="w-5 h-5 mx-auto text-gray-400" />
        <p className="mt-2 text-sm font-medium">No pending invites</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900">Invitations</h2>
        <p className="text-xs text-gray-500 mt-1">Respond to pool join requests</p>
      </div>

      <div className="divide-y divide-gray-100">
        {invites.map((invite) => (
          <div key={invite.id} className="p-4 hover:bg-gray-50 transition">
            <div className="space-y-2 mb-3">
              <h3 className="font-medium text-gray-900 text-sm">{invite.poolName}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs text-gray-600">
                <span>
                  <strong>By:</strong> {invite.creatorName}
                </span>
                <span>
                  <strong>Goal:</strong> R{invite.goal.toFixed(2)}
                </span>
                <span>
                  <strong>Yours:</strong> R{invite.contributionPerMember.toFixed(2)}
                </span>
                <span>
                  <strong>Every:</strong> {invite.frequency}
                </span>
                <span className="sm:col-span-1">
                  <strong>From:</strong> {new Date(invite.startDate).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' })}
                </span>
                <span>
                  <strong>To:</strong> {new Date(invite.endDate).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' })}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleAction(invite.id, 'ACCEPTED')}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept</span>
              </button>
              <button
                onClick={() => handleAction(invite.id, 'DECLINED')}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded-lg transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>Decline</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvitesPage;