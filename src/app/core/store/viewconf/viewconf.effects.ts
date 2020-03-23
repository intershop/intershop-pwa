import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Actions, Effect, ROOT_EFFECTS_INIT, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { defer, fromEvent, iif, merge } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { LARGE_BREAKPOINT_WIDTH, MEDIUM_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { selectRouteData } from 'ish-core/store/router';
import { distinctCompareWith } from 'ish-core/utils/operators';

import { SetBreadcrumbData, SetDeviceType, SetStickyHeader } from './viewconf.actions';
import { getBreadcrumbData, getHeaderType } from './viewconf.selectors';

@Injectable()
export class ViewconfEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{}>,
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(MEDIUM_BREAKPOINT_WIDTH) private mediumBreakpointWidth: number,
    @Inject(LARGE_BREAKPOINT_WIDTH) private largeBreakpointWidth: number
  ) {}

  @Effect()
  setDeviceType$ = iif(
    () => isPlatformBrowser(this.platformId),
    defer(() =>
      merge(this.actions$.pipe(ofType(ROOT_EFFECTS_INIT)), fromEvent(window, 'resize')).pipe(
        map(() => {
          if (window.innerWidth < this.mediumBreakpointWidth) {
            return 'mobile';
          } else if (window.innerWidth < this.largeBreakpointWidth) {
            return 'tablet';
          } else {
            return 'pc';
          }
        }),
        distinctCompareWith(this.store.pipe(select(getHeaderType))),
        map((deviceType: DeviceType) => new SetDeviceType({ deviceType }))
      )
    )
  );

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
