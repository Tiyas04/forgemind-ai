"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, Mail, Lock, Eye, EyeOff, ArrowLeft, 
  AlertTriangle, CheckCircle2, ShieldCheck, Activity 
} from "lucide-react";
import CustomCursor from "@/components/landing/CustomCursor";
import BackgroundCanvas3D from "@/components/landing/BackgroundCanvas3D";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // Update clock for that retro console vibe
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toISOString().replace("T", " ").substring(0, 19));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Local Validation
    if (!email) {
      setErrorMsg("AUTH_ERROR: Email field cannot be empty");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setErrorMsg("AUTH_ERROR: Invalid email format (missing '@' or '.')");
      return;
    }
    if (!password) {
      setErrorMsg("AUTH_ERROR: Password field cannot be empty");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("AUTH_ERROR: Security threshold violation. Password must be >= 6 characters");
      return;
    }
    if (isSignUp) {
      if (!confirmPassword) {
        setErrorMsg("AUTH_ERROR: Confirm password field cannot be empty");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("AUTH_ERROR: Password verification mismatch");
        return;
      }
    }

    setIsLoading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const endpoint = isSignUp ? `${apiBase}/auth/register` : `${apiBase}/auth/login`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Connection failure");
      }

      // Successful Auth Handshake
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("operatorEmail", data.email);
      
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error: any) {
      setErrorMsg(`AUTH_ERROR: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-brand-bg text-brand-text-primary selection:bg-brand-primary/30 overflow-x-hidden font-sans">
      {/* 3D Living Neural Network Background */}
      <BackgroundCanvas3D className="opacity-85 -z-10" />

      {/* Glowing Custom Cursor */}
      <CustomCursor />

      {/* Floating Back to Home Link */}
      <div className="absolute top-6 left-6 z-50">
        <button
          onClick={() => router.push("/")}
          className="group flex items-center space-x-2 text-xs font-semibold text-brand-text-secondary hover:text-brand-primary px-4 py-2.5 rounded-xl bg-brand-bg/60 border border-brand-primary/10 hover:border-brand-primary/40 backdrop-blur-md transition-all cursor-pointer shadow-lg shadow-black/30"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 text-brand-primary" />
          <span>Return to Terminal</span>
        </button>
      </div>

      {/* Main Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md bg-[#0d0f14]/90 border border-brand-primary/20 rounded-2xl p-6 md:p-8 relative flex flex-col gap-6 backdrop-blur-3xl shadow-[0_0_80px_rgba(6,182,212,0.12)] z-10 m-4 overflow-hidden"
      >
        {/* Tech Corner Accent Brackets */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-primary/50 rounded-tl-xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand-primary/50 rounded-tr-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand-primary/50 rounded-bl-xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-primary/50 rounded-br-xl pointer-events-none" />

        {/* Card Header Panel */}
        <div className="flex flex-col items-center text-center pb-4 border-b border-brand-primary/10">
          <div className="p-3 rounded-2xl bg-brand-primary/10 border border-brand-primary/30 text-brand-primary mb-3 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Cpu className="h-7 w-7 animate-pulse" />
          </div>
          <h2 className="font-heading text-lg font-bold tracking-widest text-brand-text-primary uppercase">
            {isSignUp ? "REGISTER OPERATOR NODE" : "SECURE ACCESS GATEWAY"}
          </h2>
          <p className="text-[9px] text-brand-text-secondary tracking-widest uppercase mt-1">
            {isSignUp ? "Establish new credentials for neural link v2.4" : "Authorize credential sequence for neural link v2.4"}
          </p>
        </div>

        {/* Dynamic Terminal Alert Segment */}
        <div className="bg-brand-bg/50 border border-brand-primary/10 rounded-xl p-3.5 flex flex-col gap-1 text-[10px] text-left">
          <div className="flex items-center justify-between text-brand-text-secondary">
            <span>GATEWAY_STATUS: <span className="text-brand-success font-bold">SECURE</span></span>
            <span>SHAKE: AES-256</span>
          </div>
          <div className="flex items-center justify-between text-brand-text-secondary">
            <span>SYS_TIME: <span className="text-brand-primary">{currentTime}</span></span>
            <span>PORT: 8080</span>
          </div>
          <div className="border-t border-brand-primary/10 mt-2 pt-1.5 flex items-center gap-1.5 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
            {isLoading ? (
              <span className="text-brand-primary animate-pulse">
                {isSignUp ? "PROVISIONING_OPERATOR_SIGNATURE..." : "DECRYPTING_CREDENTIALS..."}
              </span>
            ) : success ? (
              <span className="text-brand-success">
                {isSignUp ? "SIGNATURE_GRANTED. ROUTING LINK..." : "HANDSHAKE_GRANTED. CONNECTING..."}
              </span>
            ) : (
              <span className="text-brand-text-secondary animate-pulse">
                {isSignUp ? "AWAITING_REGISTRATION_SEQUENCE" : "AWAITING_AUTHORIZATION_SEQUENCE"}
              </span>
            )}
          </div>
        </div>

        {/* Error Alert Display */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start space-x-2 bg-brand-danger/10 border border-brand-danger/30 text-brand-danger rounded-xl p-3 text-[11px] font-medium"
            >
              <AlertTriangle className="h-4 w-4 shrink-0 text-brand-danger mt-0.5" />
              <span className="text-left font-mono wrap-break-word w-full">{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email Input Block */}
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] text-brand-text-secondary tracking-widest uppercase flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-brand-primary" />
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="operator@forgemind.io"
                disabled={isLoading || success}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d0f14] text-brand-text-primary text-xs font-mono border border-brand-primary/20 focus:border-brand-primary focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] rounded-xl py-3 px-4 outline-none transition-all duration-300 placeholder:text-brand-text-secondary/30 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password Input Block */}
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] text-brand-text-secondary tracking-widest uppercase flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-brand-primary" />
              PASSWORD CODE
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                disabled={isLoading || success}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0d0f14] text-brand-text-primary text-xs font-mono border border-brand-primary/20 focus:border-brand-primary focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] rounded-xl py-3 pl-4 pr-12 outline-none transition-all duration-300 placeholder:text-brand-text-secondary/30 disabled:opacity-50"
              />
              <button
                type="button"
                tabIndex={-1}
                disabled={isLoading || success}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-text-secondary hover:text-brand-primary transition-colors p-1 cursor-pointer disabled:opacity-50"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Sign Up Mode Only) */}
          <AnimatePresence initial={false}>
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="space-y-1.5 text-left pt-1">
                  <label className="text-[10px] text-brand-text-secondary tracking-widest uppercase flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-brand-primary" />
                    CONFIRM PASSWORD CODE
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      disabled={isLoading || success}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#0d0f14] text-brand-text-primary text-xs font-mono border border-brand-primary/20 focus:border-brand-primary focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] rounded-xl py-3 pl-4 pr-12 outline-none transition-all duration-300 placeholder:text-brand-text-secondary/30 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      disabled={isLoading || success}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-text-secondary hover:text-brand-primary transition-colors p-1 cursor-pointer disabled:opacity-50"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Options (Remember Me / Forgot Password) */}
          <div className="flex items-center justify-between text-[10px] text-brand-text-secondary font-mono">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                disabled={isLoading || success}
                className="rounded border-brand-primary/20 text-brand-primary focus:ring-0 focus:ring-offset-0 bg-[#0d0f14] h-3.5 w-3.5 cursor-pointer accent-brand-primary disabled:opacity-50"
              />
              <span className="group-hover:text-brand-text-primary transition-colors">REMEMBER SYSTEM</span>
            </label>
            <a href="#" className="hover:text-brand-primary transition-colors">FORGOT CODE?</a>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full relative group mt-2 overflow-hidden bg-linear-to-r from-brand-primary to-brand-secondary text-brand-bg font-bold font-satoshi text-xs uppercase tracking-widest py-3.5 px-6 rounded-xl hover:brightness-115 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-brand-primary/25 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-brand-bg border-t-transparent rounded-full"
                />
                <span>{isSignUp ? "REGISTERING..." : "DECRYPTING..."}</span>
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-brand-bg animate-bounce" />
                <span>LINK_ESTABLISHED</span>
              </>
            ) : (
              <>
                <span>{isSignUp ? "REGISTER NODE" : "AUTHORIZE ACCESS"}</span>
              </>
            )}
          </button>
        </form>

        {/* Mode Switcher Toggle Link */}
        <div className="text-center text-[10px] text-brand-text-secondary font-mono mt-2 pt-2 border-t border-brand-primary/10">
          {isSignUp ? (
            <span>
              ALREADY REGISTERED?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setErrorMsg("");
                }}
                className="text-brand-primary hover:underline hover:text-brand-primary/80 focus:outline-none cursor-pointer font-bold"
              >
                AUTHENTICATE SYSTEM
              </button>
            </span>
          ) : (
            <span>
              NEW OPERATOR HANDSHAKE?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setErrorMsg("");
                }}
                className="text-brand-primary hover:underline hover:text-brand-primary/80 focus:outline-none cursor-pointer font-bold"
              >
                REGISTER NODE SIGNATURE
              </button>
            </span>
          )}
        </div>

        {/* Footer Badges */}
        <div className="flex justify-between border-t border-brand-primary/10 pt-4 font-mono text-[9px] text-brand-text-secondary">
          <span className="flex items-center space-x-1 text-brand-success">
            <ShieldCheck className="h-3 w-3" />
            <span>SECURE LINK</span>
          </span>
          <span className="flex items-center space-x-1 text-brand-primary">
            <Activity className="h-3 w-3" />
            <span>ENCRYPTED_SSL</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
