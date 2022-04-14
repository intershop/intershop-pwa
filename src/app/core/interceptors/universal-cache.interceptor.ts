import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { memoize, once } from 'lodash-es';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { parseTimeToSeconds } from 'ish-core/utils/functions';

const CACHE_CONFIG = process.env.CACHE_ICM_CALLS;

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
      console.error('ERROR parsing CACHE_ICM_CALLS:', err.message);
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
      console.error('ERROR setting up CACHE_ICM_CALLS:', err.message);
    }
  }
  return 0;
});

const cache: Record<string, HttpResponse<unknown>> = {};

@Injectable()
export class UniversalCacheInterceptor implements HttpInterceptor {
  constructor(private zone: NgZone) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const seconds = cacheTime(req.urlWithParams);
    if (CACHE_CONFIG && seconds && req.method === 'GET') {
      const cached = cache[req.urlWithParams];
      if (cached) {
        return of(cached);
      } else {
        const cacheFn = (r: HttpEvent<unknown>) => {
          if (r instanceof HttpResponse) {
            cache[req.urlWithParams] = r;

            // schedule deletion
            this.zone.runOutsideAngular(() => {
              setTimeout(() => {
                delete cache[req.urlWithParams];
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
