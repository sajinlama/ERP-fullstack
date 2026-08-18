import React from "react";
import type { SupplierStatus } from "../../types";

export interface BadgeProps {
  status: SupplierStatus;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = "" }) => {
  const configs: Record<SupplierStatus, { text: string; container: string; dot: string; ping?: string }> = {
    APPROVED: {
      text: "Approved",
      container: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.12)]",
      dot: "bg-emerald-400",
    },
    REJECTED: {
      text: "Rejected",
      container: "border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.12)]",
      dot: "bg-rose-400",
    },
    PENDING_APPROVAL: {
      text: "Pending Review",
      container: "border-amber-500/30 bg-amber-500/10 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.12)]",
      dot: "bg-amber-400",
      ping: "bg-amber-400",
    },
    DRAFT: {
      text: "Draft",
      container: "border-slate-700/80 bg-slate-800/60 text-slate-400",
      dot: "bg-slate-500",
    },
  };

  const config = configs[status] || configs.DRAFT;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md transition-all select-none ${config.container} ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5 items-center justify-center">
        {config.ping && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${config.ping}`} />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      </span>
      <span>{config.text}</span>
    </span>
  );
};

export default Badge;