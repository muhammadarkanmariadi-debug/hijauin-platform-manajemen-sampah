<?php

namespace Database\Seeders;

use App\Models\BankSampahUnit;
use App\Models\KategoriSampah;
use App\Enums\JenisSampah;
use Illuminate\Database\Seeder;

class KategoriSampahSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = BankSampahUnit::all();

        $canonicalCategories = [
            // ── Plastik (#2F7DB8) ──────────────────────────
            [
                'nama' => 'Botol Plastik PET Bening',
                'jenis' => JenisSampah::Plastik->value,
                'harga_per_kg' => 4500,
                'poin_per_kg' => 45,
                'deskripsi' => 'Botol air mineral transparan tanpa label dan tanpa tutup.',
                'foto_url' => 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=300&auto=format&fit=crop&q=80',
            ],
            [
                'nama' => 'Plastik HDPE Jerigen & Tutup',
                'jenis' => JenisSampah::Plastik->value,
                'harga_per_kg' => 3500,
                'poin_per_kg' => 35,
                'deskripsi' => 'Botol sampo, jerigen minyak, dan tutup botol aneka warna.',
                'foto_url' => 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=300&auto=format&fit=crop&q=80',
            ],
            [
                'nama' => 'Plastik Kresek & Kemasan PP',
                'jenis' => JenisSampah::Plastik->value,
                'harga_per_kg' => 1500,
                'poin_per_kg' => 15,
                'deskripsi' => 'Kantong kresek bersih kering dan kemasan makanan ringan.',
                'foto_url' => 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=300&auto=format&fit=crop&q=80',
            ],

            // ── Kertas (#B8873A) ───────────────────────────
            [
                'nama' => 'Kardus Dupleks & Box Cokelat',
                'jenis' => JenisSampah::Kertas->value,
                'harga_per_kg' => 2500,
                'poin_per_kg' => 25,
                'deskripsi' => 'Kardus cokelat kemasan logistik dalam kondisi kering dan terlipat.',
                'foto_url' => 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&auto=format&fit=crop&q=80',
            ],
            [
                'nama' => 'Kertas Putih HVS & Arsip',
                'jenis' => JenisSampah::Kertas->value,
                'harga_per_kg' => 3000,
                'poin_per_kg' => 30,
                'deskripsi' => 'Kertas dokumen cetak, buku tulis bekas, dan lembaran fotokopi.',
                'foto_url' => 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300&auto=format&fit=crop&q=80',
            ],
            [
                'nama' => 'Koran & Majalah Bekas',
                'jenis' => JenisSampah::Kertas->value,
                'harga_per_kg' => 1800,
                'poin_per_kg' => 18,
                'deskripsi' => 'Koran harian, tabloid buram, dan majalah kertas mengkilap.',
                'foto_url' => 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=300&auto=format&fit=crop&q=80',
            ],

            // ── Logam (#8A94A0) ────────────────────────────
            [
                'nama' => 'Kaleng Aluminium Minuman',
                'jenis' => JenisSampah::Logam->value,
                'harga_per_kg' => 14000,
                'poin_per_kg' => 140,
                'deskripsi' => 'Kaleng minuman soda, bir, dan larutan dalam kondisi dipipihkan.',
                'foto_url' => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&auto=format&fit=crop&q=80',
            ],
            [
                'nama' => 'Besi Scrap, Seng & Kaleng Susu',
                'jenis' => JenisSampah::Logam->value,
                'harga_per_kg' => 4000,
                'poin_per_kg' => 40,
                'deskripsi' => 'Kaleng biskuit, susu kental manis, paku, dan besi bekas rumah tangga.',
                'foto_url' => 'https://images.unsplash.com/photo-1509783236416-c9ad59bae472?w=300&auto=format&fit=crop&q=80',
            ],

            // ── Kaca (#4FA6A0) ─────────────────────────────
            [
                'nama' => 'Botol Kaca Sirup & Kecap Utuh',
                'jenis' => JenisSampah::Kaca->value,
                'harga_per_kg' => 1500,
                'poin_per_kg' => 15,
                'deskripsi' => 'Botol kecap, saus, sirup marjan utuh tanpa retak atau sumbing.',
                'foto_url' => 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=300&auto=format&fit=crop&q=80',
            ],
            [
                'nama' => 'Pecahan Beling Kaca Bening',
                'jenis' => JenisSampah::Kaca->value,
                'harga_per_kg' => 600,
                'poin_per_kg' => 6,
                'deskripsi' => 'Pecahan kaca jendela atau toples yang dikemas dalam wadah aman.',
                'foto_url' => 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&auto=format&fit=crop&q=80',
            ],
        ];

        foreach ($units as $unit) {
            foreach ($canonicalCategories as $cat) {
                KategoriSampah::updateOrCreate(
                    [
                        'unit_id' => $unit->id,
                        'nama' => $cat['nama'],
                    ],
                    array_merge($cat, ['unit_id' => $unit->id])
                );
            }
        }
    }
}
