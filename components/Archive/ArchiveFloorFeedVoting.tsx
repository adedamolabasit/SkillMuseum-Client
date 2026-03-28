"use client";

import React, { useState, useMemo } from "react";
import { ArchiveCard } from "./ArchiveCard";
import { ArchiveFloorFeedProps } from "@/shared/types/archive";
import { PerformanceStatus } from "@/shared/lib/archive-types";
import StatusFilter from "./StatusFilter";
import { useRouter } from "next/navigation";
import { useAssets } from "@/shared/api/hooks/useAssets";
import moment from "moment";
import { useAssetsVoteResults } from "@/shared/api/hooks/useVotes";

export const ArchiveFloorFeedVoting: React.FC<ArchiveFloorFeedProps> = () => {
  const router = useRouter();
  const { data, isLoading } = useAssets();
  const assets = (data?.assets as any[]) ?? [];
  const { data: voteResults, refetch: fetchVotes } = useAssetsVoteResults();
  const voteMap: Record<string, Record<string, number>> = {};

  voteResults?.results?.forEach((v: any) => {
    if (!voteMap[v.assetId]) {
      voteMap[v.assetId] = {};
    }

    voteMap[v.assetId][v.category] = Number(v.count);
  });

  const [selectedStatus, setSelectedStatus] = useState<
    PerformanceStatus | "ALL"
  >("ALL");
  const [sortBy, setSortBy] = useState<"recent" | "trending" | "score">(
    "recent",
  );

  const transformedArtifacts = useMemo(
    () =>
      assets.map((asset) => ({
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
        challenge: asset.challenge,
        voteDeadline: moment().add(2, "minutes").toDate(),
      })),
    [assets],
  );

  const filteredArtifacts = useMemo(
    () =>
      transformedArtifacts.filter((a) =>
        selectedStatus === "ALL" ? true : a.status === selectedStatus,
      ),
    [transformedArtifacts, selectedStatus],
  );

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#12141a] text-[#8fa0b3]">
        Loading artifacts...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#1b1e26] border-2 border-[#232730] rounded-lg p-6">
        <h1
          className="text-3xl sm:text-4xl font-bold text-[#dbe3eb] uppercase mb-2"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          THE ARCHIVE FLOOR
        </h1>
        <p className="text-[#8fa0b3] text-lg">
          {sortedArtifacts.length} performance
          {sortedArtifacts.length !== 1 ? "s" : ""} stored.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs font-bold uppercase mb-3 text-[#8fa0b3]">
            Sort By
          </p>
          <div className="flex gap-2 flex-wrap">
            <StatusFilter
              statuses={["ALL", ...Object.values(PerformanceStatus)]}
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
          className="px-3 py-2 text-sm font-bold rounded bg-[#98dc48] text-black cursor-pointer"
          onClick={() => router.push("/archive?page=submit")}
        >
          Upload Performance
        </button>
      </div>

      {sortedArtifacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedArtifacts.map((artifact) => (
            <div
              key={artifact.id}
              onClick={() => router.push(`/archive/${artifact.id}`)}
              className="bg-[#1b1e26] border-2 border-[#232730] rounded-lg overflow-hidden hover:border-[#5ecde3] transition-all cursor-pointer relative"
            >
              <ArchiveCard
                artifact={artifact}
                voteCounts={voteMap[artifact.id] || {}}
                fetchVotes={fetchVotes}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

const EmptyState: React.FC = () => (
  <div className="bg-[#1b1e26] border-2 border-dashed border-[#232730] rounded-lg p-12 text-center">
    <p className="text-[#8fa0b3] text-sm mb-2">NO ARTIFACTS FOUND</p>
    <p className="text-[#7a8699] text-xs">
      Try adjusting filters or submit a new performance.
    </p>
  </div>
);
