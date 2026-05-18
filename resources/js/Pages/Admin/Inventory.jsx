import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { NeoCard, NeoButton, StatusBadge, NeoInput, NeoConfirmModal, NeoPagination } from '@/Components/Neo';

const ActionIcons = {
    Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>,
    View: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>,
    Delete: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
};

export default function Inventory({ items, categories, totalBorrowed, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [previewItem, setPreviewItem] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    // Confirmation Modal State
    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        variant: 'red'
    });

    const closeConfirm = () => setConfirmState(prev => ({ ...prev, isOpen: false }));

    const { data, setData, post, processing, reset, errors } = useForm({
        category_ids: [],
        name: '',
        serial_number: '',
        stock: 1,
        location: '',
        description: '',
        image: null,
    });

    const { data: catData, setData: setCatData, post: postCat, processing: catProcessing, reset: resetCat, errors: catErrors } = useForm({
        name: ''
    });

    const openCreateModal = () => {
        setEditId(null);
        reset();
        setData({
            category_ids: [],
            name: '',
            serial_number: '',
            stock: 1,
            location: '',
            description: '',
            image: null,
            _method: 'post',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditId(item.id);
        setData({
            category_ids: item.categories ? item.categories.map(c => c.id) : [],
            name: item.name,
            serial_number: item.serial_number || '',
            stock: item.stock,
            location: item.location || '',
            description: item.description || '',
            image: null,
            _method: 'put',
        });
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editId) {
            post(route('admin.inventory.update', editId), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setIsModalOpen(false);
                    setEditId(null);
                }
            });
        } else {
            post(route('admin.inventory.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setIsModalOpen(false);
                },
            });
        }
    };

    const submitCategory = (e) => {
        e.preventDefault();
        postCat(route('admin.categories.store'), {
            onSuccess: () => {
                resetCat();
                setIsCategoryModalOpen(false);
            }
        });
    };

    const handleDelete = (id) => {
        setConfirmState({
            isOpen: true,
            title: 'Hapus Alat',
            message: 'Yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.',
            variant: 'red',
            onConfirm: () => {
                router.delete(route('admin.inventory.destroy', id), {
                    onSuccess: () => {
                        setSelectedItems(prev => prev.filter(itemId => itemId !== id));
                        closeConfirm();
                    }
                });
            }
        });
    };

    const handleMassDelete = () => {
        setConfirmState({
            isOpen: true,
            title: 'Hapus Masal',
            message: `Yakin ingin menghapus ${selectedItems.length} item? Tindakan ini tidak dapat dibatalkan.`,
            variant: 'red',
            onConfirm: () => {
                router.post(route('admin.inventory.mass_destroy'), { ids: selectedItems }, {
                    onSuccess: () => {
                        setSelectedItems([]);
                        closeConfirm();
                    }
                });
            }
        });
    };

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearch(val);
        router.get(route('admin.inventory'), { search: val }, { 
            preserveState: true, 
            replace: true,
            preserveScroll: true 
        });
    };

    const toggleSelect = (id) => {
        setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const selectAll = (e) => {
        if (e.target.checked) setSelectedItems(items.data.map(i => i.id));
        else setSelectedItems([]);
    };

    const handleDeleteCategory = (id) => {
        setConfirmState({
            isOpen: true,
            title: 'Hapus Kategori',
            message: 'Yakin ingin menghapus kategori ini? Alat yang terhubung tidak akan ikut terhapus.',
            variant: 'red',
            onConfirm: () => {
                router.delete(route('admin.categories.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => closeConfirm()
                });
            }
        });
    };

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Inventory Management" />

                <div className="space-y-8">
                    <div className="flex justify-between items-center bg-white p-4 border-4 border-black shadow-[6px_6px_0px_#000]">
                        <div className="flex gap-4 flex-1">
                            <div className="max-w-md flex-1">
                                <NeoInput 
                                    placeholder="Cari ID atau Nama Alat..." 
                                    className="w-full" 
                                    value={search}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <NeoButton variant="blue" onClick={() => setIsCategoryModalOpen(true)}>+ Kategori</NeoButton>
                            <NeoButton variant="orange" onClick={openCreateModal}>+ Tambah Alat</NeoButton>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <NeoCard className="bg-white">
                            <p className="text-[10px] font-black text-gray-400 uppercase">Total Aset</p>
                            <h2 className="text-4xl font-black">{items.total}</h2>
                        </NeoCard>
                        <NeoCard className="bg-neo-blue text-white">
                            <p className="text-[10px] font-black uppercase opacity-60">Tersedia</p>
                            <h2 className="text-4xl font-black">{items.data.filter(i => i.status === 'available').length}</h2>
                        </NeoCard>
                        <NeoCard className="bg-neo-orange text-white">
                            <p className="text-[10px] font-black uppercase opacity-60">Dipinjam</p>
                            <h2 className="text-4xl font-black">{totalBorrowed || 0}</h2>
                        </NeoCard>
                        <NeoCard className="bg-neo-red text-white">
                            <p className="text-[10px] font-black uppercase opacity-60">Maintenance</p>
                            <h2 className="text-4xl font-black">{items.data.filter(i => i.status === 'maintenance').length}</h2>
                        </NeoCard>
                    </div>

                    <NeoCard>
                        {selectedItems.length > 0 && (
                            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-4 flex items-center justify-between gap-6 min-w-[320px] md:min-w-[450px] animate-slide-up-floating">
                                <div className="flex items-center gap-3">
                                    <span className="bg-neo-yellow text-black border-2 border-black px-2.5 py-1 text-sm font-black tracking-wider">
                                        {selectedItems.length}
                                    </span>
                                    <span className="font-black text-sm uppercase tracking-tight">item terpilih</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setSelectedItems([])} 
                                        className="text-xs font-black uppercase text-gray-500 hover:text-black transition-colors px-2 py-1"
                                    >
                                        Batal
                                    </button>
                                    <NeoButton 
                                        variant="red" 
                                        className="text-xs py-1.5 px-4 font-black uppercase tracking-wider flex items-center gap-2" 
                                        onClick={handleMassDelete}
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Hapus Semua
                                    </NeoButton>
                                </div>
                            </div>
                        )}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b-4 border-black font-black uppercase text-xs">
                                        <th className="py-4 px-2 w-10">
                                            <input type="checkbox" onChange={selectAll} checked={selectedItems.length === items.data.length && items.data.length > 0} className="w-4 h-4 border-2 border-black" />
                                        </th>
                                        <th className="py-4 px-2">ID/Serial</th>
                                        <th className="py-4 px-2">Nama Alat</th>
                                        <th className="py-4 px-2">Kategori</th>
                                        <th className="py-4 px-2">Stok</th>
                                        <th className="py-4 px-2">Status</th>
                                        <th className="py-4 px-2 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-black">
                                    {items.data.map((item) => (
                                        <tr key={item.id} className={`font-bold hover:bg-gray-50 transition-colors ${selectedItems.includes(item.id) ? 'bg-neo-blue/10' : ''}`}>
                                            <td className="py-4 px-2">
                                                <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => toggleSelect(item.id)} className="w-4 h-4 border-2 border-black" />
                                            </td>
                                            <td className="py-4 px-2 text-xs">{item.serial_number || 'N/A'}</td>
                                            <td className="py-4 px-2 flex items-center gap-3">
                                                {item.image && (
                                                    <img src={`/storage/${item.image}`} alt={item.name} className="w-8 h-8 object-cover border-2 border-black bg-gray-100" />
                                                )}
                                                {item.name}
                                            </td>
                                            <td className="py-4 px-2">
                                                <div className="flex flex-wrap gap-1">
                                                    {item.categories && item.categories.length > 0 ? (
                                                        item.categories.map(cat => (
                                                            <span key={cat.id} className="border-2 border-black px-2 py-0.5 text-[10px] uppercase bg-white">
                                                                {cat.name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-400 font-bold text-[10px]">TANPA KATEGORI</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-2">{item.stock}</td>
                                            <td className="py-4 px-2">
                                                <StatusBadge status={item.status} />
                                            </td>
                                            <td className="py-4 px-2 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => openEditModal(item)} className="p-2 border-2 border-black bg-white hover:bg-neo-blue hover:text-white transition-colors" title="Edit">
                                                        <ActionIcons.Edit />
                                                    </button>
                                                    <button onClick={() => setPreviewItem(item)} className="p-2 border-2 border-black bg-white hover:bg-neo-yellow transition-colors" title="Preview">
                                                        <ActionIcons.View />
                                                    </button>
                                                    <button onClick={() => handleDelete(item.id)} className="p-2 border-2 border-black bg-white hover:bg-neo-yellow transition-colors" title="Delete">
                                                        <ActionIcons.Delete />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <NeoPagination links={items.links} />
                    </NeoCard>
                </div>
            </AuthenticatedLayout>

            {/* Form Modal Kategori */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4 backdrop-blur-sm">
                    <NeoCard className="bg-white w-full max-w-3xl shadow-[12px_12px_0px_#000] max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-4 shrink-0">
                            <h3 className="text-xl font-black uppercase">Manajemen Kategori</h3>
                            <button onClick={() => setIsCategoryModalOpen(false)} className="text-xl font-black hover:text-neo-yellow transition-colors">✕</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden min-h-0 flex-1">
                            <div className="border-r-4 border-black pr-6 flex flex-col overflow-hidden">
                                <h4 className="text-sm font-black uppercase mb-3 shrink-0">Daftar Kategori</h4>
                                <div className="overflow-y-auto pr-2 space-y-2 flex-1">
                                    {categories.length === 0 ? (
                                        <p className="text-xs font-bold text-gray-500 italic">Belum ada kategori.</p>
                                    ) : (
                                        categories.map(cat => (
                                            <div key={cat.id} className="flex justify-between items-center p-2 border-2 border-black bg-gray-50">
                                                <span className="font-bold text-sm">{cat.name}</span>
                                                <button onClick={() => handleDeleteCategory(cat.id)} className="text-neo-red hover:bg-neo-red hover:text-white p-1 border-2 border-transparent hover:border-black transition-colors" title="Hapus Kategori">
                                                    <ActionIcons.Delete />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <h4 className="text-sm font-black uppercase mb-3 shrink-0">Tambah Baru</h4>
                                <form onSubmit={submitCategory} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-black uppercase">Nama Kategori</label>
                                        <NeoInput className="w-full" value={catData.name} onChange={e => setCatData('name', e.target.value)} required />
                                        {catErrors.name && <p className="text-red-600 text-xs mt-1">{catErrors.name}</p>}
                                    </div>
                                    <div className="pt-4 flex justify-end gap-4 mt-6">
                                        <NeoButton type="submit" variant="blue" disabled={catProcessing}>Simpan Kategori</NeoButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </NeoCard>
                </div>
            )}

            {/* Form Modal (Create/Edit Alat) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-[998] flex items-center justify-center p-4 backdrop-blur-sm">
                    <NeoCard className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[12px_12px_0px_#000]">
                        <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-6">
                            <h3 className="text-2xl font-black uppercase">{editId ? 'Edit Alat' : 'Tambah Alat Baru'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-2xl font-black hover:text-neo-red transition-colors">✕</button>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase">Nama Alat</label>
                                    <NeoInput className="w-full" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                    {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase">Serial Number</label>
                                    <NeoInput className="w-full" value={data.serial_number} onChange={e => setData('serial_number', e.target.value)} />
                                    {errors.serial_number && <p className="text-red-600 text-xs mt-1">{errors.serial_number}</p>}
                                </div>
                                <div className="space-y-1 col-span-2">
                                    <label className="text-xs font-black uppercase">Kategori (Bisa pilih lebih dari satu)</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border-2 border-black bg-gray-50 max-h-32 overflow-y-auto">
                                        {categories.map(c => (
                                            <label key={c.id} className="flex items-center gap-2 cursor-pointer group">
                                                <input 
                                                    type="checkbox" 
                                                    className="w-4 h-4 border-2 border-black rounded-none checked:bg-neo-blue transition-colors cursor-pointer"
                                                    checked={data.category_ids.includes(c.id)}
                                                    onChange={e => {
                                                        const id = c.id;
                                                        const current = [...data.category_ids];
                                                        if (e.target.checked) {
                                                            setData('category_ids', [...current, id]);
                                                        } else {
                                                            setData('category_ids', current.filter(cid => cid !== id));
                                                        }
                                                    }}
                                                />
                                                <span className="text-[10px] font-bold uppercase group-hover:text-neo-blue transition-colors">{c.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.category_ids && <p className="text-red-600 text-xs mt-1">{errors.category_ids}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase">Stok</label>
                                    <NeoInput type="number" min="0" className="w-full" value={data.stock} onChange={e => setData('stock', e.target.value)} required />
                                    {errors.stock && <p className="text-red-600 text-xs mt-1">{errors.stock}</p>}
                                </div>
                                <div className="space-y-1 col-span-2">
                                    <label className="text-xs font-black uppercase">Foto Alat</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="w-full border-2 border-black p-1.5 font-bold focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_#000] transition-shadow bg-white file:mr-4 file:py-2 file:px-4 file:border-0 file:border-r-2 file:border-black file:text-sm file:font-black file:uppercase file:bg-neo-yellow file:text-black hover:file:bg-black hover:file:text-white cursor-pointer"
                                        onChange={e => setData('image', e.target.files[0])}
                                    />
                                    {errors.image && <p className="text-red-600 text-xs mt-1">{errors.image}</p>}
                                    {editId && <p className="text-gray-500 text-[10px] mt-1 italic font-bold">Biarkan kosong jika tidak ingin mengubah foto.</p>}
                                </div>
                                <div className="space-y-1 col-span-2">
                                    <label className="text-xs font-black uppercase">Lokasi/Rak</label>
                                    <NeoInput className="w-full" value={data.location} onChange={e => setData('location', e.target.value)} />
                                    {errors.location && <p className="text-red-600 text-xs mt-1">{errors.location}</p>}
                                </div>
                                <div className="space-y-1 col-span-2">
                                    <label className="text-xs font-black uppercase">Deskripsi</label>
                                    <textarea
                                        className="w-full border-2 border-black p-2 font-bold min-h-[100px] focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_#000] transition-shadow"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                    ></textarea>
                                    {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-4 border-t-4 border-black mt-6">
                                <NeoButton type="button" variant="white" onClick={() => setIsModalOpen(false)}>Batal</NeoButton>
                                <NeoButton type="submit" variant="orange" disabled={processing}>{editId ? 'Update Alat' : 'Simpan Alat'}</NeoButton>
                            </div>
                        </form>
                    </NeoCard>
                </div>
            )}

            {/* Preview Modal */}
            {previewItem && (
                <div className="fixed inset-0 bg-black/60 z-[997] flex items-center justify-center p-4 backdrop-blur-sm">
                    <NeoCard className="bg-white w-full max-w-lg shadow-[12px_12px_0px_#000] max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start border-b-4 border-black pb-4 mb-4">
                            <div>
                                <h3 className="text-2xl font-black uppercase pr-4">{previewItem.name}</h3>
                                <p className="font-bold text-gray-500 uppercase text-xs">
                                    {previewItem.categories ? previewItem.categories.map(c => c.name).join(', ') : 'Tanpa Kategori'}
                                </p>
                            </div>
                            <button onClick={() => setPreviewItem(null)} className="text-2xl font-black hover:text-neo-red transition-colors leading-none">✕</button>
                        </div>

                        <div className="space-y-4">
                            {previewItem.image && (
                                <div className="mb-4 border-4 border-black bg-gray-100">
                                    <img src={`/storage/${previewItem.image}`} alt={previewItem.name} className="w-full h-48 object-contain" />
                                </div>
                            )}
                            <div className="flex justify-between py-2 border-b-2 border-gray-100">
                                <span className="text-xs font-black uppercase text-gray-500">Status</span>
                                <StatusBadge status={previewItem.status} />
                            </div>
                            <div className="flex justify-between py-2 border-b-2 border-gray-100">
                                <span className="text-xs font-black uppercase text-gray-500">Serial Number</span>
                                <span className="font-bold">{previewItem.serial_number || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b-2 border-gray-100">
                                <span className="text-xs font-black uppercase text-gray-500">Stok Tersedia</span>
                                <span className="font-bold">{previewItem.stock} Unit</span>
                            </div>
                            <div className="flex justify-between py-2 border-b-2 border-gray-100">
                                <span className="text-xs font-black uppercase text-gray-500">Lokasi Penempatan</span>
                                <span className="font-bold">{previewItem.location || 'Belum ditentukan'}</span>
                            </div>

                            <div className="pt-2">
                                <span className="text-xs font-black uppercase text-gray-500 block mb-1">Deskripsi</span>
                                <div className="p-3 bg-gray-50 border-2 border-black font-bold text-sm whitespace-pre-wrap">
                                    {previewItem.description || 'Tidak ada deskripsi.'}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end mt-6">
                            <NeoButton type="button" variant="white" onClick={() => setPreviewItem(null)}>Tutup Preview</NeoButton>
                        </div>
                    </NeoCard>
                </div>
            )}

            <NeoConfirmModal
                isOpen={confirmState.isOpen}
                title={confirmState.title}
                message={confirmState.message}
                variant={confirmState.variant}
                onConfirm={confirmState.onConfirm}
                onCancel={closeConfirm}
            />
        </>
    );
}
