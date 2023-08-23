import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';

import { getRestEndpoint } from 'ish-core/store/core/configuration';
import { whenTruthy } from 'ish-core/utils/operators';

@Injectable()
export class UniversalPrometheusInterceptor implements HttpInterceptor {
  constructor(
    private store: Store,
    @Optional()
    @Inject('PROMETHEUS_REST')
    private restCalls: { endpoint: string; duration: number }[]
  ) {}

  private endpointCategory(path: string): string {
    const pathSegments = path
      // clear leading slash and before (usually ...;loc=...;cur=...)
      .replace(/^[^\/]*\//, '')
      // clear trailing slash
      .replace(/\/$/, '')
      .split('/');

    const endpoint = pathSegments[0];
    if (endpoint === 'products' && pathSegments.length > 2) {
      // product sub calls like /products/SKU/links
      return `${endpoint}/${pathSegments[2]}`;
    } else if (endpoint === 'categories' && pathSegments.length === 1) {
      // category tree
      return `${endpoint}/tree`;
    } else if (endpoint === 'categories' && pathSegments[pathSegments.length - 1] === 'products') {
      // category product list
      return `${endpoint}/products`;
    } else if (endpoint === 'cms' && pathSegments.length >= 2) {
      // cms sub calls
      return `${endpoint}/${pathSegments[1]}`;
    }
    return endpoint;
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!SSR && !/on|1|true|yes/.test(process.env.PROMETHEUS?.toLowerCase())) {
      return next.handle(req);
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { performance } = require('perf_hooks');

    const start = performance.now();

    const tracker = (args: [HttpEvent<unknown>, string]) => {
      if (args && args.length === 2) {
        const [res, restEndPoint] = args;

        if ((res instanceof HttpResponse || res instanceof HttpErrorResponse) && req.url.startsWith(restEndPoint)) {
          const duration = performance.now() - start;
          const url = req.url.replace(restEndPoint, '');
          const endpoint = this.endpointCategory(url);
          this.restCalls.push({ endpoint, duration });
        }
      }
    };

    return next.handle(req).pipe(
      withLatestFrom(this.store.pipe(select(getRestEndpoint), whenTruthy())),
      tap({ next: tracker, error: tracker }),
      map(([res]) => res)
    );
  }
}
