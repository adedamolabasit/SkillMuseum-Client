// Performance Status Tiers (Museum Exhibit Hierarchy)
export enum PerformanceStatus {
  UNVERIFIED = 'UNVERIFIED',
  EXHIBIT = 'EXHIBIT',
  FEATURED_EXHIBIT = 'FEATURED_EXHIBIT',
  LEGENDARY = 'LEGENDARY',
  RELIC_CANDIDATE = 'RELIC_CANDIDATE',
  UNTOUCHABLE = 'UNTOUCHABLE',
  IMMORTAL_ARTIFACT = 'IMMORTAL_ARTIFACT'
}

export interface PerformanceArtifact {
  id: string;
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
}

export interface CuratorProfile {
  id: string;
  name: string;
  avatar?: string;
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
  status: 'ACTIVE' | 'TRENDING' | 'ARCHIVED';
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
  [PerformanceStatus.UNVERIFIED]: {
    label: 'UNVERIFIED',
    color: '#7a8699',
    bgColor: '#232730',
    borderColor: '#3a4050'
  },
  [PerformanceStatus.EXHIBIT]: {
    label: 'EXHIBIT',
    color: '#5ecde3',
    bgColor: '#1b1e26',
    borderColor: '#5ecde3'
  },
  [PerformanceStatus.FEATURED_EXHIBIT]: {
    label: 'FEATURED EXHIBIT',
    color: '#98dc48',
    bgColor: '#1b1e26',
    borderColor: '#98dc48'
  },
  [PerformanceStatus.LEGENDARY]: {
    label: 'LEGENDARY',
    color: '#f2c94c',
    bgColor: '#1b1e26',
    borderColor: '#f2c94c'
  },
  [PerformanceStatus.RELIC_CANDIDATE]: {
    label: 'RELIC CANDIDATE',
    color: '#9d72ff',
    bgColor: '#1b1e26',
    borderColor: '#9d72ff'
  },
  [PerformanceStatus.UNTOUCHABLE]: {
    label: 'UNTOUCHABLE',
    color: '#ff6b9d',
    bgColor: '#1b1e26',
    borderColor: '#ff6b9d'
  },
  [PerformanceStatus.IMMORTAL_ARTIFACT]: {
    label: 'IMMORTAL ARTIFACT',
    color: '#00ff88',
    bgColor: '#001a0f',
    borderColor: '#00ff88'
  }
};
