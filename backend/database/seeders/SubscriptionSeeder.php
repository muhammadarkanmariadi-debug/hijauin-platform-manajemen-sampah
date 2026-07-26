<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Subscription;
use App\Models\User;
use App\Models\Address;
use App\Models\WasteType;
use Illuminate\Support\Str;
use Carbon\Carbon;

class SubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = User::where('role', 'customer')->get();
        $wasteType = WasteType::first();
        foreach ($customers as $customer) {
            $address = Address::where('user_id', $customer->id)->first();
            if (!$address || !$wasteType) continue;
            Subscription::create([
                'subscription_number' => 'SUB-' . strtoupper(Str::random(8)),
                'customer_id' => $customer->id,
                'address_id' => $address->id,
                'waste_type_id' => $wasteType->id,
                'plan_type' => 'weekly_2x',
                'pickups_per_week' => 2,
                'pickup_days' => json_encode([1,3,5]),
                'preferred_time' => '08:00:00',
                'estimated_weight_per_pickup' => 2.5,
                'monthly_price' => 75000,
                'payment_method' => 'monthly_invoice',
                'status' => 'active',
                'start_date' => Carbon::now()->subDays(10)->toDateString(),
                'end_date' => Carbon::now()->addMonths(1)->toDateString(),
                'next_pickup_date' => Carbon::now()->addDays(1)->toDateString(),
                'paused_until' => null,
                'cancellation_reason' => null,
            ]);
        }
        $this->command->info('✅ Subscriptions seeded successfully!');
    }
}
