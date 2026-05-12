import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { NeoButton, NeoInput, NeoCard } from '@/Components/Neo';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <NeoCard className={className}>
            <header>
                <h2 className="text-xl font-black uppercase border-b-4 border-black pb-2">
                    Informasi Profil
                </h2>
                <p className="mt-2 text-sm font-bold text-gray-600">
                    Perbarui informasi profil dan alamat email akun Anda.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase">Nama Lengkap</label>
                    <NeoInput
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        className="w-full"
                    />
                    {errors.name && <p className="text-sm text-red-600 font-bold">{errors.name}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase">Email</label>
                    <NeoInput
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        className="w-full"
                    />
                    {errors.email && <p className="text-sm text-red-600 font-bold">{errors.email}</p>}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="bg-neo-yellow border-4 border-black p-4 mt-4">
                        <p className="text-sm font-bold text-black">
                            Alamat email Anda belum diverifikasi.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-2 underline font-black hover:text-neo-blue"
                            >
                                Klik di sini untuk mengirim ulang email verifikasi.
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-black text-green-600">
                                Link verifikasi baru telah dikirim ke alamat email Anda.
                            </div>
                        )}
                    </div>
                )}

                <div className="pt-4 flex items-center gap-4">
                    <NeoButton type="submit" disabled={processing} variant="blue" className="uppercase">
                        Simpan Perubahan
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
