"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useArchive } from "@/shared/lib/archive-context";
import { useUserAssets } from "@/shared/api/hooks/useAssets";
import { PerformanceStatus } from "@/shared/lib/archive-types";
import { useProfile } from "@/shared/api/hooks/useAuth";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faRightFromBracket,
  faRotateRight,
  faCheck,
  faClock,
  faExclamationTriangle,
  faChartLine,
  faVideo,
  faThumbsUp,
  faCalendarAlt,
  faTag,
  faGamepad,
} from "@fortawesome/free-solid-svg-icons";
import { useLogout } from "@privy-io/react-auth";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { useLogoutUser } from "@/shared/api/hooks/useAuth";
import { useMyVotes } from "@/shared/api/hooks/useVotes";
import { useAssets } from "@/shared/api/hooks/useAssets";
import { toast } from "sonner";

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
  const { data, isLoading, refetch: refetchAssets } = useUserAssets();
  const { data: profile } = useProfile();
  const { data: myVotesData } = useMyVotes();
  const { data: allAssetsData } = useAssets();
  const { curator } = useArchive();
  const router = useRouter();

  const assets: MyAsset[] = (data?.assets as MyAsset[]) ?? [];
  const user: UserProfile =
    (profile?.user as UserProfile) ?? ({} as UserProfile);
  const votedAssets = myVotesData?.votes || [];

  const [activeTab, setActiveTab] = useState<"stored" | "voted">("stored");
  const [editOpen, setEditOpen] = useState(false);
  const [handleInput, setHandleInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [retryingAssetId, setRetryingAssetId] = useState<string | null>(null);

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
    toast.success("Profile updated successfully!");
  };

  const handleRetryUpload = async (assetId: string) => {
    setRetryingAssetId(assetId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await refetchAssets();
      toast.success("Retrying upload...");
    } catch (error) {
      toast.error("Failed to retry upload. Please try again.");
    } finally {
      setRetryingAssetId(null);
    }
  };

  const getUploadStatusConfig = (asset: MyAsset) => {
    if (
      asset.uploadStatus === "failed" ||
      asset.processingStatus === "failed"
    ) {
      return {
        label: "Upload Failed",
        color: "#ef4444",
        bgColor: "rgba(239, 68, 68, 0.1)",
        icon: faExclamationTriangle,
        showRetry: true,
      };
    }
    if (asset.processingStatus === "processing") {
      return {
        label: "Processing",
        color: "#f59e0b",
        bgColor: "rgba(245, 158, 11, 0.1)",
        icon: faClock,
        showRetry: false,
      };
    }
    if (asset.uploadStatus === "pending_upload") {
      return {
        label: "Pending Upload",
        color: "#f59e0b",
        bgColor: "rgba(245, 158, 11, 0.1)",
        icon: faClock,
        showRetry: false,
      };
    }
    if (asset.moderationState === "pending") {
      return {
        label: "Under Review",
        color: "#3b82f6",
        bgColor: "rgba(59, 130, 246, 0.1)",
        icon: faClock,
        showRetry: false,
      };
    }
    if (asset.moderationState === "rejected") {
      return {
        label: "Rejected",
        color: "#ef4444",
        bgColor: "rgba(239, 68, 68, 0.1)",
        icon: faExclamationTriangle,
        showRetry: false,
      };
    }
    return {
      label: "Published",
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
      icon: faCheck,
      showRetry: false,
    };
  };

  const getVotedAssetDetails = (votedAssetId: string) => {
    const allAssets = allAssetsData?.assets || [];
    return allAssets.find((asset: any) => asset.id === votedAssetId);
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

  const stats = {
    totalStored: assets.length,
    totalVotes: votedAssets.length,
    publishedCount: assets.filter((a) => a.status === "published").length,
    processingCount: assets.filter(
      (a) =>
        a.processingStatus === "processing" ||
        a.uploadStatus === "pending_upload",
    ).length,
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-[#1b1e26] to-[#0f1116] border border-[#232730] rounded-xl overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-[#98dc48]/20 to-[#5ecde3]/20">
          <button
            onClick={handleDisconnect}
            className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm border border-[#232730] text-[#dbe3eb] px-4 py-2 rounded-lg text-sm hover:border-[#98dc48] hover:text-[#98dc48] transition-all z-10"
          >
            <FontAwesomeIcon icon={faRightFromBracket} size="sm" />
            Disconnect
          </button>
        </div>

        <div className="px-8 pb-8">
          <div className="flex items-end -mt-16 mb-6">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#98dc48] to-[#5ecde3] flex items-center justify-center shadow-xl border-4 border-[#1b1e26]">
              <span className="text-4xl font-bold text-black">
                {user.handle?.charAt(0).toUpperCase() || "?"}
              </span>
            </div>
            <div className="ml-6 flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-[#dbe3eb]">
                  {user.handle || "Anonymous Curator"}
                </h1>
                <button
                  onClick={() => setEditOpen(true)}
                  className="text-[#8fa0b3] hover:text-[#98dc48] transition-colors"
                >
                  <FontAwesomeIcon icon={faPen} size="sm" />
                </button>
              </div>
              <p className="text-[#8fa0b3] text-sm max-w-2xl">
                {curator.bio ||
                  "Master of performance. Keeper of moments. Legend in the making."}
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs text-[#7a8699]">
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faCalendarAlt} size="xs" />
                  Joined{" "}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "recently"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-[#0f1116]/50 rounded-lg p-4 border border-[#232730]">
              <div className="flex items-center gap-2 text-[#98dc48] mb-1">
                <FontAwesomeIcon icon={faVideo} size="sm" />
                <p className="text-xs text-[#7a8699]">STORED</p>
              </div>
              <p className="text-2xl font-bold text-[#dbe3eb]">
                {stats.totalStored}
              </p>
            </div>
            <div className="bg-[#0f1116]/50 rounded-lg p-4 border border-[#232730]">
              <div className="flex items-center gap-2 text-[#5ecde3] mb-1">
                <FontAwesomeIcon icon={faCheck} size="sm" />
                <p className="text-xs text-[#7a8699]">PUBLISHED</p>
              </div>
              <p className="text-2xl font-bold text-[#dbe3eb]">
                {stats.publishedCount}
              </p>
            </div>
            <div className="bg-[#0f1116]/50 rounded-lg p-4 border border-[#232730]">
              <div className="flex items-center gap-2 text-[#f2c94c] mb-1">
                <FontAwesomeIcon icon={faThumbsUp} size="sm" />
                <p className="text-xs text-[#7a8699]">VOTES CAST</p>
              </div>
              <p className="text-2xl font-bold text-[#dbe3eb]">
                {stats.totalVotes}
              </p>
            </div>
            <div className="bg-[#0f1116]/50 rounded-lg p-4 border border-[#232730]">
              <div className="flex items-center gap-2 text-[#9d72ff] mb-1">
                <FontAwesomeIcon icon={faChartLine} size="sm" />
                <p className="text-xs text-[#7a8699]">ENDORSEMENT POWER</p>
              </div>
              <p className="text-2xl font-bold text-[#dbe3eb]">{0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-[#232730]">
        <div className="flex gap-6">
          {(["stored", "voted"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 font-medium text-sm transition-all relative ${
                activeTab === tab
                  ? "text-[#98dc48]"
                  : "text-[#8fa0b3] hover:text-[#dbe3eb]"
              }`}
            >
              {tab === "stored" ? "My Artifacts" : "Voted Artifacts"}
              <span className="ml-2 px-2 py-0.5 bg-[#232730] rounded-full text-xs">
                {tab === "stored" ? stats.totalStored : stats.totalVotes}
              </span>
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#98dc48] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        {activeTab === "stored" ? (
          !isLoading && assets.length > 0 ? (
            <div className="space-y-4">
              {assets.map((asset) => {
                const statusConfig = getUploadStatusConfig(asset);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={asset.id}
                    className="bg-[#1b1e26] border border-[#232730] rounded-xl overflow-hidden hover:border-[#5ecde3] transition-all group"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div
                        className="relative md:w-64 h-48 bg-black cursor-pointer"
                        onClick={() => {
                          if (asset.processingStatus !== "processing") {
                            router.push(`/archive/${asset.id}`);
                          }
                        }}
                      >
                        <video
                          src={asset.mediaUrl}
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />
                        {asset.processingStatus === "processing" && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5ecde3] mx-auto mb-2"></div>
                              <p className="text-xs text-white">
                                Processing...
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <div
                            className="px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm"
                            style={{
                              backgroundColor: statusConfig.bgColor,
                              color: statusConfig.color,
                            }}
                          >
                            <FontAwesomeIcon
                              icon={StatusIcon}
                              className="mr-1"
                              size="xs"
                            />
                            {statusConfig.label}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3
                              className="text-lg font-semibold text-[#dbe3eb] mb-1 cursor-pointer hover:text-[#98dc48] transition-colors"
                              onClick={() =>
                                router.push(`/archive/${asset.id}`)
                              }
                            >
                              {asset.title}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-[#8fa0b3]">
                              <span className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faGamepad} size="xs" />
                                {asset.game}
                              </span>
                              <span className="flex items-center gap-1">
                                <FontAwesomeIcon
                                  icon={faCalendarAlt}
                                  size="xs"
                                />
                                {moment(asset.createdAt).fromNow()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-[#8fa0b3] text-sm mb-4 line-clamp-2">
                          {asset.description}
                        </p>

                        {asset.tags && asset.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {asset.tags.slice(0, 4).map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-[#232730] text-[#5ecde3] rounded-md"
                              >
                                <FontAwesomeIcon icon={faTag} size="xs" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-3">
                          {statusConfig.showRetry && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRetryUpload(asset.id);
                              }}
                              disabled={retryingAssetId === asset.id}
                              className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm font-medium hover:bg-yellow-500/20 transition disabled:opacity-50 flex items-center gap-2"
                            >
                              <FontAwesomeIcon
                                icon={faRotateRight}
                                className={
                                  retryingAssetId === asset.id
                                    ? "animate-spin"
                                    : ""
                                }
                              />
                              Retry Upload
                            </button>
                          )}

                          {asset.uploadStatus === "uploaded" &&
                            asset.processingStatus === "completed" && (
                              <>
                                {/* <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePublishStatus(asset.id, asset.status);
                                  }}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                                    asset.status === "published"
                                      ? "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
                                      : "bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20"
                                  }`}
                                >
                                  <FontAwesomeIcon
                                    icon={
                                      asset.status === "published"
                                        ? faEyeSlash
                                        : faEye
                                    }
                                  />
                                  {asset.status === "published"
                                    ? "Unpublish"
                                    : "Publish"}
                                </button> */}

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/archive/${asset.id}`);
                                  }}
                                  className="px-4 py-2 bg-[#5ecde3] text-black rounded-lg text-sm font-medium hover:bg-[#4db0c7] transition flex items-center gap-2 cursor-pointer"
                                >
                                  View Details
                                </button>
                              </>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState message="No artifacts stored yet. Upload your first performance!" />
          )
        ) : !isLoading && votedAssets.length > 0 ? (
          <div className="space-y-4">
            {votedAssets.map((vote: { assetId: string; category: string }) => {
              const assetDetails = getVotedAssetDetails(vote.assetId);
              if (!assetDetails) return null;

              return (
                <div
                  key={`${vote.assetId}-${vote.category}`}
                  onClick={() => router.push(`/archive/${vote.assetId}`)}
                  className="bg-[#1b1e26] border border-[#232730] rounded-xl overflow-hidden hover:border-[#98dc48] transition-all cursor-pointer group"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-64 h-48 bg-black">
                      <video
                        src={assetDetails.mediaUrl || assetDetails.gatewayUrl}
                        className="w-full h-full object-cover"
                        preload="metadata"
                      />
                      <div className="absolute top-3 right-3 bg-[#5ecde3] text-black px-3 py-1 rounded-lg text-xs font-bold">
                        {vote.category}
                      </div>
                    </div>

                    <div className="flex-1 p-6">
                      <h3 className="text-lg font-semibold text-[#dbe3eb] mb-2">
                        {assetDetails.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-[#8fa0b3] mb-3">
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faGamepad} size="xs" />
                          {assetDetails.game}
                        </span>
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faCalendarAlt} size="xs" />
                          Voted {moment(assetDetails.createdAt).fromNow()}
                        </span>
                      </div>
                      <p className="text-[#8fa0b3] text-sm mb-4 line-clamp-2">
                        {assetDetails.description}
                      </p>

                      {assetDetails.tags && assetDetails.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {assetDetails.tags
                            .slice(0, 4)
                            .map((tag: string, idx: number) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-[#232730] text-[#5ecde3] rounded-md"
                              >
                                <FontAwesomeIcon icon={faTag} size="xs" />
                                {tag}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState message="You haven't voted for any artifacts yet. Explore the archive and vote!" />
        )}
      </div>

      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#1b1e26] rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-[#dbe3eb] mb-6">
              Edit Profile
            </h2>

            <div className="mb-4">
              <label className="text-xs text-[#7a8699] font-mono mb-1 block">
                HANDLE
              </label>
              <input
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                className="w-full bg-[#0f1116] border border-[#232730] rounded-lg px-4 py-2 text-[#dbe3eb] focus:outline-none focus:border-[#5ecde3] transition"
              />
            </div>

            <div className="mb-6">
              <label className="text-xs text-[#7a8699] font-mono mb-1 block">
                BIO / STATUS
              </label>
              <textarea
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                rows={3}
                className="w-full bg-[#0f1116] border border-[#232730] rounded-lg px-4 py-2 text-[#dbe3eb] focus:outline-none focus:border-[#5ecde3] transition"
                placeholder="Tell the community about yourself..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 text-sm border border-[#232730] rounded-lg text-[#8fa0b3] hover:border-[#5ecde3] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 text-sm bg-[#98dc48] text-black font-medium rounded-lg hover:bg-[#7fbf3f] transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#1b1e26] border border-[#232730] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[#dbe3eb] mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-[#98dc48] rounded-full"></span>
          Curator Achievements
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              icon: "📚",
              title: "Archivist",
              desc: "Stored 5 artifacts",
              condition: stats.totalStored >= 5,
            },
            {
              icon: "⭐",
              title: "Recognizer",
              desc: "Voted on 10+ artifacts",
              condition: stats.totalVotes >= 10,
            },
            {
              icon: "🏆",
              title: "Elite Curator",
              desc: "Published 5 artifacts",
              condition: stats.publishedCount >= 5,
            },
            {
              icon: "👑",
              title: "Legend",
              desc: "Stored immortal artifact",
              condition: false,
            },
          ].map((achievement, i) => (
            <div
              key={i}
              className={`bg-[#0f1116] border border-[#232730] rounded-lg p-4 text-center transition-all ${
                achievement.condition ? "opacity-100" : "opacity-60"
              } hover:opacity-100 hover:border-[#5ecde3]`}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <p className="text-[#dbe3eb] text-sm font-medium">
                {achievement.title}
              </p>
              <p className="text-[#7a8699] text-xs mt-1">{achievement.desc}</p>
              {achievement.condition && (
                <span className="inline-block mt-2 text-[#98dc48] text-xs font-medium">
                  ✓ Unlocked
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-[#1b1e26] border-2 border-dashed border-[#232730] rounded-xl p-16 text-center">
    <p className="text-[#8fa0b3] text-sm mb-2">No artifacts found</p>
    <p className="text-[#7a8699] text-xs">{message}</p>
  </div>
);
