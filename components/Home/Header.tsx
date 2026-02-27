"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { HeaderProps } from "@/shared/types/home";
import {
  useLogin,
  useLogout,
  usePrivy,
  getIdentityToken,
} from "@privy-io/react-auth";
import { useVerifyToken, useLogoutUser } from "@/shared/api/hooks/useAuth";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";

export default function Header({ onSignIn, onSignUp }: HeaderProps) {
  const queryClient = useQueryClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { ready, authenticated } = usePrivy();
  const { isAppSession } = useAuthStore();

  const verifyMutation = useVerifyToken();
  const logoutMutation = useLogoutUser();

  const { login } = useLogin({
    onComplete: async () => {
      const token = await getIdentityToken();

      if (token) {
        verifyMutation.mutate(token, {
          onSuccess: (data) => {
            const userId = data.user.id;
            if (userId) {
              useAuthStore.getState().setSession(userId);
            }
            queryClient.invalidateQueries({
              queryKey: ["profile"],
            });
          },
        });
      }
    },
  });

  const { logout } = useLogout({
    onSuccess: () => {
      logoutMutation.mutate();
      useAuthStore.getState().clearSession();
      queryClient.clear();
    },
  });

  const disable = !ready || (ready && authenticated);
  const loggedIn = ready && authenticated && isAppSession;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-[#232730] bg-[rgba(18,20,26,0.95)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
              <span className="text-[#98dc48]">Skill</span>
              <span className="text-[#f2c94c]">Museum™</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#"
              className="text-sm text-[#8fa0b3] hover:text-[#dbe3eb] transition"
            >
              ABOUT
            </a>
            <a
              href="#"
              className="text-sm text-[#8fa0b3] hover:text-[#dbe3eb] transition"
            >
              FEATURES
            </a>
            <a
              href="#"
              className="text-sm text-[#8fa0b3] hover:text-[#dbe3eb] transition"
            >
              COMMUNITY
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {loggedIn ? (
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-semibold text-[#12141a] bg-[#98dc48] border-2 border-[#98dc48] rounded-lg hover:bg-[#7ec835] transition cursor-pointer"
              >
                Log out
              </button>
            ) : (
              <button
                disabled={disable}
                onClick={login}
                className="px-4 py-2 text-sm font-semibold text-[#12141a] bg-[#98dc48] border-2 border-[#98dc48] rounded-lg hover:bg-[#7ec835] transition cursor-pointer"
              >
                Get Started
              </button>
            )}
          </div>

          <button
            className="md:hidden p-2 text-[#8fa0b3] hover:text-[#dbe3eb]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <a
              href="#"
              className="block text-sm text-[#8fa0b3] hover:text-[#dbe3eb]"
            >
              ABOUT
            </a>
            <a
              href="#"
              className="block text-sm text-[#8fa0b3] hover:text-[#dbe3eb]"
            >
              FEATURES
            </a>
            <a
              href="#"
              className="block text-sm text-[#8fa0b3] hover:text-[#dbe3eb]"
            >
              COMMUNITY
            </a>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  onSignIn();
                  setIsMenuOpen(false);
                }}
                className="flex-1 px-3 py-2 text-sm font-semibold text-[#5ecde3] border-2 border-[#5ecde3] rounded-lg hover:bg-[#5ecde3] hover:text-[#12141a] transition"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  onSignUp();
                  setIsMenuOpen(false);
                }}
                className="flex-1 px-3 py-2 text-sm font-semibold text-[#12141a] bg-[#98dc48] border-2 border-[#98dc48] rounded-lg transition"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
