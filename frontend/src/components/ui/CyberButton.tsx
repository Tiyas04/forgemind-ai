import React from "react";
import { motion } from "framer-motion";

interface CyberButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "danger";
  type?: "button" | "submit";
}

export default function CyberButton({
  onClick,
  children,
  className = "",
  disabled = false,
  isLoading = false,
  variant = "primary",
  type = "button",
}: CyberButtonProps) {
  const baseStyle = "relative overflow-hidden font-satoshi font-bold text-xs uppercase tracking-widest py-2.5 px-5 rounded-xl active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 select-none";
  
  const variants = {
    primary: "bg-linear-to-r from-brand-primary to-brand-secondary text-brand-bg shadow-md shadow-brand-primary/25 hover:brightness-110",
    secondary: "bg-brand-surface border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/10",
    outline: "bg-transparent border border-brand-primary/40 text-brand-primary hover:bg-brand-primary/10",
    danger: "bg-brand-danger/20 border border-brand-danger/40 text-brand-danger hover:bg-brand-danger/30",
  };

  return (
    <motion.button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>PROCESSING...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}
