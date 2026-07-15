import React from "react";

interface CyberProgressProps {
  value: number;
  max?: number;
  color?: "primary" | "secondary" | "success" | "warning";
  className?: string;
  showText?: boolean;
  label?: string;
}

export default function CyberProgress({
  value,
  max = 100,
  color = "primary",
  className = "",
  showText = true,
  label,
}: CyberProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colors = {
    primary: "bg-brand-primary shadow-[0_0_8px_#06B6D4]",
    secondary: "bg-brand-secondary shadow-[0_0_8px_#3B82F6]",
    success: "bg-brand-success shadow-[0_0_8px_#22C55E]",
    warning: "bg-brand-warning shadow-[0_0_8px_#F59E0B]",
  };

  const textColors = {
    primary: "text-brand-primary",
    secondary: "text-brand-secondary",
    success: "text-brand-success",
    warning: "text-brand-warning",
  };

  return (
    <div className={`flex flex-col gap-1 w-full select-none ${className}`}>
      {(label || showText) && (
        <div className="flex items-center justify-between text-[10px] font-mono tracking-wider uppercase">
          {label && <span className="text-brand-text-secondary">{label}</span>}
          {showText && <span className={`${textColors[color]} font-bold`}>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="h-2 bg-brand-bg rounded-full border border-brand-primary/10 overflow-hidden p-0.5 shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-300 ${colors[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
