import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Actions, Effect, ROOT_EFFECTS_INIT, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { mapToData, ofRoute } from 'ngrx-router';
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, map, mapTo, startWith, switchMap, take, takeWhile } from 'rxjs/operators';

import { LARGE_BREAKPOINT_WIDTH, MEDIUM_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { distinctCompareWith } from 'ish-core/utils/operators';

import { SetBreadcrumbData, SetDeviceType, SetHeaderType, SetStickyHeader, SetWrapperClass } from './viewconf.actions';
import { getBreadcrumbData, getHeaderType, getWrapperClass } from './viewconf.selectors';

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
  setDeviceType$ = this.actions$.pipe(
    ofRoute(),
    take(1),
    takeWhile(() => isPlatformBrowser(this.platformId)),
    switchMap(() =>
      fromEvent(window, 'resize').pipe(
        // tslint:disable-next-line: deprecation
        startWith(undefined),
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
  setDeviceTypeOnServer$ = this.actions$.pipe(
    ofRoute(),
    take(1),
    takeWhile(() => isPlatformServer(this.platformId)),
    mapTo(new SetDeviceType({ deviceType: 'mobile' }))
  );

  @Effect()
  toggleStickyHeader$ = this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    takeWhile(() => isPlatformBrowser(this.platformId)),
    switchMap(() =>
      fromEvent(window, 'scroll').pipe(
        map(() => window.pageYOffset >= 170),
        distinctUntilChanged(),
        map(sticky => new SetStickyHeader({ sticky }))
      )
    )
  );

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
