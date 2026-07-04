"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Bot, Network, Wrench, ShieldCheck, BarChart3, ArrowRight, Layers, CheckCircle2 } from "lucide-react";

export default function PlatformModules() {
  const modules = [
    {
      icon: FileText,
      tag: "INGESTION & PARSING",
      title: "Document Intelligence Engine",
      description: "Automated OCR layout parsing, section chunking, metadata extraction, and multi-format ingestion for PDF manuals, DOCX SOPs, and CAD scan sheets.",
      highlights: ["Preserves Complex Layout Tables", "500-Token Vector Chunking", "Automatic Tag ID Extraction"],
    },
    {
      icon: Bot,
      tag: "CONVERSATIONAL RAG",
      title: "AI Engineering Assistant",
      description: "Natural language Q&A engine powered by Gemini 1.5 Pro. Outputs verified telemetry data cards with exact document page citations.",
      highlights: ["Sub-Second Vector Search", "Zero Hallucination Guarantee", "Interactive Telemetry Cards"],
    },
    {
      icon: Network,
      tag: "RELATIONAL GRAPH",
      title: "Knowledge Graph Engine",
      description: "Maps entity dependencies across plant machinery, sub-components, failure records, certified engineers, and OEM operation guidelines.",
      highlights: ["Neo4j Graph Database", "2-Hop Entity Linkage", "Asset Topology Visualization"],
    },
    {
      icon: Wrench,
      tag: "PREDICTIVE RCA",
      title: "Maintenance Intelligence",
      description: "Analyzes historical equipment logs to detect thermal/vibration anomaly patterns and generate automated root cause analysis reports.",
      highlights: ["Thermal & Vibration Diagnostics", "Automated RCA Generation", "Preventive Action Schedules"],
    },
    {
      icon: ShieldCheck,
      tag: "REGULATORY AUDIT",
      title: "Compliance & Safety AI",
      description: "Cross-references plant operations against Factory Act 1948, OISD safety standard guidelines, and internal SOP checklists.",
      highlights: ["Factory Act 1948 Audit Check", "OISD Fire Safety Rules", "Hydrotest Cert Tracking"],
    },
    {
      icon: BarChart3,
      tag: "EXECUTIVE ANALYTICS",
      title: "Operational Analytics Dashboard",
      description: "High-density executive command center displaying real-time compliance metrics, critical plant alerts, and equipment uptime velocity.",
      highlights: ["Real-Time SCADA Sync", "Critical Incident Radar", "Executive Uptime Reporting"],
    },
  ];

  return (
    <section id="platform" className="relative w-full py-32 px-4 md:px-6">
      <div className="container max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center space-y-4"
        >
          {/* <span className="font-mono text-xs text-brand-primary uppercase tracking-widest bg-brand-primary/10 px-3.5 py-1.5 rounded-full border border-brand-primary/20">
            System Capabilities
          </span> */}

          <h2 className="font-heading text-3xl md:text-5xl font-semibold text-brand-text-primary">
            Platform <span className="text-brand-primary">Modules</span>
          </h2>
          
          <p className="font-sans text-brand-text-secondary text-base max-w-2xl font-light">
            Enterprise AI modules designed to integrate directly into industrial CMMS and SCADA workflows.
          </p>
        </motion.div>

        {/* 2x3 Notion/Linear-Style Large Dashboard Panels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="group glass-command-card p-8 flex flex-col justify-between space-y-6 text-left border-brand-border/80 hover:border-brand-primary/50 cursor-pointer"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="p-3.5 rounded-2xl bg-brand-bg/90 border border-brand-border text-brand-primary group-hover:bg-brand-primary group-hover:text-brand-bg transition-colors shadow-lg">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-[9px] text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-full border border-brand-primary/20">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-brand-text-primary group-hover:text-brand-primary transition-colors">
                    {item.title}
                  </h3>

                  <p className="font-sans text-sm text-brand-text-secondary font-light leading-relaxed">
                    {item.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-brand-border/60">
                    {item.highlights.map((h, i) => (
                      <div key={i} className="flex items-center space-x-2 text-xs font-sans text-brand-text-primary font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 text-brand-success shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center text-xs font-mono text-brand-primary group-hover:translate-x-1 transition-transform">
                  <span>Explore module specs</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
