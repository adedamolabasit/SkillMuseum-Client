"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useArchive } from "@/shared/lib/archive-context";
import { ArchiveCard } from "./ArchiveCard";
import { useUserAssets } from "@/shared/api/hooks/useAssets";
import {
  PerformanceStatus,
  PerformanceArtifact,
} from "@/shared/lib/archive-types";
import { useProfile } from "@/shared/api/hooks/useAuth";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useLogout } from "@privy-io/react-auth";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { useLogoutUser } from "@/shared/api/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";

type MyAsset = {
  id: string;
  assetId: string;
  title: string;
  game: string;
  description: string;
  tags: string[];
  difficulty: "easy" | "medium" | "hard" | "impossible";
  statusTier: PerformanceStatus;
  status: "processing" | "published" | "failed" | string;
  mediaUrl: string;
  uploadStatus: "pending_upload" | "uploaded" | "failed" | string;
  processingStatus: "idle" | "processing" | "completed" | string;
  moderationState: "pending" | "approved" | "rejected" | string;
  createdAt: string;
};

export interface UserProfile {
  id: string;
  privyUserId: string;
  email: string;
  handle: string;
  createdAt: string;
  updatedAt: string;
}

export const CuratorProfile: React.FC = () => {
  const { data, isLoading } = useUserAssets();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { curator, artifacts } = useArchive();
  const router = useRouter();

  const assets: MyAsset[] = (data?.assets as MyAsset[]) ?? [];
  const user: UserProfile =
    (profile?.user as UserProfile) ?? ({} as UserProfile);

  console.log(assets, "kk");

  const [activeTab, setActiveTab] = useState<"stored" | "endorsed">("stored");

  const [editOpen, setEditOpen] = useState(false);
  const [handleInput, setHandleInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const logoutMutation = useLogoutUser();
  const queryClient = useQueryClient();

  const { logout } = useLogout({
    onSuccess: () => {
      logoutMutation.mutate();
      useAuthStore.getState().clearSession();
      queryClient.clear();
    },
  });

  useEffect(() => {
    if (user?.handle) setHandleInput(user.handle);
    if (curator?.bio) setBioInput(curator.bio);
  }, [user, curator]);

  const handleDisconnect = () => {
    logout();
  };

  const handleSaveProfile = () => {
    console.log({
      handle: handleInput,
      bio: bioInput,
    });

    setEditOpen(false);
  };

  if (!curator) {
    return (
      <div className="bg-[#1b1e26] border-2 border-[#232730] rounded-lg p-12 text-center">
        <p className="text-[#8fa0b3] text-sm">
          Please sign in to view your curator profile.
        </p>
      </div>
    );
  }

  const curatorArtifacts = artifacts.filter((a) => a.creator === curator.name);

  const stats = {
    totalStored: curatorArtifacts.length,
    totalEndorsements: curatorArtifacts.reduce(
      (sum, a) => sum + a.endorsements,
      0,
    ),
    avgScore:
      curatorArtifacts.length > 0
        ? (
            curatorArtifacts.reduce((sum, a) => sum + a.curatorScore, 0) /
            curatorArtifacts.length
          ).toFixed(1)
        : "0",
  };

  const [selectedStatus, setSelectedStatus] = useState<
    PerformanceStatus | "ALL"
  >("ALL");

  const [sortBy, setSortBy] = useState<"recent" | "trending" | "score">(
    "recent",
  );

  const transformedArtifacts: PerformanceArtifact[] = useMemo(() => {
    return assets.map((asset) => ({
      id: asset.id,
      assetId: asset.assetId,
      title: asset.title,
      creator: user.handle,
      game: asset.game,
      description: asset.description,
      status: asset.statusTier,
      curatorScore: 0,
      replicationAttempts: 0,
      successfulReplications: 0,
      endorsements: 0,
      tags: asset.tags ?? [],
      videoUrl: asset.mediaUrl,
      storedAt: moment(asset.createdAt).toDate(),
      uploadStatus: asset.uploadStatus,
      processingStatus: asset.processingStatus,
      moderationState: asset.moderationState,
    }));
  }, [assets, user]);

  const filteredArtifacts = useMemo(() => {
    return transformedArtifacts.filter((artifact) =>
      selectedStatus === "ALL" ? true : artifact.status === selectedStatus,
    );
  }, [transformedArtifacts, selectedStatus]);

  const sortedArtifacts = useMemo(() => {
    return [...filteredArtifacts].sort((a, b) => {
      switch (sortBy) {
        case "trending":
          return b.endorsements - a.endorsements;

        case "score":
          return b.curatorScore - a.curatorScore;

        default:
          return (
            new Date(b.storedAt).getTime() - new Date(a.storedAt).getTime()
          );
      }
    });
  }, [filteredArtifacts, sortBy]);

  console.log(sortedArtifacts, "hdjs");

  if (isLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-[#12141a] flex items-center justify-center">
        <p className="text-[#8fa0b3]">Loading artifacts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative bg-[#1b1e26] border-2 border-[#98dc48] rounded-lg p-8">
        <button
          onClick={handleDisconnect}
          className="absolute top-4 right-4 flex items-center gap-2 bg-[#0f1116] border border-[#232730] text-[#dbe3eb] px-4 py-2 rounded-md text-sm hover:border-[#98dc48] hover:text-[#98dc48] cursor-pointer"
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
          Disconnect
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#98dc48] to-[#5ecde3] flex items-center justify-center">
            <span className="text-3xl font-bold text-black">
              {user.handle?.charAt(0)}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1
                className="text-3xl sm:text-4xl font-bold text-[#dbe3eb] uppercase"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
              >
                {user.handle}
              </h1>

              <button
                onClick={() => setEditOpen(true)}
                className="text-[#8fa0b3] hover:text-[#98dc48] cursor-pointer"
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
            </div>

            <p className="text-[#8fa0b3] text-sm mb-3">
              {curator.bio ||
                "Master of performance. Keeper of moments. Legend in the making."}
            </p>

            <div className="text-xs text-[#7a8699] font-mono">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="ENDORSEMENT POWER"
            value={curator.endorsementPower}
            color="#98dc48"
          />

          <StatCard label="STORED" value={assets.length} color="#5ecde3" />

          <StatCard
            label="TOTAL ENDORSEMENTS"
            value={stats.totalEndorsements}
            color="#f2c94c"
          />

          <StatCard label="AVG SCORE" value={stats.avgScore} color="#9d72ff" />
        </div>
      </div>

      <div className="flex gap-2 border-b-2 border-[#232730]">
        {(["stored", "endorsed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-bold text-sm uppercase transition-all ${
              activeTab === tab
                ? "text-[#98dc48] border-b-2 border-[#98dc48]"
                : "text-[#8fa0b3] hover:text-[#dbe3eb]"
            }`}
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "0.7rem",
            }}
          >
            {tab === "stored" ? `Stored (${stats.totalStored})` : "Endorsed"}
          </button>
        ))}
      </div>

      <div>
        {!isLoading && sortedArtifacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedArtifacts.map((artifact) => (
              <ArchiveCard
                // onClick={() => router.push(`/archive/${artifact.id}`)}
                key={artifact.id}
                artifact={artifact}
                uploadStatus={artifact.uploadStatus}
                processingStatus={artifact.processingStatus}
                moderationState={artifact.moderationState}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#1b1e26]  rounded-lg w-full max-w-md p-6">
            <h2
              className="text-lg text-[#dbe3eb] mb-6 uppercase"
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: "0.8rem",
              }}
            >
              Edit Profile
            </h2>

            <div className="mb-4">
              <label className="text-xs text-[#7a8699] font-mono mb-1 block">
                HANDLE
              </label>

              <input
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                className="w-full bg-[#0f1116] border border-[#232730] rounded-md px-3 py-2 text-[#dbe3eb]"
              />
            </div>

            <div className="mb-6">
              <label className="text-xs text-[#7a8699] font-mono mb-1 block">
                STATUS
              </label>

              <textarea
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                rows={3}
                className="w-full bg-[#0f1116] border border-[#232730] rounded-md px-3 py-2 text-[#dbe3eb]"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 text-sm border border-[#232730] rounded-md text-[#8fa0b3] cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 text-sm bg-[#98dc48] text-black font-bold rounded-md cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#1b1e26] border-2 border-[#232730] rounded-lg p-6">
        <h2
          className="text-xl font-bold text-[#dbe3eb] uppercase mb-4"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          Curator Achievements
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { icon: "📚", title: "Archivist", desc: "Stored 5 artifacts" },
            { icon: "⭐", title: "Recognizer", desc: "50+ endorsements" },
            { icon: "🏆", title: "Elite Curator", desc: "Avg score 80+" },
            { icon: "👑", title: "Legend", desc: "Immortal artifact" },
          ].map((achievement, i) => (
            <div
              key={i}
              className="bg-[#0f1116] border border-[#232730] rounded-lg p-3 text-center opacity-50 hover:opacity-100 transition"
            >
              <div className="text-2xl mb-1">{achievement.icon}</div>
              <p className="text-[#dbe3eb] text-xs font-bold">
                {achievement.title}
              </p>
              <p className="text-[#7a8699] text-xs mt-1">{achievement.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) => (
  <div className="bg-[#0f1116] border border-[#232730] rounded-lg p-4 text-center">
    <p className="text-[#7a8699] text-xs font-mono mb-1">{label}</p>
    <p className="text-2xl font-bold" style={{ color }}>
      {value}
    </p>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="bg-[#1b1e26] border-2 border-dashed border-[#232730] rounded-lg p-12 text-center">
    <p className="text-[#8fa0b3] text-sm mb-2">NO ARTIFACTS FOUND</p>

    <p className="text-[#7a8699] text-xs">
      Try adjusting filters or submit a new performance.
    </p>
  </div>
);
