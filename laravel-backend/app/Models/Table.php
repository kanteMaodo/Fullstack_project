<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    use HasFactory;

    protected $fillable = [
        'wedding_id',
        'name',
        'capacity',
        'occupied_seats',
        'location',
        'notes'
    ];

    protected $casts = [
        'capacity' => 'integer',
        'occupied_seats' => 'integer',
        'wedding_id' => 'integer'
    ];

    public function wedding()
    {
        return $this->belongsTo(Wedding::class);
    }

    public function guests()
    {
        return $this->hasMany(Guest::class);
    }

    public function getAvailableSeatsAttribute()
    {
        return $this->capacity - $this->occupied_seats;
    }

    public function getCapacityPercentageAttribute()
    {
        return $this->capacity > 0 ? ($this->occupied_seats / $this->capacity) * 100 : 0;
    }
}