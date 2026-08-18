import React from "react";

export interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
  variant?: "default" | "amber" | "emerald" | "rose";
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  variant = "default",
  className = "",
}) => {
  const variantStyles = {
    default: {
      card: "border-slate-800/80 bg-gradient-to-b from-slate-800/40 via-slate-900/60 to-slate-950/80 shadow-[0_0_20px_-8px_rgba(15,23,42,0.6)] hover:border-slate-700",
      title: "text-slate-400",
      iconBox: "border-slate-700/80 bg-slate-800/80 text-slate-300",
      value: "text-white",
      trend: "text-slate-400",
    },
    amber: {
      card: "border-amber-500/20 bg-gradient-to-b from-amber-500/10 via-slate-900/60 to-slate-950/80 shadow-[0_0_25px_-8px_rgba(245,158,11,0.15)] hover:border-amber-500/40",
      title: "text-amber-400",
      iconBox: "border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-inner",
      value: "text-white",
      trend: "text-amber-400/80",
    },
    emerald: {
      card: "border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 via-slate-900/60 to-slate-950/80 shadow-[0_0_25px_-8px_rgba(16,185,129,0.15)] hover:border-emerald-500/40",
      title: "text-emerald-400",
      iconBox: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-inner",
      value: "text-white",
      trend: "text-emerald-400/80",
    },
    rose: {
      card: "border-rose-500/20 bg-gradient-to-b from-rose-500/10 via-slate-900/60 to-slate-950/80 shadow-[0_0_25px_-8px_rgba(244,63,94,0.15)] hover:border-rose-500/40",
      title: "text-rose-400",
      iconBox: "border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-inner",
      value: "text-white",
      trend: "text-rose-400/80",
    },
  };

  const current = variantStyles[variant] || variantStyles.default;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 ${current.card} ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-bold uppercase tracking-wider ${current.title}`}>
          {title}
        </span>
        <div className={`rounded-xl border p-2 text-xs transition-transform duration-200 group-hover:scale-105 ${current.iconBox}`}>
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <p className={`text-3xl font-extrabold tracking-tight ${current.value}`}>
          {value}
        </p>
        {trend && (
          <span className={`text-xs font-medium ${current.trend}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatsCard;