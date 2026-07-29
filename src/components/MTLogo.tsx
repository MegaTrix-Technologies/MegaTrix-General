// Pixelated "MT." logo rendered as pure SVG (no image assets).
// Grid extracted directly from the reference image: 14 columns × 8 rows.
//
// ##....#######.
// ###..########.
// ########.##...
// ##.##.##.##...
// ##....##.##...
// ##....##.##...
// ##....##.##.##
// ##....##.##.##

type Variant = "white" | "blue" | "black";

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

interface Props {
  variant?: Variant;
  className?: string;
  /** Pixel size in SVG units. Rendering scales via width/height on the element. */
  block?: number;
  title?: string;
}

export default function MTLogo({
  variant = "white",
  className,
  block = 10,
  title = "MEGATRIX",
}: Props) {
  const rows = GRID.length;
  const cols = GRID[0].length;
  const gap = 1;
  const size = block + gap;
  const width = cols * size - gap;
  const height = rows * size - gap;

  const fills: Record<Variant, { bg: string | null; fg: string }> = {
    white: { bg: null, fg: "#FFFFFF" },
    blue: { bg: null, fg: "#0055FF" },
    black: { bg: null, fg: "#0A0A0A" },
  };
  const { fg } = fills[variant];

  return (
    <svg
      role="img"
      aria-label={title}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={className}
    >
      <title>{title}</title>
      {GRID.flatMap((line, row) =>
        line.split("").map((ch, col) =>
          ch === "#" ? (
            <rect
              key={`${row}-${col}`}
              x={col * size}
              y={row * size}
              width={block}
              height={block}
              fill={fg}
            />
          ) : null,
        ),
      )}
    </svg>
  );
}