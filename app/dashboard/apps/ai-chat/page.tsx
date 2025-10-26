import { generateMeta } from "@/lib/utils";
import dynamic from "next/dynamic";

// Dynamically import with SSR disabled to prevent build errors
const AppRender = dynamic(() => import("@/app/dashboard/apps/ai-chat/app-render"), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export async function generateMetadata() {
  return generateMeta({
    title: "AI Chat App",
    description:
      "Professional AI chat application for conversing with artificial intelligence. Built with Hypelive, Next.js and Tailwind CSS.",
    canonical: "/apps/ai-chat"
  });
}

export default function Page() {
  return (
    <div className="m-auto flex h-[calc(100vh-var(--header-height)-3rem)] w-full max-w-(--breakpoint-md) items-center justify-center">
      <AppRender />
    </div>
  );
}
