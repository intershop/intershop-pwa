import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, take } from 'rxjs';

import { getServerConfigParameter } from 'ish-core/store/core/server-config';

@Injectable()
export class OhsInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  static readonly URL_PATH = '/organizations';

  private externalURL: string;

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.store
      .pipe(
        select(getServerConfigParameter<string>('services.OrganizationHierarchyServiceDefinition.Endpoint')),
        take(1)
      )
      .subscribe(externalURL => (this.externalURL = externalURL));
    let cloneReq = req;
    if (req.url.includes(OhsInterceptor.URL_PATH)) {
      cloneReq = req.clone({
        url: this.externalURL.concat(req.url.substring(req.url.indexOf(OhsInterceptor.URL_PATH))),
      });
    }
    return next.handle(cloneReq);
  }
}
