let lockCount = 0;

function canUseDOM() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/**
 * Lock body scroll by adding a CSS class that uses !important
 * to override the mobile overflow-y: auto !important rules.
 * Returns an unlock function.
 */
export function lockBodyScroll() {
  if (!canUseDOM()) return () => {};

  if (lockCount === 0) {
    document.body.classList.add("scroll-locked");
  }

  lockCount += 1;
  let released = false;

  return () => {
    if (released || !canUseDOM()) return;
    released = true;

    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
      document.body.classList.remove("scroll-locked");
    }
  };
}

/**
 * Force-release ALL body scroll locks.
 * Called on every route change to guarantee the page is scrollable.
 */
export function releaseAllBodyScrollLocks() {
  if (!canUseDOM()) return;

  lockCount = 0;
  document.body.classList.remove("scroll-locked");
  // Belt-and-braces: also clear any inline overflow that old code may have set
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
}
