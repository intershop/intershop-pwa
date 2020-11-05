import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { IdentityProviderFactory } from 'ish-core/identity-provider/identity-provider.factory';

@Injectable()
export class IdentityProviderInterceptor implements HttpInterceptor {
  constructor(private identityProviderFactory: IdentityProviderFactory, private appFacade: AppFacade) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // TODO: check if this works with PROXY_ICM
    if (req.url.startsWith(this.appFacade.icmBaseUrl)) {
      return this.identityProviderFactory.getInstance().intercept(req, next);
    }
    return next.handle(req);
  }
}
