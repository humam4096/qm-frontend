import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

const RELOAD_GUARD_KEY = 'gms:chunk-reload';

const CHUNK_ERROR_PATTERN =
  /failed to fetch dynamically imported module|importing a module script failed|error loading dynamically imported module|unable to preload css/i;

export function isChunkLoadError(error: unknown): boolean {
  return error instanceof Error && CHUNK_ERROR_PATTERN.test(error.message);
}

/** Reload once after deploy so the browser fetches the latest index.html and chunks. */
function reloadForFreshBuild(): void {
  if (sessionStorage.getItem(RELOAD_GUARD_KEY)) return;

  sessionStorage.setItem(RELOAD_GUARD_KEY, '1');
  window.location.reload();
}

/** Call when a dynamic import fails (lazy route, preload, etc.). */
export function handleChunkLoadError(error: unknown): void {
  if (isChunkLoadError(error)) {
    reloadForFreshBuild();
  }
}

const PENDING_RELOAD = new Promise<never>(() => {
  /* reload in progress */
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithRetry<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
): LazyExoticComponent<T> {
  return lazy(async () => {
    try {
      return await importFn();
    } catch (error) {
      handleChunkLoadError(error);
      if (isChunkLoadError(error)) return PENDING_RELOAD;
      throw error;
    }
  });
}

/** Lazy-load a named export from a route/page module. */
export function lazyPage<M extends Record<string, ComponentType<any>>, K extends keyof M>(
  factory: () => Promise<M>,
  exportName: K,
): LazyExoticComponent<M[K]> {
  return lazyWithRetry(() => factory().then((mod) => ({ default: mod[exportName] })));
}

/** Register global listeners; call once in main.tsx before render. */
export function initChunkLoadRecovery(): void {
  sessionStorage.removeItem(RELOAD_GUARD_KEY);

  window.addEventListener('vite:preloadError', (e) => {
    e.preventDefault();
    reloadForFreshBuild();
  });

  window.addEventListener('unhandledrejection', (e) => {
    if (isChunkLoadError(e.reason)) {
      e.preventDefault();
      reloadForFreshBuild();
    }
  });
}
