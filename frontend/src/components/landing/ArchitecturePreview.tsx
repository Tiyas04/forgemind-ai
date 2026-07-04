"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileCode, Scan, Layers, Database, Cpu, LayoutDashboard, Network, CheckCircle2, Terminal, Activity, Zap } from "lucide-react";

export default function ArchitecturePreview() {
  const [selectedNode, setSelectedNode] = useState(0);

  const pipelineStages = [
    {
      id: 0,
      name: "1. Document Ingestion",
      tech: "Multer & PyPDF",
      icon: FileCode,
      latency: "42ms",
      status: "PARSED_OK",
      detail: "Multi-format file parser accepting PDF equipment manuals, DOCX SOPs, CAD scan sheets, and CSV inspection logs.",
      jsonSnippet: `{
  "document_id": "DOC-2026-TURBINE-08",
  "file_type": "PDF_MANUAL",
  "page_count": 482,
  "layout_preservation": true,
  "tables_extracted": 34
}`,
    },
    {
      id: 1,
      name: "2. OCR & Layout Analysis",
      tech: "Tesseract OCR",
      icon: Scan,
      latency: "85ms",
      status: "OCR_VERIFIED",
      detail: "Extracts tabular engineering parameters, component tag IDs (e.g. #TB-902), and spatial text positions.",
      jsonSnippet: `{
  "ocr_engine": "TESSERACT_V5",
  "tag_ids_found": ["#TB-902", "#VALVE-4A", "#PUMP-12"],
  "confidence_score": 0.994,
  "table_structure": "PRESERVED"
}`,
    },
    {
      id: 2,
      name: "3. Semantic Chunking",
      tech: "Google Embedding-004",
      icon: Layers,
      latency: "64ms",
      status: "VECTORIZED",
      detail: "Segments raw text into 500-token semantic chunks with 10% overlap and generates 768-dimensional vector embeddings.",
      jsonSnippet: `{
  "embedding_model": "text-embedding-004",
  "dimensions": 768,
  "chunk_size": 500,
  "overlap_percentage": 10
}`,
    },
    {
      id: 3,
      name: "4. Vector Store Indexing",
      tech: "ChromaDB Engine",
      icon: Database,
      latency: "18ms",
      status: "INDEXED",
      detail: "Indexes dense vector embeddings for sub-second HNSW similarity search across thousands of plant documents.",
      jsonSnippet: `{
  "vector_db": "CHROMADB_V0.5",
  "index_algorithm": "HNSW",
  "total_vectors": 82000,
  "query_latency_ms": 18
}`,
    },
    {
      id: 4,
      name: "5. Knowledge Graph Engine",
      tech: "Neo4j Graph DB",
      icon: Network,
      latency: "32ms",
      status: "GRAPH_SYNCED",
      detail: "Establishes relational links: Turbine Unit 4 → Bearing Replacement → Failure Log #902 → Certifying Engineer.",
      jsonSnippet: `{
  "graph_db": "NEO4J_ENTERPRISE",
  "relationship": "TURBINE_HAS_PART",
  "source_entity": "Turbine-Unit-4",
  "target_entity": "SOP-Bearing-Replacement"
}`,
    },
    {
      id: 5,
      name: "6. Gemini RAG Orchestrator",
      tech: "Gemini 1.5 Pro",
      icon: Cpu,
      latency: "310ms",
      status: "RAG_REASONED",
      detail: "Synthesizes engineer queries with retrieved vector-graph context windows to generate verified answers with exact page citations.",
      jsonSnippet: `{
  "model": "gemini-1.5-pro",
  "temperature": 0.1,
  "anti_hallucination_check": true,
  "citations": ["Manual_Page_142_Paragraph_3"]
}`,
    },
    {
      id: 6,
      name: "7. Command Center Dashboard",
      tech: "Next.js 15 & React Flow",
      icon: LayoutDashboard,
      latency: "12ms",
      status: "RENDERED",
      detail: "Presents context responses, interactive graph topologies, root cause analysis reports, and safety audit cards.",
      jsonSnippet: `{
  "ui_module": "COMMAND_CENTER_V2",
  "telemetry_card": "ACTIVE",
  "graph_nodes_rendered": 48,
  "response_status": "READY"
}`,
    },
  ];

  const activeStage = pipelineStages[selectedNode];
  const IconActive = activeStage.icon;

  return (
    <section id="architecture" className="relative w-full py-32 px-4 md:px-6 overflow-hidden">
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
            Interactive System Blueprint
          </span> */}

          <h2 className="font-heading text-3xl md:text-5xl font-semibold text-brand-text-primary">
            Engineering <span className="text-brand-primary">Architecture</span>
          </h2>
          
          <p className="font-sans text-brand-text-secondary text-base max-w-2xl font-light">
            Select any pipeline stage below to inspect real-time data transformations, latency metrics, and JSON payload schemas.
          </p>
        </motion.div>

        {/* Interactive Blueprint Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Stage Selector Tabs (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between font-mono text-[10px] text-brand-text-secondary px-2">
              <span>PIPELINE STAGE SELECTOR</span>
              <span>7 VERIFIED STAGES</span>
            </div>

            {pipelineStages.map((stage) => {
              const IconComp = stage.icon;
              const isSelected = selectedNode === stage.id;
              return (
                <motion.button
                  key={stage.id}
                  onClick={() => setSelectedNode(stage.id)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between text-left cursor-pointer ${
                    isSelected
                      ? "bg-brand-primary/15 border-brand-primary text-brand-text-primary shadow-xl shadow-brand-primary/20"
                      : "glass-command-card border-brand-border/60 text-brand-text-secondary hover:border-brand-primary/40 hover:text-brand-text-primary"
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div className={`p-2.5 rounded-xl border ${isSelected ? "bg-brand-primary text-brand-bg border-brand-primary" : "bg-brand-surface border-brand-border text-brand-primary"}`}>
                      <IconComp className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-heading text-sm font-bold text-brand-text-primary">{stage.name}</h4>
                      <p className="font-mono text-[10px] text-brand-text-secondary">{stage.tech}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 font-mono text-[10px]">
                    <span className="text-brand-primary">{stage.latency}</span>
                    <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-brand-primary animate-ping" : "bg-brand-border"}`} />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Right Column: Live Data & Code Payload Inspector (7 cols) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedNode}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="glass-command-card p-6 md:p-8 space-y-6 border-brand-primary/30 shadow-2xl relative overflow-hidden"
              >
                {/* Header Info */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-border/80 pb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-2xl bg-brand-primary/15 text-brand-primary border border-brand-primary/30">
                      <IconActive className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs text-brand-primary font-bold">STAGE 0{activeStage.id + 1}</span>
                        <span className="font-mono text-[10px] text-brand-success bg-brand-success/10 border border-brand-success/20 px-2.5 py-0.5 rounded-full">
                          {activeStage.status}
                        </span>
                      </div>
                      <h3 className="font-heading text-xl font-bold text-brand-text-primary">
                        {activeStage.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 font-mono text-xs bg-brand-bg/80 px-3.5 py-2 rounded-xl border border-brand-border">
                    <Zap className="h-3.5 w-3.5 text-brand-warning" />
                    <span className="text-brand-text-secondary">LATENCY:</span>
                    <span className="text-brand-primary font-bold">{activeStage.latency}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="font-sans text-sm text-brand-text-secondary font-light leading-relaxed">
                  {activeStage.detail}
                </p>

                {/* Live JSON Schema Terminal Window */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono text-[10px] text-brand-text-secondary px-1">
                    <span className="flex items-center space-x-1.5">
                      <Terminal className="h-3.5 w-3.5 text-brand-primary" />
                      <span>REAL-TIME PIPELINE PAYLOAD INSPECTOR</span>
                    </span>
                    <span className="text-brand-success flex items-center space-x-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>SCHEMA VALIDATED</span>
                    </span>
                  </div>

                  <div className="bg-brand-bg border border-brand-border rounded-xl p-4 font-mono text-xs text-brand-primary overflow-x-auto shadow-inner">
                    <pre className="text-brand-primary/90 leading-relaxed">
                      <code>{activeStage.jsonSnippet}</code>
                    </pre>
                  </div>
                </div>

                {/* Footer Benchmark */}
                <div className="flex items-center justify-between text-xs font-mono text-brand-text-secondary pt-2">
                  <span className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-brand-primary animate-pulse" />
                    <span>Pipeline Integrity: 100% Verified</span>
                  </span>
                  <span className="text-brand-primary">ET AI Hackathon 2026</span>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
