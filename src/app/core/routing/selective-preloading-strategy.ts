import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

/**
 * Selective Preloading Strategy for optimized route loading.
 *
 * Routes can be configured with `data.preload` to control preloading behavior:
 * - `'eager'`: Preload immediately after initial navigation (for critical routes like Home, Category, Product)
 * - `'lazy'`: Preload after a delay when browser is idle (for secondary routes)
 * - `undefined` or other: Don't preload (for rarely used routes like Account, Checkout)
 *
 * @example
 * {
 *   path: 'home',
 *   loadComponent: () => import('./home/home-page.component').then(c => c.HomePageComponent),
 *   data: { preload: 'eager' }
 * }
 */
@Injectable({ providedIn: 'root' })
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  /** Delay in ms before lazy preloading starts */
  private readonly lazyPreloadDelay = 3000;

  /** Delay in ms before eager preloading starts (after initial navigation) */
  private readonly eagerPreloadDelay = 100;

  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    const preloadConfig = route.data?.preload;

    switch (preloadConfig) {
      case 'eager':
        // Preload critical routes almost immediately after initial load
        // Small delay ensures initial navigation completes first
        return timer(this.eagerPreloadDelay).pipe(mergeMap(() => load()));

      case 'lazy':
        // Preload secondary routes after browser has been idle
        // Uses requestIdleCallback where available, falls back to timer
        return this.whenIdle(this.lazyPreloadDelay).pipe(mergeMap(() => load()));

      default:
        // Don't preload - load only when navigated to
        return of(undefined);
    }
  }

  /**
   * Returns an Observable that emits when the browser is idle or after a timeout.
   * Uses requestIdleCallback for better performance on supported browsers.
   */
  private whenIdle(timeout: number): Observable<void> {
    return new Observable(observer => {
      if (typeof requestIdleCallback === 'function') {
        const handle = requestIdleCallback(
          () => {
            observer.next();
            observer.complete();
          },
          { timeout }
        );
        return () => cancelIdleCallback(handle);
      } else {
        // Fallback for browsers without requestIdleCallback (Safari)
        const timeoutHandle = setTimeout(() => {
          observer.next();
          observer.complete();
        }, timeout);
        return () => clearTimeout(timeoutHandle);
      }
    });
  }
}
