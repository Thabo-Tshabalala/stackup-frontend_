import React from 'react';
import { Send, Download, Users } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const actions = [
    { icon: Send, label: 'Send', color: 'bg-blue-500' },
    { icon: Download, label: 'Receive', color: 'bg-green-500' },
    { icon: Users, label: 'Create Pool', color: 'bg-teal-500' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-xl transition-colors group"
          >
            <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};