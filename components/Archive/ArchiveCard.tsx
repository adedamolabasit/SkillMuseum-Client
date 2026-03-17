"use client";

import React, { useState } from "react";
import { STATUS_CONFIG } from "@/shared/lib/archive-types";
import { ArchiveCardProps } from "@/shared/types/archive";
import {
  FaCheckCircle,
  FaHourglass,
  FaTimesCircle,
  FaUpload,
  FaCogs,
  FaGavel,
  FaGavel as FaModeration,
} from "react-icons/fa";

interface ArchiveCardExtendedProps extends ArchiveCardProps {
  uploadStatus?: string;
  processingStatus?: string;
  moderationState?: string;
}

export const ArchiveCard: React.FC<ArchiveCardExtendedProps> = ({
  artifact,
  onClick,
  uploadStatus,
  processingStatus,
  moderationState: initialModerationState,
}) => {
  const statusConfig = STATUS_CONFIG[artifact.status];
  const replicationRate =
    artifact.replicationAttempts > 0
      ? (
          (artifact.successfulReplications / artifact.replicationAttempts) *
          100
        ).toFixed(1)
      : "0.0";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moderationState, setModerationState] = useState(
    initialModerationState,
  );

  const renderStatusIcon = (
    status: string,
    type: "upload" | "processing" | "moderation",
  ) => {
    switch (status.toLowerCase()) {
      case "pending":
      case "pending_upload":
        return <FaHourglass className="text-yellow-400" />;
      case "processing":
        return <FaCogs className="text-blue-400 animate-spin" />;
      case "uploaded":
      case "completed":
      case "approved":
        return <FaCheckCircle className="text-green-400" />;
      case "failed":
      case "rejected":
        return <FaTimesCircle className="text-red-400" />;
      case "draft":
      case "drafted":
        return <FaTimesCircle className="text-yellow-400" />;
      default:
        return type === "upload" ? (
          <FaUpload className="text-gray-400" />
        ) : (
          <FaModeration className="text-gray-400" />
        );
    }
  };

  const handleModerationUpdate = (status: string) => {
    setModerationState(status);
    setIsModalOpen(false);
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
          <div className="relative w-full aspect-video bg-black overflow-hidden group-hover:opacity-80 transition-opacity">
            <video
              src={artifact.videoUrl}
              className="w-full h-full object-cover"
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => e.currentTarget.pause()}
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#12141a] to-transparent opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-[#98dc48] rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100">
                <span className="text-[#12141a] font-bold">▶</span>
              </div>
            </div>
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

          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
            <div className="bg-[#0f1116] p-2 rounded border border-[#232730]">
              <p className="text-[#7a8699] font-mono">CREATOR</p>
              <p className="text-[#dbe3eb] font-bold truncate">
                {artifact.creator}
              </p>
            </div>
            <div className="bg-[#0f1116] p-2 rounded border border-[#232730]">
              <p className="text-[#7a8699] font-mono">GAME</p>
              <p className="text-[#dbe3eb] font-bold truncate">
                {artifact.game}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-[#0f1116] p-2 rounded border border-[#232730]">
              <p className="text-[#7a8699] text-xs font-mono">CURATOR SCORE</p>
              <p className="text-[#98dc48] font-bold text-sm">
                {artifact.curatorScore}
              </p>
            </div>
            <div className="bg-[#0f1116] p-2 rounded border border-[#232730]">
              <p className="text-[#7a8699] text-xs font-mono">REPLICATION</p>
              <p className="text-[#5ecde3] font-bold text-sm">
                {replicationRate}%
              </p>
            </div>
            <div className="bg-[#0f1116] p-2 rounded border border-[#232730]">
              <p className="text-[#7a8699] text-xs font-mono">ENDORSEMENTS</p>
              <p className="text-[#f2c94c] font-bold text-sm">
                {artifact.endorsements}
              </p>
            </div>
          </div>

          {(uploadStatus || processingStatus || moderationState) && (
            <div className="grid grid-cols-3 gap-2 text-xs text-center mt-2">
              {uploadStatus && (
                <div className="flex flex-col items-center bg-[#0f1116] p-2 rounded border border-[#232730]">
                  {renderStatusIcon(uploadStatus, "upload")}
                  <p className="text-[#7a8699] font-mono mt-1">UPLOAD</p>
                  <p className="text-[#98dc48] font-bold">{uploadStatus}</p>
                </div>
              )}
              {processingStatus && (
                <div className="flex flex-col items-center bg-[#0f1116] p-2 rounded border border-[#232730]">
                  {renderStatusIcon(processingStatus, "processing")}
                  <p className="text-[#7a8699] font-mono mt-1">PROCESSING</p>
                  <p className="text-[#5ecde3] font-bold">{processingStatus}</p>
                </div>
              )}
              {moderationState && (
                <div
                  className="flex flex-col items-center bg-[#0f1116] p-2 rounded border border-[#232730] cursor-pointer hover:bg-[#232730] transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                  }}
                >
                  {renderStatusIcon(moderationState, "moderation")}
                  <p className="text-[#7a8699] font-mono mt-1 flex items-center gap-1">
                    MODERATION <FaGavel className="text-[#f2c94c]" />
                  </p>
                  <p className="text-[#f2c94c] font-bold">{moderationState}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-1 mt-3">
            {artifact.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-[#232730] text-[#5ecde3] rounded border border-[#5ecde3] font-mono"
              >
                #{tag}
              </span>
            ))}
            {artifact.tags.length > 3 && (
              <span className="text-xs px-2 py-1 text-[#7a8699]">
                +{artifact.tags.length - 3}
              </span>
            )}
          </div>
        </div>

        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, ${statusConfig.color}00, ${statusConfig.color}80, ${statusConfig.color}00)`,
          }}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1b1e26] rounded-lg p-6 w-96">
            <h2 className="text-lg font-bold text-[#dbe3eb] mb-4">
              Update Moderation
            </h2>
            <div className="flex flex-col gap-3">
              {["approved", "draft"].map((status) => (
                <button
                  key={status}
                  className="p-2 bg-[#0f1116] rounded border border-[#232730] text-[#dbe3eb] hover:bg-[#232730] cursor-pointer"
                  onClick={() => handleModerationUpdate(status)}
                >
                  {status.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              className="mt-4 p-2 bg-red-600 text-white rounded w-full cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};
