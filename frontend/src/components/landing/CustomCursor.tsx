"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
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

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-9999 hidden md:block overflow-hidden">
      {/* Outer Glowing Cyan Ring */}
      <motion.div
        animate={{
          x: mousePosition.x - (isHovered ? 24 : 16),
          y: mousePosition.y - (isHovered ? 24 : 16),
          scale: isHovered ? 1.5 : 1,
          borderColor: isHovered ? "rgba(6, 182, 212, 0.9)" : "rgba(6, 182, 212, 0.4)",
          backgroundColor: isHovered ? "rgba(6, 182, 212, 0.12)" : "rgba(6, 182, 212, 0.03)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.1 }}
        className="fixed w-8 h-8 rounded-full border border-brand-primary/50 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
      />

      {/* Inner Glowing Center Dot */}
      <motion.div
        animate={{
          x: mousePosition.x - 3,
          y: mousePosition.y - 3,
          scale: isHovered ? 2.2 : 1,
        }}
        transition={{ type: "spring", stiffness: 800, damping: 35 }}
        className="fixed w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_10px_#06B6D4]"
      />
    </div>
  );
}
