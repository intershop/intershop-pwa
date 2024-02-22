import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, withLatestFrom } from 'rxjs';

import { FeatureToggleService, FeatureToggleType } from 'ish-core/utils/feature-toggle/feature-toggle.service';

// not-dead-code
/**
 * provides a compatibility layer for REST API changes in newer ICM versions
 * please enable the interceptor in the `core.module.ts` if needed
 * e.g. `messageToMerchant` is no longer an environment feature toggle in ICM 11 but controlled by the configurations call
 */
@Injectable()
export class ICMCompatibilityInterceptor implements HttpInterceptor {
  constructor(private featureToggleService: FeatureToggleService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.url.endsWith('/configurations') && req instanceof HttpRequest) {
      return next.handle(req).pipe(
        withLatestFrom(this.featureToggleService.enabled$('messageToMerchant' as FeatureToggleType)),
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
