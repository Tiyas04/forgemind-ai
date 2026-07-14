"use client";
import Link from "next/link";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";

export default function CTA() {
  return (
    <section id="launch" className="relative w-full py-32 px-4 md:px-6">
      <div className="container max-w-5xl mx-auto text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-command-card p-10 md:p-16 space-y-8 border-brand-primary/30 shadow-2xl"
        >
          
          <div className="space-y-4">
            {/* <span className="font-mono text-xs text-brand-primary uppercase tracking-widest bg-brand-primary/10 px-3.5 py-1.5 rounded-full border border-brand-primary/20">
              ET AI Hackathon 2026 • Problem Statement 8
            </span> */}

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-brand-text-primary leading-tight">
              Ready to Transform <br />
              <span className="bg-linear-to-r from-brand-primary via-brand-secondary to-brand-primary bg-clip-text text-transparent">
                Industrial Knowledge?
              </span>
            </h2>

            <p className="font-sans text-brand-text-secondary text-base max-w-xl mx-auto font-light leading-relaxed">
              Eliminate document silos, accelerate emergency SOP lookup, and empower plant engineers with precision AI intelligence.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="group flex items-center space-x-2 bg-linear-to-r from-brand-primary to-brand-secondary hover:brightness-110 active:scale-95 text-brand-bg font-heading font-bold text-sm px-8 py-4 rounded-2xl shadow-xl shadow-brand-primary/20 transition-all cursor-pointer"
            >
              <span>Launch ForgeMind</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="#metrics"
              className="flex items-center space-x-2 glass-pill hover:bg-brand-surface/80 active:scale-95 text-brand-text-primary font-heading font-medium text-sm px-7 py-4 rounded-2xl transition-all cursor-pointer"
            >
              <BookOpen className="h-4 w-4 text-brand-primary" />
              <span>View Documentation</span>
            </a>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
