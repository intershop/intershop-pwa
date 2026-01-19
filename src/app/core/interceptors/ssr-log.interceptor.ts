import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LogLevel, logECS, shouldLog } from 'ish-core/utils/ssr-logging.utils';

export class SSRLogInterceptor implements HttpInterceptor {
  private logging = SSR && /on|1|true|yes/.test(process.env.LOGGING?.toLowerCase());

  private logAll = SSR && /on|1|true|yes/.test(process.env.LOG_ALL?.toLowerCase());

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.logging) {
      return next.handle(req);
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { performance } = require('perf_hooks');

    const start = performance.now();

    const logger = (res: HttpEvent<unknown>) => {
      if (res instanceof HttpResponse || res instanceof HttpErrorResponse) {
        // Determine log level based on status code
        let level: LogLevel = 'info';
        if (res.status >= 500) {
          level = 'error';
        } else if (res.status >= 400) {
          level = 'warn';
        }

        // Check if this log level should be logged and if we should log all or only errors
        if (!shouldLog(level) || (!this.logAll && res.status >= 200 && res.status < 400)) {
          return;
        }

        const duration = (performance.now() - start).toFixed(2);
        const size = res instanceof HttpResponse ? ` ${JSON.stringify(res.body)?.length}` : '';

        const message = `${req.method} ${req.urlWithParams} ${res.status}${size} - ${duration} ms`;

        // Add HTTP context similar to server.ts pinoHttp logs
        const httpContext = {
          http: {
            request: {
              method: req.method,
            },
            response: {
              status_code: res.status,
            },
          },
          url: {
            original: req.urlWithParams,
            path: req.url,
          },
          event: {
            duration: Math.round(parseFloat(duration) * 1e6), // Convert ms to nanoseconds (integer) for ECS compliance
          },
        };

        logECS(level, message, 'ssr-log.interceptor', httpContext);
      }
    };

    return next.handle(req).pipe(tap({ next: logger, error: logger }));
  }
}
