"use client";

import React from "react";
import { motion } from "framer-motion";
import { XCircle, CheckCircle2, FileX, Table, FileSpreadsheet, Mail, Brain, Layers, Cpu, Zap, ArrowRight } from "lucide-react";

export default function WhyForgeMind() {
  const legacyItems = [
    { label: "Fragmented PDF Binders", desc: "Thousand-page OEM manuals stored across isolated local hard drives." },
    { label: "Manual Excel Maintenance Logs", desc: "Disconnected spreadsheets requiring hours of manual searching during emergencies." },
    { label: "Paper SOP Scan Sheets", desc: "Physical binders susceptible to damage, missing pages, and version confusion." },
    { label: "Siloed Email Records", desc: "Crucial troubleshooting history buried in personal inbox threads." },
    { label: "Lost Veteran Experience", desc: "Decades of unwritten troubleshooting knowledge walking out the door upon retirement." },
  ];

  const forgemindItems = [
    { label: "Centralized Neural Brain", desc: "Unified semantic knowledge graph indexing all plant documents & assets." },
    { label: "Sub-Second Vector Search", desc: "Instant retrieval across thousands of pages with 18ms latency." },
    { label: "Digitized SOP Intelligence", desc: "Extracts layout tables, tag IDs, and exact safety compliance steps." },
    { label: "Shared Enterprise Context", desc: "Institutional knowledge indexed and accessible to every field engineer 24/7." },
    { label: "Verifiable Anti-Hallucination RAG", desc: "Every AI response cites the exact document, page number, and paragraph." },
  ];

  return (
    <section id="why" className="relative w-full py-32 px-4 md:px-6">
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
            Workflow Transformation
          </span> */}

          <h2 className="font-heading text-3xl md:text-5xl font-semibold text-brand-text-primary">
            Why <span className="text-brand-primary">ForgeMind</span>?
          </h2>
          
          <p className="font-sans text-brand-text-secondary text-base max-w-2xl font-light">
            Compare traditional industrial document lookup against ForgeMind's unified AI operational brain.
          </p>
        </motion.div>

        {/* Split Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Left: Legacy Manual Workflow */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-command-card p-8 space-y-6 border-brand-danger/30 relative"
          >
            <div className="flex items-center justify-between border-b border-brand-border/80 pb-4">
              <div className="flex items-center space-x-3">
                <XCircle className="h-6 w-6 text-brand-danger" />
                <h3 className="font-heading text-xl font-bold text-brand-text-primary">
                  Legacy Manual Workflow
                </h3>
              </div>
              <span className="font-mono text-[10px] text-brand-danger bg-brand-danger/10 px-3 py-1 rounded-full border border-brand-danger/20">
                DISCONNECTED SILOS
              </span>
            </div>

            <div className="space-y-4">
              {legacyItems.map((item, i) => (
                <div key={i} className="bg-brand-bg/60 border border-brand-border/60 rounded-xl p-4 flex items-start space-x-3">
                  <XCircle className="h-4 w-4 text-brand-danger shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading text-sm font-semibold text-brand-text-primary">{item.label}</h4>
                    <p className="font-sans text-xs text-brand-text-secondary font-light mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: ForgeMind Neural Workflow */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-command-card p-8 space-y-6 border-brand-primary/40 relative shadow-2xl shadow-brand-primary/10"
          >
            <div className="flex items-center justify-between border-b border-brand-border/80 pb-4">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="h-6 w-6 text-brand-success" />
                <h3 className="font-heading text-xl font-bold text-brand-text-primary">
                  ForgeMind Neural Workflow
                </h3>
              </div>
              <span className="font-mono text-[10px] text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full border border-brand-primary/20">
                UNIFIED AI BRAIN
              </span>
            </div>

            <div className="space-y-4">
              {forgemindItems.map((item, i) => (
                <div key={i} className="bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-4 flex items-start space-x-3">
                  <CheckCircle2 className="h-4 w-4 text-brand-success shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading text-sm font-semibold text-brand-text-primary">{item.label}</h4>
                    <p className="font-sans text-xs text-brand-text-secondary font-light mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
