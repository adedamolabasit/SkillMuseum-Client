import { PerformanceArtifact, Campaign } from "../lib/archive-types";

export interface ArchiveCardProps {
  artifact: PerformanceArtifact;
  onClick?: () => void;
}

export interface ArchiveFloorFeedProps {
  artifacts: PerformanceArtifact[];
}

export interface NavItem {
  id: string;
  label: string;
  section: string;
  icon: string;
}

export interface ArchiveNavBarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export interface CampaignsProps {
  campaigns?: Campaign[];
}

export interface CollectionsProps {
  artifacts: PerformanceArtifact[];
}

export interface PerformanceIndexProps {
  artifacts: PerformanceArtifact[];
}

export interface RelicVaultProps {
  artifacts: PerformanceArtifact[];
}