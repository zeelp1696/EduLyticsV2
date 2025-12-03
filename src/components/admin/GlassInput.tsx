import React from 'react';
import { LucideIcon } from 'lucide-react';

interface GlassInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: LucideIcon;
  mode?: 'institution' | 'personal';
  label?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
}

export default function GlassInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  icon: Icon,
  mode = 'institution',
  label,
  error = false,
  disabled = false,
  required = false,
}: GlassInputProps) {
  const accentColor = mode === 'institution' ? 'institution' : 'personal';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-200">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-slate-400`}
          />
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            w-full
            ${Icon ? 'pl-10' : 'px-4'} pr-4 py-2.5
            rounded-xl
            bg-slate-900/50 backdrop-blur-sm
            border border-slate-700/30
            text-white placeholder-slate-500
            transition-all duration-300
            focus:outline-none
            ${error 
              ? 'border-red-500/50 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/20' 
              : `focus:border-${accentColor}-500 focus:shadow-lg focus:shadow-${accentColor}-500/20`
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'focus:ring-2 focus:ring-red-500/20' : `focus:ring-2 focus:ring-${accentColor}-500/20`}
          `}
        />
      </div>
    </div>
  );
}
