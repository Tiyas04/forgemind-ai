"use client";

import React from "react";
import { motion } from "framer-motion";

export default function MetricsSection() {
  const metrics = [
    { value: "95%", label: "Faster Search", desc: "Sub-second vector retrieval across thousand-page PDF manuals." },
    { value: "72%", label: "Reduced RCA Time", desc: "Automated root cause analysis cross-referencing past incident logs." },
    { value: "99%", label: "Knowledge Uptime", desc: "Centralized indexing ensuring veteran expertise is never lost." },
    { value: "24/7", label: "AI Copilot", desc: "Instant context-aware Q&A for active plant field technicians." },
  ];

  return (
    <section id="metrics" className="relative w-full py-32 px-4 md:px-6">
      <div className="container max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center space-y-4"
        >
          {/* <span className="font-mono text-xs text-brand-success uppercase tracking-widest bg-brand-success/10 px-3.5 py-1.5 rounded-full border border-brand-success/20">
            Proven Performance
          </span> */}

          <h2 className="font-heading text-3xl md:text-5xl font-semibold text-brand-text-primary">
            Measured <span className="text-brand-primary">Impact</span>
          </h2>
          
          <p className="font-sans text-brand-text-secondary text-base max-w-2xl font-light">
            Engineered to deliver measurable operational efficiency and downtime reduction.
          </p>
        </motion.div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass-command-card p-8 flex flex-col justify-between space-y-4 text-center items-center"
            >
              <div className="text-5xl md:text-6xl font-heading font-bold bg-linear-to-b from-[#FFFFFF] to-[#67E8F9] bg-clip-text text-transparent">
                {card.value}
              </div>

              <h3 className="font-heading text-base font-semibold text-brand-text-primary">
                {card.label}
              </h3>

              <p className="font-sans text-xs text-brand-text-secondary font-light leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
