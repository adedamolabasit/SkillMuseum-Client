"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PerformanceStatus } from "@/shared/lib/archive-types";
import { ArchiveCard } from "./ArchiveCard";
import { ArchiveFloorFeedProps } from "@/shared/types/archive";
import StatusFilter from "./StatusFilter";
import { useRouter } from "next/navigation";
import { useAssets } from "@/shared/api/hooks/useAssets";
import { PerformanceArtifact } from "@/shared/lib/archive-types";
import moment from "moment";

type DbAsset = {
  id: string;
  title: string;
  description: string;
  creatorUserId: string;
  game: string;
  statusTier: PerformanceStatus;
  tags: string[];
  gatewayUrl: string;
  createdAt: string | Date;
  endorsements?: number;
  curatorScore?: number;
  replicationAttempts?: number;
  successfulReplications?: number;
};

type ArchiveArtifact = {
  id: string;
  title: string;
  creator: string;
  game: string;
  status: PerformanceStatus;
  curatorScore: number;
  replicationAttempts: number;
  successfulReplications: number;
  endorsements: number;
  tags: string[];
  videoUrl: string;
  storedAt: string | Date;
};

export const ArchiveFloorFeed: React.FC<ArchiveFloorFeedProps> = () => {
  const router = useRouter();
  const { data, isLoading } = useAssets();

  const assets: DbAsset[] = (data?.assets as DbAsset[]) ?? [];

  const [selectedStatus, setSelectedStatus] = useState<
    PerformanceStatus | "ALL"
  >("ALL");

  const [sortBy, setSortBy] = useState<"recent" | "trending" | "score">(
    "recent",
  );

  const statuses: Array<PerformanceStatus | "ALL"> = [
    "ALL",
    PerformanceStatus.GALLERY_EXHIBIT,
    PerformanceStatus.MASTERPIECE,
    PerformanceStatus.IMMUTABLE_RELIC,
    PerformanceStatus.LEGENDARY_ENIGMA,
    PerformanceStatus.PRICELESS_ARTIFACT,
  ];

  /* ============================= */
  /* ✅ Transform DB → UI Model */
  /* ============================= */

  const transformedArtifacts: PerformanceArtifact[] = useMemo(() => {
    return assets.map((asset) => ({
      id: asset.id,
      title: asset.title,
      creator: asset.creatorUserId,
      game: asset.game,
      description: asset.description,
      status: asset.statusTier,
      curatorScore: asset.curatorScore ?? 0,
      replicationAttempts: asset.replicationAttempts ?? 0,
      successfulReplications: asset.successfulReplications ?? 0,
      endorsements: asset.endorsements ?? 0,
      tags: asset.tags ?? [],
      videoUrl: asset.gatewayUrl,
      storedAt: moment(asset.createdAt).toDate(),
    }));
  }, [assets]);

  /* ============================= */
  /* ✅ Filter */
  /* ============================= */

  const filteredArtifacts = useMemo(() => {
    return transformedArtifacts.filter((artifact) =>
      selectedStatus === "ALL" ? true : artifact.status === selectedStatus,
    );
  }, [transformedArtifacts, selectedStatus]);

  /* ============================= */
  /* ✅ Sort */
  /* ============================= */

  const sortedArtifacts = useMemo(() => {
    return [...filteredArtifacts].sort((a, b) => {
      switch (sortBy) {
        case "trending":
          return b.endorsements - a.endorsements;

        case "score":
          return b.curatorScore - a.curatorScore;

        case "recent":
        default:
          return (
            new Date(b.storedAt).getTime() - new Date(a.storedAt).getTime()
          );
      }
    });
  }, [filteredArtifacts, sortBy]);

  /* ============================= */
  /* ✅ Stats */
  /* ============================= */

  const totalStored: number = transformedArtifacts.length;

  const immortalCount: number = transformedArtifacts.filter(
    (a) => a.status === PerformanceStatus.LEGENDARY_ENIGMA,
  ).length;

  const totalEndorsements: number = transformedArtifacts.reduce(
    (sum, a) => sum + a.endorsements,
    0,
  );

  const avgScore: string =
    transformedArtifacts.length > 0
      ? (
          transformedArtifacts.reduce((sum, a) => sum + a.curatorScore, 0) /
          transformedArtifacts.length
        ).toFixed(0)
      : "0";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#12141a] flex items-center justify-center">
        <p className="text-[#8fa0b3]">Loading artifacts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-[#1b1e26] border-2 border-[#232730] rounded-lg p-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#dbe3eb] uppercase mb-2">
          THE ARCHIVE FLOOR
        </h1>

        <p className="text-[#8fa0b3] text-lg">
          {sortedArtifacts.length} performance
          {sortedArtifacts.length !== 1 ? "s" : ""} stored.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <StatCard label="TOTAL STORED" value={totalStored} color="#98dc48" />
        <StatCard label="IMMORTAL" value={immortalCount} color="#00ff88" />
        <StatCard
          label="TOTAL ENDORSEMENTS"
          value={totalEndorsements}
          color="#f2c94c"
        />
        <StatCard label="AVG CURATOR SCORE" value={avgScore} color="#5ecde3" />
      </div>

      {/* FILTER + SORT */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs font-bold uppercase mb-3 text-[#8fa0b3]">
            Sort By
          </p>

          <div className="flex gap-2 flex-wrap">
            <StatusFilter
              statuses={statuses}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
            />

            {(["recent", "trending", "score"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-3 py-2 text-xs font-bold rounded transition-all ${
                  sortBy === option
                    ? "bg-[#5ecde3] text-black"
                    : "bg-[#1b1e26] text-[#8fa0b3] border border-[#232730]"
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button
          className="px-3 py-2 text-sm font-bold rounded bg-[#98dc48] text-black"
          onClick={() => router.push("/archive?page=submit")}
        >
          Upload Performance
        </button>
      </div>

      {/* GRID */}
      {!isLoading && sortedArtifacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedArtifacts.map((artifact) => (
            <Link key={artifact.id} href={`/archive/${artifact.id}`}>
              <ArchiveCard artifact={artifact} />
            </Link>
          ))}
        </div>
      ) : !isLoading ? (
        <EmptyState />
      ) : null}
    </div>
  );
};

/* ============================= */
/* ✅ Stat Card */
/* ============================= */

const StatCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) => (
  <div className="bg-[#1b1e26] border border-[#232730] rounded-lg p-4 text-center">
    <p className="text-[#7a8699] text-xs font-mono mb-1">{label}</p>
    <p className="text-2xl font-bold" style={{ color }}>
      {value}
    </p>
  </div>
);

/* ============================= */
/* ✅ Empty State */
/* ============================= */

const EmptyState: React.FC = () => (
  <div className="bg-[#1b1e26] border-2 border-dashed border-[#232730] rounded-lg p-12 text-center">
    <p className="text-[#8fa0b3] text-sm mb-2">NO ARTIFACTS FOUND</p>

    <p className="text-[#7a8699] text-xs">
      Try adjusting filters or submit a new performance.
    </p>
  </div>
);
