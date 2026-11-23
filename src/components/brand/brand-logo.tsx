import Image from "next/image";

type BrandLogoSize = "sm" | "md" | "lg";

interface BrandLogoProps {
  /** Sizing variant: sm (compact/footer), md (standard navbar), lg (hero/large) */
  size?: BrandLogoSize;
  /** Additional CSS classes */
  className?: string;
  /** Priority loading flag for above-the-fold navbar */
  priority?: boolean;
}

const SIZE_MAP: Record<BrandLogoSize, { width: number; height: number; hClass: string }> = {
  sm: { width: 128, height: 32, hClass: "h-7 sm:h-8" },
  md: { width: 152, height: 38, hClass: "h-8 sm:h-9 md:h-10" },
  lg: { width: 176, height: 44, hClass: "h-10 sm:h-11 md:h-12" },
};

/**
 * Primary ContentCraft AI brand logo (symbol mark + wordmark).
 *
 * Uses the official SVG asset from `/design-assets/images/contentcraft_ai_logo.svg`.
 * Displays the dark forest charcoal (#2B3028) rounded-square mark with folded document,
 * diagonal stylus, and 4-point AI sparkle, alongside the "ContentCraft AI" wordmark
 * on the same horizontal row, vertically centered, on a solid warm off-white (#F9F9F6) background.
 */
export function BrandLogo({
  size = "md",
  className = "",
  priority = false,
}: BrandLogoProps) {
  const { width, height, hClass } = SIZE_MAP[size];

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <Image
        src="/design-assets/images/contentcraft_ai_logo.svg"
        alt="ContentCraft AI"
        width={width}
        height={height}
        className={`${hClass} w-auto object-contain shrink-0`}
        priority={priority}
      />
    </div>
  );
}

interface BrandSymbolProps {
  /** Size in pixels (width and height) */
  size?: number;
  /** Additional CSS classes */
  className?: string;
  /** Priority loading */
  priority?: boolean;
}

/**
 * Standalone ContentCraft AI logo symbol (app mark without wordmark text).
 */
export function BrandSymbol({
  size = 32,
  className = "",
  priority = false,
}: BrandSymbolProps) {
  return (
    <Image
      src="/design-assets/images/contentcraft_ai_symbol.svg"
      alt="ContentCraft AI Symbol"
      width={size}
      height={size}
      className={`rounded-lg object-contain shrink-0 ${className}`}
      priority={priority}
    />
  );
}

export const BrandIcon = BrandSymbol;
