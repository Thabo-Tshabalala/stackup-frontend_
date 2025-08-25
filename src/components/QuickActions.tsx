'use client';
import React from 'react';
import { Send, Download, Users } from 'lucide-react';

interface QuickActionsProps {
  onCreatePool?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onCreatePool }) => {
  const actions = [
    {
      icon: Send,
      label: 'Send Money',
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      onClick: () => alert('Send money action'),
    },
    {
      icon: Download,
      label: 'Receive Money',
      color: 'bg-teal-600',
      hoverColor: 'hover:bg-teal-700',
      onClick: () => alert('Receive money action'),
    },
    {
      icon: Users,
      label: 'Create Pool',
      color: 'bg-indigo-600',
      hoverColor: 'hover:bg-indigo-700',
      onClick: onCreatePool || (() => alert('Create Pool')),
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-5">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="flex flex-col items-center p-5 hover:bg-gray-50 rounded-xl transition-all group focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <div
              className={`w-14 h-14 ${action.color} ${action.hoverColor} rounded-full flex items-center justify-center mb-3 transform transition-transform group-hover:scale-105 shadow-sm`}
            >
              <action.icon className="w-6 h-6 text-white" />
            </div>

            <span className="text-sm font-medium text-gray-800 text-center">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;