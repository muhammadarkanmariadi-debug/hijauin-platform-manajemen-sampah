'use client';

import { useState, useRef, useMemo, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseSpreadsheetFile, downloadSampleTemplate } from '@/lib/utils/import.utils';

export interface ImportColumn<T> {
  key: keyof T;
  label: string;
  type?: 'text' | 'number' | 'select';
  options?: { value: string; label: string }[];
  required?: boolean;
  defaultValue?: any;
  validate?: (val: any, row: T) => string | null;
  sample: string | number;
}

interface StagedRow<T> {
  id: string;
  selected: boolean;
  data: T;
  errors: Record<string, string>;
}

interface DataImportModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  columns: ImportColumn<T>[];
  templateFilename: string;
  sampleRows: (string | number)[][];
  onConfirmImport: (items: T[]) => Promise<void>;
}

export default function DataImportModal<T extends Record<string, any>>({
  isOpen,
  onClose,
  title,
  description,
  columns,
  templateFilename,
  sampleRows,
  onConfirmImport,
}: DataImportModalProps<T>) {
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stagedRows, setStagedRows] = useState<StagedRow<T>[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate a single row
  const validateRow = (data: T): Record<string, string> => {
    const errs: Record<string, string> = {};
    columns.forEach((col) => {
      const val = data[col.key];
      if (col.required && (val === undefined || val === null || val === '')) {
        errs[String(col.key)] = `${col.label} wajib diisi.`;
      } else if (col.type === 'number' && isNaN(Number(val))) {
        errs[String(col.key)] = `${col.label} harus berupa angka.`;
      } else if (col.validate) {
        const customErr = col.validate(val, data);
        if (customErr) errs[String(col.key)] = customErr;
      }
    });
    return errs;
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setIsParsing(true);
    setGlobalError(null);
    setFile(selectedFile);

    try {
      const parsed = await parseSpreadsheetFile(selectedFile);

      // Map parsed columns to our schema
      const mappedRows: StagedRow<T>[] = parsed.rows.map((rawRow, idx) => {
        const item: Record<string, any> = {};

        columns.forEach((col) => {
          // Look for exact label match or key match (case-insensitive)
          const matchedKey = Object.keys(rawRow).find(
            (k) =>
              k.trim().toLowerCase() === col.label.toLowerCase() ||
              k.trim().toLowerCase() === String(col.key).toLowerCase()
          );

          let val = matchedKey ? rawRow[matchedKey] : col.defaultValue ?? '';
          if (col.type === 'number') {
            const num = Number(val);
            val = isNaN(num) ? col.defaultValue ?? 0 : num;
          }
          item[col.key as string] = val;
        });

        const typedData = item as T;
        return {
          id: `row-${idx}-${Date.now()}`,
          selected: true,
          data: typedData,
          errors: validateRow(typedData),
        };
      });

      setStagedRows(mappedRows);
    } catch (err: unknown) {
      setGlobalError(err instanceof Error ? err.message : 'Gagal membaca data spreadsheet.');
      setFile(null);
    } finally {
      setIsParsing(false);
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setStagedRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r))
    );
  };

  const handleToggleSelectAll = () => {
    const areAllSelected = stagedRows.every((r) => r.selected);
    setStagedRows((prev) => prev.map((r) => ({ ...r, selected: !areAllSelected })));
  };

  const handleCellChange = (id: string, key: keyof T, value: any) => {
    setStagedRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const updatedData = { ...r.data, [key]: value };
        return {
          ...r,
          data: updatedData,
          errors: validateRow(updatedData),
        };
      })
    );
  };

  const handleEliminateRow = (id: string) => {
    setStagedRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddManualRow = () => {
    const emptyItem: Record<string, any> = {};
    columns.forEach((col) => {
      emptyItem[col.key as string] = col.defaultValue ?? (col.type === 'number' ? 0 : '');
    });
    const typedData = emptyItem as T;
    setStagedRows((prev) => [
      ...prev,
      {
        id: `row-manual-${Date.now()}`,
        selected: true,
        data: typedData,
        errors: validateRow(typedData),
      },
    ]);
  };

  const handleResetFile = () => {
    setFile(null);
    setStagedRows([]);
    setGlobalError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const selectedRows = useMemo(() => stagedRows.filter((r) => r.selected), [stagedRows]);
  const hasErrorsInSelected = useMemo(
    () => selectedRows.some((r) => Object.keys(r.errors).length > 0),
    [selectedRows]
  );

  const handleSubmit = async () => {
    if (selectedRows.length === 0) {
      setGlobalError('Pilih setidaknya satu baris data untuk diimpor.');
      return;
    }

    if (hasErrorsInSelected) {
      setGlobalError('Harap perbaiki kolom yang memiliki tanda error merah sebelum melanjutkan.');
      return;
    }

    setIsSubmitting(true);
    setGlobalError(null);
    try {
      const itemsToImport = selectedRows.map((r) => r.data);
      await onConfirmImport(itemsToImport);
      handleResetFile();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err instanceof Error ? err.message : 'Terjadi kesalahan saat mengimpor data.');
      setGlobalError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.16 }}
          className="relative w-full max-w-5xl bg-white rounded-[4px] shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-stone-200 bg-[#FAF8F5] flex items-center justify-between shrink-0">
            <div>
              <span className="text-[10px] font-bold text-[#1F6B3F] uppercase tracking-wider">
                Impor Data Batch
              </span>
              <h2 className="font-display text-lg font-bold text-stone-900">{title}</h2>
              <p className="text-xs text-stone-500 mt-0.5">{description}</p>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="w-8 h-8 rounded-[4px] border border-stone-200 hover:bg-stone-200/50 flex items-center justify-center text-stone-500 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Global Alert Banner */}
          {globalError && (
            <div className="mx-6 mt-4 p-3 rounded-[4px] bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
              <span>{globalError}</span>
              <button
                onClick={() => setGlobalError(null)}
                className="text-rose-500 hover:text-rose-800 font-bold ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-5">
            {!file ? (
              /* State 1: Upload Dropzone & Template Download */
              <div className="space-y-6 py-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 hover:border-[#1F6B3F] bg-[#FAF8F5] hover:bg-[#FAF8F5]/80 rounded-[4px] p-8 text-center cursor-pointer transition-all space-y-3"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv, .xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-[#1F6B3F]/10 text-[#0B3D26] flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-800">
                      {isParsing ? 'Sedang membaca file...' : 'Klik atau seret file CSV / Excel ke sini'}
                    </p>
                    <p className="text-xs text-stone-500 mt-1">
                      Mendukung format .CSV, .XLSX, dan .XLS (Maksimal 10MB)
                    </p>
                  </div>
                </div>

                {/* Template Download Section */}
                <div className="rounded-[4px] border border-stone-200 bg-white p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-stone-800">Butuh format template?</h4>
                    <p className="text-xs text-stone-500">
                      Unduh contoh template dengan header kolom yang sesuai untuk memudahkan pengisian data.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        downloadSampleTemplate(
                          templateFilename,
                          columns.map((c) => c.label),
                          sampleRows,
                          'csv'
                        )
                      }
                      className="px-3 py-1.5 rounded-[4px] border border-stone-300 hover:border-stone-400 bg-white text-xs font-medium text-stone-700 transition-colors"
                    >
                      Unduh CSV
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        downloadSampleTemplate(
                          templateFilename,
                          columns.map((c) => c.label),
                          sampleRows,
                          'xlsx'
                        )
                      }
                      className="px-3 py-1.5 rounded-[4px] border border-[#1F6B3F]/40 hover:border-[#1F6B3F] bg-[#1F6B3F]/5 text-xs font-semibold text-[#0B3D26] transition-colors"
                    >
                      Unduh Excel (.xlsx)
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* State 2: Interactive Staging, Selection & Elimination Table */
              <div className="space-y-4">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-[4px] bg-[#FAF8F5] border border-stone-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-stone-800 truncate max-w-[200px] sm:max-w-xs">
                      📄 {file.name}
                    </span>
                    <span className="text-[11px] text-stone-500 font-mono">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={handleResetFile}
                      className="text-xs text-[#C1441F] hover:underline font-medium ml-2"
                    >
                      Ganti File
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="text-xs text-stone-600">
                      <span className="font-bold text-[#0B3D26]">{selectedRows.length}</span> dari{' '}
                      <span className="font-bold text-stone-800">{stagedRows.length}</span> baris dipilih
                    </span>
                    <button
                      type="button"
                      onClick={handleToggleSelectAll}
                      className="px-2.5 py-1 rounded-[3px] border border-stone-300 hover:bg-white text-[11px] font-medium text-stone-700"
                    >
                      {stagedRows.every((r) => r.selected) ? 'Batal Pilih Semua' : 'Pilih Semua'}
                    </button>
                    <button
                      type="button"
                      onClick={handleAddManualRow}
                      className="px-2.5 py-1 rounded-[3px] bg-[#0B3D26] hover:bg-[#1F6B3F] text-[#F1ECDF] text-[11px] font-semibold"
                    >
                      + Tambah Baris
                    </button>
                  </div>
                </div>

                {/* Staging Table */}
                <div className="border border-stone-200 rounded-[4px] overflow-hidden bg-white">
                  <div className="overflow-x-auto max-h-[50vh]">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="sticky top-0 z-10 bg-[#FAF8F5] border-b border-stone-200 text-stone-600 font-semibold text-[11px]">
                        <tr>
                          <th className="px-3 py-2.5 w-10 text-center">
                            <input
                              type="checkbox"
                              checked={stagedRows.length > 0 && stagedRows.every((r) => r.selected)}
                              onChange={handleToggleSelectAll}
                              className="rounded-[2px] border-stone-300 text-[#0B3D26] focus:ring-0"
                            />
                          </th>
                          <th className="px-2 py-2.5 w-12 text-center text-stone-400">No</th>
                          {columns.map((col) => (
                            <th key={String(col.key)} className="px-3 py-2.5 min-w-[140px]">
                              {col.label} {col.required && <span className="text-rose-500">*</span>}
                            </th>
                          ))}
                          <th className="px-3 py-2.5 w-14 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {stagedRows.length === 0 ? (
                          <tr>
                            <td
                              colSpan={columns.length + 3}
                              className="px-4 py-8 text-center text-stone-400 text-xs"
                            >
                              Tidak ada baris data dalam staging. Silakan tambahkan atau unggah file lain.
                            </td>
                          </tr>
                        ) : (
                          stagedRows.map((row, rowIdx) => {
                            const hasRowError = Object.keys(row.errors).length > 0;

                            return (
                              <tr
                                key={row.id}
                                className={`transition-colors ${
                                  !row.selected
                                    ? 'opacity-40 bg-stone-50/60'
                                    : hasRowError
                                    ? 'bg-rose-50/40'
                                    : 'hover:bg-[#FAF8F5]/50'
                                }`}
                              >
                                {/* Checkbox */}
                                <td className="px-3 py-2 text-center">
                                  <input
                                    type="checkbox"
                                    checked={row.selected}
                                    onChange={() => handleToggleSelectRow(row.id)}
                                    className="rounded-[2px] border-stone-300 text-[#0B3D26] focus:ring-0"
                                  />
                                </td>

                                {/* Row Number */}
                                <td className="px-2 py-2 text-center text-[11px] font-mono text-stone-400">
                                  {rowIdx + 1}
                                </td>

                                {/* Editable Columns */}
                                {columns.map((col) => {
                                  const cellValue = row.data[col.key];
                                  const cellError = row.errors[String(col.key)];

                                  return (
                                    <td key={String(col.key)} className="px-2 py-1.5">
                                      {col.type === 'select' && col.options ? (
                                        <select
                                          value={String(cellValue ?? '')}
                                          disabled={!row.selected}
                                          onChange={(e) =>
                                            handleCellChange(row.id, col.key, e.target.value)
                                          }
                                          className={`w-full px-2 py-1 text-xs rounded-[3px] border bg-white focus:outline-none focus:border-[#0B3D26] ${
                                            cellError
                                              ? 'border-rose-400 bg-rose-50/50'
                                              : 'border-stone-300'
                                          }`}
                                        >
                                          {col.options.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                              {opt.label}
                                            </option>
                                          ))}
                                        </select>
                                      ) : (
                                        <input
                                          type={col.type === 'number' ? 'number' : 'text'}
                                          value={cellValue ?? ''}
                                          disabled={!row.selected}
                                          onChange={(e) =>
                                            handleCellChange(
                                              row.id,
                                              col.key,
                                              col.type === 'number'
                                                ? parseFloat(e.target.value) || 0
                                                : e.target.value
                                            )
                                          }
                                          placeholder={`Isi ${col.label.toLowerCase()}...`}
                                          className={`w-full px-2 py-1 text-xs rounded-[3px] border bg-white focus:outline-none focus:border-[#0B3D26] ${
                                            cellError
                                              ? 'border-rose-400 bg-rose-50/50'
                                              : 'border-stone-300'
                                          }`}
                                        />
                                      )}
                                      {cellError && row.selected && (
                                        <p className="text-[10px] text-rose-600 mt-0.5 leading-tight">
                                          {cellError}
                                        </p>
                                      )}
                                    </td>
                                  );
                                })}

                                {/* Eliminate Row Button */}
                                <td className="px-2 py-1.5 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleEliminateRow(row.id)}
                                    title="Hapus / eliminasi baris ini"
                                    className="w-7 h-7 inline-flex items-center justify-center rounded-[3px] text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                  >
                                    <svg
                                      className="w-3.5 h-3.5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-stone-200 bg-[#FAF8F5] flex items-center justify-between shrink-0">
            <div className="text-xs text-stone-500">
              {file && (
                <span>
                  Baris yang tidak dicentang atau dihapus tidak akan diimpor ke sistem.
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
              >
                Batal
              </button>
              {file && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || selectedRows.length === 0 || hasErrorsInSelected}
                  className="px-5 py-2 rounded-[4px] bg-[#0B3D26] hover:bg-[#1F6B3F] text-[#F1ECDF] text-xs font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Mengimpor...
                    </>
                  ) : (
                    `Impor ${selectedRows.length} Data Terpilih`
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
