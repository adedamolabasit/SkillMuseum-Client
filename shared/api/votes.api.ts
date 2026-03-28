import { VOTE_API, MY_VOTES, GET_VOTES, GET_ASSETS_VOTES   } from "./apiRoutes";


export async function castVoteApi(data: {
  assetId: string;
  category: string;
}) {
  const res = await fetch(VOTE_API, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to vote");
  }

  return res.json();
}
export async function getVoteResultsApi() {
  const res = await fetch(GET_VOTES, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch vote results");
  }

  return res.json();
}
export async function getAssetsVoteResultsApi() {
  const res = await fetch(GET_ASSETS_VOTES, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch vote results");
  }

  return res.json();
}

export async function getMyVotesApi() {
  const res = await fetch(MY_VOTES, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch user votes");
  }

  return res.json(); 
}