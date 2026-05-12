import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { NeoCard, StatusBadge } from '@/Components/Neo';

export default function Dashboard({ stats, recent_loans, critical_items }) {
    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />

            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <NeoCard className="bg-white">
                        <p className="text-xs font-black text-gray-500 uppercase">Total Alat</p>
                        <h2 className="text-5xl font-black mt-2">{stats.total_items}</h2>
                        <p className="text-xs font-bold mt-2 text-neo-blue">UNIT TERDAFTAR</p>
                    </NeoCard>
                    <NeoCard className="bg-neo-blue text-white">
                        <p className="text-xs font-black uppercase opacity-80">Sedang Dipinjam</p>
                        <h2 className="text-5xl font-black mt-2">{stats.active_loans}</h2>
                        <p className="text-xs font-bold mt-2 uppercase">TRANSAKSI AKTIF</p>
                    </NeoCard>
                    <NeoCard className="bg-white">
                        <p className="text-xs font-black text-gray-500 uppercase text-red-600">Stok Menipis</p>
                        <h2 className="text-5xl font-black mt-2">{stats.low_stock}</h2>
                        <p className="text-xs font-bold mt-2 text-red-600 uppercase">PERLU RESTOCK</p>
                    </NeoCard>
                    <NeoCard className="bg-white">
                        <p className="text-xs font-black text-gray-500 uppercase">Siswa Aktif</p>
                        <h2 className="text-5xl font-black mt-2">{stats.total_students}</h2>
                        <p className="text-xs font-bold mt-2 text-neo-blue uppercase">TERVERIFIKASI</p>
                    </NeoCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Loans */}
                    <div className="lg:col-span-2">
                        <NeoCard className="h-full">
                            <h3 className="text-xl font-black uppercase mb-6 border-b-4 border-black pb-2 flex justify-between items-center">
                                Peminjaman Terbaru
                                <span className="text-sm">🔄</span>
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b-2 border-black font-black uppercase text-xs">
                                            <th className="py-2">Siswa</th>
                                            <th className="py-2">Perangkat</th>
                                            <th className="py-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-gray-100">
                                        {recent_loans.map((loan) => (
                                            <tr key={loan.id} className="font-bold">
                                                <td className="py-4">
                                                    <p className="leading-none">{loan.user ? loan.user.name : loan.borrower_name}</p>
                                                    <p className="text-[10px] text-gray-500">{loan.user ? loan.user.nisn : loan.class}</p>
                                                </td>
                                                <td className="py-4">
                                                    {loan.items.map(item => item.name).join(', ')}
                                                </td>
                                                <td className="py-4">
                                                    <StatusBadge status={loan.status} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button className="w-full mt-6 py-2 border-2 border-black font-black uppercase text-xs hover:bg-neo-blue hover:text-white transition-all">
                                Lihat Semua Aktivitas
                            </button>
                        </NeoCard>
                    </div>

                    {/* Critical Stock */}
                    <div>
                        <NeoCard className="h-full">
                            <h3 className="text-xl font-black uppercase mb-6 border-b-4 border-black pb-2">
                                Status Stok Kritis
                            </h3>
                            <div className="space-y-6">
                                {critical_items.map((item) => (
                                    <div key={item.id}>
                                        <div className="flex justify-between font-black uppercase text-xs mb-1">
                                            <span>{item.name}</span>
                                            <span className="text-red-600">{item.stock} UNIT</span>
                                        </div>
                                        <div className="h-4 bg-gray-100 border-2 border-black">
                                            <div 
                                                className={`h-full border-r-2 border-black ${item.stock <= 2 ? 'bg-neo-red' : 'bg-neo-blue'}`}
                                                style={{ width: `${(item.stock / 15) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 p-4 bg-neo-yellow border-2 border-black border-dashed">
                                <p className="text-xs font-bold text-center italic italic">
                                    "Segera buat pesanan pengadaan untuk item dengan indikator merah."
                                </p>
                            </div>
                        </NeoCard>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
