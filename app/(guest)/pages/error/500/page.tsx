import { generateMeta } from "@/lib/utils";
import Image from "next/image";

export async function generateMetadata() {
  return generateMeta({
    title: "500 Page - Hypelive Dashboard",
    description:
      "This is an example of a template for 500 error pages. Built with technologies like Tailwind CSS, Next.js, React and Hypelive.",
    canonical: "/pages/error/404"
  });
}

export default function Error404() {
  return (
    <div className="grid h-screen items-center bg-background pb-8 lg:grid-cols-2 lg:pb-0">
      <div className="text-center">
        <p className="text-base font-semibold text-muted-foreground">500</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl lg:text-7xl">
          Server Error
        </h1>
        <p className="mt-6 text-base leading-7 text-muted-foreground">
          There seems to be a connection problem between the server and the website.
        </p>
      </div>

      <div className="col-span-1 hidden lg:block relative h-full">
        <Image
          src="/images/500.svg"
          alt="500 server error illustration"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
