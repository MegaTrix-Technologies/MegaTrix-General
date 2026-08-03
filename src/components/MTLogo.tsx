/**
 * MTLogo — Inline SVG pixel-art mark for MEGATRIX.
 *
 * Designed with a 140×80 viewBox (10×10 unit grid per cell: 8×8 block + 2px gap).
 * At 20% gap ratio, the gap between blocks never collapses to 0px even at small
 * CSS display sizes (e.g. 36px/40px height), ensuring every single pixel square
 * renders as a distinct, un-merged square box matching the original logo spec.
 *
 * Grid map (14 cols × 8 rows):
 *   Row 0: ##....#######.  (2 M peak, 4 gap, 7 T bar, 1 gap)
 *   Row 1: ###..########.  (3 M peak, 2 gap, 8 T bar, 1 gap)
 *   Row 2: ########.##...  (8 M bar,  1 gap, 2 T stem, 3 gap)
 *   Row 3: ##.##.##.##...  (2 M leg, 1 gap, 2 M V, 1 gap, 2 M leg, 1 gap, 2 T stem)
 *   Row 4: ##....##.##...  (2 M leg, 4 gap, 2 M leg, 1 gap, 2 T stem)
 *   Row 5: ##....##.##...  (2 M leg, 4 gap, 2 M leg, 1 gap, 2 T stem)
 *   Row 6: ##....##.##.##  (2 M leg, 4 gap, 2 M leg, 1 gap, 2 T stem, 1 gap, 2 dot)
 *   Row 7: ##....##.##.##  (2 M leg, 4 gap, 2 M leg, 1 gap, 2 T stem, 1 gap, 2 dot)
 */

interface Props {
  /** Tailwind / CSS class applied to the <svg> element. Default: h-12 w-auto */
  className?: string;
  /** Fill colour for all pixel blocks. Default: #FFFFFF (white). */
  color?: string;
  /** Accessible label. */
  alt?: string;
  // Legacy props kept for API compatibility.
  variant?: string;
  layout?: string;
  size?: string;
  showText?: boolean;
}

const GRID: string[] = [
  "##....#######.",
  "###..########.",
  "########.##...",
  "##.##.##.##...",
  "##....##.##...",
  "##....##.##...",
  "##....##.##.##",
  "##....##.##.##",
];

export default function MTLogo({
  className = "h-12 w-auto",
  color = "currentColor",
  alt = "MEGATRIX",
}: Props) {
  return (
    <svg
      viewBox="0 0 140 80"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      role="img"
      aria-label={alt}
      className={`block ${className}`}
    >
      <title>{alt}</title>
      {GRID.map((rowStr, r) =>
        Array.from(rowStr).map((char, c) =>
          char === "#" ? (
            <rect
              key={`${r}-${c}`}
              x={c * 10 + 1}
              y={r * 10 + 1}
              width={8}
              height={8}
              fill={color}
            />
          ) : null
        )
      )}
    </svg>
  );
}
