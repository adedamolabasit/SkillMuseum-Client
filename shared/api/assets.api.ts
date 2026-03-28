import {
  ASSET_SUBMISSIONS,
  COMPLETE_SUBMISSIONS,
  All_ASSETS,
  GET_ASSET,
  GET_USER_ASSET,
  GET_ANY_USER_ASSET,
} from "./apiRoutes";

export async function createAssetSubmissionApi(data: any) {
  const res = await fetch(`${ASSET_SUBMISSIONS}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create submission");
  }

  return res.json();
}

export async function getAssetsApi() {
  const res = await fetch(`${All_ASSETS}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch assets");
  }

  return res.json();
}

export async function getUserAssets() {
  const res = await fetch(GET_USER_ASSET, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user assets");
  }

  return res.json();
}

export async function getAnyUserAssets(userId: string) {
  const res = await fetch(GET_ANY_USER_ASSET(userId), {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user assets");
  }

  return res.json();
}

export async function getAssetByIdApi(assetId: string) {
  const res = await fetch(GET_ASSET(assetId), {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Asset not found");
  }

  return res.json();
}

export async function completeUploadApi(id: string) {
  const res = await fetch(COMPLETE_SUBMISSIONS(id), {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to complete upload");
  }

  return res.json();
}
