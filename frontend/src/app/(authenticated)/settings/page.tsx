"use client";

import React, { useState } from "react";
import { Settings, Sliders, Shield, Database, Cpu, Activity } from "lucide-react";
import CyberCard from "@/components/ui/CyberCard";
import CyberButton from "@/components/ui/CyberButton";

export default function SettingsPage() {
  const [scadaInterval, setScadaInterval] = useState(3.0);
  const [ocrLanguage, setOcrLanguage] = useState("ENGLISH");
  const [ragModel, setRagModel] = useState("llama-3.3-70b");

  return (
    <div className="flex flex-col gap-6 select-none font-mono text-left">
      
      <CyberCard 
        title="ForgeMind System Settings" 
        subtitle="Configure pipeline parameter thresholds, OCR language models, and AI engine endpoints"
        headerAction={
          <span className="text-[9px] text-brand-text-secondary select-none">NODE_CONFIG</span>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-1">
          
          {/* Box 1: Ingestion & OCR Settings */}
          <div className="bg-[#11141c]/40 border border-brand-primary/10 rounded-xl p-4.5 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-brand-primary/5 pb-2.5">
              <Database className="h-4.5 w-4.5 text-brand-primary" />
              <span className="text-xs font-bold text-brand-text-primary tracking-wider uppercase">INGESTION & VECTOR DB</span>
            </div>

            {/* <div className="flex flex-col gap-1.5 text-[10px]">
              <label className="text-[8.5px] text-brand-text-secondary uppercase font-bold tracking-widest">OCR Language Target</label>
              <select 
                value={ocrLanguage} 
                onChange={(e) => setOcrLanguage(e.target.value)}
                className="bg-[#0d0f14] border border-brand-primary/10 focus:border-brand-primary text-brand-text-primary rounded-lg py-2.5 px-3 outline-none text-[10.5px] font-mono cursor-pointer"
              >
                <option value="ENGLISH">ENGLISH (Default)</option>
                <option value="GERMAN">GERMAN (Industrial Std)</option>
                <option value="SPANISH">SPANISH</option>
                <option value="HINDI">HINDI (OISD Localized)</option>
              </select>
            </div> */}

            <div className="flex flex-col gap-1.5 text-[10px] mt-2">
              <label className="text-[8.5px] text-brand-text-secondary uppercase font-bold tracking-widest">Cognitive RAG Model</label>
              <select 
                value={ragModel} 
                onChange={(e) => setRagModel(e.target.value)}
                className="bg-[#0d0f14] border border-brand-primary/10 focus:border-brand-primary text-brand-text-primary rounded-lg py-2.5 px-3 outline-none text-[10.5px] font-mono cursor-pointer"
              >
                <option value="llama-3.3-70b">Llama 3.3 70B (High-Speed Reasoning)</option>
                <option value="llama-3.2-90b">Llama 3.2 90B Vision (OCR Reasoning)</option>
                <option value="llama-3.2-11b">Llama 3.2 11B (Latency Optimized)</option>
              </select>
            </div>
          </div>

          {/* Box 2: Telemetry & Security Settings */}
          <div className="bg-[#11141c]/40 border border-brand-primary/10 rounded-xl p-4.5 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-brand-primary/5 pb-2.5">
              <Sliders className="h-4.5 w-4.5 text-brand-primary" />
              <span className="text-xs font-bold text-brand-text-primary tracking-wider uppercase">SCADA TELEMETRY MONITOR</span>
            </div>

            <div className="flex flex-col gap-2 text-[10px]">
              <div className="flex items-center justify-between">
                <label className="text-[8.5px] text-brand-text-secondary uppercase font-bold tracking-widest">Log Refresh Interval</label>
                <span className="text-brand-primary font-bold">{scadaInterval.toFixed(1)}s</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.5"
                value={scadaInterval}
                onChange={(e) => setScadaInterval(parseFloat(e.target.value))}
                className="w-full accent-brand-primary bg-[#0d0f14] h-1.5 rounded-lg border border-brand-primary/10 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[7px] text-brand-text-secondary/70">
                <span>1.0s (FAST)</span>
                <span>10.0s (SLOW)</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-[10px] mt-2 border-t border-brand-primary/5 pt-3.5">
              <span className="text-[8.5px] text-brand-text-secondary uppercase font-bold tracking-widest flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-brand-success" />
                Security Gateway Configuration
              </span>
              <div className="flex items-center justify-between text-[9px] text-brand-text-primary bg-[#0d0f14] border border-brand-primary/5 rounded-lg p-2.5 select-none">
                <span>GATEWAY_STATUS: <span className="text-brand-success font-bold">SECURE</span></span>
                <span>SSL: AES-256</span>
              </div>
            </div>
          </div>

        </div>

        {/* Action button */}
        <div className="border-t border-brand-primary/10 pt-4 mt-6 flex items-center justify-between select-none">
          <div className="flex items-center gap-1.5 text-[9px] text-brand-text-secondary">
            <Activity className="h-4 w-4 text-brand-primary" />
            <span>LAST_SYNC: JUST NOW</span>
          </div>
          <CyberButton
            onClick={() => alert("System configurations saved successfully.")}
            variant="primary"
            className="py-2 px-6 text-[10px] font-bold h-9"
          >
            SAVE CONFIGURATIONS
          </CyberButton>
        </div>
      </CyberCard>

    </div>
  );
}
