"use client";

import { useState, useEffect } from "react";
import { ArchiveNavBar } from "@/components/Archive/ArchiveNavBar";
import { ArchiveFloorFeed } from "@/components/Archive/ArchiveFloorFeed";
import { PerformanceIndex } from "@/components/Archive/PerformanceIndex";
import { RelicVault } from "@/components/Archive/RelicVault";
import { Collections } from "@/components/Archive/Collections";
import { Campaigns } from "@/components/Archive/Campaigns";
import { SubmitArtifact } from "@/components/Archive/SubmitArtifact";
import { CuratorProfile } from "@/components/Archive/CuratorProfile";
import CRTOverlay from "@/components/Archive/CRTOverlay";
import { useArchive } from "@/shared/lib/archive-context";
import {
  PerformanceArtifact,
  PerformanceStatus,
  CuratorProfile as CuratorType,
} from "@/shared/lib/archive-types";

const generateMockArtifacts = (): PerformanceArtifact[] => {
  const games = [
    "CELESTE",
    "HOLLOW KNIGHT",
    "DARK SOULS",
    "NEON ABYSS",
    "SEKIRO",
  ];
  const creators = [
    "SpeedRunner_Pro",
    "GlitchMaster",
    "SoloChallenger",
    "ProGamer_X",
    "IndieStudio",
  ];
  const statuses = Object.values(PerformanceStatus);

  const videoUrls = [
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "https://www.w3schools.com/html/movie.mp4",
    "https://test-videos.co.uk/vids/bigbucksbunny/mp4/h264/1080p/Big_Buck_Bunny_1080_10s_1MB.mp4",
    "https://test-videos.co.uk/vids/bigbucksbunny/mp4/h264/360p/Big_Buck_Bunny_360_10s_1MB.mp4",
  ];

  return Array.from({ length: 15 }, (_, i) => ({
    id: `ARTIFACT_${String(i + 1).padStart(4, "0")}`,
    title: [
      "NO-HIT RUN (ANY%)",
      "FRAME-PERFECT PARRY",
      "SEQUENCE BREAK DISCOVERY",
      "SPEED OPTIMIZATION",
      "GLITCH EXPLOITATION",
      "BOSS SKIP ROUTE",
      "PLATFORMING MASTERY",
      "DODGE CHALLENGE",
      "COMBO CHAIN (500+)",
      "ENDURANCE RUN (2H)",
      "SPEEDRUN WR",
      "PACIFIST RUN",
      "PUZZLE OPTIMIZATION",
      "RESOURCE CONSERVATION",
      "CREATIVE EXPLOIT",
    ][i % 15],
    creator: creators[i % creators.length],
    game: games[i % games.length],
    description: `An incredible display of skill and precision in ${games[i % games.length]}. This performance demonstrates masterful execution.`,
    status: statuses[i % statuses.length],
    storedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    curatorScore: Math.floor(Math.random() * 100) + 20,
    replicationAttempts: Math.floor(Math.random() * 1000),
    successfulReplications: Math.floor(Math.random() * 100),
    endorsements: Math.floor(Math.random() * 500),
    videoUrl: videoUrls[i % videoUrls.length],
    imageUrl: `https://picsum.photos/400/300?random=${i}`,
    tags: ["epic", "gameplay", "challenge", "speedrun"].slice(
      0,
      Math.floor(Math.random() * 3) + 1,
    ),
  }));
};

export default function ArchivePage() {
  const [activeSection, setActiveSection] = useState("archive");
  const { setCurator, setArtifacts, artifacts } = useArchive();

  useEffect(() => {
    setArtifacts(generateMockArtifacts());

    const mockCurator: CuratorType = {
      id: "CURATOR_001",
      name: "SkyRunner",
      endorsementPower: 8500,
      artifactsStored: 23,
      joinedDate: new Date("2024-01-15"),
      bio: "Speedrunner. Collector. Legend in the making.",
    };
    setCurator(mockCurator);
  }, [setArtifacts, setCurator]);

  const renderSection = () => {
    switch (activeSection) {
      case "archive":
        return <ArchiveFloorFeed artifacts={artifacts} />;
      case "index":
        return <PerformanceIndex artifacts={artifacts} />;
      case "relic-vault":
        return <RelicVault artifacts={artifacts} />;
      case "collections":
        return <Collections artifacts={artifacts} />;
      case "campaigns":
        return <Campaigns />;
      case "submit":
        return <SubmitArtifact />;
      case "profile":
        return <CuratorProfile />;
      default:
        return <ArchiveFloorFeed artifacts={artifacts} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#12141a] text-[#dbe3eb]">
      <CRTOverlay />

      <ArchiveNavBar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">{renderSection()}</main>

      <footer className="border-t border-[#232730] bg-[#0f1116] py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-[#7a8699]">
          <p className="font-mono mb-2">
            SkillMuseum™ • Every Movement Is History
          </p>
          <p>Preserving legendary performances. One artifact at a time.</p>
        </div>
      </footer>
    </div>
  );
}
