'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKategoris, useCreateSetoran } from '@/lib/queries/setoran.queries';
import CloudinaryImageUpload from '@/components/common/CloudinaryImageUpload';
import Combobox, { type ComboboxOption } from '@/components/common/Combobox';

interface SetorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ItemRow {
  kategori_sampah_id: number | '';
  berat_kg_estimasi: string;
}

export default function SetorModal({ isOpen, onClose, onSuccess }: SetorModalProps) {
  const { data: kategoris = [], isLoading: isLoadingKategoris } = useKategoris();
  const createSetoranMutation = useCreateSetoran();

  const [tanggal, setTanggal] = useState(() => new Date().toISOString().split('T')[0]);
  const [catatan, setCatatan] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [items, setItems] = useState<ItemRow[]>([
    { kategori_sampah_id: '', berat_kg_estimasi: '' },
  ]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successSubmitted, setSuccessSubmitted] = useState(false);

  const getMaterialColor = (jenis: string) => {
    switch (jenis) {
      case 'plastik':
        return '#2F7DB8';
      case 'kertas':
        return '#B8873A';
      case 'logam':
        return '#8A94A0';
      case 'kaca':
        return '#4FA6A0';
      default:
        return '#0B3D26';
    }
  };

  const kategoriOptions: ComboboxOption[] = useMemo(() => {
    return kategoris.map((k) => ({
      value: k.id,
      label: k.nama,
      description: k.deskripsi || undefined,
      image: k.foto_url,
      badge: {
        text: k.jenis.toUpperCase(),
        color: getMaterialColor(k.jenis),
        bgColor: `${getMaterialColor(k.jenis)}18`,
      },
      meta: `Tarif Rp ${Number(k.harga_per_kg ?? 0).toLocaleString('id-ID')}/kg • +${k.poin_per_kg ?? 0} poin/kg`,
    }));
  }, [kategoris]);

  const handleAddItem = () => {
    setItems((prev) => [...prev, { kategori_sampah_id: '', berat_kg_estimasi: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof ItemRow, value: string | number) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Estimate total points and rupiah value
  const estimatedTotals = items.reduce(
    (acc, item) => {
      if (!item.kategori_sampah_id || !item.berat_kg_estimasi) return acc;
      const cat = kategoris.find((k) => k.id === Number(item.kategori_sampah_id));
      const kg = parseFloat(item.berat_kg_estimasi) || 0;
      if (cat && kg > 0) {
        acc.poin += Math.round(kg * cat.poin_per_kg);
        acc.rupiah += Math.round(kg * cat.harga_per_kg);
        acc.kg += kg;
      }
      return acc;
    },
    { poin: 0, rupiah: 0, kg: 0 }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    const validItems = items.filter(
      (item) => item.kategori_sampah_id !== '' && parseFloat(item.berat_kg_estimasi) > 0
    );

    if (validItems.length === 0) {
      setErrorMsg('Pilih minimal 1 kategori sampah dan masukkan estimasi berat.');
      return;
    }

    try {
      const finalCatatan = [
        catatan.trim(),
        fotoUrl ? `[Foto Bukti: ${fotoUrl}]` : '',
      ]
        .filter(Boolean)
        .join('\n\n');

      await createSetoranMutation.mutateAsync({
        tanggal,
        catatan: finalCatatan || undefined,
        items: validItems.map((it) => ({
          kategori_sampah_id: Number(it.kategori_sampah_id),
          berat_kg_estimasi: parseFloat(it.berat_kg_estimasi),
        })),
      });

      setSuccessSubmitted(true);
      setTimeout(() => {
        setSuccessSubmitted(false);
        onSuccess?.();
        onClose();
        // reset state
        setItems([{ kategori_sampah_id: '', berat_kg_estimasi: '' }]);
        setCatatan('');
        setFotoUrl('');
      }, 1400);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal mengirim setoran sampah. Silakan coba lagi.';
      setErrorMsg(message);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-lg bg-white rounded-[4px] shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-stone-200 bg-[#FAF8F5] flex items-center justify-between shrink-0">
            <div>
              <span className="text-[11px] font-semibold text-[#1F6B3F] uppercase tracking-wider">
                Penyetoran Sampah
              </span>
              <h2 className="font-display text-lg font-bold text-stone-900">
                Formulir Setor Sampah Baru
              </h2>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="w-8 h-8 rounded-[4px] border border-stone-200 hover:bg-stone-200/50 flex items-center justify-center text-stone-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-5">
            {successSubmitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#1F6B3F]/10 text-[#0B3D26] flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-lg font-semibold text-stone-900">
                  Setoran Berhasil Dicatat!
                </h3>
                <p className="text-xs text-[#7C8574] max-w-xs mx-auto">
                  Silakan bawa sampah Anda ke unit bank sampah untuk penimbangan dan verifikasi poin.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="p-3 text-xs bg-rose-50 text-rose-800 border border-rose-200 rounded-[4px]">
                    {errorMsg}
                  </div>
                )}

                {/* Date Input */}
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Tanggal Penyetoran
                  </label>
                  <input
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-[4px] focus:outline-none focus:border-[#0B3D26] bg-[#FAF8F5]"
                  />
                </div>

                {/* Material Item Rows */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-stone-800">
                      Item Sampah Anorganik
                    </label>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="text-xs font-semibold text-[#1F6B3F] hover:text-[#0B3D26] transition-colors"
                    >
                      Tambah Item
                    </button>
                  </div>

                  {isLoadingKategoris ? (
                    <div className="py-4 text-center text-xs text-stone-500">
                      Memuat daftar kategori...
                    </div>
                  ) : (
                    items.map((row, idx) => {
                      const selectedCat = kategoris.find((k) => k.id === Number(row.kategori_sampah_id));
                      return (
                        <div
                          key={idx}
                          className="p-3 border border-stone-200 rounded-[4px] bg-[#FAF8F5] space-y-2 relative"
                        >
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <Combobox
                                options={kategoriOptions}
                                value={row.kategori_sampah_id}
                                onChange={(val) => handleItemChange(idx, 'kategori_sampah_id', val)}
                                placeholder="-- Pilih Jenis / Kategori Sampah --"
                                searchPlaceholder="Cari kategori sampah (PET, kardus, kaleng)..."
                              />
                            </div>

                            <div className="w-24">
                              <div className="relative">
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0.1"
                                  placeholder="0.0"
                                  value={row.berat_kg_estimasi}
                                  onChange={(e) =>
                                    handleItemChange(idx, 'berat_kg_estimasi', e.target.value)
                                  }
                                  required
                                  className="w-full text-xs pl-2.5 pr-7 py-1.5 border border-stone-300 rounded-[4px] focus:outline-none focus:border-[#0B3D26] bg-white text-right"
                                />
                                <span className="absolute right-2 top-1.5 text-[11px] text-stone-400 font-medium">
                                  kg
                                </span>
                              </div>
                            </div>

                            {items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(idx)}
                                className="p-1.5 text-stone-400 hover:text-rose-600 rounded-[4px] hover:bg-stone-100 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>

                          {selectedCat && (
                            <p className="text-[11px] text-[#7C8574]">
                              {selectedCat.deskripsi || 'Kategori terstandarisasi'} • Tarif Rp{' '}
                              {Number(selectedCat.harga_per_kg ?? 0).toLocaleString('id-ID')}/kg
                            </p>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Live Estimator Banner */}
                {estimatedTotals.kg > 0 && (
                  <div className="p-3.5 rounded-[4px] bg-[#1F6B3F]/10 border border-[#1F6B3F]/20 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#1F6B3F] tracking-wide">
                        Estimasi Poin & Nilai
                      </span>
                      <p className="font-semibold text-stone-900 mt-0.5">
                        {estimatedTotals.kg.toFixed(1)} kg total sampah
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-base font-bold text-[#0B3D26]">
                        +{estimatedTotals.poin} Poin
                      </span>
                      <p className="text-[11px] text-stone-500">
                        ≈ Rp {Number(estimatedTotals.rupiah ?? 0).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Proof Photo Upload */}
                <CloudinaryImageUpload
                  label="Foto Sampah yang Akan Disetor (Opsional)"
                  value={fotoUrl}
                  onChange={(url) => setFotoUrl(url)}
                  onRemove={() => setFotoUrl('')}
                  folder="hijauin/setorans"
                />

                {/* Notes Input */}
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Catatan Tambahan (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Contoh: Sudah dipilah rapi per kardus dan botol mineral."
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-[4px] focus:outline-none focus:border-[#0B3D26] bg-[#FAF8F5]"
                  />
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={createSetoranMutation.isPending}
                    className="px-5 py-2 rounded-[4px] bg-[#0B3D26] hover:bg-[#1F6B3F] text-[#F1ECDF] text-xs font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {createSetoranMutation.isPending ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      'Kirim Setoran Sampah'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
