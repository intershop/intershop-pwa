import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigationAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import {
  concatMap,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  switchMapTo,
  take,
  tap,
  throttleTime,
  withLatestFrom,
} from 'rxjs/operators';

import { ofPath, selectRouteParam } from 'ish-core/store/core/router';
import { mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { TactonSelfServiceApiService } from '../../services/tacton-self-service-api/tacton-self-service-api.service';
import { getTactonProductForSelectedProduct, isGroupLevelNavigationEnabled } from '../tacton-config';

import {
  changeTactonConfigurationStep,
  commitTactonConfigurationValue,
  setCurrentConfiguration,
  startConfigureTactonProduct,
} from './product-configuration.actions';
import {
  getCurrentProductConfiguration,
  getCurrentProductConfigurationStepName,
} from './product-configuration.selectors';

@Injectable()
export class ProductConfigurationEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private tactonSelfServiceApiService: TactonSelfServiceApiService,
    private router: Router
  ) {}

  startOrContinueTactonProductConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigationAction),
      ofPath(['configure/:sku/:mainStep/:groupStep', 'configure/:sku/:mainStep', 'configure/:sku']),
      switchMapTo(this.store.pipe(select(getTactonProductForSelectedProduct), whenTruthy(), take(1))),
      distinctUntilChanged(),
      map(productPath => startConfigureTactonProduct({ productPath }))
    )
  );

  startTactonProductConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startConfigureTactonProduct),
      mapToPayloadProperty('productPath'),
      switchMap(productPath =>
        this.tactonSelfServiceApiService
          .startConfiguration(productPath)
          .pipe(map(configuration => setCurrentConfiguration({ configuration })))
      )
    )
  );

  selectFirstConfigurationStepIfUnset$ = createEffect(
    () =>
      this.store.pipe(
        select(getCurrentProductConfiguration),
        whenTruthy(),
        withLatestFrom(
          this.store.pipe(select(selectRouteParam('mainStep'))),
          this.store.pipe(select(selectRouteParam('sku'))),
          this.store.pipe(select(isGroupLevelNavigationEnabled))
        ),
        filter(([config, param]) => !param || !config.steps.map(s => s.name).includes(param)),
        map(([config, , sku, groupLevelNavigation]) => {
          const nav = ['/configure', sku, config.steps[0].name];
          if (groupLevelNavigation) {
            nav.push(config.steps[0].rootGroup.members[0].name);
          }
          return nav;
        }),
        tap(arr => {
          this.router.navigate(arr);
        })
      ),
    { dispatch: false }
  );

  switchConfigurationStepViaRouting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigationAction),
      ofPath(['configure/:sku/:mainStep/:groupStep', 'configure/:sku/:mainStep']),
      switchMapTo(
        combineLatest([
          this.store.pipe(select(getCurrentProductConfigurationStepName), whenTruthy(), take(1)),
          this.store.pipe(select(selectRouteParam('mainStep')), whenTruthy(), take(1)),
        ])
      ),
      filter(([a, b]) => a !== b),
      map(([, step]) => changeTactonConfigurationStep({ step }))
    )
  );

  switchConfigurationStep$ = createEffect(() =>
    this.actions$.pipe(
      ofType(changeTactonConfigurationStep),
      mapToPayloadProperty('step'),
      switchMap(step =>
        this.tactonSelfServiceApiService
          .changeStep(step)
          .pipe(map(configuration => setCurrentConfiguration({ configuration })))
      )
    )
  );

  commitTactonConfigurationValue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(commitTactonConfigurationValue),
      throttleTime(1000),
      mapToPayload(),
      concatMap(({ valueId, value }) =>
        this.tactonSelfServiceApiService
          .commitValue(valueId, value)
          .pipe(map(configuration => setCurrentConfiguration({ configuration })))
      )
    )
  );
}
