import { generateMeta } from "@/lib/utils";

import {
  FileUploadDialog,
  TableRecentFiles,
  SummaryCards,
  StorageStatusCard,
  ChartFileTransfer,
  FolderListCards
} from "@/app/dashboard/file-manager/components";

export async function generateMetadata() {
  return generateMeta({
    title: "File Manager Admin Dashboard",
    description:
      "Professional admin dashboard for managing files, folders, and monitoring storage status. Streamlined file management system with advanced features.",
    canonical: "/file-manager"
  });
}

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">File Manager</h1>
        <FileUploadDialog />
      </div>
      <SummaryCards />
      <div className="mb-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FolderListCards />
        </div>
        <StorageStatusCard />
      </div>
      <div className="gap-4 space-y-4 lg:grid lg:grid-cols-2 lg:space-y-0">
        <ChartFileTransfer />
        <TableRecentFiles />
      </div>
    </div>
  );
}
