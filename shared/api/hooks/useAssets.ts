"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAssetSubmissionApi,
  getAssetsApi,
  getAssetByIdApi,
  completeUploadApi,
} from "../assets.api";


export function useAssets() {
  return useQuery({
    queryKey: ["assets"],
    queryFn: getAssetsApi,
  });
}

export function useAsset(assetId: string) {
  return useQuery({
    queryKey: ["assets", assetId],
    queryFn: () => getAssetByIdApi(assetId),
    enabled: !!assetId,
  });
}


export function useCreateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAssetSubmissionApi,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}


export function useCompleteUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => completeUploadApi(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}

export function useCreateAssetWithUpload() {
  const queryClient = useQueryClient();
  const { mutateAsync: completeUpload } = useCompleteUpload();

  return useMutation({
    mutationFn: async ({
      payload,
      file,
    }: {
      payload: any;
      file: File;
    }) => {
      const response = await createAssetSubmissionApi(payload);

      const { uploadUrl, draftId } = response;

      if (!uploadUrl) {
        throw new Error("Missing upload URL");
      }

      if (!draftId) {
        throw new Error("Missing assetId");
      }

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "video/mp4",
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Video upload failed");
      }

      await completeUpload(draftId);

      return draftId;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },

  });
}