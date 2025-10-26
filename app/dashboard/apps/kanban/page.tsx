import { generateMeta } from "@/lib/utils";

import KanbanBoard from "./components/kanban-board";

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
