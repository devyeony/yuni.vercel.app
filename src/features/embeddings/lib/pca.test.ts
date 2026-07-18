import { describe, expect, it } from "vitest";
import { projectTo2d } from "./pca";

describe("projectTo2d", () => {
  it("recovers a plane embedded in higher dimensions", () => {
    // Points on a 2D grid, embedded in 5D via two orthogonal directions.
    const u = [1, 0, 1, 0, 0].map((v) => v / Math.SQRT2);
    const w = [0, 1, 0, -1, 0].map((v) => v / Math.SQRT2);
    const grid: [number, number][] = [
      [0, 0],
      [4, 0],
      [0, 2],
      [4, 2],
      [2, 1],
    ];
    const vectors = grid.map(([a, b]) =>
      u.map((uv, i) => a * uv + b * (w[i] ?? 0)),
    );

    const coords = projectTo2d(vectors);

    // Pairwise distances survive the projection (rigid up to rotation/flip).
    const dist = (p: [number, number], q: [number, number]) =>
      Math.hypot(p[0] - q[0], p[1] - q[1]);
    const gridDist = (p: number[], q: number[]) =>
      Math.hypot((p[0] ?? 0) - (q[0] ?? 0), (p[1] ?? 0) - (q[1] ?? 0));
    for (let i = 0; i < grid.length; i++) {
      for (let j = i + 1; j < grid.length; j++) {
        const a = coords[i];
        const b = coords[j];
        const p = grid[i];
        const q = grid[j];
        if (!a || !b || !p || !q) throw new Error("missing point");
        expect(dist(a, b)).toBeCloseTo(gridDist(p, q), 4);
      }
    }
  });

  it("puts the dominant variance on the first axis", () => {
    const vectors = [
      [-10, 1, 0],
      [10, -1, 0],
      [-10, -1, 0],
      [10, 1, 0],
    ];
    const coords = projectTo2d(vectors);
    const spread = (axis: 0 | 1) =>
      Math.max(...coords.map((c) => c[axis])) -
      Math.min(...coords.map((c) => c[axis]));
    expect(spread(0)).toBeGreaterThan(spread(1));
    expect(spread(0)).toBeCloseTo(20, 3);
    expect(spread(1)).toBeCloseTo(2, 3);
  });

  it("is deterministic", () => {
    const vectors = [
      [0.1, 0.9, 0.3],
      [0.8, 0.2, 0.5],
      [0.4, 0.4, 0.9],
    ];
    expect(projectTo2d(vectors)).toEqual(projectTo2d(vectors));
  });

  it("handles degenerate input without NaN", () => {
    expect(projectTo2d([])).toEqual([]);
    const identical = projectTo2d([
      [1, 1],
      [1, 1],
    ]);
    for (const [x, y] of identical) {
      expect(Number.isFinite(x)).toBe(true);
      expect(Number.isFinite(y)).toBe(true);
    }
  });
});
