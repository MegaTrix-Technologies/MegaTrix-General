// Animated MT logo — reveals pixel-by-pixel like it's building itself,
// holds briefly when complete, then restarts.
import { useEffect, useState } from "react";

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

// Order: left-to-right, top-to-bottom — feels like typing/drawing.
const CELLS: Array<{ row: number; col: number }> = [];
for (let r = 0; r < GRID.length; r++) {
  for (let c = 0; c < GRID[r].length; c++) {
    if (GRID[r][c] === "#") CELLS.push({ row: r, col: c });
  }
}

interface Props {
  className?: string;
  block?: number;
  color?: string;
  ghostColor?: string;
  /** ms between pixel reveals */
  step?: number;
  /** ms to hold the finished logo before restarting */
  hold?: number;
  /** ms to hold the empty grid before starting again */
  gap?: number;
}

export default function AnimatedMTLogo({
  className,
  block = 14,
  color = "#FFFFFF",
  ghostColor = "rgba(0, 85, 255, 0.10)",
  step = 45,
  hold = 1400,
  gap = 250,
}: Props) {
  const [count, setCount] = useState(0);
  const total = CELLS.length;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (count < total) {
      timer = setTimeout(() => setCount((n) => n + 1), step);
    } else {
      timer = setTimeout(
        () => {
          // brief pause on empty, then restart
          setCount(-1);
          setTimeout(() => setCount(0), gap);
        },
        hold,
      );
    }
    return () => clearTimeout(timer);
  }, [count, total, step, hold, gap]);

  const gapPx = 2;
  const size = block + gapPx;
  const cols = GRID[0].length;
  const rows = GRID.length;
  const width = cols * size - gapPx;
  const height = rows * size - gapPx;

  return (
    <svg
      role="img"
      aria-label="MEGATRIX"
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={className}
    >
      {/* Ghost grid: shows every pixel position faintly so the target shape is hinted */}
      {CELLS.map((cell, i) => (
        <rect
          key={`g-${i}`}
          x={cell.col * size}
          y={cell.row * size}
          width={block}
          height={block}
          fill={ghostColor}
        />
      ))}
      {/* Revealed pixels */}
      {CELLS.slice(0, Math.max(0, count)).map((cell, i) => {
        const isNewest = i === count - 1;
        return (
          <rect
            key={`p-${i}`}
            x={cell.col * size}
            y={cell.row * size}
            width={block}
            height={block}
            fill={color}
            style={
              isNewest
                ? { filter: "drop-shadow(0 0 6px rgba(0,85,255,0.9))" }
                : undefined
            }
          />
        );
      })}
    </svg>
  );
}