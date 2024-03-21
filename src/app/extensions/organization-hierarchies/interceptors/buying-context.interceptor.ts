import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, iif } from 'rxjs';
import { concatMap, first, map, withLatestFrom } from 'rxjs/operators';

import { getConfigurationState, getRestEndpoint } from 'ish-core/store/core/configuration';
import { getServerConfigParameter } from 'ish-core/store/core/server-config';
import { whenTruthy } from 'ish-core/utils/operators';

import { getBuyingContext } from '../store/buying-context';

@Injectable()
export class BuyingContextInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  static matrixparam = 'bctx';

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let isOrganizationHierarchiesServiceAvailable = false;
    this.store
      .pipe(
        select(getServerConfigParameter<string>('services.OrganizationHierarchyServiceDefinition.Endpoint')),
        whenTruthy()
      )
      .subscribe(() => (isOrganizationHierarchiesServiceAvailable = true));
    if (!isOrganizationHierarchiesServiceAvailable) {
      return next.handle(req);
    }

    return this.store.pipe(
      first(),
      concatMap((store: { organizationHierarchies: unknown }) =>
        iif(
          () => !!store.organizationHierarchies,
          this.store.pipe(
            //select(getServerConfigParameter<string>('services.OrganizationHierarchyServiceDefinition.Endpoint')),
            //whenTruthy(),
            withLatestFrom(
              this.store.pipe(select(getBuyingContext)),
              this.store.pipe(select(getRestEndpoint)),
              this.store.pipe(select(getConfigurationState))
            ),
            map(([, buyingcontext, baseurl, configuration]) =>
              buyingcontext &&
              !req?.url.includes(BuyingContextInterceptor.matrixparam) &&
              req?.url.includes(configuration.channel)
                ? req.clone({
                    url: req.url
                      .substring(0, baseurl.length)
                      .concat(
                        ';',
                        BuyingContextInterceptor.matrixparam,
                        '=',
                        buyingcontext.bctx,
                        req.url.substring(baseurl.length)
                      ),
                  })
                : req
            ),
            first(),
            concatMap(request => next.handle(request))
          ),
          next.handle(req)
        )
      )
    );
  }
}
