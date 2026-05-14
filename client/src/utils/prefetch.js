/**
 * Prefetch Engine
 * ─────────────────────────────────────────────────────────────────────────────
 * Proactively loads JS chunks, images, and caches API data while the user
 * is idle on the homepage — so every nav tap is instant, zero wait.
 *
 * Strategy:
 *  1. scheduleIdleWork() — uses requestIdleCallback (or setTimeout fallback)
 *     to run tasks only when the browser has nothing better to do.
 *  2. prefetchRoute() — calls the same dynamic import() that React.lazy uses
 *     in App.jsx. Webpack deduplicates chunks by resolved path, so the chunk
 *     downloads once and is instantly served from cache on navigation.
 *  3. prefetchImage() — injects <link rel="prefetch" as="image"> into <head>
 *     so the browser fetches images in low-priority background.
 *  4. cacheSet/cacheGet — localStorage with expiry for API responses.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { calcEstimate, getPlanForEstimate } from "./projectEstimate";

const CACHE_PREFIX = "pf2_";
const NAV_PROFILE_KEY = `${CACHE_PREFIX}nav_profile_v1`;
const PREFETCH_MARK_KEY = `${CACHE_PREFIX}prefetch_marks_v1`;

// ── localStorage cache with TTL ──────────────────────────────────────────────

export function cacheSet(key, data, ttlMs = 10 * 60 * 1000) {
  try {
    localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ data, exp: Date.now() + ttlMs })
    );
  } catch {
    // Storage full or private browsing — silently skip
  }
}

export function cacheGet(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const { data, exp } = JSON.parse(raw);
    if (Date.now() > exp) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function cacheClear(key) {
  try {
    localStorage.removeItem(CACHE_PREFIX + key);
  } catch {
    // ignore
  }
}

function readJsonStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJsonStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full/private mode — skip
  }
}

// ── Idle-time scheduler ──────────────────────────────────────────────────────
// Runs tasks one-by-one only when the browser has ≥5ms of free time.
// Falls back to setTimeout(200ms) in browsers without requestIdleCallback.

export function scheduleIdleWork(tasks) {
  if (!tasks || tasks.length === 0) return;
  const ric =
    typeof window !== "undefined" && window.requestIdleCallback
      ? window.requestIdleCallback.bind(window)
      : (cb) => setTimeout(() => cb({ timeRemaining: () => 50 }), 200);

  let i = 0;
  function runNext(deadline) {
    while (i < tasks.length && deadline.timeRemaining() > 5) {
      try { tasks[i](); } catch { /* task errors never block the queue */ }
      i++;
    }
    if (i < tasks.length) ric(runNext);
  }
  ric(runNext);
}

// ── JS chunk prefetching ─────────────────────────────────────────────────────
// Calling the same import() as React.lazy means webpack serves the same chunk
// — the module is downloaded exactly once, cached in memory + browser cache.

const _prefetched = new Set();

export function prefetchRoute(importFn) {
  const id = importFn.toString();
  if (_prefetched.has(id)) return;
  _prefetched.add(id);
  importFn().catch(() => {
    // Network error during background prefetch — will retry on actual navigation
    _prefetched.delete(id);
  });
}

// ── Image preloading ─────────────────────────────────────────────────────────

const _preloadedImages = new Set();

export function prefetchImage(src) {
  if (!src || _preloadedImages.has(src)) return;
  _preloadedImages.add(src);
  try {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "image";
    link.href = src;
    document.head.appendChild(link);
  } catch {
    // Fallback: use Image object
    new window.Image().src = src;
  }
}

// ── API data prefetch ────────────────────────────────────────────────────────
// Fetches data in the background and caches in localStorage.
// Components call cacheGet(key) before hitting the network.

export async function prefetchData(key, fetchFn, ttlMs) {
  if (cacheGet(key) !== null) return; // already fresh in cache
  try {
    const data = await fetchFn();
    if (data != null) cacheSet(key, data, ttlMs);
  } catch {
    // Network error during background fetch — silent, will retry normally
  }
}

// ── Route prefetch map ───────────────────────────────────────────────────────
// These MUST match the dynamic imports in App.jsx (same resolved path).
// Webpack will create one chunk per entry; calling import() here primes
// the chunk cache so React.lazy renders without any loading delay.

