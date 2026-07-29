// Pixelated "MT" logo rendered as pure SVG (no image assets).
// Grid is 13 columns x 7 rows of pixel blocks.
//
// M (cols 0-4)          gap (col 5)   T (cols 6-12, 7 wide)
//  X . . . X                          X X X X X X X
//  X X . X X                          . . . X . . .
//  X X X X X                          . . . X . . .
//  X . X . X                          . . . X . . .
//  X . . . X                          . . . X . . .
//  X . . . X                          . . . X . . .
//  X . . . X                          . . . X . . .

type Variant = "white" | "blue" | "black";

const PIXELS: [number, number][] = [
  // ---- M ----
  // row 0
  [0, 0], [0, 4],
  // row 1
  [1, 0], [1, 1], [1, 3], [1, 4],
  // row 2
  [2, 0], [2, 1], [2, 2], [2, 3], [2, 4],
  // row 3
  [3, 0], [3, 2], [3, 4],
  // row 4
  [4, 0], [4, 4],
  // row 5
  [5, 0], [5, 4],
  // row 6
  [6, 0], [6, 4],

  // ---- T ---- (offset by 6 on x-axis)
  // row 0 (top bar)
  [0, 6], [0, 7], [0, 8], [0, 9], [0, 10], [0, 11], [0, 12],
  // stem (col 9)
  [1, 9], [2, 9], [3, 9], [4, 9], [5, 9], [6, 9],
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
  const cols = 13;
  const rows = 7;
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
      {PIXELS.map(([row, col], i) => (
        <rect
          key={i}
          x={col * size}
          y={row * size}
          width={block}
          height={block}
          fill={fg}
        />
      ))}
    </svg>
  );
}