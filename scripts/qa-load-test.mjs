import { createClient } from "@supabase/supabase-js";

const BASE_URL = "http://localhost:8080";
const SUPABASE_URL = "https://kovagothlqageyjvsrzr.supabase.co";
const SUPABASE_KEY = "sb_publishable_qGpTLnslQmG2za3zgRcfGg_WwgBEFpp";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function calculatePercentile(latencies, percentile) {
  if (!latencies.length) return 0;
  const sorted = [...latencies].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

async function runConcurrentBatch(targetUrl, concurrentUsers, requestsPerUser, customHeaders = {}) {
  const latencies = [];
  let successCount = 0;
  let errorCount = 0;
  const totalRequests = concurrentUsers * requestsPerUser;

  const startTime = Date.now();

  const worker = async () => {
    for (let i = 0; i < requestsPerUser; i++) {
      const reqStart = Date.now();
      try {
        const res = await fetch(targetUrl, {
          headers: {
            "User-Agent": "MegaTrix-LoadTester/1.0",
            ...customHeaders,
          },
        });
        const reqLatency = Date.now() - reqStart;
        latencies.push(reqLatency);

        if (res.status >= 200 && res.status < 400) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch (err) {
        latencies.push(Date.now() - reqStart);
        errorCount++;
      }
      // Micro-pause (10ms) to simulate realistic browser user think time between requests
      if (requestsPerUser > 1) {
        await new Promise((r) => setTimeout(r, 10));
      }
    }
  };

  const pool = Array.from({ length: concurrentUsers }, () => worker());
  await Promise.all(pool);

  const totalDuration = Date.now() - startTime;
  const rps = (totalRequests / (totalDuration / 1000)).toFixed(1);
  const avgLatency = (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(1);
  const minLatency = Math.min(...latencies);
  const maxLatency = Math.max(...latencies);
  const p50 = calculatePercentile(latencies, 50);
  const p90 = calculatePercentile(latencies, 90);
  const p95 = calculatePercentile(latencies, 95);
  const p99 = calculatePercentile(latencies, 99);
  const errorRate = ((errorCount / totalRequests) * 100).toFixed(2);

  return {
    targetUrl,
    concurrentUsers,
    totalRequests,
    successCount,
    errorCount,
    errorRate,
    totalDurationMs: totalDuration,
    rps,
    avgLatencyMs: avgLatency,
    minLatencyMs: minLatency,
    maxLatencyMs: maxLatency,
    p50Ms: p50,
    p90Ms: p90,
    p95Ms: p95,
    p99Ms: p99,
  };
}

async function runLoadAudit() {
  console.log("=================================================");
  console.log("   MEGATRIX CONCURRENCY & LOAD STRESS AUDIT     ");
  console.log("=================================================");

  // 1. Fetch real project ID for deep dynamic route testing
  let testProjectId = "";
  try {
    const { data } = await supabase.from("projects").select("id").limit(1).single();
    testProjectId = data?.id || "";
  } catch {}

  const loadScenarios = [
    {
      name: "Phase 1: Baseline Concurrency (50 VUs)",
      url: `${BASE_URL}/`,
      vu: 50,
      reqPerVu: 4,
    },
    {
      name: "Phase 2: Projects Catalogue Route (100 VUs)",
      url: `${BASE_URL}/projects`,
      vu: 100,
      reqPerVu: 3,
    },
    {
      name: "Phase 3: Dynamic 10-Photo Project Details (200 VUs)",
      url: `${BASE_URL}/project-details?id=${testProjectId}`,
      vu: 200,
      reqPerVu: 2,
    },
    {
      name: "Phase 4: High Spike Stress Test (300 VUs)",
      url: `${BASE_URL}/architecture`,
      vu: 300,
      reqPerVu: 2,
    },
    {
      name: "Phase 5: Direct Supabase REST API Read (150 VUs)",
      url: `${SUPABASE_URL}/rest/v1/projects?select=id,title,image_url,description,tools,deployed_on&order=created_at.desc`,
      vu: 150,
      reqPerVu: 2,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    },
  ];

  const allMetrics = [];

  for (const scenario of loadScenarios) {
    console.log(`\nExecuting [${scenario.name}]...`);
    console.log(`  -> URL: ${scenario.url}`);
    console.log(`  -> Concurrency: ${scenario.vu} Virtual Users | Total Requests: ${scenario.vu * scenario.reqPerVu}`);

    const result = await runConcurrentBatch(
      scenario.url,
      scenario.vu,
      scenario.reqPerVu,
      scenario.headers || {}
    );

    allMetrics.push({ ...scenario, ...result });

    console.log(`  ✓ Completed in ${result.totalDurationMs}ms (${result.rps} Req/Sec)`);
    console.log(`  ✓ Success: ${result.successCount} | Failed: ${result.errorCount} (Error Rate: ${result.errorRate}%)`);
    console.log(`  ✓ Latencies: Avg ${result.avgLatencyMs}ms | P50: ${result.p50Ms}ms | P95: ${result.p95Ms}ms | P99: ${result.p99Ms}ms | Max: ${result.maxLatencyMs}ms`);
  }

  console.log("\n=================================================");
  console.log("              LOAD AUDIT SUMMARY TABLE           ");
  console.log("=================================================");
  console.table(
    allMetrics.map((m) => ({
      Scenario: m.name.split(":")[0],
      VUs: m.concurrentUsers,
      Requests: m.totalRequests,
      RPS: m.rps,
      Avg_ms: m.avgLatencyMs,
      P95_ms: m.p95Ms,
      P99_ms: m.p99Ms,
      Error_Rate: `${m.errorRate}%`,
    }))
  );

  const overallErrors = allMetrics.reduce((sum, m) => sum + m.errorCount, 0);
  if (overallErrors === 0) {
    console.log("\n🏆 LOAD AUDIT STATUS: PASSED - 100% SUCCESS WITH 0 ERRORS UNDER CONCURRENCY.\n");
  } else {
    console.warn(`\n⚠️ LOAD AUDIT STATUS: COMPLETED WITH ${overallErrors} TOTAL ERRORS.\n`);
  }
}

runLoadAudit().catch(console.error);
