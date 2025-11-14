"use client";

import dynamic from "next/dynamic";

// Dynamically import with SSR disabled to prevent build errors
// Note: Converted to Client Component to support ssr: false with dynamic imports
const AIChatSidebar = dynamic(() => import("./components/ai-chat-sidebar"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});
const AIChatInterface = dynamic(() => import("./components/ai-chat-interface"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

// Note: Metadata moved to layout.tsx since this is now a Client Component
export default function Page() {
  return (
    <div className="relative flex h-[calc(100vh-var(--header-height)-3rem)] rounded-md lg:border">
      <AIChatSidebar />
      <div className="flex w-full grow flex-col">
        <AIChatInterface />
      </div>
    </div>
  );
}
