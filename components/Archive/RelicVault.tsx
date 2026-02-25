"use client";

import React from "react";
import { PerformanceStatus } from "@/shared/lib/archive-types";
import { ArchiveCard } from "./ArchiveCard";
import { RelicVaultProps } from "@/shared/types/archive";

export const RelicVault: React.FC<RelicVaultProps> = ({ artifacts }) => {
  const relicArtifacts = artifacts.filter((a) =>
    [
      PerformanceStatus.RELIC_CANDIDATE,
      PerformanceStatus.UNTOUCHABLE,
      PerformanceStatus.IMMORTAL_ARTIFACT,
    ].includes(a.status),
  );

  const groupedByStatus = {
    [PerformanceStatus.RELIC_CANDIDATE]: relicArtifacts.filter(
      (a) => a.status === PerformanceStatus.RELIC_CANDIDATE,
    ),
    [PerformanceStatus.UNTOUCHABLE]: relicArtifacts.filter(
      (a) => a.status === PerformanceStatus.UNTOUCHABLE,
    ),
    [PerformanceStatus.IMMORTAL_ARTIFACT]: relicArtifacts.filter(
      (a) => a.status === PerformanceStatus.IMMORTAL_ARTIFACT,
    ),
  };

  return (
    <div className="space-y-8">
      <div className="bg-[#1b1e26] border-2 border-[#232730] rounded-lg p-6">
        <h1
          className="text-3xl sm:text-4xl font-bold text-[#dbe3eb] uppercase mb-2"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          RELIC VAULT
        </h1>
        <p className="text-[#8fa0b3] text-sm">
          The most sacred performances. Impossible to replicate. Impossible to
          forget.
        </p>
      </div>

      <div className="space-y-4">
        <div className="border-l-4 border-[#00ff88] pl-4">
          <h2
            className="text-2xl font-bold text-[#00ff88] uppercase"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "1.2rem",
            }}
          >
            IMMORTAL ARTIFACTS
          </h2>
          <p className="text-[#8fa0b3] text-sm mt-1">
            Performances that transcended mere gameplay. They are legend. They
            are eternal.
          </p>
        </div>
        {groupedByStatus[PerformanceStatus.IMMORTAL_ARTIFACT].length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedByStatus[PerformanceStatus.IMMORTAL_ARTIFACT].map(
              (artifact) => (
                <ArchiveCard key={artifact.id} artifact={artifact} />
              ),
            )}
          </div>
        ) : (
          <div className="bg-[#0f1116] border border-dashed border-[#00ff88] rounded-lg p-8 text-center opacity-50">
            <p className="text-[#8fa0b3] text-sm">
              Awaiting the next immortal performance...
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="border-l-4 border-[#ff6b9d] pl-4">
          <h2
            className="text-2xl font-bold text-[#ff6b9d] uppercase"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "1.2rem",
            }}
          >
            UNTOUCHABLE
          </h2>
          <p className="text-[#8fa0b3] text-sm mt-1">
            1000+ attempts. Zero success. The gap between performer and world is
            immeasurable.
          </p>
        </div>
        {groupedByStatus[PerformanceStatus.UNTOUCHABLE].length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedByStatus[PerformanceStatus.UNTOUCHABLE].map((artifact) => (
              <ArchiveCard key={artifact.id} artifact={artifact} />
            ))}
          </div>
        ) : (
          <div className="bg-[#1b1e26] border border-dashed border-[#232730] rounded-lg p-8 text-center opacity-50">
            <p className="text-[#8fa0b3] text-sm">
              No untouchable performances yet...
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="border-l-4 border-[#9d72ff] pl-4">
          <h2
            className="text-2xl font-bold text-[#9d72ff] uppercase"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "1.2rem",
            }}
          >
            RELIC CANDIDATES
          </h2>
          <p className="text-[#8fa0b3] text-sm mt-1">
            On the path to immortality. Community votes will determine their
            fate.
          </p>
        </div>
        {groupedByStatus[PerformanceStatus.RELIC_CANDIDATE].length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedByStatus[PerformanceStatus.RELIC_CANDIDATE].map(
              (artifact) => (
                <ArchiveCard key={artifact.id} artifact={artifact} />
              ),
            )}
          </div>
        ) : (
          <div className="bg-[#1b1e26] border border-dashed border-[#232730] rounded-lg p-8 text-center opacity-50">
            <p className="text-[#8fa0b3] text-sm">Waiting for contenders...</p>
          </div>
        )}
      </div>

      {relicArtifacts.length === 0 && (
        <div className="bg-[#1b1e26] border-2 border-dashed border-[#232730] rounded-lg p-12 text-center">
          <p
            className="text-[#8fa0b3] text-sm mb-2"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "0.9rem",
            }}
          >
            THE VAULT AWAITS
          </p>
          <p className="text-[#7a8699] text-xs">
            Be the first to achieve relic status.
          </p>
        </div>
      )}
    </div>
  );
};
