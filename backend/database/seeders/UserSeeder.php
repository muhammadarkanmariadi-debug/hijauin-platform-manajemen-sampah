<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin User
        User::create([
            'name' => 'Admin Hijauin',
            'email' => 'admin@hijauin.com',
            'password' => Hash::make('password123'),
            'phone' => '081234567890',
            'role' => 'admin',
            'status' => 'active',
            'hijau_points' => 0,
        ]);

        // Customer Users
        $customers = [
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@example.com',
                'phone' => '081234567801',
                'zone' => 'Jakarta Selatan',
                'hijau_points' => 150,
            ],
            [
                'name' => 'Siti Rahayu',
                'email' => 'siti@example.com',
                'phone' => '081234567802',
                'zone' => 'Jakarta Utara',
                'hijau_points' => 280,
            ],
            [
                'name' => 'Ahmad Fauzi',
                'email' => 'ahmad@example.com',
                'phone' => '081234567803',
                'zone' => 'Jakarta Pusat',
                'hijau_points' => 95,
            ],
            [
                'name' => 'Dewi Lestari',
                'email' => 'dewi@example.com',
                'phone' => '081234567804',
                'zone' => 'Jakarta Barat',
                'hijau_points' => 420,
            ],
        ];

        foreach ($customers as $customer) {
            User::create([
                'name' => $customer['name'],
                'email' => $customer['email'],
                'password' => Hash::make('password123'),
                'phone' => $customer['phone'],
                'role' => 'customer',
                'zone' => $customer['zone'],
                'status' => 'active',
                'hijau_points' => $customer['hijau_points'],
            ]);
        }

        // Petugas (Worker) Users
        $petugas = [
            [
                'name' => 'Joko Widodo',
                'email' => 'joko@hijauin.com',
                'phone' => '081234567811',
                'zone' => 'Jakarta Selatan',
            ],
            [
                'name' => 'Bambang Susilo',
                'email' => 'bambang@hijauin.com',
                'phone' => '081234567812',
                'zone' => 'Jakarta Utara',
            ],
            [
                'name' => 'Suryadi',
                'email' => 'suryadi@hijauin.com',
                'phone' => '081234567813',
                'zone' => 'Jakarta Pusat',
            ],
            [
                'name' => 'Wahyudi',
                'email' => 'wahyudi@hijauin.com',
                'phone' => '081234567814',
                'zone' => 'Jakarta Barat',
            ],
            [
                'name' => 'Rudi Hartono',
                'email' => 'rudi@hijauin.com',
                'phone' => '081234567815',
                'zone' => 'Jakarta Timur',
            ],
        ];

        foreach ($petugas as $worker) {
            User::create([
                'name' => $worker['name'],
                'email' => $worker['email'],
                'password' => Hash::make('password123'),
                'phone' => $worker['phone'],
                'role' => 'petugas',
                'zone' => $worker['zone'],
                'status' => 'active',
                'hijau_points' => 0,
            ]);
        }

        // Partner Users
        $partners = [
            [
                'name' => 'Bank Sampah Bersama',
                'email' => 'bersama@partner.com',
                'phone' => '081234567821',
                'address' => 'Jl. Lingkungan Hijau No. 15, Jakarta',
            ],
            [
                'name' => 'Recycling Center Jakarta',
                'email' => 'recycling@partner.com',
                'phone' => '081234567822',
                'address' => 'Jl. Daur Ulang No. 7, Jakarta',
            ],
        ];

        foreach ($partners as $partner) {
            User::create([
                'name' => $partner['name'],
                'email' => $partner['email'],
                'password' => Hash::make('password123'),
                'phone' => $partner['phone'],
                'role' => 'partner',
                'address' => $partner['address'],
                'status' => 'active',
                'hijau_points' => 0,
            ]);
        }

        $this->command->info('✅ Users seeded successfully!');
    }
}
