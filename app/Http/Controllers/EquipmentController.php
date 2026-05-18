<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EquipmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Item::with('categories');

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('serial_number', 'like', "%{$request->search}%");
        }

        if ($request->category) {
            $query->whereHas('categories', function($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        return Inertia::render('Catalog/Index', [
            'items' => $query->latest()->paginate(8)->withQueryString(),
            'categories' => Category::all(),
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function inventory(Request $request)
    {
        $query = Item::with('categories');

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('serial_number', 'like', "%{$request->search}%");
        }

        return Inertia::render('Admin/Inventory', [
            'items' => $query->latest()->paginate(10)->withQueryString(),
            'categories' => Category::all(),
            'totalBorrowed' => \App\Models\LoanItem::whereHas('loan', function($q) {
                $q->whereIn('status', ['pending', 'active']);
            })->sum('quantity'),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_ids' => 'required|array|min:1',
            'category_ids.*' => 'exists:categories,id',
            'name' => 'required|string|max:255',
            'serial_number' => 'nullable|string|unique:items,serial_number',
            'stock' => 'required|integer|min:0',
            'location' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('items', 'public');
        }

        $validated['slug'] = \Illuminate\Support\Str::slug($request->name) . '-' . uniqid();

        $item = Item::create($validated);
        $item->categories()->sync($request->category_ids);

        return back()->with('success', 'Alat berhasil ditambahkan.');
    }

    public function update(Request $request, Item $item)
    {
        $validated = $request->validate([
            'category_ids' => 'required|array|min:1',
            'category_ids.*' => 'exists:categories,id',
            'name' => 'required|string|max:255',
            'serial_number' => 'nullable|string|unique:items,serial_number,' . $item->id,
            'stock' => 'required|integer|min:0',
            'location' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($item->image) {
                Storage::disk('public')->delete($item->image);
            }
            $validated['image'] = $request->file('image')->store('items', 'public');
        } else {
            unset($validated['image']);
        }

        if ($validated['stock'] <= 0) {
            $validated['status'] = 'unavailable';
        } else if ($item->status === 'unavailable' && $validated['stock'] > 0) {
            $validated['status'] = 'available';
        }

        $item->update($validated);
        $item->categories()->sync($request->category_ids);

        return back()->with('success', 'Alat berhasil diupdate.');
    }

    public function destroy(Item $item)
    {
        if ($item->image) {
            Storage::disk('public')->delete($item->image);
        }

        $item->delete();
        return back()->with('success', 'Alat berhasil dihapus.');
    }

    public function massDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:items,id'
        ]);

        $items = Item::whereIn('id', $request->ids)->get(['id', 'image']);
        
        foreach ($items as $item) {
            if ($item->image) {
                Storage::disk('public')->delete($item->image);
            }
        }

        Item::whereIn('id', $request->ids)->delete();

        return back()->with('success', 'Beberapa alat berhasil dihapus.');
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name'
        ]);
        
        $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']);
        Category::create($validated);

        return back()->with('success', 'Kategori baru berhasil ditambahkan.');
    }

    public function destroyCategory(Category $category)
    {
        // Category delete will cascade to set items' category_id to null
        $category->delete();

        return back()->with('success', 'Kategori berhasil dihapus. Alat yang terhubung kini tidak memiliki kategori.');
    }
}
