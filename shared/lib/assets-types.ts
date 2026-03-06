// ===============================
// Upload / Processing / Moderation
// ===============================

export const UploadStatus = {
  PENDING_UPLOAD: "pending_upload",
  UPLOADED: "uploaded",
} as const;

export const ProcessingStatus = {
  IDLE: "idle",
  QUEUED: "queued",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export const ModerationStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

// ===============================
// Tier System (USED FOR ARCHIVE CARD)
// ===============================

export const StatusTier = {
  GALLERY_EXHIBIT: "Gallery Exhibit",
  MASTERPIECE: "Masterpiece",
  IMMUTABLE_RELIC: "Immutable Relic",
  LEGENDARY_ENIGMA: "Legendary Enigma",
  PRICELESS_ARTIFACT: "Priceless Artifact",
} as const;

export type StatusTierType =
  (typeof StatusTier)[keyof typeof StatusTier];

// ===============================
// Artifact Model
// ===============================

export interface PerformanceArtifact {
  id: string;
  title: string;
  creator: string;
  game: string;
  description: string;
  status: StatusTierType; // ✅ updated
  storedAt: Date;
  curatorScore: number;
  replicationAttempts: number;
  successfulReplications: number;
  endorsements: number;
  imageUrl?: string;
  videoUrl?: string;
  tags: string[];
}

// ===============================
// STATUS CONFIG (UPDATED)
// ===============================

export const STATUS_CONFIG: Record<
  StatusTierType,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  [StatusTier.GALLERY_EXHIBIT]: {
    label: "GALLERY EXHIBIT",
    color: "#5ecde3",
    bgColor: "#1b1e26",
    borderColor: "#5ecde3",
  },
  [StatusTier.MASTERPIECE]: {
    label: "MASTERPIECE",
    color: "#98dc48",
    bgColor: "#1b1e26",
    borderColor: "#98dc48",
  },
  [StatusTier.IMMUTABLE_RELIC]: {
    label: "IMMUTABLE RELIC",
    color: "#9d72ff",
    bgColor: "#1b1e26",
    borderColor: "#9d72ff",
  },
  [StatusTier.LEGENDARY_ENIGMA]: {
    label: "LEGENDARY ENIGMA",
    color: "#f2c94c",
    bgColor: "#1b1e26",
    borderColor: "#f2c94c",
  },
  [StatusTier.PRICELESS_ARTIFACT]: {
    label: "PRICELESS ARTIFACT",
    color: "#00ff88",
    bgColor: "#001a0f",
    borderColor: "#00ff88",
  },
};