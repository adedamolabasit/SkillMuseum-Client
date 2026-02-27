"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { verifyTokenApi, logoutApi, getProfileApi } from "..//auth.api";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfileApi,
    retry: false,
  });
}

export function useVerifyToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => verifyTokenApi(token),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useLogoutUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,

    onSuccess: () => {
      queryClient.clear();
    },
  });
}
