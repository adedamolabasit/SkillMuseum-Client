"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { useLogin, getIdentityToken, usePrivy } from "@privy-io/react-auth";
import { useVerifyToken } from "@/shared/api/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

type ProtectedRouteProps = {
  children: ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const { isAppSession, setSession } = useAuthStore();
  const verifyMutation = useVerifyToken();
  const queryClient = useQueryClient();

  const loginTriggered = useRef(false);

  const loggedIn = ready && authenticated && isAppSession;

  const { login } = useLogin({
    onComplete: async () => {
      const token = await getIdentityToken();
      if (!token) return;

      verifyMutation.mutate(token, {
        onSuccess: (data) => {
          const userId = data?.user?.id;

          if (userId) {
            setSession(userId);
          }

          queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
      });
    },

    onError: () => {
      router.replace("/");
    },
  });

  useEffect(() => {
    if (!ready) return;
    if (authenticated) return;
    if (loginTriggered.current) return;

    loginTriggered.current = true;
    login();
  }, [ready, authenticated, login]);

  useEffect(() => {
    if (ready && !authenticated) {
      router.replace("/");
    }
  }, [ready, authenticated, router]);

  if (!loggedIn) {
    return null;
  }

  return <>{children}</>;
};
