'use client';

import React, { useEffect, useState, useId, forwardRef } from 'react';

export interface RupiahInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  /** Nilai numerik atau string angka murni */
  value?: number | string;
  /** Callback saat nilai berubah, mengembalikan angka numerik murni dan string terformat */
  onValueChange?: (rawValue: number, formattedValue: string) => void;
  /** Standar onChange handler jika dibutuhkan */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Label input */
  label?: string;
  /** Pesan error */
  error?: string;
  /** Teks bantuan di bawah input */
  helperText?: string;
  /** Custom prefix (default: 'Rp') */
  prefix?: string;
  /** Custom suffix (contoh: '/ kg' atau '/ satuan') */
  suffix?: string;
  /** Ukuran input: 'sm' | 'md' | 'lg' */
  inputSize?: 'sm' | 'md' | 'lg';
  /** Shortcut tombol cepat untuk menambahkan nominal */
  quickAmounts?: number[];
  /** Wrapper className */
  containerClassName?: string;
}

/**
 * Helper untuk memformat angka menjadi format ribuan Rupiah (contoh: 1500000 -> 1.500.000)
 */
export function formatRupiah(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === '') return '';
  const cleanNumber = String(val).replace(/\D/g, '');
  if (!cleanNumber) return '';
  return new Intl.NumberFormat('id-ID').format(Number(cleanNumber));
}

/**
 * Helper untuk mengekstrak angka integer murni dari string berformat Rupiah
 */
export function parseRupiah(formatted: string): number {
  const clean = formatted.replace(/\D/g, '');
  return clean ? parseInt(clean, 10) : 0;
}

export const RupiahInput = forwardRef<HTMLInputElement, RupiahInputProps>(
  (
    {
      value,
      onValueChange,
      onChange,
      label,
      error,
      helperText,
      prefix = 'Rp',
      suffix,
      inputSize = 'md',
      quickAmounts,
      containerClassName = '',
      className = '',
      id,
      disabled,
      placeholder = '0',
      min,
      max,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    // Local display value (terformat dengan titik ribuan)
    const [displayValue, setDisplayValue] = useState<string>(() =>
      formatRupiah(value)
    );

    // Sinkronisasi saat prop value berubah dari luar
    useEffect(() => {
      setDisplayValue(formatRupiah(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value;
      // Ambil hanya digit angka
      const onlyDigits = rawInput.replace(/\D/g, '');
      
      let numericValue = onlyDigits ? parseInt(onlyDigits, 10) : 0;

      // Handle limit min & max jika ada
      if (max !== undefined && numericValue > Number(max)) {
        numericValue = Number(max);
      }

      const formatted = numericValue === 0 && onlyDigits === '' ? '' : formatRupiah(numericValue);
      setDisplayValue(formatted);

      if (onValueChange) {
        onValueChange(numericValue, formatted);
      }

      if (onChange) {
        // Buat synthetic event dengan nilai terupdate jika parent menggunakan onChange biasa
        const clonedEvent = {
          ...e,
          target: {
            ...e.target,
            value: String(numericValue),
            name: props.name || '',
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(clonedEvent);
      }
    };

    const handleQuickAmount = (amount: number) => {
      const current = parseRupiah(displayValue);
      const nextValue = current + amount;
      const formatted = formatRupiah(nextValue);

      setDisplayValue(formatted);
      if (onValueChange) {
        onValueChange(nextValue, formatted);
      }
    };

    const sizeClasses = {
      sm: 'py-1.5 text-xs',
      md: 'py-2 text-sm',
      lg: 'py-2.5 text-base',
    };

    const padLeftClasses = {
      sm: prefix ? 'pl-8' : 'pl-3',
      md: prefix ? 'pl-10' : 'pl-3.5',
      lg: prefix ? 'pl-12' : 'pl-4',
    };

    const padRightClasses = {
      sm: suffix ? 'pr-12' : 'pr-3',
      md: suffix ? 'pr-16' : 'pr-3.5',
      lg: suffix ? 'pr-20' : 'pr-4',
    };

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-xs font-semibold text-stone-800"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center rounded-[6px]">
          {/* Prefix Adornment (Rp) */}
          {prefix && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-xs font-bold text-stone-500 select-none">
                {prefix}
              </span>
            </div>
          )}

          {/* Input Element */}
          <input
            {...props}
            ref={ref}
            id={inputId}
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full rounded-[6px] border bg-[#FAF8F5] text-stone-900 font-medium transition-colors
              focus:bg-white focus:border-[#0B3D26] focus:outline-none focus:ring-1 focus:ring-[#0B3D26]
              disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-stone-300'}
              ${sizeClasses[inputSize]}
              ${padLeftClasses[inputSize]}
              ${padRightClasses[inputSize]}
              ${className}
            `}
          />

          {/* Suffix Adornment (e.g. / kg) */}
          {suffix && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-xs font-medium text-stone-500 select-none">
                {suffix}
              </span>
            </div>
          )}
        </div>

        {/* Quick Amount Shortcuts (Opsional) */}
        {quickAmounts && quickAmounts.length > 0 && !disabled && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => handleQuickAmount(amt)}
                className="rounded border border-stone-200 bg-white px-2 py-0.5 text-[10px] font-medium text-stone-600 hover:border-[#0B3D26] hover:text-[#0B3D26] transition-colors"
              >
                +{formatRupiah(amt)}
              </button>
            ))}
          </div>
        )}

        {/* Error / Helper Text */}
        {error ? (
          <p className="mt-1 text-xs font-medium text-red-500">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-stone-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

RupiahInput.displayName = 'RupiahInput';
export default RupiahInput;
