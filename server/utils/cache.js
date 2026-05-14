/**
 * server/utils/cache.js
 * Engineering pattern: In-memory LRU-style TTL cache.
 * Usage: cache.set(key, value, ttlMs)  cache.get(key)  cache.invalidate(pattern)
 */

class TTLCache {
  constructor() {
    this._store = new Map();
  }

  set(key, value, ttlMs = 60_000) {
    const expiresAt = Date.now() + ttlMs;
    this._store.set(key, { value, expiresAt });
  }

  get(key) {
    const entry = this._store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this._store.delete(key);
      return null;
    }
    return entry.value;
  }

  /** Invalidate all keys that contain the given string pattern */
  invalidate(pattern) {
    for (const key of this._store.keys()) {
      if (key.includes(pattern)) this._store.delete(key);
    }
  }

  /** Clear everything */
  flush() {
    this._store.clear();
  }
}

export const cache = new TTLCache();

// ── Cache key helpers & TTL constants ─────────────────────
export const CACHE_TTL = {
  DASHBOARD:      5 * 60_000,   // 5 min
  CONVERSATIONS:  30_000,        // 30 s
  UNREAD_COUNT:   10_000,        // 10 s
  PROJECTS:       2 * 60_000,   // 2 min
  CLIENTS:        2 * 60_000,
  NOTIFICATIONS:  15_000,        // 15 s
};

export const cacheKey = {
  dashboard:     (clientId)  => `dashboard:${clientId}`,
  conversations: (userId)    => `conversations:${userId}`,
  unread:        (userId)    => `unread:${userId}`,
  projects:      ()          => `projects:all`,
  clientProjects:(clientId)  => `projects:client:${clientId}`,
  clients:       ()          => `clients:all`,
  notifications: (userId)    => `notifications:${userId}`,
  thread:        (projectId) => `thread:${projectId}`,
};
