import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { mapToData, ofRoute } from 'ngrx-router';
import { map } from 'rxjs/operators';

import { distinctCompareWith } from 'ish-core/utils/operators';

import { SetBreadcrumbData, SetHeaderType, SetWrapperClass } from './viewconf.actions';
import { getBreadcrumbData, getHeaderType, getWrapperClass } from './viewconf.selectors';

@Injectable()
export class ViewconfEffects {
  constructor(private actions$: Actions, private store: Store<{}>) {}

  @Effect()
  retrieveWrapperClassFromRouting$ = this.actions$.pipe(
    ofRoute(),
    mapToData('wrapperClass'),
    distinctCompareWith(this.store.pipe(select(getWrapperClass))),
    map(wrapperClass => new SetWrapperClass({ wrapperClass }))
  );

  @Effect()
  retrieveHeaderTypeFromRouting$ = this.actions$.pipe(
    ofRoute(),
    mapToData('headerType'),
    distinctCompareWith(this.store.pipe(select(getHeaderType))),
    map(headerType => new SetHeaderType({ headerType }))
  );

  @Effect()
  retrieveBreadcrumbDataFromRouting$ = this.actions$.pipe(
    ofRoute(),
    mapToData('breadcrumbData'),
    distinctCompareWith(this.store.pipe(select(getBreadcrumbData))),
    map(breadcrumbData => new SetBreadcrumbData({ breadcrumbData }))
  );
}
