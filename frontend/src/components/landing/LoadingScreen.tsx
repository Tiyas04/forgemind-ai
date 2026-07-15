"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, CheckCircle2, Terminal, ShieldCheck, Zap, 
  Network, Activity, AlertTriangle, Server
} from "lucide-react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const [telemetry, setTelemetry] = useState({
    cpuLoad: 74,
    ramLoad: 61,
    temp: 42,
    latency: 18,
  });

  // Stages structure for cyberpunk log
  const stages = [
    { prefix: "INIT", text: "Booting ForgeMind Industrial Neural Engine OS v2.4...", status: "success" },
    { prefix: "CORE", text: "Verifying encrypted hypervisor microcode & secure boot...", status: "success" },
    { prefix: "DBFS", text: "Indexing 1,204 plant PDF manuals & CAD drawings...", status: "success" },
    { prefix: "RAG", text: "Loading ChromaDB vector database embeddings (1536-dim)...", status: "success" },
    { prefix: "NEO4", text: "Building 82,000 relational entity nodes in Neo4j Graph...", status: "success" },
    { prefix: "SYNC", text: "Establishing secure WebSocket streams to SCADA gateway...", status: "success" },
    { prefix: "COMP", text: "Running ASTM / OISD environmental safety compliance verification...", status: "warning" },
    { prefix: "LIVE", text: "System fully calibrated. Redirecting to mission control...", status: "success" },
  ];

  // Dynamic telemetry simulator
  useEffect(() => {
    const telemetryInterval = setInterval(() => {
      setTelemetry({
        cpuLoad: Math.floor(70 + Math.random() * 15),
        ramLoad: Math.floor(58 + Math.random() * 6),
        temp: Math.floor(40 + Math.random() * 6),
        latency: Math.floor(14 + Math.random() * 6),
      });
    }, 450);

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toISOString().replace("T", " ").substring(0, 19));
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    return () => {
      clearInterval(telemetryInterval);
      clearInterval(timeInterval);
    };
  }, []);

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
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return next;
      });
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  // Update stage index based on progress
  useEffect(() => {
    const stageProgressStep = 100 / stages.length;
    const currentIdx = Math.min(
      Math.floor(progress / stageProgressStep),
      stages.length - 1
    );
    setStageIndex(currentIdx);
  }, [progress]);

  // Autoscroll terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [stageIndex]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-99999 flex items-center justify-center bg-[#07070a] text-brand-primary font-mono selection:bg-brand-primary/30 overflow-hidden crt-effect crt-scanlines"
        >
          {/* Active Grid Background */}
          <div className="absolute inset-0 opacity-8 bg-[linear-gradient(to_right,#06B6D4_1px,transparent_1px),linear-gradient(to_bottom,#06B6D4_1px,transparent_1px)] bg-size-[32px_32px] pointer-events-none" />
          <div className="scan-laser-line" />

          {/* Glare/Pulse Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08),transparent_70%)] pointer-events-none" />

          {/* Central Console Console Card */}
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-5xl bg-[#0d0f14]/90 border border-brand-primary/20 rounded-2xl p-6 relative flex flex-col gap-6 backdrop-blur-3xl shadow-[0_0_80px_rgba(6,182,212,0.12)] z-10 m-4 overflow-hidden"
          >
            {/* Tech bracket accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-primary/60 rounded-tl-xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand-primary/60 rounded-tr-xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand-primary/60 rounded-bl-xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-primary/60 rounded-br-xl pointer-events-none" />

            {/* HEADER PANEL */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-b border-brand-primary/10 pb-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded bg-brand-primary/10 border border-brand-primary/30 text-brand-primary">
                  <Cpu className="h-5 w-5 animate-pulse" />
                </div>
                <div className="text-left">
                  <h1 className="font-heading text-lg font-bold tracking-wider text-brand-text-primary uppercase flex items-center gap-2">
                    FORGEMIND NEURAL BRAIN OS
                    <span className="text-xs font-mono font-normal text-brand-secondary bg-brand-secondary/15 px-2 py-0.5 rounded border border-brand-secondary/30">
                      v2.4
                    </span>
                  </h1>
                  <p className="text-[10px] text-brand-text-secondary tracking-widest uppercase">
                    Industrial AI Processing & SCADA Core Initialization
                  </p>
                </div>
              </div>

              {/* Waveform / Visualizer */}
              <div className="flex items-center space-x-6">
                <div className="hidden md:flex items-end justify-center gap-1 h-6 w-24">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-[3px] bg-brand-primary rounded-full"
                      animate={{ height: ["20%", "100%", "20%"] }}
                      transition={{
                        duration: 0.6 + i * 0.08,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>

                <div className="text-right text-[10px] text-brand-text-secondary font-mono">
                  <div>SYS_TIME: <span className="text-brand-primary">{currentTime}</span></div>
                  <div>SECURE_BOOT: <span className="text-brand-success font-bold">ACTIVE</span></div>
                </div>
              </div>
            </div>

            {/* BODY PANELS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT COLUMN: DIAGNOSTICS & RADAR (lg:col-span-4) */}
              <div className="lg:col-span-4 flex flex-col gap-6 border-b lg:border-b-0 lg:border-r border-brand-primary/10 pb-6 lg:pb-0 lg:pr-6">
                
                {/* Concentric Radar Component */}
                <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-brand-bg/50 border border-brand-primary/10 relative overflow-hidden">
                  <span className="absolute top-2 left-3 text-[9px] text-brand-text-secondary tracking-widest uppercase">
                    SYSTEM_RADAR_SCAN
                  </span>
                  
                  <div className="w-40 h-40 relative flex items-center justify-center mt-3">
                    <svg viewBox="0 0 200 200" className="w-full h-full text-brand-primary/60">
                      <circle cx="100" cy="100" r="90" className="stroke-current fill-none stroke-[0.75]" strokeDasharray="4 4" />
                      <circle cx="100" cy="100" r="70" className="stroke-current fill-none stroke-[0.5]" />
                      <circle cx="100" cy="100" r="50" className="stroke-current fill-none stroke-[0.75]" strokeDasharray="8 8" />
                      <circle cx="100" cy="100" r="30" className="stroke-current fill-none stroke-[0.5]" />
                      <line x1="100" y1="10" x2="100" y2="190" className="stroke-current opacity-30 stroke-[0.5]" />
                      <line x1="10" y1="100" x2="190" y2="100" className="stroke-current opacity-30 stroke-[0.5]" />
                      
                      {/* Sweeping radar beam */}
                      <motion.line
                        x1="100" y1="100"
                        x2="100" y2="10"
                        className="stroke-brand-primary stroke-2 origin-center"
                        style={{ transformOrigin: "100px 100px" }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      />
                      
                      {/* Targets */}
                      <motion.circle
                        cx="140"
                        cy="60"
                        r="3.5"
                        className="fill-brand-success"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      />
                      <motion.circle
                        cx="70"
                        cy="130"
                        r="3"
                        className="fill-brand-secondary"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                      />
                    </svg>
                  </div>
                  
                  {/* Telemetry info */}
                  <div className="w-full flex items-center justify-between text-[9px] text-brand-text-secondary mt-2 px-2">
                    <span>TARGET_COUNT: 02</span>
                    <span>COORDS: [74.2, 18.9]</span>
                  </div>
                </div>

                {/* Telemetry Stats Bars */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-[10px] text-brand-text-secondary tracking-widest uppercase mb-1 text-left">
                    HARDWARE_TELEMETRY
                  </h3>

                  {/* CPU Load */}
                  <div className="space-y-1 text-left">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="flex items-center gap-1.5">
                        <Activity className="h-3 w-3 text-brand-primary" />
                        CPU ENGINE LOAD
                      </span>
                      <span className="text-brand-primary font-bold">{telemetry.cpuLoad}%</span>
                    </div>
                    <div className="h-2 bg-brand-bg rounded-full border border-brand-primary/10 overflow-hidden p-0.5">
                      <div 
                        className="h-full bg-brand-primary rounded-full transition-all duration-300 shadow-[0_0_8px_#06B6D4]" 
                        style={{ width: `${telemetry.cpuLoad}%` }}
                      />
                    </div>
                  </div>

                  {/* RAM Load */}
                  <div className="space-y-1 text-left">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="flex items-center gap-1.5">
                        <Server className="h-3 w-3 text-brand-secondary" />
                        NEURAL RAM BUFFER
                      </span>
                      <span className="text-brand-secondary font-bold">{telemetry.ramLoad}%</span>
                    </div>
                    <div className="h-2 bg-brand-bg rounded-full border border-brand-primary/10 overflow-hidden p-0.5">
                      <div 
                        className="h-full bg-brand-secondary rounded-full transition-all duration-300 shadow-[0_0_8px_#3B82F6]" 
                        style={{ width: `${telemetry.ramLoad}%` }}
                      />
                    </div>
                  </div>

                  {/* Core Temp */}
                  <div className="space-y-1 text-left">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="flex items-center gap-1.5">
                        <Zap className="h-3 w-3 text-brand-warning" />
                        THERMAL COEFFICIENT
                      </span>
                      <span className="text-brand-warning font-bold">{telemetry.temp}°C</span>
                    </div>
                    <div className="h-2 bg-brand-bg rounded-full border border-brand-primary/10 overflow-hidden p-0.5">
                      <div 
                        className="h-full bg-brand-warning rounded-full transition-all duration-300 shadow-[0_0_8px_#F59E0B]" 
                        style={{ width: `${(telemetry.temp / 80) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: NEURAL CORE & TERMINAL LOGS (lg:col-span-8) */}
              <div className="lg:col-span-8 flex flex-col md:flex-row gap-6 items-stretch">
                
                {/* NEURAL CORE SPINNER */}
                <div className="w-full md:w-5/12 flex flex-col items-center justify-center bg-brand-bg/40 border border-brand-primary/10 p-6 rounded-xl relative">
                  <span className="absolute top-2 left-3 text-[9px] text-brand-text-secondary tracking-widest uppercase">
                    NEURAL_CORE_STATE
                  </span>

                  <div className="relative w-36 h-36 flex items-center justify-center mt-2">
                    {/* Glowing outer aura */}
                    <div className="absolute inset-0 rounded-full bg-brand-primary/5 blur-xl animate-pulse" />
                    
                    {/* Ring 1 (Rotating outer dial) */}
                    <motion.svg
                      className="absolute w-full h-full"
                      viewBox="0 0 100 100"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        className="stroke-brand-primary/40 fill-none stroke-2"
                        strokeDasharray="25 12 8 12"
                      />
                    </motion.svg>
                    
                    {/* Ring 2 (Counter rotating inner dial) */}
                    <motion.svg
                      className="absolute w-full h-full scale-[0.82]"
                      viewBox="0 0 100 100"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        className="stroke-brand-secondary fill-none stroke-[1.5]"
                        strokeDasharray="30 15 15 15"
                      />
                    </motion.svg>

                    {/* Ring 3 (Static dashes) */}
                    <svg className="absolute w-full h-full scale-[0.65]" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" className="stroke-brand-primary/20 fill-none stroke-1" strokeDasharray="3 3" />
                    </svg>

                    {/* Innermost Core with Progress Counter */}
                    <motion.div
                      animate={{ scale: [0.97, 1.03, 0.97] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="w-20 h-20 rounded-full bg-[#0d0f14] border border-brand-primary/50 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.25)] z-10"
                    >
                      <span className="font-heading text-xl font-extrabold text-brand-primary tracking-tighter">
                        {Math.round(progress)}%
                      </span>
                      <span className="text-[8px] font-mono text-brand-text-secondary tracking-wider uppercase">
                        LOADING
                      </span>
                    </motion.div>
                  </div>

                  <div className="w-full mt-5 bg-brand-bg rounded-lg border border-brand-primary/10 overflow-hidden p-0.5">
                    <div 
                      className="h-2 bg-linear-to-r from-brand-primary via-brand-secondary to-brand-primary rounded shadow-[0_0_10px_#06B6D4] transition-all duration-100" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  <div className="w-full flex items-center justify-between text-[9px] text-brand-text-secondary mt-2 px-1">
                    <span>SECTOR: 0x0FE5</span>
                    <span>BAUD_RATE: 9600</span>
                  </div>
                </div>

                {/* SCROLLING TERMINAL LOGS */}
                <div className="w-full md:w-7/12 flex flex-col bg-brand-bg/50 border border-brand-primary/10 rounded-xl relative p-4 overflow-hidden h-[240px] md:h-auto">
                  <div className="absolute top-2 left-4 text-[9px] text-brand-text-secondary tracking-widest uppercase flex items-center gap-1.5">
                    <Terminal className="h-3 w-3 text-brand-primary" />
                    SYSTEM_BOOT_LOGS
                  </div>
                  <div className="absolute top-2 right-4 text-[9px] text-brand-primary/60 animate-pulse">
                    ONLINE
                  </div>

                  <div className="flex-1 overflow-y-auto mt-5 pr-1 space-y-2.5 font-mono text-[11px] leading-relaxed text-left">
                    {/* Simulated static boot lines */}
                    <div className="flex items-center space-x-1.5 text-brand-text-secondary/70">
                      <span className="text-brand-success font-bold">[ OK ]</span>
                      <span>Initialize core microcode hypervisor...</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-brand-text-secondary/70">
                      <span className="text-brand-success font-bold">[ OK ]</span>
                      <span>Allocating 32GB neural workspace...</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-brand-text-secondary/70">
                      <span className="text-brand-success font-bold">[ OK ]</span>
                      <span>Secure tunnel latency handshakes: 18ms</span>
                    </div>

                    {/* Progress driven active logs */}
                    {stages.map((stage, idx) => {
                      const isCurrent = stageIndex === idx;
                      
                      if (idx > stageIndex) return null;

                      return (
                        <motion.div 
                          key={idx} 
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`flex items-start space-x-2 ${isCurrent ? 'text-brand-primary' : 'text-brand-text-secondary opacity-80'}`}
                        >
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold shrink-0 ${
                            isCurrent 
                              ? 'bg-brand-primary/20 text-brand-primary animate-pulse border border-brand-primary/30' 
                              : stage.status === "warning" 
                              ? 'bg-brand-warning/15 text-brand-warning border border-brand-warning/20'
                              : 'bg-brand-success/15 text-brand-success border border-brand-success/20'
                          }`}>
                            {isCurrent ? "RUNS" : stage.prefix}
                          </span>
                          <span className="text-left font-mono break-all sm:break-normal">
                            {stage.text}
                          </span>
                        </motion.div>
                      );
                    })}
                    <div ref={terminalEndRef} />
                  </div>
                </div>

              </div>

            </div>

            {/* FOOTER BADGES */}
            <div className="flex flex-wrap items-center justify-between border-t border-brand-primary/10 pt-4 gap-3 font-mono text-[10px] text-brand-text-secondary">
              <span className="flex items-center space-x-1.5 text-brand-success">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>LINK_ESTABLISHED: 18MS</span>
              </span>
              <span className="flex items-center space-x-1.5 text-brand-primary">
                <Network className="h-3.5 w-3.5" />
                <span>GRAPH_NODES: 82,000</span>
              </span>
              <span className="flex items-center space-x-1.5 text-brand-secondary">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>UPTIME_METRIC: 99.98%</span>
              </span>
              <span className="flex items-center space-x-1.5 text-brand-warning">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>THREAT_LEVEL: ZERO</span>
              </span>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

