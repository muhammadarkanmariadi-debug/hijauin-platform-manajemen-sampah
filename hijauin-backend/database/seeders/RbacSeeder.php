<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
use App\Models\RolePermission;

/**
 * Seeds the three roles and their permissions.
 * Run with: php artisan db:seed --class=RbacSeeder
 */
class RbacSeeder extends Seeder
{
    public function run(): void
    {
        // ── Roles ─────────────────────────────────────
        $nasabah = Role::firstOrCreate(
            ['code' => 'nasabah'],
            ['name' => 'Nasabah', 'description' => 'Customer/member of a waste bank unit']
        );

        $adminUnit = Role::firstOrCreate(
            ['code' => 'admin_unit'],
            ['name' => 'Admin Unit', 'description' => 'Staff/admin of a specific waste bank branch']
        );

        $platformOps = Role::firstOrCreate(
            ['code' => 'platform_ops'],
            ['name' => 'Platform Ops', 'description' => 'Hijauin platform support staff (future)']
        );

        // ── Permissions ───────────────────────────────
        $permissions = [
            // Nasabah permissions
            'submit_setoran' => 'Submit waste for weighing',
            'view_own_setorans' => 'View own submissions',
            'redeem_points' => 'Redeem points for rewards',
            'view_own_profile' => 'View own profile and balance',
            'update_own_profile' => 'Update own profile',

            // Admin permissions
            'manage_nasabah' => 'CRUD nasabah records for own unit',
            'manage_kategori' => 'CRUD waste categories for own unit',
            'manage_hadiah' => 'CRUD reward catalog for own unit',
            'verify_setoran' => 'Verify/reject submissions',
            'view_unit_setorans' => 'View all submissions for own unit',
            'view_unit_rekap' => 'View monthly recap for own unit',
            'manage_unit_profile' => 'Update unit profile (name, address, phone)',
        ];

        $permissionModels = [];
        foreach ($permissions as $code => $description) {
            $permissionModels[$code] = Permission::firstOrCreate(
                ['code' => $code],
                ['name' => ucfirst(str_replace('_', ' ', $code)), 'description' => $description]
            );
        }

        // ── Role → Permission mapping ─────────────────
        $nasabahPermissions = [
            'submit_setoran',
            'view_own_setorans',
            'redeem_points',
            'view_own_profile',
            'update_own_profile',
        ];

        $adminPermissions = [
            'manage_nasabah',
            'manage_kategori',
            'manage_hadiah',
            'verify_setoran',
            'view_unit_setorans',
            'view_unit_rekap',
            'manage_unit_profile',
        ];

        foreach ($nasabahPermissions as $permCode) {
            RolePermission::firstOrCreate([
                'role_id' => $nasabah->id,
                'permission_id' => $permissionModels[$permCode]->id,
            ]);
        }

        foreach ($adminPermissions as $permCode) {
            RolePermission::firstOrCreate([
                'role_id' => $adminUnit->id,
                'permission_id' => $permissionModels[$permCode]->id,
            ]);
        }

        // platform_ops inherits all permissions (future)
        foreach ($permissionModels as $perm) {
            RolePermission::firstOrCreate([
                'role_id' => $platformOps->id,
                'permission_id' => $perm->id,
            ]);
        }
    }
}
