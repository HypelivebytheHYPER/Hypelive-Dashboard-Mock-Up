import { Suspense } from "react";
import { generateMeta } from "@/lib/utils";
import { FileManager } from "./components/file-manager";

export async function generateMetadata() {
  return generateMeta({
    title: "File Manager App",
    description:
      "Professional file manager application for browsing, organizing and managing files and folders. Built with Hypelive, React, Next.js and Tailwind CSS.",
    canonical: "/apps/file-manager"
  });
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FileManager />
    </Suspense>
  );
}
