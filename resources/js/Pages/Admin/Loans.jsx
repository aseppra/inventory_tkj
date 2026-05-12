import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { NeoCard, NeoButton, StatusBadge, NeoConfirmModal, NeoPagination } from '@/Components/Neo';

export default function Loans({ loans, totalAvailable, filters }) {
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        variant: 'blue'
    });

    const closeConfirm = () => setConfirmState(prev => ({ ...prev, isOpen: false }));

    const confirmReturn = (loanId) => {
        setConfirmState({
            isOpen: true,
            title: 'Konfirmasi Pengembalian',
            message: 'Konfirmasi pengembalian alat ini? Stok alat akan otomatis ditambahkan kembali.',
            variant: 'green',
            onConfirm: () => {
                router.post(route('admin.loans.return', loanId), {}, {
                    onSuccess: () => closeConfirm()
                });
            }
        });
    };

    const confirmApprove = (loanId) => {
        setConfirmState({
            isOpen: true,
            title: 'Setujui Peminjaman',
            message: 'Setujui peminjaman ini? Alat/bahan akan diserahkan dan stok berkurang.',
            variant: 'blue',
            onConfirm: () => {
                router.post(route('admin.loans.approve', loanId), {}, {
                    onSuccess: () => closeConfirm()
                });
            }
        });
    };

    const confirmReject = (loanId) => {
        setConfirmState({
            isOpen: true,
            title: 'Tolak Peminjaman',
            message: 'Tolak/Batalkan permintaan peminjaman ini?',
            variant: 'red',
            onConfirm: () => {
                router.post(route('admin.loans.reject', loanId), {}, {
                    onSuccess: () => closeConfirm()
                });
            }
        });
    };

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Monitoring Peminjaman" />

                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <NeoCard className="bg-white">
                            <p className="text-xs font-black text-gray-500 uppercase">Total Peminjaman</p>
                            <h2 className="text-4xl font-black mt-2">{loans.total}</h2>
                        </NeoCard>
                        <NeoCard className="bg-neo-blue text-white">
                            <p className="text-xs font-black uppercase opacity-80">Berlangsung</p>
                            <h2 className="text-4xl font-black mt-2">{loans.data.filter(l => l.status === 'active' || l.status === 'pending').length}</h2>
                        </NeoCard>
                        <NeoCard className="bg-neo-yellow text-black">
                            <p className="text-xs font-black uppercase opacity-80">Terlambat</p>
                            <h2 className="text-4xl font-black mt-2">{loans.data.filter(l => l.status === 'overdue').length}</h2>
                        </NeoCard>
                        <NeoCard className="bg-neo-green text-black">
                            <p className="text-xs font-black uppercase">Tersedia</p>
                            <h2 className="text-4xl font-black mt-2">{totalAvailable || 0}</h2>
                        </NeoCard>
                    </div>

                    <NeoCard>
                        <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
                            <h3 className="text-xl font-black uppercase">Monitoring Peminjaman</h3>
                                <div className="flex items-center gap-4">
                                    <a
                                        href="/admin/export/loans"
                                        target="_blank"
                                        className="neo-button bg-neo-blue text-white text-xs uppercase"
                                    >
                                        Ekspor Data (PDF)
                                    </a>
                                </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b-4 border-black font-black uppercase text-xs">
                                        <th className="py-4 px-2">No. Tiket</th>
                                        <th className="py-4 px-2">Nama Peminjam</th>
                                        <th className="py-4 px-2">Nama Barang</th>
                                        <th className="py-4 px-2">Tgl Pinjam</th>
                                        <th className="py-4 px-2">Status</th>
                                        <th className="py-4 px-2 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-black">
                                    {loans.data.map((loan) => (
                                        <tr key={loan.id} className="font-bold hover:bg-gray-50">
                                            <td className="py-4 px-2 text-sm text-neo-blue">
                                                TRX-{String(loan.id).padStart(5, '0')}
                                            </td>
                                            <td className="py-4 px-2">
                                                <p className="leading-none">{loan.user ? loan.user.name : loan.borrower_name}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase">{loan.user ? loan.user.nisn : loan.class}</p>
                                            </td>
                                            <td className="py-4 px-2 text-sm">
                                                {loan.items && Array.isArray(loan.items) ? loan.items.map(item => `${item.name} (${item.pivot.quantity})`).join(', ') : '-'}
                                            </td>
                                            <td className="py-4 px-2 text-sm">
                                                {loan.loan_date ? new Date(loan.loan_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                            </td>
                                            <td className="py-4 px-2">
                                                <StatusBadge status={loan.status || 'unknown'} />
                                            </td>
                                            <td className="py-4 px-2 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <NeoButton
                                                        onClick={() => setSelectedLoan(loan)}
                                                        variant="white"
                                                        className="text-[10px] uppercase py-1 border-2 hover:bg-neo-yellow"
                                                    >
                                                        Detail
                                                    </NeoButton>
                                                    {loan.status === 'pending' && (
                                                        <>
                                                            <NeoButton
                                                                onClick={() => confirmReject(loan.id)}
                                                                variant="white"
                                                                className="text-[10px] uppercase py-1 border-2 hover:bg-neo-red hover:text-white"
                                                            >
                                                                Batal
                                                            </NeoButton>
                                                            <NeoButton
                                                                onClick={() => confirmApprove(loan.id)}
                                                                variant="blue"
                                                                className="text-[10px] uppercase py-1"
                                                            >
                                                                Setujui
                                                            </NeoButton>
                                                        </>
                                                    )}
                                                    {loan.status === 'active' && (
                                                        <NeoButton
                                                            onClick={() => confirmReturn(loan.id)}
                                                            variant="green"
                                                            className="text-[10px] uppercase py-1"
                                                        >
                                                            Telah Kembali
                                                        </NeoButton>
                                                    )}
                                                    {(loan.status === 'returned' || loan.status === 'cancelled') && (
                                                        <span className="text-gray-400 text-[10px] font-black uppercase italic">Selesai</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <NeoPagination links={loans.links} />
                    </NeoCard>
                </div>
            </AuthenticatedLayout>

            <NeoConfirmModal
                isOpen={confirmState.isOpen}
                title={confirmState.title}
                message={confirmState.message}
                variant={confirmState.variant}
                onConfirm={confirmState.onConfirm}
                onCancel={closeConfirm}
            />

            {/* Detail Modal */}
            {selectedLoan && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <NeoCard className="w-full max-w-lg relative animate-in zoom-in-95 duration-200">
                        <button onClick={() => setSelectedLoan(null)} className="absolute top-4 right-4 text-2xl font-black hover:text-neo-red transition-colors">✕</button>
                        
                        <div className="bg-neo-blue text-white -m-4 p-6 mb-6 border-b-4 border-black">
                            <h2 className="text-xl font-black uppercase tracking-tighter">Detail Peminjaman</h2>
                            <p className="text-xs font-bold opacity-80 mt-1">TRX-{String(selectedLoan.id).padStart(5, '0')}</p>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-gray-500">Peminjam</p>
                                    <p className="font-bold">{selectedLoan.borrower_name}</p>
                                    <p className="text-xs font-bold text-gray-500">{selectedLoan.class}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-gray-500">Status</p>
                                    <StatusBadge status={selectedLoan.status} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-gray-500">Guru Pengajar</p>
                                    <p className="font-bold">{selectedLoan.teacher_name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-gray-500">Ruangan</p>
                                    <p className="font-bold">{selectedLoan.room}</p>
                                </div>
                            </div>

                            <div className="border-t-2 border-black pt-4">
                                <h4 className="text-xs font-black uppercase mb-3">Daftar Barang Dipinjam</h4>
                                <div className="space-y-2">
                                    {selectedLoan.items && selectedLoan.items.map(item => (
                                        <div key={item.id} className="flex justify-between items-center p-3 border-2 border-black bg-gray-50">
                                            <span className="font-bold text-sm">{item.name}</span>
                                            <span className="bg-neo-yellow border-2 border-black px-2 py-0.5 text-xs font-black">
                                                {item.pivot.quantity} unit
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t-2 border-black flex justify-between items-center">
                                <p className="text-[10px] font-bold text-gray-500 italic">
                                    Diajukan pada: {new Date(selectedLoan.created_at).toLocaleString('id-ID')}
                                </p>
                                <NeoButton onClick={() => setSelectedLoan(null)} variant="black" className="uppercase text-xs">Tutup</NeoButton>
                            </div>
                        </div>
                    </NeoCard>
                </div>
            )}
        </>
    );
}
