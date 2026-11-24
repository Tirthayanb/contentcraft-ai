"use client";

import * as React from "react";
import { Alert } from "@/components/ui/alert";
import { ToastProvider, useToast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  ConfirmDialog,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverItem,
  PopoverSeparator,
} from "@/components/ui/popover";
import { Tooltip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  SlidersHorizontal,
  Download,
  Copy,
  Trash2,
  Info,
  Sparkles,
  HelpCircle,
} from "lucide-react";

function FeedbackShowcaseContent() {
  const { toast } = useToast();

  // Dialog states
  const [standardDialogOpen, setStandardDialogOpen] = React.useState(false);
  const [destructiveDialogOpen, setDestructiveDialogOpen] = React.useState(false);
  const [customModalOpen, setCustomModalOpen] = React.useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E4E6DE] dark:border-[#383E36]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#252A23] dark:text-[#FAFAF8]">
            Feedback & Overlay Component Showcase
          </h1>
          <p className="text-sm text-[#74786F] dark:text-[#A4AAA0] mt-1">
            Design System: Alerts, Toasts, Dialogs, Popovers & Tooltips
          </p>
        </div>
        <ThemeToggle size="sm" />
      </div>

      {/* 1. Inline Alerts / Banners */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#252A23] dark:text-[#FAFAF8]">
            1. Inline Alerts & Banners
          </h2>
          <p className="text-xs text-[#74786F] dark:text-[#A4AAA0]">
            Four standard reference states: Information, Success, Warning, Error.
          </p>
        </div>

        <div className="space-y-3">
          <Alert
            variant="info"
            title="Information Update"
            actionText="View release notes"
            actionHref="#release-notes"
            dismissible
          >
            A new version of ContentCraft AI workspace is available with improved clarity scoring.
          </Alert>

          <Alert
            variant="success"
            title="Draft Saved Successfully"
            actionText="Open drafts"
            actionHref="#drafts"
            dismissible
          >
            Your latest content summary and social variations have been saved to your workspace.
          </Alert>

          <Alert
            variant="warning"
            title="Approaching Storage Limit"
            actionText="Upgrade plan"
            actionHref="#upgrade"
            dismissible
          >
            You have used 85% of your available draft history. Consider exporting or upgrading.
          </Alert>

          <Alert
            variant="error"
            title="Generation Failed"
            actionText="Retry generation"
            onAction={() => alert("Retry action triggered")}
            dismissible
          >
            Unable to simplify text due to network timeout. Please check your connection and try again.
          </Alert>
        </div>
      </section>

      {/* 2. Toast Notifications */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#252A23] dark:text-[#FAFAF8]">
            2. Toast Notifications
          </h2>
          <p className="text-xs text-[#74786F] dark:text-[#A4AAA0]">
            Floating notifications with auto-dismissal, stacking, status badges, and action triggers.
          </p>
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

      {/* 3. Modal Dialogs */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#252A23] dark:text-[#FAFAF8]">
            3. Dialog & Modal Overlays
          </h2>
          <p className="text-xs text-[#74786F] dark:text-[#A4AAA0]">
            Accessible modal dialogs with backdrop blur, focus trap, Escape dismissal, and responsive action layouts.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            size="sm"
            className="bg-[#373A36] hover:bg-[#272C27] text-white"
            onClick={() => setStandardDialogOpen(true)}
          >
            Open Standard Modal
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => setDestructiveDialogOpen(true)}
          >
            Open Destructive Modal
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setCustomModalOpen(true)}
          >
            Open Custom Form Modal
          </Button>
        </div>
      </section>

      {/* 4. Popovers & Context Menus */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#252A23] dark:text-[#FAFAF8]">
            4. Popovers / Dropdowns
          </h2>
          <p className="text-xs text-[#74786F] dark:text-[#A4AAA0]">
            Trigger-anchored contextual popovers with outside-click dismissal and clean action items.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          {/* Action Menu Popover */}
          <Popover>
            <PopoverTrigger className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E4E6DE] dark:border-[#383E36] bg-white dark:bg-[#1E241E] text-xs font-medium text-[#252A23] dark:text-[#FAFAF8] hover:bg-[#F3F4EF] dark:hover:bg-[#2A302A] transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Draft Actions</span>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-56 p-1.5">
              <div className="px-2.5 py-1.5 text-xs font-semibold text-[#74786F]">
                Manage Selection
              </div>
              <PopoverItem
                onClick={() => {
                  toast({
                    title: "Copied",
                    description: "Draft copied to clipboard.",
                    variant: "success",
                  });
                }}
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy draft text</span>
              </PopoverItem>
              <PopoverItem
                onClick={() => {
                  toast({
                    title: "Exporting",
                    description: "Markdown download started.",
                    variant: "info",
                  });
                }}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export as Markdown</span>
              </PopoverItem>
              <PopoverSeparator />
              <PopoverItem
                onClick={() => setDestructiveDialogOpen(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete draft</span>
              </PopoverItem>
            </PopoverContent>
          </Popover>

          {/* Settings / Filter Popover */}
          <Popover>
            <PopoverTrigger className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E4E6DE] dark:border-[#383E36] bg-white dark:bg-[#1E241E] text-xs font-medium text-[#252A23] dark:text-[#FAFAF8] hover:bg-[#F3F4EF] dark:hover:bg-[#2A302A] transition-colors">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Tone Filter</span>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-3 space-y-2">
              <div className="text-xs font-semibold text-[#252A23] dark:text-[#FAFAF8]">
                Tone & Voice Settings
              </div>
              <p className="text-[11px] text-[#74786F] dark:text-[#A4AAA0] leading-relaxed">
                Adjust tone intensity for generated summaries and social snippets.
              </p>
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" className="text-xs h-7 px-2.5">
                  Concise
                </Button>
                <Button size="sm" variant="default" className="text-xs h-7 px-2.5 bg-[#373A36] text-white">
                  Friendly
                </Button>
                <Button size="sm" variant="outline" className="text-xs h-7 px-2.5">
                  Professional
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      {/* 5. Tooltips */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#252A23] dark:text-[#FAFAF8]">
            5. Tooltips
          </h2>
          <p className="text-xs text-[#74786F] dark:text-[#A4AAA0]">
            Compact hover and focus helper overlays with above/below pointer alignment.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 items-center">
          {/* Tooltip on top */}
          <Tooltip content="Turn a thought into a first draft" side="top">
            <Button size="sm" variant="outline" className="text-xs">
              Hover for Top Tooltip
            </Button>
          </Tooltip>

          {/* Tooltip on bottom */}
          <Tooltip content="Improve clarity while keeping your voice" side="bottom">
            <Button size="sm" variant="outline" className="text-xs">
              Hover for Bottom Tooltip
            </Button>
          </Tooltip>

          {/* Tooltip on icon button */}
          <Tooltip content="Read tool documentation" side="top">
            <button
              type="button"
              className="p-2 rounded-lg border border-[#E4E6DE] dark:border-[#383E36] text-[#74786F] hover:text-[#252A23] dark:hover:text-[#FAFAF8] hover:bg-[#F3F4EF] dark:hover:bg-[#2A302A] transition-colors cursor-pointer"
              aria-label="Help info"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* Tooltip on info icon */}
          <Tooltip content="Estimated reading time: 2 mins" side="bottom">
            <span className="inline-flex items-center gap-1 text-xs text-[#74786F] cursor-help">
              <Info className="w-3.5 h-3.5" />
              <span>Details</span>
            </span>
          </Tooltip>
        </div>
      </section>

      {/* Dialog 1: Standard Confirm */}
      <ConfirmDialog
        open={standardDialogOpen}
        onOpenChange={setStandardDialogOpen}
        title="Publish Content Update"
        description="Are you sure you want to publish this content? It will become visible to your team immediately."
        confirmText="Publish now"
        cancelText="Keep editing"
        onConfirm={() => {
          toast({
            title: "Published",
            description: "Your content draft is now live.",
            variant: "success",
          });
        }}
      />

      {/* Dialog 2: Destructive Confirm */}
      <ConfirmDialog
        open={destructiveDialogOpen}
        onOpenChange={setDestructiveDialogOpen}
        destructive
        title="Delete Draft Permanently?"
        description="This action cannot be undone. All version history and generated variations for this piece will be deleted."
        confirmText="Delete permanently"
        cancelText="Cancel"
        onConfirm={() => {
          toast({
            title: "Draft Deleted",
            description: "The draft was permanently removed.",
            variant: "error",
          });
        }}
      />

      {/* Dialog 3: Custom Content / Form Modal */}
      <Dialog open={customModalOpen} onOpenChange={setCustomModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Workspace Drafts</DialogTitle>
            <DialogDescription>
              Choose your preferred format to export all selected content drafts.
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="space-y-3">
            <div className="p-3 rounded-lg border border-[#E4E6DE] dark:border-[#383E36] bg-[#FAFAF8] dark:bg-[#181D18]">
              <span className="text-xs font-semibold block text-[#252A23] dark:text-[#FAFAF8]">
                Markdown (.md)
              </span>
              <span className="text-[11px] text-[#74786F]">
                Standard markdown format with headings and frontmatter metadata.
              </span>
            </div>

            <div className="p-3 rounded-lg border border-[#E4E6DE] dark:border-[#383E36] bg-[#FAFAF8] dark:bg-[#181D18]">
              <span className="text-xs font-semibold block text-[#252A23] dark:text-[#FAFAF8]">
                Plain Text (.txt)
              </span>
              <span className="text-[11px] text-[#74786F]">
                Unformatted text suitable for copying into email or notes.
              </span>
            </div>
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCustomModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-[#373A36] hover:bg-[#272C27] text-white"
              onClick={() => {
                setCustomModalOpen(false);
                toast({
                  title: "Export Started",
                  description: "Your files are being packaged for download.",
                  variant: "info",
                });
              }}
            >
              Export files
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function FeedbackShowcasePage() {
  return (
    <ToastProvider>
      <FeedbackShowcaseContent />
    </ToastProvider>
  );
}
