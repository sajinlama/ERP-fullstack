import React from "react";
import type { SupplierStatus } from "../../types";

export interface BadgeProps {
  status: SupplierStatus;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = "" }) => {
  const configs: Record<SupplierStatus, { text: string; classes: string; dot: string }> = {
    APPROVED: {
      text: "Approved",
      classes: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      dot: "bg-emerald-500",
    },
    REJECTED: {
      text: "Rejected",
      classes: "bg-rose-50 text-rose-700 border-rose-200/80",
      dot: "bg-rose-500",
    },
    PENDING_APPROVAL: {
      text: "Pending Review",
      classes: "bg-amber-50 text-amber-800 border-amber-200/80",
      dot: "bg-amber-500 animate-pulse",
    },
    DRAFT: {
      text: "Draft",
      classes: "bg-slate-100 text-slate-700 border-slate-200",
      dot: "bg-slate-400",
    },
  };

  const config = configs[status] || configs.DRAFT;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.classes} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      {config.text}
    </span>
  );
};