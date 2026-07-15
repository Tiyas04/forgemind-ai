"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Use framer-motion values for optimal performance & zero lag
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // We want coordinates to update in local state for printing text, 
  // but use motion values for positioning to bypass react re-renders on every pixel move.
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setCoords({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.closest("button") ||
          target.closest("a") ||
          target.classList.contains("cursor-pointer") ||
          target.getAttribute("role") === "button")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", updateMouse);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updateMouse);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible, mouseX, mouseY]);

  // Spring animations for cursor delay/smoothness
  const springConfig = { stiffness: 450, damping: 30, mass: 0.2 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Slightly slower tracking for coords and text to create a radar trail feel
  const coordsSpringConfig = { stiffness: 350, damping: 35, mass: 0.3 };
  const labelX = useSpring(mouseX, coordsSpringConfig);
  const labelY = useSpring(mouseY, coordsSpringConfig);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-99999 hidden md:block overflow-hidden">
      {/* Outer Brackets HUD Reticle */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
        }}
        className="absolute w-0 h-0 flex items-center justify-center"
      >
        <motion.div
          animate={{
            width: isHovered ? 48 : 32,
            height: isHovered ? 48 : 32,
            rotate: isHovered ? 45 : 0,
            color: isHovered ? "#22C55E" : "#06B6D4",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative flex items-center justify-center"
        >
          {/* Brackets SVG */}
          <svg className="absolute inset-0 w-full h-full stroke-current fill-none" viewBox="0 0 32 32">
            {/* Top-Left */}
            <path d="M 0 6 L 0 0 L 6 0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Top-Right */}
            <path d="M 26 0 L 32 0 L 32 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Bottom-Left */}
            <path d="M 0 26 L 0 32 L 6 32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Bottom-Right */}
            <path d="M 32 26 L 32 32 L 26 32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Inner Target Circle with Micro Dot */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
        }}
        className="absolute w-0 h-0 flex items-center justify-center"
      >
        <motion.div
          animate={{
            width: isHovered ? 16 : 8,
            height: isHovered ? 16 : 8,
            color: isHovered ? "#22C55E" : "#06B6D4",
            backgroundColor: isHovered ? "rgba(34, 197, 94, 0.1)" : "rgba(6, 182, 212, 0.05)",
          }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
          className="rounded-full border border-current flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.15)]"
        >
          <motion.div 
            animate={{
              scale: isHovered ? 1.5 : 1,
              backgroundColor: isHovered ? "#22C55E" : "#06B6D4",
            }}
            className="w-1.5 h-1.5 rounded-full" 
          />
        </motion.div>
      </motion.div>

      {/* Real-time Coordinate Telemetry Overlay */}
      <motion.div
        style={{
          x: labelX,
          y: labelY,
        }}
        className="absolute w-0 h-0 flex items-center justify-center"
      >
        <motion.div
          animate={{
            x: isHovered ? 30 : 20,
            y: isHovered ? 18 : 10,
            color: isHovered ? "#22C55E" : "#94A3B8",
            opacity: isHovered ? 0.9 : 0.45,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="absolute flex flex-col font-mono text-[8px] tracking-widest text-left whitespace-nowrap leading-tight bg-[#09090b]/80 border border-brand-primary/10 p-1.5 rounded"
        >
          <div>SYS_LOC: [{coords.x}, {coords.y}]</div>
          {isHovered ? (
            <div className="text-brand-success font-bold text-[7px] flex items-center gap-1 animate-pulse mt-0.5">
              <span>●</span> LOCK_ENGAGED
            </div>
          ) : (
            <div className="text-[7px] text-brand-primary mt-0.5">TRK_SCANNING</div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
