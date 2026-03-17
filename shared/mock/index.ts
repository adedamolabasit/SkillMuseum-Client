import { NavItem } from "../types/archive";
import { Campaign } from "../lib/archive-types";


// Archive
export const navItems: NavItem[] = [
  { id: "1", label: "ARCHIVE", section: "archive", icon: "📚" },
  { id: "2", label: "COLLECTIONS", section: "collections", icon: "🏛️" },
  // { id: "3", label: "RELIC VAULT", section: "relic-vault", icon: "⚱️" },
  { id: "4", label: "CAMPAIGNS", section: "campaigns", icon: "🎮" },
  { id: "5", label: "PERFORMANCE INDEX", section: "index", icon: "📊" },
  // { id: "6", label: "SUBMIT", section: "submit", icon: "⬆️" },
  // { id: "7", label: "PROFILE", section: "profile", icon: "👤" },
];

export const campaignArray: Campaign[] = [
  {
    id: "1",
    title: "CELESTE SPEEDRUN",
    game: "CELESTE",
    description:
      "Complete Celeste any% run under 20 minutes. Show us your mastery.",
    status: "ACTIVE",
    entries: 12,
    createdBy: "SpeedRunStudio",
  },
  {
    id: "2",
    title: "HOLLOW KNIGHT PATH OF PAIN",
    game: "HOLLOW KNIGHT",
    description: "Path of Pain no-hit challenge. Can you achieve perfection?",
    status: "TRENDING",
    entries: 45,
    createdBy: "IndieGames Inc",
  },
  {
    id: "3",
    title: "DARK SOULS SEQUENCE BREAK",
    game: "DARK SOULS",
    description: "Find the most creative sequence breaks in any area.",
    status: "ACTIVE",
    entries: 28,
    createdBy: "ChallengeCreators",
  },
  {
    id: "4",
    title: "NEON ABYSS GLITCH",
    game: "NEON ABYSS",
    description: "Discover and showcase game-breaking glitches responsibly.",
    status: "TRENDING",
    entries: 67,
    createdBy: "GlitchMasters",
  },
];

// Homw
export const votes = [
  {
    title: "NO-HIT RUN (ANY%)",
    votes: 842,
    percentage: 87,
    rank: 1,
    status: "LEGENDARY",
  },
  {
    title: "FRAME-PERFECT PARRY",
    votes: 120,
    percentage: 13,
    rank: 2,
    status: "RISING",
  },
];

export const steps = [
  {
    number: "01",
    title: "CAPTURE",
    description:
      "Upload proof of your impossible combo, clutch play, or creative exploit.",
    tags: ["Raw Footage"],
  },
  {
    number: "02",
    title: "MINT",
    description:
      "Record the moment permanently on-chain as a unique Performance Asset.",
    tags: ["Immutable"],
  },
  {
    number: "03",
    title: "CHALLENGE",
    description:
      "If no one replicates it after 1,000 tries, it gains Elite Status.",
    tags: ["Relic Vault"],
  },
];

export const problems = [
  {
    icon: "✖",
    title: "FADING CLIPS",
    description:
      "Jaw-dropping feats vanish into random clips and forgotten feeds. Without ownership, viral moments are fleeting.",
  },
  {
    icon: "📉",
    title: "FORGOTTEN LEADERBOARDS",
    description:
      "High scores are reset. Servers shut down. Your grind evaporates into digital dust with no permanent record.",
  },
  {
    icon: "👾",
    title: "INVISIBLE TALENT",
    description:
      "Indie gamers and small studios struggle to spotlight true mechanics without big marketing budgets.",
  },
];
