"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Cpu, Database, Network, Activity, Sliders, Terminal, 
  Send, ShieldAlert, CheckCircle2, RotateCw, Play, Shield,
  UploadCloud, FileText, Search, Trash2, AlertOctagon, Wrench,
  Power, Check, Sparkles, Filter
} from "lucide-react";
import CyberCard from "@/components/ui/CyberCard";
import CyberButton from "@/components/ui/CyberButton";
import CyberBadge from "@/components/ui/CyberBadge";
import CyberProgress from "@/components/ui/CyberProgress";

interface AILog {
  query: string;
  response: string;
  timestamp: string;
}

interface DocumentItem {
  id: string;
  name: string;
  size: string;
  format: string;
  uploadDate: string;
  status: "OCR_DONE" | "INDEXING" | "FAILED" | "PENDING";
}

interface EquipmentItem {
  id: string;
  name: string;
  type: string;
  plant: string;
  status: "ONLINE" | "WARNING" | "OFFLINE";
  load: number;
}

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

export default function DashboardPage() {
  // 1. Core telemetry states
  const [chartData, setChartData] = useState<number[]>([45, 52, 48, 62, 58, 71, 65, 78, 72, 85, 80, 92, 88, 96, 90]);
  const [cpuTemp, setCpuTemp] = useState(42);
  const [systemLoad, setSystemLoad] = useState(74);
  const [bufferMem, setBufferMem] = useState(61);

  // 2. Documents state & filter
  const [documents, setDocuments] = useState<DocumentItem[]>([
    { id: "1", name: "Turbine_Maintenance_Manual_v1.2.pdf", size: "4.8 MB", format: "PDF", uploadDate: "2026-07-14", status: "OCR_DONE" },
    { id: "2", name: "Plant_CAD_Layout_Draft_Final.png", size: "12.4 MB", format: "PNG", uploadDate: "2026-07-15", status: "OCR_DONE" },
    { id: "3", name: "ZoneB_Pressure_Regulations_2026.docx", size: "1.2 MB", format: "DOCX", uploadDate: "2026-07-15", status: "INDEXING" },
  ]);
  const [docSearchQuery, setDocSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3. Equipment state
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([
    { id: "EQ-101", name: "Compressor C", type: "Rotary Screw", plant: "Sector A", status: "ONLINE", load: 68 },
    { id: "EQ-102", name: "Zone B Heat Exchanger", type: "Shell & Tube", plant: "Sector B", status: "WARNING", load: 82 },
    { id: "EQ-103", name: "Valve 04 Controller", type: "Flow Regulation", plant: "Sector B", status: "ONLINE", load: 45 },
    { id: "EQ-104", name: "Turbine Generator A", type: "Gas Turbine", plant: "Sector C", status: "OFFLINE", load: 0 },
  ]);

  // 4. Maintenance Alerts state
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>([
    {
      id: "ALT-092",
      equipmentId: "EQ-102",
      equipmentName: "Zone B Heat Exchanger",
      severity: "HIGH",
      description: "Thermal dilation spike: coolant inlet restriction detected.",
      timestamp: "10:14:02",
      rca: "Degraded thermal efficiency due to scaling on outer shell surfaces, compounding with a temporary sensor calibration drift.",
      recommendation: "Execute visual inspection of the tube shell, flush primary coolant channels with chemical scale remover, and recalibrate coolant pressure transducers."
    },
    {
      id: "ALT-088",
      equipmentId: "EQ-101",
      equipmentName: "Compressor C",
      severity: "MEDIUM",
      description: "Vibration threshold anomaly in primary motor bearings.",
      timestamp: "09:45:11",
      rca: "Lube oil viscosity degradation coupled with slight rotor misalignment on the primary coupling shaft.",
      recommendation: "Sample lubricating oil to check for particulate metal contaminants, adjust coupling alignment tolerances, and schedule bearing lubrication flush within 24 operational hours."
    },
    {
      id: "ALT-085",
      equipmentId: "EQ-104",
      equipmentName: "Turbine Generator A",
      severity: "LOW",
      description: "Sub-optimal combustion exhaust gas temperature balance.",
      timestamp: "08:12:35",
      rca: "Minor nozzle clogging inside burner nozzle sector 4 resulting in fuel injection pressure variance.",
      recommendation: "Monitor exhaust gas differentials. Schedule turbine exhaust check during next planned outage and clean nozzle tips."
    }
  ]);
  const [selectedAlertId, setSelectedAlertId] = useState<string>("ALT-092");

  // 5. Compliance checklist toggles
  const [safetyChecklist, setSafetyChecklist] = useState({
    sslHandshake: true,
    neo4jHealth: true,
    astmCompliance: true,
    scadaTunnel: false,
  });

  // Calculate compliance score dynamically
  const checkedCount = Object.values(safetyChecklist).filter(Boolean).length;
  const complianceLevel = Number(((checkedCount / 4) * 100).toFixed(2));

  // 6. SCADA Sensor operations console state
  const [scadaLogs, setScadaLogs] = useState<Array<{ id: number; prefix: string; text: string; status: "success" | "warning" | "error" | "info" | "primary" }>>([
    { id: 1, prefix: "OK", text: "Initializing Core microcode hypervisor v2.4...", status: "success" },
    { id: 2, prefix: "OK", text: "Allocating 32GB neural workspace buffer segments...", status: "success" },
    { id: 3, prefix: "INFO", text: "Latent WebSocket handshake: 18ms (Secure)", status: "info" },
    { id: 4, prefix: "OK", text: "Neo4j database connection established (82,000 nodes)", status: "success" },
    { id: 5, prefix: "WARN", text: "Zone B Heat Exchanger Temp: 81°C (Approaching limit)", status: "warning" },
  ]);
  const scadaContainerRef = useRef<HTMLDivElement>(null);

  // 7. Interactive Neo4j Knowledge Graph state
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const nodes = [
    { id: "cad", label: "Plant CAD", x: 70, y: 40, desc: "Vectorized CAD drawings & engineering specifications" },
    { id: "pdf", label: "PDF Manuals", x: 170, y: 25, desc: "1,204 Indexed operations and OEM manuals" },
    { id: "neo4j", label: "Neo4j Graph", x: 270, y: 40, desc: "82,000 Linked relations between assets and documents" },
    { id: "scada", label: "SCADA Core", x: 70, y: 130, desc: "Real-time telemetry streams from sensor arrays" },
    { id: "astm", label: "ASTM Rules", x: 170, y: 145, desc: "National regulatory rules & OISD compliance guidelines" },
    { id: "rag", label: "Vector RAG", x: 270, y: 130, desc: "ChromaDB vector lookup and Gemini synthesis loop" },
  ];
  const edges = [
    { source: "cad", target: "pdf" },
    { source: "cad", target: "scada" },
    { source: "pdf", target: "neo4j" },
    { source: "pdf", target: "rag" },
    { source: "neo4j", target: "rag" },
    { source: "scada", target: "astm" },
    { source: "astm", target: "rag" },
  ];

  // 8. Interactive AI prompter state
  const [promptInput, setPromptInput] = useState("");
  const [aiLogs, setAiLogs] = useState<AILog[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [typingOutput, setTypingOutput] = useState("");
  const aiContainerRef = useRef<HTMLDivElement>(null);

  // Dynamic Telemetry Data & Core Parameters Simulation Loop
  useEffect(() => {
    const chartInterval = setInterval(() => {
      // Calculate overall dynamic load based on active/inactive states of equipment
      let avgLoad = 0;
      setEquipmentList(currentEq => {
        const active = currentEq.filter(e => e.status !== "OFFLINE");
        avgLoad = active.length > 0 
          ? Math.round(active.reduce((acc, e) => acc + e.load, 0) / active.length)
          : 0;

        setSystemLoad(Math.min(100, Math.max(10, avgLoad + Math.floor(Math.random() * 8) - 4)));
        setCpuTemp(Math.min(95, Math.max(30, Math.round(avgLoad * 0.7) + Math.floor(Math.random() * 5))));
        
        // Randomly fluctuate active equipment load slightly for realism
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
        // Dynamic shift towards target system load
        const delta = avgLoad - last;
        const change = Math.round(delta * 0.25) + (Math.floor(Math.random() * 9) - 4);
        const newVal = Math.min(100, Math.max(15, last + change));
        next.push(newVal);
        return next;
      });

      setBufferMem((prev) => {
        const change = Math.floor(Math.random() * 3) - 1;
        return Math.min(90, Math.max(45, prev + change));
      });
    }, 1000);

    return () => clearInterval(chartInterval);
  }, []);

  // SCADA operations console logger simulator loop
  useEffect(() => {
    const logInterval = setInterval(() => {
      const logTemplates = [
        { prefix: "OK", text: "SCADA WebSocket frame verified successfully.", status: "success" },
        { prefix: "OK", text: "ChromaDB vector embedding sync complete (1,204 files)", status: "success" },
        { prefix: "INFO", text: "Neo4j query latency: 14ms (Nodes: 82,000)", status: "info" },
        { prefix: "WARN", text: "Zone B Heat Exchanger Temp: 81.4°C (Coolant throughput critical)", status: "warning" },
        { prefix: "OK", text: "ASTM compliance checklist validator returned status code 200.", status: "success" },
        { prefix: "FAIL", text: "Zone C regulator reports packet latency spikes (Restored)", status: "error" },
        { prefix: "INFO", text: "AI neural parsing core indexed new document segment.", status: "info" },
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
    }, 3000);

    return () => clearInterval(logInterval);
  }, []);

  // Scroll to bottom helper for SCADA terminal
  useEffect(() => {
    if (scadaContainerRef.current) {
      scadaContainerRef.current.scrollTop = scadaContainerRef.current.scrollHeight;
    }
  }, [scadaLogs]);

  // Scroll to bottom helper for AI terminal
  useEffect(() => {
    if (aiContainerRef.current) {
      aiContainerRef.current.scrollTop = aiContainerRef.current.scrollHeight;
    }
  }, [aiLogs, typingOutput]);

  // SVG Chart path generators
  const points = chartData.map((val, idx) => `${idx * 21.4},${100 - val}`).join(" L ");
  const pathD = `M ${points}`;
  const areaD = `${pathD} L 300 100 L 0 100 Z`;

  // Dynamic file upload simulations
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const newDoc: DocumentItem = {
      id: String(Date.now()),
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      format: file.name.split(".").pop()?.toUpperCase() || "PDF",
      uploadDate: new Date().toISOString().substring(0, 10),
      status: "PENDING"
    };

    setDocuments((prev) => [newDoc, ...prev]);

    // Simulate system logs for uploads
    setScadaLogs(prev => [
      ...prev,
      { id: Date.now(), prefix: "INFO", text: `Queued document for indexing: "${file.name}"`, status: "info" }
    ]);

    setTimeout(() => {
      setDocuments(prev => prev.map(d => d.id === newDoc.id ? { ...d, status: "INDEXING" } : d));
      setScadaLogs(prev => [
        ...prev,
        { id: Date.now(), prefix: "OK", text: `OCR extraction starting for "${file.name}"`, status: "success" }
      ]);
    }, 2000);

    setTimeout(() => {
      setDocuments(prev => prev.map(d => d.id === newDoc.id ? { ...d, status: "OCR_DONE" } : d));
      setScadaLogs(prev => [
        ...prev,
        { id: Date.now(), prefix: "OK", text: `Vectorized mappings complete. 48 chunks saved in ChromaDB.`, status: "success" }
      ]);
    }, 5000);
  };

  const handleDeleteDoc = (id: string, name: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    setScadaLogs(prev => [
      ...prev,
      { id: Date.now(), prefix: "WARN", text: `Deleted document index: "${name}"`, status: "warning" }
    ]);
  };

  // Toggle machinery health status controls
  const handleToggleEquipment = (id: string, name: string) => {
    setEquipmentList(prev => prev.map(eq => {
      if (eq.id === id) {
        const isTurningOn = eq.status === "OFFLINE";
        const newStatus = isTurningOn ? "ONLINE" : "OFFLINE";
        
        setScadaLogs(logs => [
          ...logs,
          {
            id: Date.now(),
            prefix: isTurningOn ? "OK" : "WARN",
            text: `${name} has been switched ${isTurningOn ? "ONLINE" : "OFFLINE"}. Adjusting SCADA telemetry parameters...`,
            status: isTurningOn ? "success" : "warning"
          }
        ]);

        return {
          ...eq,
          status: newStatus,
          load: isTurningOn ? 60 : 0
        };
      }
      return eq;
    }));
  };

  // AI Prompt handler with custom index search capabilities
  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || aiLoading) return;

    const query = promptInput;
    setPromptInput("");
    setAiLoading(true);
    setTypingOutput("");

    setTimeout(() => {
      let response = "";
      const q = query.toLowerCase();

      if (q.includes("bypass") || q.includes("zone b")) {
        response = "NO_ACTIVE_BYPASS_DETECTED. Zone B pressure readings are stable at 42.1 PSI. All secondary relief valves verified compliant with ASTM D-302 standards. Reference: [ZoneB_Pressure_Regulations_2026.docx:Line 14].";
      } else if (q.includes("manual") || q.includes("turbine")) {
        response = "MANUAL_SEARCH: Turbine Generator A OEM specification requires structural vibration analysis every 90 days. Exhaust limits should not exceed 480°C under full load coefficient. Reference: [Turbine_Maintenance_Manual_v1.2.pdf:Page 4].";
      } else if (q.includes("vector") || q.includes("embedding") || q.includes("chroma")) {
        response = "VECTOR_INDEX_STATUS: Embeddings model: text-embedding-004. Dimensions: 1536. ChromaDB HNSW cosine distance configured. Total documents currently indexed: " + documents.length + ".";
      } else if (q.includes("compressor") || q.includes("bearing")) {
        response = "DIAGNOSTIC: Compressor C primary motor bearings anomalies observed. Root cause suggests lubrication oil decay. Schedule maintenance flush immediately. Reference: [ALT-088 Diagnostic Report].";
      } else {
        response = `SYNTHESIZED ANSWER: Prompt query parsed. Core cognitive graph suggests relations with active equipment (Zone B Exchanger) and indexed file "${documents[0]?.name || "manual"}". All telemetry vectors are normal. Latency: 19ms.`;
      }

      let charIdx = 0;
      let currentString = "";
      const typeTimer = setInterval(() => {
        currentString += response[charIdx];
        setTypingOutput(currentString);
        charIdx++;
        if (charIdx >= response.length) {
          clearInterval(typeTimer);
          setAiLoading(false);
          setAiLogs((prev) => [
            ...prev,
            {
              query,
              response,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
          setTypingOutput("");
        }
      }, 10);
    }, 600);
  };

  // Filtered documents list based on search queries
  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
    doc.format.toLowerCase().includes(docSearchQuery.toLowerCase())
  );

  const selectedAlert = alerts.find(a => a.id === selectedAlertId);

  return (
    <div className="flex flex-col gap-6 select-none font-mono">
      
      {/* 1. TOP METRICS CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Widget 1: System Load */}
        <CyberCard className="!p-4" showGrid={false} showBrackets={true}>
          <div className="flex items-center justify-between text-[10px] text-brand-text-secondary">
            <span>NEURAL CORE LOAD</span>
            <Activity className="h-4 w-4 text-brand-primary animate-pulse" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-brand-text-primary tracking-tight">{systemLoad}%</span>
            <span className="text-[9px] text-brand-success font-semibold">OPTIMAL</span>
          </div>
          <div className="h-1 bg-brand-bg rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-brand-primary rounded-full transition-all duration-300" style={{ width: `${systemLoad}%` }} />
          </div>
        </CyberCard>

        {/* Widget 2: RAM Buffer */}
        <CyberCard className="!p-4" showGrid={false} showBrackets={true}>
          <div className="flex items-center justify-between text-[10px] text-brand-text-secondary">
            <span>RAM WORKSPACE BUFFER</span>
            <Database className="h-4 w-4 text-brand-secondary" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-brand-text-primary tracking-tight">{bufferMem}%</span>
            <span className="text-[9px] text-brand-text-secondary">19.5 GB / 32 GB</span>
          </div>
          <div className="h-1 bg-brand-bg rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-brand-secondary rounded-full transition-all duration-300" style={{ width: `${bufferMem}%` }} />
          </div>
        </CyberCard>

        {/* Widget 3: CPU Temperature */}
        <CyberCard className="!p-4" showGrid={false} showBrackets={true}>
          <div className="flex items-center justify-between text-[10px] text-brand-text-secondary">
            <span>CORE COEF TEMP</span>
            <Cpu className="h-4 w-4 text-brand-warning" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-brand-text-primary tracking-tight">{cpuTemp}°C</span>
            <span className={`text-[9px] font-bold ${cpuTemp > 75 ? "text-brand-danger animate-pulse" : "text-brand-warning"}`}>
              {cpuTemp > 75 ? "CRITICAL" : "STABLE"}
            </span>
          </div>
          <div className="h-1 bg-brand-bg rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-brand-warning rounded-full transition-all duration-300" style={{ width: `${(cpuTemp / 95) * 100}%` }} />
          </div>
        </CyberCard>

        {/* Widget 4: Neo4j Graph Links */}
        <CyberCard className="!p-4" showGrid={false} showBrackets={true}>
          <div className="flex items-center justify-between text-[10px] text-brand-text-secondary">
            <span>KNOWLEDGE CONNECTIONS</span>
            <Network className="h-4 w-4 text-brand-success" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-brand-text-primary tracking-tight">82,000</span>
            <span className="text-[9px] text-brand-success font-semibold">SYNCED</span>
          </div>
          <div className="h-1 bg-brand-bg rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-brand-success rounded-full w-full" />
          </div>
        </CyberCard>

      </div>

      {/* 2. MAIN LAYOUT GRID (LEFT/RIGHT SPLIT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* SECTION LEFT: lg:col-span-8 */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Recent Uploads Document Panel */}
          <CyberCard 
            title="Recent Uploads & Ingestion Core" 
            subtitle="Document processing pipeline and index metadata"
            headerAction={
              <div className="flex items-center space-x-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept=".pdf,.docx,.png,.jpg,.jpeg" 
                />
                <CyberButton 
                  variant="primary" 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 text-[9px] py-1 h-7"
                >
                  <UploadCloud className="h-3 w-3" />
                  <span>UPLOAD FILE</span>
                </CyberButton>
              </div>
            }
          >
            {/* Drag & Drop File Mock Input */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-brand-primary/20 hover:border-brand-primary/50 bg-[#0d0f14]/40 hover:bg-[#11141c]/50 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group"
            >
              <UploadCloud className="h-6 w-6 text-brand-text-secondary group-hover:text-brand-primary group-hover:scale-105 transition-all mb-1.5" />
              <span className="text-[10px] text-brand-text-primary font-bold">DRAG & DROP INDUSTRIAL SCHEMATICS HERE</span>
              <span className="text-[8px] text-brand-text-secondary mt-0.5">SUPPORTED FORMATS: PDF, DOCX, PNG, JPG (MAX 25MB)</span>
            </div>

            {/* Document Search & Filter Table */}
            <div className="mt-4 flex items-center justify-between border-b border-brand-primary/10 pb-3">
              <div className="relative w-full max-w-sm flex items-center">
                <input
                  type="text"
                  placeholder="Filter active index logs..."
                  value={docSearchQuery}
                  onChange={(e) => setDocSearchQuery(e.target.value)}
                  className="w-full bg-[#0d0f14] border border-brand-primary/10 focus:border-brand-primary/45 rounded-lg py-2 pl-8 pr-3 text-[10px] outline-none text-brand-text-primary placeholder:text-brand-text-secondary/40 font-mono transition-all"
                />
                <Search className="absolute left-2.5 h-3.5 w-3.5 text-brand-text-secondary/45" />
              </div>
              <div className="text-[9px] text-brand-text-secondary flex items-center gap-1 bg-[#11141c] px-2 py-1 rounded border border-brand-primary/5">
                <Filter className="h-3 w-3 text-brand-primary" />
                <span>INDEXED: {filteredDocs.length} FILES</span>
              </div>
            </div>

            {/* Ingestion Table */}
            <div className="w-full overflow-x-auto max-h-52 overflow-y-auto scrollbar-thin mt-2 border border-brand-primary/5 rounded-lg bg-[#07070a]/25 text-left">
              <table className="w-full text-[10px] font-mono border-collapse">
                <thead>
                  <tr className="border-b border-brand-primary/15 bg-brand-primary/5 text-brand-text-secondary uppercase select-none text-[8px] tracking-wider font-bold">
                    <th className="py-2.5 px-3">File Name</th>
                    <th className="py-2.5 px-3">Format</th>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Upload Date</th>
                    <th className="py-2.5 px-3">Ingest Status</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-primary/5 text-brand-text-primary">
                  {filteredDocs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-brand-text-secondary/40 font-mono text-[9px]">
                        No matching documents recorded in the neural indexing cluster.
                      </td>
                    </tr>
                  ) : (
                    filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-[#11141c]/50 transition-colors">
                        <td className="py-2 px-3 flex items-center gap-2 max-w-[200px] truncate">
                          <FileText className="h-3.5 w-3.5 text-brand-primary shrink-0" />
                          <span className="font-semibold text-brand-text-primary truncate">{doc.name}</span>
                        </td>
                        <td className="py-2 px-3 font-semibold text-brand-text-secondary">{doc.format}</td>
                        <td className="py-2 px-3 text-brand-text-secondary">{doc.size}</td>
                        <td className="py-2 px-3 text-brand-text-secondary">{doc.uploadDate}</td>
                        <td className="py-2 px-3">
                          {doc.status === "OCR_DONE" && (
                            <span className="inline-flex items-center gap-1 text-[8px] bg-brand-success/10 border border-brand-success/20 text-brand-success px-1.5 py-0.5 rounded font-extrabold">
                              OCR_DONE
                            </span>
                          )}
                          {doc.status === "INDEXING" && (
                            <span className="inline-flex items-center gap-1 text-[8px] bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary px-1.5 py-0.5 rounded font-extrabold animate-pulse">
                              INDEXING
                            </span>
                          )}
                          {doc.status === "PENDING" && (
                            <span className="inline-flex items-center gap-1 text-[8px] bg-brand-warning/10 border border-brand-warning/20 text-brand-warning px-1.5 py-0.5 rounded font-extrabold">
                              PENDING
                            </span>
                          )}
                          {doc.status === "FAILED" && (
                            <span className="inline-flex items-center gap-1 text-[8px] bg-brand-danger/10 border border-brand-danger/20 text-brand-danger px-1.5 py-0.5 rounded font-extrabold">
                              FAILED
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button 
                            onClick={() => handleDeleteDoc(doc.id, doc.name)}
                            className="p-1 text-brand-text-secondary hover:text-brand-danger transition-colors cursor-pointer"
                            title="Delete file index"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CyberCard>

          {/* Equipment Status Overview Grid */}
          <CyberCard 
            title="Equipment Overview & Operational Control" 
            subtitle="Live plant machinery monitor status and hyperdrive loads"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {equipmentList.map((eq) => {
                const isOnline = eq.status === "ONLINE";
                const isWarning = eq.status === "WARNING";
                const isOffline = eq.status === "OFFLINE";
                
                return (
                  <div 
                    key={eq.id}
                    className={`border rounded-xl p-4 flex flex-col justify-between transition-all duration-300 ${
                      isOnline 
                        ? "bg-brand-success/5 border-brand-success/15 hover:border-brand-success/35" 
                        : isWarning 
                        ? "bg-brand-warning/5 border-brand-warning/15 hover:border-brand-warning/35 animate-pulse" 
                        : "bg-[#07070a]/40 border-brand-primary/10 opacity-70 hover:opacity-90"
                    }`}
                  >
                    <div className="flex items-start justify-between text-left">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? "bg-brand-success animate-ping" : isWarning ? "bg-brand-warning" : "bg-brand-text-secondary"}`} />
                          <span className="text-[11px] font-bold uppercase text-brand-text-primary tracking-wider font-heading">{eq.name}</span>
                        </div>
                        <span className="text-[8px] text-brand-text-secondary uppercase tracking-widest font-mono mt-0.5 block">{eq.id} • {eq.type}</span>
                      </div>
                      
                      {/* Control Switch Slider */}
                      <button
                        onClick={() => handleToggleEquipment(eq.id, eq.name)}
                        className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-300 relative cursor-pointer outline-none flex items-center ${
                          isOffline ? "bg-brand-border" : "bg-brand-primary"
                        }`}
                        title={isOffline ? "Switch ON" : "Switch OFF"}
                      >
                        <div 
                          className={`w-3 h-3 rounded-full bg-[#0d0f14] shadow-md transform transition-transform duration-300 ${
                            isOffline ? "translate-x-0" : "translate-x-4"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[9px] border-t border-brand-primary/5 pt-2">
                      <div className="flex flex-col text-left">
                        <span className="text-[8px] text-brand-text-secondary">LOCATION</span>
                        <span className="text-brand-text-primary font-bold">{eq.plant}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[8px] text-brand-text-secondary">LOAD COE</span>
                        <span className={`font-bold ${isOffline ? "text-brand-text-secondary" : isWarning ? "text-brand-warning" : "text-brand-primary"}`}>{eq.load}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CyberCard>

          {/* Analytics Telemetry & Knowledge Graph Combined Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Real-time Line Graph Telemetry */}
            <div id="telemetry">
              <CyberCard 
                title="SCADA Real-Time Operations" 
                subtitle="Fluctuations and system load signals"
                headerAction={
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                    <span className="text-[8px] text-brand-primary font-bold">LIVE</span>
                  </div>
                }
              >
                <div className="w-full h-36 mt-1.5 relative flex flex-col justify-end">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 z-0 text-[7px]">
                    <div className="w-full border-t border-brand-primary/10 text-right pr-1 pt-0.5">100%</div>
                    <div className="w-full border-t border-brand-primary/10 text-right pr-1 pt-0.5">50%</div>
                    <div className="w-full border-t border-brand-primary/10" />
                  </div>

                  <svg viewBox="0 0 300 100" className="w-full h-full relative z-10 overflow-visible" preserveAspectRatio="none">
                    <path d={areaD} className="fill-[url(#areaGrad)] stroke-none transition-all duration-300" />
                    <path d={pathD} className="fill-none stroke-brand-primary stroke-[1.5] transition-all duration-300" />
                  </svg>
                </div>

                <div className="border-t border-brand-primary/10 pt-2 mt-2 flex items-center justify-between text-[8px] text-brand-text-secondary">
                  <span>FREQ: 5.2 GHz</span>
                  <span>LOAD_CAP: {systemLoad}%</span>
                </div>
              </CyberCard>
            </div>

            {/* Interactive Neo4j Knowledge Graph */}
            <div id="graph">
              <CyberCard 
                title="Neo4j Knowledge Graph" 
                subtitle="Entity node relationships"
                headerAction={
                  <span className="text-[8px] text-brand-secondary font-bold">DYNAMIC</span>
                }
              >
                <div className="w-full h-36 relative border border-brand-primary/10 rounded-xl bg-brand-bg/50 mt-1.5 overflow-hidden flex items-center justify-center">
                  <svg className="w-full h-full text-brand-primary" viewBox="0 0 340 180">
                    {edges.map((edge, idx) => {
                      const srcNode = nodes.find(n => n.id === edge.source)!;
                      const tgtNode = nodes.find(n => n.id === edge.target)!;
                      const isHighlighted = hoveredNode === edge.source || hoveredNode === edge.target;
                      
                      return (
                        <line
                          key={idx}
                          x1={srcNode.x}
                          y1={srcNode.y}
                          x2={tgtNode.x}
                          y2={tgtNode.y}
                          className={`stroke-current transition-all duration-300 ${
                            isHighlighted 
                              ? "stroke-[1.5] text-brand-success opacity-85" 
                              : "stroke-[0.75] opacity-25 text-brand-primary"
                          }`}
                        />
                      );
                    })}

                    {nodes.map((node) => {
                      const isHovered = hoveredNode === node.id;
                      
                      return (
                        <g
                          key={node.id}
                          className="cursor-pointer select-none"
                          onMouseEnter={() => setHoveredNode(node.id)}
                          onMouseLeave={() => setHoveredNode(null)}
                        >
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={isHovered ? 7 : 5}
                            className={`fill-[#0d0f14] stroke-current transition-all duration-300 ${
                              isHovered 
                                ? "stroke-brand-success stroke-2 filter drop-shadow-[0_0_8px_#22C55E]" 
                                : "stroke-brand-primary stroke-[1.5]"
                            }`}
                          />
                          <text
                            x={node.x}
                            y={node.y - 10}
                            textAnchor="middle"
                            className={`font-mono text-[8px] transition-colors duration-300 ${
                              isHovered ? "fill-brand-success font-bold" : "fill-brand-text-secondary"
                            }`}
                          >
                            {node.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  <div className="absolute bottom-1.5 left-2 right-2 text-left">
                    <div className="bg-[#0d0f14]/90 border border-brand-primary/10 rounded px-1.5 py-1 text-[8px] text-brand-text-secondary leading-tight min-h-[30px]">
                      {hoveredNode ? (
                        <>
                          <div>ID: <span className="text-brand-success font-bold uppercase">{hoveredNode}</span></div>
                          <div className="text-brand-text-primary text-[7px] truncate">{nodes.find(n => n.id === hoveredNode)?.desc}</div>
                        </>
                      ) : (
                        <div className="text-center py-0.5 text-[7px]">Hover nodes to inspect parameter mappings</div>
                      )}
                    </div>
                  </div>
                </div>
              </CyberCard>
            </div>

          </div>
        </div>

        {/* SECTION RIGHT: lg:col-span-4 */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* Maintenance Intelligence Alerts & Diagnostics Panel */}
          <CyberCard 
            title="Maintenance Intelligence Alerts" 
            subtitle="Incident diagnostics & AI suggestions"
          >
            <div className="flex flex-col gap-3.5 mt-2">
              
              {/* Alerts List */}
              <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                {alerts.map((alert) => {
                  const isHigh = alert.severity === "HIGH";
                  const isMedium = alert.severity === "MEDIUM";
                  const isSelected = alert.id === selectedAlertId;

                  return (
                    <div 
                      key={alert.id}
                      onClick={() => setSelectedAlertId(alert.id)}
                      className={`border rounded-lg p-2.5 cursor-pointer text-left transition-all duration-300 relative ${
                        isSelected 
                          ? "bg-brand-primary/10 border-brand-primary" 
                          : "bg-[#07070a]/40 border-brand-primary/5 hover:border-brand-primary/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <AlertOctagon className={`h-3.5 w-3.5 ${isHigh ? "text-brand-danger" : isMedium ? "text-brand-warning" : "text-brand-primary"}`} />
                          <span className="text-[9px] font-bold text-brand-text-primary uppercase truncate max-w-[130px]">{alert.equipmentName}</span>
                        </div>
                        <span className={`text-[7px] font-extrabold px-1 py-0.25 rounded border ${
                          isHigh 
                            ? "bg-brand-danger/10 border-brand-danger/25 text-brand-danger animate-pulse" 
                            : isMedium 
                            ? "bg-brand-warning/10 border-brand-warning/25 text-brand-warning" 
                            : "bg-brand-primary/10 border-brand-primary/25 text-brand-primary"
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-[8px] text-brand-text-secondary truncate mt-1">{alert.description}</p>
                      <div className="text-[7px] text-brand-text-secondary mt-1.5 text-right border-t border-brand-primary/5 pt-1">
                        TS: {alert.timestamp}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic AI Diagnostic Panel (RCA) */}
              {selectedAlert && (
                <div className="bg-[#0d0f14]/80 border border-brand-primary/10 rounded-xl p-3.5 text-left flex flex-col gap-2">
                  <div className="flex items-center justify-between border-b border-brand-primary/10 pb-1.5">
                    <span className="text-[8px] text-brand-text-secondary font-bold uppercase">AI DIAGNOSTIC DETAILS</span>
                    <span className="text-[8px] text-brand-primary font-bold select-all">{selectedAlert.id}</span>
                  </div>
                  
                  <div className="text-[9px]">
                    <span className="text-brand-text-secondary uppercase font-bold block mb-0.5">Root Cause (RCA)</span>
                    <p className="text-brand-text-primary leading-normal font-sans text-[10px] pl-1.5 border-l border-brand-warning/50">
                      {selectedAlert.rca}
                    </p>
                  </div>

                  <div className="text-[9px] mt-1.5">
                    <span className="text-brand-success uppercase font-bold flex items-center gap-1 mb-0.5">
                      <Sparkles className="h-3.5 w-3.5 text-brand-success" />
                      Preventive Instructions
                    </span>
                    <p className="text-brand-text-primary leading-normal font-sans text-[10px] pl-1.5 border-l border-brand-success/50">
                      {selectedAlert.recommendation}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </CyberCard>

          {/* Safety Checklist & Circular Compliance Gauge */}
          <CyberCard 
            title="ASTM / OISD Safety Gauges" 
            subtitle="Concentric compliance parameters monitor"
          >
            <div className="flex flex-col items-center justify-center p-4 bg-brand-bg/30 border border-brand-primary/10 rounded-xl relative mt-2 grow">
              
              {/* Dynamic Concentric Dial Gauge */}
              <div className="relative w-28 h-28 flex items-center justify-center mt-1">
                <div className="absolute inset-0 rounded-full bg-brand-success/5 blur-md" />
                <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" className="stroke-brand-primary/10 fill-none stroke-2" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="42" 
                    className="stroke-brand-success fill-none stroke-2 transition-all duration-500" 
                    strokeDasharray="264"
                    style={{
                      strokeDashoffset: 264 - (264 * complianceLevel) / 100,
                      transform: "rotate(-90deg)",
                      transformOrigin: "50px 50px",
                    }}
                  />
                  <circle cx="50" cy="50" r="34" className="stroke-brand-primary/10 fill-none stroke-1" strokeDasharray="3 3" />
                </svg>
                <div className="flex flex-col items-center z-10 select-none">
                  <span className="font-heading text-sm font-extrabold text-brand-success tracking-tight transition-all duration-300">
                    {complianceLevel}%
                  </span>
                  <span className="text-[7px] text-brand-text-secondary tracking-widest font-mono uppercase mt-0.5">
                    OISD_SAFE
                  </span>
                </div>
              </div>

              {/* Checklist checkbox controls */}
              <div className="w-full flex flex-col gap-2 mt-5 text-[9px] text-left border-t border-brand-primary/5 pt-3">
                <label className="flex items-center space-x-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={safetyChecklist.sslHandshake}
                    onChange={(e) => setSafetyChecklist(prev => ({ ...prev, sslHandshake: e.target.checked }))}
                    className="rounded border-brand-primary/20 text-brand-primary focus:ring-0 focus:ring-offset-0 bg-[#0d0f14] h-3 w-3 cursor-pointer accent-brand-primary"
                  />
                  <span className="group-hover:text-brand-text-primary transition-colors">SSL_TUNNEL_ACTIVE</span>
                </label>
                
                <label className="flex items-center space-x-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={safetyChecklist.neo4jHealth}
                    onChange={(e) => setSafetyChecklist(prev => ({ ...prev, neo4jHealth: e.target.checked }))}
                    className="rounded border-brand-primary/20 text-brand-primary focus:ring-0 focus:ring-offset-0 bg-[#0d0f14] h-3 w-3 cursor-pointer accent-brand-primary"
                  />
                  <span className="group-hover:text-brand-text-primary transition-colors">NEO4J_HEALTH_SECURE</span>
                </label>
                
                <label className="flex items-center space-x-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={safetyChecklist.astmCompliance}
                    onChange={(e) => setSafetyChecklist(prev => ({ ...prev, astmCompliance: e.target.checked }))}
                    className="rounded border-brand-primary/20 text-brand-primary focus:ring-0 focus:ring-offset-0 bg-[#0d0f14] h-3 w-3 cursor-pointer accent-brand-primary"
                  />
                  <span className="group-hover:text-brand-text-primary transition-colors">ASTM_OISD_VALIDATOR</span>
                </label>
                
                <label className="flex items-center space-x-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={safetyChecklist.scadaTunnel}
                    onChange={(e) => setSafetyChecklist(prev => ({ ...prev, scadaTunnel: e.target.checked }))}
                    className="rounded border-brand-primary/20 text-brand-primary focus:ring-0 focus:ring-offset-0 bg-[#0d0f14] h-3 w-3 cursor-pointer accent-brand-primary"
                  />
                  <span className="group-hover:text-brand-text-primary transition-colors">SCADA_FIREWALL_SHIELD</span>
                </label>
              </div>

            </div>
          </CyberCard>

          {/* AI Operator Prompt Engine Card */}
          <CyberCard 
            title="ForgeMind AI Prompt Engine" 
            subtitle="SCADA & CAD RAG Cognitive Search"
            headerAction={
              <span className="text-[8px] text-brand-primary font-bold">RAG_CORE</span>
            }
          >
            <div className="w-full h-56 flex flex-col gap-2 justify-between">
              
              {/* Scrollable logs of prompt answers */}
              <div 
                ref={aiContainerRef}
                className="flex-1 bg-brand-bg/50 border border-brand-primary/10 rounded-xl p-3 flex flex-col text-[9px] leading-relaxed text-left overflow-y-auto space-y-3.5 scrollbar-thin"
              >
                {aiLogs.length === 0 && !aiLoading && !typingOutput && (
                  <div className="text-brand-text-secondary/50 font-mono text-[8px] py-4 text-center">
                    Submit prompts to parse relational data schemas.<br />
                    Try: <span className="text-brand-primary hover:underline cursor-pointer select-all font-bold">"Is there a safety bypass active in Zone B?"</span>
                  </div>
                )}

                {aiLogs.map((log, idx) => (
                  <div key={idx} className="space-y-1 bg-brand-bg/30 p-2 rounded-lg border border-brand-primary/5">
                    <div className="flex items-center justify-between text-brand-text-secondary text-[7px] border-b border-brand-primary/5 pb-1 select-none">
                      <span>USER_PROMPT</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <div className="text-brand-text-primary font-bold pr-1 break-all sm:break-normal">{log.query}</div>
                    <div className="text-brand-success pt-1.5 flex items-start space-x-1 border-t border-brand-primary/5 mt-1 font-mono leading-normal text-[8px]">
                      <span className="shrink-0 text-brand-success font-bold">[ RAG ]</span>
                      <span className="break-all sm:break-normal">{log.response}</span>
                    </div>
                  </div>
                ))}

                {typingOutput && (
                  <div className="space-y-1 bg-brand-bg/30 p-2 rounded-lg border border-brand-primary/5">
                    <div className="flex items-center justify-between text-brand-text-secondary text-[7px] border-b border-brand-primary/5 pb-1 select-none">
                      <span>SYS_LOG</span>
                      <span>TYPING...</span>
                    </div>
                    <div className="text-brand-success pt-1.5 flex items-start space-x-1 mt-1 font-mono leading-normal text-[8px]">
                      <span className="shrink-0 text-brand-success font-bold animate-pulse">[ RAG ]</span>
                      <span className="break-all sm:break-normal">{typingOutput}</span>
                    </div>
                  </div>
                )}

                {aiLoading && !typingOutput && (
                  <div className="flex items-center gap-1.5 text-brand-text-secondary py-1 text-[8px]">
                    <div className="w-3 h-3 border-2 border-brand-primary border-t-transparent rounded-full animate-spin shrink-0" />
                    <span className="animate-pulse">COGNITIVE_VECTOR_SEARCH_ACTIVE...</span>
                  </div>
                )}
              </div>

              {/* Form Input */}
              <form onSubmit={handlePromptSubmit} className="relative flex items-center">
                <input
                  type="text"
                  disabled={aiLoading}
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Query plant status manuals..."
                  className="w-full bg-[#0d0f14] text-brand-text-primary text-[10px] font-mono border border-brand-primary/20 focus:border-brand-primary focus:shadow-[0_0_10px_rgba(6,182,212,0.12)] rounded-xl py-2.5 pl-3 pr-10 outline-none transition-all duration-300 placeholder:text-brand-text-secondary/35 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={aiLoading || !promptInput.trim()}
                  className="absolute right-1 text-brand-text-secondary hover:text-brand-primary disabled:opacity-30 disabled:hover:text-brand-text-secondary transition-colors p-2 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>

            </div>
          </CyberCard>

        </div>

      </div>

      {/* 3. SCADA OPERATIONS terminal logs (full width at the bottom) */}
      <div id="scada">
        <CyberCard 
          title="SCADA Real-Time Operations Terminal Logs" 
          subtitle="Sensor log monitors and security checks log tracker"
        >
          <div className="w-full h-32 bg-brand-bg/50 border border-brand-primary/10 rounded-xl p-3 flex flex-col font-mono text-[10px] leading-relaxed overflow-hidden relative">
            <div 
              ref={scadaContainerRef}
              className="flex-1 overflow-y-auto pr-1 space-y-1.5 text-left scrollbar-thin"
            >
              {scadaLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-2 text-brand-text-secondary/95">
                  <span className={`px-1 py-0.25 rounded text-[7px] font-extrabold shrink-0 border select-none ${
                    log.status === "warning" 
                      ? "bg-brand-warning/10 border-brand-warning/20 text-brand-warning" 
                      : log.status === "error" 
                      ? "bg-brand-danger/10 border-brand-danger/20 text-brand-danger animate-pulse" 
                      : log.status === "info" 
                      ? "bg-brand-secondary/10 border-brand-secondary/20 text-brand-secondary" 
                      : "bg-brand-success/10 border-brand-success/20 text-brand-success"
                  }`}>
                    {log.prefix}
                  </span>
                  <span className="break-all sm:break-normal">{log.text}</span>
                </div>
              ))}
            </div>
          </div>
        </CyberCard>
      </div>

      {/* SVG Gradient definition wrapper */}
      <svg className="hidden">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

    </div>
  );
}
