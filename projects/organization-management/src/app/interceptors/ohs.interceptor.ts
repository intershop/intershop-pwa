import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, take } from 'rxjs';

import { getExternalURLs, getICMBaseURL } from 'ish-core/store/core/configuration';

@Injectable()
export class OhsInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  static readonly URL_PATH = '/organizations';

  private icmBaseUrl: string;
  private externalURL: string;

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.store.pipe(select(getICMBaseURL), take(1)).subscribe(icmBaseUrl => (this.icmBaseUrl = icmBaseUrl));
    this.store.pipe(select(getExternalURLs), take(1)).subscribe(externalURLs => (this.externalURL = externalURLs[0]));
    let cloneReq = req;
    if (req.url.includes(OhsInterceptor.URL_PATH)) {
      cloneReq = req.clone({
        url: req.url.replace(this.icmBaseUrl, this.externalURL),
      });
    }
    return next.handle(cloneReq);
  }
}
