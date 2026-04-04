export enum PerformanceStatus {
  GALLERY_EXHIBIT = "Gallery Exhibit",
  MASTERPIECE = "Masterpiece",
  IMMUTABLE_RELIC = "Immutable Relic",
  LEGENDARY_ENIGMA = "Legendary Enigma",
  PRICELESS_ARTIFACT = "Priceless Artifact",
}

export interface PerformanceArtifact {
  id: string;
  assetId?: string
  title: string;
  creator: string;
  game: string;
  description: string;
  status: PerformanceStatus;
  storedAt: Date;
  curatorScore: number;
  replicationAttempts: number;
  successfulReplications: number;
  endorsements: number;
  imageUrl?: string;
  videoUrl?: string;
  tags: string[];
  uploadStatus?: "pending_upload" | "uploaded" | "failed" | string;
  processingStatus?: "idle" | "processing" | "completed" | string;
  moderationState?: "pending" | "approved" | "rejected" | string;
}

export interface CuratorProfile {
  id: string;
  name: string;
  avatar?: string;
  username?: string;
  endorsementPower: number;
  artifactsStored: number;
  joinedDate: Date;
  bio?: string;
}

export interface Campaign {
  id: string;
  title: string;
  game: string;
  description: string;
  status: "ACTIVE" | "TRENDING" | "ARCHIVED";
  entries: number;
  createdBy: string;
}

export interface ArchiveContextType {
  isAuthenticated: boolean;
  curator: CuratorProfile | null;
  artifacts: PerformanceArtifact[];
  selectedArtifact: PerformanceArtifact | null;
  setCurator: (curator: CuratorProfile) => void;
  setArtifacts: (artifacts: PerformanceArtifact[]) => void;
  setSelectedArtifact: (artifact: PerformanceArtifact | null) => void;
}

// Status tier styling
export const STATUS_CONFIG = {
  [PerformanceStatus.GALLERY_EXHIBIT]: {
    label: "UNVERIFIED",
    color: "#7a8699",
    bgColor: "#232730",
    borderColor: "#3a4050",
  },
  [PerformanceStatus.MASTERPIECE]: {
    label: "EXHIBIT",
    color: "#5ecde3",
    bgColor: "#1b1e26",
    borderColor: "#5ecde3",
  },
  [PerformanceStatus.IMMUTABLE_RELIC]: {
    label: "FEATURED EXHIBIT",
    color: "#98dc48",
    bgColor: "#1b1e26",
    borderColor: "#98dc48",
  },
  [PerformanceStatus.LEGENDARY_ENIGMA]: {
    label: "LEGENDARY",
    color: "#f2c94c",
    bgColor: "#1b1e26",
    borderColor: "#f2c94c",
  },
  [PerformanceStatus.PRICELESS_ARTIFACT]: {
    label: "RELIC CANDIDATE",
    color: "#9d72ff",
    bgColor: "#1b1e26",
    borderColor: "#9d72ff",
  },
};
