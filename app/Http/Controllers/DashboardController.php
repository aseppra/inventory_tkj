<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Loan;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_items' => Item::sum('stock'),
            'active_loans' => Loan::whereIn('status', ['pending', 'active'])->count(),
            'low_stock' => Item::where('stock', '<', 5)->count(),
            'total_students' => User::where('role', 'student')->count(),
        ];

        $recent_loans = Loan::with(['user', 'items'])
            ->latest()
            ->take(5)
            ->get();

        $critical_items = Item::where('stock', '<', 5)
            ->take(4)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recent_loans' => $recent_loans,
            'critical_items' => $critical_items,
        ]);
    }
}
