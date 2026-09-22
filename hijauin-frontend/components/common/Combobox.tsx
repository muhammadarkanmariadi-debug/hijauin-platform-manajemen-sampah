'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ComboboxOption {
  value: string | number;
  label: string;
  description?: string;
  image?: string | null;
  badge?: {
    text: string;
    color?: string;
    bgColor?: string;
  };
  meta?: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string | number | '';
  onChange: (value: string | number) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

/**
 * Editorial Combobox Component.
 *
 * Replaces standard HTML <select> dropdowns with a searchable,
 * image-enabled popover combobox adhering strictly to docs/DESIGN.md:
 * - 4px border radius
 * - 1px hairline stone border
 * - Image thumbnail support with responsive fallback
 * - Integrated instant search filter
 * - Click-outside and keyboard escape dismiss
 */
export default function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Pilih opsi...',
  searchPlaceholder = 'Cari...',
  label,
  disabled = false,
  error,
  className = '',
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find currently selected option
  const selectedOption = useMemo(
    () => options.find((opt) => String(opt.value) === String(value)),
    [options, value]
  );

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        opt.description?.toLowerCase().includes(query) ||
        opt.meta?.toLowerCase().includes(query) ||
        opt.badge?.text.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Auto focus search input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const toggleOpen = () => {
    if (disabled) return;
    setIsOpen((prev) => {
      if (!prev) {
        setSearchQuery('');
      } 
      return !prev;
    });
  };

  const handleSelect = (val: string | number) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full space-y-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-stone-800">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={toggleOpen}
        className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-[4px] border text-xs text-left transition-all ${
          disabled
            ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
            : isOpen
            ? 'bg-white border-[#0B3D26] ring-1 ring-[#0B3D26] shadow-sm'
            : error
            ? 'bg-white border-rose-500'
            : 'bg-white border-stone-300 hover:border-stone-400'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {selectedOption ? (
            <>
              {/* Selected Image / Swatch */}
              {selectedOption.image ? (
                <div className="relative w-6 h-6 rounded-[2px] overflow-hidden border border-stone-200 shrink-0 bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedOption.image}
                    alt={selectedOption.label}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : selectedOption.badge ? (
                <span
                  className="w-3 h-3 rounded-[2px] shrink-0"
                  style={{
                    backgroundColor: selectedOption.badge.color || '#0B3D26',
                  }}
                />
              ) : null}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {selectedOption.badge && (
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 rounded-[2px]"
                      style={{
                        color: selectedOption.badge.color || '#0B3D26',
                        backgroundColor: selectedOption.badge.bgColor || '#F1ECDF',
                      }}
                    >
                      {selectedOption.badge.text}
                    </span>
                  )}
                  <span className="font-medium text-stone-900 truncate">
                    {selectedOption.label}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <span className="text-stone-400 font-normal">{placeholder}</span>
          )}
        </div>

        {/* Chevron Icon */}
        <svg
          className={`w-4 h-4 text-stone-400 transition-transform shrink-0 ${
            isOpen ? 'rotate-180 text-stone-700' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {error && <p className="text-[11px] text-rose-600">{error}</p>}

      {/* Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 right-0 z-50 mt-1 bg-white rounded-[4px] border border-stone-200 shadow-xl overflow-hidden flex flex-col max-h-72"
          >
            {/* Search Input */}
            <div className="p-2 border-b border-stone-100 bg-[#FAF8F5] shrink-0">
              <div className="relative">
                <svg
                  className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-[3px] border border-stone-300 focus:outline-none focus:border-[#0B3D26] bg-white text-stone-900"
                />
              </div>
            </div>

            {/* Options List */}
            <div className="overflow-y-auto p-1 divide-y divide-stone-50">
              {filteredOptions.length === 0 ? (
                <div className="py-6 px-3 text-center text-xs text-stone-400">
                  Tidak ditemukan opsi yang cocok.
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = String(option.value) === String(value);

                  return (
                    <div
                      key={String(option.value)}
                      onClick={() => handleSelect(option.value)}
                      className={`flex items-center gap-3 p-2.5 rounded-[3px] cursor-pointer text-xs transition-colors ${
                        isSelected
                          ? 'bg-[#1F6B3F]/10 text-[#0B3D26]'
                          : 'hover:bg-stone-50 text-stone-800'
                      }`}
                    >
                      {/* Image Thumbnail */}
                      {option.image ? (
                        <div className="relative w-9 h-9 rounded-[3px] overflow-hidden border border-stone-200 shrink-0 bg-stone-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={option.image}
                            alt={option.label}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : option.badge ? (
                        <div
                          className="w-9 h-9 rounded-[3px] flex items-center justify-center font-bold text-[10px] shrink-0"
                          style={{
                            color: option.badge.color || '#0B3D26',
                            backgroundColor: option.badge.bgColor || '#F1ECDF',
                          }}
                        >
                          {option.badge.text.slice(0, 3)}
                        </div>
                      ) : null}

                      {/* Text Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {option.badge && (
                            <span
                              className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 rounded-[2px]"
                              style={{
                                color: option.badge.color || '#0B3D26',
                                backgroundColor: option.badge.bgColor || '#F1ECDF',
                              }}
                            >
                              {option.badge.text}
                            </span>
                          )}
                          <span className={`truncate font-medium ${isSelected ? 'font-semibold text-[#0B3D26]' : 'text-stone-900'}`}>
                            {option.label}
                          </span>
                        </div>

                        {option.description && (
                          <p className="text-[11px] text-[#7C8574] truncate mt-0.5">
                            {option.description}
                          </p>
                        )}

                        {option.meta && (
                          <p className="text-[10px] font-mono text-stone-500 mt-0.5">
                            {option.meta}
                          </p>
                        )}
                      </div>

                      {/* Checkmark */}
                      {isSelected && (
                        <svg
                          className="w-4 h-4 text-[#1F6B3F] shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
