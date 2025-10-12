import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-3 px-5 py-4 font-bold text-lg bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent hover:opacity-80 transition-opacity",
        className
      )}>
      <div className="relative h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-primary to-accent p-0.5">
        <div className="h-full w-full bg-background rounded-lg flex items-center justify-center">
          <Image
            src="/hypelive-logo.png"
            alt="Hypelive Logo"
            width={32}
            height={32}
            className="object-contain"
            priority
          />
        </div>
      </div>
      <span className="font-semibold tracking-tight">Hypelive Dashboard</span>
    </Link>
  );
}
