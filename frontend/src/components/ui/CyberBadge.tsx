import React from "react";

interface CyberBadgeProps {
  status?: "success" | "warning" | "error" | "info" | "primary";
  children: React.ReactNode;
  className?: string;
  pulse?: boolean;
}

export default function CyberBadge({
  status = "info",
  children,
  className = "",
  pulse = true,
}: CyberBadgeProps) {
  const styles = {
    success: {
      bg: "bg-brand-success/10 border-brand-success/20 text-brand-success",
      dot: "bg-brand-success",
    },
    warning: {
      bg: "bg-brand-warning/10 border-brand-warning/20 text-brand-warning",
      dot: "bg-brand-warning",
    },
    error: {
      bg: "bg-brand-danger/10 border-brand-danger/20 text-brand-danger",
      dot: "bg-brand-danger",
    },
    info: {
      bg: "bg-brand-primary/10 border-brand-primary/20 text-brand-primary",
      dot: "bg-brand-primary",
    },
    primary: {
      bg: "bg-brand-secondary/10 border-brand-secondary/20 text-brand-secondary",
      dot: "bg-brand-secondary",
    },
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-mono font-medium tracking-wider uppercase select-none ${styles[status].bg} ${className}`}>
      {pulse && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${styles[status].dot}`} />
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${styles[status].dot}`} />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}
