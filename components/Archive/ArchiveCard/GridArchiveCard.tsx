"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faGamepad, 
  faCalendarAlt, 
  faStar, 
  faThumbsUp, 
  faFire, 
  faTag,
  faPlay
} from "@fortawesome/free-solid-svg-icons";
import { getDifficultyIcon } from "@/shared/utils/config";

interface GridArchiveCardProps {
  artifact: any;
  voteMap: Record<string, Record<string, number>>;
  hoveredVideoId: string | null;
  onVideoHover: (videoId: string) => void;
  onVideoLeave: (videoId: string) => void;
  videoRefs: React.MutableRefObject<{ [key: string]: HTMLVideoElement | null }>;
  onVideoLoad: (videoId: string) => void;
}

export const GridArchiveCard: React.FC<GridArchiveCardProps> = ({
  artifact,
  voteMap,
  hoveredVideoId,
  onVideoHover,
  onVideoLeave,
  videoRefs,
  onVideoLoad,
}) => {
  const router = useRouter();
  const difficultyConfig = getDifficultyIcon(artifact.difficulty);
  const DifficultyIcon = difficultyConfig.icon;
  const totalVotes = artifact.totalVotes;
  const voteCategories = Object.entries(voteMap[artifact.id] || {});
  const isHovered = hoveredVideoId === artifact.id;

  return (
    <div
      onClick={() => router.push(`/archive/${artifact.id}`)}
      className="bg-[#1b1e26] border border-[#232730] rounded-xl overflow-hidden hover:border-[#5ecde3] transition-all cursor-pointer group"
    >
      {/* Video Thumbnail with Hover Play */}
      <div 
        className="relative w-full aspect-video bg-black overflow-hidden"
        onMouseEnter={() => onVideoHover(artifact.id)}
        onMouseLeave={() => onVideoLeave(artifact.id)}
      >
        {artifact.videoUrl && (
          <>
            <video
              ref={(el) => {
                if (el) videoRefs.current[artifact.id] = el;
              }}
              src={artifact.videoUrl}
              className="w-full h-full object-cover"
              preload="metadata"
              muted
              loop
              playsInline
              onLoadedData={() => onVideoLoad(artifact.id)}
            />
            {/* Play button overlay when not hovering */}
            {!isHovered && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-[#5ecde3]/90 flex items-center justify-center">
                  <FontAwesomeIcon icon={faPlay} className="text-black ml-1" />
                </div>
              </div>
            )}
          </>
        )}
        {/* Status badge */}
        <div className="absolute top-2 left-2 z-10">
          <div className="px-2 py-1 rounded-md text-xs font-medium bg-black/70 backdrop-blur-sm text-[#5ecde3]">
            {artifact.statusDisplay}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-base font-semibold text-[#dbe3eb] line-clamp-1 flex-1">
            {artifact.title}
          </h3>
          <div 
            className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap"
            style={{ backgroundColor: `${difficultyConfig.color}20`, color: difficultyConfig.color }}
          >
            <FontAwesomeIcon icon={DifficultyIcon} size="xs" />
            <span>{difficultyConfig.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#8fa0b3] mb-2 flex-wrap">
          <span className="flex items-center gap-1">
            <FontAwesomeIcon icon={faGamepad} size="xs" />
            {artifact.game}
          </span>
          <span className="flex items-center gap-1">
            <FontAwesomeIcon icon={faCalendarAlt} size="xs" />
            {moment(artifact.storedAt).fromNow()}
          </span>
        </div>

        {/* <p className="text-[#8fa0b3] text-sm mb-3 line-clamp-2">
          {artifact.description}
        </p> */}

        {/* Stats Row */}
        <div className="flex items-center gap-4 mb-3 text-xs">
          <span className="flex items-center gap-1 text-[#f2c94c]">
            <FontAwesomeIcon icon={faStar} size="xs" />
            {artifact.curatorScore}
          </span>
          <span className="flex items-center gap-1 text-[#f2c94c]">
            <FontAwesomeIcon icon={faThumbsUp} size="xs" />
            {artifact.endorsements}
          </span>
          <span className="flex items-center gap-1 text-[#f2c94c]">
            <FontAwesomeIcon icon={faFire} size="xs" />
            {totalVotes}
          </span>
        </div>

        {/* Vote Categories */}
        {voteCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {voteCategories.slice(0, 2).map(([category, count]) => (
              <div key={category} className="text-xs px-2 py-1 bg-[#232730] rounded-md">
                <span className="text-[#7a8699]">{category}:</span>{' '}
                <span className="text-[#5ecde3] font-bold">{count}</span>
              </div>
            ))}
            {voteCategories.length > 2 && (
              <div className="text-xs px-2 py-1 bg-[#232730] rounded-md text-[#7a8699]">
                +{voteCategories.length - 2} more
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {artifact.tags && artifact.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {artifact.tags.slice(0, 3).map((tag: any, idx: any) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-[#232730] text-[#5ecde3] rounded-md"
              >
                <FontAwesomeIcon icon={faTag} size="xs" />
                {tag}
              </span>
            ))}
            {artifact.tags.length > 3 && (
              <span className="text-xs text-[#7a8699]">
                +{artifact.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};