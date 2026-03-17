"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Heart, Share2, Flag } from "lucide-react";
import moment from "moment";

import { useAsset } from "@/shared/api/hooks/useAssets";
import { STATUS_CONFIG } from "@/shared/lib/archive-types";
import CRTOverlay from "@/components/Archive/CRTOverlay";

export default function AssetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const assetId = params?.id as string;

  const { data, isLoading, isError } = useAsset(assetId);
  const artifact = data?.asset;

  const [showChallenge, setShowChallenge] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#12141a] flex items-center justify-center">
        <p className="text-[#8fa0b3]">Loading artifact...</p>
      </div>
    );
  }

  if (isError || !artifact) {
    return (
      <div className="min-h-screen bg-[#12141a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8fa0b3] mb-4">Artifact not found</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-[#98dc48] text-[#000] rounded font-bold"
          >
            BACK
          </button>
        </div>
      </div>
    );
  }

  const statusConfig =
    STATUS_CONFIG[artifact.status as keyof typeof STATUS_CONFIG];

  const replicationRate =
    artifact.replicationAttempts > 0
      ? (
          (artifact.successfulReplications / artifact.replicationAttempts) *
          100
        ).toFixed(1)
      : "0.0";

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/archive/${artifact.id}`;

    if (navigator.share) {
      navigator.share({
        title: artifact.title,
        text: `Check out this legendary performance: ${artifact.title}`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };

  const formattedStoredDate = moment(artifact.createdAt).format(
    "MMMM Do YYYY, h:mm a",
  );

  return (
    <div className="min-h-screen bg-[#12141a] text-[#dbe3eb]">
      <CRTOverlay />

      <header className="sticky top-0 z-10 bg-[#12141a] border-b border-[#232730] py-4">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-2 bg-[#1b1e26] border border-[#232730] rounded hover:border-[#98dc48] transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "0.6rem",
              }}
            >
              BACK
            </span>
          </button>

          <h1
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "0.8rem",
            }}
            className="text-center flex-1"
          >
            ARTIFACT DETAILS
          </h1>

          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 pb-12">
        <div
          className="inline-block px-4 py-2 rounded mb-6 text-xs font-bold uppercase text-center"
          style={{
            backgroundColor: statusConfig?.bgColor,
            color: statusConfig?.color,
            fontFamily: "'Press Start 2P', cursive",
            fontSize: "0.65rem",
            textShadow: `0 0 5px ${statusConfig?.color}40`,
          }}
        >
          {statusConfig?.label}
        </div>

        <div className="mb-8">
          <h1
            className="text-3xl sm:text-4xl font-bold text-[#dbe3eb] mb-3 leading-tight"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            {artifact.title}
          </h1>

          <p className="text-[#8fa0b3] text-sm">{artifact.description}</p>
        </div>

        {artifact.gatewayUrl && (
          <div className="mb-8 bg-[#1b1e26] border-2 border-[#232730] rounded-lg overflow-hidden">
            <video
              src={artifact.gatewayUrl}
              controls
              className="w-full aspect-video"
            />
          </div>
        )}

        <div className="bg-[#1b1e26] border-2 border-[#232730] rounded-lg p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-[#7a8699] font-mono mb-1 truncate">CREATOR</p>
              <p className="text-sm font-bold truncate">{artifact.creatorUserId}</p>
            </div>

            <div>
              <p className="text-xs text-[#7a8699] font-mono mb-1 truncate">GAME</p>
              <p className="text-sm font-bold">{artifact.game}</p>
            </div>

            <div>
              <p className="text-xs text-[#7a8699] font-mono mb-1">
                ARTIFACT ID
              </p>
              <p className="text-sm font-mono text-[#98dc48] truncate">{artifact.id}</p>
            </div>

            <div>
              <p className="text-xs text-[#7a8699] font-mono mb-1">STORED</p>
              <p className="text-sm">{formattedStoredDate}</p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1b1e26] border-2 border-[#98dc48] rounded-lg p-4">
            <p className="text-lg">CURATOR SCORE</p>
            <p className="text-3xl font-bold">{artifact.curatorScore}</p>
          </div>

          <div className="bg-[#1b1e26] border-2 border-[#5ecde3] rounded-lg p-4">
            <p className="text-xs">REPLICATION RATE</p>
            <p className="text-lg font-bold">{replicationRate}%</p>
          </div>

          <div className="bg-[#1b1e26] border-2 border-[#f2c94c] rounded-lg p-4">
            <p className="text-xs">ENDORSEMENTS</p>
            <p className="text-lg font-bold">
              {artifact.endorsements || "No Endorsement"}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mb-8">
          <button className="flex-1 flex items-center justify-center gap-2 bg-[#1b1e26] border-2 border-[#98dc48] rounded-lg py-3">
            <Heart size={16} />
            ENDORSE
          </button>

          <button
            onClick={() => setShowChallenge(!showChallenge)}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1b1e26] border-2 border-[#f2c94c] rounded-lg py-3"
          >
            <Flag size={16} />
            CHALLENGE
          </button>

          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1b1e26] border-2 border-[#5ecde3] rounded-lg py-3"
          >
            <Share2 size={16} />
            SHARE
          </button>
        </div>
      </main>
    </div>
  );
}
