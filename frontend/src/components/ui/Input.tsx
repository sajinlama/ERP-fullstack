import React, { forwardRef, useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = "", id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5 cursor-pointer select-none transition-colors hover:text-slate-200"
          >
            {label}
          </label>
        )}
        <div className="relative group rounded-xl">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-200">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={`block w-full rounded-xl border bg-slate-950/60 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 shadow-inner backdrop-blur-md transition-all duration-200 focus:bg-slate-950 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-900/40 ${
              leftIcon ? "pl-10" : "pl-3.5"
            } ${rightIcon ? "pr-10" : "pr-3.5"} ${
              error
                ? "border-rose-500/80 text-rose-200 focus:border-rose-500 focus:ring-rose-500/15"
                : "border-slate-700/80 focus:border-indigo-500 focus:ring-indigo-500/15 group-hover:border-slate-600"
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-200">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-rose-400">
            <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span>{error}</span>
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-[11px] text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;