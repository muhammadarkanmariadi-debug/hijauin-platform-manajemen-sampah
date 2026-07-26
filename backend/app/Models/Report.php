<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Report extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'report_number',
        'reporter_id',
        'title',
        'description',
        'photo_url',
        'location_address',
        'kelurahan',
        'kecamatan',
        'city',
        'latitude',
        'longitude',
        'priority',
        'status',
        'assigned_to',
        'assigned_at',
        'resolved_at',
        'resolution_photo',
        'resolution_notes',
        'points_awarded',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'points_awarded' => 'integer',
        'assigned_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];

    // Auto-generate report number
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($report) {
            if (empty($report->report_number)) {
                $report->report_number = 'REP-' . Carbon::now()->format('Ymd') . '-' . str_pad(static::whereDate('created_at', Carbon::today())->count() + 1, 4, '0', STR_PAD_LEFT);
            }
        });
    }

    // Relationships
    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function hijauPoints()
    {
        return $this->morphMany(HijauPoint::class, 'pointable');
    }

    // Scopes
    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopeResolved($query)
    {
        return $query->where('status', 'resolved');
    }

    public function scopeHighPriority($query)
    {
        return $query->where('priority', 'high');
    }

    // Methods
    public function assignTo($userId)
    {
        $this->update([
            'assigned_to' => $userId,
            'status' => 'in_progress',
            'assigned_at' => Carbon::now(),
        ]);
    }

    public function markAsResolved($photo = null, $notes = null)
    {
        $this->update([
            'status' => 'resolved',
            'resolved_at' => Carbon::now(),
            'resolution_photo' => $photo,
            'resolution_notes' => $notes,
        ]);

        // Award points to reporter
        if ($this->points_awarded > 0) {
            $this->reporter->addPoints(
                $this->points_awarded,
                "Report resolved: {$this->report_number}",
                Report::class,
                $this->id
            );
        }
    }

    public function getPhotosAttribute()
    {
        return json_decode($this->photo_url, true) ?? [];
    }

    public function setPhotosAttribute($value)
    {
        $this->attributes['photo_url'] = json_encode($value);
    }
}
