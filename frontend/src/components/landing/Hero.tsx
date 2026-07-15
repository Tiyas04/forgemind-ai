"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Terminal, CheckCircle2, GitBranch, Sparkles, Layers, FileText, ShieldCheck, Zap } from "lucide-react";

export default function Hero() {
  const [activeQueryIndex, setActiveQueryIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const consoleQueries = [
    {
      query: "> Why did Pump A fail last month?",
      results: [
        "Root Cause Analysis: Bearing Thermal Overheat",
        "3 Maintenance History Logs Cross-Referenced",
        "2 Vibration Telemetry Scans Analyzed",
        "SOP Recommendation: High-Temp Lubricant & Alignment",
      ],
      tag: "RCA_RESOLVED • 18ms",
    },
    {
      query: "> Find SOP for Turbine TB-902 vibration spike",
      results: [
        "3 OEM Operating Manuals Retrieved",
        "2 Sensor Telemetry Logs Analyzed",
        "Clearance Checklists Cross-Referenced",
        "Action Plan Generated with Citation [Manual Page 142]",
      ],
      tag: "SOP_FOUND • CITATION_VERIFIED",
    },
    {
      query: "> Audit OISD Safety Compliance for Tank 4B",
      results: [
        "Factory Act 1948 Audit Standards Verified",
        "4 Pressure Vessel Certifications Matched",
        "Zero Regulatory Violations Detected",
        "Compliance Certificate Status: 98.7% VALIDATED",
      ],
      tag: "COMPLIANCE_AUDIT_OK",
    },
  ];

  // Auto cycle query examples every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveQueryIndex((prev) => (prev + 1) % consoleQueries.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [consoleQueries.length]);

  const handleManualAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setActiveQueryIndex((prev) => (prev + 1) % consoleQueries.length);
    }, 800);
  };

  const currentConsole = consoleQueries[activeQueryIndex];

  return (
    <section className="relative w-full min-h-[92vh] flex flex-col items-center justify-center pt-28 pb-16 px-4 md:px-6 overflow-hidden">
      
      {/* Main Mission Control Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container relative z-10 max-w-4xl mx-auto text-center space-y-8"
      >
        
        {/* Title & Subtitle */}
        <div className="space-y-3">
          <h1 className="font-satoshi text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08]">
            <span className="bg-linear-to-r from-white via-[#67E8F9] to-brand-secondary bg-clip-text text-transparent">
              ForgeMind
            </span>
          </h1>

          <h2 className="font-satoshi text-2xl sm:text-3xl md:text-4xl font-semibold text-brand-primary tracking-wide">
            The Industrial Knowledge Brain
          </h2>
        </div>

        {/* Description */}
        <p className="font-sans text-base md:text-lg text-brand-text-secondary max-w-2xl mx-auto font-normal leading-relaxed">
          Connecting documents, assets, and operational intelligence through AI-powered semantic understanding.
        </p>

        {/* Primary Action Buttons */}
        <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/auth"
            className="group flex items-center space-x-2 bg-linear-to-r from-brand-primary to-brand-secondary hover:brightness-110 active:scale-95 text-brand-bg font-satoshi font-semibold text-sm px-8 py-3.5 rounded-xl shadow-xl shadow-brand-primary/25 transition-all cursor-pointer"
          >
            <span>Open Platform</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>

          <a
            href="https://github.com/Tiyas04/forgemind-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 glass-pill hover:bg-brand-surface/80 active:scale-95 text-brand-text-primary font-satoshi font-semibold text-sm px-7 py-3.5 rounded-xl transition-all cursor-pointer border-brand-border"
          >
            <GitBranch className="h-4 w-4 text-brand-primary" />
            <span>GitHub</span>
          </a>
        </div>

        {/* Single Centerpiece: The ForgeMind Console Terminal Box */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="pt-4 max-w-3xl mx-auto text-left"
        >
          <div className="glass-command-card p-6 md:p-10 space-y-6 border-brand-primary/50 backdrop-blur-3xl bg-brand-surface/40 shadow-[0_0_60px_rgba(6,182,212,0.2)] rounded-3xl relative overflow-hidden border-2">
            
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-brand-border/80 pb-4">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-brand-danger/80" />
                  <span className="w-3 h-3 rounded-full bg-brand-warning/80" />
                  <span className="w-3 h-3 rounded-full bg-brand-success/80" />
                </div>
                <span className="font-mono text-xs font-bold text-brand-text-primary flex items-center space-x-2">
                  <Terminal className="h-4 w-4 text-brand-primary animate-pulse" />
                  <span>⚡ ForgeMind Console</span>
                </span>
              </div>

              <div className="flex items-center space-x-3 font-mono text-[10px]">
                <span className="text-brand-success bg-brand-success/10 border border-brand-success/20 px-2.5 py-0.5 rounded-full">
                  ● LIVE SYSTEM
                </span>
                <span className="text-brand-primary hidden sm:inline">{currentConsole.tag}</span>
              </div>
            </div>

            {/* Cycling Query Prompt & Execution Output */}
            <div className="space-y-4 font-mono text-xs">
              
              {/* Query Terminal Line */}
              <div className="bg-brand-bg/70 backdrop-blur-2xl border border-brand-primary/30 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-inner">
                <span className="text-brand-primary font-semibold text-sm sm:text-base tracking-wide truncate">
                  {currentConsole.query}
                </span>

                <button
                  onClick={handleManualAnalyze}
                  disabled={isAnalyzing}
                  className="shrink-0 flex items-center space-x-1.5 bg-brand-primary hover:bg-brand-primary/90 text-brand-bg font-satoshi font-semibold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-lg shadow-brand-primary/20"
                >
                  <Sparkles className={`h-3.5 w-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
                  <span>{isAnalyzing ? "Analyzing..." : "Analyze"}</span>
                </button>
              </div>

              {/* Dynamic Answer Checklist Results */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeQueryIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1"
                >
                  {currentConsole.results.map((res, i) => (
                    <div
                      key={i}
                      className="bg-brand-surface/50 backdrop-blur-xl border border-brand-border/80 rounded-xl p-3 flex items-center space-x-2.5 text-brand-text-secondary hover:border-brand-primary/40 transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4 text-brand-success shrink-0" />
                      <span className="text-[11px] font-sans font-medium text-brand-text-primary leading-tight">
                        {res}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

            </div>

            {/* Query Selector Indicators */}
            <div className="flex items-center justify-between border-t border-brand-border/60 pt-4 text-[10px] font-mono text-brand-text-secondary">
              <span>CYCLED QUERIES:</span>
              <div className="flex items-center space-x-2">
                {consoleQueries.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveQueryIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeQueryIndex === idx ? "w-6 bg-brand-primary" : "w-2 bg-brand-border hover:bg-brand-text-secondary"
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>
        </motion.div>

        {/* Single Horizontal Status Bar (Below Console) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-2 max-w-3xl mx-auto flex flex-wrap items-center justify-around gap-6 glass-pill px-6 py-3 border-brand-border/80 shadow-lg text-center"
        >
          <div className="flex items-center space-x-2 font-mono text-xs">
            <Layers className="h-4 w-4 text-brand-primary" />
            <span className="font-bold text-brand-text-primary">82K</span>
            <span className="text-brand-text-secondary text-[11px]">Knowledge Nodes</span>
          </div>

          <span className="text-brand-border hidden sm:inline">•</span>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <FileText className="h-4 w-4 text-brand-primary" />
            <span className="font-bold text-brand-text-primary">1,204</span>
            <span className="text-brand-text-secondary text-[11px]">Documents</span>
          </div>

          <span className="text-brand-border hidden sm:inline">•</span>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <ShieldCheck className="h-4 w-4 text-brand-success" />
            <span className="font-bold text-brand-text-primary">98%</span>
            <span className="text-brand-text-secondary text-[11px]">Compliance</span>
          </div>

          <span className="text-brand-border hidden sm:inline">•</span>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <Zap className="h-4 w-4 text-brand-warning" />
            <span className="font-bold text-brand-text-primary">143</span>
            <span className="text-brand-text-secondary text-[11px]">Active Signals</span>
          </div>
        </motion.div>

      </motion.div>

    </section>
  );
}
