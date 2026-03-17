import { Suspense } from "react";
import ArchivePageClient from "./ArchivePageClient";

export default function ArchivePage() {
  return (
    <Suspense fallback={<div />}>
      <ArchivePageClient />
    </Suspense>
  );
}