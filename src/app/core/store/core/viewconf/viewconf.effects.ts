import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { defer, fromEvent, iif } from 'rxjs';
import { distinctUntilChanged, map, sample } from 'rxjs/operators';

import { selectRouteData } from 'ish-core/store/core/router';
import { distinctCompareWith } from 'ish-core/utils/operators';

import { setBreadcrumbData, setStickyHeader } from './viewconf.actions';
import { getBreadcrumbData } from './viewconf.selectors';

@Injectable()
export class ViewconfEffects {
  constructor(private store: Store, private actions$: Actions, @Inject(PLATFORM_ID) private platformId: string) {}

  toggleStickyHeader$ = createEffect(() =>
    iif(
      () => isPlatformBrowser(this.platformId),
      defer(() =>
        fromEvent(window, 'scroll').pipe(
          map(() => window.pageYOffset >= 170),
          distinctUntilChanged(),
          map(sticky => setStickyHeader({ sticky }))
        )
      )
    )
  );

  retrieveBreadcrumbDataFromRouting$ = createEffect(() =>
    this.store.pipe(
      select(selectRouteData('breadcrumbData')),
      sample(this.actions$.pipe(ofType(routerNavigatedAction))),
      distinctCompareWith(this.store.pipe(select(getBreadcrumbData))),
      map(breadcrumbData => setBreadcrumbData({ breadcrumbData }))
    )
  );
}
