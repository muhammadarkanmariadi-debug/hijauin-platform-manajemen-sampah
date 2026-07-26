<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['customer', 'petugas', 'admin', 'partner'])->default('customer')->after('email');
            $table->string('phone', 20)->nullable()->after('email');
            $table->text('address')->nullable()->after('phone');
            $table->decimal('hijau_points', 10, 2)->default(0)->after('address');
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active')->after('hijau_points');
            $table->string('profile_photo')->nullable()->after('status');
            $table->json('availability')->nullable()->after('profile_photo'); // for petugas (jadwal kerja)
            $table->string('zone')->nullable()->after('availability'); // area operasional petugas
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'phone', 'address', 'hijau_points', 'status', 'profile_photo', 'availability', 'zone']);
        });
    }
};
