import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Container max-width variant:
   * - `default`: max-w-6xl (1152px) - Standard content, toolkits, marketing and shared headers
   * - `wide`: max-w-7xl (1280px) - Broad workspaces and dual-column layouts
   * - `narrow`: max-w-4xl (896px) - Focused cards, CTAs, previews, and documentation
   * - `full`: w-full with shared gutters
   */
  size?: "default" | "wide" | "narrow" | "full";
  as?: React.ElementType;
}

const sizeClasses: Record<NonNullable<ContainerProps["size"]>, string> = {
  default: "max-w-6xl",
  wide: "max-w-7xl",
  narrow: "max-w-4xl",
  full: "w-full",
};

/**
 * Shared responsive layout container establishing consistent horizontal gutters:
 * - Mobile (< 640px): px-4 (16px)
 * - Tablet (>= 640px): sm:px-6 (24px)
 * - Desktop (>= 1024px): lg:px-8 (32px)
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "default", as: Component = "div", children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "w-full mx-auto px-4 sm:px-6 lg:px-8",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = "Container";
