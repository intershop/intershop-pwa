import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { memoize, once } from 'lodash-es';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { parseTimeToSeconds } from 'ish-core/utils/functions';
import { logECS } from 'ish-core/utils/ssr-logging.utils';

const CACHE_CONFIG = SSR ? process.env.CACHE_ICM_CALLS : undefined;

const config: () => Record<string, string> = once(() => {
  if (CACHE_CONFIG) {
    if (/recommended/i.test(CACHE_CONFIG)) {
      return {
        '/configurations': '5m',
        '/categories.*view=tree': '5m',
        '/localizations': '10m',
      };
    }
    try {
      return JSON.parse(CACHE_CONFIG);
    } catch (err) {
      logECS('error', `ERROR parsing CACHE_ICM_CALLS: ${err.message}`, 'ssr-cache.interceptor', {
        error: {
          message: err.message,
          type: 'ParseError',
        },
      });
      return {};
    }
  }
  return {};
});

const cacheTime = memoize((url): number => {
  const rule = Object.keys(config()).find(re => new RegExp(re, 'gi').test(url));
  if (rule) {
    const timeString = config()[rule];
    try {
      return parseTimeToSeconds(timeString);
    } catch (err) {
      logECS('error', `ERROR setting up CACHE_ICM_CALLS: ${err.message}`, 'ssr-cache.interceptor', {
        error: {
          message: err.message,
          type: 'ParseError',
        },
      });
    }
  }
  return 0;
});

class IcmCallsCache {
  private cache: Record<string, HttpResponse<unknown>> = {};

  get(key: string): HttpResponse<unknown> | undefined {
    return this.cache[key];
  }

  set(key: string, value: HttpResponse<unknown>): void {
    this.cache[key] = value;
  }

  delete(key: string): void {
    delete this.cache[key];
  }

  clear(): void {
    this.cache = {};
  }
}

export const icmCallsCache = new IcmCallsCache();

@Injectable()
export class SSRCacheInterceptor implements HttpInterceptor {
  constructor(private zone: NgZone) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const seconds = cacheTime(req.urlWithParams);
    if (CACHE_CONFIG && seconds && req.method === 'GET') {
      const cached = icmCallsCache.get(req.urlWithParams);
      if (cached) {
        return of(cached);
      } else {
        const cacheFn = (r: HttpEvent<unknown>) => {
          if (r instanceof HttpResponse) {
            icmCallsCache.set(req.urlWithParams, r);

            // schedule deletion
            this.zone.runOutsideAngular(() => {
              setTimeout(() => {
                icmCallsCache.delete(req.urlWithParams);
              }, seconds * 1000);
            });
          }
          return r;
        };
        return next.handle(req).pipe(tap(cacheFn));
      }
    }
    return next.handle(req);
  }
}
