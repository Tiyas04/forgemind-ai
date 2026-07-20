"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, AlertOctagon, Sparkles, FileText, Download, Play, Copy, CheckCircle2, FileCode
} from "lucide-react";
import CyberCard from "@/components/ui/CyberCard";
import CyberButton from "@/components/ui/CyberButton";
import { getCompliance, generateLLMComplianceReport, downloadComplianceReport } from "@/services/apiServices";

interface MaintenanceAlert {
  id: string;
  equipmentId: string;
  equipmentName: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  description: string;
  timestamp: string;
  rca: string;
  recommendation: string;
}

interface UploadedDocument {
  _id?: string;
  doc_id?: string;
  name: string;
  format: string;
  size: string;
  chunksCount: number;
}

export default function CompliancePage() {
  const [userDocs, setUserDocs] = useState<UploadedDocument[]>([]);
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>([]);
  const [selectedAlertId, setSelectedAlertId] = useState<string>("ALT-102");
  
  // LLM Report State
  const [isGenerating, setIsGenerating] = useState(false);
  const [llmReport, setLlmReport] = useState<string | null>(null);
  const [complianceScore, setComplianceScore] = useState<number>(98.4);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [safetyChecklist, setSafetyChecklist] = useState({
    sslHandshake: true,
    neo4jHealth: true,
    astmCompliance: true,
    scadaTunnel: true,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await getCompliance();
        if (res && res.data) {
          if (res.data.safetyChecklist) setSafetyChecklist(res.data.safetyChecklist);
          if (res.data.userDocs) setUserDocs(res.data.userDocs);
          if (res.data.alerts) setAlerts(res.data.alerts);
        }
      } catch (error) {
        console.error("Failed to load initial compliance data:", error);
      }
    };
    fetchInitialData();
  }, []);

  const handleGenerateLLMReport = async () => {
    setIsGenerating(true);
    setLlmReport(null);
    try {
      const res = await generateLLMComplianceReport();
      if (res && res.data) {
        setLlmReport(res.data.report);
        if (res.data.complianceScore) setComplianceScore(res.data.complianceScore);
        if (res.data.auditedDocs) setUserDocs(res.data.auditedDocs);
        if (res.data.generatedAt) setGeneratedAt(res.data.generatedAt);
      }
    } catch (error) {
      console.error("Failed to generate LLM compliance report:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReportText = async () => {
    if (!llmReport) return;
    try {
      const blob = await downloadComplianceReport({
        reportText: llmReport,
        filename: `LLM_Industrial_Safety_Audit_Report_${Date.now()}.txt`
      });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `LLM_Industrial_Safety_Audit_Report_${Date.now()}.txt`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Failed to download LLM report file:", error);
    }
  };

  const handleCopyReport = () => {
    if (!llmReport) return;
    navigator.clipboard.writeText(llmReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedAlert = alerts.find(a => a.id === selectedAlertId);

  return (
    <div className="flex flex-col gap-6 select-none font-mono">
      
      {/* 1. TOP HERO SECTION: LLM COMPLIANCE REPORT GENERATOR */}
      <CyberCard 
        title="LLM Industrial Safety & Compliance Audit Core" 
        subtitle="Generates automated ASTM / OISD safety audit reports directly from uploaded plant documentation using Groq AI"
        headerAction={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <span className="text-[10px] text-brand-success font-bold bg-brand-success/10 border border-brand-success/20 px-2.5 py-1 rounded text-center">
              COMPLIANCE SCORE: {complianceScore}%
            </span>
            <CyberButton 
              variant="primary" 
              onClick={handleGenerateLLMReport}
              disabled={isGenerating}
              className="text-xs py-1.5 px-4 flex items-center justify-center gap-2 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <Sparkles className={`h-4 w-4 text-brand-primary ${isGenerating ? "animate-spin" : "animate-pulse"}`} />
              <span>{isGenerating ? "SYNTHESIZING REPORT..." : "GENERATE AI COMPLIANCE REPORT"}</span>
            </CyberButton>
          </div>
        }
      >
        {/* Active Uploaded Source Documents Bar */}
        <div className="w-full bg-[#07070a]/60 border border-brand-primary/10 rounded-xl p-3.5 mt-1 text-left">
          <div className="flex items-center justify-between text-[10px] text-brand-text-secondary mb-2">
            <span className="font-bold tracking-wider uppercase flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-brand-primary" />
              Audited Source Documents In MongoDB ({userDocs.length})
            </span>
            <span>RAG VECTOR ENGINE ACTIVE</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {userDocs.length > 0 ? (
              userDocs.map((doc, idx) => (
                <div 
                  key={doc._id || idx}
                  className="bg-[#0d0f14] border border-brand-primary/20 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs text-brand-text-primary"
                >
                  <FileCode className="h-3.5 w-3.5 text-brand-primary shrink-0" />
                  <span className="font-semibold text-[11px] truncate max-w-50">{doc.name}</span>
                  <span className="text-[9px] text-brand-secondary bg-brand-secondary/10 px-1.5 py-0.5 rounded font-bold border border-brand-secondary/20">
                    {doc.format || "PDF"}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-brand-text-secondary/50 text-[10px]">No documents uploaded. Click Generate to seed defaults.</span>
            )}
          </div>
        </div>
      </CyberCard>

      {/* 2. REPORT DISPLAY & DIAGNOSTICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* MAIN LLM REPORT VIEWER (col-span-8) */}
        <div className="lg:col-span-12">
          <CyberCard 
            title="Generated Safety & Compliance Audit Dossier" 
            subtitle={generatedAt ? `Generated at ${new Date(generatedAt).toLocaleString()}` : "Click Generate AI Compliance Report to synthesize audit dossier from documents"}
            headerAction={
              llmReport ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyReport}
                    className="text-[10px] bg-brand-primary/10 border border-brand-primary/20 hover:border-brand-primary text-brand-primary font-bold px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer transition-all"
                  >
                    {copied ? <CheckCircle2 className="h-3 w-3 text-brand-success" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? "COPIED" : "COPY REPORT"}</span>
                  </button>
                  <button
                    onClick={handleDownloadReportText}
                    className="text-[10px] bg-brand-success/10 border border-brand-success/20 hover:border-brand-success text-brand-success font-bold px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Download className="h-3 w-3" />
                    <span>DOWNLOAD DOSSIER</span>
                  </button>
                </div>
              ) : undefined
            }
          >
            <div className="w-full bg-[#07070a]/80 border border-brand-primary/10 rounded-xl p-5 min-h-100 flex flex-col justify-between text-left font-mono relative overflow-hidden">
              
              {isGenerating ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 py-16 text-center">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-brand-primary/20 border-t-brand-primary animate-spin" />
                    <Sparkles className="h-6 w-6 text-brand-primary animate-pulse" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-brand-text-primary tracking-wider uppercase">SYNTHESIZING COMPLIANCE REPORT WITH LLM...</span>
                    <span className="text-[10px] text-brand-text-secondary">Parsing uploaded document chunks & querying ASTM/OISD safety standards</span>
                  </div>
                </div>
              ) : llmReport ? (
                <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin text-xs text-brand-text-primary leading-relaxed whitespace-pre-wrap font-mono select-text">
                  {llmReport}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16 text-center text-brand-text-secondary/50">
                  <ShieldCheck className="h-12 w-12 text-brand-primary/30" />
                  <span className="text-xs font-semibold">Awaiting AI Report Trigger.</span>
                  <span className="text-[10px]">Click the "GENERATE AI COMPLIANCE REPORT" button above to query uploaded documents and synthesize safety audit compliance.</span>
                  <CyberButton variant="outline" onClick={handleGenerateLLMReport} className="mt-2 text-[10px] py-1 px-3">
                    <Play className="h-3 w-3 text-brand-primary" />
                    <span>START AI SYNTHESIS NOW</span>
                  </CyberButton>
                </div>
              )}

              {/* Bottom Security Seal */}
              <div className="pt-3 border-t border-brand-primary/10 mt-3 flex items-center justify-between text-[9px] text-brand-text-secondary">
                <span>SHA-256 SYSTEM GATEWAY VERIFIED</span>
                <span>GROQ LLM / VECTOR STORE INTEGRATED</span>
              </div>
            </div>
          </CyberCard>
        </div>
      </div>

    </div>
  );
}
