/**
 * Nested-safe body scroll lock.
 * Splash + intro + menus can lock; unlock only when the last lock is released.
 */

let lockCount = 0;

export function lockBodyScroll(): void {
  if (typeof document === "undefined") return;
  lockCount += 1;
  if (lockCount === 1) {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }
}

export function unlockBodyScroll(): void {
  if (typeof document === "undefined") return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    forceUnlockBodyScroll();
  }
}

/** Clears all locks — use when splash/intro finishes so scroll never stays stuck. */
export function forceUnlockBodyScroll(): void {
  if (typeof document === "undefined") return;
  lockCount = 0;
  document.documentElement.style.removeProperty("overflow");
  document.body.style.removeProperty("overflow");
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
}
