"use client";

import React, { useState, useEffect, useRef } from "react";
import { STATUS_CONFIG } from "@/shared/lib/archive-types";
import { ArchiveCardProps } from "@/shared/types/archive";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useVote, useMyVotes } from "@/shared/api/hooks/useVotes";

interface ArchiveCardExtendedProps extends ArchiveCardProps {
  voteCounts?: { [category: string]: number };
  categories?: string[];
  fetchVotes?: () => void;
}

export const ArchiveCard: React.FC<ArchiveCardExtendedProps> = ({
  artifact,
  onClick,
  voteCounts = {},
  categories = ["Most Skillful", "Curator's Pick", "Most Unreplicable"],
  fetchVotes,
}) => {
  const statusConfig = STATUS_CONFIG[artifact.status];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: myVotesData,
    refetch: refetchMyVotes,
    isLoading,
  } = useMyVotes();
  const [localVotes, setLocalVotes] = useState<{ [category: string]: string }>(
    {},
  );
  const { mutate: castVote, isPending } = useVote();
  const cardVideoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (myVotesData?.votes) {
      const votesMap: { [category: string]: string } = {};
      myVotesData.votes.forEach((v: { assetId: string; category: string }) => {
        votesMap[v.category] = v.assetId;
      });
      setLocalVotes(votesMap);
    }
  }, [myVotesData]);

  const handleVote = (category: string) => {
    if (isPending) return;

    const alreadyVotedAssetId = localVotes[category];

    if (alreadyVotedAssetId === artifact.id) {
      castVote(
        { assetId: artifact.id, category },
        {
          onSuccess: () => {
            refetchMyVotes();
            fetchVotes?.();
          },
          onError: (err: any) => alert(err.message),
        },
      );
      return;
    }

    if (alreadyVotedAssetId && alreadyVotedAssetId !== artifact.id) {
      alert(
        `You have already voted for "${category}" on another asset. Unvote that first to vote here.`,
      );
      return;
    }

    castVote(
      { assetId: artifact.id, category },
      {
        onSuccess: () => {
          refetchMyVotes();
          fetchVotes?.();
        },
        onError: (err: any) => alert(err.message),
      },
    );
  };

  return (
    <>
      <div
        onClick={onClick}
        className="cursor-pointer bg-[#1b1e26] rounded-lg border-2 transition-all hover:shadow-lg overflow-hidden group"
        style={{ borderColor: statusConfig?.borderColor }}
      >
        <div
          className="px-4 py-3 text-xs font-bold uppercase text-center"
          style={{
            backgroundColor: statusConfig.bgColor,
            color: statusConfig?.color,
          }}
        >
          {statusConfig.label}
        </div>

        {artifact.videoUrl && (
          <div
            className="relative w-full aspect-video bg-black overflow-hidden group"
            onMouseEnter={() => {
              if (cardVideoRef.current) {
                cardVideoRef.current.muted = false;
                cardVideoRef.current.play().catch(() => {});
              }
            }}
            onMouseLeave={() => {
              if (cardVideoRef.current) {
                cardVideoRef.current.pause();
                cardVideoRef.current.currentTime = 0;
              }
            }}
          >
            <video
              ref={cardVideoRef}
              src={artifact.videoUrl}
              muted={false}
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover transition-opacity duration-200"
            />
          </div>
        )}
        <div className="p-4">
          <div className="mb-3">
            <p className="text-xs text-[#7a8699] font-mono mb-1">
              ID: {artifact.id}
            </p>
            <h3 className="text-sm font-bold text-[#dbe3eb] leading-snug line-clamp-2">
              {artifact.title}
            </h3>
          </div>
          <div className="flex items-center mt-3">
            <div className="flex flex-wrap gap-1 flex-1 overflow-x-auto">
              {artifact.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-[#232730] text-[#5ecde3] rounded border border-[#5ecde3] font-mono whitespace-nowrap"
                >
                  #{tag}
                </span>
              ))}
              {artifact.tags.length > 3 && (
                <span className="text-xs px-2 py-1 text-[#7a8699] whitespace-nowrap">
                  +{artifact.tags.length - 3}
                </span>
              )}
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsModalOpen(true)}
                className="ml-2 flex items-center gap-1 px-3 py-1 bg-[#98dc48] rounded text-black font-bold hover:bg-[#7fbf3f] cursor-pointer"
              >
                <FaArrowUp /> Vote
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        >
          <div className="bg-[#1b1e26] p-6 rounded-lg w-11/12 max-w-md">
            <h2 className="text-xl text-[#dbe3eb] font-bold mb-3">
              Vote for: {artifact.title}
            </h2>
            <div className="space-y-3">
              {categories.map((cat) => {
                const votedAssetId = localVotes[cat];
                const votedHere = votedAssetId === artifact.id;
                const votedElsewhere = votedAssetId && !votedHere;
                const disabled = votedElsewhere || isPending;
                const tooltip = votedElsewhere
                  ? "You voted for another asset in this category. Unvote it first to vote here."
                  : votedHere
                    ? "Click again to unvote this asset."
                    : "";

                return (
                  <div
                    key={cat}
                    className="relative flex justify-between items-center bg-[#232730] rounded px-3 py-2 group"
                  >
                    <span className="text-[#8fa0b3]">{cat}</span>

                    <button
                      disabled={disabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(cat);
                      }}
                      className={`flex items-center gap-1 px-2 py-1 rounded font-bold cursor-pointer
                        ${
                          votedHere
                            ? "bg-red-500 text-white"
                            : "bg-[#5ecde3] text-black hover:bg-[#4db0c7]"
                        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {votedHere ? <FaArrowDown /> : <FaArrowUp />}
                      {voteCounts[cat] ?? 0}
                    </button>

                    {tooltip && (
                      <div
                        className="absolute right-18 top-1/2 -translate-y-1/2 ml-2
                        bg-black text-white text-xs px-3 py-2 rounded shadow-lg
                        min-w-[180px] max-w-[250px] opacity-0 group-hover:opacity-100
                        transition-opacity duration-200 z-50"
                      >
                        {tooltip}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(false);
              }}
              className="mt-5 w-full bg-[#98dc48] text-black font-bold py-2 rounded hover:bg-[#7fbf3f] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
