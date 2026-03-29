"use client";

import React, { useState, useRef } from "react";
import { Upload, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { useCreateAssetWithUpload } from "@/shared/api/hooks/useCreateAssetWithUpload";
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
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "complete" | "error"
  >("idle");

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
    setUploadStatus("idle");

    setErrors((prev) => ({
      ...prev,
      video: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoFile) {
      toast.error("Please upload a video");
      setErrors((prev) => ({
        ...prev,
        video: "Video is required",
      }));
      return;
    }

    const MAX_FILE_SIZE = 500 * 1024 * 1024;
    if (videoFile.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 500MB limit");
      setErrors((prev) => ({
        ...prev,
        video: "File must be less than 500MB",
      }));
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

      Object.entries(fieldErrors).forEach(([field, message]) => {
        toast.error(`${field}: ${message}`);
      });

      return;
    }

    setErrors({});
    setUploadStatus("uploading");
    setUploadProgress(0);

    const loadingToastId = toast.loading("Preparing upload...");

    try {
      await createAssetWithUpload({
        payload: validation.data,
        file: videoFile,
        onProgress: (progress) => {
          setUploadProgress(progress);
          toast.loading(`Uploading: ${Math.round(progress)}%`, {
            id: loadingToastId,
          });
        },
      });

      setUploadStatus("complete");
      setUploadProgress(100);

      toast.dismiss(loadingToastId);
      toast.success("Artifact stored successfully! 🚀", {
        duration: 4000,
      });

      setTimeout(() => {
        resetForm();
        setUploadProgress(0);
        setUploadStatus("idle");

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        router.push("/archive?page=profile");
      }, 1500);
    } catch (err: any) {
      setUploadStatus("error");
      toast.dismiss(loadingToastId);

      const errorMessage = err?.message || "Upload failed. Please try again.";
      toast.error(errorMessage, {
        duration: 5000,
      });

      setUploadProgress(0);
    }
  };

  const getUploadProgressColor = () => {
    if (uploadStatus === "error") return "bg-red-500";
    if (uploadStatus === "complete") return "bg-green-500";
    return "bg-[#98dc48]";
  };

  const getFileSizeDisplay = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
            disabled={isPending}
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
            disabled={isPending}
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
            disabled={isPending}
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
            disabled={isPending}
          />

          <label
            htmlFor="video-upload"
            className={`flex flex-col items-center justify-center w-full px-4 py-8 border-2 border-dashed rounded-lg cursor-pointer transition
              ${
                uploadStatus === "error"
                  ? "border-red-500 bg-red-500/10"
                  : uploadStatus === "complete"
                    ? "border-green-500 bg-green-500/10"
                    : "border-[#5ecde3] hover:border-[#98dc48]"
              } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Upload
              className={`w-12 h-12 mb-2 ${
                uploadStatus === "error"
                  ? "text-red-500"
                  : uploadStatus === "complete"
                    ? "text-green-500"
                    : "text-[#5ecde3]"
              }`}
            />
            <span className="text-sm text-[#8fa0b3] text-center">
              {videoFile
                ? `${videoFile.name} (${getFileSizeDisplay(videoFile.size)})`
                : "Click to upload or drag and drop"}
            </span>
            <span className="text-xs text-[#7a8699] mt-1">
              MP4, WebM, MOV up to 500MB
            </span>
            {errors.video && (
              <p className="text-red-400 text-xs mt-2">{errors.video}</p>
            )}
          </label>

          {(uploadProgress > 0 || uploadStatus === "uploading") && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-[#8fa0b3] mb-1">
                <span>
                  {uploadStatus === "uploading"
                    ? "Uploading..."
                    : uploadStatus === "complete"
                      ? "Complete!"
                      : "Preparing..."}
                </span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-[#232730] h-2 rounded-full overflow-hidden">
                <div
                  className={`${getUploadProgressColor()} h-2 rounded-full transition-all duration-300 ease-out`}
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>

              {videoFile &&
                videoFile.size > 10 * 1024 * 1024 &&
                uploadStatus === "uploading" && (
                  <p className="text-xs text-[#7a8699] mt-2 text-center">
                    Large file detected - using optimized multipart upload
                  </p>
                )}
            </div>
          )}

          {uploadStatus === "complete" && (
            <div className="mt-3 p-3 bg-green-500/10 border border-green-500 rounded-lg">
              <p className="text-xs text-green-500 text-center">
                ✓ Upload complete! Redirecting to archive...
              </p>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500 rounded-lg">
              <p className="text-xs text-red-500 text-center">
                ✗ Upload failed. Please check your connection and try again.
              </p>
            </div>
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
            disabled={isPending}
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
            disabled={isPending}
          />
          {errors.tags && (
            <p className="text-red-400 text-xs mt-1">{errors.tags}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!videoFile || isPending || uploadStatus === "uploading"}
          className={`w-full px-6 py-4 bg-[#1b1e26] border-2 rounded-lg font-bold cursor-pointer transition-colors
            ${
              !videoFile || isPending || uploadStatus === "uploading"
                ? "opacity-50 cursor-not-allowed border-[#5c852b] text-[#98dc48]"
                : "text-[#98dc48] border-[#5c852b] hover:bg-[#232832]"
            }`}
        >
          {isPending || uploadStatus === "uploading"
            ? `Uploading... ${Math.round(uploadProgress)}%`
            : uploadStatus === "complete"
              ? "Complete! Redirecting..."
              : "Store In Archive"}
        </button>

        <p className="text-xs text-center text-[#7a8699]">
          By submitting, you agree this will be permanently stored on Arweave.
        </p>
      </form>
    </div>
  );
};