export const ROUTE_PREFETCH = {
  "/services": () => import("../pages/ServicesPage/Services.jsx"),
  "/pricing":  () => import("../pages/PricingPage/PricingPage.jsx"),
  "/ourWork":  () => import("../pages/OurWorkPage/OurWork.jsx"),
  "/plan":     () => import("../pages/PlanPage/Plan3.jsx"),
};

const DEFAULT_ROUTE_ORDER = ["/services", "/ourWork", "/pricing", "/plan"];

const ROUTE_ASSET_PREFETCH = {
  "/services": [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  ],
  "/ourWork": [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=70",
  ],
  "/pricing": [
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=70",
  ],
};

function getRoutePrefetchPriority(currentPath = "/") {
  const profile = readJsonStorage(NAV_PROFILE_KEY, {
    visits: {},
    transitions: {},
  });

  const visitCounts = profile.visits || {};
  const transitionsFromCurrent = (profile.transitions && profile.transitions[currentPath]) || {};

  const scored = DEFAULT_ROUTE_ORDER.map((route, index) => {
    const score =
      (transitionsFromCurrent[route] || 0) * 6 +
      (visitCounts[route] || 0) * 2 +
      (DEFAULT_ROUTE_ORDER.length - index) * 0.25;
    return { route, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map((r) => r.route);
}

export function recordRouteVisit(pathname) {
  if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/partner")) return;

  const now = Date.now();
  const profile = readJsonStorage(NAV_PROFILE_KEY, {
    visits: {},
    transitions: {},
    lastPath: null,
    lastAt: now,
  });

  profile.visits[pathname] = (profile.visits[pathname] || 0) + 1;

  if (profile.lastPath && profile.lastPath !== pathname) {
    profile.transitions[profile.lastPath] = profile.transitions[profile.lastPath] || {};
    profile.transitions[profile.lastPath][pathname] =
      (profile.transitions[profile.lastPath][pathname] || 0) + 1;
  }

  profile.lastPath = pathname;
  profile.lastAt = now;
  writeJsonStorage(NAV_PROFILE_KEY, profile);
}

function markPrefetched(key) {
  const marks = readJsonStorage(PREFETCH_MARK_KEY, {});
  marks[key] = Date.now();
  writeJsonStorage(PREFETCH_MARK_KEY, marks);
}

function wasPrefetchedRecently(key, ttlMs = 5 * 60 * 1000) {
  const marks = readJsonStorage(PREFETCH_MARK_KEY, {});
  const at = marks[key];
  return typeof at === "number" && Date.now() - at < ttlMs;
}

function warmPublicDataCache() {
  const scenario = {
    pages: 8,
    features: "advanced",
    timeline: "standard",
    addOns: ["seo", "copywriting"],
  };

  const estimate = calcEstimate(scenario);
  const predictedPlan = getPlanForEstimate(estimate);

  cacheSet(
    "pricing_estimator_seed",
    {
      scenario,
      estimate,
      predictedPlan,
      warmedAt: Date.now(),
    },
    24 * 60 * 60 * 1000
  );
}

function prefetchLikelyAssets(route) {
  const urls = ROUTE_ASSET_PREFETCH[route] || [];
  for (const src of urls) prefetchImage(src);
}

// Schedules prefetch of ALL public route chunks during idle time.
// Safe to call multiple times — deduplication is handled internally.
export function prefetchAllRoutes() {
  scheduleIdleWork(
    Object.values(ROUTE_PREFETCH).map((fn) => () => prefetchRoute(fn))
  );
}

export function prefetchPredictedRoutes(currentPath = "/") {
  const orderedRoutes = getRoutePrefetchPriority(currentPath);

  const tasks = [];
  for (const route of orderedRoutes) {
    const importFn = ROUTE_PREFETCH[route];
    if (!importFn) continue;
    tasks.push(() => {
      const markKey = `route:${route}`;
      if (wasPrefetchedRecently(markKey)) return;
      prefetchRoute(importFn);
      prefetchLikelyAssets(route);
      markPrefetched(markKey);
    });
  }

  tasks.push(() => warmPublicDataCache());
  tasks.push(() => prefetchAllRoutes());

  scheduleIdleWork(tasks);
}
