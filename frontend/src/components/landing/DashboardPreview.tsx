"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, FileText, Layers, ShieldCheck, Zap, AlertTriangle, Cpu, Network, Activity, ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState<"assistant" | "graph" | "alerts">("assistant");

  return (
    <section id="dashboard" className="relative w-full py-32 px-4 md:px-6">
      <div className="container max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center space-y-4"
        >
          {/* <span className="font-mono text-xs text-brand-primary uppercase tracking-widest bg-brand-primary/10 px-3.5 py-1.5 rounded-full border border-brand-primary/20 flex items-center space-x-2">
            <LayoutDashboard className="h-3.5 w-3.5 text-brand-primary" />
            <span>Live Industrial Dashboard</span>
          </span> */}

          <h2 className="font-heading text-3xl md:text-5xl font-semibold text-brand-text-primary">
            Industrial <span className="text-brand-primary">Command Center</span>
          </h2>
          
          <p className="font-sans text-brand-text-secondary text-base max-w-2xl font-light">
            Real-time operational intelligence dashboard combining AI assistant Q&A, graph explorer, and live SCADA telemetry.
          </p>
        </motion.div>

        {/* Full Industrial Dashboard Preview Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-command-card p-6 md:p-8 space-y-6 border-brand-primary/30 shadow-2xl relative overflow-hidden"
        >
          
          {/* Dashboard Top Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-border/80 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-linear-to-br from-brand-primary to-brand-secondary text-brand-bg">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <span className="font-heading font-bold text-sm text-brand-text-primary">
                  ForgeMind Console OS <span className="text-brand-primary">v2.4</span>
                </span>
                <span className="font-mono text-[10px] text-brand-text-secondary block">
                  FACILITY: TATA STEEL / PLANT UNIT 4
                </span>
              </div>
            </div>

            {/* Dashboard Tab Selector */}
            <div className="flex items-center space-x-2 bg-brand-bg p-1 rounded-xl border border-brand-border font-mono text-xs">
              <button
                onClick={() => setActiveTab("assistant")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === "assistant" ? "bg-brand-primary text-brand-bg font-bold" : "text-brand-text-secondary hover:text-brand-text-primary"
                }`}
              >
                AI Assistant
              </button>
              <button
                onClick={() => setActiveTab("graph")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === "graph" ? "bg-brand-primary text-brand-bg font-bold" : "text-brand-text-secondary hover:text-brand-text-primary"
                }`}
              >
                Knowledge Graph
              </button>
              <button
                onClick={() => setActiveTab("alerts")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === "alerts" ? "bg-brand-primary text-brand-bg font-bold" : "text-brand-text-secondary hover:text-brand-text-primary"
                }`}
              >
                SCADA Telemetry
              </button>
            </div>
          </div>

          {/* Top 4 Metrics Widgets Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-brand-bg border border-brand-border rounded-xl p-4 space-y-1">
              <span className="font-mono text-[10px] text-brand-text-secondary">INDEXED DOCUMENTS</span>
              <div className="font-heading text-xl font-bold text-brand-text-primary flex items-center justify-between">
                <span>1,204</span>
                <FileText className="h-4 w-4 text-brand-primary" />
              </div>
              <span className="font-mono text-[9px] text-brand-success">99.8% PARSED OK</span>
            </div>

            <div className="bg-brand-bg border border-brand-border rounded-xl p-4 space-y-1">
              <span className="font-mono text-[10px] text-brand-text-secondary">MACHINERY ASSETS</span>
              <div className="font-heading text-xl font-bold text-brand-text-primary flex items-center justify-between">
                <span>412</span>
                <Layers className="h-4 w-4 text-brand-primary" />
              </div>
              <span className="font-mono text-[9px] text-brand-success">0 CRITICAL ALERTS</span>
            </div>

            <div className="bg-brand-bg border border-brand-border rounded-xl p-4 space-y-1">
              <span className="font-mono text-[10px] text-brand-text-secondary">KNOWLEDGE GRAPH</span>
              <div className="font-heading text-xl font-bold text-brand-text-primary flex items-center justify-between">
                <span>82,000</span>
                <Network className="h-4 w-4 text-brand-secondary" />
              </div>
              <span className="font-mono text-[9px] text-brand-primary">LATENCY: 18MS</span>
            </div>

            <div className="bg-brand-bg border border-brand-border rounded-xl p-4 space-y-1">
              <span className="font-mono text-[10px] text-brand-text-secondary">COMPLIANCE RATE</span>
              <div className="font-heading text-xl font-bold text-brand-text-primary flex items-center justify-between">
                <span>98.7%</span>
                <ShieldCheck className="h-4 w-4 text-brand-success" />
              </div>
              <span className="font-mono text-[9px] text-brand-success">OISD & FACTORY ACT</span>
            </div>
          </div>

          {/* Main Workspace Mockup Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            
            {/* Left Main View (8 Cols) */}
            <div className="lg:col-span-8 bg-brand-bg border border-brand-border rounded-2xl p-6 space-y-4">
              {activeTab === "assistant" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
                    <span className="text-brand-primary font-bold">QUERY: "Vibration troubleshooting for Turbine TB-902"</span>
                    <span className="text-brand-success text-[10px]">VERIFIED BY GEMINI 1.5 PRO</span>
                  </div>

                  <p className="font-sans text-xs text-brand-text-primary font-light leading-relaxed bg-brand-surface/40 p-4 rounded-xl border border-brand-border/60">
                    "Execute Emergency Procedure SOP-TB-902-REV4. Telemetry indicates sensor #VIB-4A spiked to 12.4 mm/s RMS due to drive shaft clearance drift."
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px]">
                    <div className="bg-brand-bg p-3 rounded-xl border border-brand-border">
                      <span className="text-brand-primary font-bold block">CITATION [PAGE 142]</span>
                      <span className="text-brand-text-secondary">OEM-Turbine-Manual-V4.pdf</span>
                    </div>
                    <div className="bg-brand-bg p-3 rounded-xl border border-brand-border">
                      <span className="text-brand-secondary font-bold block">RELATIONAL LINK</span>
                      <span className="text-brand-text-secondary">Turbine-TB-902 → Sensor-VIB-4A</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "graph" && (
                <div className="space-y-4 text-center py-6">
                  <Network className="h-12 w-12 text-brand-primary mx-auto animate-pulse" />
                  <span className="font-mono text-xs text-brand-text-primary font-bold block">
                    INTERACTIVE NEO4J KNOWLEDGE GRAPH MOCKUP
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[10px]">
                    <span className="bg-brand-primary/20 text-brand-primary px-3 py-1 rounded-full border border-brand-primary/40">Unit-4-Turbine</span>
                    <span>→</span>
                    <span className="bg-brand-secondary/20 text-brand-secondary px-3 py-1 rounded-full border border-brand-secondary/40">Bearing-B-902</span>
                    <span>→</span>
                    <span className="bg-brand-success/20 text-brand-success px-3 py-1 rounded-full border border-brand-success/40">SOP-Emergency-Trip</span>
                  </div>
                </div>
              )}

              {activeTab === "alerts" && (
                <div className="space-y-3 font-mono text-xs">
                  <span className="text-brand-warning font-bold block">REAL-TIME SCADA TELEMETRY FEED</span>
                  <div className="space-y-2 text-[10px]">
                    <div className="bg-brand-bg p-2.5 rounded-lg border border-brand-border flex justify-between">
                      <span className="text-brand-text-primary">SENSOR #VIB-4A (Turbine TB-902)</span>
                      <span className="text-brand-success">NORMAL • 3.2 mm/s</span>
                    </div>
                    <div className="bg-brand-bg p-2.5 rounded-lg border border-brand-border flex justify-between">
                      <span className="text-brand-text-primary">TEMP SENSOR #TEMP-12 (Pump A)</span>
                      <span className="text-brand-success">NORMAL • 68°C</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Telemetry Radar (4 Cols) */}
            <div className="lg:col-span-4 bg-brand-bg border border-brand-border rounded-2xl p-6 space-y-4 font-mono text-xs">
              <span className="text-brand-primary font-bold block border-b border-brand-border/60 pb-2">
                SYSTEM HEALTH RADAR
              </span>

              <div className="space-y-3 text-[10px]">
                <div className="flex justify-between items-center">
                  <span className="text-brand-text-secondary">AI REASONING ENGINE</span>
                  <span className="text-brand-success font-bold">ONLINE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-text-secondary">VECTOR DATABASE</span>
                  <span className="text-brand-success font-bold">INDEXED (82K)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-text-secondary">NEO4J GRAPH SYNC</span>
                  <span className="text-brand-success font-bold">CONNECTED</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-text-secondary">AUDIT COMPLIANCE</span>
                  <span className="text-brand-success font-bold">98.7% AUDITED</span>
                </div>
              </div>

              <a
                href="#launch"
                className="w-full flex items-center justify-center space-x-2 bg-brand-primary hover:bg-brand-primary/90 text-brand-bg font-heading font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer mt-4"
              >
                <span>Launch Full Command Center</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}
