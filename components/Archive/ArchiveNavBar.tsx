"use client";

import React, { useState } from "react";
import { useArchive } from "@/shared/lib/archive-context";
import { ArchiveNavBarProps } from "@/shared/types/archive";
import { navItems } from "@/shared/mock";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/components/Archive/CuratorProfile";
import { useProfile } from "@/shared/api/hooks/useAuth";

export const ArchiveNavBar: React.FC<ArchiveNavBarProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const { curator } = useArchive();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleNavClick = (section: string) => {
    onSectionChange(section);
    setMobileMenuOpen(false);
  };

  const { data: profile } = useProfile();
  const user: UserProfile =
    (profile?.user as UserProfile) ?? ({} as UserProfile);

    // Note

  return (
    <nav className="sticky top-0 z-50 bg-[#12141a] border-b border-[#232730] backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="hidden md:flex items-center justify-between h-16">
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.section)}
                className={`px-3 text-sm py-2  font-bold uppercase transition-all rounded cursor-pointer ${
                  activeSection === item.section
                    ? "text-[#98dc48] border-2 border-[#98dc48] shadow-[0_0_10px_rgba(152,220,72,0.3)]"
                    : "text-[#8fa0b3] border-2 border-transparent hover:border-[#5ecde3]"
                }`}
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {curator && (
            <div
              onClick={() => router.push("/archive?page=profile")}
              className="flex items-center gap-3 bg-[#1b1e26] px-4 py-2 rounded border border-[#232730] cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#98dc48] to-[#5ecde3] flex items-center justify-center text-xs font-bold text-[#000]">
                {user.handle?.charAt(0)}
              </div>
              <div className="text-xs">
                <p className="text-[#dbe3eb] font-bold">{user.handle}</p>
                <p className="text-[#7a8699] text-xs">
                  Power: 0.0
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center justify-between h-14">
          <div
            className="text-sm font-bold text-[#98dc48]"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "0.6rem",
            }}
          >
            ARCHIVE
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#98dc48] font-bold"
          >
            ☰
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-[#232730]">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.section)}
                className={`w-full text-left px-4 py-2 text-xs font-bold uppercase transition-all rounded ${
                  activeSection === item.section
                    ? "text-[#98dc48] bg-[#1b1e26] border-l-4 border-[#98dc48]"
                    : "text-[#8fa0b3] hover:bg-[#1b1e26]"
                }`}
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: "0.6rem",
                }}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
