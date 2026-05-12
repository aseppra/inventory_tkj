import { Head, Link, useForm } from '@inertiajs/react';
import { NeoCard, NeoInput, NeoButton } from '@/Components/Neo';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-8 text-center border-b-4 border-black pb-4">
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Login</h1>
                <p className="font-bold text-gray-500 text-xs uppercase">Enter your credentials to access the system</p>
            </div>

            {status && (
                <div className="mb-6 p-3 bg-neo-green border-2 border-black font-bold text-sm text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase" htmlFor="email">Email Address</label>
                    <NeoInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full"
                        placeholder="admin@tkj.sch.id"
                    />
                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase" htmlFor="password">Password</label>
                    <NeoInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full"
                        placeholder="••••••••"
                    />
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div className="flex items-center mt-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center justify-center w-5 h-5 border-2 border-black bg-white group-hover:bg-gray-100 transition-colors">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="absolute opacity-0 cursor-pointer w-full h-full z-10"
                            />
                            {data.remember && <span className="text-black font-black text-sm">✓</span>}
                        </div>
                        <span className="text-xs font-bold uppercase">Remember me</span>
                    </label>
                </div>

                <div className="pt-4 border-t-2 border-black">
                    <NeoButton
                        type="submit"
                        variant="blue"
                        className="w-full text-lg uppercase py-3"
                        disabled={processing}
                    >
                        Login
                    </NeoButton>
                </div>

                <div className="mt-4 flex justify-center">
                    <Link
                        href={route('catalog.index')}
                        className="font-black uppercase text-[10px] border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all flex items-center gap-2"
                    >
                        <span>←</span> Kembali ke Katalog
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
