import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { RouteNavigation, ROUTER_NAVIGATION_TYPE } from 'ngrx-router';
import { map } from 'rxjs/operators';
import { distinctCompareWith } from '../../../utils/operators';
import { CoreState } from '../core.state';
import { SetBreadcrumbKey, SetHeaderType, SetWrapperClass } from './viewconf.actions';
import { getBreadcrumbKey, getHeaderType, getWrapperClass } from './viewconf.selectors';

@Injectable()
export class ViewconfEffects {
  constructor(private actions$: Actions, private store: Store<CoreState>) {}

  @Effect()
  retrieveWrapperClassFromRouting$ = this.actions$.pipe(
    ofType<RouteNavigation>(ROUTER_NAVIGATION_TYPE),
    map(action => action.payload.data.wrapperClass),
    distinctCompareWith(this.store.pipe(select(getWrapperClass))),
    map(wrapperClass => new SetWrapperClass(wrapperClass))
  );

  @Effect()
  retrieveHeaderTypeFromRouting$ = this.actions$.pipe(
    ofType<RouteNavigation>(ROUTER_NAVIGATION_TYPE),
    map(action => action.payload.data.headerType),
    distinctCompareWith(this.store.pipe(select(getHeaderType))),
    map(headerType => new SetHeaderType(headerType))
  );

  @Effect()
  retrieveBreadcrumbKeyFromRouting$ = this.actions$.pipe(
    ofType<RouteNavigation>(ROUTER_NAVIGATION_TYPE),
    map(action => action.payload.data.breadcrumbKey),
    distinctCompareWith(this.store.pipe(select(getBreadcrumbKey))),
    map(breadcrumbKey => new SetBreadcrumbKey(breadcrumbKey))
  );
}
