/**
 * Service Worker Cleanup Utility
 * Unregisters service workers and clears caches
 * Run this in browser console if you experience PWA caching issues
 */

export const unregisterServiceWorkers = async () => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
  }
};

export const clearAllCaches = async () => {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    for (const cacheName of cacheNames) {
      await caches.delete(cacheName);
    }
  }
};

export const resetPWA = async () => {
  await unregisterServiceWorkers();
  await clearAllCaches();
};

// Auto-run cleanup in development only (silent)
if (import.meta.env.DEV) {
  resetPWA();
}
