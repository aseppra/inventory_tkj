import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { NeoCard, StatusBadge } from '@/Components/Neo';

export default function MyLoans({ loans }) {
    return (
        <AuthenticatedLayout>
            <Head title="Peminjaman Saya" />

            <div className="space-y-8">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Peminjaman Saya</h2>
                    <p className="font-bold text-gray-500 uppercase text-xs">Riwayat dan status peminjaman alat Anda.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <NeoCard className="bg-white">
                        <p className="text-[10px] font-black text-gray-400 uppercase">Total Pinjam</p>
                        <h2 className="text-4xl font-black">{loans.length}</h2>
                    </NeoCard>
                    <NeoCard className="bg-neo-blue text-white">
                        <p className="text-[10px] font-black uppercase opacity-60">Sedang Dipakai</p>
                        <h2 className="text-4xl font-black">{loans.filter(l => l.status === 'active').length}</h2>
                    </NeoCard>
                </div>

                <NeoCard>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-4 border-black font-black uppercase text-xs">
                                    <th className="py-4 px-2">Barang</th>
                                    <th className="py-4 px-2">Tanggal Pinjam</th>
                                    <th className="py-4 px-2">Guru/Ruangan</th>
                                    <th className="py-4 px-2">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-black">
                                {loans.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="py-12 text-center font-bold text-gray-400 italic">Belum ada riwayat peminjaman.</td>
                                    </tr>
                                ) : (
                                    loans.map((loan) => (
                                        <tr key={loan.id} className="font-bold hover:bg-gray-50">
                                            <td className="py-4 px-2">
                                                <div className="flex flex-wrap gap-1">
                                                    {loan.items.map(item => (
                                                        <span key={item.id} className="border-2 border-black px-2 py-0.5 text-[10px] uppercase bg-white">
                                                            {item.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-4 px-2 text-sm">
                                                {new Date(loan.loan_date).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="py-4 px-2">
                                                <p className="text-sm leading-none">{loan.teacher_name}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase">{loan.room}</p>
                                            </td>
                                            <td className="py-4 px-2">
                                                <StatusBadge status={loan.status} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </NeoCard>
            </div>
        </AuthenticatedLayout>
    );
}
