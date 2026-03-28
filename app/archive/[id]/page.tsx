"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Heart, Share2, Flag, Info } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import moment from "moment";
import { toast } from "sonner";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

import { useAsset } from "@/shared/api/hooks/useAssets";
import { STATUS_CONFIG } from "@/shared/lib/archive-types";
import CRTOverlay from "@/components/Archive/CRTOverlay";
import { useVote, useMyVotes, useAssetsVoteResults } from "@/shared/api/hooks/useVotes";
import { useAnyUserAssets } from "@/shared/api/hooks/useAssets";

export default function AssetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const assetId = params?.id as string;

  // State for current artifact (can be changed by clicking related artifacts)
  const [currentArtifactId, setCurrentArtifactId] = useState<string>(assetId);
  const [currentArtifact, setCurrentArtifact] = useState<any>(null);
  
  // Fetch current artifact data
  const { data, isLoading, isError, refetch: refetchCurrentAsset } = useAsset(currentArtifactId);
  console.log(data,"kdhaaka")
  
  // Fetch user's other artifacts
  const { data: userAssetsData, isLoading: userAssetsLoading, refetch: refetchUserAssets } = useAnyUserAssets(
    currentArtifact?.creatorUserId
  );

  const [showChallenge, setShowChallenge] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const { data: myVotesData, refetch: refetchMyVotes, isLoading: myVotesLoading } = useMyVotes();
  const { data: voteResults, refetch: refetchVoteResults } = useAssetsVoteResults();
  const { mutate: castVote, isPending } = useVote();

  const [localVotes, setLocalVotes] = useState<{ [category: string]: string }>({});

  // Update current artifact when data changes
  useEffect(() => {
    if (data?.asset) {
      setCurrentArtifact(data.asset);
    }
  }, [data]);

  // Update URL when artifact changes (for sharing)
  useEffect(() => {
    if (currentArtifactId !== assetId) {
      router.replace(`/archive/${currentArtifactId}`, { scroll: false });
    }
  }, [currentArtifactId, router, assetId]);

  // Refetch user assets when creator changes
  useEffect(() => {
    if (currentArtifact?.creatorUserId) {
      refetchUserAssets();
    }
  }, [currentArtifact?.creatorUserId, refetchUserAssets]);

  // Get user assets (excluding current artifact)
  const userAssets = userAssetsData?.assets?.filter(
    (asset: any) => asset.id !== currentArtifactId
  ) || [];

  // Get vote counts for current artifact
  const voteCounts = voteResults?.results?.reduce((acc: any, v: any) => {
    if (v.assetId === currentArtifactId) {
      acc[v.category] = Number(v.count);
    }
    return acc;
  }, {} as Record<string, number>) || {};

  // Categories for voting
  const categories = ["Most Skillful", "Curator's Pick", "Most Unreplicable"];

  useEffect(() => {
    if (myVotesData?.votes) {
      const votesMap: { [category: string]: string } = {};
      myVotesData.votes.forEach((v: { assetId: string; category: string }) => {
        votesMap[v.category] = v.assetId;
      });
      setLocalVotes(votesMap);
    }
  }, [myVotesData]);

  if (isLoading && !currentArtifact) {
    return (
      <div className="min-h-screen bg-[#12141a] flex items-center justify-center">
        <p className="text-[#8fa0b3]">Loading artifact...</p>
      </div>
    );
  }

  if ((isError || !currentArtifact) && !isLoading) {
    return (
      <div className="min-h-screen bg-[#12141a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8fa0b3] mb-4">Artifact not found</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-[#98dc48] text-black rounded font-bold hover:bg-[#7fbf3f] transition"
          >
            BACK
          </button>
        </div>
      </div>
    );
  }

  const statusConfig =
    STATUS_CONFIG[currentArtifact?.status as keyof typeof STATUS_CONFIG];

  const replicationRate =
    currentArtifact?.replicationAttempts > 0
      ? (
          (currentArtifact.successfulReplications / currentArtifact.replicationAttempts) *
          100
        ).toFixed(1)
      : "0.0";

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/archive/${currentArtifactId}`;

    if (navigator.share) {
      navigator.share({
        title: currentArtifact.title,
        text: `Check out this legendary performance: ${currentArtifact.title}`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.info("Link copied to clipboard");
    }
  };

  const formattedStoredDate = moment(currentArtifact?.createdAt).format(
    "MMMM Do YYYY, h:mm a"
  );

  const handleVote = (category: string) => {
    if (isPending) return;

    if (!captchaToken) {
      toast.info("Please verify you are human.");
      return;
    }

    const alreadyVotedAssetId = localVotes[category];

    if (alreadyVotedAssetId === currentArtifactId) {
      // Unvote - show confirmation
      toast.info(`Click "UNVOTE" to remove your vote from ${category}`, {
        duration: 3000,
        action: {
          label: "UNVOTE",
          onClick: () => confirmUnvote(category),
        },
      });
      return;
    }

    if (alreadyVotedAssetId && alreadyVotedAssetId !== currentArtifactId) {
      toast.info(
        `You have already voted for "${category}" on another asset. Unvote that first.`
      );
      return;
    }

    // Cast vote
    castVote(
      { assetId: currentArtifactId, category, captchaToken },
      {
        onSuccess: () => {
          refetchMyVotes();
          refetchVoteResults();
          toast.success(`Voted for ${category}!`);
          setIsVoteModalOpen(false);
          setCaptchaToken(null);
        },
        onError: (err: any) =>
          toast.error(
            "Oops! Something went wrong. Contact admin if it persists."
          ),
      }
    );
  };

  const confirmUnvote = (category: string) => {
    if (!captchaToken) {
      toast.info("Please verify you are human.");
      return;
    }

    castVote(
      { assetId: currentArtifactId, category, captchaToken },
      {
        onSuccess: () => {
          refetchMyVotes();
          refetchVoteResults();
          toast.success(`Unvoted from ${category}!`);
          setIsVoteModalOpen(false);
          setCaptchaToken(null);
        },
        onError: (err: any) =>
          toast.error(
            "Oops! Something went wrong. Contact admin if it persists."
          ),
      }
    );
  };

  const getVoteButtonStatus = (category: string) => {
    const votedAssetId = localVotes[category];
    const votedHere = votedAssetId === currentArtifactId;
    const votedElsewhere = votedAssetId && !votedHere;
    
    return {
      votedHere,
      votedElsewhere,
      disabled: votedElsewhere || isPending || myVotesLoading,
      tooltip: votedElsewhere
        ? `You already voted for "${category}" on another asset. Unvote that first to vote here.`
        : votedHere
        ? `You voted for this artifact in "${category}". Click to unvote.`
        : isPending
        ? "Vote in progress..."
        : myVotesLoading
        ? "Loading your votes..."
        : `Vote for this artifact in "${category}" category`,
    };
  };

  const handleVideoHover = (videoId: string, videoUrl: string) => {
    setHoveredVideoId(videoId);
    const videoElement = videoRefs.current[videoId];
    if (videoElement) {
      videoElement.play().catch(() => {});
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

  const handleArtifactChange = (newArtifactId: string) => {
    setCurrentArtifactId(newArtifactId);
    refetchCurrentAsset();
    toast.success("Loading artifact...");
  };

  return (
    <div className="min-h-screen bg-[#12141a] text-[#dbe3eb]">
      <CRTOverlay />

      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#12141a] border-b border-[#232730] py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-2 bg-[#1b1e26] border border-[#232730] rounded hover:border-[#98dc48] transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span className="text-xs font-mono">BACK</span>
          </button>

          <h1 className="text-center flex-1 text-xs font-bold">
            ARTIFACT DETAILS
          </h1>

          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:flex-1 space-y-6">
            {/* Status */}
            {statusConfig && (
              <div
                className="inline-block px-4 py-2 rounded text-xs font-bold uppercase text-center"
                style={{
                  backgroundColor: statusConfig?.bgColor,
                  color: statusConfig?.color,
                  textShadow: `0 0 5px ${statusConfig?.color}40`,
                }}
              >
                {statusConfig?.label}
              </div>
            )}

            {/* Title & Description */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
                {currentArtifact?.title}
              </h1>
              <p className="text-[#8fa0b3]">{currentArtifact?.description}</p>
            </div>

            {/* Main Video */}
            {currentArtifact?.gatewayUrl && (
              <div className="bg-[#1b1e26] border-2 border-[#232730] rounded-lg overflow-hidden">
                <video
                  key={currentArtifactId}
                  src={currentArtifact.gatewayUrl}
                  controls
                  autoPlay
                  className="w-full aspect-video"
                />
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#1b1e26] border-2 border-[#98dc48] rounded-lg p-4 text-center">
                <p className="text-lg">CURATOR SCORE</p>
                <p className="text-3xl font-bold">{currentArtifact?.curatorScore || 0}</p>
              </div>

              <div className="bg-[#1b1e26] border-2 border-[#5ecde3] rounded-lg p-4 text-center">
                <p className="text-xs">REPLICATION RATE</p>
                <p className="text-lg font-bold">{replicationRate}%</p>
              </div>

              <div className="bg-[#1b1e26] border-2 border-[#f2c94c] rounded-lg p-4 text-center">
                <p className="text-xs">ENDORSEMENTS</p>
                <p className="text-lg font-bold">
                  {currentArtifact?.endorsements || "No Endorsement"}
                </p>
              </div>
            </div>

            {/* Vote Buttons - Interactive Voting UI */}
            <div className="space-y-4">
              {categories.map((cat) => {
                const { votedHere, votedElsewhere, disabled, tooltip } = getVoteButtonStatus(cat);
                
                return (
                  <div
                    key={cat}
                    className="bg-[#1b1e26] border-2 border-[#5ecde3] rounded-lg p-4 flex justify-between items-center group relative"
                  >
                    <div>
                      <p className="font-bold">{cat}</p>
                      <p className="text-xs text-[#8fa0b3]">
                        {voteCounts[cat] || 0} total votes
                      </p>
                    </div>
                    
                    <div className="relative">
                      <button
                        onClick={() => {
                          if (votedHere) {
                            // If already voted here, show unvote confirmation
                            toast.info(`Click "UNVOTE" to remove your vote`, {
                              duration: 5000,
                              action: {
                                label: "UNVOTE",
                                onClick: () => {
                                  setSelectedCategory(cat);
                                  setIsVoteModalOpen(true);
                                },
                              },
                            });
                          } else if (!votedElsewhere) {
                            setSelectedCategory(cat);
                            setIsVoteModalOpen(true);
                          } else {
                            toast.info(tooltip);
                          }
                        }}
                        disabled={disabled && !votedHere}
                        className={`flex items-center gap-2 px-4 py-2 font-bold rounded transition ${
                          votedHere
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-[#5ecde3] text-black hover:bg-[#4db0c7]"
                        } ${disabled && !votedHere ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        {votedHere ? <FaArrowDown size={16} /> : <FaArrowUp size={16} />}
                        {votedHere ? "UNVOTE" : "VOTE"}
                      </button>
                      
                      {/* Tooltip */}
                      {tooltip && (
                        <div className="absolute right-0 top-full mt-2 w-64 bg-black/90 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          <div className="flex items-start gap-2">
                            <Info size={12} className="mt-0.5 flex-shrink-0" />
                            <span>{tooltip}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-[#1b1e26] border-2 border-[#98dc48] rounded-lg py-3 cursor-pointer hover:bg-[#98dc48] hover:text-black transition-colors duration-200">
                <Heart size={16} />
                ENDORSE
              </button>

              <button
                onClick={() => setShowChallenge(!showChallenge)}
                className="flex-1 flex items-center justify-center gap-2 bg-[#1b1e26] border-2 border-[#f2c94c] rounded-lg py-3 cursor-pointer hover:bg-[#f2c94c] hover:text-black transition-colors duration-200"
              >
                <Flag size={16} />
                CHALLENGE
              </button>

              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 bg-[#1b1e26] border-2 border-[#5ecde3] rounded-lg py-3 cursor-pointer hover:bg-[#5ecde3] hover:text-black transition-colors duration-200"
              >
                <Share2 size={16} />
                SHARE
              </button>
            </div>
          </div>

          {/* Right Sidebar - Artifact Info & More Artifacts - NO SCROLL */}
          <div className="lg:w-96">
            <div className="sticky top-20 space-y-4">
              {/* Artifact Info Card */}
              <div className="bg-[#1b1e26] border-2 border-[#232730] rounded-lg p-4 space-y-4">
                <h3 className="text-lg font-bold border-b border-[#232730] pb-2">
                  Artifact Info
                </h3>

                <div>
                  <p className="text-xs text-[#7a8699] font-mono mb-1 truncate">
                    CREATOR
                  </p>
                  <p className="text-sm font-bold truncate">{currentArtifact?.creatorUserId}</p>
                </div>

                <div>
                  <p className="text-xs text-[#7a8699] font-mono mb-1 truncate">
                    GAME
                  </p>
                  <p className="text-sm font-bold">{currentArtifact?.game}</p>
                </div>

                <div>
                  <p className="text-xs text-[#7a8699] font-mono mb-1">ARTIFACT ID</p>
                  <p className="text-sm font-mono text-[#98dc48] truncate">
                    {currentArtifactId}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#7a8699] font-mono mb-1">STORED</p>
                  <p className="text-sm">{formattedStoredDate}</p>
                </div>

                <div>
                  <p className="text-xs text-[#7a8699] font-mono mb-1">FILE SIZE</p>
                  <p className="text-sm">{currentArtifact?.fileSize || "2.3MB"}</p>
                </div>

                <div>
                  <p className="text-xs text-[#7a8699] font-mono mb-1">ON-CHAIN LINK</p>
                  <div className="flex items-center gap-2">
                    <a
                      href={currentArtifact?.onChainUrl || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#5ecde3] truncate text-sm flex-1"
                    >
                      {currentArtifact?.onChainUrl || "https://onchain.link/abc123"}
                    </a>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          currentArtifact?.onChainUrl || "https://onchain.link/abc123"
                        )
                      }
                      className="text-xs px-2 py-1 bg-[#232730] border border-[#5ecde3] rounded hover:bg-[#5ecde3] hover:text-black transition whitespace-nowrap"
                    >
                      COPY
                    </button>
                  </div>
                </div>

                {/* Tags */}
                {currentArtifact?.tags && currentArtifact.tags.length > 0 && (
                  <div>
                    <p className="text-xs text-[#7a8699] font-mono mb-2">TAGS</p>
                    <div className="flex flex-wrap gap-2">
                      {currentArtifact.tags.slice(0, 5).map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-[#232730] text-[#5ecde3] rounded border border-[#5ecde3] font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* More Artifacts Section - User's Other Artifacts */}
              <div className="bg-[#1b1e26] border-2 border-[#232730] rounded-lg p-4 space-y-4">
                <h3 className="text-lg font-bold border-b border-[#232730] pb-2">
                  More from {currentArtifact?.creatorUserId?.slice(0, 8)}...
                </h3>

                {userAssetsLoading ? (
                  <div className="text-center py-8">
                    <p className="text-[#8fa0b3] text-sm">Loading more artifacts...</p>
                  </div>
                ) : userAssets.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[#8fa0b3] text-sm">No more artifacts from this creator</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userAssets.map((item: any) => (
                      <div
                        key={item.id}
                        className={`flex gap-3 cursor-pointer hover:bg-[#232730] p-2 rounded transition group ${
                          currentArtifactId === item.id ? "bg-[#232730] border-l-2 border-[#5ecde3]" : ""
                        }`}
                        onClick={() => handleArtifactChange(item.id)}
                      >
                        <div 
                          className="relative w-32 h-20 bg-[#232730] border border-[#5ecde3] rounded flex-shrink-0 overflow-hidden"
                          onMouseEnter={() => handleVideoHover(item.id, item.mediaUrl || item.gatewayUrl)}
                          onMouseLeave={() => handleVideoLeave(item.id)}
                        >
                          <video
                            ref={(el) => {
                              if (el) videoRefs.current[item.id] = el;
                            }}
                            src={item.mediaUrl || item.gatewayUrl}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover"
                          />
                          {hoveredVideoId !== item.id && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-8 h-8 rounded-full bg-[#5ecde3]/80 flex items-center justify-center">
                                <div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-white border-b-4 border-b-transparent ml-1"></div>
                              </div>
                            </div>
                          )}
                          {currentArtifactId === item.id && (
                            <div className="absolute top-1 right-1 w-2 h-2 bg-[#5ecde3] rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{item.title}</p>
                          <p className="text-xs text-[#8fa0b3] mt-1">{item.game}</p>
                          <p className="text-xs text-[#7a8699] mt-1">
                            {moment(item.createdAt).fromNow()}
                          </p>
                          <p className="text-xs text-[#5ecde3] mt-1">
                            {item.statusTier || "Gallery Exhibit"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Vote Modal */}
      {isVoteModalOpen && selectedCategory && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsVoteModalOpen(false);
              setSelectedCategory(null);
            }
          }}
        >
          <div className="bg-[#1b1e26] p-6 rounded-lg w-11/12 max-w-md">
            <h2 className="text-xl text-[#dbe3eb] font-bold mb-3">
              {localVotes[selectedCategory] === currentArtifactId 
                ? `Unvote from: ${selectedCategory}`
                : `Vote for: ${selectedCategory}`}
            </h2>
            
            <p className="text-[#8fa0b3] text-sm mb-4">
              {localVotes[selectedCategory] === currentArtifactId
                ? `Are you sure you want to remove your vote for "${selectedCategory}"?`
                : `Cast your vote for "${currentArtifact?.title}" in the "${selectedCategory}" category.`}
            </p>

            <div className="space-y-3">
              {categories.map((cat) => {
                const votedAssetId = localVotes[cat];
                const votedHere = votedAssetId === currentArtifactId;
                const votedElsewhere = votedAssetId && !votedHere;
                const isCurrentCategory = cat === selectedCategory;
                const disabled = (votedElsewhere && !isCurrentCategory) || isPending;
                
                return (
                  <div
                    key={cat}
                    className="flex justify-between items-center bg-[#232730] rounded px-3 py-2"
                  >
                    <span className="text-[#8fa0b3]">{cat}</span>
                    <button
                      disabled={disabled}
                      onClick={() => {
                        if (votedHere && isCurrentCategory) {
                          confirmUnvote(cat);
                        } else if (!votedElsewhere) {
                          handleVote(cat);
                        } else {
                          toast.info(`You already voted for "${cat}" on another asset.`);
                        }
                      }}
                      className={`flex items-center gap-1 px-3 py-1 rounded font-bold
                        ${
                          votedHere
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : votedElsewhere
                            ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                            : "bg-[#5ecde3] text-black hover:bg-[#4db0c7]"
                        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      {votedHere ? <FaArrowDown /> : <FaArrowUp />}
                      {voteCounts[cat] ?? 0}
                      {votedHere && " (Unvote)"}
                      {votedElsewhere && " (Voted elsewhere)"}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center items-center bg-[#1b1e26] p-4 rounded-lg mt-4">
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onSuccess={(token) => setCaptchaToken(token)}
              />
            </div>

            <button
              onClick={() => {
                setIsVoteModalOpen(false);
                setSelectedCategory(null);
              }}
              className="mt-5 w-full bg-[#98dc48] text-black font-bold py-2 rounded hover:bg-[#7fbf3f] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}