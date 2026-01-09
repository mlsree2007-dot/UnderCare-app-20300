import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'danger' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        // We map variants to our global CSS classes
        const variantClass = variant === 'ghost' ? 'btn-ghost' : `btn-${variant}`;

        return (
            <button
                ref={ref}
                className={cn(
                    'btn',
                    variantClass,
                    size === 'lg' && 'text-lg px-6 py-3',
                    size === 'xl' && 'text-xl px-8 py-4 font-bold',
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';
