<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'wedding_id',
        'title',
        'description',
        'due_date',
        'priority',
        'status',
        'assigned_to',
        'category'
    ];

    protected $casts = [
        'due_date' => 'date',
        'wedding_id' => 'integer'
    ];

    public function wedding()
    {
        return $this->belongsTo(Wedding::class);
    }

    public function getIsOverdueAttribute()
    {
        return $this->due_date && $this->due_date->isPast() && $this->status !== 'completed';
    }

    public function getIsCompletedAttribute()
    {
        return $this->status === 'completed';
    }
}