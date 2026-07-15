import React from "react";

interface CyberCardProps {
  title?: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  showGrid?: boolean;
  showBrackets?: boolean;
}

export default function CyberCard({
  title,
  subtitle,
  className = "",
  children,
  headerAction,
  showGrid = true,
  showBrackets = true,
}: CyberCardProps) {
  return (
    <div className={`relative bg-[#0d0f14]/80 border border-brand-primary/15 rounded-xl p-5 md:p-6 backdrop-blur-2xl shadow-[0_0_40px_rgba(6,182,212,0.05)] overflow-hidden flex flex-col gap-4 text-left ${className}`}>
      {/* Active Grid Accent inside card */}
      {showGrid && (
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#06B6D4_1px,transparent_1px),linear-gradient(to_bottom,#06B6D4_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-0" />
      )}
      
      {/* Decorative Corner Brackets */}
      {showBrackets && (
        <>
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-brand-primary/40 rounded-tl pointer-events-none z-10" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-brand-primary/40 rounded-tr pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-brand-primary/40 rounded-bl pointer-events-none z-10" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-brand-primary/40 rounded-br pointer-events-none z-10" />
        </>
      )}

      {/* Header section */}
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between border-b border-brand-primary/10 pb-3 z-10 relative">
          <div className="flex flex-col text-left">
            {title && (
              <h3 className="font-heading text-sm font-bold tracking-wider text-brand-text-primary uppercase flex items-center gap-1.5">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[9px] text-brand-text-secondary font-mono tracking-widest uppercase mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div className="text-xs">{headerAction}</div>}
        </div>
      )}

      {/* Body section */}
      <div className="relative z-10 flex-1 flex flex-col font-sans">
        {children}
      </div>
    </div>
  );
}
