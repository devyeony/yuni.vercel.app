/*
 * Minimal deterministic PCA — projects high-dimensional embedding vectors
 * onto their top-2 principal components for the 2D map. Hand-rolled on
 * purpose: the input is tiny (tens of points × 384 dims), so power
 * iteration is exact enough, adds zero dependencies, and — unlike UMAP —
 * is fully deterministic, which keeps static builds reproducible.
 */

const ITERATIONS = 100;

const dot = (a: number[], b: number[]) =>
  a.reduce((sum, v, i) => sum + v * (b[i] ?? 0), 0);

const scale = (v: number[], s: number) => v.map((x) => x * s);

const normalize = (v: number[]) => {
  const norm = Math.sqrt(dot(v, v));
  return norm > 0 ? scale(v, 1 / norm) : v;
};

/** v minus its projection onto each (unit) vector in `basis`. */
const orthogonalize = (v: number[], basis: number[][]) =>
  basis.reduce((rest, b) => {
    const projection = dot(rest, b);
    return rest.map((x, i) => x - projection * (b[i] ?? 0));
  }, v);

/**
 * Top eigenvector of Xᵀ X via power iteration, without materializing the
 * covariance matrix: v ← Xᵀ(X v). Deterministic start (first row with any
 * variance), re-orthogonalized against previous components every step.
 */
function principalComponent(rows: number[][], previous: number[][]): number[] {
  const seed = rows.find((row) => dot(row, row) > 0) ?? rows[0];
  if (!seed) return [];
  let v = normalize(orthogonalize(seed, previous));
  for (let i = 0; i < ITERATIONS; i++) {
    const projected = rows.map((row) => dot(row, v));
    const next = rows.reduce(
      (acc, row, r) =>
        acc.map((x, c) => x + (projected[r] ?? 0) * (row[c] ?? 0)),
      new Array<number>(v.length).fill(0),
    );
    v = normalize(orthogonalize(next, previous));
  }
  return v;
}

/** Project vectors onto their top-2 principal components → [x, y] each. */
export function projectTo2d(vectors: number[][]): [number, number][] {
  if (vectors.length === 0) return [];
  const dims = vectors[0]?.length ?? 0;
  const mean = new Array<number>(dims).fill(0);
  for (const vec of vectors) {
    for (let i = 0; i < dims; i++) mean[i] = (mean[i] ?? 0) + (vec[i] ?? 0);
  }
  const centered = vectors.map((vec) =>
    vec.map((x, i) => x - (mean[i] ?? 0) / vectors.length),
  );
  const pc1 = principalComponent(centered, []);
  const pc2 = principalComponent(centered, [pc1]);
  return centered.map((row) => [dot(row, pc1), dot(row, pc2)]);
}
