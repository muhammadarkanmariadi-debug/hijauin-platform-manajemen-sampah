<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WasteTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $wasteTypes = [
            [
                'name' => 'Organik',
                'slug' => 'organik',
                'description' => 'Sampah organik seperti sisa makanan, daun, sayuran, dan bahan alami lainnya yang mudah terurai.',
                'base_price_per_kg' => 2000,
                'points_per_kg' => 10,
                'icon' => 'organic-icon.png',
                'is_active' => true,
            ],
            [
                'name' => 'Anorganik',
                'slug' => 'anorganik',
                'description' => 'Sampah anorganik seperti plastik, kertas, kardus, botol, dan kaleng yang bisa didaur ulang.',
                'base_price_per_kg' => 3000,
                'points_per_kg' => 15,
                'icon' => 'anorganic-icon.png',
                'is_active' => true,
            ],
            [
                'name' => 'E-Waste',
                'slug' => 'e-waste',
                'description' => 'Sampah elektronik seperti HP lama, laptop rusak, kabel, baterai, dan perangkat elektronik lainnya.',
                'base_price_per_kg' => 5000,
                'points_per_kg' => 25,
                'icon' => 'ewaste-icon.png',
                'is_active' => true,
            ],
            [
                'name' => 'Sampah Besar',
                'slug' => 'sampah-besar',
                'description' => 'Sampah berukuran besar seperti furniture, kasur, lemari, dan barang-barang rumah tangga besar lainnya.',
                'base_price_per_kg' => 1500,
                'points_per_kg' => 20,
                'icon' => 'bulky-icon.png',
                'is_active' => true,
            ],
        ];

        foreach ($wasteTypes as $type) {
            \App\Models\WasteType::create($type);
        }

        $this->command->info('Waste types seeded successfully!');
    }
}
