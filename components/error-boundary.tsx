"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations/motion-variants";

export default function ErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error("Error caught by boundary:", error);

    // You can integrate with error tracking services here
    // e.g., Sentry, LogRocket, etc.
  }, [error]);

  return (
    <div className="mesh-gradient-subtle flex min-h-[400px] flex-col items-center justify-center gap-4 p-8">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center gap-4"
      >
        <motion.div className="card-glass rounded-full p-4" variants={fadeInUp}>
          <AlertCircle className="size-8 text-destructive" />
        </motion.div>

        <motion.div className="text-center space-y-2" variants={fadeInUp}>
          <h2 className="text-2xl font-bold font-display">Something went wrong!</h2>
          <p className="text-muted-foreground max-w-md">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </motion.div>

        <motion.div className="flex gap-2" variants={fadeInUp}>
          <Button
            onClick={() => window.location.href = "/dashboard/kol-discovery"}
            variant="outline"
            className="gap-2 lift-on-hover"
          >
            <Home className="size-4" />
            Go to Dashboard
          </Button>
          <Button
            onClick={reset}
            className="gap-2 lift-on-hover"
          >
            <RefreshCw className="size-4" />
            Try Again
          </Button>
        </motion.div>
      </motion.div>

      {process.env.NODE_ENV === "development" && (
        <motion.details className="mt-4 max-w-2xl w-full" variants={fadeInUp}>
          <summary className="cursor-pointer text-sm font-medium transition-colors hover:text-primary">
            Error Details (Development Only)
          </summary>
          <pre className="card-glass mt-2 rounded-md p-4 text-xs overflow-auto border border-border/50">
            {error.stack}
          </pre>
        </motion.details>
      )}
    </div>
  );
}
