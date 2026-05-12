<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [EquipmentController::class, 'index'])->name('catalog.index');
Route::post('/loans', [LoanController::class, 'store'])->name('loans.store');

Route::middleware(['auth'])->group(function () {
    // Shared
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin Only
    Route::middleware(['can:admin'])->group(function () {
        Route::get('/admin/export/loans', [LoanController::class, 'exportPdf'])->name('admin.loans.export');
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/admin/inventory', [EquipmentController::class, 'inventory'])->name('admin.inventory');
        Route::post('/admin/inventory', [EquipmentController::class, 'store'])->name('admin.inventory.store');
        Route::post('/admin/categories', [EquipmentController::class, 'storeCategory'])->name('admin.categories.store');
        Route::delete('/admin/categories/{category}', [EquipmentController::class, 'destroyCategory'])->name('admin.categories.destroy');
        Route::put('/admin/inventory/{item}', [EquipmentController::class, 'update'])->name('admin.inventory.update');
        Route::delete('/admin/inventory/{item}', [EquipmentController::class, 'destroy'])->name('admin.inventory.destroy');
        Route::post('/admin/inventory/mass-destroy', [EquipmentController::class, 'massDestroy'])->name('admin.inventory.mass_destroy');
        Route::get('/admin/loans', [LoanController::class, 'index'])->name('admin.loans');
        Route::post('/admin/loans/{loan}/return', [LoanController::class, 'confirmReturn'])->name('admin.loans.return');
        Route::post('/admin/loans/{loan}/approve', [LoanController::class, 'approve'])->name('admin.loans.approve');
        Route::post('/admin/loans/{loan}/reject', [LoanController::class, 'reject'])->name('admin.loans.reject');
        Route::post('/admin/users', [ProfileController::class, 'storeUser'])->name('admin.users.store');
        Route::put('/admin/users/{user}', [ProfileController::class, 'updateUser'])->name('admin.users.update');
        Route::delete('/admin/users/{user}', [ProfileController::class, 'destroyUser'])->name('admin.users.destroy');
    });

    // Operator Only
    Route::middleware(['can:operator'])->group(function () {
        Route::get('/my-loans', [LoanController::class, 'myLoans'])->name('student.loans');
    });
});

require __DIR__.'/auth.php';
