"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PerformanceStatus } from "@/shared/lib/archive-types";
import { ArchiveCard } from "./ArchiveCard";
import { ArchiveFloorFeedProps } from "@/shared/types/archive";

export const ArchiveFloorFeed: React.FC<ArchiveFloorFeedProps> = ({
  artifacts,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<
    PerformanceStatus | "ALL"
  >("ALL");
  const [sortBy, setSortBy] = useState<"recent" | "trending" | "score">(
    "recent",
  );

  const statuses = [
    "ALL",
    PerformanceStatus.UNVERIFIED,
    PerformanceStatus.EXHIBIT,
    PerformanceStatus.FEATURED_EXHIBIT,
    PerformanceStatus.LEGENDARY,
    PerformanceStatus.RELIC_CANDIDATE,
    PerformanceStatus.UNTOUCHABLE,
    PerformanceStatus.IMMORTAL_ARTIFACT,
  ];

  const filteredArtifacts = artifacts.filter((a) =>
    selectedStatus === "ALL" ? true : a.status === selectedStatus,
  );

  const sortedArtifacts = [...filteredArtifacts].sort((a, b) => {
    switch (sortBy) {
      case "trending":
        return b.endorsements - a.endorsements;
      case "score":
        return b.curatorScore - a.curatorScore;
      case "recent":
      default:
        return new Date(b.storedAt).getTime() - new Date(a.storedAt).getTime();
    }
  });

  return (
    <div className="space-y-6">
      <div className="bg-[#1b1e26] border-2 border-[#232730] rounded-lg p-6">
        <h1
          className="text-3xl sm:text-4xl font-bold text-[#dbe3eb] uppercase mb-2"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          THE ARCHIVE FLOOR
        </h1>
        <p className="text-[#8fa0b3] text-sm">
          {sortedArtifacts.length} performance
          {sortedArtifacts.length !== 1 ? "s" : ""} stored. Every epic moment
          preserved. Forever.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <p
            className="text-xs font-bold text-[#8fa0b3] uppercase mb-3"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            Filter by Status
          </p>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() =>
                  setSelectedStatus(status as PerformanceStatus | "ALL")
                }
                className={`px-3 py-2 text-xs font-bold rounded transition-all ${
                  selectedStatus === status
                    ? "text-[#000] bg-[#98dc48] border border-[#98dc48]"
                    : "text-[#8fa0b3] bg-[#1b1e26] border border-[#232730] hover:border-[#5ecde3]"
                }`}
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: "0.6rem",
                }}
              >
                {status === "ALL" ? "ALL" : status.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p
            className="text-xs font-bold text-[#8fa0b3] uppercase mb-3"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            Sort By
          </p>
          <div className="flex gap-2">
            {(["recent", "trending", "score"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-3 py-2 text-xs font-bold rounded transition-all ${
                  sortBy === option
                    ? "text-[#000] bg-[#5ecde3] border border-[#5ecde3]"
                    : "text-[#8fa0b3] bg-[#1b1e26] border border-[#232730] hover:border-[#5ecde3]"
                }`}
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: "0.6rem",
                }}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {sortedArtifacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedArtifacts.map((artifact) => (
            <Link key={artifact.id} href={`/archive/${artifact.id}`}>
              <ArchiveCard artifact={artifact} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-[#1b1e26] border-2 border-dashed border-[#232730] rounded-lg p-12 text-center">
          <p
            className="text-[#8fa0b3] text-sm mb-2"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "0.7rem",
            }}
          >
            NO ARTIFACTS FOUND
          </p>
          <p className="text-[#7a8699] text-xs">
            Try adjusting your filters or submit a new performance.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-[#1b1e26] border border-[#232730] rounded-lg p-4 text-center">
          <p className="text-[#7a8699] text-xs font-mono mb-1">TOTAL STORED</p>
          <p className="text-[#98dc48] text-2xl font-bold">
            {artifacts.length}
          </p>
        </div>
        <div className="bg-[#1b1e26] border border-[#232730] rounded-lg p-4 text-center">
          <p className="text-[#7a8699] text-xs font-mono mb-1">IMMORTAL</p>
          <p className="text-[#00ff88] text-2xl font-bold">
            {
              artifacts.filter(
                (a) => a.status === PerformanceStatus.IMMORTAL_ARTIFACT,
              ).length
            }
          </p>
        </div>
        <div className="bg-[#1b1e26] border border-[#232730] rounded-lg p-4 text-center">
          <p className="text-[#7a8699] text-xs font-mono mb-1">
            TOTAL ENDORSEMENTS
          </p>
          <p className="text-[#f2c94c] text-2xl font-bold">
            {artifacts.reduce((sum, a) => sum + a.endorsements, 0)}
          </p>
        </div>
        <div className="bg-[#1b1e26] border border-[#232730] rounded-lg p-4 text-center">
          <p className="text-[#7a8699] text-xs font-mono mb-1">
            AVG CURATOR SCORE
          </p>
          <p className="text-[#5ecde3] text-2xl font-bold">
            {(
              artifacts.reduce((sum, a) => sum + a.curatorScore, 0) /
              (artifacts.length || 1)
            ).toFixed(0)}
          </p>
        </div>
      </div>
    </div>
  );
};
