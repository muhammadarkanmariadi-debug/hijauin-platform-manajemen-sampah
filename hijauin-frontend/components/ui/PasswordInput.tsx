'use client';

import { useState, forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  showStrength?: boolean;
}

function calculateStrength(pass: string): { score: number; label: string; color: string } {
  if (!pass) return { score: 0, label: '', color: '' };
  
  let score = 0;
  if (pass.length >= 8) score += 1;
  if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 1) return { score: 1, label: 'Lemah', color: 'bg-red-500' };
  if (score === 2 || score === 3) return { score: 2, label: 'Sedang', color: 'bg-amber-500' };
  return { score: 3, label: 'Kuat', color: 'bg-[#1F6B3F]' };
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      error,
      helperText,
      showStrength = false,
      id,
      className = '',
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const [showPassword, setShowPassword] = useState(false);
    const [currentVal, setCurrentVal] = useState<string>('');

    const displayVal = value !== undefined ? String(value) : currentVal;
    const strength = showStrength ? calculateStrength(displayVal) : null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setCurrentVal(e.target.value);
      }
      onChange?.(e);
    };

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
              className="block text-xs font-semibold text-stone-800"
            >
              {label}
            </label>
            {showStrength && displayVal && strength && (
              <span className={`text-[10px] font-medium ${
                strength.score === 1 ? 'text-red-600' : strength.score === 2 ? 'text-amber-600' : 'text-[#1F6B3F]'
              }`}>
                Kekuatan: {strength.label}
              </span>
            )}
          </div>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={handleChange}
            className={`w-full rounded-[4px] border bg-white px-3.5 py-2.5 pr-10 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#0B3D26] focus:outline-none focus:ring-1 focus:ring-[#0B3D26] transition-colors ${
              error ? 'border-[#C1441F] focus:border-[#C1441F] focus:ring-[#C1441F]' : 'border-stone-300'
            } ${className}`}
            {...props}
          />

          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-stone-700 transition-colors focus:outline-none"
            aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
            title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
          >
            {showPassword ? (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Strength Meter Bar */}
        {showStrength && displayVal && strength && (
          <div className="flex gap-1 pt-0.5">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  strength.score >= step ? strength.color : 'bg-stone-200'
                }`}
              />
            ))}
          </div>
        )}

        {/* Error message */}
        {error && <p className="text-xs text-[#C1441F]">{error}</p>}

        {/* Helper text */}
        {!error && helperText && (
          <p className="text-[11px] text-stone-500">{helperText}</p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
