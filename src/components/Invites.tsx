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
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const res = await getMyInvites();
        setInvites(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
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
    } catch (err) {
      console.error(err);
      alert('Failed to update invite.');
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading invites...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (invites.length === 0) return <div className="p-6 text-gray-700">No pending invites</div>;

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Pool Invites</h2>
      {invites.map((invite) => (
        <div key={invite.id} className="bg-white rounded-xl shadow-md p-4 flex flex-col space-y-2">
          <div>
            <p className="font-semibold text-gray-900">{invite.poolName}</p>
            <p className="text-sm text-gray-600">Created by: {invite.creatorName}</p>
            <p className="text-sm text-gray-600">Goal: R{invite.goal.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Frequency: {invite.frequency}</p>
            <p className="text-sm text-gray-600">
              Contribution per member: R{invite.contributionPerMember.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">
              Duration: {new Date(invite.startDate).toLocaleDateString()} - {new Date(invite.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => handleAction(invite.id, 'ACCEPTED')}
              className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center space-x-2 transition"
            >
              <Check className="w-4 h-4" />
              <span>Accept</span>
            </button>
            <button
              onClick={() => handleAction(invite.id, 'DECLINED')}
              className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center space-x-2 transition"
            >
              <X className="w-4 h-4" />
              <span>Decline</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvitesPage;
