import { useState, useRef, useEffect, useCallback } from "react";
import { Cpu, RefreshCw, RotateCcw } from "lucide-react";

// Dense, high-resolution grid configuration for complex maze paths
const COLS = 32;
const ROWS = 18;

interface Point {
  x: number;
  y: number;
  r: number;
  c: number;
}

export default function StickmanStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 960, height: 600 });

  // Grid wall state
  const [walls, setWalls] = useState<boolean[][]>(() => createComplexInitialMaze());

  // Stickman state (grid coordinates & pixel position)
  const [stickmanCell, setStickmanCell] = useState<{ r: number; c: number }>({ r: 1, c: 1 });
  const [stickmanPos, setStickmanPos] = useState<Point>({ x: 50, y: 50, r: 1, c: 1 });

  // Mouse / Target goal state
  const [targetCell, setTargetCell] = useState<{ r: number; c: number } | null>(null);

  // Dijkstra Shortest Path Result
  const [path, setPath] = useState<Point[]>([]);
  const [computationTime, setComputationTime] = useState<number>(0);

  // Animation states
  const [isWalking, setIsWalking] = useState(false);
  const [facingRight, setFacingRight] = useState(true);
  const walkPhaseRef = useRef(0);
  const [limbAngles, setLimbAngles] = useState({
    legLeft: 0,
    legRight: 0,
    armLeft: 0,
    armRight: 0,
  });

  // Function to create a rich, complex procedural initial maze layout
  function createComplexInitialMaze(): boolean[][] {
    const grid: boolean[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(false));

    // Outer boundary walls (solid outer perimeter)
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1) {
          grid[r][c] = true;
        }
      }
    }

    // Intricate cybernetic maze walls, choke points, and corridors
    const wallStructures = [
      // Vertical pillars & partitions
      { r1: 2, r2: 7, c1: 3, c2: 3 },
      { r1: 10, r2: 15, c1: 3, c2: 3 },
      { r1: 4, r2: 13, c1: 6, c2: 6 },
      { r1: 2, r2: 8, c1: 9, c2: 9 },
      { r1: 11, r2: 16, c1: 9, c2: 9 },
      { r1: 3, r2: 14, c1: 12, c2: 12 },
      { r1: 2, r2: 9, c1: 15, c2: 15 },
      { r1: 12, r2: 16, c1: 15, c2: 15 },
      { r1: 4, r2: 13, c1: 18, c2: 18 },
      { r1: 2, r2: 8, c1: 21, c2: 21 },
      { r1: 11, r2: 16, c1: 21, c2: 21 },
      { r1: 3, r2: 14, c1: 24, c2: 24 },
      { r1: 2, r2: 7, c1: 27, c2: 27 },
      { r1: 10, r2: 15, c1: 27, c2: 27 },

      // Horizontal maze bars creating winding corridors
      { r1: 3, r2: 3, c1: 4, c2: 5 },
      { r1: 14, r2: 14, c1: 4, c2: 5 },
      { r1: 8, r2: 8, c1: 7, c2: 8 },
      { r1: 5, r2: 5, c1: 10, c2: 11 },
      { r1: 13, r2: 13, c1: 10, c2: 11 },
      { r1: 9, r2: 9, c1: 13, c2: 14 },
      { r1: 4, r2: 4, c1: 16, c2: 17 },
      { r1: 14, r2: 14, c1: 16, c2: 17 },
      { r1: 8, r2: 8, c1: 19, c2: 20 },
      { r1: 5, r2: 5, c1: 22, c2: 23 },
      { r1: 13, r2: 13, c1: 22, c2: 23 },
      { r1: 9, r2: 9, c1: 25, c2: 26 },
      { r1: 4, r2: 4, c1: 28, c2: 29 },
      { r1: 14, r2: 14, c1: 28, c2: 29 },
    ];

    wallStructures.forEach(({ r1, r2, c1, c2 }) => {
      for (let r = r1; r <= r2; r++) {
        for (let c = c1; c <= c2; c++) {
          if (r > 0 && r < ROWS - 1 && c > 0 && c < COLS - 1) {
            grid[r][c] = true;
          }
        }
      }
    });

    // Leave key gaps open for multiple navigable pathways
    grid[5][3] = false;
    grid[12][3] = false;
    grid[8][6] = false;
    grid[5][9] = false;
    grid[13][9] = false;
    grid[8][12] = false;
    grid[5][15] = false;
    grid[13][15] = false;
    grid[8][18] = false;
    grid[5][21] = false;
    grid[13][21] = false;
    grid[8][24] = false;
    grid[5][27] = false;
    grid[12][27] = false;

    // Start position clear
    grid[1][1] = false;
    grid[1][2] = false;
    grid[2][1] = false;

    return grid;
  }

  // Generate randomized maze layout with guaranteed open passages
  const handleRegenerateMaze = () => {
    const grid: boolean[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1) {
          grid[r][c] = true;
        } else if ((r % 2 === 0 || c % 3 === 0) && Math.random() < 0.42) {
          grid[r][c] = true;
        }
      }
    }
    // Always keep start position & core arterial paths open
    grid[1][1] = false;
    grid[1][2] = false;
    grid[2][1] = false;
    grid[ROWS - 2][COLS - 2] = false;

    setWalls(grid);
    setStickmanCell({ r: 1, c: 1 });
    setPath([]);
  };

  // Reset Stickman to start cell
  const handleResetPosition = () => {
    setStickmanCell({ r: 1, c: 1 });
    setPath([]);
  };

  // Resize listener to get exact arena pixel dimensions
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const cellWidth = dimensions.width / COLS;
  const cellHeight = dimensions.height / ROWS;

  // Clamp pixel coordinates strictly inside the arena container box
  const clampPos = useCallback(
    (rawX: number, rawY: number, r: number, c: number): Point => {
      const halfWidth = 16;
      const halfHeight = 24;
      const margin = 8;
      const clampedX = Math.max(halfWidth + margin, Math.min(dimensions.width - halfWidth - margin, rawX));
      const clampedY = Math.max(halfHeight + margin, Math.min(dimensions.height - halfHeight - margin, rawY));
      return { x: clampedX, y: clampedY, r, c };
    },
    [dimensions.width, dimensions.height],
  );

  // Convert (r, c) to center pixel position (x, y) with clamping
  const getCellCenter = useCallback(
    (r: number, c: number): Point => {
      const rawX = (c + 0.5) * cellWidth;
      const rawY = (r + 0.5) * cellHeight;
      return clampPos(rawX, rawY, r, c);
    },
    [cellWidth, cellHeight, clampPos],
  );

  // Sync stickman pixel position to current cell
  useEffect(() => {
    setStickmanPos(getCellCenter(stickmanCell.r, stickmanCell.c));
  }, [stickmanCell, getCellCenter]);

  // DIJKSTRA'S ALGORITHM IMPLEMENTATION
  const runDijkstra = useCallback(
    (start: { r: number; c: number }, target: { r: number; c: number }) => {
      const startTime = performance.now();

      // If start or target is inside a wall, no valid path
      if (walls[start.r]?.[start.c] || walls[target.r]?.[target.c]) {
        setPath([]);
        setComputationTime(0);
        return;
      }

      const dist: number[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(Infinity));
      const prev: ({ r: number; c: number } | null)[][] = Array.from({ length: ROWS }, () =>
        Array(COLS).fill(null),
      );
      const visited: boolean[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(false));

      dist[start.r][start.c] = 0;
      const unvisitedNodes: { r: number; c: number; dist: number }[] = [];

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (!walls[r][c]) {
            unvisitedNodes.push({ r, c, dist: dist[r][c] });
          }
        }
      }

      while (unvisitedNodes.length > 0) {
        unvisitedNodes.sort((a, b) => dist[a.r][a.c] - dist[b.r][b.c]);
        const current = unvisitedNodes.shift();
        if (!current || dist[current.r][current.c] === Infinity) break;

        const { r, c } = current;
        visited[r][c] = true;

        if (r === target.r && c === target.c) break; // Reached target!

        // 4-Directional Neighbors (Up, Down, Left, Right)
        const neighbors = [
          { r: r - 1, c },
          { r: r + 1, c },
          { r, c: c - 1 },
          { r, c: c + 1 },
        ];

        for (const n of neighbors) {
          if (
            n.r >= 0 &&
            n.r < ROWS &&
            n.c >= 0 &&
            n.c < COLS &&
            !walls[n.r][n.c] &&
            !visited[n.r][n.c]
          ) {
            const alt = dist[r][c] + 1;
            if (alt < dist[n.r][n.c]) {
              dist[n.r][n.c] = alt;
              prev[n.r][n.c] = { r, c };
            }
          }
        }
      }

      // Reconstruct Shortest Path from Target to Start
      const pathPoints: Point[] = [];
      let curr: { r: number; c: number } | null = target;

      if (dist[target.r][target.c] !== Infinity) {
        while (curr !== null) {
          pathPoints.unshift(getCellCenter(curr.r, curr.c));
          curr = prev[curr.r][curr.c];
        }
      }

      const endTime = performance.now();
      setComputationTime(Math.round((endTime - startTime) * 100) / 100);
      setPath(pathPoints);
    },
    [walls, getCellCenter],
  );

  // Mouse Move Handler inside Arena
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const c = Math.floor(x / cellWidth);
    const r = Math.floor(y / cellHeight);

    if (r > 0 && r < ROWS - 1 && c > 0 && c < COLS - 1) {
      if (!walls[r][c]) {
        setTargetCell({ r, c });
      }
    }
  };

  // Re-calculate Dijkstra path when target or stickman cell changes
  useEffect(() => {
    if (targetCell) {
      runDijkstra(stickmanCell, targetCell);
    }
  }, [targetCell, stickmanCell, runDijkstra]);

  // Smooth movement loop & continuous sine-wave limb animation
  useEffect(() => {
    let animId: number;

    const moveAlongPath = () => {
      if (path.length > 1) {
        const nextWaypoint = path[1];

        setStickmanPos((prev) => {
          const dx = nextWaypoint.x - prev.x;
          const dy = nextWaypoint.y - prev.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 3) {
            setIsWalking(true);
            setFacingRight(dx >= 0);

            // Continuous sine wave for butter-smooth leg/arm walking movement
            walkPhaseRef.current += 0.22;
            const swing = Math.sin(walkPhaseRef.current);
            setLimbAngles({
              legLeft: swing * 26,
              legRight: -swing * 26,
              armLeft: -swing * 20,
              armRight: swing * 20,
            });

            // Speed factor suited for higher resolution grid
            const speed = Math.min(dist * 0.16, 5);
            const rawX = prev.x + (dx / dist) * speed;
            const rawY = prev.y + (dy / dist) * speed;

            return clampPos(rawX, rawY, prev.r, prev.c);
          } else {
            // Reached waypoint node! Advance stickmanCell to next node
            setStickmanCell({ r: nextWaypoint.r, c: nextWaypoint.c });
            return nextWaypoint;
          }
        });
      } else {
        setIsWalking(false);
        // Smoothly return limbs to natural standing stance
        setLimbAngles((prev) => ({
          legLeft: prev.legLeft * 0.7,
          legRight: prev.legRight * 0.7,
          armLeft: prev.armLeft * 0.7,
          armRight: prev.armRight * 0.7,
        }));
      }
      animId = requestAnimationFrame(moveAlongPath);
    };

    animId = requestAnimationFrame(moveAlongPath);
    return () => cancelAnimationFrame(animId);
  }, [path, clampPos]);

  return (
    <section className="relative z-10 py-20 mx-auto max-w-[1600px] px-8 md:px-12">
      {/* SECTION HEADER & CONTROL BAR */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 border border-[#1E2538] bg-[#12151E] px-3.5 py-1.5 font-mono text-xs md:text-sm font-bold tracking-wider text-[#0055FF]">
            <Cpu size={15} />
            DIJKSTRA CYBERNETIC MAZE RUNNER
          </div>
          <h2 className="text-3xl font-extrabold text-white md:text-5xl">
            SHORTEST PATH <span className="text-[#0055FF] glow-text">ALGORITHM ARENA</span>
          </h2>
          <p className="mt-3 text-base md:text-lg text-[#CBD5E1] max-w-3xl">
            Hover or click inside the high-density cyber maze below — Dijkstra's Shortest Path Algorithm navigates winding corridors and obstacle walls in real-time.
          </p>
        </div>

        {/* CONTROLS BUTTONS */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRegenerateMaze}
            className="flex items-center gap-2 border border-[#0055FF] bg-[#0055FF]/15 px-4 py-2.5 font-mono text-xs font-bold tracking-widest text-white hover:bg-[#0055FF] hover:shadow-[0_0_20px_rgba(0,85,255,0.4)] transition-all"
          >
            <RefreshCw size={14} />
            REGENERATE MAZE
          </button>
          <button
            onClick={handleResetPosition}
            className="flex items-center gap-2 border border-[#1E2538] bg-[#12151E] px-4 py-2.5 font-mono text-xs font-bold tracking-widest text-[#CBD5E1] hover:border-[#0055FF] hover:text-white transition-all"
          >
            <RotateCcw size={14} />
            RESET START
          </button>
        </div>
      </div>

      {/* DENSE HIGH-RESOLUTION MAZE ARENA CONTAINER (600px HEIGHT) */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTargetCell(null)}
        className="group relative h-[540px] md:h-[600px] w-full overflow-hidden border-2 border-[#1E2538] bg-[#0B0D14] cursor-crosshair shadow-[0_0_50px_rgba(0,85,255,0.15)] hover:border-[#0055FF] transition-all rounded-sm"
      >
        {/* RETRO GRID CANVAS OVERLAY */}
        <div className="pointer-events-none absolute inset-0 retro-grid opacity-25" />
        <div className="pointer-events-none absolute inset-0 scanlines opacity-25" />

        {/* MAZE WALL OBSTACLES GRID */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          {walls.map((row, r) =>
            row.map((isWall, c) => {
              if (!isWall) return null;
              return (
                <rect
                  key={`${r}-${c}`}
                  x={c * cellWidth}
                  y={r * cellHeight}
                  width={cellWidth}
                  height={cellHeight}
                  fill="#121726"
                  stroke="#1E2842"
                  strokeWidth="0.8"
                  className="transition-all duration-300"
                />
              );
            }),
          )}

          {/* DIJKSTRA SHORTEST PATH OVERLAY LINE */}
          {path.length > 1 && (
            <polyline
              points={path.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="#0055FF"
              strokeWidth="3.5"
              strokeDasharray="5 3"
              className="animate-pulse drop-shadow-[0_0_15px_rgba(0,85,255,0.9)]"
            />
          )}

          {/* DIJKSTRA WAYPOINT NODES */}
          {path.map((p, idx) => (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r={idx === path.length - 1 ? 5 : 2.5}
              fill={idx === path.length - 1 ? "#00FFFF" : "#0055FF"}
              className="drop-shadow-[0_0_8px_rgba(0,85,255,0.8)]"
            />
          ))}
        </svg>

        {/* TARGET RETICLE AT DESTINATION CELL */}
        {targetCell && !walls[targetCell.r]?.[targetCell.c] && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-75"
            style={{
              left: (targetCell.c + 0.5) * cellWidth,
              top: (targetCell.r + 0.5) * cellHeight,
            }}
          >
            <div className="relative flex items-center justify-center">
              <div className="h-7 w-7 rounded-full border border-[#0055FF] animate-ping opacity-75" />
              <div className="absolute h-3.5 w-3.5 rounded-full bg-[#00FFFF]/50 border border-[#00FFFF]" />
            </div>
          </div>
        )}

        {/* STICKMAN CHARACTER SVG NAVIGATING MAZE */}
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-75 z-20"
          style={{
            left: stickmanPos.x,
            top: stickmanPos.y,
            transform: `translate(-50%, -50%) scaleX(${facingRight ? 1 : -1})`,
          }}
        >
          <svg width="40" height="60" viewBox="0 0 40 60" className="drop-shadow-[0_0_14px_rgba(0,85,255,0.95)]">
            {/* Head */}
            <circle cx="20" cy="12" r="7" fill="#090A0F" stroke="#0055FF" strokeWidth="2.5" />
            {/* Cyber Visor */}
            <rect x="17" y="9" width="8" height="3" fill="#00FFFF" rx="1" />

            {/* Body Spine */}
            <line x1="20" y1="19" x2="20" y2="36" stroke="#0055FF" strokeWidth="2.5" strokeLinecap="round" />

            {/* Left Arm */}
            <line
              x1="20"
              y1="23"
              x2={20 + Math.sin((limbAngles.armLeft * Math.PI) / 180) * 12}
              y2={23 + Math.cos((limbAngles.armLeft * Math.PI) / 180) * 12}
              stroke="#0055FF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Right Arm */}
            <line
              x1="20"
              y1="23"
              x2={20 + Math.sin((limbAngles.armRight * Math.PI) / 180) * 12}
              y2={23 + Math.cos((limbAngles.armRight * Math.PI) / 180) * 12}
              stroke="#0055FF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Left Leg */}
            <line
              x1="20"
              y1="36"
              x2={20 + Math.sin((limbAngles.legLeft * Math.PI) / 180) * 15}
              y2={36 + Math.cos((limbAngles.legLeft * Math.PI) / 180) * 15}
              stroke="#0055FF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Right Leg */}
            <line
              x1="20"
              y1="36"
              x2={20 + Math.sin((limbAngles.legRight * Math.PI) / 180) * 15}
              y2={36 + Math.cos((limbAngles.legRight * Math.PI) / 180) * 15}
              stroke="#0055FF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* HUD OVERLAY PANELS */}
        <div className="pointer-events-none absolute top-4 left-4 right-4 flex items-center justify-between font-mono text-xs text-[#CBD5E1] z-10">
          <div className="flex items-center gap-3 border border-[#1E2538] bg-[#090A0F]/90 px-3.5 py-1.5 shadow-md">
            <span className="h-2 w-2 rounded-full bg-[#0055FF] animate-pulse" />
            <span>ALGORITHM: <span className="text-[#0055FF] font-bold">DIJKSTRA SHORTEST PATH</span></span>
          </div>

          <div className="flex items-center gap-4 border border-[#1E2538] bg-[#090A0F]/90 px-3.5 py-1.5 shadow-md">
            <span>NODES: <span className="text-white font-bold">{path.length > 0 ? path.length : 0}</span></span>
            <span>LATENCY: <span className="text-green-400 font-bold">{computationTime} ms</span></span>
          </div>
        </div>

        {/* BOTTOM HUD OVERLAY */}
        <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between border-t border-[#1E2538] pt-2.5 font-mono text-xs tracking-widest text-[#7C89A8] z-10">
          <div className="flex items-center gap-4">
            <span className="text-[#0055FF] font-bold">STICKMAN POSITION:</span>
            <span>GRID [ R: {stickmanCell.r} | C: {stickmanCell.c} ]</span>
          </div>
          <div className="hidden sm:block text-[#00FFFF]">
            {path.length > 1
              ? `EXECUTING DIJKSTRA PATH (${path.length} NODES)`
              : "HOVER MAZE CELL TO EXECUTE PATHFINDER"}
          </div>
        </div>
      </div>
    </section>
  );
}
