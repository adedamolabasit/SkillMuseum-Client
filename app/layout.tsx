import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ArchiveProvider } from "@/shared/lib/archive-context";
import "../styles/style.css";
import { PrivyProviders } from "@/shared/provider/privyProvider";
import { ReactQueryProvider } from "@/shared/provider/ReactQueryProvider";
import { ArtifactFormProvider } from "@/shared/context/ArtifactFormContext";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "The Museum - Digital Performance NFT Platform",
  description:
    "Discover, mint, and showcase legendary digital performances on the blockchain.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PrivyProviders>
          <ReactQueryProvider>
            <ArtifactFormProvider>
              <ArchiveProvider>{children}</ArchiveProvider>
            </ArtifactFormProvider>
          </ReactQueryProvider>
        </PrivyProviders>

        <Toaster position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  );
}
