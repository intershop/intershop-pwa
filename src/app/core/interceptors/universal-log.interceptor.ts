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

export class UniversalLogInterceptor implements HttpInterceptor {
  private logging = /on|1|true|yes/.test(process.env.LOGGING?.toLowerCase());

  private logAll = /on|1|true|yes/.test(process.env.LOG_ALL?.toLowerCase());

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.logging) {
      return next.handle(req);
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { performance } = require('perf_hooks');

    const start = performance.now();

    const logger = (res: HttpEvent<unknown>) => {
      if (
        (res instanceof HttpResponse || res instanceof HttpErrorResponse) &&
        (this.logAll || res.status >= 400 || res.status < 200)
      ) {
        const duration = (performance.now() - start).toFixed(2);
        const size = res instanceof HttpResponse ? ` ${JSON.stringify(res.body)?.length}` : '';

        // eslint-disable-next-line no-console
        console.log(`${req.method} ${req.urlWithParams} ${res.status}${size} - ${duration} ms`);
      }
    };

    return next.handle(req).pipe(tap({ next: logger, error: logger }));
  }
}
