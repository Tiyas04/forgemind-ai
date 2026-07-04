"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Terminal, CheckCircle2, FileText, Network, ShieldCheck, Zap, ArrowRight, CornerDownLeft } from "lucide-react";

export default function InteractiveDemo() {
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);

  const demoScenarios = [
    {
      id: 0,
      title: "Why did Pump A fail last month?",
      category: "Root Cause Analysis",
      latency: "18ms",
      confidence: "99.4%",
      answer: "Pump A suffered catastrophic bearing seizure caused by thermal breakdown of ISO VG 46 lubricant under sustained 84°C operating conditions.",
      citations: [
        { doc: "Pump-A-Maintenance-Log-2026.pdf", page: "Page 14", snippet: "Vibration telemetry recorded 12.4 mm/s RMS spike prior to shutdown." },
        { doc: "OEM-Bearing-Manual-V4.pdf", page: "Page 88", snippet: "Max continuous operating temperature for Stock #B-902 is 75°C." },
      ],
      graphLinks: ["Pump-A", "Bearing-B-902", "ISO-VG-46-Lubricant", "Incident-Log-#8492"],
      recommendation: "Switch to Synthetic ISO VG 68 & re-align drive shaft tolerance to ±0.02mm.",
    },
    {
      id: 1,
      title: "Find SOP for Turbine TB-902 vibration spike",
      category: "Standard Operating Procedure",
      latency: "24ms",
      confidence: "98.9%",
      answer: "Execute Immediate Emergency Procedure SOP-TB-902-REV4. Reduce load to 60% immediately and verify axial displacement telemetry.",
      citations: [
        { doc: "Turbine-TB-902-Emergency-SOP.pdf", page: "Page 142", snippet: "Axial displacement exceeding 0.45mm requires manual trip within 120 seconds." },
        { doc: "SCADA-Alarm-Register-Q1.pdf", page: "Page 6", snippet: "Sensor #VIB-4A triggered warning threshold at 14:22 UTC." },
      ],
      graphLinks: ["Turbine-TB-902", "Sensor-VIB-4A", "SOP-TB-902-REV4", "Eng-Rajesh-Kumar"],
      recommendation: "Inspect thrust bearing pad clearance and log SCADA sensor #VIB-4A calibration.",
    },
    {
      id: 2,
      title: "Check OISD safety compliance for Storage Tank 4B",
      category: "Regulatory Audit",
      latency: "32ms",
      confidence: "99.8%",
      answer: "Storage Tank 4B complies with OISD-STD-117 & Factory Act 1948. Hydrotest certification valid through November 2027.",
      citations: [
        { doc: "OISD-STD-117-Fire-Safety.pdf", page: "Page 32", snippet: "Secondary containment dike volume exceeds 110% of tank capacity." },
        { doc: "Tank-4B-Inspection-Cert-2025.pdf", page: "Page 3", snippet: "Wall thickness ultrasonic scan confirmed zero corrosion thinning." },
      ],
      graphLinks: ["Storage-Tank-4B", "OISD-STD-117", "Factory-Act-1948", "Cert-Hydrotest-2025"],
      recommendation: "Schedule routine flame arrestor visual inspection before Q3 audit.",
    },
  ];

  const currentDemo = demoScenarios[selectedDemoIndex];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setSelectedDemoIndex(0);
      setCustomPrompt("");
    }, 1000);
  };

  return (
    <section id="demo" className="relative w-full py-32 px-4 md:px-6">
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
            <Sparkles className="h-3.5 w-3.5 text-brand-primary animate-pulse" />
            <span>Interactive AI Experience</span>
          </span> */}

          <h2 className="font-heading text-3xl md:text-5xl font-semibold text-brand-text-primary">
            Experience <span className="text-brand-primary">ForgeMind Live</span>
          </h2>
          
          <p className="font-sans text-brand-text-secondary text-base max-w-2xl font-light">
            Test the industrial AI brain in real time. Click any scenario or type your own engineering query.
          </p>
        </motion.div>

        {/* Interactive Console Workspace Grid */}
        <div className="glass-command-card p-6 md:p-10 space-y-8 border-brand-primary/30 shadow-2xl relative overflow-hidden">
          
          {/* Preset Scenario Tabs */}
          <div className="space-y-3">
            <span className="font-mono text-[10px] text-brand-text-secondary uppercase tracking-wider block">
              SELECT REAL INDUSTRIAL SCENARIO:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {demoScenarios.map((demo) => {
                const isSelected = selectedDemoIndex === demo.id;
                return (
                  <button
                    key={demo.id}
                    onClick={() => setSelectedDemoIndex(demo.id)}
                    className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-between space-y-2 cursor-pointer ${
                      isSelected
                        ? "bg-brand-primary/20 border-brand-primary text-brand-text-primary shadow-lg shadow-brand-primary/20"
                        : "bg-brand-bg/60 border-brand-border/60 text-brand-text-secondary hover:border-brand-primary/40 hover:text-brand-text-primary"
                    }`}
                  >
                    <span className="font-mono text-[9px] uppercase tracking-wider text-brand-primary">
                      {demo.category}
                    </span>
                    <span className="font-heading text-xs font-bold leading-snug">
                      {demo.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Custom Prompt Bar */}
          <form onSubmit={handleCustomSubmit} className="relative">
            <div className="bg-brand-bg border border-brand-border/80 rounded-xl p-3 md:p-4 flex items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center space-x-3 w-full">
                <Terminal className="h-5 w-5 text-brand-primary shrink-0" />
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Type any custom industrial question (e.g. 'What is the pressure limit for Valve 4A?')..."
                  className="w-full bg-transparent border-none text-xs md:text-sm font-mono text-brand-text-primary focus:outline-none placeholder-brand-text-secondary/50"
                />
              </div>
              <button
                type="submit"
                disabled={isExecuting}
                className="shrink-0 flex items-center space-x-2 bg-brand-primary hover:bg-brand-primary/90 text-brand-bg font-heading font-bold text-xs px-4 py-2.5 rounded-lg transition-all cursor-pointer"
              >
                <span>{isExecuting ? "Executing..." : "Query AI"}</span>
                <CornerDownLeft className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>

          {/* Live Output Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDemoIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-brand-bg/90 border border-brand-border/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl"
            >
              {/* Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-border/80 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-brand-primary/15 text-brand-primary border border-brand-primary/30">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-brand-primary uppercase tracking-wider">SYNTHESIZED AI RESPONSE</span>
                    <h3 className="font-heading text-base md:text-lg font-bold text-brand-text-primary">
                      {currentDemo.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-3 font-mono text-xs">
                  <span className="text-brand-success bg-brand-success/10 border border-brand-success/20 px-3 py-1 rounded-full">
                    CONFIDENCE: {currentDemo.confidence}
                  </span>
                  <span className="text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-3 py-1 rounded-full">
                    LATENCY: {currentDemo.latency}
                  </span>
                </div>
              </div>

              {/* Main AI Synthesized Answer */}
              <div className="space-y-2">
                <p className="font-sans text-sm md:text-base text-brand-text-primary font-medium leading-relaxed bg-brand-surface/40 p-4 rounded-xl border border-brand-border/60">
                  {currentDemo.answer}
                </p>
              </div>

              {/* Citations & Graph Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Citations Box */}
                <div className="space-y-3">
                  <span className="font-mono text-xs text-brand-text-secondary flex items-center space-x-1.5">
                    <FileText className="h-4 w-4 text-brand-primary" />
                    <span>VERIFIED DOCUMENT CITATIONS</span>
                  </span>
                  <div className="space-y-2">
                    {currentDemo.citations.map((cit, i) => (
                      <div key={i} className="bg-brand-bg border border-brand-border rounded-xl p-3 space-y-1">
                        <div className="flex items-center justify-between font-mono text-[10px]">
                          <span className="text-brand-primary font-bold">{cit.doc}</span>
                          <span className="text-brand-text-secondary">{cit.page}</span>
                        </div>
                        <p className="font-mono text-xs text-brand-text-secondary font-light">
                          "{cit.snippet}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Graph Links Box */}
                <div className="space-y-3">
                  <span className="font-mono text-xs text-brand-text-secondary flex items-center space-x-1.5">
                    <Network className="h-4 w-4 text-brand-secondary" />
                    <span>KNOWLEDGE GRAPH ENTITY RELATIONS</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentDemo.graphLinks.map((node, i) => (
                      <span
                        key={i}
                        className="font-mono text-xs text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/30 px-3 py-1.5 rounded-lg flex items-center space-x-1.5"
                      >
                        <Zap className="h-3 w-3" />
                        <span>{node}</span>
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-brand-border/60">
                    <span className="font-mono text-[10px] text-brand-text-secondary uppercase">ACTIONABLE RECOMMENDATION:</span>
                    <p className="font-sans text-xs text-brand-success font-medium mt-1">
                      {currentDemo.recommendation}
                    </p>
                  </div>
                </div>

              </div>

            </motion.div>
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
