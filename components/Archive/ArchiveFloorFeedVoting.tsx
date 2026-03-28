"use client";

import React, { useState, useMemo, useRef } from "react";
import { ArchiveFloorFeedProps } from "@/shared/types/archive";
import { PerformanceStatus } from "@/shared/lib/archive-types";
import StatusFilter from "./StatusFilter";
import { useRouter } from "next/navigation";
import { useAssets } from "@/shared/api/hooks/useAssets";
import moment from "moment";
import { useAssetsVoteResults } from "@/shared/api/hooks/useVotes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTh,
  faList,
  faCalendarAlt,
  faChartLine,
  faThumbsUp,
  faStar,
  faClock,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import { GridArchiveCard } from "./ArchiveCard/GridArchiveCard";
import { ListArchiveCard } from "./ArchiveCard/ListArchiveCard";
import { getStatusDisplay } from "@/shared/utils/config";

export const ArchiveFloorFeedVoting: React.FC<ArchiveFloorFeedProps> = () => {
  const router = useRouter();
  const { data, isLoading } = useAssets();
  const assets = (data?.assets as any[]) ?? [];
  const { data: voteResults, refetch: fetchVotes } = useAssetsVoteResults();
  const voteMap: Record<string, Record<string, number>> = {};
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());

  voteResults?.results?.forEach((v: any) => {
    if (!voteMap[v.assetId]) {
      voteMap[v.assetId] = {};
    }
    voteMap[v.assetId][v.category] = Number(v.count);
  });

  const [selectedStatus, setSelectedStatus] = useState<
    PerformanceStatus | "ALL"
  >("ALL");
  const [sortBy, setSortBy] = useState<"recent" | "trending">("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const transformedArtifacts = useMemo(
    () =>
      assets.map((asset) => ({
        id: asset.id,
        title: asset.title,
        creator: asset.creatorUserId,
        game: asset.game,
        description: asset.description,
        status: asset.statusTier,
        statusDisplay: getStatusDisplay(asset.statusTier),
        difficulty: asset.difficulty || "medium",
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

  // Calculate total votes for each artifact for trending
  const artifactsWithTotalVotes = useMemo(() => {
    return transformedArtifacts.map((artifact) => ({
      ...artifact,
      totalVotes: Object.values(voteMap[artifact.id] || {}).reduce(
        (sum, count) => sum + count,
        0,
      ),
    }));
  }, [transformedArtifacts, voteMap]);

  const totalStored: number = transformedArtifacts.length;
  const immortalCount: number = transformedArtifacts.filter(
    (a) => a.status === PerformanceStatus.LEGENDARY_ENIGMA,
  ).length;
  const totalVotes: number = artifactsWithTotalVotes.reduce(
    (sum, a) => sum + a.totalVotes,
    0,
  );
  const avgScore: string =
    transformedArtifacts.length > 0
      ? (
          transformedArtifacts.reduce((sum, a) => sum + a.curatorScore, 0) /
          transformedArtifacts.length
        ).toFixed(0)
      : "0";

  const filteredArtifacts = useMemo(
    () =>
      artifactsWithTotalVotes.filter((a) =>
        selectedStatus === "ALL" ? true : a.status === selectedStatus,
      ),
    [artifactsWithTotalVotes, selectedStatus],
  );

  const sortedArtifacts = useMemo(() => {
    return [...filteredArtifacts].sort((a, b) => {
      switch (sortBy) {
        case "trending":
          return b.totalVotes - a.totalVotes;
        case "recent":
        default:
          return (
            new Date(b.storedAt).getTime() - new Date(a.storedAt).getTime()
          );
      }
    });
  }, [filteredArtifacts, sortBy]);

  const handleVideoHover = (videoId: string) => {
    setHoveredVideoId(videoId);
    const videoElement = videoRefs.current[videoId];
    if (videoElement && videoElement.readyState >= 2) {
      videoElement.currentTime = 0;
      videoElement.play().catch((err) => console.log("Play failed:", err));
    }
  };

  const handleVideoLeave = (videoId: string) => {
    setHoveredVideoId(null);
    const videoElement = videoRefs.current[videoId];
    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  };

  const handleVideoLoad = (videoId: string) => {
    setLoadedVideos((prev) => new Set(prev).add(videoId));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#12141a] text-[#8fa0b3]">
        Loading artifacts...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1b1e26] to-[#0f1116] border border-[#232730] rounded-xl p-6">
        <h1
          className="text-3xl sm:text-4xl font-bold text-[#dbe3eb] mb-2"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: "1.5rem",
          }}
        >
          THE ARCHIVE FLOOR
        </h1>
        <p className="text-[#8fa0b3]">
          {sortedArtifacts.length} performance
          {sortedArtifacts.length !== 1 ? "s" : ""} stored in the archive.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={faStar}
          label="TOTAL STORED"
          value={totalStored}
          color="#98dc48"
        />
        <StatCard
          icon={faChartLine}
          label="IMMORTAL"
          value={immortalCount}
          color="#00ff88"
        />
        <StatCard
          icon={faThumbsUp}
          label="TOTAL VOTES"
          value={totalVotes}
          color="#f2c94c"
        />
        <StatCard
          icon={faCalendarAlt}
          label="AVG SCORE"
          value={avgScore}
          color="#5ecde3"
        />
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase mb-3 text-[#8fa0b3]">
            Filter & Sort
          </p>
          <div className="flex gap-2 flex-wrap">
            <StatusFilter
              statuses={["ALL", ...Object.values(PerformanceStatus)]}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
            />
            {(["recent", "trending"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                  sortBy === option
                    ? "bg-[#5ecde3] text-black"
                    : "bg-[#1b1e26] text-[#8fa0b3] border border-[#232730] hover:border-[#5ecde3]"
                }`}
              >
                <FontAwesomeIcon
                  icon={option === "recent" ? faClock : faFire}
                  size="xs"
                />
                {option === "recent" ? "Recent" : "Trending"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          {/* View Toggle */}
          <div className="flex gap-1 bg-[#1b1e26] border border-[#232730] rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 rounded-md transition-all ${
                viewMode === "grid"
                  ? "bg-[#5ecde3] text-black"
                  : "text-[#8fa0b3] hover:text-[#dbe3eb]"
              }`}
              title="Grid view"
            >
              <FontAwesomeIcon icon={faTh} size="sm" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 rounded-md transition-all ${
                viewMode === "list"
                  ? "bg-[#5ecde3] text-black"
                  : "text-[#8fa0b3] hover:text-[#dbe3eb]"
              }`}
              title="List view"
            >
              <FontAwesomeIcon icon={faList} size="sm" />
            </button>
          </div>

          <button
            className="px-4 py-2 text-sm font-bold rounded-lg bg-[#98dc48] text-black hover:bg-[#7fbf3f] transition cursor-pointer"
            onClick={() => router.push("/archive?page=submit")}
          >
            Upload Performance
          </button>
        </div>
      </div>

      {/* Artifacts Display */}
      {sortedArtifacts.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedArtifacts.map((artifact) => (
              <GridArchiveCard
                key={artifact.id}
                artifact={artifact}
                voteMap={voteMap}
                hoveredVideoId={hoveredVideoId}
                onVideoHover={handleVideoHover}
                onVideoLeave={handleVideoLeave}
                videoRefs={videoRefs}
                onVideoLoad={handleVideoLoad}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedArtifacts.map((artifact) => (
              <ListArchiveCard
                key={artifact.id}
                artifact={artifact}
                voteMap={voteMap}
                hoveredVideoId={hoveredVideoId}
                onVideoHover={handleVideoHover}
                onVideoLeave={handleVideoLeave}
                videoRefs={videoRefs}
                onVideoLoad={handleVideoLoad}
              />
            ))}
          </div>
        )
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

const EmptyState: React.FC = () => (
  <div className="bg-[#1b1e26] border-2 border-dashed border-[#232730] rounded-xl p-16 text-center">
    <p className="text-[#8fa0b3] text-sm mb-2">NO ARTIFACTS FOUND</p>
    <p className="text-[#7a8699] text-xs">
      Try adjusting filters or submit a new performance.
    </p>
  </div>
);

const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string | number;
  color: string;
}) => (
  <div className="bg-[#1b1e26] border border-[#232730] rounded-xl p-4 hover:border-[#5ecde3] transition-all">
    <div className="flex items-center gap-2 mb-2">
      <FontAwesomeIcon icon={icon} style={{ color }} size="sm" />
      <p className="text-[#7a8699] text-xs font-mono">{label}</p>
    </div>
    <p className="text-2xl font-bold" style={{ color }}>
      {value}
    </p>
  </div>
);
