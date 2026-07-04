import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import InteractiveDemo from "@/components/landing/InteractiveDemo";
import WhyForgeMind from "@/components/landing/WhyForgeMind";
import PlatformModules from "@/components/landing/PlatformModules";
import DashboardPreview from "@/components/landing/DashboardPreview";
import ArchitecturePreview from "@/components/landing/ArchitecturePreview";
import MetricsSection from "@/components/landing/MetricsSection";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import BackgroundCanvas3D from "@/components/landing/BackgroundCanvas3D";
import CustomCursor from "@/components/landing/CustomCursor";
import LoadingScreen from "@/components/landing/LoadingScreen";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-brand-bg text-brand-text-primary selection:bg-brand-primary/30 overflow-x-hidden font-sans">
      {/* Industrial Initializer Loading Screen */}
      <LoadingScreen />

      {/* Glowing Industrial Desktop Cursor */}
      <CustomCursor />

      {/* 3D Living Neural Network Background */}
      <BackgroundCanvas3D className="opacity-85 -z-10" />

      {/* 1. Navbar */}
      <Navbar />

      {/* 8-Section Masterwork Narrative Flow */}
      <main className="grow">
        {/* Section 1: Hero (92vh Mission Control) */}
        <Hero />

        {/* Section 2 ⭐: Interactive AI Demo */}
        <InteractiveDemo />

        {/* Section 3 ⭐: Why ForgeMind (Legacy vs Neural Split) */}
        <WhyForgeMind />

        {/* Section 4: Platform Modules (2x3 Large Dashboard Panels) */}
        <PlatformModules />

        {/* Section 5 ⭐: Industrial Dashboard Preview */}
        <DashboardPreview />

        {/* Section 6: System Architecture Blueprint */}
        <ArchitecturePreview />

        {/* Section 7: Impact Metrics */}
        <MetricsSection />

        {/* Section 8: CTA */}
        <CTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
