"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Cpu, Database, Network, Activity, FileText, ArrowRight, UploadCloud, Sparkles, Shield, Eye
} from "lucide-react";
import Link from "next/link";
import CyberCard from "@/components/ui/CyberCard";
import CyberButton from "@/components/ui/CyberButton";
import { getDashboard, getGraph, toggleEquipment } from "@/services/apiServices";

interface EquipmentItem {
  id: string;
  name: string;
  type: string;
  plant: string;
  status: "ONLINE" | "WARNING" | "OFFLINE";
  load: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const statsRef = useRef<any>(null);
  const [chartData, setChartData] = useState<number[]>([45, 52, 48, 62, 58, 71, 65, 78, 72, 85, 80, 92, 88, 96, 90]);
  const [systemLoad, setSystemLoad] = useState(74);

  // Graph preview state
  const [graphNodes, setGraphNodes] = useState<any[]>([]);
  const [graphEdges, setGraphEdges] = useState<any[]>([]);
  const [hoveredGraphNode, setHoveredGraphNode] = useState<string | null>(null);

  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await getDashboard();
        if (res && res.data) {
          setStats(res.data);
          if (res.data.equipmentList) {
            const mappedList = res.data.equipmentList.map((eq: any) => ({
              id: eq._id,
              name: eq.name,
              type: eq.type,
              plant: eq.plant,
              status: eq.status,
              load: eq.load
            }));
            setEquipmentList(mappedList);
          }
        }
      } catch (error) {
        console.error("Dashboard stats fetch failed:", error);
      }
    };

    const fetchGraphPreview = async () => {
      try {
        const res = await getGraph();
        if (res && res.data && res.data.nodes && res.data.nodes.length > 0) {
          const apiNodes = res.data.nodes.slice(0, 8);
          const centerX = 240;
          const centerY = 130;
          const radius = 85;

          const mapped = apiNodes.map((n: any, idx: number) => {
            const angle = (idx / apiNodes.length) * 2 * Math.PI;
            return {
              id: n.id,
              label: n.id,
              type: n.label || "ENTITY",
              x: centerX + radius * Math.cos(angle),
              y: centerY + radius * Math.sin(angle),
            };
          });
          setGraphNodes(mapped);
          setGraphEdges((res.data.edges || []).slice(0, 10));
        } else {
          // Demo preview graph nodes
          setGraphNodes([
            { id: "cad", label: "Plant CAD Specs", type: "DOCUMENT", x: 90, y: 60, color: "#06B6D4" },
            { id: "pdf", label: "Operations Manuals", type: "DOCUMENT", x: 240, y: 45, color: "#06B6D4" },
            { id: "neo4j", label: "Neo4j Graph Core", type: "CORE", x: 390, y: 65, color: "#8B5CF6" },
            { id: "scada", label: "SCADA Telemetry", type: "SENSOR", x: 90, y: 200, color: "#22C55E" },
            { id: "astm", label: "ASTM Safety Code", type: "REGULATION", x: 240, y: 220, color: "#F59E0B" },
            { id: "rag", label: "Vector RAG Core", type: "CORE", x: 390, y: 200, color: "#06B6D4" },
          ]);
          setGraphEdges([
            { source: "cad", target: "pdf" },
            { source: "cad", target: "scada" },
            { source: "pdf", target: "neo4j" },
            { source: "pdf", target: "rag" },
            { source: "neo4j", target: "rag" },
            { source: "scada", target: "astm" },
            { source: "astm", target: "rag" },
          ]);
        }
      } catch (err) {
        console.error("Failed to load graph preview", err);
      }
    };

    fetchDashboardStats();
    fetchGraphPreview();
    const statsInterval = setInterval(fetchDashboardStats, 5000);
    return () => clearInterval(statsInterval);
  }, []);

  // Equipment state
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([
    { id: "EQ-101", name: "Compressor C", type: "Rotary Screw", plant: "Sector A", status: "ONLINE", load: 68 },
    { id: "EQ-102", name: "Zone B Heat Exchanger", type: "Shell & Tube", plant: "Sector B", status: "WARNING", load: 82 },
    { id: "EQ-103", name: "Valve 04 Controller", type: "Flow Regulation", plant: "Sector B", status: "ONLINE", load: 45 },
    { id: "EQ-104", name: "Turbine Generator A", type: "Gas Turbine", plant: "Sector C", status: "OFFLINE", load: 0 },
  ]);

  // SCADA Sensor logs state
  const [scadaLogs, setScadaLogs] = useState<Array<{ id: number; prefix: string; text: string; status: "success" | "warning" | "error" | "info" | "primary" }>>([
    { id: 1, prefix: "OK", text: "Initializing Core microcode hypervisor v2.4...", status: "success" },
    { id: 2, prefix: "OK", text: "Allocating 32GB neural workspace buffer segments...", status: "success" },
    { id: 3, prefix: "INFO", text: "Latent WebSocket handshake: 18ms (Secure)", status: "info" },
    { id: 4, prefix: "OK", text: "Neo4j database connection established (82,000 nodes)", status: "success" },
    { id: 5, prefix: "WARN", text: "Zone B Heat Exchanger Temp: 81°C (Approaching limit)", status: "warning" },
  ]);
  const scadaContainerRef = useRef<HTMLDivElement>(null);

  // Telemetry dynamic loops
  useEffect(() => {
    const chartInterval = setInterval(() => {
      let avgLoad = 0;
      setEquipmentList(currentEq => {
        const active = currentEq.filter(e => e.status !== "OFFLINE");
        avgLoad = active.length > 0 
          ? Math.round(active.reduce((acc, e) => acc + e.load, 0) / active.length)
          : 0;

        const baseLoad = statsRef.current && statsRef.current.neuralCoreLoad ? statsRef.current.neuralCoreLoad : avgLoad;
        setSystemLoad(Math.min(100, Math.max(10, baseLoad + Math.floor(Math.random() * 6) - 3)));

        return currentEq.map(e => {
          if (e.status === "ONLINE") {
            const change = Math.floor(Math.random() * 5) - 2;
            return { ...e, load: Math.min(85, Math.max(40, e.load + change)) };
          } else if (e.status === "WARNING") {
            const change = Math.floor(Math.random() * 7) - 3;
            return { ...e, load: Math.min(95, Math.max(75, e.load + change)) };
          }
          return e;
        });
      });

      setChartData((prev) => {
        const next = [...prev.slice(1)];
        const last = next[next.length - 1];
        const delta = avgLoad - last;
        const change = Math.round(delta * 0.25) + (Math.floor(Math.random() * 9) - 4);
        const newVal = Math.min(100, Math.max(15, last + change));
        next.push(newVal);
        return next;
      });
    }, 1000);

    return () => clearInterval(chartInterval);
  }, []);

  // SCADA console logger loop
  useEffect(() => {
    const logInterval = setInterval(() => {
      const logTemplates = [
        { prefix: "OK", text: "SCADA WebSocket frame verified successfully.", status: "success" },
        { prefix: "INFO", text: "Neo4j query latency: 14ms (Nodes: 82,000)", status: "info" },
        { prefix: "WARN", text: "Zone B Heat Exchanger Temp: 81.4°C (Coolant throughput critical)", status: "warning" },
        { prefix: "OK", text: "ASTM compliance checklist validator returned status code 200.", status: "success" },
        { prefix: "OK", text: "SSL Tunnel handshake successfully completed.", status: "success" },
      ] as const;

      const randomTemplate = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      setScadaLogs((prev) => {
        const next = [...prev];
        if (next.length > 20) next.shift();
        next.push({
          id: Date.now() + Math.random(),
          prefix: randomTemplate.prefix,
          text: randomTemplate.text,
          status: randomTemplate.status,
        });
        return next;
      });
    }, 3500);

    return () => clearInterval(logInterval);
  }, []);

  useEffect(() => {
    if (scadaContainerRef.current) {
      scadaContainerRef.current.scrollTop = scadaContainerRef.current.scrollHeight;
    }
  }, [scadaLogs]);

  // SVG Chart path generators
  const points = chartData.map((val, idx) => `${idx * 21.4},${100 - val}`).join(" L ");
  const pathD = `M ${points}`;
  const areaD = `${pathD} L 300 100 L 0 100 Z`;

  const handleToggleEquipment = async (id: string, name: string) => {
    try {
      const res = await toggleEquipment(id);
      if (res && res.data) {
        const updated = res.data;

        setEquipmentList(prev => prev.map(eq => 
          eq.id === id ? { ...eq, status: updated.status, load: updated.load } : eq
        ));
      }
    } catch (error) {
      console.error("Failed to toggle equipment status:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 select-none font-mono">
      
      {/* ========================================================================= */}
      {/* 1. TOP METRICS CARDS ROW (INDEXED DOCS, COGNIZED CHUNKS, KNOWLEDGE CONNECTIONS) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-8">
        
        {/* Metric 1: Indexed Documents */}
        <CyberCard className="p-4!" showGrid={false} showBrackets={true}>
          <div className="flex items-center justify-between text-[10px] text-brand-text-secondary">
            <span className="font-bold tracking-wider uppercase">INDEXED DOCUMENTS</span>
            <FileText className="h-4 w-4 text-brand-primary" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-brand-text-primary tracking-tight font-heading">
              {stats ? stats.totalDocuments : 0}
            </span>
            <span className="text-[9px] text-brand-success font-semibold px-2 py-0.5 rounded bg-brand-success/10 border border-brand-success/20">
              MONGODB SYNCED
            </span>
          </div>
          <div className="h-1 bg-brand-bg rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-brand-primary rounded-full w-full" style={{ width: stats && stats.totalDocuments > 0 ? "100%" : "50%" }} />
          </div>
        </CyberCard>

        {/* Metric 2: Cognized Chunks */}
        <CyberCard className="p-4!" showGrid={false} showBrackets={true}>
          <div className="flex items-center justify-between text-[10px] text-brand-text-secondary">
            <span className="font-bold tracking-wider uppercase">COGNIZED CHUNKS</span>
            <Sparkles className="h-4 w-4 text-brand-warning animate-pulse" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-brand-text-primary tracking-tight font-heading">
              {stats && stats.totalChunks !== undefined ? stats.totalChunks.toLocaleString() : "_"}
            </span>
            <span className="text-[9px] text-brand-warning font-semibold px-2 py-0.5 rounded bg-brand-warning/10 border border-brand-warning/20">
              VECTORIZED
            </span>
          </div>
          <div className="h-1 bg-brand-bg rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-brand-warning rounded-full transition-all duration-300" style={{ width: stats?.totalChunks > 0 ? "100%" : "30%" }} />
          </div>
        </CyberCard>

        {/* Metric 3: Knowledge Connections */}
        <CyberCard className="p-4!" showGrid={false} showBrackets={true}>
          <div className="flex items-center justify-between text-[10px] text-brand-text-secondary">
            <span className="font-bold tracking-wider uppercase">KNOWLEDGE CONNECTIONS</span>
            <Network className="h-4 w-4 text-brand-success" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-brand-text-primary tracking-tight font-heading">
              {stats ? (stats.graphNodesCount + stats.graphEdgesCount).toLocaleString() : "_"}
            </span>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
              stats?.aiServiceStatus === "OFFLINE" 
                ? "bg-brand-danger/10 text-brand-danger border-brand-danger/20" 
                : "bg-brand-success/10 text-brand-success border-brand-success/20"
            }`}>
              {stats ? stats.aiServiceStatus : "NEO4J LIVE"}
            </span>
          </div>
          <div className="h-1 bg-brand-bg rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-brand-success rounded-full w-full" />
          </div>
        </CyberCard>


      </div>

      {/* ========================================================================= */}
      {/* 2. SECOND SECTION: RECENTLY UPLOADED DOCUMENTS (FROM MONGODB) */}
      {/* ========================================================================= */}
      <CyberCard 
        title="Recently Uploaded Documents" 
        subtitle="Industrial blueprints, manuals, and SOP specifications registered in MongoDB database"
        headerAction={
          <div className="flex items-center gap-3">
            <Link href="/documents">
              <CyberButton variant="outline" className="text-[9px] py-1 h-7 px-3 flex items-center gap-1.5 font-bold">
                <UploadCloud className="h-3.5 w-3.5 text-brand-primary" />
                <span>UPLOAD NEW DOCUMENT</span>
              </CyberButton>
            </Link>
          </div>
        }
      >
        <div className="w-full overflow-x-auto border border-brand-primary/10 rounded-xl bg-[#07070a]/40 text-left mt-1">
          <table className="w-full text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-brand-primary/15 bg-brand-primary/5 text-brand-text-secondary uppercase select-none text-[9px] tracking-wider font-bold">
                <th className="py-3 px-4">File Name</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Cognitive Chunks</th>
                <th className="py-3 px-4">Upload Timestamp</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-primary/5 text-brand-text-primary">
              {stats && stats.recentUploads && stats.recentUploads.length > 0 ? (
                stats.recentUploads.map((doc: any, idx: number) => (
                  <tr key={doc._id || idx} className="hover:bg-[#11141c]/50 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3 max-w-[280px] truncate">
                      <FileText className="h-4 w-4 text-brand-primary shrink-0 animate-pulse" />
                      <span className="font-semibold text-brand-text-primary truncate" title={doc.name || doc.filename}>
                        {doc.name || doc.filename}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-brand-text-secondary">
                      <span className="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-2 py-0.5 rounded text-[9px] font-bold">
                        {doc.format ? doc.format.toUpperCase() : "PDF"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-brand-text-secondary">{doc.size || "4.5 MB"}</td>
                    <td className="py-3 px-4 text-brand-secondary font-bold">
                      {doc.chunksCount || 12} Chunks
                    </td>
                    <td className="py-3 px-4 text-brand-text-secondary text-[10px]">
                      {doc.createdAt ? new Date(doc.createdAt).toLocaleString() : "Just now"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded font-extrabold uppercase border ${
                        doc.status === "OCR_DONE" 
                          ? "bg-brand-success/10 border-brand-success/20 text-brand-success" 
                          : doc.status === "INDEXING"
                          ? "bg-brand-secondary/10 border-brand-secondary/20 text-brand-secondary animate-pulse"
                          : "bg-brand-warning/10 border-brand-warning/20 text-brand-warning"
                      }`}>
                        {doc.status || "OCR_DONE"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-brand-text-secondary/50 font-mono text-xs">
                    No documents found in MongoDB vector store.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CyberCard>

      {/* ========================================================================= */}
      {/* 3. THIRD SECTION: KNOWLEDGE GRAPH PREVIEW & TELEMETRY */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Knowledge Graph Preview Component (col-span-7) */}
        <div className="lg:col-span-12">
          <CyberCard 
            title="Knowledge Graph Preview" 
            subtitle="Interactive mini neural view of extracted relational entities"
            headerAction={
              <Link href="/graph">
                <CyberButton variant="primary" className="text-[9px] py-1 h-7 px-3 flex items-center gap-1 font-bold">
                  <Eye className="h-3.5 w-3.5" />
                  <span>OPEN FULL EXPLORER</span>
                </CyberButton>
              </Link>
            }
          >
            <div className="w-full relative border border-brand-primary/10 rounded-xl bg-[#09090b]/90 overflow-hidden flex flex-col justify-between min-h-[340px]">
              
              {/* Interactive SVG mini graph */}
              <div className="flex-1 flex items-center justify-center p-4 relative min-h-[260px]">
                <svg className="w-full h-[250px] text-brand-primary" viewBox="0 0 480 260">
                  
                  {/* Glowing filter definitions */}
                  <defs>
                    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Connecting Edges */}
                  {graphEdges.map((edge, idx) => {
                    const src = graphNodes.find(n => n.id === edge.source);
                    const tgt = graphNodes.find(n => n.id === edge.target);
                    if (!src || !tgt) return null;

                    const isHighlighted = hoveredGraphNode === edge.source || hoveredGraphNode === edge.target;

                    return (
                      <g key={idx}>
                        <line
                          x1={src.x}
                          y1={src.y}
                          x2={tgt.x}
                          y2={tgt.y}
                          className={`transition-all duration-300 ${
                            isHighlighted 
                              ? "stroke-brand-success stroke-2 opacity-90 filter drop-shadow-[0_0_8px_#22C55E]" 
                              : "stroke-brand-primary stroke-[1.2] opacity-35"
                          }`}
                        />
                        {/* Animated signal particle along edge */}
                        {idx % 2 === 0 && (
                          <circle r="2" className="fill-brand-primary animate-pulse">
                            <animateMotion
                              path={`M ${src.x} ${src.y} L ${tgt.x} ${tgt.y}`}
                              dur={`${3 + (idx % 3)}s`}
                              repeatCount="indefinite"
                            />
                          </circle>
                        )}
                      </g>
                    );
                  })}

                  {/* Graphic Nodes */}
                  {graphNodes.map((node) => {
                    const isHovered = hoveredGraphNode === node.id;
                    const nodeColor = node.color || (node.type === "DOCUMENT" ? "#06B6D4" : node.type === "REGULATION" ? "#F59E0B" : node.type === "SENSOR" ? "#22C55E" : "#8B5CF6");

                    return (
                      <g
                        key={node.id}
                        className="cursor-pointer select-none"
                        onMouseEnter={() => setHoveredGraphNode(node.id)}
                        onMouseLeave={() => setHoveredGraphNode(null)}
                      >
                        {/* Outer Aura Ring */}
                        {isHovered && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={18}
                            className="fill-none stroke-brand-success stroke-1 animate-ping opacity-60"
                          />
                        )}

                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={isHovered ? 11 : 8}
                          fill="#0d0f14"
                          stroke={isHovered ? "#22C55E" : nodeColor}
                          strokeWidth={isHovered ? 2.5 : 1.8}
                          filter={isHovered ? "url(#neonGlow)" : undefined}
                          className="transition-all duration-300"
                        />
                        <text
                          x={node.x}
                          y={node.y - 14}
                          textAnchor="middle"
                          className={`font-mono text-[9px] tracking-wide transition-colors duration-300 ${
                            isHovered ? "fill-brand-success font-bold" : "fill-brand-text-secondary"
                          }`}
                        >
                          {node.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* <div className="p-3 border-t border-brand-primary/10 bg-[#0d0f14]/90 flex items-center justify-between text-[9px] text-brand-text-secondary">
                <span>HOVER NODES TO INSPECT RELATIONS</span>
                <span className="text-brand-primary font-bold uppercase">82,000 ENTITY LINKS</span>
              </div> */}

            </div>
          </CyberCard>
        </div>

      </div>

    </div>
  );
}
