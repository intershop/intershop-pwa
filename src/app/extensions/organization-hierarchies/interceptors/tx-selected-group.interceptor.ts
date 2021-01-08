import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, filter, first, map, switchMap } from 'rxjs/operators';

import { getFeatures } from 'ish-core/store/core/configuration';
import { whenTruthy } from 'ish-core/utils/operators';

import { OrganizationHierarchiesFacade } from '../facades/organization-hierarchies.facade';

@Injectable()
export class TxSelectedGroupInterceptor implements HttpInterceptor {
  constructor(private facade: OrganizationHierarchiesFacade, private store: Store) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.store.pipe(
      filter(store => store.organizationHierarchies),
      select(getFeatures),
      whenTruthy(),
      filter(features => features.includes('organizationHierarchies')),
      switchMap(() =>
        this.facade.getSelectedGroup().pipe(
          map(group =>
            group && !req?.headers.has('BuyingGroupID')
              ? req.clone({ headers: req.headers.set('BuyingGroupID', group.id) })
              : req
          ),
          first(),
          concatMap(request => next.handle(request))
        )
      )
    );
  }
}
