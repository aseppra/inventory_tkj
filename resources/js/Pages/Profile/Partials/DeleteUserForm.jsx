import { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { NeoButton, NeoInput, NeoCard } from '@/Components/Neo';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        reset();
    };

    return (
        <NeoCard className={className}>
            <header>
                <h2 className="text-xl font-black uppercase text-red-600 border-b-4 border-black pb-2">
                    Hapus Akun
                </h2>
                <p className="mt-2 text-sm font-bold text-gray-600">
                    Setelah akun Anda dihapus, semua sumber daya dan data di dalamnya akan dihapus secara permanen.
                </p>
            </header>

            <div className="mt-6">
                <NeoButton onClick={confirmUserDeletion} variant="black" className="uppercase text-red-400">
                    Hapus Akun Permanen
                </NeoButton>
            </div>

            {confirmingUserDeletion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                    <NeoCard className="w-full max-w-xl">
                        <form onSubmit={deleteUser}>
                            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-red-600">
                                Yakin ingin menghapus akun?
                            </h2>
                            <p className="font-bold text-gray-600 mb-6">
                                Silakan masukkan kata sandi Anda untuk mengonfirmasi penghapusan. Semua data akan hilang selamanya.
                            </p>

                            <div className="space-y-1 mb-6">
                                <label className="text-[10px] font-black uppercase">Password</label>
                                <NeoInput
                                    type="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full"
                                    placeholder="Masukkan password Anda"
                                />
                                {errors.password && <p className="text-sm text-red-600 font-bold">{errors.password}</p>}
                            </div>

                            <div className="flex gap-4">
                                <NeoButton type="button" variant="white" onClick={closeModal} className="flex-1 uppercase text-xs">
                                    Batal
                                </NeoButton>
                                <NeoButton type="submit" variant="black" disabled={processing} className="flex-1 uppercase text-xs text-red-400">
                                    Hapus Akun
                                </NeoButton>
                            </div>
                        </form>
                    </NeoCard>
                </div>
            )}
        </NeoCard>
    );
}
