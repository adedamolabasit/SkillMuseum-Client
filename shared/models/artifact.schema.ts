import { z } from "zod";

export const ArtifactSchema = z.object({
  idempotency_key: z.string().min(1),

  title: z.string().min(3, "Title must be at least 3 characters"),

  game: z.string().min(1, "Game is required"),

  description: z.string().min(10, "Description must be at least 10 characters"),

  tags: z.array(z.string()).optional(),

  difficulty: z.enum(["easy", "medium", "hard", "impossible"]),

  statusTier: z.enum([
    "Gallery Exhibit",
    "Masterpiece",
    "Immutable Relic",
    "Legendary Enigma",
    "Priceless Artifact",
  ]),

  fileType: z.string(),
});
