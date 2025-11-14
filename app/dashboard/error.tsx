"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations/motion-variants";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="mesh-gradient-subtle flex min-h-[99vh] flex-col items-center justify-center gap-4 px-2 py-8">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-md text-center flex flex-col items-center gap-4"
      >
        <motion.div className="card-glass rounded-full p-4" variants={fadeInUp}>
          <AlertCircle className="size-12 text-destructive" />
        </motion.div>

        <motion.div className="space-y-2" variants={fadeInUp}>
          <h2 className="text-5xl font-bold font-display">Oops!</h2>
          <p className="text-lg text-muted-foreground">Something went wrong in the dashboard!</p>
          {error.digest && (
            <p className="text-xs text-muted-foreground font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </motion.div>

        <motion.div className="flex gap-2" variants={fadeInUp}>
          <Button
            onClick={() => window.location.href = "/dashboard"}
            variant="outline"
            className="gap-2 lift-on-hover"
          >
            <Home className="size-4" />
            Dashboard Home
          </Button>
          <Button
            onClick={reset}
            className="gap-2 lift-on-hover"
          >
            <RefreshCw className="size-4" />
            Try Again
          </Button>
        </motion.div>

        {process.env.NODE_ENV === "development" && (
          <motion.details className="mt-4 w-full text-left" variants={fadeInUp}>
            <summary className="cursor-pointer text-sm font-medium transition-colors hover:text-primary">
              Error Details (Development Only)
            </summary>
            <pre className="card-glass mt-2 rounded-md p-4 text-xs overflow-auto border border-border/50">
              {error.stack}
            </pre>
          </motion.details>
        )}
      </motion.div>
    </div>
  );
}
