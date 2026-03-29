import {
  INITIATE_UPLOAD_ASSETS,
  CHUNK_UPLOAD_ASSETS,
  COMPLETE_CHUNK_UPLOAD_ASSETS,
} from "../api/apiRoutes";

const CHUNK_SIZE = 5 * 1024 * 1024;
const MAX_CONCURRENT_UPLOADS = 3;

export class MultipartUploadManager {
  private uploadId: string | null = null;
  private parts: { PartNumber: number; ETag: string }[] = [];

  constructor(
    private objectKey: string,
    private file: File,
    private draftId: string,
    private onProgress?: (progress: number) => void,
    private onPartComplete?: (partNumber: number, totalParts: number) => void,
  ) {}

  async upload() {
    try {
      const initiateResponse = await fetch(INITIATE_UPLOAD_ASSETS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          objectKey: this.objectKey,
          fileType: this.file.type,
        }),
      });

      if (!initiateResponse.ok) {
        throw new Error("Failed to initiate multipart upload");
      }

      const { uploadId } = await initiateResponse.json();
      this.uploadId = uploadId;

      const chunks = this.splitFileIntoChunks();
      const totalChunks = chunks.length;

      let completedChunks = 0;

      const uploadChunk = async (chunk: { blob: Blob; partNumber: number }) => {
        const urlResponse = await fetch(CHUNK_UPLOAD_ASSETS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            objectKey: this.objectKey,
            uploadId: this.uploadId,
            partNumber: chunk.partNumber,
          }),
        });

        if (!urlResponse.ok) {
          throw new Error(`Failed to get URL for part ${chunk.partNumber}`);
        }

        const { url } = await urlResponse.json();

        let retries = 3;
        let lastError: Error | null = null;

        while (retries > 0) {
          try {
            const uploadResponse = await fetch(url, {
              method: "PUT",
              body: chunk.blob,
              headers: {
                "Content-Type": this.file.type,
              },
            });

            if (!uploadResponse.ok) {
              throw new Error(
                `Upload failed with status ${uploadResponse.status}`,
              );
            }

            const etag = uploadResponse.headers.get("ETag");
            if (etag) {
              this.parts.push({
                PartNumber: chunk.partNumber,
                ETag: etag.replace(/"/g, ""),
              });
            }

            completedChunks++;

            if (this.onProgress) {
              this.onProgress((completedChunks / totalChunks) * 100);
            }

            if (this.onPartComplete) {
              this.onPartComplete(chunk.partNumber, totalChunks);
            }

            return;
          } catch (error) {
            lastError = error as Error;
            retries--;
            if (retries > 0) {
              await new Promise((resolve) =>
                setTimeout(resolve, 1000 * (4 - retries)),
              );
            }
          }
        }

        throw (
          lastError ||
          new Error(`Failed to upload part ${chunk.partNumber} after retries`)
        );
      };

      const queue = [...chunks];
      const activeUploads = new Set<Promise<void>>();

      while (queue.length > 0 || activeUploads.size > 0) {
        while (
          activeUploads.size < MAX_CONCURRENT_UPLOADS &&
          queue.length > 0
        ) {
          const chunk = queue.shift()!;
          const promise = uploadChunk(chunk).finally(() => {
            activeUploads.delete(promise);
          });
          activeUploads.add(promise);
        }

        if (activeUploads.size > 0) {
          await Promise.race(activeUploads);
        }
      }

      const completePayload = {
        objectKey: this.objectKey,
        uploadId: this.uploadId,
        parts: this.parts.sort((a, b) => a.PartNumber - b.PartNumber),
        draftId: this.draftId,
      };

      const completeResponse = await fetch(COMPLETE_CHUNK_UPLOAD_ASSETS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(completePayload),
      });

      if (!completeResponse.ok) {
        const errorText = await completeResponse.text();
        throw new Error(`Failed to complete multipart upload: ${errorText}`);
      }

      await completeResponse.json();
      return true;
    } catch (error) {
      throw error;
    }
  }

  private splitFileIntoChunks() {
    const chunks: { blob: Blob; partNumber: number }[] = [];
    let start = 0;
    let partNumber = 1;

    while (start < this.file.size) {
      const end = Math.min(start + CHUNK_SIZE, this.file.size);
      const blob = this.file.slice(start, end);
      chunks.push({ blob, partNumber });
      start = end;
      partNumber++;
    }

    return chunks;
  }
}
