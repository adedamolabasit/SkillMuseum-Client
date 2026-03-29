"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAssetSubmissionApi,
  getAssetsApi,
  getAssetByIdApi,
  completeUploadApi,
  getUserAssets,
  getAnyUserAssets,
} from "../assets.api";

export function useAssets() {
  return useQuery({
    queryKey: ["assets"],
    queryFn: getAssetsApi,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,

    refetchInterval: 10000,
    refetchIntervalInBackground: false,

    refetchOnWindowFocus: true,
  });
}

export function useUserAssets() {
  return useQuery({
    queryKey: ["user-assets"],
    queryFn: getUserAssets,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchInterval: 10000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });
}
export function useAnyUserAssets(userId: string) {
  return useQuery({
    queryKey: ["user-any-assets", userId],
    queryFn: () => getAnyUserAssets(userId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    enabled: !!userId,
  });
}

export function useAsset(assetId: string) {
  return useQuery({
    queryKey: ["assets", assetId],
    queryFn: () => getAssetByIdApi(assetId),
    enabled: !!assetId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchInterval: 10000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
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
    mutationFn: async ({ payload, file }: { payload: any; file: File }) => {
      const response = await createAssetSubmissionApi(payload);

      const { uploadUrl, draftId } = response;

      if (!uploadUrl) {
        throw new Error("Missing upload URL");
      }

      if (!draftId) {
        throw new Error("Missing assetId");
      }

      await fetch(uploadUrl, {
        method: "PUT",

        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      await completeUpload(draftId);

      return draftId;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}
