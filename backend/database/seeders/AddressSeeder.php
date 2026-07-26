<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Address;
use App\Models\User;

class AddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get customer users
        $customers = User::where('role', 'customer')->get();

        if ($customers->isEmpty()) {
            $this->command->warn('⚠️  No customers found. Run UserSeeder first.');
            return;
        }

        // Budi Santoso - Jakarta Selatan
        $budi = $customers->where('email', 'budi@example.com')->first();
        if ($budi) {
            Address::create([
                'user_id' => $budi->id,
                'label' => 'Rumah',
                'full_address' => 'Jl. Mampang Prapatan Raya No. 123',
                'kelurahan' => 'Mampang Prapatan',
                'kecamatan' => 'Mampang Prapatan',
                'city' => 'Jakarta Selatan',
                'province' => 'DKI Jakarta',
                'postal_code' => '12790',
                'latitude' => -6.285790,
                'longitude' => 106.844460,
                'notes' => 'Dekat dengan minimarket',
                'is_default' => true,
            ]);
        }

        // Siti Rahayu - Jakarta Utara
        $siti = $customers->where('email', 'siti@example.com')->first();
        if ($siti) {
            Address::create([
                'user_id' => $siti->id,
                'label' => 'Rumah',
                'full_address' => 'Jl. Kelapa Gading Boulevard No. 45',
                'kelurahan' => 'Kelapa Gading Barat',
                'kecamatan' => 'Kelapa Gading',
                'city' => 'Jakarta Utara',
                'province' => 'DKI Jakarta',
                'postal_code' => '14240',
                'latitude' => -6.158070,
                'longitude' => 106.907850,
                'notes' => 'Komplek perumahan Kelapa Gading',
                'is_default' => true,
            ]);

            // Second address
            Address::create([
                'user_id' => $siti->id,
                'label' => 'Kantor',
                'full_address' => 'Jl. Pluit Selatan Raya No. 12',
                'kelurahan' => 'Pluit',
                'kecamatan' => 'Penjaringan',
                'city' => 'Jakarta Utara',
                'province' => 'DKI Jakarta',
                'postal_code' => '14450',
                'latitude' => -6.126440,
                'longitude' => 106.788870,
                'notes' => 'Gedung perkantoran lantai 5',
                'is_default' => false,
            ]);
        }

        // Ahmad Fauzi - Jakarta Pusat
        $ahmad = $customers->where('email', 'ahmad@example.com')->first();
        if ($ahmad) {
            Address::create([
                'user_id' => $ahmad->id,
                'label' => 'Rumah',
                'full_address' => 'Jl. Tanah Abang II No. 67',
                'kelurahan' => 'Tanah Abang',
                'kecamatan' => 'Tanah Abang',
                'city' => 'Jakarta Pusat',
                'province' => 'DKI Jakarta',
                'postal_code' => '10160',
                'latitude' => -6.195350,
                'longitude' => 106.814040,
                'notes' => 'Gang masuk sebelah toko baju',
                'is_default' => true,
            ]);
        }

        // Dewi Lestari - Jakarta Barat
       
        $this->command->info('✅ Addresses seeded successfully!');
    }
}
