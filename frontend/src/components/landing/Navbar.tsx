"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Cpu, GitBranch, Sparkles, LayoutDashboard, Layers, Activity, ChevronRight, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "#demo", label: "Live AI Demo", subtitle: "Test synthesized Q&A & graph links", icon: Sparkles },
    { href: "#why", label: "Why ForgeMind", subtitle: "Legacy manual vs Neural workflow", icon: Layers },
    { href: "#platform", label: "Platform Modules", subtitle: "Explore 6 core AI engines", icon: Activity },
    { href: "#dashboard", label: "Industrial Dashboard", subtitle: "Live SCADA command center", icon: LayoutDashboard },
    { href: "#architecture", label: "System Architecture", subtitle: "Interactive blueprint inspector", icon: Cpu },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-brand-bg/85 backdrop-blur-3xl border-b border-[#67E8F9]/10 py-3 shadow-2xl"
            : "bg-transparent py-5 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          
          {/* Logo with System Status Dot */}
          <a href="#" className="flex items-center space-x-3 group z-110 relative">
            <div className="p-2 rounded-xl bg-linear-to-br from-brand-primary to-brand-secondary text-brand-bg shadow-md shadow-brand-primary/20 group-hover:scale-105 transition-transform">
              <Cpu className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-heading font-bold text-base tracking-tight text-brand-text-primary">
                  ForgeMind <span className="text-brand-primary">AI</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono bg-brand-success/10 text-brand-success border border-brand-success/20">
                  ● OPERATIONAL
                </span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-brand-text-secondary">
                Industrial Command Center
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-sans font-medium tracking-wide text-brand-text-secondary">
            <a href="#demo" className="hover:text-brand-primary transition-colors">
              Live Demo
            </a>
            <a href="#why" className="hover:text-brand-primary transition-colors">
              Why ForgeMind
            </a>
            <a href="#platform" className="hover:text-brand-primary transition-colors">
              Platform
            </a>
            <a href="#dashboard" className="hover:text-brand-primary transition-colors">
              Dashboard
            </a>
            <a href="#architecture" className="hover:text-brand-primary transition-colors">
              Architecture
            </a>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex items-center space-x-4">
            <a
              href="https://github.com/Tiyas04/forgemind-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-xs font-satoshi font-semibold text-brand-text-secondary hover:text-brand-text-primary px-3.5 py-2 rounded-xl glass-pill transition-colors"
            >
              <GitBranch className="h-4 w-4 text-brand-primary" />
              <span>GitHub</span>
            </a>
            
            <a
              href="#launch"
              className="group flex items-center space-x-2 bg-linear-to-r from-brand-primary to-brand-secondary hover:brightness-110 active:scale-95 text-brand-bg font-satoshi font-semibold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-brand-primary/20 transition-all cursor-pointer"
            >
              <span>Launch Platform</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          {/* Custom Morphing Hamburger To Cross Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden z-110 relative p-3 rounded-2xl glass-pill bg-brand-surface/90 border border-brand-primary/40 text-brand-primary hover:bg-brand-primary hover:text-brand-bg transition-all cursor-pointer flex flex-col justify-center items-center gap-1.5 w-11 h-11 shadow-lg shadow-brand-primary/20"
            aria-label="Toggle Full Screen Navigation Menu"
          >
            <motion.span
              animate={mobileMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-5 h-0.5 bg-current rounded-full block"
            />
            <motion.span
              animate={mobileMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="w-5 h-0.5 bg-current rounded-full block"
            />
            <motion.span
              animate={mobileMenuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-5 h-0.5 bg-current rounded-full block"
            />
          </button>

        </div>
      </motion.header>

      {/* Full-Screen Mobile Navigation Overlay (Left-to-Right Slide) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-100 w-screen h-screen bg-brand-bg/98 backdrop-blur-3xl flex flex-col justify-between p-6 md:p-12 overflow-y-auto"
          >
            {/* Overlay Header Label & Prominent Close Cross Button */}
            <div className="flex items-center justify-between border-b border-brand-border/60 pb-5 pt-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-linear-to-br from-brand-primary to-brand-secondary text-brand-bg shadow-md">
                  <Cpu className="h-5 w-5" />
                </div>
                <span className="font-satoshi font-bold text-lg text-brand-text-primary tracking-tight">
                  ForgeMind <span className="text-brand-primary">OS Menu</span>
                </span>
              </div>

              {/* Prominent Cross (X) Close Button */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-2xl bg-brand-primary/20 border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-bg transition-all cursor-pointer flex items-center justify-center shadow-lg shadow-brand-primary/40"
                aria-label="Close Navigation Menu"
              >
                <X className="h-7 w-7 stroke-[2.5]" />
              </button>
            </div>

            {/* Main Links Container with Staggered Slide Entrance */}
            <div className="py-8 my-auto space-y-4 max-w-lg mx-auto w-full">
              <span className="font-mono text-[10px] text-brand-primary uppercase tracking-widest block mb-4">
                NAVIGATION COMMANDS
              </span>

              {navLinks.map((link, idx) => {
                const IconComp = link.icon;
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.12 + idx * 0.06 }}
                    className="group glass-command-card p-4 flex items-center justify-between rounded-2xl border-brand-border/60 hover:border-brand-primary/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary group-hover:bg-brand-primary group-hover:text-brand-bg transition-colors">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-satoshi font-semibold text-base text-brand-text-primary group-hover:text-brand-primary transition-colors">
                          {link.label}
                        </h3>
                        <p className="font-sans text-xs text-brand-text-secondary font-light">
                          {link.subtitle}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-brand-text-secondary group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                  </motion.a>
                );
              })}
            </div>

            {/* Bottom Actions Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.4 }}
              className="pt-6 border-t border-brand-border/60 flex flex-col sm:flex-row gap-4 max-w-lg mx-auto w-full"
            >
              <a
                href="https://github.com/Tiyas04/forgemind-ai"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 text-xs font-satoshi font-semibold text-brand-text-primary px-5 py-3.5 rounded-xl glass-pill transition-colors border-brand-border"
              >
                <GitBranch className="h-4 w-4 text-brand-primary" />
                <span>GitHub Repository</span>
              </a>

              <a
                href="#launch"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 bg-linear-to-r from-brand-primary to-brand-secondary text-brand-bg font-satoshi font-semibold text-xs px-5 py-3.5 rounded-xl shadow-xl shadow-brand-primary/20 transition-all cursor-pointer"
              >
                <span>Launch Platform</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
