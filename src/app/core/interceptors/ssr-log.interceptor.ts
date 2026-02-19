import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { InjectSingle } from 'ish-core/utils/injection';
import { getLogger } from 'ish-core/utils/ssr-logging/ssr-logging.service';
import { REQUEST_ID } from 'ish-core/utils/ssr/ssr.tokens';

const logger = getLogger('SSRLogInterceptor');

function getHttpRequestUrlLogData(req: HttpRequest<unknown>) {
  let path: string | undefined;
  let domain: string | undefined;

  try {
    const url = new URL(req.urlWithParams);
    path = url.pathname;
    domain = url.host;
  } catch {
    // If URL parsing fails (e.g., relative URL), extract path from urlWithParams
    const queryIndex = req.urlWithParams.indexOf('?');
    path = queryIndex >= 0 ? req.urlWithParams.substring(0, queryIndex) : req.urlWithParams;
  }

  return {
    original: req.urlWithParams,
    path,
    domain,
  };
}

@Injectable()
export class SSRLogInterceptor implements HttpInterceptor {
  constructor(@Optional() @Inject(REQUEST_ID) private requestId: InjectSingle<typeof REQUEST_ID>) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { performance } = require('perf_hooks');

    const start = performance.now();

    const logResponse = (res: HttpEvent<unknown>) => {
      if (res instanceof HttpResponse || res instanceof HttpErrorResponse) {
        const durationMs = performance.now() - start;
        const durationNs = Math.round(durationMs * 1_000_000); // ECS event.duration is in nanoseconds
        const size = res instanceof HttpResponse ? JSON.stringify(res.body)?.length : undefined;

        const logData = {
          ...(this.requestId && { trace: { id: this.requestId } }),
          http: {
            request: {
              method: req.method,
            },
            response: {
              status_code: res.status,
              ...(size !== undefined && { body: { bytes: size } }),
            },
          },
          url: getHttpRequestUrlLogData(req),
          event: {
            duration: durationNs,
          },
        };

        // SSRLogInterceptor is only used for information purposes, so we log all responses as info
        // SSR error and warning logs are handled in server.ts and app.server.module.ts
        if (res.status >= 500) {
          logger.info(logData, `${req.method} (server error)`);
        } else if (res.status >= 400) {
          logger.info(logData, `${req.method} (client error)`);
        } else {
          logger.info(logData, req.method);
        }
      }
    };

    return next.handle(req).pipe(tap({ next: logResponse, error: logResponse }));
  }
}
