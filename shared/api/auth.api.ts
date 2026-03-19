import { VERIFY_TOKEN, LOGOUT_USER, PROFILE} from "./apiRoutes";

export async function verifyTokenApi(token: string) {
  const res = await fetch(VERIFY_TOKEN, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Token verification failed");
  }

  return res.json();
}

export async function logoutApi() {
  const res = await fetch(LOGOUT_USER, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }

  return res.json();
}

export async function getProfileApi() {
  const res = await fetch(PROFILE, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Not authenticated");
  }
  // Todo

  return res.json();
}