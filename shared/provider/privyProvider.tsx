"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export function PrivyProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID!}
      config={{
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
        appearance: {
          theme: "dark",
          accentColor: "#98dc48", 
          logo: "/logo.png", 
          landingHeader: "Welcome to SkillMuseum™",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}