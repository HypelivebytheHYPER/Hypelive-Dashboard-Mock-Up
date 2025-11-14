"use client";

import dynamic from "next/dynamic";

// Lazy load Kanban board with drag-and-drop library
// Note: Converted to Client Component to support ssr: false with dynamic imports
const KanbanBoard = dynamic(() => import("./components/kanban-board"), {
  loading: () => <div className="flex h-96 items-center justify-center">Loading Kanban board...</div>,
  ssr: false
});

// Note: Metadata moved to layout.tsx since this is now a Client Component
export default function Page() {
  return <KanbanBoard />;
}
