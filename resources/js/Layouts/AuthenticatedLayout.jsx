import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { NeoButton, NeoToast, NeoLoader } from '@/Components/Neo';

const Icons = {
    Dashboard: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>,
    Catalog: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>,
    Inventory: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>,
    Loans: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
    Settings: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>,
    Logout: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>,
    User: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
};

export default function AuthenticatedLayout({ children }) {
    const { auth, flash, errors } = usePage().props;
    const user = auth.user;
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const startListener = router.on('start', () => setLoading(true));
        const finishListener = router.on('finish', () => setLoading(false));
        const errorListener = router.on('error', () => setLoading(false));

        return () => {
            startListener();
            finishListener();
            errorListener();
        };
    }, []);

    useEffect(() => {
        if (flash.success) {
            setToast({ message: flash.success, type: 'success' });
        } else if (flash.error) {
            setToast({ message: flash.error, type: 'error' });
        } else if (Object.keys(errors).length > 0) {
            setToast({ message: 'Mohon periksa kembali inputan Anda.', type: 'error' });
        }
    }, [flash, errors]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        const saved = localStorage.getItem('sidebarOpen');
        return saved !== null ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen));
    }, [isSidebarOpen]);

    const isAdmin = user.role === 'admin';
    const isOperator = user.role === 'operator';

    const navItems = isAdmin ? [
        { name: 'Dashboard', routeName: 'dashboard', href: route('dashboard'), icon: <Icons.Dashboard /> },
        { name: 'Katalog', routeName: 'catalog.index', href: route('catalog.index'), icon: <Icons.Catalog /> },
        { name: 'Inventory', routeName: 'admin.inventory', href: route('admin.inventory'), icon: <Icons.Inventory /> },
        { name: 'Peminjaman', routeName: 'admin.loans', href: route('admin.loans'), icon: <Icons.Loans /> },
        { name: 'Pengaturan', routeName: 'profile.edit', href: route('profile.edit'), icon: <Icons.Settings /> },
    ] : isOperator ? [
        { name: 'Katalog', routeName: 'catalog.index', href: route('catalog.index'), icon: <Icons.Catalog /> },
        { name: 'Peminjaman Saya', routeName: 'student.loans', href: route('student.loans'), icon: <Icons.Loans /> },
        { name: 'Pengaturan', routeName: 'profile.edit', href: route('profile.edit'), icon: <Icons.Settings /> },
    ] : [
        { name: 'Katalog', routeName: 'catalog.index', href: route('catalog.index'), icon: <Icons.Catalog /> },
        { name: 'Pengaturan', routeName: 'profile.edit', href: route('profile.edit'), icon: <Icons.Settings /> },
    ];

    return (
        <div className="min-h-screen flex bg-white font-sans text-black">
            {/* Sidebar */}
            <aside className={`bg-gray-50 border-r-4 border-black transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="p-6 border-b-4 border-black font-black text-xl tracking-tight flex items-center gap-2 bg-neo-yellow">
                    {isSidebarOpen ? <><span className="text-2xl">🛠️</span> TKJ_PINJAM_ALAT</> : <span className="text-2xl">🛠️</span>}
                </div>

                <div className="p-4 flex-1 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center p-3 font-bold border-2 border-transparent hover:border-black hover:bg-neo-blue hover:text-white transition-all ${route().current(item.routeName) ? 'bg-neo-blue text-white border-black shadow-[4px_4px_0px_#000]' : ''}`}
                        >
                            <span className="text-xl mr-3">{item.icon}</span>
                            {isSidebarOpen && <span>{item.name}</span>}
                        </Link>
                    ))}
                </div>

                <div className="border-t-4 border-black h-20 flex items-center px-4">
                    <Link href={route('logout')} method="post" as="button" className="w-full flex items-center justify-center p-3 font-bold text-red-600 hover:bg-red-50 border-2 border-transparent hover:border-black transition-all">
                        <Icons.Logout />
                        {isSidebarOpen && <span className="ml-3">Logout</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                {/* Header */}
                <header className="bg-white border-b-4 border-black p-4 flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mr-4 text-2xl">
                            {isSidebarOpen ? '◀️' : '▶️'}
                        </button>
                    </div>

                    <div className="flex items-center space-y-0 space-x-4">
                        <div className="text-right hidden sm:block">
                            <p className="font-black leading-none">{user.name}</p>
                            <p className="text-xs font-bold text-gray-500 uppercase">{user.role}</p>
                        </div>
                        <div className="w-12 h-12 bg-neo-yellow border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-xl">
                            <Icons.User />
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>

                {toast && (
                    <NeoToast 
                        message={toast.message} 
                        type={toast.type} 
                        onClose={() => setToast(null)} 
                    />
                )}

                <NeoLoader isOpen={loading} />

                {/* Footer */}
                <footer className="border-t-4 border-black h-20 px-6 bg-gray-50 flex justify-between items-center text-sm font-bold mt-auto">
                    <div>© 2024 TKJ_ADMIN_UNIT. ALL RIGHTS RESERVED.</div>
                    <div className="flex space-x-4">
                        <span className="neo-badge bg-white">MINIMALIST NEO-BRUTALISM V1.0</span>
                    </div>
                </footer>
            </main>
        </div>
    );
}
