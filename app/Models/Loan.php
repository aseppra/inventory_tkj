<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'borrower_name',
        'class',
        'teacher_name',
        'room',
        'status',
        'loan_date',
        'due_date',
        'returned_at',
    ];

    protected $casts = [
        'loan_date' => 'datetime',
        'due_date' => 'datetime',
        'returned_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function loanItems()
    {
        return $this->hasMany(LoanItem::class);
    }

    public function items()
    {
        return $this->belongsToMany(Item::class, 'loan_items')
                    ->withPivot('quantity')
                    ->withTimestamps();
    }
}
