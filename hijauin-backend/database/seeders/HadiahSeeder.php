<?php

namespace Database\Seeders;

use App\Models\BankSampahUnit;
use App\Models\Hadiah;
use Illuminate\Database\Seeder;

class HadiahSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = BankSampahUnit::all();

        $rewards = [
            [
                'nama' => 'Minyak Goreng Sawit 1 Liter',
                'deskripsi' => 'Minyak goreng kemasan bantal higienis grade premium untuk kebutuhan dapur.',
                'poin_diperlukan' => 150,
                'stok' => 50,
                'foto_url' => 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80',
            ],
            [
                'nama' => 'Beras Ramos Premium 2.5 kg',
                'deskripsi' => 'Beras pulen bermutu tinggi hasil tani lokal terverifikasi bebas pemutih.',
                'poin_diperlukan' => 300,
                'stok' => 30,
                'foto_url' => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80',
            ],
            [
                'nama' => 'Gula Pasir Kristal Putih 1 kg',
                'deskripsi' => 'Gula pasir tebu kristal putih murni kemasan pabrik standar SNI.',
                'poin_diperlukan' => 120,
                'stok' => 45,
                'foto_url' => 'https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=400&auto=format&fit=crop&q=80',
            ],
            [
                'nama' => 'Sabun Cuci Piring Refill 750ml',
                'deskripsi' => 'Cairan pembersih lemak efektif dengan formula jeruk nipis alami.',
                'poin_diperlukan' => 80,
                'stok' => 60,
                'foto_url' => 'https://images.unsplash.com/photo-1585670270638-724f79435b0d?w=400&auto=format&fit=crop&q=80',
            ],
            [
                'nama' => 'Token Listrik PLN Prabayar Rp 20.000',
                'deskripsi' => 'Voucher nomor token 20 digit dikirimkan langsung via WhatsApp atau SMS.',
                'poin_diperlukan' => 200,
                'stok' => 100,
                'foto_url' => 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400&auto=format&fit=crop&q=80',
            ],
            [
                'nama' => 'Totebag Belanja Kanvas Daur Ulang',
                'deskripsi' => 'Tas belanja ramah lingkungan tebal, kuat membawa beban hingga 15 kg.',
                'poin_diperlukan' => 50,
                'stok' => 80,
                'foto_url' => 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80',
            ],
            [
                'nama' => 'Tumbler Stainless Steel 500ml',
                'deskripsi' => 'Botol minum insulasi termal ganda, tahan panas dan dingin hingga 12 jam.',
                'poin_diperlukan' => 180,
                'stok' => 25,
                'foto_url' => 'https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=400&auto=format&fit=crop&q=80',
            ],
            [
                'nama' => 'Paket Bibit Sayur & Pupuk Kompos',
                'deskripsi' => 'Paket bercocok tanam polybag: pupuk organik fermentasi dan benih sayur kangkung/bayam.',
                'poin_diperlukan' => 45,
                'stok' => 40,
                'foto_url' => 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&auto=format&fit=crop&q=80',
            ],
        ];

        foreach ($units as $unit) {
            foreach ($rewards as $r) {
                Hadiah::updateOrCreate(
                    [
                        'unit_id' => $unit->id,
                        'nama' => $r['nama'],
                    ],
                    array_merge($r, ['unit_id' => $unit->id])
                );
            }
        }
    }
}
