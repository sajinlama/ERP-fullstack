import React, { forwardRef } from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 select-none active:scale-[0.97] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100";

    const sizeClasses = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-xs sm:text-sm px-4 py-2.5 gap-2",
      lg: "text-sm sm:text-base px-5 py-3 gap-2.5",
    };

    const variantClasses = {
      primary:
        "bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] border border-indigo-400/30 focus:ring-indigo-500/20",
      secondary:
        "bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:bg-emerald-500 hover:shadow-[0_0_25px_rgba(16,185,129,0.45)] border border-emerald-400/30 focus:ring-emerald-500/20",
      destructive:
        "bg-rose-600/20 text-rose-300 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)] hover:bg-rose-600 hover:text-white hover:shadow-[0_0_25px_rgba(244,63,94,0.4)] focus:ring-rose-500/20",
      outline:
        "bg-slate-950/60 text-slate-200 border border-slate-700/80 shadow-inner hover:bg-slate-800/80 hover:border-slate-600 hover:text-white focus:ring-slate-700/30",
      ghost:
        "bg-transparent text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent focus:ring-slate-700/30",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;