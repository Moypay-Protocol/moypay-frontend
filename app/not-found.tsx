import { Metadata } from "next";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/utils/page-metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Page Not Found",
  description:
    "The page you're looking for doesn't exist. Return to MoyPay dashboard or homepage.",
  keywords: ["404", "not found", "error"],
});

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default">
            <Link className="flex items-center gap-2" href="/dashboard">
              <Home className="w-4 h-4" />
              Go to Dashboard
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link className="flex items-center gap-2" href="/home">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
