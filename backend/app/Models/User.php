<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use App\Models\Wallet;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'address',
        'hijau_points',
        'status',
        'profile_photo',
        'availability',
        'zone',
    ];


    public function wallets()
    {
        return $this->hasMany(wallets::class);
    }

    // Relationships
    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'customer_id');
    }

    public function assignedOrders()
    {
        return $this->hasMany(Order::class, 'assigned_petugas_id');
    }

    public function reports()
    {
        return $this->hasMany(Report::class, 'reporter_id');
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class, 'customer_id');
    }

    public function paymentTransactions()
    {
        return $this->hasMany(PaymentTransaction::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'customer_id');
    }

    public function receivedReviews()
    {
        return $this->hasMany(Review::class, 'petugas_id');
    }

    public function hijauPoints()
    {
        return $this->hasMany(HijauPoint::class);
    }

    public function educationalContents()
    {
        return $this->hasMany(EducationalContent::class, 'author_id');
    }

    // Scopes
    public function scopeCustomers($query)
    {
        return $query->where('role', 'customer');
    }

    public function scopePetugas($query)
    {
        return $query->where('role', 'petugas');
    }

    public function scopeAdmins($query)
    {
        return $query->where('role', 'admin');
    }

    public function scopePartners($query)
    {
        return $query->where('role', 'partner');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // Helper methods
    public function isCustomer()
    {
        return $this->role === 'customer';
    }

    public function isPetugas()
    {
        return $this->role === 'petugas';
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isPartner()
    {
        return $this->role === 'partner';
    }

    public function addPoints($points, $description, $pointableType = null, $pointableId = null)
    {
        $this->increment('hijau_points', $points);

        return HijauPoint::create([
            'user_id' => $this->id,
            'points' => $points,
            'type' => 'earned',
            'description' => $description,
            'pointable_type' => $pointableType,
            'pointable_id' => $pointableId,
        ]);
    }

    public function deductPoints($points, $description)
    {
        if ($this->hijau_points >= $points) {
            $this->decrement('hijau_points', $points);

            return HijauPoint::create([
                'user_id' => $this->id,
                'points' => -$points,
                'type' => 'redeemed',
                'description' => $description,
            ]);
        }

        return false;
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Rest omitted for brevity

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
}
