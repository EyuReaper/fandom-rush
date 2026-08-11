// Load-tests GET /api/leaderboard and GET /api/ratings against a running server.
// Usage: node scripts/load-test.mjs [baseUrl] [concurrency] [durationSeconds]
// Example: node scripts/load-test.mjs http://localhost:3000 20 15
//
// Requires the server (and its Postgres) to actually be running —
// `docker-compose up -d` from the repo root, or `npm run dev` in server/
// against a real DATABASE_URL. See docs/DEPLOYMENT.md.

const baseUrl = process.argv[2] || "http://localhost:3000";
const concurrency = Number(process.argv[3] || 20);
const durationSeconds = Number(process.argv[4] || 15);

const targets = [
  { name: "GET /api/leaderboard", path: "/api/leaderboard?mode=endless&category=all" },
  { name: "GET /api/ratings", path: "/api/ratings" },
];

async function hit(url) {
  const start = performance.now();
  try {
    const res = await fetch(url);
    const ms = performance.now() - start;
    return { ok: res.ok, status: res.status, ms };
  } catch (err) {
    return { ok: false, status: 0, ms: performance.now() - start, error: String(err) };
  }
}

async function runWorker(url, deadline, results) {
  while (performance.now() < deadline) {
    results.push(await hit(url));
  }
}

function percentile(sorted, p) {
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

async function loadTest({ name, path }) {
  const url = `${baseUrl}${path}`;
  const results = [];
  const deadline = performance.now() + durationSeconds * 1000;

  const workers = Array.from({ length: concurrency }, () => runWorker(url, deadline, results));
  await Promise.all(workers);

  const latencies = results.map((r) => r.ms).sort((a, b) => a - b);
  const errors = results.filter((r) => !r.ok);
  const throughput = results.length / durationSeconds;

  console.log(`\n${name}  (${url})`);
  console.log(`  requests: ${results.length}  errors: ${errors.length}  throughput: ${throughput.toFixed(1)} req/s`);
  if (latencies.length > 0) {
    console.log(
      `  latency ms — p50: ${percentile(latencies, 50).toFixed(1)}  p95: ${percentile(latencies, 95).toFixed(1)}  p99: ${percentile(latencies, 99).toFixed(1)}  max: ${latencies[latencies.length - 1].toFixed(1)}`
    );
  }
  if (errors.length > 0) {
    const sample = errors.slice(0, 3).map((e) => e.error || e.status);
    console.log(`  sample errors: ${JSON.stringify(sample)}`);
  }
}

console.log(`Load testing ${baseUrl} — concurrency=${concurrency}, duration=${durationSeconds}s per endpoint`);
console.log(`Note: rate-limited endpoints (POST routes) aren't targeted here — GET /api/leaderboard and GET /api/ratings have no rate limiter applied (only the POST routes do, see server/src/routes/leaderboard.ts and ratings.ts).`);

for (const target of targets) {
  await loadTest(target);
}
