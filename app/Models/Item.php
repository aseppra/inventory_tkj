<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'serial_number',
        'description',
        'stock',
        'location',
        'image',
        'status',
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    public function loanItems()
    {
        return $this->hasMany(LoanItem::class);
    }
}
