import { apiClient } from "../lib/apiClient";

export const VERIFY_TOKEN = "/auth/verify";
export const LOGOUT_USER = "/auth/logout";
export const PROFILE = "/auth/me";

export function verifyTokenApi(token: string) {
  return apiClient(VERIFY_TOKEN, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function logoutApi() {
  return apiClient(LOGOUT_USER, { method: "POST" });
}

export function getProfileApi() {
  return apiClient(PROFILE, { method: "GET" });
}