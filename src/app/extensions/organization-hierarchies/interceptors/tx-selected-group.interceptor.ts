import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, from, iif } from 'rxjs';
import { concatMap, first, map, reduce, switchMap } from 'rxjs/operators';

import { getSelectedGroupPath } from '../store/group';

@Injectable()
export class TxSelectedGroupInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.store.pipe(
      first(),
      concatMap((store: { organizationHierarchies: unknown }) =>
        iif(
          () => !!store.organizationHierarchies,
          this.store.pipe(
            select(getSelectedGroupPath),
            switchMap(groups =>
              from(groups).pipe(reduce((acc, val, index) => (index > 0 ? `${val.id},${acc}` : val.id), ''))
            ),
            map(path =>
              path?.length > 0 && !req?.headers.has('BuyingGroupID')
                ? req.clone({ headers: req.headers.set('BuyingGroupID', path) })
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
