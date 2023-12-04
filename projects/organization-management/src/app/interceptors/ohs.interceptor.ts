import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { getICMBaseURL } from 'ish-core/store/core/configuration';

@Injectable()
export class OhsInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  static readonly OHS_URL = 'http://jskochnb:8081';

  static readonly URL_PATH = '/organizations';

  icmBaseUrl: string;

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.store.pipe(select(getICMBaseURL)).subscribe(icmBaseUrl => (this.icmBaseUrl = icmBaseUrl));
    let cloneReq = req;
    if (req.url.includes(OhsInterceptor.URL_PATH)) {
      cloneReq = req.clone({ url: req.url.replace(this.icmBaseUrl, OhsInterceptor.OHS_URL) });
    }
    return next.handle(cloneReq);
  }
}
