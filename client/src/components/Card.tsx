import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  badge?: {
    text: string;
    color: 'green' | 'yellow' | 'red' | 'blue' | 'gray';
  };
}

const badgeColors = {
  green: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  red: 'bg-red-500/20 text-red-300 border-red-500/40',
  blue: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  gray: 'bg-gray-500/20 text-gray-300 border-gray-500/40',
};

export const Card: React.FC<CardProps> = ({ title, children, badge }) => {
  return (
    <div className="bg-black/20 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-cyan-500/20 card-glow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {badge && (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              badgeColors[badge.color]
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
};
