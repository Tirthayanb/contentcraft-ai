"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "info" | "success" | "warning" | "error";

export interface ToastItem {
  id: string;
  title?: string;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
  actionText?: string;
  onAction?: () => void;
  dismissible?: boolean;
}

interface ToastContextType {
  toasts: ToastItem[];
  toast: (options: Omit<ToastItem, "id">) => string;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

const toastVariants = cva(
  "pointer-events-auto flex items-start gap-3 w-full max-w-sm sm:max-w-md rounded-xl border p-4 shadow-lg backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2",
  {
    variants: {
      variant: {
        info: "bg-white/95 border-[#D0DFFA] text-[#1E3A8A] dark:bg-[#1E241E]/95 dark:border-[#38BDF8]/40 dark:text-[#E0F2FE]",
        success:
          "bg-white/95 border-[#BBF7D0] text-[#14532D] dark:bg-[#1E241E]/95 dark:border-[#34D399]/40 dark:text-[#ECFDF5]",
        warning:
          "bg-white/95 border-[#FDE68A] text-[#78350F] dark:bg-[#1E241E]/95 dark:border-[#FBBF24]/40 dark:text-[#FEF3C7]",
        error:
          "bg-white/95 border-[#FECACA] text-[#7F1D1D] dark:bg-[#1E241E]/95 dark:border-[#F87171]/40 dark:text-[#FEE2E2]",
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

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    (options: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).slice(2, 9);
      const newToast: ToastItem = {
        id,
        duration: 5000,
        dismissible: true,
        ...options,
      };

      setToasts((prev) => [...prev, newToast]);

      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, newToast.duration);
      }

      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed z-50 flex flex-col gap-2.5 p-4 pointer-events-none w-full max-w-xs sm:max-w-sm md:max-w-md bottom-4 right-4 left-4 sm:left-auto items-end"
    >
      {toasts.map((t) => {
        const variant = t.variant || "info";
        const IconComponent = iconMap[variant];
        const iconColor = iconColorMap[variant];

        return (
          <div
            key={t.id}
            role="status"
            className={cn(toastVariants({ variant }))}
          >
            <div className="shrink-0 pt-0.5">
              <IconComponent className={cn("h-4 w-4", iconColor)} />
            </div>

            <div className="flex-1 space-y-1 pr-1">
              {t.title && <h5 className="font-semibold text-sm leading-tight">{t.title}</h5>}
              {t.description && (
                <div className="text-xs sm:text-sm opacity-90 leading-relaxed">
                  {t.description}
                </div>
              )}
              {t.actionText && (
                <button
                  type="button"
                  onClick={() => {
                    t.onAction?.();
                    dismiss(t.id);
                  }}
                  className="mt-1 text-xs font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  {t.actionText}
                </button>
              )}
            </div>

            {t.dismissible && (
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="shrink-0 p-1 -mr-1 -mt-1 rounded-md opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
