"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-xl border p-4 transition-all duration-200 flex items-start gap-3 text-sm shadow-xs",
  {
    variants: {
      variant: {
        info: "bg-[#F0F4FA] border-[#D0DFFA] text-[#1E3A8A] dark:bg-[#1E293B]/60 dark:border-[#38BDF8]/30 dark:text-[#E0F2FE]",
        success:
          "bg-[#F0FDF4] border-[#BBF7D0] text-[#14532D] dark:bg-[#064E3B]/30 dark:border-[#34D399]/30 dark:text-[#ECFDF5]",
        warning:
          "bg-[#FFFBEB] border-[#FDE68A] text-[#78350F] dark:bg-[#78350F]/20 dark:border-[#FBBF24]/30 dark:text-[#FEF3C7]",
        error:
          "bg-[#FEF2F2] border-[#FECACA] text-[#7F1D1D] dark:bg-[#7F1D1D]/25 dark:border-[#F87171]/30 dark:text-[#FEE2E2]",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

const iconMap = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

const iconColorMap = {
  info: "text-[#2563EB] dark:text-[#38BDF8]",
  success: "text-[#16A34A] dark:text-[#34D399]",
  warning: "text-[#D97706] dark:text-[#FBBF24]",
  error: "text-[#DC2626] dark:text-[#F87171]",
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  actionText?: string;
  onAction?: () => void;
  actionHref?: string;
  onDismiss?: () => void;
  dismissible?: boolean;
}

export function Alert({
  className,
  variant = "info",
  title,
  children,
  actionText,
  onAction,
  actionHref,
  onDismiss,
  dismissible = false,
  ...props
}: AlertProps) {
  const [dismissed, setDismissed] = React.useState(false);
  const activeVariant = variant || "info";
  const IconComponent = iconMap[activeVariant];
  const iconColor = iconColorMap[activeVariant];

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed) return null;

  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant: activeVariant }), className)}
      {...props}
    >
      <div className="shrink-0 pt-0.5">
        <IconComponent className={cn("h-4 w-4", iconColor)} />
      </div>

      <div className="flex-1 space-y-1 pr-1">
        {title && <h5 className="font-semibold leading-tight">{title}</h5>}
        {children && (
          <div className="text-xs sm:text-sm leading-relaxed opacity-90">
            {children}
          </div>
        )}
        {(actionText || actionHref) && (
          <div className="pt-1.5">
            {actionHref ? (
              <a
                href={actionHref}
                className="inline-flex items-center text-xs font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                {actionText || "Learn more"}
              </a>
            ) : (
              <button
                type="button"
                onClick={onAction}
                className="inline-flex items-center text-xs font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity cursor-pointer"
              >
                {actionText}
              </button>
            )}
          </div>
        )}
      </div>

      {(dismissible || onDismiss) && (
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 p-1 -mr-1 -mt-1 rounded-md opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export const Banner = Alert;
