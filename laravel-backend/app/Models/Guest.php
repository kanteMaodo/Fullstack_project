<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
    use HasFactory;

    protected $fillable = [
        'wedding_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'rsvp_status',
        'table_id',
        'dietary_restrictions',
        'accompanying_guests',
        'category'
    ];

    protected $casts = [
        'accompanying_guests' => 'integer',
        'wedding_id' => 'integer',
        'table_id' => 'integer'
    ];

    public function wedding()
    {
        return $this->belongsTo(Wedding::class);
    }

    public function table()
    {
        return $this->belongsTo(Table::class);
    }

    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }
}