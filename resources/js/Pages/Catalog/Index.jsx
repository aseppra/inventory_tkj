import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { NeoCard, NeoButton, StatusBadge, NeoInput, NeoToast, NeoLoader, NeoPagination } from '@/Components/Neo';

export default function Index({ items, categories, filters }) {
    const { auth } = usePage().props;
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const handleFilter = (category) => {
        router.get(route('catalog.index'), { ...filters, category }, { preserveState: true, preserveScroll: true });
    };

    const handleSearch = (e) => {
        router.get(route('catalog.index'), { ...filters, search: e.target.value }, { preserveState: true, replace: true, preserveScroll: true });
    };

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorModal, setErrorModal] = useState(null);
    const { flash } = usePage().props;
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const startListener = router.on('start', () => setLoading(true));
        const finishListener = router.on('finish', () => setLoading(false));
        const errorListener = router.on('error', () => setLoading(false));

        // Auto-refresh every 2 minutes to sync stock
        const refreshInterval = setInterval(() => {
            router.reload({
                preserveScroll: true,
                preserveState: true,
                only: ['items'] // Only refresh the items data to be efficient
            });
        }, 120000);

        return () => {
            startListener();
            finishListener();
            errorListener();
            clearInterval(refreshInterval);
        };
    }, []);

    useEffect(() => {
        if (flash?.loan_code) {
            setShowSuccessModal(true);
        } else if (flash?.success) {
            setToast({ message: flash.success, type: 'success' });
        } else if (flash?.error) {
            setErrorModal(flash.error);
        }
    }, [flash]);

    const addToCart = (item) => {
        if (item.stock <= 0 || item.status !== 'available') return;

        const existing = cart.find(i => i.id === item.id);
        if (existing) {
            if (existing.quantity < item.stock) {
                setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
            } else {
                setToast({ message: `Maksimal stok yang tersedia hanya ${item.stock} unit.`, type: 'warning' });
            }
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const updateQuantity = (id, delta) => {
        setCart(currentCart => currentCart.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                if (newQty > 0 && newQty <= item.stock) {
                    return { ...item, quantity: newQty };
                }
            }
            return item;
        }).filter(item => !(item.id === id && item.quantity + delta <= 0)));
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(i => i.id !== id));
    };

    const { data, setData, post, processing, errors } = useForm({
        borrower_name: auth.user ? auth.user.name : '',
        class: auth.user ? auth.user.class : '',
        teacher_name: '',
        room: '',
        items: []
    });

    const submitLoan = (e) => {
        e.preventDefault();
        data.items = cart.map(i => ({ id: i.id, quantity: i.quantity }));
        post(route('loans.store'), {
            onSuccess: () => {
                setCart([]);
                setIsCartOpen(false);
            }
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-black">
            <Head title="Katalog Alat" />

            <header className="bg-white border-b-4 border-black px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center justify-between w-full">
                    <Link href="/" className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                        <span className="text-3xl">🛠️</span> TKJ_PINJAM_ALAT
                    </Link>

                    <nav className="hidden md:flex items-center space-x-6 font-bold text-sm">
                        <button onClick={() => setIsCartOpen(true)} className="hover:text-neo-blue uppercase">Keranjang</button>
                    </nav>
                </div>
            </header>

            <main className="flex-1 flex flex-col">
                <div className="p-8 flex-1 space-y-8">
                    {/* Hero section */}
                    <NeoCard className="bg-neo-blue text-white p-12">
                        <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4">
                            Gudang Alat & <br /> Bahan Praktek TKJ
                        </h2>
                        <p className="max-w-2xl font-bold opacity-90 text-lg">
                            Cek ketersediaan barang secara real-time. Pinjam router, switch, tang crimping, atau alat tempur praktek lainnya langsung dari sini.
                        </p>
                    </NeoCard>

                    {/* Filter section */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <NeoButton
                            onClick={() => handleFilter('')}
                            variant={!filters.category ? 'blue' : 'white'}
                            className="text-xs uppercase"
                        >
                            Semua Asset
                        </NeoButton>
                        {categories.map(cat => (
                            <NeoButton
                                key={cat.id}
                                onClick={() => handleFilter(cat.slug)}
                                variant={filters.category === cat.slug ? 'blue' : 'white'}
                                className="text-xs uppercase"
                            >
                                {cat.name}
                            </NeoButton>
                        ))}
                        <div className="ml-auto">
                            <NeoInput
                                name="search"
                                defaultValue={filters.search}
                                onChange={handleSearch}
                                placeholder="Cari alat atau bahan..."
                                className="text-sm py-1 w-64 bg-white"
                            />
                        </div>
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {items.data.map((item) => (
                            <NeoCard key={item.id} className="group relative flex flex-col">
                                <div className="aspect-video bg-gray-100 border-b-4 border-black mb-4 overflow-hidden relative">
                                    {item.image ? (
                                        <img src={`/storage/${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl grayscale opacity-20">
                                            🛠️
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-black leading-tight">{item.name}</h3>
                                        <div className="flex flex-col items-end gap-1">
                                            <StatusBadge status={item.status} />
                                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black ${item.stock > 0 ? 'bg-neo-yellow' : 'bg-gray-200'}`}>
                                                Stok: {item.stock}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs font-bold text-gray-600 line-clamp-2">{item.description}</p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {item.categories && item.categories.map(cat => (
                                            <span key={cat.id} className="text-[9px] font-bold uppercase bg-gray-100 border border-black px-1">
                                                {cat.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <NeoButton
                                    onClick={() => addToCart(item)}
                                    disabled={item.stock <= 0 || item.status !== 'available'}
                                    variant={item.stock > 0 && item.status === 'available' ? 'blue' : 'black'}
                                    className="w-full mt-6 text-xs uppercase disabled:opacity-50 text-white"
                                >
                                    {item.stock > 0 && item.status === 'available' ? 'Tambah ke Keranjang' : 'Stok Kosong'}
                                </NeoButton>
                            </NeoCard>
                        ))}
                    </div>
                    <NeoPagination links={items.links} />
                </div>

                {/* Borrowing Cart Modal */}
                {isCartOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                        <NeoCard className="w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
                            <button onClick={() => setIsCartOpen(false)} className="absolute top-4 right-4 text-2xl font-black">✕</button>

                            <div className="bg-neo-blue text-white -m-4 p-6 mb-6">
                                <h2 className="text-2xl font-black uppercase tracking-tighter">Keranjang Pinjam</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-black uppercase text-xs border-b-2 border-black pb-1 mb-4">Daftar Barang</h3>
                                    {cart.length === 0 ? (
                                        <p className="text-sm font-bold text-gray-500 text-center py-8">Keranjang kosong.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {cart.map(item => (
                                                <div key={item.id} className="flex justify-between items-center p-3 border-2 border-black bg-gray-50">
                                                    <div>
                                                        <p className="font-black text-sm">{item.name}</p>
                                                        <p className="text-[10px] font-bold text-gray-500">
                                                            {item.categories ? item.categories.map(c => c.name).join(', ') : 'Tanpa Kategori'} / {item.serial_number}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex border-2 border-black bg-white">
                                                            <button type="button" onClick={() => updateQuantity(item.id, -1)} className="px-2 border-r-2 border-black hover:bg-gray-200 transition-colors">-</button>
                                                            <span className="px-4 py-1 font-black">{item.quantity}</span>
                                                            <button type="button" onClick={() => updateQuantity(item.id, 1)} className="px-2 border-l-2 border-black hover:bg-gray-200 transition-colors disabled:opacity-50" disabled={item.quantity >= item.stock}>+</button>
                                                        </div>
                                                        <button type="button" onClick={() => removeFromCart(item.id)} className="text-neo-red font-black text-xl hover:scale-110 transition-transform">✕</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <form onSubmit={submitLoan} className="space-y-4">
                                    <h3 className="font-black uppercase text-xs border-b-2 border-black pb-1 mb-2">Informasi Peminjam</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase">Nama Lengkap</label>
                                            <NeoInput
                                                placeholder="Contoh: Freyanala"
                                                value={data.borrower_name}
                                                onChange={e => setData('borrower_name', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase">Kelas</label>
                                            <NeoInput
                                                placeholder="Contoh: XII TKJ 1"
                                                value={data.class}
                                                onChange={e => setData('class', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase">Ruang Pembelajaran</label>
                                            <NeoInput
                                                placeholder="Contoh: Lab Fiber Optik"
                                                value={data.room}
                                                onChange={e => setData('room', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase">Guru Pengajar</label>
                                            <NeoInput
                                                placeholder="Nama Guru Pengajar"
                                                value={data.teacher_name}
                                                onChange={e => setData('teacher_name', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <NeoButton type="button" variant="white" onClick={() => setIsCartOpen(false)} className="flex-1 uppercase text-xs">Batal</NeoButton>
                                        <NeoButton type="submit" variant="blue" disabled={processing || cart.length === 0} className="flex-1 uppercase text-xs">Proses Peminjaman</NeoButton>
                                    </div>
                                </form>
                            </div>
                        </NeoCard>
                    </div>
                )}

                {/* Floating Buttons Container */}
                <div className="fixed bottom-8 right-8 z-40 flex flex-col items-center gap-4">
                    {/* Scroll to top */}
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="w-12 h-12 bg-white text-black rounded-full border-4 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center text-xl group transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
                        title="Kembali ke atas"
                    >
                        ⬆️
                    </button>

                    {/* Cart Floating Button */}
                    {cart.length > 0 && !isCartOpen && (
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="w-16 h-16 bg-neo-blue text-white rounded-none border-4 border-black shadow-[6px_6px_0px_#000] flex items-center justify-center text-3xl group transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] relative"
                        >
                            🛒
                            <span className="absolute -top-2 -right-2 bg-neo-yellow text-black text-xs font-black w-7 h-7 flex items-center justify-center border-2 border-black rounded-none">
                                {cart.length}
                            </span>
                        </button>
                    )}
                </div>
            </main>
            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                    <NeoCard className="w-full max-w-sm text-center">
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-2xl font-black uppercase mb-2">Peminjaman Berhasil!</h2>
                        <p className="font-bold text-gray-600 mb-6 text-sm">Harap tunjukkan kode berikut ke Admin / Teknisi untuk pengambilan alat.</p>

                        <div className="bg-neo-yellow border-4 border-black p-4 mb-6">
                            <p className="text-xs font-black uppercase mb-1">Kode Transaksi</p>
                            <p className="text-3xl font-black">{flash.loan_code}</p>
                        </div>

                        <NeoButton onClick={() => setShowSuccessModal(false)} variant="blue" className="w-full uppercase">Tutup</NeoButton>
                    </NeoCard>
                </div>
            )}

            {/* Error Modal */}
            {errorModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <NeoCard className="w-full max-w-md relative animate-in zoom-in-95 duration-200">
                        <div className="bg-neo-red text-white -m-4 p-6 mb-6 border-b-4 border-black flex items-center gap-4">
                            <span className="text-4xl">⚠️</span>
                            <h2 className="text-xl font-black uppercase tracking-tighter">Terjadi Kesalahan</h2>
                        </div>
                        <p className="font-bold text-gray-700 mb-8 leading-relaxed">
                            {errorModal}
                        </p>
                        <NeoButton
                            onClick={() => setErrorModal(null)}
                            variant="black"
                            className="w-full uppercase text-sm"
                        >
                            Tutup
                        </NeoButton>
                    </NeoCard>
                </div>
            )}

            {toast && (
                <NeoToast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <NeoLoader isOpen={loading} />

            <footer className="mt-auto border-t-4 border-black p-6 bg-white flex justify-center items-center text-sm font-bold">
                <p className="uppercase">© {new Date().getFullYear()} TKJ_ADMIN_UNIT. ALL RIGHTS RESERVED.</p>
            </footer>
        </div>
    );
}
