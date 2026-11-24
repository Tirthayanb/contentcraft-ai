"use client";

import * as React from "react";
import { Alert } from "@/components/ui/alert";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function FeedbackTestPage() {
  const { toast, setPosition, position } = useToast();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <div className="flex items-center justify-between pb-4 border-b border-[#E4E6DE] dark:border-[#383E36]">
        <div>
          <h1 className="text-2xl font-bold text-[#252A23] dark:text-[#FAFAF8]">
            Feedback & Overlay Verification
          </h1>
          <p className="text-sm text-[#74786F]">
            Testing Inline Alerts and Toast Notification System
          </p>
        </div>
        <ThemeToggle size="sm" />
      </div>

      {/* Section 1: Inline Alerts / Banners */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#252A23] dark:text-[#FAFAF8]">
          1. Inline Alerts / Banners (4 Variants)
        </h2>

        {/* Information */}
        <Alert
          variant="info"
          title="Information Update"
          actionText="View release notes"
          actionHref="#release-notes"
          dismissible
        >
          A new version of ContentCraft AI workspace is available with improved clarity scoring.
        </Alert>

        {/* Success */}
        <Alert
          variant="success"
          title="Draft Saved Successfully"
          actionText="Open drafts"
          actionHref="#drafts"
          dismissible
        >
          Your latest content summary and social variations have been saved to your workspace.
        </Alert>

        {/* Warning */}
        <Alert
          variant="warning"
          title="Approaching Storage Limit"
          actionText="Upgrade plan"
          actionHref="#upgrade"
          dismissible
        >
          You have used 85% of your available draft history. Consider exporting or upgrading.
        </Alert>

        {/* Error / Critical */}
        <Alert
          variant="error"
          title="Generation Failed"
          actionText="Retry generation"
          onAction={() => alert("Retrying...")}
          dismissible
        >
          Unable to simplify text due to network timeout. Please check your connection and try again.
        </Alert>
      </section>

      {/* Section 2: Toast Notifications */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#252A23] dark:text-[#FAFAF8]">
          2. Toast Notifications
        </h2>

        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-xs font-semibold text-[#74786F]">Position:</span>
          {(["bottom-right", "bottom-center", "top-right", "top-center"] as const).map((pos) => (
            <Button
              key={pos}
              size="sm"
              variant={position === pos ? "default" : "outline"}
              onClick={() => setPosition(pos)}
              className="text-xs"
            >
              {pos}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            size="sm"
            onClick={() =>
              toast({
                title: "Information Toast",
                description: "New writing assistant updates loaded.",
                variant: "info",
              })
            }
          >
            Trigger Info Toast
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="border-emerald-600 text-emerald-700 dark:text-emerald-400"
            onClick={() =>
              toast({
                title: "Saved to Library",
                description: "Your social post variation has been copied and saved.",
                variant: "success",
              })
            }
          >
            Trigger Success Toast
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="border-amber-600 text-amber-700 dark:text-amber-400"
            onClick={() =>
              toast({
                title: "Unsaved Changes",
                description: "Remember to save before switching tools.",
                variant: "warning",
              })
            }
          >
            Trigger Warning Toast
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() =>
              toast({
                title: "Action Error",
                description: "Could not connect to service. Try again.",
                variant: "error",
                actionText: "Retry",
                onAction: () => console.log("Retrying toast action"),
              })
            }
          >
            Trigger Error Toast
          </Button>
        </div>
      </section>
    </div>
  );
}
