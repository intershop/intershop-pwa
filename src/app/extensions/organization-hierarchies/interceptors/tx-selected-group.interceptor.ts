import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, iif } from 'rxjs';
import { concatMap, first, map, withLatestFrom } from 'rxjs/operators';

import { getRestEndpoint } from 'ish-core/store/core/configuration';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';

import { getSelectedGroupDetails } from '../store/group';

@Injectable()
export class TxSelectedGroupInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  static seperator = '@';
  static matrixparam = 'bctx';

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.store.pipe(
      first(),
      concatMap((store: { organizationHierarchies: unknown }) =>
        iif(
          () => !!store.organizationHierarchies,
          this.store.pipe(
            select(getSelectedGroupDetails),
            withLatestFrom(this.store.pipe(select(getRestEndpoint)), this.store.pipe(select(getLoggedInCustomer))),
            map(([group, baseurl, customer]) =>
              group && !req?.url.includes(TxSelectedGroupInterceptor.matrixparam)
                ? req.clone({
                    url: req.url
                      .substring(0, baseurl.length)
                      .concat(
                        ';',
                        TxSelectedGroupInterceptor.matrixparam,
                        '=',
                        group.id,
                        TxSelectedGroupInterceptor.seperator,
                        customer.customerNo,
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
