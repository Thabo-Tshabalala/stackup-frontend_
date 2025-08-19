import React from 'react';
import { Crown, Star } from 'lucide-react';

export const PoolMembers: React.FC = () => {
  const members = [
    {
      id: 1,
      name: 'You',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
      contribution: 1250,
      isCreator: true,
      status: 'up-to-date'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
      contribution: 1500,
      isCreator: false,
      status: 'up-to-date'
    },
    {
      id: 3,
      name: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
      contribution: 2000,
      isCreator: false,
      status: 'ahead'
    },
    {
      id: 4,
      name: 'Lisa Adams',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
      contribution: 2500,
      isCreator: false,
      status: 'ahead'
    },
    {
      id: 5,
      name: 'David Smith',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
      contribution: 1500,
      isCreator: false,
      status: 'behind'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead': return 'text-green-600';
      case 'behind': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'ahead') return <Star className="w-4 h-4 text-yellow-500" />;
    return null;
  };

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <div key={member.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src={member.avatar} 
                alt={member.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              {member.isCreator && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <p className="font-medium text-gray-900">{member.name}</p>
                {getStatusIcon(member.status)}
              </div>
              <p className="text-xs text-gray-500">
                {member.isCreator ? 'Pool Creator' : 'Member'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">
              R{member.contribution.toLocaleString()}
            </p>
            <p className={`text-xs capitalize ${getStatusColor(member.status)}`}>
              {member.status === 'up-to-date' ? 'On track' : member.status}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};