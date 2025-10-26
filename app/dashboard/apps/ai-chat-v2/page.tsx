import { Metadata } from "next";
import { generateMeta } from "@/lib/utils";
import dynamic from "next/dynamic";

// Dynamically import with SSR disabled to prevent build errors
const AIChatSidebar = dynamic(() => import("./components/ai-chat-sidebar"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});
const AIChatInterface = dynamic(() => import("./components/ai-chat-interface"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "AI Chat V2",
    description:
      "Professional AI chatbot application for interacting with artificial intelligence for messaging and assistance. Built with Hypelive, Next.js and Tailwind CSS.",
    canonical: "/apps/ai-chat-v2"
  });
}

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
