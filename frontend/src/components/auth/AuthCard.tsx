"use client";

import Link from "next/link";
import BackgroundCanvas3D from "@/components/landing/BackgroundCanvas3D";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
}

export default function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerLink,
  footerLinkText,
}: AuthCardProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-bg px-6">

      {/* Background */}
      <BackgroundCanvas3D className="absolute inset-0 opacity-80" />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

      {/* Logo */}
      <div className="absolute left-10 top-8 z-20">
        <Link href="/">
          <h1 className="text-2xl font-bold tracking-wide text-white cursor-pointer">
            Forge<span className="text-cyan-400">Mind</span>
          </h1>
        </Link>
      </div>

      {/* Glass Card */}
      <div
        className="
          relative
          z-20
          w-full
          max-w-md
          rounded-3xl
          border
          border-cyan-500/20
          bg-white/5
          p-8
          backdrop-blur-xl
          shadow-[0_0_60px_rgba(0,170,255,0.15)]
        "
      >
        {/* Heading */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white">
            {title}
          </h2>

          <p className="mt-2 text-gray-400">
            {subtitle}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {children}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400">
          {footerText}{" "}
          <Link
            href={footerLink}
            className="font-semibold text-cyan-400 hover:text-cyan-300 transition"
          >
            {footerLinkText}
          </Link>
        </div>
      </div>
    </div>
  );
}