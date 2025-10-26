import { generateMeta } from "@/lib/utils";
import ImageGenerator from "./components/image-generator";
import { TooltipProvider } from "@/components/ui/tooltip";

export async function generateMetadata() {
  return generateMeta({
    title: "AI Image Generator",
    description:
      "Professional AI image generation application with advanced UI components. Built with Tailwind CSS, React, Next.js. Fully compatible with Hypelive and TypeScript.",
    canonical: "/apps/ai-image-generator"
  });
}

export default function Page() {
  return (
    <TooltipProvider>
      <ImageGenerator />
    </TooltipProvider>
  );
}
