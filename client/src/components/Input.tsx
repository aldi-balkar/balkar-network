import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-cyan-200">{label}</label>}
      <input
        className={`px-3 py-2 bg-black/30 border border-cyan-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 backdrop-blur-sm ${className}`}
        {...props}
      />
      {error && <span className="text-sm text-red-400">{error}</span>}
    </div>
  );
};
