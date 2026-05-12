import { useForm } from '@inertiajs/react';
import { NeoButton, NeoInput, NeoCard } from '@/Components/Neo';

export default function EditUserForm({ user, className = '', onSuccessCallback }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'operator',
        password: '',
        password_confirmation: '',
    });

    const submit = () => {
        put(route('admin.users.update', user.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                reset('password', 'password_confirmation');
                if (onSuccessCallback) onSuccessCallback();
            },
            onError: (err) => console.error(err),
        });
    };

    return (
        <NeoCard className={className}>
            <header>
                <h2 className="text-xl font-black uppercase border-b-4 border-black pb-2">
                    Edit Akun
                </h2>
                <p className="mt-2 text-sm font-bold text-gray-600">
                    Ubah data nama, email, role, atau reset password akun ini.
                </p>
            </header>

            <div className="mt-6 space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase">Nama Lengkap</label>
                    <NeoInput
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full"
                        placeholder="Nama lengkap"
                    />
                    {errors.name && <p className="text-sm text-red-600 font-bold">{errors.name}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase">Email</label>
                    <NeoInput
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full"
                        placeholder="email@domain.com"
                    />
                    {errors.email && <p className="text-sm text-red-600 font-bold">{errors.email}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase">Peran (Role)</label>
                    <select
                        value={data.role}
                        onChange={(e) => setData('role', e.target.value)}
                        className="w-full border-4 border-black p-2 font-bold shadow-[4px_4px_0px_#000] focus:outline-none focus:ring-0"
                    >
                        <option value="admin">Admin</option>
                        <option value="operator">Operator</option>
                    </select>
                    {errors.role && <p className="text-sm text-red-600 font-bold">{errors.role}</p>}
                </div>

                <div className="pt-2 border-t-2 border-dashed border-gray-300">
                    <p className="text-xs font-bold text-gray-500 mb-2">Kosongkan jika tidak ingin mengubah password.</p>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase">Password Baru</label>
                    <NeoInput
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full"
                        placeholder="Minimal 6 karakter"
                    />
                    {errors.password && <p className="text-sm text-red-600 font-bold">{errors.password}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase">Konfirmasi Password</label>
                    <NeoInput
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className="w-full"
                        placeholder="Ulangi password baru"
                    />
                    {errors.password_confirmation && <p className="text-sm text-red-600 font-bold">{errors.password_confirmation}</p>}
                </div>

                {/* General error display */}
                {errors.general && (
                    <div className="p-3 bg-neo-yellow border-2 border-black font-bold text-sm">
                        {errors.general}
                    </div>
                )}

                <div className="pt-4">
                    <NeoButton
                        type="button"
                        onClick={submit}
                        disabled={processing}
                        variant="blue"
                        className="w-full uppercase"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </NeoButton>
                </div>
            </div>
        </NeoCard>
    );
}
