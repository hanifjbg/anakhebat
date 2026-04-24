import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'gradient-purple' | 'gradient-blue' | 'gradient-green' | 'gradient-orange';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95";
    
    const variants: Record<ButtonVariant, string> = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm focus:ring-blue-500",
      secondary: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 focus:ring-slate-500",
      danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
      ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-slate-500",
      outline: "border-2 border-slate-200 dark:border-slate-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 focus:ring-slate-500",
      'gradient-purple': "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-float",
      'gradient-blue': "bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] hover:from-blue-600 hover:to-blue-500 text-white shadow-float",
      'gradient-green': "bg-gradient-to-r from-[#10b981] to-[#34d399] hover:from-emerald-600 hover:to-emerald-500 text-white shadow-float",
      'gradient-orange': "bg-gradient-to-r from-[#fb923c] to-[#ef4444] hover:from-orange-500 hover:to-red-500 text-white shadow-float"
    };

    const sizes: Record<ButtonSize, string> = {
      sm: "px-3 py-1.5 text-sm rounded-lg",
      md: "px-4 py-2 text-base rounded-xl",
      lg: "px-6 py-3 text-lg rounded-2xl",
      xl: "w-full py-4 text-xl rounded-full",
      icon: "w-10 h-10 rounded-full"
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
