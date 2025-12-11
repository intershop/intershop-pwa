import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export class SSRInternalBackendInterceptor implements HttpInterceptor {
  private readonly icmBaseUrlSsr: string | undefined;
  private readonly shouldAddHeader: boolean;

  constructor() {
    this.icmBaseUrlSsr = process.env.ICM_BASE_URL_SSR;

    // Only add header for requests to ICM_BASE_URL_SSR when it uses HTTP protocol and targets cluster.local
    if (this.icmBaseUrlSsr) {
      const [protocol, base] = this.icmBaseUrlSsr.split('://');
      const host = base?.split('/')[0].split(':')[0];
      const isClusterLocal = host?.endsWith('.cluster.local');
      this.shouldAddHeader = protocol === 'http' && !!isClusterLocal;
    } else {
      this.shouldAddHeader = false;
    }
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.shouldAddHeader && req.url.startsWith(this.icmBaseUrlSsr)) {
      // Clone request and add X-Forwarded-Proto header
      const modifiedReq = req.clone({
        setHeaders: {
          'X-Forwarded-Proto': 'https',
        },
      });
      return next.handle(modifiedReq);
    }

    return next.handle(req);
  }
}
