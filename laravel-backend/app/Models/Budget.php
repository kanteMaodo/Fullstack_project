<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    use HasFactory;

    protected $fillable = [
        'wedding_id',
        'category',
        'estimated_amount',
        'actual_amount',
        'is_paid',
        'due_date',
        'vendor',
        'description'
    ];

    protected $casts = [
        'estimated_amount' => 'decimal:2',
        'actual_amount' => 'decimal:2',
        'is_paid' => 'boolean',
        'due_date' => 'date',
        'wedding_id' => 'integer'
    ];

    public function wedding()
    {
        return $this->belongsTo(Wedding::class);
    }

    public function getRemainingAmountAttribute()
    {
        return $this->estimated_amount - $this->actual_amount;
    }

    public function getIsOverBudgetAttribute()
    {
        return $this->actual_amount > $this->estimated_amount;
    }

    public function getIsOverdueAttribute()
    {
        return $this->due_date && $this->due_date->isPast() && !$this->is_paid;
    }
}