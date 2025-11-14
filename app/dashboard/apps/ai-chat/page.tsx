"use client";

import dynamic from "next/dynamic";

// Dynamically import with SSR disabled to prevent build errors
// Note: Converted to Client Component to support ssr: false with dynamic imports
const AppRender = dynamic(() => import("@/app/dashboard/apps/ai-chat/app-render"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

// Note: Metadata moved to layout.tsx since this is now a Client Component
export default function Page() {
  return (
    <div className="m-auto flex h-[calc(100vh-var(--header-height)-3rem)] w-full max-w-(--breakpoint-md) items-center justify-center">
      <AppRender />
    </div>
  );
}
