"use client";

import { generateMeta } from "@/lib/utils";
import dynamic from "next/dynamic";
import React from "react";

// Lazy load heavy FullCalendar component
// Note: Converted to Client Component to support ssr: false with dynamic imports
const CalendarApp = dynamic(
  () => import("@/app/dashboard/apps/calendar/components/calendar-app"),
  {
    loading: () => <div className="flex h-96 items-center justify-center">Loading calendar...</div>,
    ssr: false
  }
);

const CalendarSidebar = dynamic(
  () => import("@/app/dashboard/apps/calendar/components/calendar-sidebar"),
  { ssr: true }
);

const EventSheet = dynamic(
  () => import("@/app/dashboard/apps/calendar/components/event-sheet"),
  { ssr: true }
);

// Note: Metadata moved to layout.tsx since this is now a Client Component
export default function Page() {
  return (
    <div className="flex lg:space-x-5">
      <CalendarSidebar />
      <div className="grow">
        <CalendarApp />
      </div>
      <EventSheet />
    </div>
  );
}
