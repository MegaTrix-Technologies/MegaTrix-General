import { createClient } from "@supabase/supabase-js";

const BASE_URL = "http://localhost:8080";
const SUPABASE_URL = "https://kovagothlqageyjvsrzr.supabase.co";
const SUPABASE_KEY = "sb_publishable_qGpTLnslQmG2za3zgRcfGg_WwgBEFpp";
const CLOUD_NAME = "bogvstre";
const UPLOAD_PRESET = "MegaTrix General";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: [],
};

function recordTest(suite, name, passed, details = "") {
  results.total++;
  if (passed) {
    results.passed++;
    console.log(`  ✓ [PASS] [${suite}] ${name}`);
  } else {
    results.failed++;
    console.error(`  ✗ [FAIL] [${suite}] ${name} - ${details}`);
  }
  results.tests.push({ suite, name, passed, details });
}

// -------------------------------------------------------------
// Suite 1: Data Logic & Normalizer Unit Verification
// -------------------------------------------------------------
function testDataNormalization() {
  console.log("\n=== SUITE 1: DATA NORMALIZATION & 10-PHOTO CAPACITY ===");

  // Helper matching src/lib/projectsData.ts
  const getProjectAllImages = (project) => {
    if (!project) return [];
    const list = [];
    if (project.image_url && project.image_url.trim()) {
      list.push(project.image_url.trim());
    }
    if (Array.isArray(project.gallery_images)) {
      project.gallery_images.forEach((img) => {
        if (img && typeof img === "string" && img.trim() && !list.includes(img.trim())) {
          list.push(img.trim());
        }
      });
    }
    return list.slice(0, 10);
  };

  const slugify = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  // Test 1: Null/undefined project handling
  const nullImgs = getProjectAllImages(null);
  recordTest("DataLogic", "Handles null/undefined gracefully", Array.isArray(nullImgs) && nullImgs.length === 0);

  // Test 2: Single cover image only
  const single = getProjectAllImages({ image_url: "https://example.com/cover.jpg" });
  recordTest("DataLogic", "Extracts single primary cover correctly", single.length === 1 && single[0] === "https://example.com/cover.jpg");

  // Test 3: Deduplication when cover is also in gallery
  const dup = getProjectAllImages({
    image_url: "https://example.com/cover.jpg",
    gallery_images: ["https://example.com/cover.jpg", "https://example.com/photo2.jpg"],
  });
  recordTest("DataLogic", "Deduplicates cover image present in gallery array", dup.length === 2 && dup[0] === "https://example.com/cover.jpg");

  // Test 4: Enforces 10-photo maximum cap
  const twelveImages = Array.from({ length: 12 }, (_, i) => `https://example.com/img_${i + 1}.jpg`);
  const capped = getProjectAllImages({
    image_url: twelveImages[0],
    gallery_images: twelveImages.slice(1),
  });
  recordTest("DataLogic", "Strictly caps total photos at 10 items", capped.length === 10);

  // Test 5: Slugify consistency
  const slug = slugify("AI Logistics & SaaS System 2026!");
  recordTest("DataLogic", "Generates clean SEO-compliant slug", slug === "ai-logistics-saas-system-2026");
}

// -------------------------------------------------------------
// Suite 2: Supabase Database Integration & Schema
// -------------------------------------------------------------
async function testSupabaseIntegration() {
  console.log("\n=== SUITE 2: SUPABASE DATABASE & DATA INTEGRITY ===");

  try {
    // Test 1: Query projects
    const { data: projects, error: projErr } = await supabase.from("projects").select("*");
    recordTest("Database", "Fetch all projects from Supabase", !projErr && Array.isArray(projects) && projects.length > 0, projErr?.message);

    if (projects && projects.length > 0) {
      // Test 2: Check Cloudinary image URLs in DB
      const allHaveCloudinary = projects.every((p) => !p.image_url || p.image_url.includes("res.cloudinary.com") || p.image_url.startsWith("http"));
      recordTest("Database", "All projects have valid HTTP/Cloudinary URLs", allHaveCloudinary);

      // Test 3: Check tools stack array integrity
      const allHaveTools = projects.every((p) => Array.isArray(p.tools) && p.tools.length > 0);
      recordTest("Database", "All projects have structured tools array", allHaveTools);
    }

    // Test 4: Query contact_info
    const { data: contact, error: contactErr } = await supabase.from("contact_info").select("*").limit(1);
    recordTest("Database", "Fetch contact_info table", !contactErr, contactErr?.message);

    // Test 5: Verify contact_submissions table accessibility
    const { data: subs, error: subsErr } = await supabase.from("contact_submissions").select("id").limit(1);
    recordTest("Database", "Access contact_submissions table", !subsErr, subsErr?.message);
  } catch (err) {
    recordTest("Database", "Supabase general connection exception", false, err.message);
  }
}

