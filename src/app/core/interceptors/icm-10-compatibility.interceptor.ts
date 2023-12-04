import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, withLatestFrom } from 'rxjs';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';

@Injectable()
export class ICM10CompatibilityInterceptor implements HttpInterceptor {
  constructor(private featureToggleService: FeatureToggleService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.endsWith('/configurations') && req instanceof HttpRequest) {
      return next.handle(req).pipe(
        withLatestFrom(this.featureToggleService.enabled$('messageToMerchant')),
        map(([event, messageToMerchant]) => {
          if (event instanceof HttpResponse && messageToMerchant && event.body?.data?.shipping) {
            event.body.data.shipping.messageToMerchant = true;
          }
          return event;
        })
      );
    }
    return next.handle(req);
  }
}
