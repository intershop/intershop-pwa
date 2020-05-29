import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { defer, fromEvent, iif } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { selectRouteData } from 'ish-core/store/router';
import { distinctCompareWith } from 'ish-core/utils/operators';

import { SetBreadcrumbData, SetStickyHeader } from './viewconf.actions';
import { getBreadcrumbData } from './viewconf.selectors';

@Injectable()
export class ViewconfEffects {
  constructor(private store: Store, @Inject(PLATFORM_ID) private platformId: string) {}

  @Effect()
  toggleStickyHeader$ = iif(
    () => isPlatformBrowser(this.platformId),
    defer(() =>
      fromEvent(window, 'scroll').pipe(
        map(() => window.pageYOffset >= 170),
        distinctUntilChanged(),
        map(sticky => new SetStickyHeader({ sticky }))
      )
    )
  );

  @Effect()
  retrieveBreadcrumbDataFromRouting$ = this.store.pipe(
    select(selectRouteData('breadcrumbData')),
    distinctCompareWith(this.store.pipe(select(getBreadcrumbData))),
    map(breadcrumbData => new SetBreadcrumbData({ breadcrumbData }))
  );
}
