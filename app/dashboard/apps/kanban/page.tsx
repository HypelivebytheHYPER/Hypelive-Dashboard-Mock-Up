import { generateMeta } from "@/lib/utils";
import dynamic from "next/dynamic";

// Lazy load Kanban board with drag-and-drop library
const KanbanBoard = dynamic(() => import("./components/kanban-board"), {
  loading: () => <div className="flex h-96 items-center justify-center">Loading Kanban board...</div>,
  ssr: false
});

export async function generateMetadata() {
  return generateMeta({
    title: "Kanban Board",
    description:
      "Professional Kanban board for managing projects and tasks with an intuitive drag-and-drop interface. Built with Hypelive, React, Next.js and Tailwind CSS.",
    canonical: "/apps/kanban"
  });
}

export default function Page() {
  return <KanbanBoard />;
}
