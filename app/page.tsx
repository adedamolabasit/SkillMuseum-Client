"use client";

import { useState } from "react";
import Header from "@/components/Home/Header";
import Hero from "@/components/Home/Hero";
import ProblemsSection from "@/components/Home/ProblemsSection";
import HowSection from "@/components/Home/HowSection";
import CommunitySection from "@/components/Home/CommunitySection";
import IndieSection from "@/components/Home/IndieSection";
import FinalCTA from "@/components/Home/FinalCTA";
import AuthModal from "@/components/Auth/AuthModal";
import CRTOverlay from "@/components/Archive/CRTOverlay";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signup");

  return (
    <div className="relative w-full overflow-hidden">
      <CRTOverlay />
      <Header
        onSignIn={() => {
          setActiveTab("signin");
          setIsModalOpen(true);
        }}
        onSignUp={() => {
          setActiveTab("signup");
          setIsModalOpen(true);
        }}
      />

      <main className="relative">
        <Hero
          onSignUp={() => {
            setActiveTab("signup");
            setIsModalOpen(true);
          }}
        />
        <ProblemsSection />
        <HowSection />
        <CommunitySection />
        <IndieSection />
        <FinalCTA
          onSignUp={() => {
            setActiveTab("signup");
            setIsModalOpen(true);
          }}
        />
      </main>

      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
