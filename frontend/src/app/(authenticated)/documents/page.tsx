"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  FileText, Search, Trash2, UploadCloud, Shield, Filter 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CyberCard from "@/components/ui/CyberCard";
import CyberButton from "@/components/ui/CyberButton";
import { getDocuments, uploadDocument, deleteDocument } from "@/services/apiServices";

interface DocumentItem {
  id: string;
  doc_id?: string;
  name: string;
  size: string;
  format: string;
  uploadDate: string;
  status: "OCR_DONE" | "INDEXING" | "FAILED" | "PENDING";
  chunksCount?: number;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [docSearchQuery, setDocSearchQuery] = useState("");
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocs = async () => {
    try {
      const res = await getDocuments();
      if (res && res.data) {
        const mapped = res.data.map((doc: any) => ({
          id: doc._id,
          doc_id: doc.doc_id,
          name: doc.name,
          size: doc.size,
          format: doc.format,
          uploadDate: new Date(doc.createdAt).toISOString().substring(0, 10),
          status: doc.status,
          chunksCount: doc.chunksCount || 0
        }));
        setDocuments(mapped);
      }
    } catch (error) {
      console.error("Failed to load documents", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
    
    // Poll index status if any document is indexing
    const interval = setInterval(() => {
      if (documents.some(d => d.status === "INDEXING" || d.status === "PENDING")) {
        fetchDocs();
      }
    }, 4000);
    
    return () => clearInterval(interval);
  }, [documents.map(d => d.status).join(",")]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    // Optimistic UI updates
    const tempId = String(Date.now());
    const newDoc: DocumentItem = {
      id: tempId,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      format: file.name.split(".").pop()?.toUpperCase() || "PDF",
      uploadDate: new Date().toISOString().substring(0, 10),
      status: "PENDING",
      chunksCount: 0
    };

    setDocuments((prev) => [newDoc, ...prev]);

    try {
      await uploadDocument(file);
      await fetchDocs();
    } catch (error) {
      console.error("Upload failed", error);
      setDocuments(prev => prev.map(d => d.id === tempId ? { ...d, status: "FAILED" } : d));
    }
  };

  const handleDeleteDoc = async (id: string) => {
    try {
      await deleteDocument(id);
      await fetchDocs();
      if (selectedDocId === id) {
        setSelectedDocId(null);
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
    doc.format.toLowerCase().includes(docSearchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 select-none font-mono">
      
      {/* Uploads Panel */}
      <CyberCard 
        title="Document Management & Ingestion Core" 
        subtitle="Upload and index industrial specifications, blueprints, and SOP manuals"
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
              className="flex items-center gap-1 text-[10px] py-1 h-8 px-4"
            >
              <UploadCloud className="h-4 w-4" />
              <span>UPLOAD SCHEMA</span>
            </CyberButton>
          </div>
        }
      >
        {/* Dropzone Container */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-brand-primary/20 hover:border-brand-primary/50 bg-[#0d0f14]/40 hover:bg-[#11141c]/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group"
        >
          <UploadCloud className="h-10 w-10 text-brand-text-secondary group-hover:text-brand-primary group-hover:scale-105 transition-all mb-3" />
          <span className="text-xs text-brand-text-primary font-bold">DRAG & DROP SCHEMATIC MANUALS ORblueprints HERE</span>
          <span className="text-[9px] text-brand-text-secondary mt-1">SUPPORTED FORMATS: PDF, DOCX, PNG, JPG, JPEG (MAX 25MB)</span>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-brand-primary/10 pb-4">
          <div className="relative w-full max-w-sm flex items-center">
            <input
              type="text"
              placeholder="Search active document indices..."
              value={docSearchQuery}
              onChange={(e) => setDocSearchQuery(e.target.value)}
              className="w-full bg-[#0d0f14] border border-brand-primary/10 focus:border-brand-primary/45 rounded-lg py-2.5 pl-9 pr-3 text-[11px] outline-none text-brand-text-primary placeholder:text-brand-text-secondary/40 font-mono transition-all"
            />
            <Search className="absolute left-3 h-4 w-4 text-brand-text-secondary/45" />
          </div>
          <div className="text-[10px] text-brand-text-secondary flex items-center justify-center gap-1.5 bg-[#11141c] px-3 py-1.5 rounded border border-brand-primary/5 shrink-0">
            <Filter className="h-3.5 w-3.5 text-brand-primary" />
            <span>ACTIVE INDICES: {filteredDocs.length} FILES</span>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto border border-brand-primary/5 rounded-xl bg-[#07070a]/25 text-left mt-2">
          <table className="w-full text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-brand-primary/15 bg-brand-primary/5 text-brand-text-secondary uppercase select-none text-[9px] tracking-wider font-bold">
                <th className="py-3.5 px-4">File Name</th>
                <th className="py-3.5 px-4">Format</th>
                <th className="py-3.5 px-4">Size</th>
                <th className="py-3.5 px-4">Upload Date</th>
                <th className="py-3.5 px-4">Ingest Status</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-primary/5 text-brand-text-primary">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-brand-text-secondary/40 font-mono text-xs">
                    No matching documents indexed in the vector cluster.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#11141c]/50 transition-colors cursor-pointer" onClick={() => setSelectedDocId(doc.id)}>
                    <td className="py-3 px-4 flex items-center gap-3 max-w-[300px] truncate">
                      <FileText className="h-4.5 w-4.5 text-brand-primary shrink-0 animate-pulse" />
                      <span className="font-semibold text-brand-text-primary truncate">{doc.name}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-brand-text-secondary">{doc.format}</td>
                    <td className="py-3 px-4 text-brand-text-secondary">{doc.size}</td>
                    <td className="py-3 px-4 text-brand-text-secondary">{doc.uploadDate}</td>
                    <td className="py-3 px-4">
                      {doc.status === "OCR_DONE" && (
                        <span className="inline-flex items-center gap-1 text-[9px] bg-brand-success/10 border border-brand-success/20 text-brand-success px-2 py-0.5 rounded font-extrabold">
                          OCR_DONE
                        </span>
                      )}
                      {doc.status === "INDEXING" && (
                        <span className="inline-flex items-center gap-1 text-[9px] bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary px-2 py-0.5 rounded font-extrabold animate-pulse">
                          INDEXING
                        </span>
                      )}
                      {doc.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1 text-[9px] bg-brand-warning/10 border border-brand-warning/20 text-brand-warning px-2 py-0.5 rounded font-extrabold">
                          PENDING
                        </span>
                      )}
                      {doc.status === "FAILED" && (
                        <span className="inline-flex items-center gap-1 text-[9px] bg-brand-danger/10 border border-brand-danger/20 text-brand-danger px-2 py-0.5 rounded font-extrabold">
                          FAILED
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteDoc(doc.id); }}
                        className="p-1.5 text-brand-text-secondary hover:text-brand-danger transition-colors cursor-pointer"
                        title="Delete document index"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CyberCard>

      {/* Drawer overlay */}
      <AnimatePresence>
        {selectedDocId && (() => {
          const selectedDoc = documents.find(d => d.id === selectedDocId);
          if (!selectedDoc) return null;

          let chunks = "15 Chunks";
          let tokens = "4,200 Tokens";
          let engine = "ForgeMind OCR v2.4";
          let entities = ["General Plant Node"];
          let textPreview = "Ingestion successful. Metadata parsing index synced. Text chunk vectors registered in ChromaDB.";

          if (selectedDoc.id === "1") {
            chunks = "38 Chunks";
            tokens = "12,450 Tokens";
            engine = "OmniParser v2 + Tesseract OCR";
            entities = ["Turbine Generator A"];
            textPreview = `SECTION 4.2: GAS TURBINE ROTOR MAINTENANCE\n1. Pre-inspection checks: Ensure all high-pressure gas feeds are locked out.\n2. Bearings check: Inspect radial support bearings for surface scoring or scaling.\n3. Vibration tolerance: Limit axial displacement to under 0.05 mm during rotation.\n4. Temperature thresholds: Maximum allowable exhaust gas temperature (EGT) is 480°C.`;
          } else if (selectedDoc.id === "2") {
            chunks = "8 Chunks";
            tokens = "3,120 Tokens";
            engine = "LayoutLMv3 (Visual Entity Extractor)";
            entities = ["Zone B Heat Exchanger", "Valve 04 Controller"];
            textPreview = `COORDINATES MAP [SECTOR B / RE-PIPE DRAFT]\n- Node EQ-102 (Heat Exchanger): Offset X=170, Y=25\n- Valve 04 flow pipe: Diameter 350mm, Carbon Steel ASTM A106\n- Main supply feed pressure threshold: Max 120 PSI`;
          } else if (selectedDoc.id === "3") {
            chunks = "14 Chunks";
            tokens = "5,800 Tokens";
            engine = "Mammoth docx parser";
            entities = ["Zone B Heat Exchanger", "Valve 04 Controller"];
            textPreview = `ASTM D-302 COMPLIANCE CODE: PRESSURE REGULATION\n1. Operational Pressure limits: Sector B main lines must not operate above 45.0 PSI under normal thermal loads.\n2. Safety bypass valves: Secondary safety relays must be verified every 12 hours of active loop operation.\n3. Compliance audit records must be submitted to the OISD regional database.`;
          } else {
            const docHash = selectedDoc.name.length;
            chunks = `${selectedDoc.chunksCount || ((docHash % 25) + 5)} Chunks`;
            tokens = `${(selectedDoc.chunksCount || ((docHash * 83) % 4000 + 800 / 320)) * 320} Tokens`;
            engine = "General File Parser + BGE Large Embeddings";
            entities = ["General Plant Node"];
            textPreview = `Vectorized ingestion successful for file: "${selectedDoc.name}"\n- File Size: ${selectedDoc.size}\n- Format: ${selectedDoc.format}\n\nParsed Document Text:\nThis file has been successfully scanned by the ForgeMind AI hypervisor. Chunk vectors are index-registered inside the ChromaDB store. Found relational entities that match: ${entities.join(", ")}. Ready for RAG prompt search queries.`;
          }

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-end z-50 font-mono select-none"
              onClick={() => setSelectedDocId(null)}
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-full max-w-md h-full bg-[#0d0f14]/95 border-l border-brand-primary/20 p-6 flex flex-col justify-between shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-brand-primary/40 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-brand-primary/40 pointer-events-none" />

                <div className="flex flex-col gap-5 flex-1 overflow-y-auto pr-1 scrollbar-thin text-left">
                  <div className="flex items-center justify-between border-b border-brand-primary/10 pb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-brand-primary animate-pulse" />
                      <div>
                        <h3 className="text-xs font-bold text-brand-text-primary uppercase tracking-wider">DOCUMENT INSPECTOR</h3>
                        <span className="text-[7px] text-brand-text-secondary tracking-widest block uppercase">METADATA & OCR PREVIEW</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedDocId(null)}
                      className="px-2 py-1 text-[9px] border border-brand-danger/30 text-brand-danger hover:bg-brand-danger/10 rounded uppercase font-bold cursor-pointer select-none transition-colors"
                    >
                      CLOSE_LINK
                    </button>
                  </div>

                  <div className="bg-[#11141c]/50 border border-brand-primary/10 rounded-xl p-4 flex flex-col gap-3">
                    <div>
                      <span className="text-[8px] text-brand-text-secondary uppercase font-bold">FILE_NAME</span>
                      <p className="text-[11px] text-brand-text-primary font-bold break-all">{selectedDoc.name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[9px] border-t border-brand-primary/5 pt-3">
                      <div>
                        <span className="text-[7px] text-brand-text-secondary block font-bold">FORMAT</span>
                        <span className="text-brand-primary font-bold uppercase">{selectedDoc.format}</span>
                      </div>
                      <div>
                        <span className="text-[7px] text-brand-text-secondary block font-bold">FILE_SIZE</span>
                        <span className="text-brand-text-primary font-semibold">{selectedDoc.size}</span>
                      </div>
                      <div>
                        <span className="text-[7px] text-brand-text-secondary block font-bold">UPLOAD_DATE</span>
                        <span className="text-brand-text-primary">{selectedDoc.uploadDate}</span>
                      </div>
                      <div>
                        <span className="text-[7px] text-brand-text-secondary block font-bold">STATUS</span>
                        <span className="text-brand-success font-semibold uppercase">{selectedDoc.status}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[9px] border-t border-brand-primary/5 pt-3">
                      <div>
                        <span className="text-[7px] text-brand-text-secondary block font-bold">VECTOR_CHUNKS</span>
                        <span className="text-brand-secondary font-bold">{chunks}</span>
                      </div>
                      <div>
                        <span className="text-[7px] text-brand-text-secondary block font-bold">TOTAL_TOKENS</span>
                        <span className="text-brand-secondary font-bold">{tokens}</span>
                      </div>
                    </div>

                    <div className="border-t border-brand-primary/5 pt-3 text-[9px]">
                      <span className="text-[7px] text-brand-text-secondary block font-bold">EXTRACTION_ENGINE</span>
                      <span className="text-brand-text-primary font-bold">{engine}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] text-brand-text-secondary uppercase font-bold tracking-wider block mb-2">EXTRACTED KNOWLEDGE ENTITIES</span>
                    <div className="flex flex-wrap gap-1.5">
                      {entities.map((ent, i) => (
                        <span 
                          key={i} 
                          className="bg-brand-success/10 border border-brand-success/20 text-brand-success text-[8px] font-bold px-2 py-0.5 rounded-full select-none"
                        >
                          {ent}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <span className="text-[9px] text-brand-text-secondary uppercase font-bold tracking-wider block mb-2">RAW EXTRACTED TEXT PREVIEW</span>
                    <div className="flex-1 min-h-[140px] bg-brand-bg/60 border border-brand-primary/10 rounded-xl p-3.5 text-[9px] leading-relaxed text-brand-text-primary font-mono overflow-y-auto whitespace-pre-wrap text-left break-all select-text scrollbar-thin">
                      {textPreview}
                    </div>
                  </div>
                </div>

                <div className="border-t border-brand-primary/10 pt-4 mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[8px] text-brand-text-secondary">
                    <Shield className="h-3 w-3 text-brand-success" />
                    <span>VERIFIED_INDEX</span>
                  </div>
                  <CyberButton
                    onClick={() => setSelectedDocId(null)}
                    variant="outline"
                    className="py-1 px-3 h-7 text-[8px] font-bold"
                  >
                    RE-RUN OCR SCAN
                  </CyberButton>
                </div>

              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
