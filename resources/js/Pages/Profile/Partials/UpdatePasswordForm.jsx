import { useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { NeoButton, NeoInput, NeoCard } from '@/Components/Neo';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <NeoCard className={className}>
            <header>
                <h2 className="text-xl font-black uppercase border-b-4 border-black pb-2">
                    Ubah Password
                </h2>
                <p className="mt-2 text-sm font-bold text-gray-600">
                    Pastikan akun Anda menggunakan kata sandi yang panjang dan acak agar tetap aman.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase">Password Saat Ini</label>
                    <NeoInput
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className="w-full"
                    />
                    {errors.current_password && <p className="text-sm text-red-600 font-bold">{errors.current_password}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase">Password Baru</label>
                    <NeoInput
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="w-full"
                    />
                    {errors.password && <p className="text-sm text-red-600 font-bold">{errors.password}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase">Konfirmasi Password Baru</label>
                    <NeoInput
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className="w-full"
                    />
                    {errors.password_confirmation && <p className="text-sm text-red-600 font-bold">{errors.password_confirmation}</p>}
                </div>

                <div className="pt-4 flex items-center gap-4">
                    <NeoButton type="submit" disabled={processing} variant="blue" className="uppercase">
                        Simpan Password
                    </NeoButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-black text-neo-blue">Tersimpan.</p>
                    </Transition>
                </div>
            </form>
        </NeoCard>
    );
}
