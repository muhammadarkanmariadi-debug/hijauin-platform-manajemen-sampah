<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\UserRole;
use App\Models\NasabahProfile;
use App\Models\BankSampahUnit;
use App\Enums\RoleCode;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roleOps = Role::where('code', RoleCode::PlatformOps->value)->firstOrFail();
        $roleAdmin = Role::where('code', RoleCode::AdminUnit->value)->firstOrFail();
        $roleNasabah = Role::where('code', RoleCode::Nasabah->value)->firstOrFail();

        $units = BankSampahUnit::orderBy('id')->get();
        $unit1 = $units->get(0);
        $unit2 = $units->get(1) ?? $unit1;
        $unit3 = $units->get(2) ?? $unit1;

        // 1. Platform Ops Superuser
        $opsUser = User::firstOrCreate(
            ['email' => 'ops@hijauin.test'],
            [
                'full_name' => 'Super Administrator Platform',
                'password' => Hash::make('password'),
                'phone' => '0811-0000-0001',
                'photo_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            ]
        );
        UserRole::firstOrCreate(
            ['user_id' => $opsUser->id, 'role_id' => $roleOps->id],
            ['unit_id' => null]
        );

        // 2. Admin Unit Users
        $admins = [
            [
                'email' => 'admin.bekasi@hijauin.test',
                'full_name' => 'Rahmat Hidayat (Admin Bekasi)',
                'unit_id' => $unit1->id,
                'phone' => '0812-1111-2222',
            ],
            [
                'email' => 'admin.jakarta@hijauin.test',
                'full_name' => 'Sri Wahyuni (Admin Melati Jakarta)',
                'unit_id' => $unit2->id,
                'phone' => '0813-2222-3333',
            ],
            [
                'email' => 'admin.surabaya@hijauin.test',
                'full_name' => 'Bambang Soeprapto (Admin Surabaya)',
                'unit_id' => $unit3->id,
                'phone' => '0814-3333-4444',
            ],
        ];

        foreach ($admins as $adm) {
            $u = User::firstOrCreate(
                ['email' => $adm['email']],
                [
                    'full_name' => $adm['full_name'],
                    'password' => Hash::make('password'),
                    'phone' => $adm['phone'],
                ]
            );
            UserRole::firstOrCreate(
                ['user_id' => $u->id, 'role_id' => $roleAdmin->id],
                ['unit_id' => $adm['unit_id']]
            );
        }

        // 3. Nasabah Users
        $nasabahs = [
            [
                'email' => 'demo@hijauin.test',
                'full_name' => 'Demo Nasabah Hijauin',
                'phone' => '0812-3456-7890',
                'unit_id' => $unit1->id,
                'alamat' => 'Jl. Boulevard Hijau No. 18, Harapan Indah, Bekasi',
                'saldo_poin' => 540,
                'photo_url' => 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            ],
            [
                'email' => 'budi.santoso@gmail.com',
                'full_name' => 'Budi Santoso',
                'phone' => '0812-9988-7766',
                'unit_id' => $unit1->id,
                'alamat' => 'Jl. Cendana No. 4, Harapan Indah, Bekasi',
                'saldo_poin' => 380,
                'photo_url' => 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
            ],
            [
                'email' => 'siti.aminah@gmail.com',
                'full_name' => 'Siti Aminah',
                'phone' => '0813-7766-5544',
                'unit_id' => $unit1->id,
                'alamat' => 'Komplek Taman Kenari Blok B2 No. 8, Bekasi',
                'saldo_poin' => 210,
                'photo_url' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
            ],
            [
                'email' => 'ahmad.dahlan@hijauin.test',
                'full_name' => 'Ahmad Dahlan',
                'phone' => '0815-4433-2211',
                'unit_id' => $unit2->id,
                'alamat' => 'Jl. Melati IV No. 12, RW 05, Kebayoran Baru, Jakarta Selatan',
                'saldo_poin' => 420,
                'photo_url' => null,
            ],
            [
                'email' => 'dewi.lestari@hijauin.test',
                'full_name' => 'Dewi Lestari',
                'phone' => '0816-1122-3344',
                'unit_id' => $unit2->id,
                'alamat' => 'Jl. Gandaria No. 7, Kebayoran Baru, Jakarta Selatan',
                'saldo_poin' => 195,
                'photo_url' => null,
            ],
            [
                'email' => 'eko.prasetyo@hijauin.test',
                'full_name' => 'Eko Prasetyo',
                'phone' => '0821-6677-8899',
                'unit_id' => $unit3->id,
                'alamat' => 'Jl. Gubeng Kertajaya VIII No. 15, Gubeng, Surabaya',
                'saldo_poin' => 610,
                'photo_url' => null,
            ],
        ];

        foreach ($nasabahs as $n) {
            $user = User::firstOrCreate(
                ['email' => $n['email']],
                [
                    'full_name' => $n['full_name'],
                    'password' => Hash::make('password'),
                    'phone' => $n['phone'],
                    'photo_url' => $n['photo_url'] ?? null,
                ]
            );

            UserRole::firstOrCreate(
                ['user_id' => $user->id, 'role_id' => $roleNasabah->id],
                ['unit_id' => $n['unit_id']]
            );

            $profile = NasabahProfile::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'unit_id' => $n['unit_id'],
                    'alamat' => $n['alamat'],
                    'saldo_poin' => $n['saldo_poin'],
                ]
            );

            // Update if already existed to guarantee seeded balance
            $profile->update([
                'saldo_poin' => $n['saldo_poin'],
                'alamat' => $n['alamat'],
                'unit_id' => $n['unit_id'],
            ]);
        }
    }
}