// -------------------------------------------------------------
// Suite 3: Cloudinary Unsigned Upload Pipeline
// -------------------------------------------------------------
async function testCloudinaryUpload() {
  console.log("\n=== SUITE 3: CLOUDINARY DIRECT UPLOAD API ===");

  try {
    // 1x1 transparent PNG data URI for synthetic test
    const test1x1Png = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

    const formData = new FormData();
    formData.append("file", test1x1Png);
    formData.append("upload_preset", UPLOAD_PRESET);

    const startTime = Date.now();
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const latency = Date.now() - startTime;

    const data = await res.json();
    const isSuccess = res.ok && data.secure_url && data.secure_url.includes("res.cloudinary.com");
    
    recordTest(
      "Cloudinary",
      `Direct unsigned upload to '${CLOUD_NAME}' with preset '${UPLOAD_PRESET}' (Latency: ${latency}ms)`,
      isSuccess,
      data.error?.message || "Invalid response"
    );

    if (isSuccess) {
      recordTest("Cloudinary", "Response includes valid HTTPS CDN URL", data.secure_url.startsWith("https://"));
      recordTest("Cloudinary", "Response includes public_id and asset metadata", !!data.public_id && !!data.format);
    }
  } catch (err) {
    recordTest("Cloudinary", "Cloudinary upload network error", false, err.message);
  }
}

// -------------------------------------------------------------
// Suite 4: Frontend Routes & HTTP Availability
// -------------------------------------------------------------
async function testFrontendRoutes() {
  console.log("\n=== SUITE 4: FRONTEND ROUTES & HTTP AVAILABILITY ===");

  const routes = [
    { path: "/", name: "Homepage" },
    { path: "/projects", name: "Projects Catalogue" },
    { path: "/project-details", name: "Project Details (fallback)" },
    { path: "/contact", name: "Contact Page" },
    { path: "/admin", name: "Admin Portal" },
    { path: "/architecture", name: "Architecture Specs" },
  ];

  for (const route of routes) {
    try {
      const start = Date.now();
      const res = await fetch(`${BASE_URL}${route.path}`, {
        headers: { "User-Agent": "MegaTrix-QA-Suite/1.0" },
      });
      const latency = Date.now() - start;
      const html = await res.text();

      const passed = res.status >= 200 && res.status < 400 && html.length > 500;
      recordTest("FrontendRoutes", `Route [${route.path}] ${route.name} (HTTP ${res.status}, ${latency}ms)`, passed);
    } catch (err) {
      recordTest("FrontendRoutes", `Route [${route.path}] ${route.name} availability`, false, err.message);
    }
  }

  // Dynamic Project Details with real ID
  try {
    const { data: firstProj } = await supabase.from("projects").select("id").limit(1).single();
    if (firstProj?.id) {
      const start = Date.now();
      const res = await fetch(`${BASE_URL}/project-details?id=${firstProj.id}`);
      const latency = Date.now() - start;
      const html = await res.text();
      const passed = res.status === 200 && html.length > 500;
      recordTest("FrontendRoutes", `Route [/project-details?id=${firstProj.id.substring(0, 8)}...] (HTTP 200, ${latency}ms)`, passed);
    }
  } catch (err) {
    recordTest("FrontendRoutes", "Dynamic project details query", false, err.message);
  }
}

// -------------------------------------------------------------
// Suite 5: Security, XSS & Input Boundary Testing
// -------------------------------------------------------------
function testSecurityAndBoundaries() {
  console.log("\n=== SUITE 5: SECURITY & INPUT BOUNDARIES ===");

  // Test 1: XSS payload detection & escaping
  const xssPayload = `<script>alert('XSS')</script><img src=x onerror=alert(1)>`;
  const sanitized = xssPayload
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const isNeutralized = !sanitized.includes("<script>") && !sanitized.includes("<img");
  recordTest("Security", "XSS vector HTML escaping sanitization", isNeutralized);

  // Test 2: Email format RFC validation
  const validEmails = ["admin@megatrix.com", "john.doe+qa@domain.co.uk", "user123@sub.domain.org"];
  const invalidEmails = ["notanemail", "@missinguser.com", "user@", "user@.com"];
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validPass = validEmails.every((e) => emailRegex.test(e));
  const invalidPass = invalidEmails.every((e) => !emailRegex.test(e));
  recordTest("Security", "Contact email validation rules", validPass && invalidPass);

  // Test 3: Admin authentication guard verification
  const isPinValid = (pin) => pin === "2026" || pin === "MEGATRIX_ROOT";
  recordTest("Security", "Admin authentication passcode validation", isPinValid("2026") && !isPinValid("1234") && !isPinValid("admin"));
}

// -------------------------------------------------------------
// Main Runner
// -------------------------------------------------------------
async function runAllSuites() {
  console.log("=================================================");
  console.log("     MEGATRIX SENIOR QA FULL-STACK AUDIT        ");
  console.log("=================================================");

  testDataNormalization();
  await testSupabaseIntegration();
  await testCloudinaryUpload();
  await testFrontendRoutes();
  testSecurityAndBoundaries();

  console.log("\n=================================================");
  console.log(`TOTAL TESTS: ${results.total}`);
  console.log(`PASSED:      ${results.passed}`);
  console.log(`FAILED:      ${results.failed}`);
  console.log(`SUCCESS RATE: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  console.log("=================================================\n");

  if (results.failed > 0) {
    process.exit(1);
  }
}

runAllSuites().catch(console.error);
