import { PerformanceStatus } from "@/shared/lib/archive-types";
import { 
  faTachometerAlt,
  faSkull,
  faDragon,
  faBolt,
  faFire
} from "@fortawesome/free-solid-svg-icons";

// Status mapping for display
export const getStatusDisplay = (statusTier: string) => {
  const statusMap: Record<string, string> = {
    [PerformanceStatus.GALLERY_EXHIBIT]: "Gallery Exhibit",
    [PerformanceStatus.LEGENDARY_ENIGMA]: "Legendary Enigma",
  };
  return statusMap[statusTier] || "Gallery Exhibit";
};

// Difficulty icons mapping
export const getDifficultyIcon = (difficulty: string) => {
  const difficultyMap: Record<string, any> = {
    easy: { icon: faTachometerAlt, color: "#10b981", label: "Easy" },
    medium: { icon: faBolt, color: "#f59e0b", label: "Medium" },
    hard: { icon: faFire, color: "#ef4444", label: "Hard" },
    impossible: { icon: faSkull, color: "#8b5cf6", label: "Impossible" },
    legendary: { icon: faDragon, color: "#ec489a", label: "Legendary" },
  };
  return difficultyMap[difficulty] || { icon: faTachometerAlt, color: "#6b7280", label: "Unknown" };
};