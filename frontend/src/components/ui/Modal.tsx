import React, { useEffect, useId } from "react";
import { createPortal } from "react-dom";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "md",
}) => {
  const titleId = useId();
  const descId = useId();

  // Handle ESC key press and scroll locking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
    >
      {/* Dark Ambient Backdrop with Blur */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Radial Ambient Glow Behind Card */}
      <div className="absolute w-72 h-72 bg-indigo-600/15 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Glassmorphic Modal Card */}
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} rounded-2xl border border-slate-800/90 bg-slate-900/90 p-6 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-10 transition-all animate-in zoom-in-95 duration-200 text-slate-100`}
      >
        {/* Header Section */}
        <div className="flex items-start justify-between border-b border-slate-800/80 pb-4 mb-5">
          <div className="space-y-1">
            <h3 id={titleId} className="text-base sm:text-lg font-bold tracking-tight text-white">
              {title}
            </h3>
            {description && (
              <p id={descId} className="text-xs text-slate-400 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Close Action Button */}
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition-all duration-150"
            aria-label="Close modal dialog"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="relative text-xs sm:text-sm text-slate-300">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;