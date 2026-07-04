"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, GitBranch, ShieldCheck, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-brand-border/60 bg-brand-bg/90 backdrop-blur-3xl py-16 text-xs text-brand-text-secondary">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
        
        {/* Main Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-linear-to-br from-brand-primary to-brand-secondary text-brand-bg shadow-md">
                <Cpu className="h-5 w-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-heading font-bold text-base text-brand-text-primary">
                  ForgeMind AI
                </span>
                <span className="font-mono text-[10px] text-brand-text-secondary uppercase tracking-widest">
                  Industrial Knowledge Intelligence
                </span>
              </div>
            </div>

            <p className="font-sans text-xs text-brand-text-secondary max-w-sm font-light leading-relaxed">
              Transforming fragmented industrial documentation into centralized AI-powered operational intelligence for field engineers.
            </p>

            <div className="inline-flex items-center space-x-2 glass-pill px-3 py-1.5 text-[10px] font-mono text-brand-success border-brand-success/30">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>All Systems Operational ● 99.98% Uptime</span>
            </div>
          </div>

          {/* Column 1: Platform Modules */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold text-brand-text-primary uppercase tracking-wider">
              Platform Modules
            </h4>
            <ul className="space-y-2 font-sans font-light">
              <li><a href="#platform" className="hover:text-brand-primary transition-colors">Document Intelligence</a></li>
              <li><a href="#platform" className="hover:text-brand-primary transition-colors">AI Assistant</a></li>
              <li><a href="#platform" className="hover:text-brand-primary transition-colors">Knowledge Graph</a></li>
              <li><a href="#platform" className="hover:text-brand-primary transition-colors">Maintenance AI</a></li>
              <li><a href="#platform" className="hover:text-brand-primary transition-colors">Compliance Audit</a></li>
            </ul>
          </div>

          {/* Column 2: Architecture & Tech */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold text-brand-text-primary uppercase tracking-wider">
              Architecture
            </h4>
            <ul className="space-y-2 font-sans font-light">
              <li><a href="#technology" className="hover:text-brand-primary transition-colors">5-Stage Pipeline</a></li>
              <li><a href="#architecture" className="hover:text-brand-primary transition-colors">Blueprint Inspector</a></li>
              <li><a href="#metrics" className="hover:text-brand-primary transition-colors">Impact Metrics</a></li>
              <li>
                <a href="https://github.com/Tiyas04/forgemind-ai" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition-colors flex items-center space-x-1">
                  <GitBranch className="h-3.5 w-3.5 text-brand-primary" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-brand-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px]">
          <div>
            © 2026 ForgeMind AI • ET AI Hackathon Problem Statement 8
          </div>
          <div className="flex items-center space-x-4">
            <span>Powered by Gemini 1.5 Pro</span>
            <span>•</span>
            <span>ChromaDB</span>
            <span>•</span>
            <span>Neo4j</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
