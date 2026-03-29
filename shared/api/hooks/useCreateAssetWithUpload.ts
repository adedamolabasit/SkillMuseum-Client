import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAssetSubmissionApi,
  getAssetsApi,
  getAssetByIdApi,
  completeUploadApi,
  getUserAssets,
  getAnyUserAssets,
} from "../assets.api";
import { MultipartUploadManager } from "@/shared/utils/uploadManger";

interface CreateAssetWithUploadParams {
  payload: any;
  file: File;
  onProgress?: (progress: number) => void;
  onStatusChange?: (
    status: "pending" | "uploading" | "resuming" | "complete" | "error",
  ) => void;
}

const simpleUploadWithResume = async (
  uploadUrl: string,
  file: File,
  draftId: string,
  onProgress?: (progress: number) => void,
): Promise<void> => {
  const storageKey = `simple_upload_${draftId}`;
  const savedProgress = localStorage.getItem(storageKey);
  let startByte = 0;

  if (savedProgress) {
    try {
      const { uploadedBytes } = JSON.parse(savedProgress);
      startByte = uploadedBytes;
    } catch (error) {
        throw error
    }
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let lastLoaded = startByte;
    let retryCount = 0;
    const MAX_RETRIES = 3;
    const blobToUpload = startByte > 0 ? file.slice(startByte) : file;

    const upload = () => {
      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader("Content-Type", file.type);

      if (startByte > 0) {
        xhr.setRequestHeader(
          "Content-Range",
          `bytes ${startByte}-${file.size - 1}/${file.size}`,
        );
      }

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          const currentProgress = startByte + event.loaded;
          const totalProgress = (currentProgress / file.size) * 100;
          onProgress(totalProgress);

          const progressPercent = (currentProgress / file.size) * 100;
          if (
            Math.floor(progressPercent / 5) >
            Math.floor(lastLoaded / (file.size / 100) / 5)
          ) {
            localStorage.setItem(
              storageKey,
              JSON.stringify({
                uploadedBytes: currentProgress,
                lastUpdated: Date.now(),
                draftId,
              }),
            );
            lastLoaded = currentProgress;
          }
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200 || xhr.status === 201) {
          localStorage.removeItem(storageKey);
          resolve();
        } else if (xhr.status === 308) {
          const range = xhr.getResponseHeader("Range");
          if (range) {
            const bytes = range.match(/bytes=(\d+)-(\d+)/);
            if (bytes && bytes[2]) {
              startByte = parseInt(bytes[2]) + 1;
              localStorage.setItem(
                storageKey,
                JSON.stringify({
                  uploadedBytes: startByte,
                  lastUpdated: Date.now(),
                  draftId,
                }),
              );
              retryCount++;
              if (retryCount < MAX_RETRIES) {
                upload();
              } else {
                reject(new Error("Upload failed after multiple retries"));
              }
            }
          } else {
            reject(new Error("Upload incomplete but no range header received"));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        retryCount++;
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying upload, attempt ${retryCount}`);
          setTimeout(upload, 2000 * retryCount);
        } else {
          reject(new Error("Upload failed due to network error"));
        }
      });

      xhr.addEventListener("abort", () => {
        reject(new Error("Upload was aborted"));
      });

      xhr.send(blobToUpload);
    };

    upload();
  });
};

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
    mutationFn: async ({
      payload,
      file,
      onProgress,
      onStatusChange,
    }: CreateAssetWithUploadParams) => {
      const response = await createAssetSubmissionApi(payload);
      const { uploadUrl, draftId, object_key } = response;

      if (!draftId) throw new Error("Missing assetId");
      if (!object_key) throw new Error("Missing object_key");

      const isLargeFile = file.size > 10 * 1024 * 1024;

      if (isLargeFile) {
        onStatusChange?.("uploading");

        const uploadManager = new MultipartUploadManager(
          object_key,
          file,
          draftId,
          onProgress,
          (partNumber, totalParts) => {
            console.log(`Uploaded part ${partNumber}/${totalParts}`);
          },
        );

        await uploadManager.upload();
      } else {
        if (!uploadUrl) throw new Error("Missing upload URL");

        onStatusChange?.("uploading");
        await simpleUploadWithResume(uploadUrl, file, draftId, onProgress);
        await completeUpload(draftId);
      }

      return draftId;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}
