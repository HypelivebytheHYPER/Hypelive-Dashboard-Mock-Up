"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

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
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8">
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertCircle className="size-8 text-destructive" />
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-muted-foreground max-w-md">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => window.location.href = "/dashboard/kol-discovery"}
          variant="outline"
        >
          Go to Dashboard
        </Button>
        <Button
          onClick={reset}
          className="gap-2"
        >
          <RefreshCw className="size-4" />
          Try Again
        </Button>
      </div>

      {process.env.NODE_ENV === "development" && (
        <details className="mt-4 max-w-2xl w-full">
          <summary className="cursor-pointer text-sm font-medium">
            Error Details (Development Only)
          </summary>
          <pre className="mt-2 rounded-md bg-muted p-4 text-xs overflow-auto">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
}
