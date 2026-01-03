'use client';

import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<'button'> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'premium';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    pulsing?: boolean;
    children?: ReactNode;
}

export const Button = ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    pulsing = false,
    children,
    disabled,
    ...props
}: ButtonProps) => {
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1',
        secondary: 'bg-slate-700 hover:bg-slate-600 text-white border-b-4 border-slate-900 active:border-b-0 active:translate-y-1',
        danger: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/30 border-b-4 border-red-800 active:border-b-0 active:translate-y-1',
        ghost: 'bg-transparent hover:bg-white/10 text-white border-none',
        premium: 'bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 text-white font-bold shadow-lg shadow-orange-500/40 border-b-4 border-orange-800 active:border-b-0 active:translate-y-1',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-base',
        lg: 'px-8 py-4 text-xl',
    };

    return (
        <motion.button
            className={cn(
                'relative overflow-hidden rounded-xl font-bold transition-all flex items-center justify-center gap-2',
                variants[variant],
                sizes[size],
                isLoading && 'opacity-70 cursor-not-allowed',
                disabled && 'opacity-50 cursor-not-allowed saturate-0',
                className
            )}
            whileTap={{ scale: 0.95 }}
            disabled={disabled || isLoading}
            {...props}
        >
            {pulsing && !disabled && !isLoading && (
                <span className="absolute inset-0 rounded-xl bg-white/30 animate-ping opacity-20" />
            )}

            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                </>
            ) : (
                children
            )}
        </motion.button>
    );
};
