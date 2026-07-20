"use client";

import React, { useState, useEffect } from "react";
import { Network, HelpCircle, Activity, Search, Filter, Sparkles, Layers } from "lucide-react";
import CyberCard from "@/components/ui/CyberCard";
import { getGraph, getDashboard } from "@/services/apiServices";

export default function KnowledgeGraphPage() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const res = await getGraph();
        if (res && res.data && res.data.nodes && res.data.nodes.length > 0) {
          const apiNodes = res.data.nodes;
          const apiEdges = res.data.edges;

          const centerX = 500;
          const centerY = 290;
          const radius = 230;

          const mappedNodes = apiNodes.map((n: any, idx: number) => {
            const angle = (idx / apiNodes.length) * 2 * Math.PI;
            const category = n.label?.toUpperCase() || "ENTITY";
            let color = "#06B6D4"; // cyan
            if (category.includes("EQUIPMENT") || category.includes("MACHINE")) color = "#22C55E"; // emerald
            else if (category.includes("RULE") || category.includes("ASTM") || category.includes("POLICY")) color = "#F59E0B"; // amber
            else if (category.includes("SENSOR") || category.includes("SCADA") || category.includes("CORE")) color = "#8B5CF6"; // violet

            return {
              id: n.id,
              label: n.id,
              type: category,
              color,
              x: centerX + radius * Math.cos(angle),
              y: centerY + radius * Math.sin(angle),
              desc: `Extracted Relational Entity. Category: [${category}]. Properties: ${
                Object.entries(n.properties || {})
                  .filter(([k]) => k !== "doc_id")
                  .map(([k, v]) => `${k}=${v}`)
                  .join(", ") || "None"
              }`
            };
          });

          const mappedEdges = apiEdges.map((e: any) => ({
            source: e.source,
            target: e.target
          })).filter((e: any) =>
            mappedNodes.some((n: any) => n.id === e.source) &&
            mappedNodes.some((n: any) => n.id === e.target)
          );

          setNodes(mappedNodes);
          setEdges(mappedEdges);
        } else {
          // Large spaced out high-tech graph nodes for 1000x580 canvas
          setNodes([
            { id: "cad", label: "Plant CAD Specs", type: "DOCUMENT", color: "#06B6D4", x: 200, y: 130, desc: "Vectorized CAD drawings and structural engineering blueprints" },
            { id: "pdf", label: "Operations Manuals", type: "DOCUMENT", color: "#06B6D4", x: 500, y: 90, desc: "1,204 Indexed manuals (compressor, generator, exchanger specs)" },
            { id: "neo4j", label: "Neo4j Graph Hub", type: "CORE", color: "#8B5CF6", x: 800, y: 130, desc: "82,000 Linked relations mapping operational documents to physical sensors" },
            { id: "scada", label: "SCADA Core Logs", type: "SENSOR", color: "#22C55E", x: 200, y: 450, desc: "Real-time logs stream mapping dynamic telemetry from sensor arrays" },
            { id: "astm", label: "ASTM Regulatory Rules", type: "REGULATION", color: "#F59E0B", x: 500, y: 490, desc: "National factory regulations & OISD compliance validation checks" },
            { id: "rag", label: "Vector RAG Embeddings", type: "CORE", color: "#8B5CF6", x: 800, y: 450, desc: "ChromaDB database schema vector lookup and Llama 3 query synthesis loop" },
          ]);
          setEdges([
            { source: "cad", target: "pdf" },
            { source: "cad", target: "scada" },
            { source: "pdf", target: "neo4j" },
            { source: "pdf", target: "rag" },
            { source: "neo4j", target: "rag" },
            { source: "scada", target: "astm" },
            { source: "astm", target: "rag" },
          ]);
        }
      } catch (error) {
        console.error("Failed to load graph network", error);
      }
    };
    const fetchEquipment = async () => {
      try {
        const res = await getDashboard();
        if (res && res.data && res.data.equipmentList) {
          setEquipmentList(res.data.equipmentList);
        }
      } catch (error) {
        console.error("Failed to load equipment list on graph explorer", error);
      }
    };
    fetchGraphData();
    fetchEquipment();
  }, []);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(prev => prev === nodeId ? null : nodeId);
  };

  const handleEquipmentClick = (eq: any) => {
    const matchingNode = nodes.find(n => n.id.toLowerCase().includes(eq.name.toLowerCase().split(" ")[0]) || eq.name.toLowerCase().includes(n.id.toLowerCase()));
    if (matchingNode) {
      setSelectedNodeId(matchingNode.id);
      setHoveredNode(matchingNode.id);
      setTimeout(() => setHoveredNode(null), 2500);
    } else {
      setSearchQuery(eq.name);
    }
  };

  const filteredNodes = nodes.filter(n => {
    const matchesSearch = !searchQuery || n.label.toLowerCase().includes(searchQuery.toLowerCase()) || n.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "ALL" || n.type.includes(selectedCategory);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex flex-col gap-6 select-none font-mono">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Full-width Knowledge Graph Explorer */}
        <div className="lg:col-span-12">
          <CyberCard 
            title="Neo4j Knowledge Network Explorer" 
            subtitle="Visualizing active neural connections mapping plant documentation, regulations, and sensors"
            headerAction={
              <div className="flex items-center gap-1.5 bg-[#11141c] px-3 py-1.5 rounded border border-brand-primary/10">
                <Activity className="h-3.5 w-3.5 text-brand-success animate-pulse" />
                <span className="text-[10px] text-brand-success font-bold">GRAPH_SERVER_ONLINE</span>
              </div>
            }
          >
            <div className="w-full relative border border-brand-primary/10 rounded-xl bg-[#09090b]/90 overflow-hidden flex flex-col justify-between min-h-[460px] sm:min-h-[600px] lg:min-h-[760px]">
              
              {/* Top Search & Category Filters */}
              <div className="p-3 sm:p-4 border-b border-brand-primary/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#11141c]/50 text-left">
                <div className="relative flex-1 w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brand-text-secondary" />
                  <input
                    type="text"
                    placeholder="Search network nodes (e.g. Compressor, Generator, ASTM, RAG)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0d0f14] text-brand-text-primary text-[10px] font-mono border border-brand-primary/15 focus:border-brand-primary rounded-lg py-2 pl-9 pr-8 outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[8px] text-brand-text-secondary hover:text-brand-primary font-bold cursor-pointer"
                    >
                      CLEAR
                    </button>
                  )}
                </div>

                {/* Legend Chips */}
                <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] overflow-x-auto max-w-full pb-0.5 scrollbar-thin shrink-0">
                  {["ALL", "DOCUMENT", "SENSOR", "REGULATION", "CORE"].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md border font-bold uppercase transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-brand-primary/20 text-brand-primary border-brand-primary/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                          : "bg-[#0d0f14] text-brand-text-secondary border-brand-primary/10 hover:border-brand-primary/30"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive SVG Canvas */}
              <div className="flex-1 flex items-center justify-center p-2 sm:p-6 relative min-h-[360px] sm:min-h-[500px] lg:min-h-[600px]">
                <svg className="w-full h-[360px] sm:h-[500px] lg:h-[620px] text-brand-primary" viewBox="0 0 1000 580">
                  
                  {/* Glowing Filter Definitions */}
                  <defs>
                    <filter id="neonGlowNode" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="glowEdge" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Connection Edges */}
                  {edges.map((edge, idx) => {
                    const srcNode = nodes.find(n => n.id === edge.source);
                    const tgtNode = nodes.find(n => n.id === edge.target);
                    if (!srcNode || !tgtNode) return null;

                    const isEdgeHighlighted = 
                      hoveredNode === edge.source || hoveredNode === edge.target ||
                      selectedNodeId === edge.source || selectedNodeId === edge.target;

                    return (
                      <g key={idx}>
                        <line
                          x1={srcNode.x}
                          y1={srcNode.y}
                          x2={tgtNode.x}
                          y2={tgtNode.y}
                          filter={isEdgeHighlighted ? "url(#glowEdge)" : undefined}
                          className={`transition-all duration-300 ${
                            isEdgeHighlighted 
                              ? "stroke-brand-success stroke-[3] opacity-95" 
                              : "stroke-brand-primary stroke-[1.8] opacity-35"
                          }`}
                        />
                        {/* Animated signal pulse along edge */}
                        {idx % 2 === 0 && (
                          <circle r="3.5" className="fill-brand-primary">
                            <animateMotion
                              path={`M ${srcNode.x} ${srcNode.y} L ${tgtNode.x} ${tgtNode.y}`}
                              dur={`${3.5 + (idx % 3)}s`}
                              repeatCount="indefinite"
                            />
                          </circle>
                        )}
                      </g>
                    );
                  })}

                  {/* Graphic Nodes */}
                  {filteredNodes.map((node) => {
                    const isHovered = hoveredNode === node.id;
                    const isSelected = selectedNodeId === node.id;
                    const isMatchedBySearch = !!(searchQuery && node.label.toLowerCase().includes(searchQuery.toLowerCase()));
                    const isFocused = isHovered || isSelected || isMatchedBySearch;
                    const strokeColor = isSelected ? "#22C55E" : isMatchedBySearch ? "#F59E0B" : node.color || "#06B6D4";

                    return (
                      <g
                        key={node.id}
                        className="cursor-pointer select-none"
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        onClick={() => handleNodeClick(node.id)}
                      >
                        {/* Outer Aura Ring for Focused Nodes */}
                        {isFocused && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={34}
                            className="fill-none stroke-brand-success stroke-1 animate-ping opacity-50"
                          />
                        )}

                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={isFocused ? 18 : 13}
                          fill="#0d0f14"
                          stroke={strokeColor}
                          strokeWidth={isFocused ? 3.5 : 2.2}
                          filter={isFocused ? "url(#neonGlowNode)" : undefined}
                          className="transition-all duration-300"
                        />
                        <text
                          x={node.x}
                          y={node.y - 24}
                          textAnchor="middle"
                          className={`font-mono text-[12px] tracking-wide transition-colors duration-300 ${
                            isFocused ? "fill-brand-success font-extrabold text-sm" : "fill-brand-text-secondary font-bold"
                              }`}
                        >
                          {node.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Floating properties summary board */}
              <div className="p-4 border-t border-brand-primary/10 bg-[#0d0f14]/90 text-left">
                <div className="flex flex-col gap-1.5 min-h-[50px]">
                  {hoveredNode || selectedNodeId ? (
                    (() => {
                      const activeId = hoveredNode || selectedNodeId;
                      const nodeObj = nodes.find(n => n.id === activeId);
                      const isPinned = !!selectedNodeId && !hoveredNode;

                      const neighbors = edges
                        .filter(e => e.source === nodeObj?.id || e.target === nodeObj?.id)
                        .map(e => e.source === nodeObj?.id ? e.target : e.source);

                      return (
                        <>
                          <div className="text-[10px] text-brand-text-secondary flex items-center justify-between">
                            <div>
                              NODE_ID: <span className={isPinned ? "text-brand-success font-bold uppercase" : "text-brand-primary font-bold uppercase"}>{nodeObj?.id}</span>
                              <span className="mx-2 text-brand-primary/20">|</span>
                              CATEGORY: <span className="text-brand-text-primary uppercase font-bold">{nodeObj?.type || "ENTITY"}</span>
                            </div>
                            {isPinned && (
                              <span className="text-[7.5px] uppercase font-bold text-brand-success bg-brand-success/10 px-1.5 py-0.5 rounded border border-brand-success/20">
                                PINNED STATE (CLICK NODE TO RELEASE)
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-brand-text-primary mt-1 font-sans leading-relaxed">
                            {nodeObj?.desc}
                          </div>
                          {neighbors.length > 0 && (
                            <div className="text-[8px] text-brand-text-secondary mt-2 border-t border-brand-primary/5 pt-1.5 flex flex-wrap gap-1.5 items-center">
                              <span className="font-bold uppercase tracking-wider">Connected Relations ({neighbors.length}):</span>
                              {neighbors.map((nb, nbi) => (
                                <button
                                  key={nbi}
                                  onClick={() => setSelectedNodeId(nb)}
                                  className="bg-brand-primary/10 border border-brand-primary/25 hover:border-brand-primary text-brand-primary px-1.5 py-0.5 rounded text-[7.5px] font-mono cursor-pointer transition-all"
                                >
                                  {nb}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      );
                    })()
                  ) : (
                    <div className="text-center py-2 text-brand-text-secondary/40 text-[10px] flex items-center justify-center gap-1.5">
                      <Network className="h-4.5 w-4.5 text-brand-primary/30" />
                      Hover mouse or click node circles to pull live parameters & relational graph metadata.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </CyberCard>
        </div>

      </div>

    </div>
  );
}
