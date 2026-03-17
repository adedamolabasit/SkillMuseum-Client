export const API_BASE_URL = "https://skillmuseum-server-production.up.railway.app/api";
export const VERIFY_TOKEN = `${API_BASE_URL}/auth/verify`;
export const LOGOUT_USER = `${API_BASE_URL}/auth/logout`;
export const PROFILE = `${API_BASE_URL}/auth/me`;
export const ASSET_SUBMISSIONS = `${API_BASE_URL}/assets/submissions`;
export const All_ASSETS = `${API_BASE_URL}/assets`;
export const GET_ASSET = (assetId: string) =>
  `${API_BASE_URL}/assets/${assetId}`;
export const GET_USER_ASSET = `${API_BASE_URL}/assets/my-assets`;
export const COMPLETE_SUBMISSIONS = (assetId: string) =>
  `${API_BASE_URL}/assets/submissions/${assetId}/complete`;
