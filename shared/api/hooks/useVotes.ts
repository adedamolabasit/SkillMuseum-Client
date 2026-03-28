"use client";

import { useMutation, useQueryClient , useQuery} from "@tanstack/react-query";
import { castVoteApi, getVoteResultsApi, getMyVotesApi, getAssetsVoteResultsApi} from "../votes.api";

export function useVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: castVoteApi,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}

export function useVoteResults() {
  return useQuery({
    queryKey: ["vote-results"],
    queryFn: getVoteResultsApi,
    staleTime: 1000 * 60,
    refetchInterval: 2000, 
    refetchIntervalInBackground: false, 
    refetchOnWindowFocus: true, 
  });
}
export function useAssetsVoteResults() {
  return useQuery({
    queryKey: ["assets-vote-results"],
    queryFn: getAssetsVoteResultsApi,
    staleTime: 1000 * 60,
    refetchInterval: 2000, 
    refetchIntervalInBackground: false, 
    refetchOnWindowFocus: true, 
  });
}

export function useMyVotes() {
  return useQuery({
    queryKey: ["my-votes"],
    queryFn: getMyVotesApi,
    staleTime: 1000 * 60, 
    refetchInterval: 2000, 
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true, 
  });
}
