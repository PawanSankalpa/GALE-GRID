let lockCount = 0;
let previousOverflow = "";
let previousPaddingRight = "";

function canUseDOM() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export function lockBodyScroll() {
  if (!canUseDOM()) return () => {};

  const body = document.body;

  if (lockCount === 0) {
    previousOverflow = body.style.overflow;
    previousPaddingRight = body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
    body.style.overflow = "hidden";
  }

  lockCount += 1;
  let released = false;

  return () => {
    if (released || !canUseDOM()) return;
    released = true;

    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
      previousOverflow = "";
      previousPaddingRight = "";
    }
  };
}

export function releaseAllBodyScrollLocks() {
  if (!canUseDOM()) return;

  lockCount = 0;
  document.body.style.overflow = previousOverflow;
  document.body.style.paddingRight = previousPaddingRight;
  previousOverflow = "";
  previousPaddingRight = "";
}
