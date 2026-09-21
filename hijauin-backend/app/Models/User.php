<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'photo_url',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function userRoles(): HasMany
    {
        return $this->hasMany(UserRole::class);
    }

    public function nasabahProfile(): HasOne
    {
        return $this->hasOne(NasabahProfile::class);
    }

    /**
     * Get all roles for this user (through the pivot).
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles')
            ->withPivot('unit_id');
    }

    /**
     * Check if user has a specific role code.
     */
    public function hasRole(string $roleCode): bool
    {
        return $this->userRoles()
            ->whereHas('role', fn ($q) => $q->where('code', $roleCode))
            ->exists();
    }

    /**
     * Get the unit_id for a specific role, or the first available.
     */
    public function getUnitId(?string $roleCode = null): ?int
    {
        $query = $this->userRoles()->whereNotNull('unit_id');

        if ($roleCode) {
            $query->whereHas('role', fn ($q) => $q->where('code', $roleCode));
        }

        return $query->value('unit_id');
    }
}
