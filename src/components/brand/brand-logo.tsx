import Image from "next/image";

type BrandLogoSize = "sm" | "md" | "lg";

interface BrandLogoProps {
  /** Sizing variant: sm (28px height), md (32px height), lg (38px height) */
  size?: BrandLogoSize;
  /** Custom height in px (width scales automatically at 680:140 aspect ratio) */
  height?: number;
  /** Additional CSS classes */
  className?: string;
  /** Priority loading flag for above-the-fold navbar */
  priority?: boolean;
}

const SIZE_MAP: Record<BrandLogoSize, { width: number; height: number }> = {
  sm: { width: 136, height: 28 },
  md: { width: 155, height: 32 },
  lg: { width: 184, height: 38 },
};

/**
 * Primary ContentCraft AI logo (full wordmark: symbol + brand text).
 *
 * Automatically adapts between light and dark themes using official SVG assets
 * from `/design-assets/images/`.
 */
export function BrandLogo({
  size = "md",
  height,
  className = "",
  priority = false,
}: BrandLogoProps) {
  const dimensions = height
    ? { width: Math.round(height * (680 / 140)), height }
    : SIZE_MAP[size];

  return (
    <span className={`inline-flex items-center select-none ${className}`}>
      {/* Light mode: Charcoal logo on warm cream / white background */}
      <Image
        src="/design-assets/images/contentcraft_ai_logo.svg"
        alt="ContentCraft AI"
        width={dimensions.width}
        height={dimensions.height}
        className="block dark:hidden h-auto w-auto max-h-full object-contain"
        priority={priority}
      />
      {/* Dark mode: Crisp light typography with bounded mark on dark background */}
      <Image
        src="/design-assets/images/contentcraft_ai_logo_dark.svg"
        alt="ContentCraft AI"
        width={dimensions.width}
        height={dimensions.height}
        className="hidden dark:block h-auto w-auto max-h-full object-contain"
        priority={priority}
      />
    </span>
  );
}

interface BrandSymbolProps {
  /** Size in pixels (width and height) */
  size?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Standalone ContentCraft AI logo symbol (app mark without wordmark text).
 */
export function BrandSymbol({
  size = 32,
  className = "",
}: BrandSymbolProps) {
  return (
    <Image
      src="/design-assets/images/contentcraft_ai_symbol.svg"
      alt="ContentCraft AI Symbol"
      width={size}
      height={size}
      className={`rounded-lg object-contain shrink-0 ${className}`}
    />
  );
}

export const BrandIcon = BrandSymbol;
