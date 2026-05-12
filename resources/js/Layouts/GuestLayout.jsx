import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import { NeoLoader } from '@/Components/Neo';

export default function GuestLayout({ children }) {
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

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#f0f0f0] selection:bg-neo-blue selection:text-white p-4">
            <div className="mb-8">
                <Link href="/">
                    <div className="p-4 border-4 border-black bg-neo-yellow shadow-[6px_6px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                        <h1 className="text-3xl font-black uppercase tracking-tighter">TKJ PINJAM ALAT</h1>
                    </div>
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-8 py-10 bg-white border-4 border-black shadow-[12px_12px_0px_#000] overflow-hidden relative">
                {children}
            </div>

            <div className="mt-12 text-sm font-bold uppercase text-gray-500">
                © {new Date().getFullYear()} TKJ_ADMIN_UNIT. ALL RIGHTS RESERVED.
            </div>

            <NeoLoader isOpen={loading} />
        </div>
    );
}
