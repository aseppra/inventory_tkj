import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { NeoButton, NeoCard, NeoConfirmModal } from '@/Components/Neo';
import AddUserForm from './Partials/AddUserForm';
import EditUserForm from './Partials/EditUserForm';

export default function Edit({ users }) {
    const { auth, flash } = usePage().props;
    const currentUser = auth.user;
    const isAdmin = currentUser.role === 'admin';
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // Confirmation Modal State
    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        variant: 'red'
    });

    const closeConfirm = () => setConfirmState(prev => ({ ...prev, isOpen: false }));

    const handleDelete = (id) => {
        setConfirmState({
            isOpen: true,
            title: 'Hapus Akun',
            message: 'Yakin ingin menghapus akun ini? Tindakan ini tidak dapat dibatalkan.',
            variant: 'red',
            onConfirm: () => {
                router.delete(route('admin.users.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => closeConfirm()
                });
            }
        });
    };

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Manajemen Akun" />

                <div className="flex justify-between items-center mb-8 bg-neo-blue text-white p-8 border-4 border-black shadow-[8px_8px_0px_#000]">
                    <div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter">Manajemen Akun</h2>
                        <p className="mt-2 font-bold opacity-90 text-lg">
                            Kelola akun pengguna, hapus, dan tambahkan admin/operator baru.
                        </p>
                    </div>
                    {isAdmin && (
                        <NeoButton 
                            variant="white" 
                            onClick={() => setShowAddModal(true)}
                            className="text-lg px-6 py-3"
                        >
                            + Tambah Pengguna
                        </NeoButton>
                    )}
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users && users.map(user => (
                        <NeoCard key={user.id} className="flex flex-col">
                            <div className="flex justify-between items-start mb-4 border-b-2 border-black pb-2">
                                <div>
                                    <h3 className="font-black text-xl line-clamp-1">{user.name}</h3>
                                    <p className="text-xs font-bold text-gray-500">{user.email}</p>
                                </div>
                                <span className={`px-2 py-1 text-[10px] font-black uppercase border-2 border-black ${
                                    user.role === 'admin' 
                                        ? 'bg-neo-yellow text-black' 
                                        : 'bg-neo-blue text-white'
                                }`}>
                                    {user.role === 'admin' ? 'Admin' : 'Operator'}
                                </span>
                            </div>
                            
                            <div className="flex-1 space-y-2 text-sm font-bold text-gray-700 mb-6">
                                <p>Bergabung: {new Date(user.created_at).toLocaleDateString('id-ID')}</p>
                            </div>

                            {isAdmin && (
                                <div className="flex gap-2 mt-auto">
                                    <NeoButton 
                                        variant="white" 
                                        className="flex-1 text-xs uppercase py-2"
                                        onClick={() => setEditingUser(user)}
                                    >
                                        Edit
                                    </NeoButton>
                                    
                                    {user.id !== 1 && user.id !== currentUser.id ? (
                                        <NeoButton 
                                            variant="black" 
                                            className="flex-1 text-xs uppercase text-neo-yellow py-2"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            Hapus
                                        </NeoButton>
                                    ) : (
                                        <div className="flex-1 text-center py-2 bg-gray-200 border-2 border-black font-black text-[10px] uppercase text-gray-500 cursor-not-allowed">
                                            Akun Utama
                                        </div>
                                    )}
                                </div>
                            )}
                        </NeoCard>
                    ))}
                </div>
            </AuthenticatedLayout>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="relative w-full max-w-md">
                        <button 
                            onClick={() => setShowAddModal(false)} 
                            className="absolute -top-4 -right-4 z-10 bg-neo-red text-white w-10 h-10 border-4 border-black font-black text-xl flex items-center justify-center hover:scale-110 transition-transform shadow-[4px_4px_0px_#000]"
                        >
                            ✕
                        </button>
                        <AddUserForm onSuccessCallback={() => setShowAddModal(false)} />
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="relative w-full max-w-md">
                        <button 
                            onClick={() => setEditingUser(null)} 
                            className="absolute -top-4 -right-4 z-10 bg-neo-red text-white w-10 h-10 border-4 border-black font-black text-xl flex items-center justify-center hover:scale-110 transition-transform shadow-[4px_4px_0px_#000]"
                        >
                            ✕
                        </button>
                        <EditUserForm user={editingUser} onSuccessCallback={() => setEditingUser(null)} />
                    </div>
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
