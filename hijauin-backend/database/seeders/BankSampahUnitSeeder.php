<?php

namespace Database\Seeders;

use App\Models\BankSampahUnit;
use Illuminate\Database\Seeder;

class BankSampahUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = [
            [
                'nama' => 'Bank Sampah Hijau Lestari (Pusat)',
                'alamat' => 'Jl. Boulevard Hijau No. 12, Harapan Indah, Kota Bekasi',
                'telepon' => '0812-3456-7890',
                'deskripsi' => 'Unit pusat percontohan digital dengan fasilitas timbangan presisi dan pemilahan terpadu.',
            ],
            [
                'nama' => 'Bank Sampah Melati Bersih (RW 05)',
                'alamat' => 'Jl. Melati Raya No. 45, Kebayoran Baru, Jakarta Selatan',
                'telepon' => '0813-9876-5432',
                'deskripsi' => 'Unit komunitas tingkat rukun warga aktif penggerak ekonomi sirkular lingkungan hunian.',
            ],
            [
                'nama' => 'Bank Sampah Asri Sejahtera (RW 08)',
                'alamat' => 'Jl. Dharmawangsa Asri No. 108, Gubeng, Kota Surabaya',
                'telepon' => '0821-4567-8901',
                'deskripsi' => 'Unit mandiri pemberdayaan warga dengan bank sembako penukaran hasil daur ulang.',
            ],
        ];

        foreach ($units as $u) {
            BankSampahUnit::firstOrCreate(
                ['nama' => $u['nama']],
                $u
            );
        }
    }
}
