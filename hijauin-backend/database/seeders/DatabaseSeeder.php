<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database in strict dependency order.
     */
    public function run(): void
    {
        $this->call([
            RbacSeeder::class,
            BankSampahUnitSeeder::class,
            UserSeeder::class,
            KategoriSampahSeeder::class,
            HadiahSeeder::class,
            SetoranSeeder::class,
            PenukaranSeeder::class,
        ]);
    }
}
