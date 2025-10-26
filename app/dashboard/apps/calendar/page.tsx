import { generateMeta } from "@/lib/utils";
import CalendarApp from "@/app/dashboard/apps/calendar/components/calendar-app";
import CalendarSidebar from "@/app/dashboard/apps/calendar/components/calendar-sidebar";
import EventSheet from "@/app/dashboard/apps/calendar/components/event-sheet";
import React from "react";

export async function generateMetadata() {
  return generateMeta({
    title: "Calendar",
    description:
      "Professional calendar application for planning and organizing events and tasks efficiently. Built with Hypelive, Next.js and Tailwind CSS.",
    canonical: "/apps/calendar"
  });
}

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
