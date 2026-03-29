export const API_BASE_URL = "http://localhost:8000/api";
// export const API_BASE_URL = "https://adaptable-creativity-production-aeee.up.railway.app/api";
export const VERIFY_TOKEN = `${API_BASE_URL}/auth/verify`;
export const LOGOUT_USER = `${API_BASE_URL}/auth/logout`;
export const PROFILE = `${API_BASE_URL}/auth/me`;
export const ASSET_SUBMISSIONS = `${API_BASE_URL}/assets/submissions`;
export const All_ASSETS = `${API_BASE_URL}/assets`;
export const INITIATE_UPLOAD_ASSETS = `${API_BASE_URL}/assets/uploads/initiate`;
export const CHUNK_UPLOAD_ASSETS = `${API_BASE_URL}/assets/uploads/part-url`;
export const COMPLETE_CHUNK_UPLOAD_ASSETS = `${API_BASE_URL}/assets/uploads/complete`;
export const GET_ASSET = (assetId: string) =>
  `${API_BASE_URL}/assets/${assetId}`;
export const GET_USER_ASSET = `${API_BASE_URL}/assets/my-assets`;
export const GET_ANY_USER_ASSET = (userId: string) =>
  `${API_BASE_URL}/assets/user-assets/${userId}`;
export const COMPLETE_SUBMISSIONS = (assetId: string) =>
  `${API_BASE_URL}/assets/submissions/${assetId}/complete`;
export const VOTE_API = `${API_BASE_URL}/votes`;
export const GET_VOTES = `${API_BASE_URL}/votes/results`;
export const GET_ASSETS_VOTES = `${API_BASE_URL}/votes/assets-results`;
export const MY_VOTES = `${API_BASE_URL}/votes/my-votes`;
