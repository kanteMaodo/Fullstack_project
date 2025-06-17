<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wedding extends Model
{
    use HasFactory;

    protected $fillable = [
        'bride_name',
        'groom_name',
        'wedding_date',
        'venue',
        'ceremony_time',
        'reception_time',
        'estimated_guests',
        'budget'
    ];

    protected $casts = [
        'wedding_date' => 'date',
        'ceremony_time' => 'datetime:H:i',
        'reception_time' => 'datetime:H:i',
        'estimated_guests' => 'integer',
        'budget' => 'decimal:2'
    ];

    public function guests()
    {
        return $this->hasMany(Guest::class);
    }

    public function tables()
    {
        return $this->hasMany(Table::class);
    }

    public function budgets()
    {
        return $this->hasMany(Budget::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}