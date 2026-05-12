<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\LoanItem;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class LoanController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Admin/Loans', [
            'loans' => Loan::with(['user', 'items'])->latest()->paginate(10)->withQueryString(),
            'totalAvailable' => Item::sum('stock'),
            'filters' => [],
        ]);
    }

    public function myLoans()
    {
        return Inertia::render('Student/MyLoans', [
            'loans' => Loan::with('items')
                ->where('user_id', auth()->id())
                ->latest()
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'borrower_name' => 'required|string',
            'class' => 'required|string',
            'teacher_name' => 'required|string',
            'room' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            DB::transaction(function () use ($request, &$loan) {
                $loan = Loan::create([
                    'user_id' => auth()->id(), // null if guest
                    'borrower_name' => $request->borrower_name,
                    'class' => $request->class,
                    'teacher_name' => $request->teacher_name,
                    'room' => $request->room,
                    'status' => 'pending',
                    'loan_date' => now(),
                ]);

                foreach ($request->items as $itemData) {
                    $item = Item::find($itemData['id']);
                    
                    if ($item->stock < $itemData['quantity']) {
                        throw new \Exception("Stok tidak mencukupi untuk {$item->name}. Silakan refresh halaman untuk melihat stok terbaru.");
                    }

                    LoanItem::create([
                        'loan_id' => $loan->id,
                        'item_id' => $item->id,
                        'quantity' => $itemData['quantity'],
                    ]);
                }
            });

            $loanCode = 'TRX-' . str_pad($loan->id, 5, '0', STR_PAD_LEFT);

            if (auth()->check() && auth()->user()->role === 'student') {
                return redirect()->route('student.loans')->with(['success' => 'Permintaan peminjaman berhasil', 'loan_code' => $loanCode]);
            }

            return back()->with(['success' => 'Permintaan peminjaman berhasil dibuat.', 'loan_code' => $loanCode]);

        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function approve(Loan $loan)
    {
        if ($loan->status !== 'pending') return back();

        DB::transaction(function () use ($loan) {
            $loan->update(['status' => 'active']);

            foreach ($loan->loanItems as $loanItem) {
                $loanItem->item->decrement('stock', $loanItem->quantity);
            }
        });

        return back()->with('success', 'Peminjaman disetujui. Alat dan bahan telah diserahkan dan stok dikurangi.');
    }

    public function reject(Loan $loan)
    {
        if ($loan->status !== 'pending') return back();

        $loan->update(['status' => 'cancelled']);

        return back()->with('success', 'Permintaan peminjaman telah ditolak/dibatalkan.');
    }

    public function confirmReturn(Loan $loan)
    {
        DB::transaction(function () use ($loan) {
            $loan->update([
                'status' => 'returned',
                'returned_at' => now(),
            ]);

            foreach ($loan->loanItems as $loanItem) {
                $loanItem->item->increment('stock', $loanItem->quantity);
            }
        });

        return back()->with('success', 'Alat berhasil dikembalikan.');
    }

    public function exportPdf()
    {
        $loans = Loan::with(['user', 'items'])->latest()->get();
        
        // Cek apakah class PDF ada (dari dompdf)
        if (!class_exists('Barryvdh\DomPDF\Facade\Pdf')) {
            return back()->with('error', 'Fitur PDF belum terpasang. Mohon jalankan "composer require barryvdh/laravel-dompdf"');
        }

        $pdf = Pdf::loadView('pdf.loans', [
            'loans' => $loans,
            'date' => now()->format('d/m/Y H:i'),
        ]);

        return $pdf->download('Laporan_Peminjaman_' . now()->format('Y-m-d') . '.pdf');
    }
}
