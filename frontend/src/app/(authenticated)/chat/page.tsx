"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Terminal, Sparkles, AlertCircle, HelpCircle } from "lucide-react";
import CyberCard from "@/components/ui/CyberCard";
import { askQuestion } from "@/services/apiServices";

interface AILog {
  query: string;
  response: string;
  confidence?: number;
  citations?: Array<{ document: string; chunk: string }>;
  suggestedQuestions?: string[];
  timestamp: string;
}

export default function ChatPage() {
  const [promptInput, setPromptInput] = useState("");
  const [aiLogs, setAiLogs] = useState<AILog[]>([
    {
      query: "Load index parameters",
      response: "Ingestion core v2.4 initialized. Ready to accept cognitive queries. 3 structural documents (Turbine Manual, Plant CAD layout, Zone B Pressure regulations) currently indexed inside vector search store.",
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  const [typingOutput, setTypingOutput] = useState("");
  const aiContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (aiContainerRef.current) {
      aiContainerRef.current.scrollTop = aiContainerRef.current.scrollHeight;
    }
  }, [aiLogs, typingOutput]);

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || aiLoading) return;

    const query = promptInput;
    setPromptInput("");
    setAiLoading(true);
    setTypingOutput("");

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const response = await fetch(`${apiBase}/chat/stream`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: query }),
      });

      if (!response.ok) {
        throw new Error("Stream response failed");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get stream reader");
      }

      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = "";
      let confidence = 0.95;
      let citations: any[] = [];
      let suggestedQuestions: string[] = [];

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          const lines = chunk.split("\n").filter(Boolean);
          for (const line of lines) {
            try {
              const parsed = JSON.parse(line);
              if (parsed.type === "meta") {
                if (parsed.confidence !== undefined) confidence = parsed.confidence;
                if (parsed.citations !== undefined) citations = parsed.citations;
              } else if (parsed.type === "content") {
                accumulatedText += parsed.delta;
                setTypingOutput(accumulatedText);
              } else if (parsed.type === "done") {
                if (parsed.suggested_questions !== undefined) suggestedQuestions = parsed.suggested_questions;
              }
            } catch (err) {
              // ignore partial line parsing errors
            }
          }
        }
      }

      setAiLoading(false);
      setAiLogs((prev) => [
        ...prev,
        {
          query,
          response: accumulatedText,
          confidence,
          citations,
          suggestedQuestions,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setTypingOutput("");
    } catch (error) {
      console.error("Chat prompt execution failed:", error);
      setAiLoading(false);
      setAiLogs((prev) => [
        ...prev,
        {
          query,
          response: "CONNECTION_FAILURE: Failed to establish session handshakes with the backend RAG reasoning core. Verify both the Node.js backend and FastAPI AI service are operating correctly.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  const presetPrompts = [
    "Is there a safety bypass active in Zone B?",
    "Show Turbine Generator A maintenance specs",
    "Identify bearing issues in Compressor C",
    "Vector embedding database config specs"
  ];

  return (
    <div className="flex flex-col gap-6 select-none font-mono text-left">
      
      <CyberCard 
        title="ForgeMind AI Prompt Engine" 
        subtitle="Conversational RAG Cognitive Search & Synthesis Hypervisor"
        headerAction={
          <div className="flex items-center gap-1.5 bg-[#11141c] px-3 py-1 rounded border border-brand-primary/10 text-[9px]">
            <Sparkles className="h-3.5 w-3.5 text-brand-primary animate-pulse" />
            <span className="text-brand-primary font-bold">RAG_PIPELINE_ACTIVE</span>
          </div>
        }
      >
        <div className="flex flex-col gap-4 min-h-[360px] sm:min-h-[500px]">
          
          {/* Main scrollable prompts window */}
          <div 
            ref={aiContainerRef}
            className="flex-1 bg-[#09090b]/80 border border-brand-primary/10 rounded-xl p-3 sm:p-4 flex flex-col text-xs leading-relaxed overflow-y-auto space-y-4 max-h-[340px] sm:max-h-[460px] scrollbar-thin"
          >
            {aiLogs.map((log, idx) => (
              <div key={idx} className="space-y-1.5 bg-[#0d0f14] p-3.5 rounded-xl border border-brand-primary/10">
                <div className="flex items-center justify-between text-brand-text-secondary text-[8px] border-b border-brand-primary/5 pb-1 select-none font-bold">
                  <span>OPERATOR_PROMPT</span>
                  <span>{log.timestamp}</span>
                </div>
                <div className="text-brand-text-primary font-bold pr-2">{log.query}</div>
                <div className="text-brand-success pt-2 flex flex-col gap-2 border-t border-brand-primary/5 mt-2 font-mono text-[10px] leading-relaxed">
                  <div className="flex items-start space-x-1.5">
                    <span className="shrink-0 text-brand-success font-extrabold">[ RAG ]</span>
                    <span className="break-all sm:break-normal">{log.response}</span>
                  </div>
                  {log.confidence !== undefined && (
                    <div className="text-[8px] text-brand-text-secondary mt-1">
                      CONFIDENCE: <span className="text-brand-primary font-bold">{(log.confidence * 100).toFixed(0)}%</span>
                    </div>
                  )}
                  {log.citations && log.citations.length > 0 && (
                    <div className="text-[8px] text-brand-text-secondary flex flex-wrap gap-1 mt-0.5">
                      <span className="font-bold uppercase">Sources:</span>
                      {log.citations.map((c, ci) => (
                        <span key={ci} className="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-1 rounded text-[7px] max-w-[180px] truncate" title={c.document}>
                          {c.document} ({c.chunk.substring(0, 8)})
                        </span>
                      ))}
                    </div>
                  )}
                  {log.suggestedQuestions && log.suggestedQuestions.length > 0 && (
                    <div className="mt-3.5 border-t border-brand-primary/5 pt-2 flex flex-col gap-1.5 text-left select-none">
                      <span className="text-[7.5px] text-brand-text-secondary uppercase tracking-widest font-extrabold select-none">Suggested Follow-ups:</span>
                      <div className="flex flex-wrap gap-2">
                        {log.suggestedQuestions.map((q, qi) => (
                          <button
                            key={qi}
                            disabled={aiLoading}
                            onClick={() => setPromptInput(q)}
                            className="bg-[#09090b]/80 border border-brand-primary/10 hover:border-brand-primary/40 text-brand-text-primary hover:text-brand-primary text-[8.5px] px-2 py-1 rounded transition-all font-mono text-left cursor-pointer"
                          >
                            &gt; {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typingOutput && (
              <div className="space-y-1.5 bg-[#0d0f14] p-3.5 rounded-xl border border-brand-primary/10 animate-pulse">
                <div className="flex items-center justify-between text-brand-text-secondary text-[8px] border-b border-brand-primary/5 pb-1 select-none">
                  <span>HYPERVISOR_SYNTHESIS</span>
                  <span>TYPING...</span>
                </div>
                <div className="text-brand-success pt-2 flex items-start space-x-1.5 mt-1 font-mono text-[10px] leading-relaxed">
                  <span className="shrink-0 text-brand-success font-extrabold animate-pulse">[ RAG ]</span>
                  <span className="break-all sm:break-normal">{typingOutput}</span>
                </div>
              </div>
            )}

            {aiLoading && !typingOutput && (
              <div className="flex items-center gap-2 text-brand-text-secondary py-1 text-[10px]">
                <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin shrink-0" />
                <span className="animate-pulse font-bold">COGNITIVE_VECTOR_SEARCH_ACTIVE...</span>
              </div>
            )}
          </div>

          {/* Quick presets row */}
          {/* <div>
            <span className="text-[9px] text-brand-text-secondary uppercase font-bold tracking-widest mb-2 flex items-center gap-1.5 select-none">
              <HelpCircle className="h-4 w-4 text-brand-primary" />
              QUICK CONSOLE TEMPLATE QUERIES
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presetPrompts.map((preset, i) => (
                <button
                  key={i}
                  disabled={aiLoading}
                  onClick={() => setPromptInput(preset)}
                  className="p-2.5 rounded-lg border border-brand-primary/10 hover:border-brand-primary/30 bg-[#0d0f14]/50 hover:bg-[#11141c]/50 text-left text-[10px] text-brand-text-primary hover:text-brand-primary transition-all font-mono truncate select-none cursor-pointer"
                >
                  &gt; {preset}
                </button>
              ))}
            </div>
          </div> */}

          {/* Input control form */}
          <form onSubmit={handlePromptSubmit} className="relative flex items-center border border-brand-primary/10 rounded-xl overflow-hidden bg-[#0d0f14]">
            <span className="pl-4 text-brand-primary shrink-0 text-xs select-none">&gt;</span>
            <input
              type="text"
              disabled={aiLoading}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Query vectorized industrial manuals..."
              className="w-full bg-[#0d0f14] text-brand-text-primary text-xs font-mono py-4.5 pl-3.5 pr-14 outline-none transition-all placeholder:text-brand-text-secondary/35 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={aiLoading || !promptInput.trim()}
              className="absolute right-3 text-brand-text-secondary hover:text-brand-primary disabled:opacity-30 disabled:hover:text-brand-text-secondary transition-colors p-2 cursor-pointer"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>

        </div>
      </CyberCard>

    </div>
  );
}
