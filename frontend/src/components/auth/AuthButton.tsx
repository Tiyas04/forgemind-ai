"use client";

import { ButtonHTMLAttributes } from "react";

interface AuthButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export default function AuthButton({
  children,
  isLoading = false,
  ...props
}: AuthButtonProps) {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className="
        w-full
        rounded-xl
        bg-cyan-500
        px-4
        py-3
        font-semibold
        text-white
        transition-all
        duration-300
        hover:bg-cyan-400
        hover:shadow-[0_0_25px_rgba(34,211,238,0.45)]
        active:scale-[0.98]
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      {isLoading ? "Please wait..." : children}
    </button>
  );
}