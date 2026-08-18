import React from "react";

export interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
  variant?: "default" | "amber" | "emerald" | "rose";
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  variant = "default",
}) => {
  const variantStyles = {
    default: "border-slate-200/80 bg-white text-slate-900",
    amber: "border-amber-200/60 bg-amber-50/40 text-amber-900",
    emerald: "border-emerald-200/60 bg-emerald-50/40 text-emerald-900",
    rose: "border-rose-200/60 bg-rose-50/40 text-rose-900",
  };

  return (
    <div className={`rounded-xl border p-5 shadow-xs transition-shadow hover:shadow-md ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
        <div className="p-2 rounded-lg bg-white/80 border border-slate-200/60 text-slate-700 shadow-2xs">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        {trend && <span className="text-xs font-medium text-slate-500">{trend}</span>}
      </div>
    </div>
  );
};