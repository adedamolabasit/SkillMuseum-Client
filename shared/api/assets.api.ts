import { apiClient } from "../lib/apiClient";

export const ASSET_SUBMISSIONS = "/assets/submissions";
export const ALL_ASSETS = "/assets";
export const GET_USER_ASSET = "/assets/my-assets";
export const GET_ASSET = (id: string) => `/assets/${id}`;
export const COMPLETE_SUBMISSIONS = (id: string) =>
  `/assets/submissions/${id}/complete`;

export function createAssetSubmissionApi(data: any) {
  return apiClient(ASSET_SUBMISSIONS, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getAssetsApi() {
  return apiClient(ALL_ASSETS, { method: "GET" });
}

export function getUserAssets() {
  return apiClient(GET_USER_ASSET, { method: "GET" });
}

export function getAssetByIdApi(assetId: string) {
  return apiClient(GET_ASSET(assetId), { method: "GET" });
}

export function completeUploadApi(id: string) {
  return apiClient(COMPLETE_SUBMISSIONS(id), { method: "POST" });
}