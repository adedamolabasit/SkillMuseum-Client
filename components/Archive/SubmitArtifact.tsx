"use client";

import React, { useState, useRef } from "react";
import { Upload, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { useCreateAssetWithUpload } from "@/shared/api/hooks/useAssets";
import { useArtifactForm } from "@/shared/context/ArtifactFormContext";
import { ArtifactSchema } from "@/shared/models/artifact.schema";
import { generateIdempotencyKey } from "@/shared/utils/idempotency";
import { useRouter } from "next/navigation";

export const SubmitArtifact: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    form,
    setForm,
    videoFile,
    setVideoFile,
    resetForm,
    setErrors,
    errors,
  } = useArtifactForm();

  const router = useRouter();

  const [uploadProgress, setUploadProgress] = useState(0);

  const { mutateAsync: createAssetWithUpload, isPending } =
    useCreateAssetWithUpload();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name: fieldName } = e.target;
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => {
      if (!prev) return prev;

      const newErrors = { ...prev } as Record<string, string>;

      delete newErrors[fieldName];

      return newErrors;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoFile(file);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 80);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoFile) {
      toast.error("Please upload a video");
      return;
    }

    const rawPayload = {
      idempotency_key: generateIdempotencyKey(),
      title: form.title,
      game: form.game,
      description: form.description,
      tags: form.tags
        ? form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : ["general"],
      difficulty: form.difficulty,
      statusTier: "Gallery Exhibit",
      fileType: videoFile.type,
    };

    const validation = ArtifactSchema.safeParse(rawPayload);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};

      validation.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });

      setErrors(fieldErrors);
      return;
    }

    if (!videoFile) {
      setErrors((prev) => ({
        ...prev,
        video: "Video is required",
      }));
      return;
    }

    setErrors({});

    const loadingToastId = toast.loading("Creating artifact...");

    try {
      await createAssetWithUpload({
        payload: validation.data,
        file: videoFile,
      });

      toast.dismiss(loadingToastId);
      toast.success("Artifact stored successfully 🚀");

      resetForm();
      setUploadProgress(0);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      router.push("/archive?page=archive");
    } catch (err) {
      toast.dismiss(loadingToastId);
      toast.error("Upload failed. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <button
          type="button"
          onClick={() => router.push("/archive?page=archive")}
          className="flex items-center gap-2 text-[#8fa0b3] hover:text-[#98dc48] transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-bold">Back to Archive</span>
        </button>
      </div>
      <div className="bg-[#1b1e26] border-2 border-[#232730] rounded-lg p-6">
        <h1
          className="text-3xl sm:text-4xl font-bold text-[#dbe3eb] uppercase mb-2"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          SUBMIT ARTIFACT
        </h1>
        <p className="text-[#8fa0b3] text-sm">
          Capture your greatest moment. Store it forever. Become a legend.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-[#8fa0b3] uppercase mb-2">
            Performance Title *
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="E.g., NO-HIT RUN (ANY%)"
            className="w-full px-4 py-3 bg-[#0f1116] border-2 border-[#232730] rounded text-[#dbe3eb] placeholder-[#7a8699] focus:border-[#98dc48] focus:outline-none transition"
            required
          />
          {errors.title && (
            <p className="text-red-400 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8fa0b3] uppercase mb-2">
            Game Title *
          </label>
          <input
            type="text"
            name="game"
            value={form.game}
            onChange={handleChange}
            placeholder="E.g., CELESTE"
            className="w-full px-4 py-3 bg-[#0f1116] border-2 border-[#232730] rounded text-[#dbe3eb]"
            required
          />
          {errors.game && (
            <p className="text-red-400 text-xs mt-1">{errors.game}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8fa0b3] uppercase mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Tell us what makes this performance legendary."
            className="w-full px-4 py-3 bg-[#0f1116] border-2 border-[#232730] rounded text-[#dbe3eb]"
            required
          />
          {errors.description && (
            <p className="text-red-400 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
            id="video-upload"
          />

          <label
            htmlFor="video-upload"
            className="flex flex-col items-center justify-center w-full px-4 py-8 border-2 border-dashed border-[#5ecde3] rounded-lg cursor-pointer hover:border-[#98dc48]"
          >
            <Upload className="w-12 h-12 text-[#5ecde3] mb-2" />
            <span className="text-sm text-[#8fa0b3]">
              {videoFile ? videoFile.name : "Click to upload or drag and drop"}
            </span>
            <span className="text-xs text-[#7a8699]">
              MP4, WebM, MOV up to 500MB
            </span>
            {errors.video && (
              <p className="text-red-400 text-xs mt-1">{errors.video}</p>
            )}
          </label>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-3">
              <div className="w-full bg-[#232730] h-2 rounded">
                <div
                  className="bg-[#98dc48] h-2 rounded transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-right mt-1 text-[#8fa0b3]">
                {uploadProgress}% uploaded
              </p>
            </div>
          )}

          {videoFile && uploadProgress === 100 && (
            <p className="text-xs text-[#98dc48] mt-2">✓ Upload complete!</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8fa0b3] uppercase mb-2">
            Difficulty Level
          </label>

          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#0f1116] border-2 border-[#232730] rounded text-[#dbe3eb]"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="impossible">Impossible</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8fa0b3] uppercase mb-2">
            Tags (comma-separated)
          </label>

          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="speedrun, no-hit, glitch"
            className="w-full px-4 py-3 bg-[#0f1116] border-2 border-[#232730] rounded text-[#dbe3eb]"
          />
          {errors.tags && (
            <p className="text-red-400 text-xs mt-1">{errors.tags}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!videoFile || isPending}
          className="w-full px-6 py-4 bg-[#1b1e26] text-[#98dc48] border-2 border-[#5c852b] rounded-lg font-bold disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-[#232832] transition-colors"
        >
          {isPending ? "Processing..." : "Store In Archive"}
        </button>

        <p className="text-xs text-center text-[#7a8699]">
          By submitting, you agree this will be permanently stored.
        </p>
      </form>
    </div>
  );
};
