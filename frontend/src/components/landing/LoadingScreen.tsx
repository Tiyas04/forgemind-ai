"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, CheckCircle2, Terminal, ShieldCheck, Zap, Network, Activity } from "lucide-react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const stages = [
    "Booting ForgeMind Industrial Neural Engine OS v2.4...",
    "Indexing 1,204 plant PDF manuals & CAD engineering drawings...",
    "Building 82,000 entity nodes in Neo4j Knowledge Graph...",
    "Calibrating ChromaDB vector embeddings & 18ms RAG pipeline...",
    "Synchronizing SCADA telemetry streams & OISD compliance checks...",
    "Systems Operational • Launching Command Center...",
  ];

  // Exact 5.0-second progress timer (50ms interval x 100 steps = 5000ms)
  useEffect(() => {
    const TOTAL_DURATION_MS = 5000;
    const INTERVAL_MS = 50;
    const INCREMENT_PER_STEP = 100 / (TOTAL_DURATION_MS / INTERVAL_MS);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + INCREMENT_PER_STEP;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 400);
          return 100;
        }
        return next;
      });
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  // Update stage message based on progress percentage
  useEffect(() => {
    if (progress < 20) setStageIndex(0);
    else if (progress >= 20 && progress < 40) setStageIndex(1);
    else if (progress >= 40 && progress < 60) setStageIndex(2);
    else if (progress >= 60 && progress < 80) setStageIndex(3);
    else if (progress >= 80 && progress < 98) setStageIndex(4);
    else setStageIndex(5);
  }, [progress]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-99999 flex flex-col items-center justify-center bg-brand-bg px-4 text-brand-text-primary selection:bg-brand-primary/30 overflow-hidden"
        >
          {/* Background Grid & Radial Pulse Texture */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-brand-primary/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-size-[32px_32px] pointer-events-none" />

          {/* Central Command Card */}
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-xl glass-command-card p-8 md:p-10 space-y-8 border-brand-primary/40 backdrop-blur-3xl shadow-[0_0_60px_rgba(6,182,212,0.15)] relative overflow-hidden text-center"
          >
            
            {/* Spinning HUD Ring & Logo */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute w-20 h-20 rounded-full border-2 border-dashed border-brand-primary/40 border-t-brand-primary"
                />
                <div className="p-4 rounded-2xl bg-linear-to-br from-brand-primary to-brand-secondary text-brand-bg shadow-2xl shadow-brand-primary/40 z-10">
                  <Cpu className="h-9 w-9 animate-pulse" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[10px] text-brand-primary uppercase tracking-widest bg-brand-primary/10 px-3.5 py-1 rounded-full border border-brand-primary/20">
                  ⚡ INITIALIZING FORGEMIND NEURAL BRAIN OS v2.4
                </span>
                <h2 className="font-satoshi text-2xl md:text-3xl font-bold tracking-tight text-brand-text-primary pt-2">
                  Enterprise System Boot
                </h2>
              </div>
            </div>

            {/* Main Numeric Counter Readout */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between font-mono">
                <span className="text-xs text-brand-text-secondary uppercase tracking-wider flex items-center space-x-1.5">
                  <Activity className="h-3.5 w-3.5 text-brand-primary animate-pulse" />
                  <span>SYSTEM DIAGNOSTICS PROGRESS</span>
                </span>
                <span className="text-3xl md:text-4xl font-bold text-brand-primary tracking-tight">
                  {Math.round(progress)}<span className="text-sm font-normal text-brand-text-secondary ml-1">%</span>
                </span>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full h-3 bg-brand-bg rounded-full overflow-hidden border border-brand-border/90 p-0.5 shadow-inner">
                <motion.div
                  className="h-full bg-linear-to-r from-brand-primary via-[#67E8F9] to-brand-secondary rounded-full shadow-[0_0_15px_#06B6D4]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Live Terminal Log Line */}
            <div className="bg-brand-bg border border-brand-border/80 rounded-xl p-4 flex items-center space-x-3 text-left font-mono text-xs shadow-inner">
              <Terminal className="h-4 w-4 text-brand-primary shrink-0 animate-pulse" />
              <span className="text-brand-text-primary font-medium truncate">
                {stages[stageIndex]}
              </span>
            </div>

            {/* Live Telemetry Badges Footer */}
            <div className="pt-2 border-t border-brand-border/60 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-brand-text-secondary">
              <span className="flex items-center space-x-1 text-brand-success">
                <CheckCircle2 className="h-3 w-3" />
                <span>LATENCY: 18MS</span>
              </span>
              <span className="flex items-center space-x-1 text-brand-primary">
                <Network className="h-3 w-3" />
                <span>NODES: 82,000</span>
              </span>
              <span className="flex items-center space-x-1 text-brand-secondary">
                <ShieldCheck className="h-3 w-3" />
                <span>UPTIME: 99.98%</span>
              </span>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
