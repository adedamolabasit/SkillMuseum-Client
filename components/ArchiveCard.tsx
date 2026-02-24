'use client';

import React from 'react';
import { PerformanceArtifact, STATUS_CONFIG } from '@/lib/archive-types';

interface ArchiveCardProps {
  artifact: PerformanceArtifact;
  onClick?: () => void;
}

export const ArchiveCard: React.FC<ArchiveCardProps> = ({ artifact, onClick }) => {
  const statusConfig = STATUS_CONFIG[artifact.status];
  const replicationRate = artifact.replicationAttempts > 0 
    ? ((artifact.successfulReplications / artifact.replicationAttempts) * 100).toFixed(1)
    : '0.0';

  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-[#1b1e26] rounded-lg border-2 transition-all hover:shadow-lg overflow-hidden group"
      style={{ borderColor: statusConfig.borderColor }}
    >
      {/* Plaque Style Header */}
      <div
        className="px-4 py-3 text-xs font-bold uppercase text-center"
        style={{
          backgroundColor: statusConfig.bgColor,
          color: statusConfig.color,
        }}
      >
        {statusConfig.label}
      </div>

      {/* Video Preview */}
      {artifact.videoUrl && (
        <div className="relative w-full aspect-video bg-black overflow-hidden group-hover:opacity-80 transition-opacity">
          <video
            src={artifact.videoUrl}
            className="w-full h-full object-cover"
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => e.currentTarget.pause()}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12141a] to-transparent opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-[#98dc48] rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100">
              <span className="text-[#12141a] font-bold">▶</span>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="p-4">
        {/* ID and Title */}
        <div className="mb-3">
          <p className="text-xs text-[#7a8699] font-mono mb-1">ID: {artifact.id}</p>
          <h3 className="text-sm font-bold text-[#dbe3eb] leading-snug line-clamp-2">
            {artifact.title}
          </h3>
        </div>

        {/* Creator and Game */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          <div className="bg-[#0f1116] p-2 rounded border border-[#232730]">
            <p className="text-[#7a8699] text-xs font-mono">CREATOR</p>
            <p className="text-[#dbe3eb] font-bold truncate">{artifact.creator}</p>
          </div>
          <div className="bg-[#0f1116] p-2 rounded border border-[#232730]">
            <p className="text-[#7a8699] text-xs font-mono">GAME</p>
            <p className="text-[#dbe3eb] font-bold truncate">{artifact.game}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-[#0f1116] p-2 rounded border border-[#232730]">
            <p className="text-[#7a8699] text-xs font-mono">CURATOR SCORE</p>
            <p className="text-[#98dc48] font-bold text-sm">{artifact.curatorScore}</p>
          </div>
          <div className="bg-[#0f1116] p-2 rounded border border-[#232730]">
            <p className="text-[#7a8699] text-xs font-mono">REPLICATION</p>
            <p className="text-[#5ecde3] font-bold text-sm">{replicationRate}%</p>
          </div>
          <div className="bg-[#0f1116] p-2 rounded border border-[#232730]">
            <p className="text-[#7a8699] text-xs font-mono">ENDORSEMENTS</p>
            <p className="text-[#f2c94c] font-bold text-sm">{artifact.endorsements}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {artifact.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-[#232730] text-[#5ecde3] rounded border border-[#5ecde3] font-mono"
            >
              #{tag}
            </span>
          ))}
          {artifact.tags.length > 3 && (
            <span className="text-xs px-2 py-1 text-[#7a8699]">+{artifact.tags.length - 3}</span>
          )}
        </div>
      </div>

      {/* Bottom Border Accent */}
      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, ${statusConfig.color}00, ${statusConfig.color}80, ${statusConfig.color}00)`
        }}
      />
    </div>
  );
};
