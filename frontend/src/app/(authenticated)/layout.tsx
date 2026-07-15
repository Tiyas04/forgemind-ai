"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Terminal, Network, Activity, 
  Settings, LogOut, Menu, X, Cpu, ShieldCheck
} from "lucide-react";
import CustomCursor from "@/components/landing/CustomCursor";
import CyberBadge from "@/components/ui/CyberBadge";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [operatorName, setOperatorName] = useState("OP_GUEST");

  useEffect(() => {
    // Enforce auth check (Temporarily disabled for development ease)
    /*
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/auth");
      return;
    }
    */

    const email = localStorage.getItem("operatorEmail");
    if (email) {
      const handle = email.split("@")[0].toUpperCase();
      setOperatorName(`OP_${handle}`);
    } else {
      setOperatorName("OP_DEV_MODE");
    }

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toISOString().replace("T", " ").substring(0, 19));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [router]);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", subtitle: "Operator Mission Control", icon: LayoutDashboard },
    { href: "/dashboard#scada", label: "SCADA Logs", subtitle: "Real-time Telemetry sensor feeds", icon: Terminal },
    { href: "/dashboard#graph", label: "Neo4j Graph", subtitle: "Knowledge network explorer", icon: Network },
    { href: "/dashboard#telemetry", label: "Metrics & Health", subtitle: "Hardware status reports", icon: Activity },
    { href: "/dashboard#compliance", label: "ASTM Settings", subtitle: "Safety parameters", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("operatorEmail");
    router.push("/");
  };

  return (
    <div className="relative min-h-screen flex bg-[#07070a] text-brand-primary font-mono crt-effect crt-scanlines selection:bg-brand-primary/30 overflow-hidden">
      {/* Background scanline laser and faints */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#06B6D4_1px,transparent_1px),linear-gradient(to_bottom,#06B6D4_1px,transparent_1px)] bg-size-[32px_32px] pointer-events-none z-0" />
      <div className="scan-laser-line" />

      {/* Custom Cursor */}
      <CustomCursor />

      {/* SIDE NAVIGATION BAR */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed lg:sticky top-0 left-0 h-screen w-[280px] bg-[#0d0f14]/95 border-r border-brand-primary/10 flex flex-col justify-between p-5 z-40 backdrop-blur-3xl shrink-0"
          >
            {/* Corner Tech Brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-brand-primary/30 rounded-tl pointer-events-none" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-brand-primary/30 rounded-tr pointer-events-none" />

            <div className="flex flex-col gap-6">
              {/* Sidebar Header Brand */}
              <div className="flex items-center justify-between border-b border-brand-primary/10 pb-4 mt-2">
                <div className="flex items-center space-x-3 text-left">
                  <div className="p-2 rounded bg-brand-primary/10 border border-brand-primary/30 text-brand-primary">
                    <Cpu className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="font-heading text-sm font-bold tracking-wider text-brand-text-primary uppercase">
                      FORGEMIND <span className="text-brand-primary">OS</span>
                    </h2>
                    <span className="text-[8px] text-brand-text-secondary tracking-widest uppercase">
                      OPERATOR TERMINAL v2.4
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-1.5 rounded hover:bg-brand-primary/10 text-brand-text-secondary hover:text-brand-primary cursor-pointer transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const IconComp = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <button
                      key={item.href}
                      onClick={() => router.push(item.href)}
                      className={`group flex items-start gap-3 p-3 rounded-xl border transition-all duration-300 text-left select-none cursor-pointer ${
                        isActive 
                          ? "bg-brand-primary/10 border-brand-primary/30 text-brand-primary shadow-[0_0_15px_rgba(6,182,212,0.08)]" 
                          : "bg-transparent border-transparent text-brand-text-secondary hover:border-brand-primary/20 hover:text-brand-text-primary hover:bg-[#11141c]/50"
                      }`}
                    >
                      <IconComp className={`h-4 w-4 shrink-0 mt-0.5 ${isActive ? "text-brand-primary animate-pulse" : "text-brand-text-secondary group-hover:text-brand-primary"}`} />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold tracking-wider uppercase font-heading">{item.label}</span>
                        <span className="text-[8px] text-brand-text-secondary font-mono tracking-wide">{item.subtitle}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Operator Signature Block */}
            <div className="border-t border-brand-primary/10 pt-4 flex flex-col gap-4 mt-auto">
              <div className="bg-[#11141c]/50 border border-brand-primary/10 rounded-xl p-3.5 flex flex-col gap-1 text-[9px] text-left">
                <div className="flex items-center justify-between text-brand-text-secondary">
                  <span>OPERATOR: <span className="text-brand-text-primary font-bold">{operatorName}</span></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-success animate-pulse" />
                </div>
                <div className="flex items-center justify-between text-brand-text-secondary">
                  <span>SECURE_BOOT: <span className="text-brand-success">ON</span></span>
                  <span>SSL: AES-256</span>
                </div>
                <div className="text-brand-text-secondary mt-1 border-t border-brand-primary/10 pt-1">
                  CLOCK: <span className="text-brand-primary">{currentTime}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-3 text-[10px] uppercase font-bold text-brand-danger bg-brand-danger/5 hover:bg-brand-danger/10 border border-brand-danger/20 rounded-xl transition-all cursor-pointer select-none"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>TERMINATE LINK</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative z-10">
        {/* TOP STATUS HEADER BAR */}
        <header className="sticky top-0 bg-[#07070a]/80 backdrop-blur-md border-b border-brand-primary/10 px-5 py-4 flex items-center justify-between z-30">
          <div className="flex items-center space-x-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl bg-[#11141c] border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/10 cursor-pointer transition-colors"
                aria-label="Open Sidebar Menu"
              >
                <Menu className="h-4 w-4" />
              </button>
            )}
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-brand-text-primary uppercase font-heading tracking-wider">
                Industrial Console Dashboard
              </span>
              <span className="text-[8px] text-brand-text-secondary tracking-widest uppercase">
                SCADA Telemetry & Knowledge Engine Interface
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <CyberBadge status="success" pulse={true} className="hidden sm:inline-flex">
              SYS_OPERATIONAL
            </CyberBadge>
            <div className="flex items-center space-x-2 text-[10px] text-brand-text-secondary font-mono">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-success" />
              <span className="hidden md:inline">NODE_LATENCY:</span>
              <span className="text-brand-success font-bold">18MS</span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="grow p-5 md:p-6 overflow-y-auto relative">
          {children}
        </main>
      </div>
    </div>
  );
}
