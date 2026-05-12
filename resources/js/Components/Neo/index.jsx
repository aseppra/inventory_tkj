import React from 'react';
import { Link } from '@inertiajs/react';

export const NeoCard = ({ children, className = '', ...props }) => {
    return (
        <div className={`neo-card p-4 ${className}`} {...props}>
            {children}
        </div>
    );
};

export const NeoButton = ({ children, className = '', variant = 'blue', ...props }) => {
    const variants = {
        blue: 'bg-neo-blue text-white',
        green: 'bg-neo-green',
        red: 'bg-neo-red',
        yellow: 'bg-neo-yellow',
        white: 'bg-white text-black',
        black: 'bg-black text-white',
    };

    return (
        <button className={`neo-button ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

export const NeoInput = ({ className = '', ...props }) => {
    return (
        <input className={`neo-input ${className}`} {...props} />
    );
};

export const StatusBadge = ({ status }) => {
    const styles = {
        available: 'bg-neo-green',
        in_use: 'bg-neo-blue',
        maintenance: 'bg-neo-orange',
        out_of_stock: 'bg-neo-red',
        pending: 'bg-neo-yellow',
        active: 'bg-neo-blue',
        returned: 'bg-neo-green',
        overdue: 'bg-neo-red',
        cancelled: 'bg-neo-red text-white',
    };

    const labels = {
        available: 'AVAILABLE',
        in_use: 'IN USE',
        maintenance: 'MAINTENANCE',
        out_of_stock: 'OUT OF STOCK',
        pending: 'PENDING',
        active: 'ACTIVE',
        returned: 'RETURNED',
        overdue: 'OVERDUE',
        cancelled: 'CANCELLED',
    };

    return (
        <span className={`neo-badge ${styles[status] || 'bg-gray-200'}`}>
            {labels[status] || (status ? status.toUpperCase() : 'UNKNOWN')}
        </span>
    );
};
export const NeoToast = ({ message, type = 'success', onClose }) => {
    const styles = {
        success: 'bg-neo-green',
        error: 'bg-neo-red text-white',
        warning: 'bg-neo-yellow',
        info: 'bg-neo-blue text-white',
    };

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed bottom-8 right-8 z-[9999] p-4 border-4 border-black shadow-[8px_8px_0px_#000] flex items-center gap-4 animate-in slide-in-from-right duration-300 ${styles[type]}`}>
            <span className="font-black uppercase text-sm">{message}</span>
            <button onClick={onClose} className="font-black hover:scale-125 transition-transform">✕</button>
        </div>
    );
};

export const NeoAlert = ({ children, type = 'warning', className = '' }) => {
    const styles = {
        success: 'bg-neo-green',
        error: 'bg-neo-red text-white',
        warning: 'bg-neo-yellow',
        info: 'bg-neo-blue text-white',
    };

    return (
        <div className={`p-4 border-4 border-black shadow-[4px_4px_0px_#000] font-bold text-sm ${styles[type]} ${className}`}>
            {children}
        </div>
    );
};
export const NeoConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Ya, Lanjutkan', cancelText = 'Batal', variant = 'red' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <NeoCard className="bg-white w-full max-w-md border-4 border-black shadow-[12px_12px_0px_#000] p-6 animate-in zoom-in-95 duration-200">
                <div className="border-b-4 border-black pb-2 mb-4">
                    <h3 className="text-xl font-black uppercase tracking-tight">{title || 'Konfirmasi'}</h3>
                </div>
                <p className="font-bold text-gray-700 mb-8 leading-relaxed">
                    {message}
                </p>
                <div className="flex gap-4">
                    <NeoButton 
                        variant="white" 
                        className="flex-1 uppercase text-sm border-2 border-black" 
                        onClick={onCancel}
                    >
                        {cancelText}
                    </NeoButton>
                    <NeoButton 
                        variant={variant} 
                        className="flex-1 uppercase text-sm border-2 border-black" 
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </NeoButton>
                </div>
            </NeoCard>
        </div>
    );
};
export const NeoLoader = ({ isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative">
                <div className="w-24 h-24 border-8 border-black border-t-neo-blue rounded-none animate-spin shadow-[8px_8px_0px_#000]"></div>
                <div className="absolute inset-0 flex items-center justify-center text-3xl animate-bounce">
                    🛠️
                </div>
            </div>
            <p className="mt-8 font-black uppercase tracking-widest text-xl animate-pulse">
                Sedang Diproses...
            </p>
        </div>
    );
};
export const NeoPagination = ({ links }) => {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap justify-center gap-2 mt-8">
            {links.map((link, key) => (
                <div key={key}>
                    {link.url === null ? (
                        <div
                            className="px-3 py-1.5 text-[11px] font-black text-gray-400 bg-white border-2 border-black uppercase cursor-not-allowed opacity-50"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <Link
                            href={link.url}
                            className={`px-3 py-1.5 text-[11px] font-black uppercase border-2 border-black transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-none ${
                                link.active ? 'bg-neo-blue text-white shadow-[2px_2px_0px_#000]' : 'bg-white text-black'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};
